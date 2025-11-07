#!/usr/bin/env python3
"""
Parse NEET PG 2023 questions from extracted text and format as TypeScript
"""

import re
import json

def parse_questions(text_file):
    """Parse questions from the extracted text"""
    
    with open(text_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # Split by question numbers
    # Pattern: "Ques No: X"
    question_blocks = re.split(r'Ques No: (\d+)', content)
    
    # Skip the first block (before first question)
    for i in range(1, len(question_blocks), 2):
        if i + 1 >= len(question_blocks):
            break
            
        q_num = question_blocks[i].strip()
        q_content = question_blocks[i + 1]
        
        try:
            # Extract subject
            subject_match = re.search(r'Subject:\s*([^\n]+)', q_content)
            subject = subject_match.group(1).strip() if subject_match else "Unknown"
            
            # Extract topic
            topic_match = re.search(r'Topic:\s*([^\n]+)', q_content)
            topic = topic_match.group(1).strip() if topic_match else "Unknown"
            
            # Extract question text (everything between Sub-Topic and O1/O2/O3/O4)
            question_match = re.search(r'Sub-Topic:.*?\n(.*?)(?=O1:)', q_content, re.DOTALL)
            question_text = question_match.group(1).strip() if question_match else ""
            
            # Clean up question text (remove PrepLadder watermarks)
            question_text = re.sub(r'\s*[rped]\s*\n', ' ', question_text)
            question_text = re.sub(r'\s*[Lad]\s*\n', ' ', question_text)
            question_text = re.sub(r'\s*[erp]\s*\n', ' ', question_text)
            question_text = re.sub(r'\s+', ' ', question_text).strip()
            
            # Extract options
            options = []
            for opt_num in range(1, 5):
                opt_pattern = rf'O{opt_num}:\s*([^\n]+(?:\n(?!O{opt_num+1}:|Ans:)[^\n]+)*)'
                opt_match = re.search(opt_pattern, q_content)
                if opt_match:
                    option_text = opt_match.group(1).strip()
                    # Clean up option text
                    option_text = re.sub(r'\s*[rped]\s*\n', ' ', option_text)
                    option_text = re.sub(r'\s*[Lad]\s*\n', ' ', option_text)
                    option_text = re.sub(r'\s*[erp]\s*\n', ' ', option_text)
                    option_text = re.sub(r'\s+', ' ', option_text).strip()
                    options.append(option_text)
            
            # Extract answer
            ans_match = re.search(r'Ans:\s*(\d+)', q_content)
            correct_answer = int(ans_match.group(1)) - 1 if ans_match else 0  # Convert to 0-indexed
            
            if question_text and len(options) == 4:
                questions.append({
                    'question_number': int(q_num),
                    'subject': subject,
                    'topic': topic,
                    'question': question_text,
                    'options': options,
                    'correct_answer': correct_answer
                })
                
        except Exception as e:
            print(f"Error parsing question {q_num}: {e}")
            continue
    
    return questions

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
        'Social and Preventive Medicine': 'preventive-medicine',
        'Community Medicine': 'preventive-medicine',
        'Medicine': 'medicine',
        'Surgery': 'surgery',
        'Obstetrics & Gynaecology': 'obgyn',
        'Obstetrics and Gynaecology': 'obgyn',
        'Obstetrics & Gynecology': 'obgyn',
        'Pediatrics': 'pediatrics',
        'Paediatrics': 'pediatrics',
        'Orthopedics': 'orthopedics',
        'Orthopaedics': 'orthopedics',
        'Ophthalmology': 'ophthalmology',
        'ENT': 'ent',
        'Anesthesiology': 'anesthesiology',
        'Anaesthesiology': 'anesthesiology',
        'Radiology': 'radiology',
        'Dermatology': 'dermatology',
        'Psychiatry': 'psychiatry',
    }
    
    return subject_map.get(subject, subject.lower().replace(' ', '-').replace('&', 'and'))

def generate_typescript_output(questions, output_file):
    """Generate TypeScript formatted questions"""
    
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
            f.write(f"    year: 2023\n")
            f.write("  }")
            
            if i < len(questions) - 1:
                f.write(",\n")
            else:
                f.write("\n")
        
        f.write("];\n")
    
    print(f"✅ Generated TypeScript output with {len(questions)} questions")

def main():
    text_file = "/Users/sanjeevmurmu/workspace/neet-pg-prep/NEET_PG_2023_extracted_text.txt"
    output_file = "/Users/sanjeevmurmu/workspace/neet-pg-prep/neet_pg_2023_questions.ts"
    json_file = "/Users/sanjeevmurmu/workspace/neet-pg-prep/neet_pg_2023_parsed.json"
    
    print("Parsing questions from text file...")
    questions = parse_questions(text_file)
    
    print(f"\n✅ Parsed {len(questions)} questions")
    
    # Print subject distribution
    subject_counts = {}
    for q in questions:
        subject_counts[q['subject']] = subject_counts.get(q['subject'], 0) + 1
    
    print("\n📊 Subject Distribution:")
    for subject, count in sorted(subject_counts.items()):
        print(f"   {subject}: {count} questions")
    
    # Save as JSON for reference
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved JSON to: {json_file}")
    
    # Generate TypeScript output
    generate_typescript_output(questions, output_file)
    print(f"✅ Saved TypeScript to: {output_file}")

if __name__ == "__main__":
    main()

