#!/usr/bin/env python3
import json

SUBJECT_MAPPING = {
    'anatomy': 'anatomy',
    'physiology': 'physiology',
    'biochemistry': 'biochemistry',
    'pathology': 'pathology',
    'pharmacology': 'pharmacology',
    'medicine': 'medicine',
    'surgery': 'surgery',
    'ophthalmology': 'ophthalmology',
    'ent': 'ent',
    'orthopedics': 'orthopedics',
    'forensic': 'forensic-medicine',
    'general': 'medicine'
}

CHAPTER_MAPPING = {
    'anatomy': 'general-anatomy',
    'physiology': 'general-physiology',
    'biochemistry': 'metabolism',
    'pathology': 'general-pathology',
    'pharmacology': 'general-pharmacology',
    'medicine': 'general-medicine',
    'surgery': 'general-surgery',
    'ophthalmology': 'general-ophthalmology',
    'ent': 'general-ent',
    'orthopedics': 'trauma',
    'forensic': 'general-forensic',
    'general': 'clinical-cases'
}

def escape_string(s):
    """Escape strings for TypeScript"""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('$', '\\$')

def categorize_question(q):
    """Categorize a single question by subject"""
    text = (q['question'] + ' ' + ' '.join(q['options'])).lower()
    
    subject_keywords = {
        'anatomy': ['nerve', 'artery', 'muscle', 'bone', 'joint', 'vertebra', 'ligament', 'malleolus', 'tendon'],
        'physiology': ['receptor', 'membrane potential', 'channel', 'taste', 'insulin', 'glucose', 'GLUT', 'RMP', 'wakefulness', 'caffeine'],
        'pathology': ['tumor', 'carcinoma', 'lymphoma', 'biopsy', 'histology', 'TTF-1', 'BRAF', 'mutation', 'cardiomyopathy'],
        'pharmacology': ['drug', 'medication', 'vitamin B12', 'vitamin supplementation'],
        'medicine': ['ARDS', 'IL-8', 'patient presents', 'diagnosis', 'investigation', 'Wilson', 'disease'],
        'surgery': ['surgery', 'surgical', 'gastrectomy', 'operation'],
        'ophthalmology': ['eye', 'vision', 'retina', 'cataract', 'glaucoma', 'slit lamp', 'perimetry', 'nyctalopia'],
        'ent': ['ear', 'nose', 'throat', 'hearing', 'cochlear', 'nasal', 'vocal cord', 'otoscopy', 'tinnitus', 'rhinoplasty'],
        'orthopedics': ['fracture', 'joint', 'knee', 'hip', 'ACL', 'cast', 'tibial', 'femur', 'metatarsal', 'Lachman', 'amputation'],
        'forensic': ['autopsy', 'postmortem', 'poisoning', 'death', 'rigor mortis', 'MTP', 'rape', 'drowning'],
        'biochemistry': ['vitamin', 'enzyme', 'metabolism', 'galactose', 'homocystinuria']
    }
    
    for subject, keywords in subject_keywords.items():
        if any(keyword in text for keyword in keywords):
            return subject
    
    return 'general'

def convert_to_typescript():
    # Read parsed questions
    with open('parsed_questions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    questions = data['questions']
    
    # Start TypeScript file
    ts_content = '''// NEET PG 2024 Shift-1 Questions - ACTUAL Previous Year Questions
// Official NEET PG question paper with solutions
// Total Questions: {total}

import {{ Question }} from './types';

export const sampleQuestions: Question[] = [
'''.format(total=len(questions))
    
    question_id = 1
    
    # Process each question
    for q in questions:
        subject = categorize_question(q)
        subject_id = SUBJECT_MAPPING.get(subject, 'medicine')
        chapter_id = CHAPTER_MAPPING.get(subject, 'general-medicine')
        
        question_text = escape_string(q['question'])
        explanation = escape_string(q['explanation'])
        
        # Ensure we have exactly 4 options (pad if needed)
        options = q['options'][:4]  # Take first 4
        while len(options) < 4:
            options.append(f"Option {chr(65 + len(options))}")
        
        ts_content += f'''  {{
    id: "neet-pg-2024-{question_id}",
    subjectId: "{subject_id}",
    chapterId: "{chapter_id}",
    question: "{question_text}",
    options: [
      "{escape_string(options[0])}",
      "{escape_string(options[1])}",
      "{escape_string(options[2])}",
      "{escape_string(options[3])}"
    ],
    correctAnswer: {q['correct_answer']},
    explanation: "{explanation}",
    difficulty: "{q['difficulty']}",
    year: {q['year']}
  }},
'''
        question_id += 1
    
    # Close the array
    ts_content += '''];

export default sampleQuestions;
'''
    
    # Write TypeScript file - REPLACE the old sample questions
    with open('lib/data/questions.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"✅ Converted {len(questions)} NEET PG questions to TypeScript")
    print(f"✅ REPLACED lib/data/questions.ts with ONLY real NEET PG questions")
    print(f"✅ Removed all sample questions!")
    
    # Show breakdown
    subjects = {}
    for q in questions:
        subject = categorize_question(q)
        subjects[subject] = subjects.get(subject, 0) + 1
    
    print("\n📊 Real NEET PG questions by subject:")
    for subject, count in sorted(subjects.items()):
        print(f"  - {subject.capitalize()}: {count} questions")

if __name__ == "__main__":
    convert_to_typescript()

