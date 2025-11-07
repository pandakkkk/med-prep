# 📸 Image Integration Plan

## Questions with Images Found

### Ophthalmology (5 questions):
1. **Q16** - Slit lamp finding (cataract surgery)
2. **Q17** - Perimetry image
3. **Q18** - Nyctalopia (night blindness) image
4. **Q19** - Multiple images A, B, C
5. **Q20** - Eye OPD finding

### Medicine (3 questions):
6. **Q2** - Wilson's disease finding
7. **Q21** - MRI image diagnosis
8. **Q23** - MRCP image diagnosis

### Radiology/Surgery (7 questions):
9. **Q25** - Plain X-ray abdomen
10. **Q27** - Bladder stone X-ray
11. **Q49** - X-ray signs (Double ring/String/Steeple/Thumb)
12. **Q60** - Cochlear implant structure
13. **Q65** - X-ray fracture
14. **Q75** - RTA spine X-ray
15. **Q77** - Femur neck device/implant
16. **Q81** - Knee/ankle test image

### Gynecology (1 question):
17. **Q24** - MRI (T1/T2 hyperintense mass)

### ENT (3 questions):
18. **Q54** - Otoscopy finding (hearing loss)
19. **Q55** - PTA (Pure Tone Audiometry)
20. **Q56** - Nasal surgery incision mark

## Implementation Approach

### Phase 1: Create Image Directory ✅
```bash
mkdir -p public/images/questions
```

### Phase 2: Extract Images from PDF
- Extract all images systematically
- Match images to question numbers
- Save as: `/public/images/questions/q{number}.jpg`

### Phase 3: Update Questions
Add `imageUrl` field to questions:
```typescript
{
  id: "neet-pg-2024-X",
  question: "...",
  imageUrl: "/images/questions/qX.jpg", // NEW FIELD
  options: [...],
  ...
}
```

### Phase 4: Update UI Component
Modify chapter page to display images:
```tsx
{question.imageUrl && (
  <img 
    src={question.imageUrl} 
    alt="Question diagram"
    className="max-w-full rounded-lg mb-4"
  />
)}
```

## Estimated Time
- Image extraction: ~30-45 minutes (manual matching required)
- Code updates: ~15 minutes
- Testing: ~15 minutes

**Total: ~60-75 minutes**

## Benefits
✅ Questions become more clear and authentic
✅ Better exam preparation with actual images
✅ Enhanced learning experience
✅ Closer to real exam format

## Note
This is a significant enhancement that will make the portal much more comprehensive and exam-like!
