#!/usr/bin/env python3
"""
Merge 2023 questions into the existing questions.ts file
"""

def merge_questions():
    """Merge 2023 questions into questions.ts"""
    
    # Read the 2023 questions file
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/neet_pg_2023_questions_clean.ts', 'r', encoding='utf-8') as f:
        questions_2023 = f.read()
    
    # Extract just the questions array content (skip import and export lines)
    lines = questions_2023.split('\n')
    
    # Find where the array starts and ends
    start_idx = None
    end_idx = None
    
    for i, line in enumerate(lines):
        if 'export const neetPg2023Questions: Question[] = [' in line:
            start_idx = i + 1
        if line.strip() == '];' and start_idx is not None:
            end_idx = i
            break
    
    # Extract just the question objects
    questions_content = '\n'.join(lines[start_idx:end_idx])
    
    # Read the existing questions.ts file
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/questions.ts', 'r', encoding='utf-8') as f:
        existing_lines = f.readlines()
    
    # Find the line with ];
    closing_bracket_line = None
    for i, line in enumerate(existing_lines):
        if line.strip() == '];':
            closing_bracket_line = i
            break
    
    if closing_bracket_line is None:
        print("❌ Could not find closing bracket ]")
        return False
    
    # Find the last closing brace before ];
    last_brace_line = None
    for i in range(closing_bracket_line - 1, -1, -1):
        if existing_lines[i].strip().startswith('}'):
            last_brace_line = i
            break
    
    if last_brace_line is None:
        print("❌ Could not find last closing brace")
        return False
    
    # Replace the closing brace line with closing brace + comma
    if not existing_lines[last_brace_line].strip().endswith(','):
        existing_lines[last_brace_line] = existing_lines[last_brace_line].rstrip() + ',\n'
    
    # Insert the 2023 questions after the last brace
    insert_lines = [
        '  // ========================================\n',
        '  // NEET PG 2023 Questions (172 questions)\n',
        '  // ========================================\n',
    ] + [line + '\n' for line in questions_content.split('\n') if line.strip()]
    
    # Insert at the position
    new_lines = existing_lines[:last_brace_line + 1] + insert_lines + existing_lines[closing_bracket_line:]
    
    # Write back
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/questions.ts', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("✅ Successfully merged 2023 questions into questions.ts")
    print("   Total questions added: 172")
    return True

def main():
    print("Merging 2023 questions into questions.ts...")
    success = merge_questions()
    
    if success:
        # Count total questions in the merged file
        import re
        with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/questions.ts', 'r', encoding='utf-8') as f:
            content = f.read()
            # Count question IDs
            questions_2024 = len(re.findall(r'id: "neet-pg-2024-', content))
            questions_2023 = len(re.findall(r'id: "neet-pg-2023-', content))
            total = questions_2024 + questions_2023
            print(f"   2024 questions: {questions_2024}")
            print(f"   2023 questions: {questions_2023}")
            print(f"   Total questions in file: {total}")

if __name__ == "__main__":
    main()

