#!/usr/bin/env python3
"""
Clean up 2023 questions and map images to questions
"""

import json
import re

def clean_subject_name(subject):
    """Clean up OCR errors in subject names"""
    # Remove trailing single letters/characters (OCR artifacts)
    subject = re.sub(r'\s+[a-zA-Z]$', '', subject)
    subject = re.sub(r'\s+d$', '', subject)
    subject = re.sub(r'\s+L$', '', subject)
    
    # Fix typos
    corrections = {
        'Briochemistry': 'Biochemistry',
        'Mredicine': 'Medicine',
        'Prharmacology': 'Pharmacology',
        'Gynaecology & ObstetrLics': 'Obstetrics & Gynaecology',
        'Gynaecology & Obstetrics': 'Obstetrics & Gynaecology',
        'Anaesthesia': 'Anesthesiology',
        'PSM': 'Preventive Medicine',
        'Orthopaedics': 'Orthopedics',
        'Pediatrics': 'Pediatrics'
    }
    
    return corrections.get(subject.strip(), subject.strip())

def map_subject_to_id(subject):
    """Map subject names to subject IDs"""
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
    
    return subject_map.get(subject, subject.lower().replace(' ', '-').replace('&', 'and'))

# Map of pages with images to approximate question numbers
# Based on: ~2-3 questions per page typically
IMAGE_TO_QUESTION_MAP = {
    5: [12],   # Page 5 has image, around Q12
    6: [13],   # Page 6
    7: [16],   # Page 7
    8: [17],   # Page 8
    9: [19],   # Page 9
    10: [21],  # Page 10
    11: [23],  # Page 11
    18: [37, 38],  # Page 18 has 2 images
    20: [42],  # Page 20
    21: [44],  # Page 21
    22: [46],  # Page 22
    24: [50],  # Page 24
    25: [52],  # Page 25
    26: [54],  # Page 26
    28: [58],  # Page 28
    29: [60],  # Page 29
    31: [64],  # Page 31
    33: [68],  # Page 33
    34: [70],  # Page 34
    35: [72],  # Page 35
    37: [76],  # Page 37
    38: [78],  # Page 38
    39: [80],  # Page 39
    41: [84],  # Page 41
    44: [90],  # Page 44
    45: [92],  # Page 45
    46: [94],  # Page 46
    48: [98],  # Page 48
    50: [102], # Page 50
    52: [106], # Page 52
    53: [108], # Page 53
    55: [112], # Page 55
    58: [118], # Page 58
    59: [120], # Page 59
    63: [128], # Page 63
    68: [138], # Page 68
    70: [142], # Page 70
    73: [148], # Page 73
    75: [152], # Page 75
    78: [158], # Page 78
    81: [164], # Page 81
    84: [170], # Page 84
    85: [172], # Page 85
    89: [180], # Page 89
    90: [182], # Page 90
    91: [184], # Page 91
    92: [186], # Page 92
    95: [192], # Page 95
    96: [194], # Page 96
    98: [198, 199], # Page 98 has 2 images
    99: [200], # Page 99
    101: [204], # Page 101
    105: [212], # Page 105
    106: [214], # Page 106
    107: [216], # Page 107
}

def add_images_to_questions(questions):
    """Add imageUrl to questions based on mapping"""
    
    # Create a reverse map from question number to image
    question_to_image = {}
    for page, q_nums in IMAGE_TO_QUESTION_MAP.items():
        # Count how many images on this page
        images_on_page = []
        
        # Find all images for this page
        import os
        image_dir = "/Users/sanjeevmurmu/workspace/neet-pg-prep/public/images/questions/2023"
        for filename in sorted(os.listdir(image_dir)):
            if filename.startswith(f"page{page}_"):
                images_on_page.append(filename)
        
        # Map images to questions
        for i, q_num in enumerate(q_nums):
            if i < len(images_on_page):
                question_to_image[q_num] = f"/images/questions/2023/{images_on_page[i]}"
    
    # Add images to questions
    for q in questions:
        q_num = q['question_number']
        if q_num in question_to_image:
            q['imageUrl'] = question_to_image[q_num]
    
    return questions

def generate_clean_typescript(questions, output_file):
    """Generate clean TypeScript output"""
    
    # Clean subject names
    for q in questions:
        q['subject'] = clean_subject_name(q['subject'])
    
    # Add images
    questions = add_images_to_questions(questions)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("// NEET PG 2023 Questions - Previous Year Questions\n")
        f.write("// Total Questions: {}\n\n".format(len(questions)))
        f.write("import { Question } from './types';\n\n")
        f.write("export const neetPg2023Questions: Question[] = [\n")
        
        for i, q in enumerate(questions):
            subject_id = map_subject_to_id(q['subject'])
            
            f.write("  {\n")
            f.write(f"    id: \"neet-pg-2023-{q['question_number']}\",\n")
            f.write(f"    subjectId: \"{subject_id}\",\n")
            f.write(f"    chapterId: \"neet-pg-2023\",\n")
            
            # Escape quotes in question text
            question_text = q['question'].replace('"', '\\"').replace('\n', '\\n')
            f.write(f"    question: \"{question_text}\",\n")
            
            # Write options
            f.write("    options: [\n")
            for option in q['options']:
                option_text = option.replace('"', '\\"').replace('\n', '\\n')
                f.write(f"      \"{option_text}\",\n")
            f.write("    ],\n")
            
            f.write(f"    correctAnswer: {q['correct_answer']},\n")
            f.write(f"    explanation: \"✅ ANSWER: **{q['options'][q['correct_answer']]}**\\n\\n🔬 Detailed explanation to be added.\",\n")
            f.write(f"    difficulty: \"medium\",\n")
            
            # Add imageUrl if present
            if 'imageUrl' in q:
                f.write(f"    imageUrl: \"{q['imageUrl']}\",\n")
            
            f.write(f"    year: 2023\n")
            f.write("  }")
            
            if i < len(questions) - 1:
                f.write(",\n")
            else:
                f.write("\n")
        
        f.write("];\n")
    
    # Print statistics
    subject_counts = {}
    image_count = 0
    for q in questions:
        subject_counts[q['subject']] = subject_counts.get(q['subject'], 0) + 1
        if 'imageUrl' in q:
            image_count += 1
    
    print(f"\n✅ Generated clean TypeScript output with {len(questions)} questions")
    print(f"   Questions with images: {image_count}")
    print("\n📊 Clean Subject Distribution:")
    for subject, count in sorted(subject_counts.items()):
        print(f"   {subject}: {count} questions")

def main():
    json_file = "/Users/sanjeevmurmu/workspace/neet-pg-prep/neet_pg_2023_parsed.json"
    output_file = "/Users/sanjeevmurmu/workspace/neet-pg-prep/neet_pg_2023_questions_clean.ts"
    
    # Load questions
    with open(json_file, 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f"Processing {len(questions)} questions...")
    
    # Generate clean output
    generate_clean_typescript(questions, output_file)
    
    print(f"\n✅ Saved clean TypeScript to: {output_file}")

if __name__ == "__main__":
    main()

