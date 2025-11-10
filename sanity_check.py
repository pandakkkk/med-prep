#!/usr/bin/env python3
"""
Comprehensive sanity check for questions.ts file
"""

import re
import json

def check_questions_file(file_path):
    """Comprehensive sanity check"""
    print(f"Reading {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    line_num = 0
    
    # Split by lines to track line numbers
    lines = content.split('\n')
    
    for i, line in enumerate(lines, 1):
        # Check questions
        if 'question:' in line:
            # Check for questions starting with unwanted characters
            if re.search(r'question:\s*"[pPrRdDeE]\s+', line):
                issues.append({
                    'line': i,
                    'type': 'question_start_error',
                    'issue': 'Question starts with unwanted character (p/P/r/d/e)',
                    'content': line.strip()[:100]
                })
            
            # Check for trailing corrupted patterns
            if re.search(r'\s+[rReEPpd]\s+[rReEPpd]', line) or re.search(r'\s+[rReEPpd]\s*"[,]', line):
                if not re.search(r'\s+(?:is|are|was|were|the|a|an|this|that|which|what|who|where|when|why|how)\s+[rReEPpd]', line):
                    # Skip if it's a legitimate word
                    if re.search(r'\s+r\s+[eEP]|r\s+e\s+d|e\s+r\s+P', line):
                        issues.append({
                            'line': i,
                            'type': 'question_trailing_error',
                            'issue': 'Question has trailing corrupted text pattern',
                            'content': line.strip()[:150]
                        })
            
            # Check for incomplete questions
            if re.search(r'question:\s*"[^"]{0,10}"', line):
                issues.append({
                    'line': i,
                    'type': 'question_too_short',
                    'issue': 'Question appears too short or incomplete',
                    'content': line.strip()[:100]
                })
        
        # Check options
        if re.match(r'^\s+"[^"]*"', line) and 'options:' not in lines[i-2] if i > 1 else False:
            option_text = re.search(r'"([^"]*)"', line)
            if option_text:
                opt = option_text.group(1)
                
                # Check for merged options
                if re.search(r'OP[0-9]:|O\s*[0-9]:|O[0-9]:', opt):
                    issues.append({
                        'line': i,
                        'type': 'merged_option',
                        'issue': 'Option contains merged option pattern (OP2:, O3:, etc.)',
                        'content': line.strip()[:150]
                    })
                
                # Check for incomplete options
                if len(opt) < 3:
                    issues.append({
                        'line': i,
                        'type': 'option_too_short',
                        'issue': 'Option appears too short',
                        'content': line.strip()[:100]
                    })
                
                # Check for common typos in options
                typos = ['techniquee', 'techniqueee', 'carcinom[^a]', 'adenom[^a]', 'hamartom[^a]']
                for typo in typos:
                    if re.search(typo, opt, re.IGNORECASE):
                        issues.append({
                            'line': i,
                            'type': 'option_typo',
                            'issue': f'Option contains typo pattern: {typo}',
                            'content': line.strip()[:150]
                        })
    
    # Check for merged options in the file
    merged_options = re.findall(r'"([^"]*OP[0-9]:[^"]*)"', content)
    if merged_options:
        for opt in merged_options[:5]:  # Show first 5
            issues.append({
                'line': 'multiple',
                'type': 'merged_option',
                'issue': 'Merged option found',
                'content': opt[:150]
            })
    
    # Summary statistics
    total_questions = len(re.findall(r'question:\s*"', content))
    total_options = len(re.findall(r'^\s+"[^"]*"', content, re.MULTILINE))
    
    print(f"\n📊 SUMMARY:")
    print(f"   Total questions: {total_questions}")
    print(f"   Total options: {total_options}")
    print(f"   Issues found: {len(issues)}\n")
    
    if issues:
        print("❌ ISSUES FOUND:\n")
        # Group by type
        by_type = {}
        for issue in issues:
            issue_type = issue['type']
            if issue_type not in by_type:
                by_type[issue_type] = []
            by_type[issue_type].append(issue)
        
        for issue_type, type_issues in by_type.items():
            print(f"   {issue_type.upper()} ({len(type_issues)}):")
            for issue in type_issues[:10]:  # Show first 10 of each type
                print(f"      Line {issue['line']}: {issue['issue']}")
                print(f"         {issue['content']}")
                print()
            if len(type_issues) > 10:
                print(f"      ... and {len(type_issues) - 10} more\n")
    else:
        print("✅ No issues found! All questions and options look good!\n")
    
    return issues

if __name__ == '__main__':
    check_questions_file('lib/data/questions.ts')

