/**
 * NLP Entity Extractor - Extracts medical entities from unstructured text.
 * Uses regex-based extraction for offline use; can be swapped for LLM-based extraction.
 */

export interface ExtractedEntities {
  symptoms: string[];
  vitals: {
    systolic?: number;
    diastolic?: number;
    heartRate?: number;
    temperature?: number;
    spo2?: number;
    weight?: number;
    respiratoryRate?: number;
  };
  diagnoses: string[];
  medications: string[];
  examFindings: string[];
  chiefComplaint?: string;
  duration?: string;
}

// Blood pressure patterns: 140/90, BP 140/90, bp: 140/90
const BP_REGEX = /\b(?:bp|blood\s*pressure)[:\s]*(\d{2,3})\s*[\/\\]\s*(\d{2,3})/i;
const BP_BARE_REGEX = /\b(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mm\s*hg|mmhg)?/i;

// Heart rate: HR 72, pulse 72, heart rate 72 bpm
const HR_REGEX = /\b(?:hr|heart\s*rate|pulse)[:\s]*(\d{2,3})\s*(?:bpm|\/min)?/i;

// Temperature: temp 98.6, temperature 101 F, fever 102
const TEMP_REGEX = /\b(?:temp(?:erature)?|fever)[:\s]*(\d{2,3}(?:\.\d)?)\s*(?:°?\s*[fFcC])?/i;

// SpO2: spo2 98%, oxygen 95%
const SPO2_REGEX = /\b(?:spo2|sp\s*o2|oxygen\s*sat(?:uration)?|o2\s*sat)[:\s]*(\d{2,3})\s*%?/i;

// Weight: 70 kg, weight 70
const WEIGHT_REGEX = /\b(?:weight|wt)[:\s]*(\d{2,3}(?:\.\d)?)\s*(?:kg|lbs?)?/i;

// Respiratory rate
const RR_REGEX = /\b(?:rr|resp(?:iratory)?\s*rate)[:\s]*(\d{1,2})\s*(?:\/min)?/i;

// Common symptoms list
const SYMPTOM_KEYWORDS = [
  "fever", "cough", "cold", "headache", "body ache", "bodyache", "fatigue",
  "nausea", "vomiting", "diarrhea", "diarrhoea", "constipation", "chest pain",
  "shortness of breath", "breathlessness", "dizziness", "palpitations",
  "sore throat", "runny nose", "congestion", "abdominal pain", "stomach pain",
  "back pain", "joint pain", "muscle pain", "weakness", "weight loss",
  "weight gain", "loss of appetite", "rash", "itching", "swelling",
  "burning urination", "frequent urination", "blood in urine", "blood in stool",
  "blurred vision", "anxiety", "insomnia", "depression",
];

// Duration patterns: "for 3 days", "since 2 weeks", "x 5 days"
const DURATION_REGEX = /(?:for|since|x|from|past|last)\s*(\d+\s*(?:day|week|month|year|hr|hour)s?)/i;

// Common diagnosis markers
const DX_MARKERS = /\b(?:dx|diagnosis|diagnosed|impression|assessment)[:\s]*(.*?)(?:\.|,|;|$)/gi;

// Medication patterns: Rx paracetamol, prescribed amoxicillin, tab. xyz
const MED_MARKERS = /\b(?:rx|prescribed?|tab\.?|cap\.?|syp?\.?|inj\.?|medication)[:\s]*([\w\s-]+?)(?:\d|,|;|\.|$)/gi;

// Exam findings
const EXAM_MARKERS = /\b(?:exam(?:ination)?|o\/e|on examination|findings?)[:\s]*(.*?)(?:\.|;|$)/gi;

export function extractEntities(text: string): ExtractedEntities {
  const lower = text.toLowerCase();
  const result: ExtractedEntities = {
    symptoms: [],
    vitals: {},
    diagnoses: [],
    medications: [],
    examFindings: [],
  };

  // Extract vitals
  const bp = BP_REGEX.exec(text) || BP_BARE_REGEX.exec(text);
  if (bp) {
    result.vitals.systolic = parseInt(bp[1]);
    result.vitals.diastolic = parseInt(bp[2]);
  }

  const hr = HR_REGEX.exec(text);
  if (hr) result.vitals.heartRate = parseInt(hr[1]);

  const temp = TEMP_REGEX.exec(text);
  if (temp) result.vitals.temperature = parseFloat(temp[1]);

  const spo2 = SPO2_REGEX.exec(text);
  if (spo2) result.vitals.spo2 = parseInt(spo2[1]);

  const wt = WEIGHT_REGEX.exec(text);
  if (wt) result.vitals.weight = parseFloat(wt[1]);

  const rr = RR_REGEX.exec(text);
  if (rr) result.vitals.respiratoryRate = parseInt(rr[1]);

  // Extract symptoms
  for (const symptom of SYMPTOM_KEYWORDS) {
    if (lower.includes(symptom)) {
      result.symptoms.push(symptom);
    }
  }

  // Duration
  const durMatch = DURATION_REGEX.exec(text);
  if (durMatch) result.duration = durMatch[1].trim();

  // Chief complaint = first sentence or symptoms summary
  if (result.symptoms.length > 0) {
    result.chiefComplaint = result.symptoms.join(", ");
    if (result.duration) {
      result.chiefComplaint += ` for ${result.duration}`;
    }
  }

  // Diagnoses
  let dxMatch;
  while ((dxMatch = DX_MARKERS.exec(text)) !== null) {
    const dx = dxMatch[1].trim();
    if (dx.length > 2) result.diagnoses.push(dx);
  }
  // Also look for common inline diagnoses
  const inlineDx = [
    "viral urti", "urti", "lrti", "pneumonia", "bronchitis", "gastritis",
    "uti", "hypertension", "diabetes", "asthma", "migraine", "dengue",
    "malaria", "typhoid", "covid", "pharyngitis", "tonsillitis",
  ];
  for (const dx of inlineDx) {
    if (lower.includes(dx) && !result.diagnoses.some((d) => d.toLowerCase().includes(dx))) {
      result.diagnoses.push(dx.toUpperCase());
    }
  }

  // Medications
  let medMatch;
  while ((medMatch = MED_MARKERS.exec(text)) !== null) {
    const med = medMatch[1].trim();
    if (med.length > 2) result.medications.push(med);
  }
  // Common medications inline
  const commonMeds = [
    "paracetamol", "amoxicillin", "azithromycin", "ibuprofen", "cetirizine",
    "pantoprazole", "omeprazole", "metformin", "amlodipine", "atorvastatin",
    "dolo", "crocin", "augmentin", "ceftriaxone", "doxycycline",
  ];
  for (const med of commonMeds) {
    if (lower.includes(med) && !result.medications.some((m) => m.toLowerCase().includes(med))) {
      result.medications.push(med);
    }
  }

  // Exam findings
  let examMatch;
  while ((examMatch = EXAM_MARKERS.exec(text)) !== null) {
    const finding = examMatch[1].trim();
    if (finding.length > 2) result.examFindings.push(finding);
  }
  // "exam normal" shorthand
  if (/\bexam\s+normal\b/i.test(text) && result.examFindings.length === 0) {
    result.examFindings.push("Normal examination");
  }

  return result;
}
