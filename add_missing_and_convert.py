#!/usr/bin/env python3
import json

# Read the parsed questions
with open('parsed_questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

questions = data['questions']

# Manually add missing question 48
q48 = {
    'number': 48,
    'question': 'In the given X-ray, which of the following signs is seen:',
    'options': [
        'Double ring sign',
        'String sign',
        'Steeple sign',
        'Thumb sign'
    ],
    'correct_answer': 0,
    'explanation': 'The double ring sign is characteristic of a condition such as intussusception, where one segment of the bowel telescopes into another. This sign is visible on X-ray as a concentric ring of soft tissue with a central radiolucent area.\n\n💡 Quick Tip: The double ring sign is a classic X-ray finding in intussusception, indicating the telescoping of bowel segments.',
    'year': 2024,
    'difficulty': 'medium'
}

# Manually add missing question 68
q68 = {
    'number': 68,
    'question': 'What is the most likely diagnosis for the lesion shown here?',
    'options': [
        'Sunburst pattern - Osteosarcoma',
        'Codman triangle',
        'Soap bubble appearance',
        'Onion peel appearance'
    ],
    'correct_answer': 0,
    'explanation': 'The "sunburst" appearance is characteristic of certain bone tumors, particularly osteosarcoma. The radiographic appearance shows spiculated or radiating bone formation, which resembles a sunburst pattern.\n\n💡 Quick Tip: The sunburst pattern is often seen in aggressive bone tumors like osteosarcoma and is a key diagnostic feature on radiographs.',
    'year': 2024,
    'difficulty': 'medium'
}

# Add missing questions
questions.append(q48)
questions.append(q68)

# Sort by number
questions.sort(key=lambda x: x['number'])

print(f"✅ Total questions: {len(questions)}")

# Save updated JSON
data['questions'] = questions
data['total_questions'] = len(questions)

with open('parsed_questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✅ Added missing questions and saved to parsed_questions.json")

