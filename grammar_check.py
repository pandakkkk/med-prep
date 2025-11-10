#!/usr/bin/env python3
"""
Comprehensive grammar and spelling check for questions.ts
"""

import re
from collections import defaultdict

def check_and_fix_grammar(file_path):
    """Check and fix grammar/spelling issues"""
    print(f"Reading {file_path}...\n")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = defaultdict(list)
    
    # 1. Common spelling mistakes (medical and general)
    spelling_fixes = {
        # Medical terms
        'Investigrations': 'Investigations',
        'investigrations': 'investigations',
        'examinration': 'examination',
        'vaccinration': 'vaccination',
        'ejaculration': 'ejaculation',
        'utilizration': 'utilization',
        'sensration': 'sensation',
        'elevration': 'elevation',
        'gestration': 'gestation',
        'imPmunizration': 'immunization',
        'andesponse': 'and response',
        'andeview': 'and review',
        'thpe': 'the',
        'folleowing': 'following',
        'dischargre': 'discharge',
        'aefractory': 'refractory',
        
        # Incomplete words
        'tumou"': 'tumor"',
        'diseas"': 'disease"',
        'pneumoni"': 'pneumonia"',
        'nerv"': 'nerve"',
        'techniqu"': 'technique"',
        'syndrom"': 'syndrome"',
        'hemorrhag"': 'hemorrhage"',
        'adenom"': 'adenoma"',
        'carcinom"': 'carcinoma"',
        'hamartom"': 'hamartoma"',
        'chancroi"': 'chancroid"',
        'homicid"': 'homicide"',
        
        # Spacing issues in words
        'th e ': 'the ',
        ' ein ': ' in ',
        's een': 'seen',
        'r7': '7',
        'combinationsr': 'combinations',
        'rWhat': 'What',
        'multipler': 'multiple',
        'umrbilical': 'umbilical',
        'frargility': 'fragility',
        'afrom': 'from',
        
        # Double letter typos
        'carcinomaa': 'carcinoma',
        'mrelanoma': 'melanoma',
        'techniqueee': 'technique',
        'techniquee': 'technique',
    }
    
    for wrong, correct in spelling_fixes.items():
        if wrong in content:
            count = content.count(wrong)
            content = content.replace(wrong, correct)
            fixes_applied['Spelling'].append(f'{wrong} → {correct} ({count}x)')
    
    # 2. Fix spacing issues with capital letters (e.g., "O xytocin" -> "Oxytocin")
    spacing_patterns = [
        (r'\b([A-Z])\s+([a-z])', r'\1\2'),  # "O xytocin" -> "Oxytocin"
        (r'\b([A-Z])\s+([A-Z][a-z])', r'\1\2'),  # "V Pacuum" -> "VPacuum"
    ]
    
    for pattern, replacement in spacing_patterns:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            fixes_applied['Spacing'].append(f'Fixed spacing: {len(matches)} instances')
    
    # 3. Remove extra spaces
    # Multiple spaces to single space
    multi_space_count = len(re.findall(r'  +', content))
    if multi_space_count > 0:
        content = re.sub(r'  +', ' ', content)
        fixes_applied['Spacing'].append(f'Removed multiple spaces: {multi_space_count}x')
    
    # 4. Fix questions starting with unwanted characters
    unwanted_starts = re.findall(r'question:\s*"([pPrRdDeE])\s+', content)
    if unwanted_starts:
        content = re.sub(r'question:\s*"[pPrRdDeE]\s+', 'question: "', content)
        fixes_applied['Question Format'].append(f'Removed leading chars: {len(unwanted_starts)}x')
    
    # 5. Remove trailing corrupted patterns
    trailing_patterns = [
        (r'\s+[rR]\s+[eEP]\s+[rR]\s+[eE]\s+[dD]\s+[dD]\s+[aA]\s+[lL]\s+[pP]\s*"', '"'),
        (r'\s+[eE]\s+[rR]\s+[Pp]\s+[rR]\s+[eE]\s+[dD]\s+[dD]\s+[aA]\s+[lL]\s+[pP]\s*"', '"'),
        (r'\s+[rR]\s+[eE]\s+[dD]\s+[dD]\s+[aA]\s+[lL]\s+[pP]?\s*"', '"'),
        (r'\s+[rR]\s+[eE]\s+[dD]\s+[dD]?\s*"', '"'),
        (r'\s+[rR]\s+[eE]\s+[dD]\s*"', '"'),
        (r'\s+[pP]\s*"', '"'),
        (r'\s+[dD]\s*"', '"'),
        (r'\s+[aA]\s*"', '"'),
    ]
    
    for pattern, replacement in trailing_patterns:
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            fixes_applied['Trailing Text'].append(f'Removed pattern: {len(matches)}x')
    
    # 6. Check for "are d not" -> "are not"
    if ' d not ' in content or ' d no' in content:
        content = content.replace(' d not ', ' not ')
        content = content.replace(' d no', ' no')
        fixes_applied['Grammar'].append('Fixed "d not" -> "not"')
    
    # Write back if changes were made
    if content != original_content:
        print(f"Writing fixed content to {file_path}...\n")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("="*60)
        print("✅ FIXES APPLIED:\n")
        for category, fixes in fixes_applied.items():
            print(f"{category}:")
            for fix in fixes[:10]:  # Show first 10 per category
                print(f"  - {fix}")
            if len(fixes) > 10:
                print(f"  ... and {len(fixes) - 10} more")
            print()
        
        total_fixes = sum(len(fixes) for fixes in fixes_applied.values())
        print(f"Total fix categories: {len(fixes_applied)}")
        print(f"Total individual fixes: {total_fixes}")
    else:
        print("✅ No grammar or spelling issues found!")
    
    return content

if __name__ == '__main__':
    check_and_fix_grammar('lib/data/questions.ts')

