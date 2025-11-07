"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, BookOpen, Heart } from "lucide-react";

interface Topic {
  name: string;
  subtopics?: string[];
}

interface Subject {
  name: string;
  icon: string;
  color: string;
  topics: Topic[];
}

interface Section {
  title: string;
  description: string;
  subjects: Subject[];
}

const syllabusData: Section[] = [
  {
    title: "Pre-Clinical Subjects",
    description: "Foundation subjects covering basic medical sciences",
    subjects: [
      {
        name: "Anatomy",
        icon: "🫀",
        color: "from-red-500 to-pink-500",
        topics: [
          { name: "Upper Limb", subtopics: ["Shoulder", "Arm", "Forearm", "Hand", "Joints", "Nerves & Vessels"] },
          { name: "Lower Limb", subtopics: ["Hip", "Thigh", "Leg", "Foot", "Joints", "Nerves & Vessels"] },
          { name: "Thorax", subtopics: ["Chest Wall", "Lungs", "Heart", "Mediastinum", "Diaphragm"] },
          { name: "Abdomen & Pelvis", subtopics: ["Abdominal Wall", "GI Tract", "Liver & Biliary", "Urinary System", "Reproductive System"] },
          { name: "Head & Neck", subtopics: ["Skull", "Brain", "Cranial Nerves", "Face", "Neck", "Eye", "Ear"] },
          { name: "Neuroanatomy", subtopics: ["Cerebrum", "Cerebellum", "Brainstem", "Spinal Cord", "Pathways", "Cranial Nerves"] },
          { name: "Embryology", subtopics: ["Gametogenesis", "Fertilization", "Development", "Congenital Anomalies"] },
          { name: "Histology", subtopics: ["Epithelium", "Connective Tissue", "Muscle", "Nervous Tissue", "Organs"] }
        ]
      },
      {
        name: "Physiology",
        icon: "⚡",
        color: "from-yellow-500 to-orange-500",
        topics: [
          { name: "General Physiology", subtopics: ["Cell Physiology", "Membrane Potential", "Transport", "Homeostasis"] },
          { name: "Nerve & Muscle", subtopics: ["Action Potential", "Synaptic Transmission", "Neuromuscular Junction", "Muscle Contraction"] },
          { name: "Blood", subtopics: ["RBC", "WBC", "Platelets", "Hemostasis", "Blood Groups", "Anemia"] },
          { name: "Cardiovascular System", subtopics: ["Cardiac Cycle", "ECG", "Blood Pressure", "Circulation", "Heart Sounds"] },
          { name: "Respiratory System", subtopics: ["Mechanics of Breathing", "Lung Volumes", "Gas Exchange", "Oxygen Transport", "Respiratory Regulation"] },
          { name: "GI Physiology", subtopics: ["Digestion", "Absorption", "Secretions", "Motility", "Liver Functions"] },
          { name: "Renal Physiology", subtopics: ["GFR", "Tubular Functions", "Urine Formation", "Acid-Base Balance", "Fluid Balance"] },
          { name: "Endocrine System", subtopics: ["Pituitary", "Thyroid", "Adrenal", "Pancreas", "Reproductive Hormones"] },
          { name: "Central Nervous System", subtopics: ["Sensory Systems", "Motor Systems", "Autonomic NS", "Higher Functions", "EEG"] },
          { name: "Reproductive Physiology", subtopics: ["Menstrual Cycle", "Pregnancy", "Lactation", "Male Reproductive"] }
        ]
      },
      {
        name: "Biochemistry",
        icon: "🧬",
        color: "from-green-500 to-teal-500",
        topics: [
          { name: "Proteins & Amino Acids", subtopics: ["Structure", "Classification", "Metabolism", "Nitrogen Balance"] },
          { name: "Enzymes", subtopics: ["Classification", "Kinetics", "Inhibition", "Regulation", "Clinical Enzymology"] },
          { name: "Carbohydrates", subtopics: ["Classification", "Glycolysis", "TCA Cycle", "Gluconeogenesis", "Glycogen Metabolism"] },
          { name: "Lipids", subtopics: ["Fatty Acids", "Lipoproteins", "Cholesterol", "Ketone Bodies", "Lipid Metabolism"] },
          { name: "Nucleic Acids", subtopics: ["DNA Structure", "RNA", "Replication", "Transcription", "Translation"] },
          { name: "Metabolism", subtopics: ["Bioenergetics", "ETC", "Oxidative Phosphorylation", "Metabolic Integration"] },
          { name: "Vitamins & Minerals", subtopics: ["Fat-Soluble Vitamins", "Water-Soluble Vitamins", "Minerals", "Deficiency Disorders"] },
          { name: "Hormones", subtopics: ["Hormone Action", "Signal Transduction", "Hormone Metabolism"] },
          { name: "Molecular Biology", subtopics: ["Gene Expression", "Regulation", "Mutations", "DNA Technology"] },
          { name: "Clinical Biochemistry", subtopics: ["Acid-Base", "Electrolytes", "Liver Function", "Kidney Function", "Enzymes"] }
        ]
      }
    ]
  },
  {
    title: "Para-Clinical Subjects",
    description: "Supporting sciences essential for clinical practice",
    subjects: [
      {
        name: "Pathology",
        icon: "🔬",
        color: "from-purple-500 to-indigo-500",
        topics: [
          { name: "General Pathology", subtopics: ["Cell Injury", "Adaptation", "Necrosis", "Apoptosis", "Intracellular Accumulations"] },
          { name: "Inflammation & Repair", subtopics: ["Acute Inflammation", "Chronic Inflammation", "Wound Healing", "Regeneration"] },
          { name: "Hemodynamic Disorders", subtopics: ["Edema", "Hyperemia", "Hemorrhage", "Thrombosis", "Embolism", "Infarction", "Shock"] },
          { name: "Neoplasia", subtopics: ["Benign vs Malignant", "Carcinogenesis", "Tumor Markers", "Paraneoplastic Syndromes"] },
          { name: "Immunopathology", subtopics: ["Hypersensitivity", "Autoimmunity", "Immunodeficiency", "Transplant Rejection"] },
          { name: "Infectious Diseases", subtopics: ["Bacterial", "Viral", "Fungal", "Parasitic Infections"] },
          { name: "Systemic Pathology", subtopics: ["CVS", "Respiratory", "GI", "Hepatobiliary", "Urinary", "Endocrine", "CNS"] },
          { name: "Hematopathology", subtopics: ["Anemia", "Leukemia", "Lymphoma", "Bleeding Disorders", "Bone Marrow"] }
        ]
      },
      {
        name: "Pharmacology",
        icon: "💊",
        color: "from-blue-500 to-cyan-500",
        topics: [
          { name: "General Pharmacology", subtopics: ["Pharmacokinetics", "Pharmacodynamics", "Drug Interactions", "Adverse Effects"] },
          { name: "Autonomic Nervous System", subtopics: ["Cholinergics", "Anticholinergics", "Adrenergics", "Antiadrenergics"] },
          { name: "CNS Drugs", subtopics: ["Sedatives", "Hypnotics", "Antiepileptics", "Antipsychotics", "Antidepressants", "Anxiolytics"] },
          { name: "Cardiovascular Drugs", subtopics: ["Antihypertensives", "Diuretics", "Antianginal", "Antiarrhythmics", "Heart Failure Drugs"] },
          { name: "Respiratory Drugs", subtopics: ["Bronchodilators", "Antiasthmatics", "Antitussives", "Expectorants"] },
          { name: "GI Drugs", subtopics: ["Antiulcer", "Antiemetics", "Laxatives", "Antidiarrheals"] },
          { name: "Antibiotics", subtopics: ["Penicillins", "Cephalosporins", "Aminoglycosides", "Macrolides", "Fluoroquinolones", "Antitubercular"] },
          { name: "Chemotherapy", subtopics: ["Anticancer Drugs", "Immunosuppressants", "Biological Agents"] },
          { name: "Anti-inflammatory Drugs", subtopics: ["NSAIDs", "Corticosteroids", "DMARDs", "Antigout"] },
          { name: "Endocrine Drugs", subtopics: ["Insulin", "Oral Hypoglycemics", "Thyroid Drugs", "Corticosteroids"] }
        ]
      },
      {
        name: "Microbiology",
        icon: "🦠",
        color: "from-emerald-500 to-green-500",
        topics: [
          { name: "General Microbiology", subtopics: ["Sterilization", "Disinfection", "Culture Media", "Staining"] },
          { name: "Bacteriology", subtopics: ["Gram Positive Cocci", "Gram Negative Cocci", "Gram Positive Bacilli", "Gram Negative Bacilli", "Anaerobes", "Mycobacteria"] },
          { name: "Virology", subtopics: ["DNA Viruses", "RNA Viruses", "HIV", "Hepatitis Viruses", "Arboviruses"] },
          { name: "Mycology", subtopics: ["Superficial Mycoses", "Subcutaneous Mycoses", "Systemic Mycoses", "Opportunistic Fungi"] },
          { name: "Parasitology", subtopics: ["Protozoa", "Helminths", "Ectoparasites", "Vector-Borne Diseases"] },
          { name: "Immunology", subtopics: ["Innate Immunity", "Adaptive Immunity", "Complement", "Cytokines", "Vaccines"] },
          { name: "Clinical Microbiology", subtopics: ["Diagnostic Tests", "Antibiotic Sensitivity", "Infection Control"] }
        ]
      },
      {
        name: "Forensic Medicine",
        icon: "⚖️",
        color: "from-gray-600 to-gray-500",
        topics: [
          { name: "Thanatology", subtopics: ["Death", "Postmortem Changes", "Time of Death", "Autopsy"] },
          { name: "Mechanical Injuries", subtopics: ["Abrasion", "Contusion", "Laceration", "Fractures", "Firearm Injuries"] },
          { name: "Asphyxia", subtopics: ["Hanging", "Strangulation", "Suffocation", "Drowning"] },
          { name: "Toxicology", subtopics: ["Poisons", "Pesticides", "Alcohol", "Drug Abuse", "Corrosives"] },
          { name: "Medico-Legal Aspects", subtopics: ["Medical Negligence", "Consent", "Medical Certificates", "Legal Procedures"] },
          { name: "Sexual Offences", subtopics: ["Rape", "Sexual Assault", "Virginity", "Pregnancy"] },
          { name: "Identification", subtopics: ["Personal Identification", "Fingerprints", "DNA Profiling"] }
        ]
      },
      {
        name: "Preventive & Social Medicine",
        icon: "🏥",
        color: "from-teal-500 to-cyan-500",
        topics: [
          { name: "Epidemiology", subtopics: ["Study Designs", "Screening", "Disease Surveillance", "Outbreak Investigation"] },
          { name: "Biostatistics", subtopics: ["Data Types", "Measures of Central Tendency", "Hypothesis Testing", "Statistical Tests"] },
          { name: "Communicable Diseases", subtopics: ["Immunization", "Vector-Borne Diseases", "Water-Borne Diseases", "STDs"] },
          { name: "Non-Communicable Diseases", subtopics: ["CVD", "Diabetes", "Cancer", "Mental Health"] },
          { name: "Nutrition", subtopics: ["Nutritional Deficiencies", "PEM", "Obesity", "Food Fortification"] },
          { name: "Environmental Health", subtopics: ["Water", "Air", "Housing", "Waste Disposal"] },
          { name: "Occupational Health", subtopics: ["Occupational Diseases", "Industrial Toxicology", "Ergonomics"] },
          { name: "Health Programs", subtopics: ["RCH", "NRHM", "Disease Control Programs", "National Health Policy"] }
        ]
      }
    ]
  },
  {
    title: "Clinical Subjects",
    description: "Core clinical specialties for patient care",
    subjects: [
      {
        name: "General Medicine",
        icon: "🏥",
        color: "from-indigo-500 to-blue-500",
        topics: [
          { name: "Cardiology", subtopics: ["IHD", "Heart Failure", "Arrhythmias", "Valvular Heart Disease", "Hypertension"] },
          { name: "Pulmonology", subtopics: ["Asthma", "COPD", "Pneumonia", "Tuberculosis", "Interstitial Lung Disease", "Lung Cancer"] },
          { name: "Gastroenterology", subtopics: ["PUD", "IBD", "Liver Diseases", "Pancreatitis", "GI Bleeding"] },
          { name: "Nephrology", subtopics: ["AKI", "CKD", "Glomerulonephritis", "UTI", "Renal Stones", "Dialysis"] },
          { name: "Endocrinology", subtopics: ["Diabetes Mellitus", "Thyroid Disorders", "Pituitary Disorders", "Adrenal Disorders"] },
          { name: "Hematology", subtopics: ["Anemia", "Leukemia", "Lymphoma", "Bleeding Disorders", "Blood Transfusion"] },
          { name: "Infectious Diseases", subtopics: ["Fever", "Sepsis", "HIV/AIDS", "Viral Hepatitis", "Tropical Diseases"] },
          { name: "Rheumatology", subtopics: ["RA", "SLE", "Gout", "Osteoarthritis", "Vasculitis"] },
          { name: "Neurology", subtopics: ["Stroke", "Epilepsy", "Movement Disorders", "Neuropathy", "Meningitis", "Encephalitis"] },
          { name: "Emergency Medicine", subtopics: ["Shock", "Cardiac Arrest", "Poisoning", "Acute Abdomen"] }
        ]
      },
      {
        name: "General Surgery",
        icon: "🔪",
        color: "from-orange-500 to-red-500",
        topics: [
          { name: "GI Surgery", subtopics: ["Appendicitis", "Hernia", "Intestinal Obstruction", "GI Perforation", "GI Malignancies"] },
          { name: "Hepatobiliary Surgery", subtopics: ["Cholelithiasis", "Cholecystitis", "Jaundice", "Liver Abscess", "Portal Hypertension"] },
          { name: "Breast Surgery", subtopics: ["Breast Cancer", "Fibroadenoma", "Mastitis", "Gynecomastia"] },
          { name: "Endocrine Surgery", subtopics: ["Thyroid Disorders", "Parathyroid", "Adrenal Tumors"] },
          { name: "Vascular Surgery", subtopics: ["Varicose Veins", "DVT", "Peripheral Arterial Disease", "Aneurysms"] },
          { name: "Urology", subtopics: ["Urinary Stones", "BPH", "Prostate Cancer", "Bladder Cancer", "UTI"] },
          { name: "Trauma Surgery", subtopics: ["Head Injury", "Chest Injury", "Abdominal Trauma", "Fractures"] },
          { name: "Burns & Plastic Surgery", subtopics: ["Burns", "Wound Healing", "Skin Grafts", "Flaps"] }
        ]
      },
      {
        name: "Obstetrics & Gynecology",
        icon: "👶",
        color: "from-pink-500 to-rose-500",
        topics: [
          { name: "Obstetrics", subtopics: ["Antenatal Care", "Normal Labor", "High-Risk Pregnancy", "Complications of Pregnancy", "Postpartum Care"] },
          { name: "Gynecology", subtopics: ["Menstrual Disorders", "Infertility", "Contraception", "Uterine Fibroids", "Ovarian Cysts"] },
          { name: "Gynecological Oncology", subtopics: ["Cervical Cancer", "Ovarian Cancer", "Endometrial Cancer", "Vulvar Cancer"] },
          { name: "Reproductive Endocrinology", subtopics: ["PCOS", "Menopause", "Hormone Replacement", "ART"] },
          { name: "Urogynaecology", subtopics: ["Pelvic Organ Prolapse", "Urinary Incontinence", "Fistulas"] }
        ]
      },
      {
        name: "Pediatrics",
        icon: "👶",
        color: "from-yellow-500 to-amber-500",
        topics: [
          { name: "Neonatology", subtopics: ["Neonatal Resuscitation", "Prematurity", "Birth Asphyxia", "Neonatal Jaundice", "Neonatal Sepsis"] },
          { name: "Growth & Development", subtopics: ["Normal Growth", "Developmental Milestones", "Failure to Thrive", "Malnutrition"] },
          { name: "Pediatric Infections", subtopics: ["Immunization", "Diarrhea", "Pneumonia", "Meningitis", "Tuberculosis"] },
          { name: "Pediatric Hematology", subtopics: ["Anemia", "Leukemia", "Bleeding Disorders", "Thalassemia"] },
          { name: "Pediatric Cardiology", subtopics: ["Congenital Heart Disease", "Rheumatic Fever", "Kawasaki Disease"] },
          { name: "Pediatric Neurology", subtopics: ["Seizures", "Cerebral Palsy", "Meningitis", "Developmental Disorders"] },
          { name: "Pediatric Gastroenterology", subtopics: ["Diarrhea", "Malabsorption", "GI Bleeding", "Liver Diseases"] }
        ]
      },
      {
        name: "Orthopedics",
        icon: "🦴",
        color: "from-stone-500 to-amber-600",
        topics: [
          { name: "Trauma", subtopics: ["Fractures", "Dislocations", "Spinal Injuries", "Pelvic Injuries", "Polytrauma"] },
          { name: "Bone & Joint Infections", subtopics: ["Osteomyelitis", "Septic Arthritis", "Tuberculosis of Bone"] },
          { name: "Degenerative Disorders", subtopics: ["Osteoarthritis", "Osteoporosis", "Spondylosis"] },
          { name: "Pediatric Orthopedics", subtopics: ["DDH", "CTEV", "Rickets", "Cerebral Palsy", "Poliomyelitis"] },
          { name: "Bone Tumors", subtopics: ["Benign Tumors", "Malignant Tumors", "Metastatic Bone Disease"] },
          { name: "Spine Disorders", subtopics: ["Disc Prolapse", "Scoliosis", "Spinal Stenosis", "Spinal TB"] },
          { name: "Sports Medicine", subtopics: ["Sports Injuries", "Ligament Injuries", "Meniscal Injuries"] }
        ]
      },
      {
        name: "Ophthalmology",
        icon: "👁️",
        color: "from-sky-500 to-blue-500",
        topics: [
          { name: "Refraction & Optics", subtopics: ["Myopia", "Hypermetropia", "Astigmatism", "Presbyopia"] },
          { name: "Lid & Lacrimal Disorders", subtopics: ["Stye", "Chalazion", "Blepharitis", "Dacryocystitis"] },
          { name: "Conjunctiva & Cornea", subtopics: ["Conjunctivitis", "Keratitis", "Corneal Ulcer", "Trachoma"] },
          { name: "Uvea", subtopics: ["Uveitis", "Iridocyclitis", "Sympathetic Ophthalmia"] },
          { name: "Lens", subtopics: ["Cataract", "Subluxation", "Dislocation"] },
          { name: "Glaucoma", subtopics: ["POAG", "PACG", "Secondary Glaucoma", "Congenital Glaucoma"] },
          { name: "Retina & Vitreous", subtopics: ["Diabetic Retinopathy", "Retinal Detachment", "ARMD", "Retinitis Pigmentosa"] },
          { name: "Neuro-ophthalmology", subtopics: ["Optic Neuritis", "Papilledema", "Ocular Palsies"] }
        ]
      },
      {
        name: "ENT",
        icon: "👂",
        color: "from-violet-500 to-purple-500",
        topics: [
          { name: "Ear", subtopics: ["Otitis Media", "CSOM", "Otosclerosis", "Meniere's Disease", "BPPV", "Hearing Loss"] },
          { name: "Nose & PNS", subtopics: ["Rhinitis", "Sinusitis", "DNS", "Nasal Polyps", "Epistaxis"] },
          { name: "Pharynx", subtopics: ["Tonsillitis", "Pharyngitis", "Adenoids", "Sleep Apnea"] },
          { name: "Larynx", subtopics: ["Laryngitis", "Vocal Cord Paralysis", "Laryngeal Tumors", "Hoarseness"] },
          { name: "Salivary Glands", subtopics: ["Sialadenitis", "Salivary Calculi", "Tumors"] },
          { name: "Head & Neck Tumors", subtopics: ["Oral Cancer", "Laryngeal Cancer", "Thyroid Tumors", "Lymphomas"] }
        ]
      },
      {
        name: "Anesthesiology",
        icon: "💉",
        color: "from-red-500 to-pink-500",
        topics: [
          { name: "General Anesthesia", subtopics: ["Induction", "Maintenance", "Recovery", "Complications"] },
          { name: "Regional Anesthesia", subtopics: ["Spinal", "Epidural", "Nerve Blocks", "Local Anesthetics"] },
          { name: "Preoperative Assessment", subtopics: ["ASA Classification", "Risk Assessment", "Pre-anesthetic Medication"] },
          { name: "Airway Management", subtopics: ["Intubation", "Difficult Airway", "Ventilation"] },
          { name: "Pain Management", subtopics: ["Acute Pain", "Chronic Pain", "Analgesics", "Opioids"] },
          { name: "Critical Care", subtopics: ["ICU Care", "Ventilator Management", "Sepsis", "Shock"] }
        ]
      },
      {
        name: "Radiology",
        icon: "📸",
        color: "from-gray-500 to-slate-500",
        topics: [
          { name: "Imaging Techniques", subtopics: ["X-ray", "CT Scan", "MRI", "Ultrasound", "Nuclear Medicine"] },
          { name: "Chest Radiology", subtopics: ["Chest X-ray", "Lung Pathology", "Mediastinal Masses"] },
          { name: "Abdominal Radiology", subtopics: ["GI Imaging", "Hepatobiliary", "Urinary System"] },
          { name: "Musculoskeletal Radiology", subtopics: ["Fractures", "Joint Diseases", "Bone Tumors"] },
          { name: "Neuroradiology", subtopics: ["Brain Imaging", "Spinal Imaging", "Stroke", "Tumors"] },
          { name: "Interventional Radiology", subtopics: ["Angiography", "Embolization", "Drainage Procedures"] }
        ]
      },
      {
        name: "Dermatology",
        icon: "🩺",
        color: "from-amber-500 to-orange-500",
        topics: [
          { name: "Infections", subtopics: ["Bacterial", "Viral", "Fungal", "Parasitic Skin Infections"] },
          { name: "Inflammatory Dermatoses", subtopics: ["Psoriasis", "Eczema", "Lichen Planus", "Urticaria"] },
          { name: "Autoimmune Disorders", subtopics: ["Pemphigus", "Lupus", "Dermatomyositis", "Vitiligo"] },
          { name: "Sexually Transmitted Infections", subtopics: ["Syphilis", "Gonorrhea", "Herpes", "HIV"] },
          { name: "Skin Tumors", subtopics: ["Benign Tumors", "Premalignant", "Melanoma", "Non-Melanoma Cancers"] },
          { name: "Hair & Nail Disorders", subtopics: ["Alopecia", "Hirsutism", "Nail Diseases"] }
        ]
      },
      {
        name: "Psychiatry",
        icon: "🧠",
        color: "from-purple-500 to-pink-500",
        topics: [
          { name: "Psychotic Disorders", subtopics: ["Schizophrenia", "Delusional Disorders", "Acute Psychosis"] },
          { name: "Mood Disorders", subtopics: ["Depression", "Bipolar Disorder", "Dysthymia"] },
          { name: "Anxiety Disorders", subtopics: ["GAD", "Panic Disorder", "Phobias", "OCD", "PTSD"] },
          { name: "Substance Use Disorders", subtopics: ["Alcohol", "Opioids", "Cannabis", "Stimulants", "Withdrawal"] },
          { name: "Childhood Disorders", subtopics: ["ADHD", "Autism", "Conduct Disorder", "Learning Disabilities"] },
          { name: "Organic Mental Disorders", subtopics: ["Delirium", "Dementia", "Amnesia"] },
          { name: "Psychopharmacology", subtopics: ["Antipsychotics", "Antidepressants", "Mood Stabilizers", "Anxiolytics"] }
        ]
      }
    ]
  }
];

export default function SyllabusPage() {
  const [expandedSubjects, setExpandedSubjects] = useState<{ [key: string]: boolean }>({});
  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => ({ ...prev, [subjectName]: !prev[subjectName] }));
  };

  const toggleTopic = (topicKey: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-10 h-10 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NEET PG Syllabus
          </h1>
          <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
        <p className="text-lg text-gray-600">
          Complete syllabus covering all 19 subjects for NEET PG 2024
        </p>
        <p className="text-sm text-pink-600 mt-2 font-medium">
          Organized with love for your preparation, Preeti 💖
        </p>
      </div>

      {/* Sections */}
      {syllabusData.map((section, sectionIdx) => (
        <div key={sectionIdx} className="mb-12">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{section.title}</h2>
            <p className="text-gray-600">{section.description}</p>
          </div>

          {/* Subjects in Section */}
          <div className="space-y-4">
            {section.subjects.map((subject, subjectIdx) => (
              <Card
                key={subjectIdx}
                className="border-2 border-gray-200 hover:border-purple-300 transition-all"
              >
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-all"
                  onClick={() => toggleSubject(`${sectionIdx}-${subject.name}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl bg-gradient-to-r ${subject.color} w-14 h-14 rounded-lg flex items-center justify-center shadow-md`}>
                        {subject.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                        <CardDescription>{subject.topics.length} major topics</CardDescription>
                      </div>
                    </div>
                    <div>
                      {expandedSubjects[`${sectionIdx}-${subject.name}`] ? (
                        <ChevronDown className="w-6 h-6 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedSubjects[`${sectionIdx}-${subject.name}`] && (
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {subject.topics.map((topic, topicIdx) => (
                        <div
                          key={topicIdx}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between p-3 bg-gradient-to-r from-white to-purple-50 hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all"
                            onClick={() =>
                              topic.subtopics &&
                              toggleTopic(`${sectionIdx}-${subject.name}-${topicIdx}`)
                            }
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${subject.color}`} />
                              <span className="font-medium text-gray-800">{topic.name}</span>
                              {topic.subtopics && (
                                <span className="text-xs text-gray-500">
                                  ({topic.subtopics.length} subtopics)
                                </span>
                              )}
                            </div>
                            {topic.subtopics && (
                              <div>
                                {expandedTopics[`${sectionIdx}-${subject.name}-${topicIdx}`] ? (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                            )}
                          </div>

                          {topic.subtopics &&
                            expandedTopics[`${sectionIdx}-${subject.name}-${topicIdx}`] && (
                              <div className="p-4 bg-white border-t border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {topic.subtopics.map((subtopic, subIdx) => (
                                    <div
                                      key={subIdx}
                                      className="flex items-center gap-2 text-sm text-gray-700 p-2 hover:bg-purple-50 rounded transition-colors"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                      {subtopic}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Footer Message */}
      <div className="mt-12 text-center p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 rounded-xl border-2 border-pink-200">
        <p className="text-lg font-medium text-gray-800 mb-2">
          📚 Complete syllabus at your fingertips!
        </p>
        <p className="text-sm text-gray-600">
          Click on any subject to explore topics, and click topics to see detailed subtopics.
        </p>
        <p className="text-sm text-pink-600 mt-3 font-semibold">
          Every topic covered with love for your success, Preeti! 💖✨
        </p>
      </div>
    </div>
  );
}

