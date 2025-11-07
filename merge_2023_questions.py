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
        existing_content = f.read()
    
    # Find where to insert (before the closing ];)
    # Find the last occurrence of '};' followed by '];'
    insert_position = existing_content.rfind('};\n\n// Helper functions')
    
    if insert_position == -1:
        # Try alternative pattern
        insert_position = existing_content.rfind('}\n];\n\n// Helper functions')
    
    if insert_position == -1:
        print("❌ Could not find insertion point")
        return False
    
    # Move to after the closing }
    insert_position = existing_content.find('}', insert_position) + 1
    
    # Insert the 2023 questions
    new_content = (
        existing_content[:insert_position] +
        ',\n  // NEET PG 2023 Questions (172 questions)\n' +
        questions_content +
        existing_content[insert_position:]
    )
    
    # Write back
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/questions.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Successfully merged 2023 questions into questions.ts")
    print("   Total questions added: 172")
    return True

def main():
    print("Merging 2023 questions into questions.ts...")
    success = merge_questions()
    
    if success:
        # Count total questions in the merged file
        with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/questions.ts', 'r', encoding='utf-8') as f:
            content = f.read()
            # Count question IDs
            import re
            questions = re.findall(r'id: "neet-pg-', content)
            print(f"   Total questions in file: {len(questions)}")

if __name__ == "__main__":
    main()

