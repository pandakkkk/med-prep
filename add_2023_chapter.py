#!/usr/bin/env python3
"""
Add NEET PG 2023 chapter to all subjects in subjects.ts
"""

import json
import re

# Count questions per subject from the parsed JSON
def count_questions_by_subject():
    """Count how many 2023 questions belong to each subject"""
    
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/neet_pg_2023_parsed.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    subject_counts = {}
    
    # Map of cleaned subject names to subject IDs
    subject_map = {
        'Anatomy': 'anatomy',
        'Physiology': 'physiology',
        'Biochemistry': 'biochemistry',
        'Pathology': 'pathology',
        'Pharmacology': 'pharmacology',
        'Microbiology': 'microbiology',
        'Forensic Medicine': 'forensic-medicine',
        'Preventive Medicine': 'preventive-medicine',
        'Medicine': 'medicine',
        'Surgery': 'surgery',
        'Obstetrics & Gynaecology': 'obgyn',
        'Pediatrics': 'pediatrics',
        'Orthopedics': 'orthopedics',
        'Ophthalmology': 'ophthalmology',
        'ENT': 'ent',
        'Anesthesiology': 'anesthesiology',
        'Radiology': 'radiology',
        'Dermatology': 'dermatology',
        'Psychiatry': 'psychiatry',
    }
    
    def clean_subject_name(subject):
        """Clean up OCR errors in subject names"""
        subject = re.sub(r'\s+[a-zA-Z]$', '', subject)
        subject = re.sub(r'\s+d$', '', subject)
        subject = re.sub(r'\s+L$', '', subject)
        
        corrections = {
            'Briochemistry': 'Biochemistry',
            'Mredicine': 'Medicine',
            'Prharmacology': 'Pharmacology',
            'Gynaecology & ObstetrLics': 'Obstetrics & Gynaecology',
            'Gynaecology & Obstetrics': 'Obstetrics & Gynaecology',
            'Anaesthesia': 'Anesthesiology',
            'PSM': 'Preventive Medicine',
            'Orthopaedics': 'Orthopedics',
        }
        
        return corrections.get(subject.strip(), subject.strip())
    
    # Count questions per subject
    for q in questions:
        clean_subject = clean_subject_name(q['subject'])
        subject_id = subject_map.get(clean_subject, clean_subject.lower().replace(' ', '-'))
        subject_counts[subject_id] = subject_counts.get(subject_id, 0) + 1
    
    return subject_counts

def add_2023_chapter_to_subjects():
    """Add NEET PG 2023 chapter to subjects.ts"""
    
    # Get question counts
    counts = count_questions_by_subject()
    
    print("📊 Question counts per subject:")
    for subject_id, count in sorted(counts.items()):
        print(f"   {subject_id}: {count} questions")
    
    # Read subjects.ts
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/subjects.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # For each subject, add the 2023 chapter after the 2024 chapter
    # Find pattern: { id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: X },
    # Replace with same line + new 2023 line
    
    subjects_to_add = list(counts.keys())
    
    for subject_id in subjects_to_add:
        question_count = counts[subject_id]
        
        # Pattern to find the 2024 chapter line for this subject
        # We need to find the subject block first, then add after 2024 chapter
        
        # Find the subject block
        subject_pattern = rf'id: "{subject_id}",'
        subject_match = re.search(subject_pattern, content)
        
        if not subject_match:
            print(f"⚠️  Subject {subject_id} not found in subjects.ts")
            continue
        
        # Find the 2024 chapter line after this subject
        start_pos = subject_match.end()
        chapter_2024_pattern = r'(\{ id: "neet-pg-2024", name: "🎯 NEET PG 2024", totalQuestions: \d+ \},)'
        
        # Search for 2024 chapter after the subject definition
        chapter_match = re.search(chapter_2024_pattern, content[start_pos:])
        
        if chapter_match:
            # Calculate actual position in full content
            match_start = start_pos + chapter_match.start()
            match_end = start_pos + chapter_match.end()
            
            # Check if 2023 chapter already exists
            next_100_chars = content[match_end:match_end+100]
            if 'neet-pg-2023' in next_100_chars:
                print(f"✓  {subject_id}: 2023 chapter already exists")
                continue
            
            # Insert new 2023 chapter line after 2024 chapter
            new_chapter_line = f'\n      {{ id: "neet-pg-2023", name: "🎯 NEET PG 2023", totalQuestions: {question_count} }},'
            
            content = content[:match_end] + new_chapter_line + content[match_end:]
            print(f"✅ {subject_id}: Added 2023 chapter with {question_count} questions")
        else:
            print(f"⚠️  Could not find 2024 chapter for {subject_id}")
    
    # Write back
    with open('/Users/sanjeevmurmu/workspace/neet-pg-prep/lib/data/subjects.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\n✅ Successfully updated subjects.ts with NEET PG 2023 chapters!")

def main():
    print("Adding NEET PG 2023 chapter to all subjects...\n")
    add_2023_chapter_to_subjects()

if __name__ == "__main__":
    main()

