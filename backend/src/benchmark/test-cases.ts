// ============================================
// VaaniX Benchmark Test Cases
// ============================================

export type BenchmarkLanguage =
  | "Tamil"
  | "Telugu"
  | "Kannada"
  | "Malayalam"
  | "Hindi"
  | "English";

export interface BenchmarkTestCase {
  id: string;
  language: BenchmarkLanguage;
  text: string;
  expectedLanguageCode: string;
  codeSwitch: boolean;
}

export const benchmarkTestCases: BenchmarkTestCase[] = [

  // ==========================================
  // TAMIL
  // ==========================================

  {
    id: "ta-001",
    language: "Tamil",
    text: "வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-002",
    language: "Tamil",
    text: "என் பெயர் ஆதித்யா.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-003",
    language: "Tamil",
    text: "இன்று வானிலை மிகவும் நன்றாக இருக்கிறது.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-004",
    language: "Tamil",
    text: "நான் கணினி அறிவியல் படிக்கிறேன்.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-005",
    language: "Tamil",
    text: "இந்த திட்டம் செயற்கை நுண்ணறிவை பயன்படுத்துகிறது.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-006",
    language: "Tamil",
    text: "நாளை காலை எட்டு மணிக்கு சந்திப்போம்.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-007",
    language: "Tamil",
    text: "எனக்கு ஒரு காபி வேண்டும்.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-008",
    language: "Tamil",
    text: "நான் பெங்களூரில் உள்ள பல்கலைக்கழகத்தில் படிக்கிறேன்.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-009",
    language: "Tamil",
    text: "இந்த கேள்விக்கு நீங்கள் பதில் சொல்ல முடியுமா?",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },

  {
    id: "ta-010",
    language: "Tamil",
    text: "மிக்க நன்றி, உங்களை மீண்டும் சந்திக்கிறேன்.",
    expectedLanguageCode: "ta",
    codeSwitch: false,
  },


  // ==========================================
  // TELUGU
  // ==========================================

  {
    id: "te-001",
    language: "Telugu",
    text: "నమస్కారం, మీరు ఎలా ఉన్నారు?",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-002",
    language: "Telugu",
    text: "నా పేరు ఆదిత్య.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-003",
    language: "Telugu",
    text: "ఈ రోజు వాతావరణం చాలా బాగుంది.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-004",
    language: "Telugu",
    text: "నేను కంప్యూటర్ సైన్స్ చదువుతున్నాను.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-005",
    language: "Telugu",
    text: "ఈ ప్రాజెక్ట్ కృత్రిమ మేధస్సును ఉపయోగిస్తుంది.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-006",
    language: "Telugu",
    text: "రేపు ఉదయం ఎనిమిది గంటలకు కలుద్దాం.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-007",
    language: "Telugu",
    text: "నాకు ఒక కాఫీ కావాలి.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-008",
    language: "Telugu",
    text: "నేను బెంగళూరులోని ఒక విశ్వవిద్యాలయంలో చదువుతున్నాను.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-009",
    language: "Telugu",
    text: "ఈ ప్రశ్నకు మీరు సమాధానం చెప్పగలరా?",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },

  {
    id: "te-010",
    language: "Telugu",
    text: "చాలా ధన్యవాదాలు, మిమ్మల్ని మళ్లీ కలుస్తాను.",
    expectedLanguageCode: "te",
    codeSwitch: false,
  },


  // ==========================================
  // KANNADA
  // ==========================================

  {
    id: "kn-001",
    language: "Kannada",
    text: "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-002",
    language: "Kannada",
    text: "ನನ್ನ ಹೆಸರು ಆದಿತ್ಯ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-003",
    language: "Kannada",
    text: "ಇಂದು ಹವಾಮಾನ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-004",
    language: "Kannada",
    text: "ನಾನು ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ ಓದುತ್ತಿದ್ದೇನೆ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-005",
    language: "Kannada",
    text: "ಈ ಯೋಜನೆಯು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆಯನ್ನು ಬಳಸುತ್ತದೆ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-006",
    language: "Kannada",
    text: "ನಾಳೆ ಬೆಳಿಗ್ಗೆ ಎಂಟು ಗಂಟೆಗೆ ಭೇಟಿಯಾಗೋಣ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-007",
    language: "Kannada",
    text: "ನನಗೆ ಒಂದು ಕಾಫಿ ಬೇಕು.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-008",
    language: "Kannada",
    text: "ನಾನು ಬೆಂಗಳೂರಿನ ವಿಶ್ವವಿದ್ಯಾಲಯದಲ್ಲಿ ಓದುತ್ತಿದ್ದೇನೆ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-009",
    language: "Kannada",
    text: "ಈ ಪ್ರಶ್ನೆಗೆ ನೀವು ಉತ್ತರಿಸಬಹುದೇ?",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },

  {
    id: "kn-010",
    language: "Kannada",
    text: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು, ಮತ್ತೆ ಭೇಟಿಯಾಗೋಣ.",
    expectedLanguageCode: "kn",
    codeSwitch: false,
  },


  // ==========================================
  // MALAYALAM
  // ==========================================

  {
    id: "ml-001",
    language: "Malayalam",
    text: "നമസ്കാരം, നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-002",
    language: "Malayalam",
    text: "എന്റെ പേര് ആദിത്യ.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-003",
    language: "Malayalam",
    text: "ഇന്ന് കാലാവസ്ഥ വളരെ നല്ലതാണ്.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-004",
    language: "Malayalam",
    text: "ഞാൻ കമ്പ്യൂട്ടർ സയൻസ് പഠിക്കുകയാണ്.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-005",
    language: "Malayalam",
    text: "ഈ പദ്ധതി കൃത്രിമ ബുദ്ധി ഉപയോഗിക്കുന്നു.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-006",
    language: "Malayalam",
    text: "നാളെ രാവിലെ എട്ട് മണിക്ക് കാണാം.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-007",
    language: "Malayalam",
    text: "എനിക്ക് ഒരു കാപ്പി വേണം.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-008",
    language: "Malayalam",
    text: "ഞാൻ ബംഗളൂരുവിലെ ഒരു സർവകലാശാലയിൽ പഠിക്കുന്നു.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-009",
    language: "Malayalam",
    text: "ഈ ചോദ്യത്തിന് നിങ്ങൾക്ക് ഉത്തരം പറയാമോ?",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },

  {
    id: "ml-010",
    language: "Malayalam",
    text: "വളരെ നന്ദി, വീണ്ടും കാണാം.",
    expectedLanguageCode: "ml",
    codeSwitch: false,
  },


  // ==========================================
  // HINDI
  // ==========================================

  {
    id: "hi-001",
    language: "Hindi",
    text: "नमस्ते, आप कैसे हैं?",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-002",
    language: "Hindi",
    text: "मेरा नाम आदित्य है।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-003",
    language: "Hindi",
    text: "आज मौसम बहुत अच्छा है।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-004",
    language: "Hindi",
    text: "मैं कंप्यूटर साइंस पढ़ रहा हूँ।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-005",
    language: "Hindi",
    text: "यह परियोजना कृत्रिम बुद्धिमत्ता का उपयोग करती है।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-006",
    language: "Hindi",
    text: "कल सुबह आठ बजे मिलते हैं।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-007",
    language: "Hindi",
    text: "मुझे एक कॉफी चाहिए।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-008",
    language: "Hindi",
    text: "मैं बेंगलुरु की एक यूनिवर्सिटी में पढ़ता हूँ।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-009",
    language: "Hindi",
    text: "क्या आप इस सवाल का जवाब दे सकते हैं?",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },

  {
    id: "hi-010",
    language: "Hindi",
    text: "बहुत धन्यवाद, फिर मिलते हैं।",
    expectedLanguageCode: "hi",
    codeSwitch: false,
  },


  // ==========================================
  // ENGLISH
  // ==========================================

  {
    id: "en-001",
    language: "English",
    text: "Hello, how are you today?",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-002",
    language: "English",
    text: "My name is Adithya.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-003",
    language: "English",
    text: "The weather is very nice today.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-004",
    language: "English",
    text: "I am studying computer science.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-005",
    language: "English",
    text: "This project uses artificial intelligence.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-006",
    language: "English",
    text: "Let's meet tomorrow morning at eight.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-007",
    language: "English",
    text: "I would like a cup of coffee.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-008",
    language: "English",
    text: "I study at a university in Bangalore.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-009",
    language: "English",
    text: "Can you answer this question?",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },

  {
    id: "en-010",
    language: "English",
    text: "Thank you very much, see you again.",
    expectedLanguageCode: "en",
    codeSwitch: false,
  },
];