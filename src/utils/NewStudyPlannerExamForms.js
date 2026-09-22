const computeDobEligibility = (
  maxAge,
  asOfDate = new Date(),
  cutoffMonth = 6,
  cutoffDay = 1
) => {
  const year = asOfDate.getFullYear();

  const min = new Date(year - maxAge, cutoffMonth, cutoffDay);

  const max = asOfDate;

  const toISODate = (d) => d.toISOString().split("T")[0];

  return {
    minDate: toISODate(min),
    maxDate: toISODate(max),
    cutoffDate: toISODate(max),
  };
};
const vitEligibility = computeDobEligibility(22);
const todaycutoffDate = new Date().toISOString().split("T")[0];
const computeNdaDobEligibility = (
  cutoffYear = new Date().getFullYear(),
  cutoffMonth = 5, // June (0-based index, so 5 = June)
  cutoffDay = 16
) => {
  const cutoffDate = new Date(cutoffYear, cutoffMonth, cutoffDay);

  // 19.5 years ago from cutoff date
  const minDob = new Date(cutoffDate);
  minDob.setFullYear(minDob.getFullYear() - 19);
  minDob.setMonth(minDob.getMonth() - 6);

  // 16.5 years ago from cutoff date
  const maxDob = new Date(cutoffDate);
  maxDob.setFullYear(maxDob.getFullYear() - 16);
  maxDob.setMonth(maxDob.getMonth() - 6);

  const toISODate = (d) => d.toISOString().split("T")[0];

  return {
    minDate: toISODate(minDob), // Earliest DOB allowed (older limit)
    maxDate: toISODate(maxDob), // Latest DOB allowed (younger limit)
    cutoffDate: toISODate(cutoffDate),
  };
};

const ndaEligibility = computeNdaDobEligibility();

export const JEE_MAINS_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "introduction",
    introductionLine1:
      "We know you’re aiming for success in JEE Mains, and we’re here to make sure you’re fully equipped to reach your goals! Our personalized approach helps you build a strong foundation, ensuring you’re ready to take on every challenge that comes your way.",
    introductionLine2:
      "We believe in your potential, and we’re here to help you get the best score possible!",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What's your name?",
    label: "Please enter your full name as per academic records",
    answerType: "text",
    response:
      "Your journey towards success starts now, [name]! We’re thrilled to be part of your path to achieving great things.",
    errorMessage: "Please provide a response before continuing.",
    additional_info: "",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What's your gender?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Third Gender", value: "Third Gender" },
    ],
    responses: {
      Male: "Thanks for sharing your details, [name]. Your trust is important to us. Let’s get you one step closer to your goal!",
      Female:
        "Thanks for sharing your details, [name]. Your trust is important to us. We’re here to help you succeed every step of the way!",
      "Third Gender":
        "Thanks for sharing your details, [name]. Your trust is important to us. Together, we’ll make this journey one to remember!",
    },
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "caste",
    question: "What's your caste/category?",
    label:
      "Because fee is decided by your caste and category for various categories and centers in India and outside India.",
    answerType: "dropdown",
    options: [
      { label: "General", value: "General" },
      { label: "EWS/OBC (NCL)", value: "EWS/OBC (NCL)" },
      { label: "SC/ST", value: "SC/ST" },
      { label: "Third Gender", value: "Third Gender" },
      { label: "PWD", value: "PWD" },
    ],
    responses: {
      General:
        "Thanks for sharing your details, [name]. You're on the right track—let’s aim high and get you the best preparation possible!",
      "EWS/OBC (NCL)":
        "Thanks for sharing your details, [name]. You’re in good hands—let’s get you prepared for success with all the resources you need.",
      "SC/ST":
        "Thanks for sharing your details, [name]. You’ve got this! We’ll provide all the support you need to succeed in your exam journey.",
      "Third Gender":
        "Thanks for sharing your details, [name]. We value your trust, and we're committed to making your journey as smooth and successful as possible.",
      PWD: "Thanks for sharing your details, [name]. We’re here to support you every step of the way, with tailored assistance and the resources you need for success",
    },
    errorMessage: "Please select a category before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "exam_center_location",
    question: "Will you opt for the exam center in India or outside India?",
    label: "To determine the fee of the candidate",
    answerType: "dropdown",
    options: [
      { label: "India", value: "India" },
      { label: "Outside India", value: "Outside India" },
    ],
    responses: {
      India:
        "Thanks for sharing your choice, [name]! Opting for an exam center in India means you’ll be able to focus on your preparation without worrying about travel logistics. We’re here to help you excel in your journey!",
      "Outside India":
        "Thanks for sharing your choice, [name]! Opting for an exam center outside India is an exciting opportunity. Let’s focus on your preparation and make sure you're ready for this international experience!",
    },
    errorMessage: "Please select an exam center location before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "Papers",
    question: "Select the paper(s) you will be appearing for in JEE Mains?",
    label: "Please select the paper(s) you will be appearing for in JEE Mains.",
    answerType: "dropdown",
    options: [
      { label: "B.E / B.Tech", value: "B.E / B.Tech" },
      { label: "B.Arch", value: "B.Arch" },
      { label: "B.Planning", value: "B.Planning" },
      { label: "Any Two Papers", value: "Any Two Papers" },
      { label: "All the three papers", value: "All the three papers" },
    ],
    responses: {
      "B.E / B.Tech":
        "Thanks for letting us know, [name]! You’re focusing on the B.E./B.Tech paper. We’ll provide you with the best resources and guidance to help you excel in the engineering exam.",
      "B.Arch":
        "Great choice, [name]! You’re preparing for the B.Arch paper. We’ll ensure you’re well-prepared for the aptitude and drawing sections, so you can shine in the Architecture exam.",
      "B.Planning":
        "Thanks, [name]! You’re aiming for B.Planning. We’ll provide resources focused on planning, aptitude, and more to ensure you’re ready to tackle the paper confidently.",
      "Any Two Papers":
        "Fantastic, [name]! You’re preparing for both B.E/B.Tech and another stream. We’ll tailor your prep plan to ensure you're ready for both papers, helping you manage your time effectively.",
      "All the three papers":
        "Impressive, [name]! You’re taking on B.E/B.Tech, B.Arch, and B.Planning. We’ve got you covered with a comprehensive plan to help you ace all three papers with confidence!",
    },
    errorMessage: "Please select the paper(s) you are appearing for.",
  },

  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "language",
    question: "In which language would you prefer to take the JEE Mains Exam?",
    label: "Select your preferred exam language",
    answerType: "dropdown",
    options: [
      { label: "English", value: "English" },
      { label: "Hindi", value: "Hindi" },
      { label: "Assamese", value: "Assamese" },
      { label: "Bengali", value: "Bengali" },
      { label: "Gujarati", value: "Gujarati" },
      { label: "Kannada", value: "Kannada" },
      { label: "Malayalam", value: "Malayalam" },
      { label: "Marathi", value: "Marathi" },
      { label: "Odia", value: "Odia" },
      { label: "Punjabi", value: "Punjabi" },
      { label: "Tamil", value: "Tamil" },
      { label: "Telugu", value: "Telugu" },
      { label: "Urdu", value: "Urdu" },
    ],
    responses: {
      English:
        "Great! You're all set to take the exam in English. We’ll make sure you have all the resources you need to succeed.",
      Hindi:
        "बिलकुल! आप हिंदी में परीक्षा देंगे, हम आपकी मदद के लिए तैयार हैं!",
      Assamese:
        "অসাধাৰণ! আপুনি অসমীয়া ভাষাত পৰীক্ষা দিব, আমি আপোনাৰ সফলতাৰ বাবে সমৰ্থন প্ৰদান কৰিব!",
      Bengali:
        "চমৎকার! আপনি বাংলায় পরীক্ষা দেবেন, আমরা আপনাকে সর্বোত্তম সহায়তা দেব!",
      Gujarati:
        "અદભૂત! તમે ગુજરાતી ભાષામાં પરીક્ષા આપશો, અમે તમારું સર્વોત્તમ માર્ગદર્શન આપીશું!",
      Kannada:
        "ಅದ್ಭುತ! ನೀವು ಕನ್ನಡದಲ್ಲಿ ಪರೀಕ್ಷೆ ಬರೆದೀರಿ, ನಾವು ನಿಮಗೆ ಸಂಪೂರ್ಣ ಸಹಾಯ ನೀಡಲು ಸಿದ್ದರಾಗಿದ್ದೇವೆ!",
      Malayalam:
        "അറിയിപ്പ്! നിങ്ങൾ മലയാളത്തിൽ പരീക്ഷ എഴുതുന്നതിന്, ഞങ്ങൾ നിങ്ങളെ ഏറ്റവും മികച്ച പിന്തുണ നൽകും!",
      Marathi:
        "ಉत್ಕೃಷ್ಟ! आपण मराठीत परीक्षा देणार आहात, आम्ही आपल्याला सर्वोत्तಮ मदत देऊ!",
      Odia: "ଚମତ୍କାର! ଆପଣ ଓଡ଼ିଆରେ ପରୀକ୍ଷା ଦେବେ, ଆମେ ଆପଣଙ୍କୁ ସାର୍ବୋତ୍ତମ ସହଯୋଗ ଦେବାକୁ ସିଦ୍ଧ ଅଛୁ!",
      Punjabi:
        "ਵਧੀਆ! ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਪ੍ਰੀਖਿਆ ਦਿੰਦੇ ਹੋ, ਅਸੀਂ ਤੁਹਾਡੇ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਹਿਯੋਗ ਪ੍ਰਦਾਨ ਕਰਾਂਗੇ!",
      Tamil:
        "சிறந்தது! நீங்கள் தமிழில் தேர்வு எழுதுவீர்கள், நாங்கள் உங்களுக்கு சிறந்த ஆதரவினை வழங்க தயாராக இருக்கின்றோம்!",
      Telugu:
        "అద్భుతం! మీరు తెలుగు లో పరీక్ష రాయనున్నారు, మేము మీకు అత్యుత్తమ మద్దతు అందించేందుకు సిద్ధంగా ఉన్నాము!",
      Urdu: "عمدہ! آپ اردو میں امتحان دیں گے، ہم آپ کو بہترین مدد فراہم کرنے کے لیے تیار ہیں!",
    },
    errorMessage: "Please select a language before proceeding.",
  },
  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "Profile (Currently Doing)",
    question: "What's your current profile?",
    label: "Current academic status",
    answerType: "dropdown",
    options: [
      { label: "Class 11", value: "Class 11" },
      { label: "Class 12", value: "Class 12" },
      { label: "Dropper", value: "Dropper" },
    ],
    responses: {
      "Class 11":
        "Great to hear you're in Class 11, [name]! You’ve started your preparation with excellent foresight—stay focused and keep progressing! The foundation you build this year will pave the way for your success in JEE Mains and beyond. Keep practicing and stay consistent. You've got this!",
      "Class 12":
        "With only one year to go, [name], stay focused, stay determined, and make every moment count toward your success! Every single day is an opportunity to get closer to your dream college. Maximize your study routine, practice mock tests, and keep revising important concepts. You've got what it takes to excel!",
      Dropper:
        "Smart preparation and steady effort will turn your aspirations into achievements, [name]. Keep pushing forward! You’ve already laid a strong foundation, and now it’s time to refine your strategies and work on weak areas. Be consistent, stay disciplined, and use this year to your advantage. Your second attempt could be your best one!",
    },
    errorMessage: "Please select your current profile before proceeding.",
  },
  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "year_of_passing",
    question:
      "What is your expected year of passing or the years you passed the class 12th?",
    label: "This helps determine your attempt eligibility",
    answerType: "dropdown",
    options: [
      { label: "Earlier than 2023", value: "Earlier than 2023" },
      { label: "2023", value: "2023" },
      { label: "2024", value: "2024" },
      { label: "2025", value: "2025" },
      { label: "2026", value: "2026" },
    ],
    responses: {
      2023: "Thanks for providing your Year of Passing, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
      2024: "Thanks for providing your Year of Passing, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
      2025: "Thanks for providing your Year of Passing, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
      2026: "Thanks for providing your Year of Passing, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
    },
    errorResponse: {
      "Earlier than 2023":
        "Thanks for providing your Year of Passing, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
    },
    errorComment: {
      "Earlier than 2023":
        "Based on your passing year (2022), you could attempt JEE Main until 2024.",
    },
    errorMessage: "Please select a year before proceeding.",
  },
  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "dob",
    question: "What's your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2008-12-31",
    cutoffDate: "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for NEET is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for NEET is 17 years.",
    },
    response:
      "Thanks for providing your date of birth, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
  },
];

export const UPSC_CDS_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "greeting",
    question: "Are you ready to get started?",
    introductionLine1:
      "Welcome to your journey toward a rewarding career in the Indian Defence Forces. Let’s first ensure you meet the eligibility criteria for the CDS exam. Ready to begin?",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What’s your name?",
    label: "To confirm the identity of the candidate. It's a basic identifier.",
    answerType: "text",
    response:
      "Hi [name]! Let’s get you one step closer to your dream career in the defense forces. Ready to begin?",
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What’s your gender?",
    label:
      "To check eligibility for gender-specific posts, as some roles in the armed forces may have gender-based criteria.",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Third Gender", value: "Third Gender" },
    ],
    responses: {
      Male: "Thank you for providing your details. As per the CDS exam requirements, your gender has been successfully recorded. Let's move to the next step",
      Female:
        "Thank you for providing your details. As per the CDS exam requirements, your gender has been successfully recorded. Let's move to the next step",
    },
    errorResponse: {
      "Third Gender":
        "Thank you for providing your details. As per the CDS exam requirements, your gender has been successfully recorded. Let's move to the next step",
    },

    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "nationality",
    question: "What’s your nationality?",
    label: "To ensure the candidate meets nationality requirements.",
    answerType: "dropdown",
    options: [
      { label: "India", value: "India" },
      { label: "Nepal", value: "Nepal" },
      { label: "Pakistan", value: "Pakistan" },
      { label: "Burma", value: "Burma" },
      { label: "Sri Lanka", value: "Sri Lanka" },
      { label: "Kenya", value: "Kenya" },
      { label: "Uganda", value: "Uganda" },
      { label: "Tanzania", value: "Tanzania" },
      { label: "Zambia", value: "Zambia" },
      { label: "Malawi", value: "Malawi" },
      { label: "Zaire", value: "Zaire" },
      { label: "Ethiopia", value: "Ethiopia" },
      { label: "Vietnam", value: "Vietnam" },
      { label: "Other", value: "Other" },
    ],
    responses: {
      India:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Nepal:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Pakistan:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Burma:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      "Sri Lanka":
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Kenya:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Uganda:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Tanzania:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Zambia:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Malawi:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Zaire:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Ethiopia:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
      Vietnam:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
    },
    errorMessage: "Please select your nationality before proceeding.",
    errorResponse: {
      Other:
        "Thank you for providing your details. As per the CDS exam requirements, your nationality has been successfully recorded.",
    },
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "marital_status",
    question: "What’s your marital status?",
    label: "To assess marital status requirements.",
    answerType: "dropdown",
    options: [
      { label: "Married", value: "Married" },
      { label: "Unmarried", value: "Unmarried" },
      { label: "Divorced", value: "Divorced" },
    ],
    // responseQuestion: {
    //   Married: [
    //     {
    //       category: "personal_information",
    //       categoryLabel: "Personal Information",
    //       subcategory: "marital_status",
    //       question: "Do you have any children?",
    //       label: "To assess marital status requirements.",
    //       answerType: "dropdown",
    //       options: [
    //         { label: "Yes", value: "Yes" },
    //         { label: "No", value: "No" },
    //       ],
    //     },
    //   ],
    // },
    responses: {
      Married:
        "Thank you for providing your details. As per the CDS exam requirements, your marital status has been successfully recorded.",
      Unmarried:
        "Thank you for providing your details. As per the CDS exam requirements, your marital status has been successfully recorded.",
      Divorced:
        "Thank you for providing your details. As per the CDS exam requirements, your marital status has been successfully recorded.",
    },
    errorMessage: "Please select your marital status before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "current_profile",
    question: "What’s your current profile?",
    label: "To understand the candidate's professional background.",
    answerType: "dropdown",
    options: [
      // { label: "Going to School", value: "Going to School" },
      // { label: "Going to College", value: "Going to College" },
      // { label: "Preparing Full Time", value: "Preparing Full Time" },
      { label: "Working Professional", value: "Working Professional" },
      { label: "Other", value: "Other" },
    ],
    responses: {
      // "Going to School":
      //   "Thank you for providing your details. As per the CDS exam requirements, your current profile has been successfully recorded. It's great to see your passion for the defence forces!",
      // "Going to College":
      //   "Thank you for providing your details. As per the CDS exam requirements, your current profile has been successfully recorded. This is the perfect time to begin your preparations!",
      // "Preparing Full Time":
      //   "Thank you for providing your details. As per the CDS exam requirements, your current profile has been successfully recorded. Stay focused, and give your best attempt!",
      "Working Professional":
        "Thank you for providing your details. As per the CDS exam requirements, your current profile has been successfully recorded. You are choosing the right career. Get ready to give more time at night, weekends and public holidays!",
      Other:
        "Thank you for providing your details. As per the CDS exam requirements, your current profile has been successfully recorded. You are choosing the right career. Get ready to give more time at night, weekends and public holidays!",
    },
    errorMessage: "Please select your current profile before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "caste_category",
    question: "What’s your caste category?",
    label: "For caste-based reservation eligibility.",
    answerType: "dropdown",
    options: [
      { label: "General (Male)", value: "General (Male)" },
      { label: "General (Female)", value: "General (Female)" },
      { label: "OBC (Male)", value: "OBC (Male)" },
      { label: "OBC (Female)", value: "OBC (Female)" },
      { label: "SC", value: "SC" },
      { label: "ST", value: "ST" },
    ],
    responses: {
      "General (Male)":
        "Thank you for providing your details. As per the CDS exam requirements, your Caste Category has been successfully recorded.",
      "General (Female)":
        "Thank you for providing your details. As per the CDS exam requirements, your Caste Category has been successfully recorded.",
      "OBC (Male)":
        "Thank you for providing your details. As per the CDS exam requirements, your Caste Category has been successfully recorded.",
      "OBC (Female)":
        "Thank you for providing your details. As per the CDS exam requirements, your Caste Category has been successfully recorded.",
      SC: "Thank you for providing your details. As per the CDS exam requirements, your Caste Category has been successfully recorded.",
      ST: "Thank you for providing your details. As per the CDS exam requirements, your Caste Category has been successfully recorded.",
    },
    errorMessage: "Please select your caste category before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "dob",
    question: "What's your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2008-12-31",
    cutoffDate: "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for CDS is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for CDS is 17 years.",
    },
    response:
      "Thank you for providing your details. As per the CDS exam requirements, your age has been successfully recorded.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "cpl",
    question:
      "Do you have a Commercial Pilot License (CPL) issued by the Directorate General of Civil Aviation (DGCA), India?",
    label: "For roles requiring a CPL.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    responses: {
      Yes: "Great! Since you have a Commercial Pilot License (CPL) issued by DGCA, India, you may be eligible for certain courses within the Air Force Academy (AFA) under the UPSC CDS exam. ",
      No: "Thank you for your response. If you don’t have a Commercial Pilot License (CPL) issued by DGCA, India, you can still apply for the courses under the CDS exam. You will be considered for selection based on other eligibility criteria.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "education_qualification",
    question: "What’s your education qualification?",
    label: "To confirm academic eligibility.",
    answerType: "dropdown",
    options: [
      { label: "Any Graduate", value: "Any Graduate" },
      {
        label: "Any Degree (with Physics and Maths)",
        value: "Any Degree (with Physics and Maths)",
      },
      { label: "B.Tech/B.E.", value: "B.Tech/B.E." },
      { label: "B.Sc. (Physics & Maths)", value: "B.Sc. (Physics & Maths)" },
    ],
    responses: {
      "Any Graduate":
        "Thank you for providing your details! With your graduation degree, you’re one step closer to joining the Armed Forces. Keep moving forward, your dedication will lead you to success!",
      "Any Degree (with Physics and Maths)":
        "Thank you for providing your details! With your 10+2 qualifications in Physics and Maths and a graduation degree, you have a strong foundation to pursue a rewarding career in the Armed Forces. Your journey begins now!",
      "B.Tech/B.E.":
        "Thank you for providing your details! With your B.Tech/B.E., you’re in an excellent position to take on leadership roles in the Armed Forces. Stay focused – the future is yours!",
      "B.Sc. (Physics & Maths)":
        "Thank you for providing your details! With your B.Sc. (Physics and Maths), you’re on the path to a rewarding career in the Armed Forces. Keep your determination high – you're ready for success!",
    },
    errorMessage: "Please select your qualification before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "preferred_service",
    question: "What’s your preferred service?",
    label: "To know which branch you prefer.",
    answerType: "dropdown",
    options: [
      { label: "IMA", value: "IMA" },
      { label: "INA", value: "INA" },
      { label: "AFA", value: "AFA" },
      { label: "OTA", value: "OTA" },
    ],
    responses: {
      IMA: "Thank you for providing your details. As per the CDS exam requirements, your preferred service has been successfully recorded. Continue your preparation!",
      INA: "Thank you for providing your details. As per the CDS exam requirements, your preferred service has been successfully recorded. Continue your preparation!",
      AFA: "Thank you for providing your details. As per the CDS exam requirements, your preferred service has been successfully recorded. Continue your preparation!",
      OTA: "Thank you for providing your details. As per the CDS exam requirements, your preferred service has been successfully recorded. Continue your preparation!",
    },
    errorMessage: "Please select your preferred service before proceeding.",
  },
  // {
  //   category: "eligibility",
  //   categoryLabel: "Eligibility",
  //   subcategory: "remaining_attempts",
  //   question: "Proceed to check eligibility and remaining attempts?",
  //   label: "This will align your data with CDS exam requirements.",
  //   answerType: "dropdown",
  //   options: [{ label: "Proceed Now", value: "Proceed Now" }],
  //   responses: {
  //     "Proceed Now": "Remaining Attempts checked for your eligibility.",
  //   },
  // },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "height",
    question: "Physical Measurements",
    label: "Enter your height and weight for BMI calculation",
    answerType: "text",
    response: "Height recorded successfully.",
    errorMessage: "Please enter your height and weight before proceeding.",
    bmiCutoff: 18.5,
  },

  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "knock_knees",
    question: "Are you suffering from Knock Knees?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not Sure", value: "Not Sure" },
    ],
    responses: {
      Yes: "Thank you for providing your detail! Knock knees is a condition where your knees bend inward and touch each other, even when standing with your feet apart. This may cause pain or discomfort over time. It’s important to consult a medical professional to assess your eligibility for the CDS exam.",
      No: "Great! It looks like you do not suffer from Knock Knees, which is important for physical eligibility. You're one step closer to your goal!",
      "Not Sure":
        "No worries! If you're unsure, we recommend seeing a medical professional for a checkup. It’s always better to be sure.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "flat_foot",
    question: "Are you suffering from Flat Foot?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not Sure", value: "Not Sure" },
    ],
    responses: {
      Yes: "Thank you for your response! Flat foot is a condition where the entire sole of the foot touches the floor when standing. This might cause discomfort or difficulty in standing for long periods. We recommend checking with a medical expert to confirm your eligibility for the CDS exam",
      No: "Awesome! Since you don’t have flat foot, you are in a better position for the physical eligibility requirements for the CDS exam!",
      "Not Sure":
        "If you're unsure about having flat foot, it’s best to consult a doctor for clarity. This will ensure you're ready to meet the physical standards.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "colour_blindness",
    question: "Are you suffering from Colour Blindness?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not Sure", value: "Not Sure" },
    ],
    responses: {
      Yes: "Thank you for sharing! The colour blindness test is crucial for understanding how it might affect certain tasks. It might be helpful to consult a specialist for more detailed advice on the matter.",
      No: "Great! It looks like you're all set in terms of colour vision, which is essential for the physical eligibility requirements.",
      "Not Sure":
        "Not sure? No worries! We recommend taking a quick colour blindness test. It’s a simple way to be confident in your eligibility.",
    },
    errorResponse: {
      "Not Sure":
        "Not sure? No worries! We recommend taking a quick colour blindness test. It’s a simple way to be confident in your eligibility",
    },
    errorResponseLink: {
      "Not Sure": "https://colormax.org/color-blind-test/ ",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "hearing",
    question: "Are you able to hear clearly?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    responses: {
      Yes: "Perfect! Clear hearing is one of the physical eligibility requirements, and it seems you're all good on that front. Keep up the great work!",
      No: "Thank you for sharing. If you're having trouble hearing, it’s important to consult a medical professional to see if it affects your eligibility for the CDS exam. Stay proactive in your preparation!",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "ncc_certificate",
    question: "Do you have an NCC Certificate?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    responses: {
      Yes: "Well done! While there are no direct provisions for the NCC certificate in the written exam, it certainly holds weight in the SSB (Services Selection Board) interview. Having it can be a valuable addition to your profile.",
      No: "No problem! Not having the NCC certificate doesn’t affect your eligibility for the written exam.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
];
export const UPSC_NDA_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "greeting",
    question: "Are you ready to get started?",
    introductionLine1:
      "Welcome to your journey toward a rewarding career in the Indian Defence Forces. Let’s first ensure you meet the eligibility criteria for the UPSC NDA Exam. Ready to begin?",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What’s your name?",
    label: "",
    answerType: "text",
    response:
      "Hi [name]! Let’s get started on your NDA journey. Aim high, serve with pride!",
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What’s your gender?",
    label:
      "To check eligibility for gender-specific posts, as some roles in the armed forces may have gender-based criteria.",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
    ],
    responses: {
      Male: "Thank you for providing your details. As per the NDA exam requirements, your gender has been successfully recorded",
      Female:
        "Thank you for providing your details. As per the NDA exam requirements, your gender has been successfully recorded.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "nationality",
    question: "What’s your nationality?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "India", value: "India" },
      { label: "Nepal", value: "Nepal" },
      { label: "Pakistan", value: "Pakistan" },
      { label: "Burma", value: "Burma" },
      { label: "Sri Lanka", value: "Sri Lanka" },
      { label: "Kenya", value: "Kenya" },
      { label: "Uganda", value: "Uganda" },
      { label: "Tanzania", value: "Tanzania" },
      { label: "Zambia", value: "Zambia" },
      { label: "Malawi", value: "Malawi" },
      { label: "Zaire", value: "Zaire" },
      { label: "Ethiopia", value: "Ethiopia" },
      { label: "Vietnam", value: "Vietnam" },
      { label: "Other", value: "Other" },
    ],
    responses: {
      India:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Nepal:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Pakistan:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Burma:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      "Sri Lanka":
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Kenya:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Uganda:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Tanzania:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Zambia:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Malawi:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Zaire:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Ethiopia:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
      Vietnam:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
    },
    errorMessage: "Please select your nationality before proceeding.",
    errorResponse: {
      Other:
        "Thank you for providing your details. As per the NDA exam requirements, your nationality has been successfully recorded.",
    },
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "marital_status",
    question: "What’s your marital status?",
    label: "To assess marital status requirements.",
    answerType: "dropdown",
    options: [
      { label: "Married", value: "Married" },
      { label: "Unmarried", value: "Unmarried" },
    ],
    // responseQuestion: {
    //   Married: [
    //     {
    //       category: "personal_information",
    //       categoryLabel: "Personal Information",
    //       subcategory: "marital_status",
    //       question: "Do you have any children?",
    //       label: "To assess marital status requirements.",
    //       answerType: "dropdown",
    //       options: [
    //         { label: "Yes", value: "Yes" },
    //         { label: "No", value: "No" },
    //       ],
    //     },
    //   ],
    // },
    responses: {
      Unmarried:
        "Thank you for providing your details. As per the NDA Exam requirements, your marital status has been successfully recorded.",
    },
    errorResponse: {
      Married:
        "Thank you for providing your details. As per the NDA Exam requirements, your marital status has been successfully recorded.",
    },
    errorMessage: "Please select your marital status before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "current_profile",
    question: "What’s your current profile?",
    label: "To understand the candidate's professional background.",
    answerType: "dropdown",
    options: [
      // { label: "Going to School", value: "Going to School" },
      // { label: "12th Class", value: "12th Class" },
      // { label: "11th Class", value: "11th Class" },
      // { label: "10th Class", value: "10th Class" },
      { label: "Working Professional", value: "Working Professional" },
      { label: "Other", value: "Other" },
    ],
    responses: {
      "Going to School":
        "Thank you for providing your details! 🎓 As an undergraduate student, you’ve made a smart choice to start preparing for the NDA exam while continuing your higher education. You’re in the perfect position to juggle both!",
      "12th Class":
        "Thank you for providing your details! 🎓 As a 12th-grade student, you’re at a crucial stage in your academic journey. It’s awesome to see that you’re considering the NDA exam early on!",
      "11th Class":
        "Thank you for providing your details! 🎓 As an 11th-grade student, you’re in the perfect position to start preparing for the NDA exam. Your dedication now will give you a huge advantage later on!",
      "10th Class":
        "Thank you for providing your details! 🎉 As a 10th-grade student, you’re taking a great step toward preparing for a future in the Armed Forces. It’s fantastic that you’re thinking ahead about your career! 🌟",
      "Working Professional":
        "Thank you for providing your details. As per the NDA exam requirements, your current profile has been successfully recorded. You are choosing the right career. Get ready to give more time at night, weekends and public holidays !",
      Other:
        "Thank you for providing your details! 🎉 We see that you’ve selected Other as your current profile. No matter your current stage, it’s never too late to begin your NDA preparation! Whether you’re working, taking a gap year, or pursuing something else, starting your NDA preparation will help you move towards your goal of joining the Armed Forces.",
    },
    errorMessage: "Please select your current profile before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "caste_category",
    question: "What’s your caste category?",
    label: "For caste-based reservation eligibility.",
    answerType: "dropdown",
    options: [
      { label: "General (Male)", value: "General (Male)" },
      { label: "General (Female)", value: "General (Female)" },
      { label: "OBC (Male)", value: "OBC (Male)" },
      { label: "OBC (Female)", value: "OBC (Female)" },
      { label: "SC", value: "SC" },
      { label: "ST", value: "ST" },
    ],
    response:
      "Thank you for providing your details. As per the NDA exam requirements, your Caste Category has been successfully recorded. This is your chance to serve the nation and take the first step toward an extraordinary future.",

    errorMessage: "Please select your caste category before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "dob",
    question: "What's your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2010-12-31",
    cutoffDate: todaycutoffDate || "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for NDA is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for NDA is 17 years.",
    },
    response:
      "Thank you for providing your details. As per the NDA exam requirements, your age has been successfully recorded.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "education_qualification",
    question: "What’s your education qualification?",
    label: "",
    answerType: "dropdown",
    options: [
      {
        label: "12th Class pass or equivalent",
        value: "12th Class pass or equivalent",
      },
      {
        label: "12th Class pass with Physics, Chemistry, and Mathematics",
        value: "12th Class pass with Physics, Chemistry, and Mathematics",
      },
      {
        label: "Candidates Appearing in 12th Class (under 10+2 pattern)",
        value: "Candidates Appearing in 12th Class (under 10+2 pattern)",
      },
    ],
    responses: {
      "12th Class pass or equivalent":
        "Thank you for providing your details. As per the NDA exam requirements, your educational qualification has been successfully recorded. Let's move ahead!.",
      "12th Class pass with Physics, Chemistry, and Mathematics":
        "Thank you for providing your details. As per the NDA exam requirements, your educational qualification has been successfully recorded. Let's move ahead!.",
      "Candidates Appearing in 12th Class (under 10+2 pattern)":
        "Thank you for providing your details. As per the NDA exam requirements, your educational qualification has been successfully recorded. Let's move ahead!.",
    },
    errorMessage: "Please select your qualification before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "preferred_service",
    question: "What’s your preferred service?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Army Wing of NDA", value: "Army Wing of NDA" },
      { label: "Navy Wing of NDA", value: "Navy Wing of NDA" },
      { label: "Air Force Wing of NDA", value: "Air Force Wing of NDA" },
      {
        label: "Naval Academy (10+2 Cadet Entry Scheme)",
        value: "Naval Academy (10+2 Cadet Entry Scheme)",
      },
    ],
    responses: {
      "Army Wing of NDA":
        "Thank you for your interest in the Army Wing of the National Defence Academy (NDA)! 🏅 If you select this preference, you’ll be considered for the Indian Army, where you can take up leadership roles and serve the nation. The Army is a place of honor, duty, and immense pride. 🇮🇳",
      "Navy Wing of NDA":
        "Thank you for your interest in the Navy Wing of the National Defence Academy (NDA)! 🚢⚓ By selecting this preference, you are opting for the Indian Navy, one of the most prestigious branches of the Indian Armed Forces. You'll have the opportunity to serve at sea, where you can contribute to national security in ways few can. 🌊",
      "Air Force Wing of NDA":
        "Thank you for your interest in the Air Force Wing of the National Defence Academy (NDA)! ✈️💨 This is the perfect choice if you wish to join the Indian Air Force and explore roles in flying, ground duties (technical), and ground duties (non-technical). As an officer in the Air Force, you’ll have the chance to soar through the skies and contribute to national defense from a whole new perspective. 🌟",
      "Naval Academy (10+2 Cadet Entry Scheme)":
        "Thank you for your interest in the Naval Academy under the 10+2 Cadet Entry Scheme! ⚓️👨‍✈️ By choosing this option, you’re opting for a direct entry into the Indian Naval Academy. If you’re passionate about joining the Navy and have completed 12th with Physics, Chemistry, and Mathematics, this is a wonderful opportunity to be part of the elite naval forces. 🌍",
    },
    errorMessage: "Please select your preferred service before proceeding.",
  },
  // {
  //   category: "eligibility",
  //   categoryLabel: "Eligibility",
  //   subcategory: "remaining_attempts",
  //   question:
  //     "Would you like to align your data with the NDA exam requirements for your remaining attempt and check your eligibility for the posts?",
  //   label: "",
  //   answerType: "dropdown",
  //   options: [{ label: "Proceed Now", value: "Proceed Now" }],
  //   responses: {
  //     "Proceed Now": "",
  //   },
  // },

  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "height",
    question: "Physical Measurements",
    label: "Enter your height and weight for BMI calculation",
    answerType: "text",
    response:
      "Thank you for providing your details. As per the NDA exam requirements, your height has been successfully recorded.",
    errorMessage: "Please enter your height and weight before proceeding.",
    bmiCutoff: 18.5,
  },

  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "knock_knees",
    question: "Are you suffering from Knock Knees?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not Sure", value: "Not Sure" },
    ],
    responses: {
      Yes: "Thank you for providing your detail! Knock knees is a condition where your knees bend inward and touch each other, even when standing with your feet apart. This may cause pain or discomfort over time. It’s important to consult a medical professional to assess your eligibility for the NDA exam.",
      No: "Great! It looks like you do not suffer from Knock Knees, which is important for physical eligibility. You're one step closer to your goal!",
      "Not Sure":
        "No worries! If you're unsure, we recommend seeing a medical professional for a checkup. It’s always better to be sure.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "flat_foot",
    question: "Are you suffering from Flat Foot?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not Sure", value: "Not Sure" },
    ],
    responses: {
      Yes: "Thank you for your response! Flat foot is a condition where the entire sole of the foot touches the floor when standing. This might cause discomfort or difficulty in standing for long periods. We recommend checking with a medical expert to confirm your eligibility for the NDA exam.",
      No: "Awesome! Since you don’t have flat foot, you are in a better position for the physical eligibility requirements for the NDA exam.",
      "Not Sure":
        "If you're unsure about having flat foot, it’s best to consult a doctor for clarity. This will ensure you're ready to meet the physical standards.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "colour_blindness",
    question: "Are you suffering from Colour Blindness?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not Sure", value: "Not Sure" },
    ],
    responses: {
      Yes: "Thank you for sharing! The colour blindness test is crucial for understanding how it might affect certain tasks. It might be helpful to consult a specialist for more detailed advice on the matter.",
      No: "Great! It looks like you're all set in terms of colour vision, which is essential for the physical eligibility requirements.",
      "Not Sure":
        "Not sure? No worries! We recommend taking a quick colour blindness test. It’s a simple way to be confident in your eligibility.",
    },
    errorResponse: {
      "Not Sure":
        "Not sure? No worries! We recommend taking a quick colour blindness test. It’s a simple way to be confident in your eligibility",
    },
    errorResponseLink: {
      "Not Sure": "https://colormax.org/color-blind-test/ ",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "physical_medical",
    categoryLabel: "Physical & Medical",
    subcategory: "hearing",
    question: "Are you able to hear clearly?",
    label: "Physical standard requirement.",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    responses: {
      Yes: "Perfect! Clear hearing is one of the physical eligibility requirements, and it seems you're all good on that front. Keep up the great work!",
      No: "Thank you for sharing. If you're having trouble hearing, it’s important to consult a medical professional to see if it affects your eligibility for the NDA exam. Stay proactive in your preparation!",
    },
    errorMessage: "Please select an option before proceeding.",
  },
];

export const NEET_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "welcome",
    introductionLine1:
      "Welcome to the first step in your journey toward becoming a doctor! NEET (National Eligibility cum Entrance Test) is the gateway to some of the top medical colleges in India. Let's start by ensuring you understand the exam structure and eligibility. Ready to dive in?",
    introductionLine2:
      "We know you’re aiming for success in NEET, and we’re here to make sure you’re fully equipped to reach your goals! Our personalized approach helps you build a strong foundation, ensuring you’re ready to take on every challenge that comes your way. We believe in your potential, and we’re here to help you get the best score possible!",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What’s your name?",
    label: "Enter your full name as per academic records.",
    answerType: "text",
    response:
      "Your journey towards success starts now, [name]! We’re thrilled to be part of your path to achieving great things.",
    errorMessage: "Please provide your name before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What’s your gender?",
    label: "Gender may affect fee structure.",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Third Gender", value: "Third Gender" },
    ],
    responses: {
      Male: "Hey there, future doctor! We know you’re aiming high, and we're here to make sure you’re fully prepared for NEET. With dedication and the right guidance, you're well on your way to achieving your goals. Let's work together to build a strong foundation in Physics, Chemistry, and Biology, and tackle every challenge with confidence. Stay focused, stay motivated, and remember, your hard work will pay off. You've got this!",
      Female:
        "Hello, future doctor! We're so excited to be part of your NEET preparation journey. Your potential is limitless, and with the right approach, you’ll be ready to conquer the exam. We’re here to guide you every step of the way, whether it's mastering tricky concepts or managing exam stress. Keep believing in yourself—your dreams of entering the medical field are well within reach. Let’s make this journey amazing together!",
      "Third Gender":
        "Hello, future doctor! We're here to support you as you prepare for NEET and are committed to ensuring your success. Your dedication to your goals is inspiring, and with the right resources and mindset, there’s no limit to what you can achieve. Whether you need extra help with specific subjects or tips on managing the exam, we're with you every step of the way. Stay positive, stay determined, and remember that your dreams are valid and achievable. You’ve got all the strength you need to succeed!",
    },
    errorMessage: "Please select your gender before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "nationality",
    question: "What is your nationality?",
    label: "Eligibility is based on nationality.",
    answerType: "dropdown",
    options: [
      { label: "Indian", value: "Indian" },
      { label: "NRI", value: "Non-Resident of India (NRIs)" },
      { label: "OCI", value: "Overseas Citizen of India (OCIs)" },
      { label: "Foreign National", value: "Foreign Nationals" },
    ],
    responses: {
      Indian:
        "An Indian citizen is a person who is legally recognized as a national of India, either by birth, descent, or through the process of naturalization.",
      "Non-Resident of India (NRIs)":
        "A Non-Resident Indian (NRI) is an Indian citizen who lives outside India for work, business, or other reasons.",
      "Overseas Citizen of India (OCIs)":
        "An Overseas Citizen of India (OCI) is a foreign citizen of Indian origin who has been granted a special status by the Indian government, allowing some privileges but not full Indian citizenship.",
      "Foreign Nationals":
        "Foreign Nationals are individuals who are citizens of countries other than India and do not have any special status in India.",
    },
    errorMessage: "Please select your nationality before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "state",
    question: "Which state/UT are you from?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Andhra Pradesh", value: "Andhra Pradesh" },
      { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
      { label: "Assam", value: "Assam" },
      { label: "Bihar", value: "Bihar" },
      { label: "Chhattisgarh", value: "Chhattisgarh" },
      { label: "Goa", value: "Goa" },
      { label: "Gujarat", value: "Gujarat" },
      { label: "Haryana", value: "Haryana" },
      { label: "Himachal Pradesh", value: "Himachal Pradesh" },
      { label: "Jharkhand", value: "Jharkhand" },
      { label: "Karnataka", value: "Karnataka" },
      { label: "Kerala", value: "Kerala" },
      { label: "Madhya Pradesh", value: "Madhya Pradesh" },
      { label: "Maharashtra", value: "Maharashtra" },
      { label: "Manipur", value: "Manipur" },
      { label: "Meghalaya", value: "Meghalaya" },
      { label: "Mizoram", value: "Mizoram" },
      { label: "Nagaland", value: "Nagaland" },
      { label: "Odisha", value: "Odisha" },
      { label: "Punjab", value: "Punjab" },
      { label: "Rajasthan", value: "Rajasthan" },
      { label: "Sikkim", value: "Sikkim" },
      { label: "Tamil Nadu", value: "Tamil Nadu" },
      { label: "Telangana", value: "Telangana" },
      { label: "Tripura", value: "Tripura" },
      { label: "Uttar Pradesh", value: "Uttar Pradesh" },
      { label: "Uttarakhand", value: "Uttarakhand" },
      { label: "West Bengal", value: "West Bengal" },
      {
        label: "Andaman and Nicobar Islands",
        value: "Andaman and Nicobar Islands",
      },
      { label: "Chandigarh", value: "Chandigarh" },
      {
        label: "Dadra and Nagar Haveli and Daman and Diu",
        value: "Dadra and Nagar Haveli and Daman and Diu",
      },
      { label: "Delhi", value: "Delhi" },
      { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
      { label: "Ladakh", value: "Ladakh" },
      { label: "Lakshadweep", value: "Lakshadweep" },
      { label: "Puducherry", value: "Puducherry" },
    ],
    responses: {
      "Arunachal Pradesh":
        "Thank you for your input! We appreciate you taking the time to provide your details. Let’s keep moving forward together on this journey. We’re here to support you every step of the way!",
      "Jammu & Kashmir":
        "Since you've chosen Jammu & Kashmir (J&K) as your Union Territory, you're eligible for the 15% All India Quota (AIQ) seats. This means you can apply for AIQ seats and participate in the admission process just like candidates from other states.",
      Ladakh:
        "Since you've chosen Ladakh as your Union Territory, you're eligible for the 15% All India Quota (AIQ) seats. This means you can apply for AIQ seats and participate in the admission process just like candidates from other states.",
    },
    errorMessage: "Please select your state/UT before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "exam_center",
    question: "Will you opt for the exam center in India or outside India?",
    label: "Exam center location affects fee.",
    answerType: "dropdown",
    options: [
      { label: "India", value: "India" },
      { label: "Outside India", value: "Outside India" },
    ],
    responses: {
      India:
        "Thanks for sharing your choice, [name]! Opting for an exam center in India means you’ll be able to focus on your preparation without worrying about travel logistics. We’re here to help you excel in your journey!",
      "Outside India":
        "Thanks for sharing your choice, [name]! Opting for an exam center outside India is an exciting opportunity. Let’s focus on your preparation and make sure you're ready for this international experience!",
    },
    errorMessage: "Please select an exam center location before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "category",
    question: "What's your caste/category?",
    label: "Category affects fee and reservation.",
    answerType: "dropdown",
    options: [
      { label: "General", value: "General" },
      { label: "General-EWS", value: "General-EWS" },
      { label: "OBC (NCL)", value: "OBC (NCL)" },
      { label: "SC/ST", value: "SC / ST" },
      { label: "PWD/PwBD", value: "PWD / PwBD" },
    ],
    responses: {
      General:
        "Thank you for selecting your category! You're on the right path, and your hard work and determination will take you far. Keep up the great effort and stay focused—success is just ahead. We’re with you every step of the way!",
      "General-EWS":
        "For candidates claiming the GEN-EWS category, make sure you have a valid GEN-EWS certificate as per the latest Government guidelines. Your journey may have unique opportunities, and with dedication, you're sure to achieve your goals. Stay motivated, and keep pushing forward—success is within reach!",
      "OBC (NCL)":
        "For candidates claiming the OBC-NCL category, ensure you have a valid OBC-NCL certificate as per the latest Government guidelines. You are a part of a resilient community, and this is your moment to shine! Stay focused, keep working hard, and trust that your dedication will pay off",
      "SC / ST":
        "For candidates claiming the SC or ST category, make sure your SC/ST certificate is valid according to the Government of India’s guidelines. Remember, your efforts and perseverance will create your path to success. Stay positive, stay motivated, and keep striving for your dreams!",
      "PWD / PwBD":
        "Thank you for selecting your category! Candidates with disabilities are eligible for admission to medical courses under a 5% reservation, in accordance with the guidelines outlined in the Regulation on Graduate Medical Education (1997), as amended. Your determination and resilience are inspiring, and we are here to support you every step of the way in achieving your goals!",
    },
    errorMessage: "Please select your category before proceeding.",
  },

  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "language",
    question: "In which language would you prefer to take the NEET Exam?",
    label: "Preferred exam language.",
    answerType: "dropdown",
    options: [
      { label: "English", value: "English" },
      { label: "Hindi", value: "Hindi" },
      { label: "Assamese", value: "Assamese" },
      { label: "Bengali", value: "Bengali" },
      { label: "Gujarati", value: "Gujarati" },
      { label: "Kannada", value: "Kannada" },
      { label: "Malayalam", value: "Malayalam" },
      { label: "Marathi", value: "Marathi" },
      { label: "Odia", value: "Odia" },
      { label: "Punjabi", value: "Punjabi" },
      { label: "Tamil", value: "Tamil" },
      { label: "Telugu", value: "Telugu" },
      { label: "Urdu", value: "Urdu" },
    ],
    responses: {
      English: "Great! You’ll take the exam in English.",
      Hindi: "बिलकुल! आप हिंदी में परीक्षा देंगे।",
      Assamese: "অসাধাৰণ! আপুনি অসমীয়া ভাষাত পৰীক্ষা দিব।",
      Bengali: "চমৎকার! আপনি বাংলায় পরীক্ষা দেবেন।",
      Gujarati: "અદભૂત! તમે ગુજરાતી ભાષામાં પરીક્ષા આપશો।",
      Kannada: "ಅದ್ಭುತ! ನೀವು ಕನ್ನಡದಲ್ಲಿ ಪರೀಕ್ಷೆ ಬರೆದೀರಿ।",
      Malayalam: "അറിയിപ്പ്! നിങ്ങൾ മലയാളത്തിൽ പരീക്ഷ എഴുതും.",
      Marathi: "उत्कृष्ट! आपण मराठीत परीक्षा देणार आहात।",
      Odia: "ଚମତ୍କାର! ଆପଣ ଓଡ଼ିଆରେ ପରୀକ୍ଷା ଦେବେ।",
      Punjabi: "ਵਧੀਆ! ਤੁਸੀਂ ਪੰਜਾਬੀ ਵਿੱਚ ਪ੍ਰੀਖਿਆ ਦਿੰਦੇ ਹੋ।",
      Tamil: "சிறந்தது! நீங்கள் தமிழில் தேர்வு எழுதுவீர்கள்।",
      Telugu: "అద్భుతం! మీరు తెలుగు లో పరీక్ష రాయనున్నారు।",
      Urdu: "عمدہ! آپ اردو میں امتحان دیں گے۔",
    },
    errorMessage: "Please select your exam language before proceeding.",
  },
  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "profile",
    question: "What's your current profile?",
    label: "Your academic status.",
    answerType: "dropdown",
    options: [
      { label: "Class 11", value: "Class 11" },
      { label: "Class 12", value: "Class 12" },
      { label: "Dropper", value: "Dropper" },
    ],
    responses: {
      "Class 11": "Great! Foundations you build now will pay off.",
      "Class 12": "Stay focused—every day counts!",
      Dropper: "Use this year to refine strategies and succeed!",
    },
    errorMessage: "Please select your current profile before proceeding.",
  },
  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "subjects",
    question: "What subjects did you choose in Class 11th?",
    label: "Select exactly five subjects, including Biology.",
    answerType: "checkbox",
    options: [
      { label: "Physics", value: "physics" },
      { label: "Chemistry", value: "chemistry" },
      { label: "Biology", value: "biology" },
      { label: "Mathematics", value: "mathematics" },
      { label: "English", value: "english" },
      { label: "Computer Science", value: "cs" },
      { label: "Physical Education", value: "pe" },
    ],
    minSelect: 5,
    maxSelect: 5,
    requiredSubjects: ["biology"],
    minSelectMessage: "Please select at least 5 subjects (including Biology).",
    maxSelectMessage: "You can only select 5 subjects.",

    responses: {
      "Biology,Chemistry,English,Maths,Physics": "Congrats! You are eligible.",
      "Biology,Chemistry,Hindi,Sanskrit,Physics": "Congrats! You are eligible.",
    },
    errorMessage:
      "Thanks for your response! We can see you have not chosen Biology as one of your subjects..",
  },

  {
    category: "academic_eligibility_check",
    categoryLabel: "Academic Eligibility Check",
    subcategory: "dob",
    question: "What's your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2008-12-31",
    cutoffDate: "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for NEET is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for NEET is 17 years.",
    },
    response:
      "Thanks for providing your date of birth, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
  },
];

export const VITEEE_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "greeting",
    introductionLine1:
      "We know you’re aiming for success in VITEEE, and we’re here to help you every step of the way! With our personalized approach, you’ll build a solid foundation and be fully equipped to face any challenges ahead.",
    introductionLine2:
      "We believe in your potential and are committed to helping you achieve the best possible score!",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What's your name?",
    label: "",
    answerType: "text",
    response:
      "Your journey towards success starts now, [name]! We’re thrilled to be part of your path to achieving great things.",
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "category",
    question: "What's your caste/category?",
    label: "Category affects fee and reservation.",
    answerType: "dropdown",
    options: [
      { label: "General", value: "General" },
      { label: "EWS/ OBC (NCL)", value: "EWS/ OBC (NCL)" },
      { label: "SC / ST", value: "SC / ST" },
      { label: "PWD", value: "PWD" },
    ],
    responses: {
      General:
        "Thanks for sharing your details, [name]. You're on the right track—let’s aim high and get you the best preparation possible!",
      "EWS/ OBC (NCL)":
        "Thanks for sharing your details, [name]. You’re in good hands—let’s get you prepared for success with all the resources you need.",
      "SC / ST":
        "Thanks for sharing your details, [name]. You’ve got this! We’ll provide all the support you need to succeed in your exam journey.",
      PWD: "Thanks for sharing your details, [name]. We’re here to support you every step of the way, with tailored assistance and the resources you need for success.",
    },
    errorMessage: "Please select your category before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "nationality",
    question: "What is your nationality?",
    label: "This is to confirm eligibility for the exam based on nationality.",
    answerType: "dropdown",
    options: [
      { label: "Indian", value: "Indian" },
      {
        label: "Non-Resident of India (NRIs)",
        value: "Non-Resident of India (NRIs)",
      },
      {
        label: "Overseas Citizen of India (OCIs)",
        value: "Overseas Citizen of India (OCIs)",
      },
      { label: "Foreign Nationals", value: "Foreign Nationals" },
    ],
    responses: {
      Indian:
        "An Indian citizen is a person who is legally recognized as a national of India, either by birth, descent, or through the process of naturalization.",
      "Non-Resident of India (NRIs)":
        "A Non-Resident Indian (NRI) is an Indian citizen who lives outside India for work, business, or other reasons.",
      "Overseas Citizen of India (OCIs)":
        "An Overseas Citizen of India (OCI) is a foreign citizen of Indian origin who has been granted a special status by the Indian government, allowing some privileges but not full Indian citizenship.",
      "Foreign Nationals":
        "Foreign Nationals are individuals who are citizens of countries other than India and do not have any special status in India.",
    },
    errorMessage: "Please select your nationality before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "state_ut",
    question: "Which state/UT are you from?",
    label: "",
    answerType: "dropdown",

    options: [
      { label: "Andhra Pradesh", value: "Andhra Pradesh" },
      { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
      { label: "Assam", value: "Assam" },
      { label: "Bihar", value: "Bihar" },
      { label: "Chhattisgarh", value: "Chhattisgarh" },
      { label: "Goa", value: "Goa" },
      { label: "Gujarat", value: "Gujarat" },
      { label: "Haryana", value: "Haryana" },
      { label: "Himachal Pradesh", value: "Himachal Pradesh" },
      { label: "Jharkhand", value: "Jharkhand" },
      { label: "Karnataka", value: "Karnataka" },
      { label: "Kerala", value: "Kerala" },
      { label: "Madhya Pradesh", value: "Madhya Pradesh" },
      { label: "Maharashtra", value: "Maharashtra" },
      { label: "Manipur", value: "Manipur" },
      { label: "Meghalaya", value: "Meghalaya" },
      { label: "Mizoram", value: "Mizoram" },
      { label: "Nagaland", value: "Nagaland" },
      { label: "Odisha", value: "Odisha" },
      { label: "Punjab", value: "Punjab" },
      { label: "Rajasthan", value: "Rajasthan" },
      { label: "Sikkim", value: "Sikkim" },
      { label: "Tamil Nadu", value: "Tamil Nadu" },
      { label: "Telangana", value: "Telangana" },
      { label: "Tripura", value: "Tripura" },
      { label: "Uttar Pradesh", value: "Uttar Pradesh" },
      { label: "Uttarakhand", value: "Uttarakhand" },
      { label: "West Bengal", value: "West Bengal" },
      {
        label: "Andaman and Nicobar Islands",
        value: "Andaman and Nicobar Islands",
      },
      { label: "Chandigarh", value: "Chandigarh" },
      {
        label: "Dadra and Nagar Haveli and Daman and Diu",
        value: "Dadra and Nagar Haveli and Daman and Diu",
      },
      { label: "Delhi", value: "Delhi" },
      { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
      { label: "Ladakh", value: "Ladakh" },
      { label: "Lakshadweep", value: "Lakshadweep" },
      { label: "Puducherry", value: "Puducherry" },
    ],
    responses: {
      "Arunachal Pradesh":
        "Applicants from Arunachal Pradesh must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Assam:
        "Applicants from Assam must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Manipur:
        "Applicants from Manipur must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Meghalaya:
        "Applicants from Meghalaya must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Mizoram:
        "Applicants from Mizoram must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Nagaland:
        "Applicants from Nagaland must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Sikkim:
        "Applicants from Sikkim must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Tripura:
        "Applicants from Tripura must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      "Jammu and Kashmir":
        "Applicants from Jammu and Kashmir must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      Ladakh:
        "Applicants from Ladakh must produce a community/nativity certificate at counselling, otherwise admission will not be considered.",
      "Andhra Pradesh":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Bihar:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Chhattisgarh:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Goa: "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Gujarat:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Haryana:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "Himachal Pradesh":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Jharkhand:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Karnataka:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Kerala:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "Madhya Pradesh":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Maharashtra:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Odisha:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Punjab:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Rajasthan:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "Tamil Nadu":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Telangana:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Uttarakhand:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "Uttar Pradesh":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "West Bengal":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "Andaman and Nicobar Islands":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Chandigarh:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      "Dadra and Nagar Haveli and Daman and Diu":
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Delhi:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Lakshadweep:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
      Puducherry:
        "Thank you for providing your state/UT information. Please note certain state-specific counselling and eligibility criteria may apply, and you may also be eligible for regional language preferences during the exam.",
    },

    errorMessage: "Please select your state/UT before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "exam_center",
    question: "Will you opt for the exam center in India or outside India?",
    label: "To determine the exam fee and logistics.",
    answerType: "dropdown",
    options: [
      { label: "India", value: "India" },
      { label: "Outside India", value: "Outside India" },
    ],
    responses: {
      India:
        "Thanks for sharing your choice, [name]! Opting for an exam center in India means you’ll be able to focus on your preparation without worrying about travel logistics. We’re here to help you excel in your journey!",
      "Outside India":
        "Thanks for sharing your choice, [name]! Opting for an exam center outside India is an exciting opportunity. Let’s focus on your preparation and make sure you're ready for this international experience!",
    },
    errorMessage: "Please select your exam center before proceeding.",
  },
  // {
  //   category: "eligibility",
  //   categoryLabel: "Eligibility",
  //   subcategory: "exam_fee",
  //   question: "What is the fee for VITEEE based on my details?",
  //   label: "",
  //   answerType: "dropdown",
  //   options: [{ label: "Click to Know", value: "Click to Know" }],
  //   responses: {
  //     "Click to Know":
  //       "Thank you for providing your details! Based on the information you've entered, please find the fee details below. The fee is calculated according to your exam center, you've selected.",
  //   },
  //   errorMessage: "Please select an option before proceeding.",
  // },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "current_profile",
    question: "What is your current profile?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Class 11", value: "Class 11" },
      { label: "Class 12 Appearing", value: "Class 12 Appearing" },
      { label: "Class 12 Passed", value: "Class 12 Passed" },
    ],
    responses: {
      "Class 11":
        "Great to hear you’re in Class 11, [name]! You’ve made an excellent start by beginning your preparation early—keep up the hard work! The foundation you build this year will set you up for success in VITEEE and beyond. Stay focused, practice consistently, and keep progressing. You've got this!",
      "Class 12 Appearing":
        "You’re in the final stretch now, [name]! Stay focused, keep practicing, and make every day count toward your goal of success in VITEEE. Focus on refining your skills and staying disciplined in your preparation. This is your time to shine!",
      "Class 12 Passed":
        "You’ve already completed Class 12, [name], and now it’s time to refine your approach. Use your experience to target weak areas and improve your strategies for the upcoming exam. Stay consistent and disciplined—this year could be your best yet!",
    },
    errorMessage: "Please select your current profile before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "percentage_12th",
    question: "What is your percentage in Class 12?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Aggregate of 60% in PCM", value: "Aggregate of 60% in PCM" },
      {
        label: "Below 60% in PCM (Non-SC/ST or Non-Specific Region)",
        value: "Below 60% in PCM (Non-SC/ST or Non-Specific Region)",
      },
      {
        label: "Aggregate of 50% in PCM (SC/ST or Specific Region)",
        value: "Aggregate of 50% in PCM (SC/ST or Specific Region)",
      },
      { label: "Below 50% in PCM", value: "Below 50% in PCM" },
    ],
    responses: {
      "Aggregate of 60% in PCM":
        "Thanks for providing your response, [name]! Keep up the hard work and continue refining your preparation for the exam.",

      "Aggregate of 50% in PCM (SC/ST or Specific Region)":
        "Thanks for providing your response, [name]! Keep up the hard work and continue refining your preparation for the exam.",
    },
    errorResponse: {
      "Below 60% in PCM (Non-SC/ST or Non-Specific Region)":
        "Thanks for providing your response, [name]! Keep up the hard work and continue refining your preparation for the exam.",
      "Below 50% in PCM":
        "Thanks for providing your response, [name]! Keep up the hard work and continue refining your preparation for the exam.",
    },
    errorMessage: "Please select your percentage before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "dob",
    question: "What's your date of birth?",
    answerType: "date",
    minDate: vitEligibility.minDate,
    maxDate: vitEligibility.maxDate,
    cutoffDate: vitEligibility.cutoffDate,
    isError: false,
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Thanks for providing your date of birth, [name]! We'll use this information to determine your eligibility for the VITEEE exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
      greaterThanMaxDate:
        "Thanks for providing your date of birth, [name]! We'll use this information to determine your eligibility for the VITEEE exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for VITEEE is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for VITEEE is 17 years.",
    },
    response:
      "Thanks for providing your date of birth, [name]! We'll use this information to determine your eligibility for the VITEEE exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
  },
];

export const BITSAT_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "greeting",
    introductionLine1:
      "We know you’re aiming for success in BITSAT, and we’re here to make sure you’re fully equipped to reach your goals! Our personalized approach helps you build a strong foundation, ensuring you’re ready to take on every challenge that comes your way.",
    introductionLine2:
      "We believe in your potential, and we’re here to help you get the best score possible!",
    label: "Introduction",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What’s your name?",
    label: "",
    answerType: "text",
    response:
      "Hi [name]! Let’s get you one step closer to your dream career in the defense forces. Ready to begin?",
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "sessions_knowledge",
    question: "Do you know about the two sessions in the BITSAT exam?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
    ],
    responses: {
      Yes: "Great to hear you're familiar with the two sessions in BITSAT! This allows you to choose the most convenient session for you.",
      No: "The BITSAT Exam is organized into two separate sessions:\n\nSession-1:\n\n- This is the first round of the exam.\n- Candidates can choose to appear for just Session-1 if they prefer.\n- If a candidate only opts for Session-1, they will not be able to take Session-2 unless they apply separately for it during a second application window.\n\nSession-2:\n\n- This is the second round of the exam, which occurs after a few weeks from Session-1.\n- Candidates can choose to appear for just Session-2, even if they missed Session-1.\n- If a candidate appeared for Session-1, they can choose to take Session-2 as well, and their best score from either session will be considered for admission.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "session_preference",
    question: "For which session or sessions will you be appearing for BITSAT?",
    label: "To understand how you plan to approach the BITSAT exam.",
    answerType: "dropdown",
    options: [
      { label: "Session-1 Only", value: "Session-1 Only" },
      {
        label: "Both Session-1 & Session-2",
        value: "Both Session-1 & Session-2",
      },
    ],
    responses: {
      "Session-1 Only":
        "Great choice! Appearing for Session-1 will give you the opportunity to test your skills early. Remember, you can still apply for Session-2 later if you want to give it another shot. Best of luck preparing for the first session!",
      "Both Session-1 & Session-2":
        "Awesome! By appearing for both sessions, you’re giving yourself a chance to improve your score if needed. Your best score will be considered for admission, so you’ve got a good strategy in place. Best of luck with your preparation and both attempts!",
    },
    errorMessage: "Please select your session preference before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What's your gender?",
    label:
      "Because fee is decided by your gender for various categories and centers.",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Transgender", value: "Transgender" },
    ],
    responses: {
      Male: "Thanks for sharing your details, [name]. Your trust is important to us. Let’s get you one step closer to your goal!",
      Female:
        "Thanks for sharing your details, [name]. Your trust is important to us. We’re here to help you succeed every step of the way!",
      Transgender:
        "Thanks for sharing your details, [name]. Your trust is important to us. Together, we’ll make this journey one to remember!",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "exam_centre",
    question: "Will you opt for the exam center in India or outside India?",
    label: "To determine the fee of the candidate.",
    answerType: "dropdown",
    options: [
      { label: "India", value: "India" },
      { label: "Nepal", value: "Nepal" },
      { label: "Dubai", value: "Dubai" },
    ],
    responses: {
      India:
        "Thanks for sharing your choice, [name]! Opting for an exam center in India means you’ll be able to focus on your preparation without worrying about travel logistics. We’re here to help you excel in your journey!",
      Nepal:
        "Thanks for sharing your choice, [name]! Opting for Nepal as the exam center is an exciting opportunity. Let’s focus on your preparation and make sure you're ready for this international experience!",
      Dubai:
        "Thanks for sharing your choice, [name]! Opting for Dubai as the exam center is an exciting opportunity. Let’s focus on your preparation and make sure you're ready for this international experience!",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  // {
  //   category: "fee",
  //   categoryLabel: "Exam Fee",
  //   subcategory: "exam_fee",
  //   question: "What is the fee for BITSAT Exam based on my details?",
  //   label: "To calculate the exact fee for your BITSAT exam.",
  //   answerType: "dropdown",
  //   options: [{ label: "Click to Know", value: "Click to Know" }],
  //   responses: {
  //     "Click to Know":
  //       "Based on the information you've entered, here is the fee breakdown...",
  //   },
  //   errorMessage: "Please click to know the fee.",
  // },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "profile",
    question: "What's your current profile?",
    label:
      "To understand your current academic status and tailor our guidance.",
    answerType: "dropdown",
    options: [
      { label: "Appearing 12th Grade", value: "Appearing 12th Grade" },
      { label: "Passed 12th Grade", value: "Passed 12th Grade" },
    ],
    responses: {
      "Appearing 12th Grade":
        "With only one year to go, [name], stay focused, stay determined, and make every moment count toward your success! Every single day is an opportunity to get closer to your dream college. Maximize your study routine, practice mock tests, and keep revising important concepts. You've got what it takes to excel!",
      "Passed 12th Grade":
        "Smart preparation and steady effort will turn your aspirations into achievements, [name]. Keep pushing forward! You’ve already laid a strong foundation, and now it’s time to refine your strategies and work on weak areas. Be consistent, stay disciplined, and use this year to your advantage",
    },
    errorMessage: "Please select your current profile before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "subjects",
    question:
      "Have you completed your 12th-grade exams under the 10+2 system with Physics, Chemistry, Mathematics, one language and one additional subject?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Yes, I have", value: "Yes, I have" },
      { label: "No, I don't", value: "No, I don't" },
    ],
    responses: {
      "Yes, I have":
        "Thanks for sharing your response, [name]! We'll use this info to ensure you're provided with the most accurate details regarding your eligibility and any age-specific benefits, if applicable.",
      // "No, I don't":
      //   "Thanks for sharing your details, [name]. Your trust is important to us. Based on the eligibility criteria of the BITSAT examination, you are not eligible for this examination!",
    },
    errorResponse: {
      "No, I don't":
        "Thanks for sharing your response, [name]! We'll use this info to ensure you're provided with the most accurate details regarding your eligibility and any age-specific benefits, if applicable.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "percentage_in_12th",
    question:
      "Did you secure at least 75% aggregate marks in Physics, Chemistry and Mathematics, with at least 60% in each subject individually?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Yes, I have", value: "Yes, I have" },
      { label: "No, I don't", value: "No, I don't" },
      {
        label: "I am appearing for 12th and have not received marks yet.",
        value: "Pending",
      },
    ],
    responses: {
      "Yes, I have":
        "Thanks for sharing your response, [name]! We'll use this info to ensure you're provided with the most accurate details regarding your eligibility and any age-specific benefits, if applicable.",
      // "No, I don't":
      //   "Unfortunately, you don’t meet the BITSAT eligibility criteria based on your marks.",
      Pending:
        "Thanks for sharing your response, [name]! We'll use this info to ensure you're provided with the most accurate details regarding your eligibility and any age-specific benefits, if applicable.",
    },
    errorResponse: {
      "No, I don't":
        "Thanks for sharing your response, [name]! We'll use this info to ensure you're provided with the most accurate details regarding your eligibility and any age-specific benefits, if applicable.",
    },
    errorMessage: "Please select an option before proceeding.",
  },
  {
    category: "academic_eligibility_check",
    categoryLabel: "Eligibility",
    subcategory: "dob",
    question: "What's your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2008-12-31",
    cutoffDate: "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for NEET is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for NEET is 17 years.",
    },
    response:
      "Thanks for providing your date of birth, [name]! We'll use this information to determine your eligibility for the JEE Mains exam and ensure you receive all the relevant updates regarding your age category and any age relaxations you may be eligible for.",
  },
];

export const Matrics_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "greeting",
    introductionLine1: "Ready to Build Your Perfect Study Plan?",
    introductionLine2: "",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What’s your full name?",
    label: "",
    answerType: "text",
    response:
      "Your journey towards success starts now, [name]! We’re thrilled to be part of your path to achieving great things.",
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What's your gender?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
    responses: {
      Male: "Hi [name]! Excited to help you chase your dreams—let’s keep going!",
      Female:
        "Hi [name]! Excited to help you chase your dreams—let’s keep going!",
      Other:
        "Hi [name]! Excited to help you chase your dreams—let’s keep going!",
    },
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "year_of_passing",
    question: "What’s your nationality?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "India", value: "india" },
      { label: "Outside India", value: "outside_india" },
    ],
    responses: {
      india:
        "Thanks for sharing, [name] We’re building something special for you!",
      outside_india:
        "Thanks for sharing, [name] We’re building something special for you!",
    },
    errorResponse: {
      "Earlier than 2023":
        "Thanks for sharing, [name]! Since you passed school before 2023, you are not eligible to attempt the JEE Mains 2023. You are eligible for the last attempt in 2024, as applicants can avail of attempts for 3 consecutive years after passing out from school (Class 12th examination)",
    },
    errorComment: {
      "Earlier than 2023":
        "Based on your passing year (2022), you could attempt JEE Main until 2024.",
    },
    errorMessage: "Please select a year before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "state_ut",
    question: "Which State/UT are you from?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Andhra Pradesh", value: "Andhra Pradesh" },
      { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
      { label: "Assam", value: "Assam" },
      { label: "Bihar", value: "Bihar" },
      { label: "Chhattisgarh", value: "Chhattisgarh" },
      { label: "Goa", value: "Goa" },
      { label: "Gujarat", value: "Gujarat" },
      { label: "Haryana", value: "Haryana" },
      { label: "Himachal Pradesh", value: "Himachal Pradesh" },
      { label: "Jharkhand", value: "Jharkhand" },
      { label: "Karnataka", value: "Karnataka" },
      { label: "Kerala", value: "Kerala" },
      { label: "Madhya Pradesh", value: "Madhya Pradesh" },
      { label: "Maharashtra", value: "Maharashtra" },
      { label: "Manipur", value: "Manipur" },
      { label: "Meghalaya", value: "Meghalaya" },
      { label: "Mizoram", value: "Mizoram" },
      { label: "Nagaland", value: "Nagaland" },
      { label: "Odisha", value: "Odisha" },
      { label: "Punjab", value: "Punjab" },
      { label: "Rajasthan", value: "Rajasthan" },
      { label: "Sikkim", value: "Sikkim" },
      { label: "Tamil Nadu", value: "Tamil Nadu" },
      { label: "Telangana", value: "Telangana" },
      { label: "Tripura", value: "Tripura" },
      { label: "Uttar Pradesh", value: "Uttar Pradesh" },
      { label: "Uttarakhand", value: "Uttarakhand" },
      { label: "West Bengal", value: "West Bengal" },
      {
        label: "Andaman and Nicobar Islands",
        value: "Andaman and Nicobar Islands",
      },
      { label: "Chandigarh", value: "Chandigarh" },
      {
        label: "Dadra and Nagar Haveli and Daman and Diu",
        value: "Dadra and Nagar Haveli and Daman and Diu",
      },
      { label: "Delhi", value: "Delhi" },
      { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
      { label: "Ladakh", value: "Ladakh" },
      { label: "Lakshadweep", value: "Lakshadweep" },
      { label: "Puducherry", value: "Puducherry" },
    ],
    response:
      "Great to know you’re in India! We’ll tailor your plan with local exams and resources in mind.",
    errorMessage: "Please select your state/UT before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "category",
    question: "Which category do you belong to?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "General", value: "General" },
      { label: "EWS/ OBC (NCL)", value: "EWS/ OBC (NCL)" },
      { label: "SC / ST", value: "SC / ST" },
      { label: "PWD", value: "PWD" },
    ],
    responses: {
      General: "Thanks for the info, [name] Let’s shape your path to success!",
      "EWS/ OBC (NCL)":
        "Thanks for sharing your details, [name]. You’re in good hands—let’s get you prepared for success with all the resources you need.",
      "SC / ST":
        "Thanks for sharing your details, [name]. You’ve got this! We’ll provide all the support you need to succeed in your exam journey.",
      PWD: "Thanks for sharing your details, [name]. We’re here to support you every step of the way, with tailored assistance and the resources you need for success.",
    },
    subQuestions: {
      _any: [
        {
          question: "Which stream are you pursuing?",
          label: "",
          answerType: "dropdown",
          options: [
            { label: "Science (PCM)", value: "Science (PCM)" },
            { label: "Science (PCB)", value: "Science (PCB)" },
            { label: "Commerce", value: "Commerce" },
            { label: "Agriculture", value: "Agriculture" },
            { label: "Humanities / Arts", value: "Humanities / Arts" },
          ],
          responses: {
            "Science (PCM)":
              "PCM opens doors to engineering, tech, and more. Let’s explore your options!",
            "Science (PCB)":
              "PCB opens doors to agriculture, biotechnology, and more. Let’s explore your options!",
          },
          errorMessage: "Please select your option before proceeding.",
          subQuestions: {
            "Science (PCM)": [
              {
                question:
                  "Do you know specific career options in your Science (PCM) stream?",
                label: "",
                answerType: "dropdown",
                options: [
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ],
                responses: {
                  Yes: "PCM opens doors to engineering, tech, and more. Let’s explore your options!",
                  No: "No stress! We’ll introduce you to exciting career paths for your stream.",
                },
                subQuestions: {
                  _any: [
                    {
                      question: "Which career option interests you?",
                      label: "",
                      answerType: "dropdown",
                      options: [
                        {
                          label: "Hardcore Engineering",
                          value: "Hardcore Engineering",
                        },
                        {
                          label: "Defence (After 12th) – Army, Navy, Air Force",
                          value: "Defence (After 12th) – Army, Navy, Air Force",
                        },
                        {
                          label:
                            "Defence (After Graduation) – Army, Navy, Air Force",
                          value:
                            "Defence (After Graduation) – Army, Navy, Air Force",
                        },
                        {
                          label: "Defence: Paramilitary Forces Officer",
                          value: "Defence: Paramilitary Forces Officer",
                        },
                        {
                          label: "Manager / Analyst (Corporate Sector)",
                          value: "Manager / Analyst (Corporate Sector)",
                        },
                        {
                          label: "Finance (Investment Banker, Analyst)",
                          value: "Finance (Investment Banker, Analyst)",
                        },
                        {
                          label: "Government Jobs (Bank/SSC/Railway)",
                          value: "Government Jobs (Bank/SSC/Railway)",
                        },
                        {
                          label: "Law (Corporate Lawyer)",
                          value: "Law (Corporate Lawyer)",
                        },
                        {
                          label: "Civil Services (IAS/IPS/IFS)",
                          value: "Civil Services (IAS/IPS/IFS)",
                        },
                        {
                          label: "Teaching (Maths/Science)",
                          value: "Teaching (Maths/Science)",
                        },
                      ],
                      responses: {
                        "Hardcore Engineering":
                          "Hardcore Engineering sounds exciting! Let’s see how to make it yours.",
                        "Defence (After 12th) – Army, Navy, Air Force":
                          "Defence is a noble profession. Let’s explore the options.",
                        "Defence (After Graduation) – Army, Navy, Air Force":
                          "Defence is a noble profession. Let’s explore the options.",
                        "Defence: Paramilitary Forces Officer":
                          "Defence is a noble profession. Let’s explore the options.",
                        "Manager / Analyst (Corporate Sector)":
                          "Great choice! Let’s explore the corporate world.",
                        "Finance (Investment Banker, Analyst)":
                          "Finance is a dynamic field. Let’s explore together.",
                        "Government Jobs (Bank/SSC/Railway)":
                          "Government jobs offer stability. Let’s explore together.",
                        "Law (Corporate Lawyer)":
                          "Law is a fascinating field. Let’s explore together.",
                        "Civil Services (IAS/IPS/IFS)":
                          "Civil services are a noble profession. Let’s explore together.",
                        "Teaching (Maths/Science)":
                          "Teaching is a noble profession. Let’s explore together.",
                      },
                      subQuestions: {
                        "Hardcore Engineering": [
                          {
                            question:
                              "What’s the process for Hardcore Engineering?",
                            label: "",
                            answerType: "dropdown",
                            options: [
                              {
                                label: "12th PCM → B.Tech",
                                value: "12th PCM → B.Tech",
                              },
                            ],
                            responses: {
                              "Hardcore Engineering":
                                "The 12th PCM → B.Tech path is clear. Let’s pick your specialization!",
                            },
                            subQuestions: {
                              "12th PCM → B.Tech": [
                                {
                                  question:
                                    "Ready to focus on 12th CBSE prep for Computer Science (CSE)?",
                                  label: "",
                                  answerType: "dropdown",
                                  options: [
                                    {
                                      label: "Yes, Go Ahead",
                                      value: "Yes, Go Ahead",
                                    },
                                    {
                                      label:
                                        "No, Want to Explore Other Streams Also",
                                      value:
                                        "No, Want to Explore Other Streams Also",
                                    },
                                  ],
                                  responses: {
                                    "Yes, Go Ahead":
                                      "Let’s dive into CBSE prep for Computer Science (CSE)! You’re on the right track.",
                                  },
                                  subQuestions: {
                                    "Yes, Go Ahead": [
                                      {
                                        question:
                                          "What’s your desired 12th percentage?",
                                        label: "",
                                        answerType: "dropdown",
                                        options: [
                                          {
                                            label: "60-80%",
                                            value: "60-80%",
                                          },
                                          {
                                            label: "81-90%",
                                            value: "81-90%",
                                          },
                                          {
                                            label: "91-100%",
                                            value: "91-100%",
                                          },
                                        ],
                                        responses: {
                                          "60-80%":
                                            "Solid goal, [name]! We’ll help you hit that mark with confidence.",
                                          "81-90%":
                                            "Solid goal, [name]! We’ll help you hit that mark with confidence.",
                                          "91-100%":
                                            "Solid goal, [name]! We’ll help you hit that mark with confidence.",
                                        },
                                        subQuestions: {
                                          _any: [
                                            {
                                              question:
                                                "How motivated are you to study? (1-10)",
                                              label: "",
                                              answerType: "dropdown",
                                              options: [
                                                {
                                                  label: "1-5",
                                                  value: "1-5",
                                                },
                                                {
                                                  label: "6-8",
                                                  value: "6-8",
                                                },
                                                {
                                                  label: "9-10",
                                                  value: "9-10",
                                                },
                                              ],
                                              responses: {
                                                "1-5":
                                                  "Your drive is inspiring! Let’s channel it into big wins.",
                                                "6-8":
                                                  "Your drive is inspiring! Let’s channel it into big wins.",
                                                "9-10":
                                                  "Your drive is inspiring! Let’s channel it into big wins.",
                                              },
                                              subQuestions: {
                                                _any: [
                                                  {
                                                    question:
                                                      "What distracts you most while studying?",
                                                    label: "",
                                                    answerType: "dropdown",
                                                    options: [
                                                      {
                                                        label:
                                                          "Phone / Social Media",
                                                        value:
                                                          "Phone / Social Media",
                                                      },
                                                      {
                                                        label: "Friends",
                                                        value: "Friends",
                                                      },
                                                      {
                                                        label: "Laziness",
                                                        value: "Laziness",
                                                      },
                                                      {
                                                        label: "Nothing",
                                                        value: "Nothing",
                                                      },
                                                    ],
                                                    responses: {
                                                      "Phone / Social Media":
                                                        "Phones can be tricky! Try app blockers and reward yourself after studying.",
                                                      Friends:
                                                        "Friends can be tricky! Try app blockers and reward yourself after studying.",
                                                      Laziness:
                                                        "Laziness can be tricky! Try app blockers and reward yourself after studying.",
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                          No: [
                                            {
                                              question:
                                                "Let us suggest some career paths based on your stream",
                                              label: "",
                                              answerType: "info",
                                              content:
                                                "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    No: [
                                      {
                                        question:
                                          "Let us suggest some career paths based on your stream",
                                        label: "",
                                        answerType: "info",
                                        content:
                                          "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                      },
                                    ],
                                  },
                                },
                              ],
                              No: [
                                {
                                  question:
                                    "Let us suggest some career paths based on your stream",
                                  label: "",
                                  answerType: "info",
                                  content:
                                    "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                },
                              ],
                            },
                          },
                        ],
                        No: [
                          {
                            question:
                              "Let us suggest some career paths based on your stream",
                            label: "",
                            answerType: "info",
                            content:
                              "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                          },
                        ],
                      },
                    },
                  ],
                  No: [
                    {
                      question:
                        "Let us suggest some career paths based on your stream",
                      label: "",
                      answerType: "info",
                      content:
                        "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                    },
                  ],
                },
              },
            ],
            No: [
              {
                question:
                  "Let us suggest some career paths based on your stream",
                label: "",
                answerType: "info",
                content:
                  "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
              },
            ],
          },
        },
      ],
    },
    errorMessage: "Please select your category before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "dob",
    question: "What’s your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2008-12-31",
    cutoffDate: "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },

    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for VITEEE is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for VITEEE is 17 years.",
    },
    response:
      "Thank you for providing your details. As per the exam requirements, your age has been successfully recorded.",
  },
];

export const SecondaryHigh_Science_Questionnaire = [
  {
    category: "introduction",
    categoryLabel: "Introduction",
    subcategory: "greeting",
    introductionLine1: "Ready to Build Your Perfect Study Plan?",
    introductionLine2: "",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "name",
    question: "What’s your full name?",
    label: "",
    answerType: "text",
    response:
      "Your journey towards success starts now, [name]! We’re thrilled to be part of your path to achieving great things.",
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "gender",
    question: "What's your gender?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ],
    responses: {
      Male: "Hi [name]! Excited to help you chase your dreams—let’s keep going!",
      Female:
        "Hi [name]! Excited to help you chase your dreams—let’s keep going!",
      Other:
        "Hi [name]! Excited to help you chase your dreams—let’s keep going!",
    },
    errorMessage: "Please provide a response before continuing.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "year_of_passing",
    question: "What’s your nationality?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "India", value: "india" },
      { label: "Outside India", value: "outside_india" },
    ],
    responses: {
      india:
        "Thanks for sharing, [name] We’re building something special for you!",
      outside_india:
        "Thanks for sharing, [name] We’re building something special for you!",
    },
    errorResponse: {
      "Earlier than 2023":
        "Thanks for sharing, [name]! Since you passed school before 2023, you are not eligible to attempt the JEE Mains 2023. You are eligible for the last attempt in 2024, as applicants can avail of attempts for 3 consecutive years after passing out from school (Class 12th examination)",
    },
    errorComment: {
      "Earlier than 2023":
        "Based on your passing year (2022), you could attempt JEE Main until 2024.",
    },
    errorMessage: "Please select a year before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "state_ut",
    question: "Which State/UT are you from?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "Andhra Pradesh", value: "Andhra Pradesh" },
      { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
      { label: "Assam", value: "Assam" },
      { label: "Bihar", value: "Bihar" },
      { label: "Chhattisgarh", value: "Chhattisgarh" },
      { label: "Goa", value: "Goa" },
      { label: "Gujarat", value: "Gujarat" },
      { label: "Haryana", value: "Haryana" },
      { label: "Himachal Pradesh", value: "Himachal Pradesh" },
      { label: "Jharkhand", value: "Jharkhand" },
      { label: "Karnataka", value: "Karnataka" },
      { label: "Kerala", value: "Kerala" },
      { label: "Madhya Pradesh", value: "Madhya Pradesh" },
      { label: "Maharashtra", value: "Maharashtra" },
      { label: "Manipur", value: "Manipur" },
      { label: "Meghalaya", value: "Meghalaya" },
      { label: "Mizoram", value: "Mizoram" },
      { label: "Nagaland", value: "Nagaland" },
      { label: "Odisha", value: "Odisha" },
      { label: "Punjab", value: "Punjab" },
      { label: "Rajasthan", value: "Rajasthan" },
      { label: "Sikkim", value: "Sikkim" },
      { label: "Tamil Nadu", value: "Tamil Nadu" },
      { label: "Telangana", value: "Telangana" },
      { label: "Tripura", value: "Tripura" },
      { label: "Uttar Pradesh", value: "Uttar Pradesh" },
      { label: "Uttarakhand", value: "Uttarakhand" },
      { label: "West Bengal", value: "West Bengal" },
      {
        label: "Andaman and Nicobar Islands",
        value: "Andaman and Nicobar Islands",
      },
      { label: "Chandigarh", value: "Chandigarh" },
      {
        label: "Dadra and Nagar Haveli and Daman and Diu",
        value: "Dadra and Nagar Haveli and Daman and Diu",
      },
      { label: "Delhi", value: "Delhi" },
      { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
      { label: "Ladakh", value: "Ladakh" },
      { label: "Lakshadweep", value: "Lakshadweep" },
      { label: "Puducherry", value: "Puducherry" },
    ],
    response:
      "Great to know you’re in India! We’ll tailor your plan with local exams and resources in mind.",
    errorMessage: "Please select your state/UT before proceeding.",
  },
  {
    category: "personal_information",
    categoryLabel: "Personal Information",
    subcategory: "category",
    question: "Which category do you belong to?",
    label: "",
    answerType: "dropdown",
    options: [
      { label: "General", value: "General" },
      { label: "EWS/ OBC (NCL)", value: "EWS/ OBC (NCL)" },
      { label: "SC / ST", value: "SC / ST" },
      { label: "PWD", value: "PWD" },
    ],
    responses: {
      General: "Thanks for the info, [name] Let’s shape your path to success!",
      "EWS/ OBC (NCL)":
        "Thanks for sharing your details, [name]. You’re in good hands—let’s get you prepared for success with all the resources you need.",
      "SC / ST":
        "Thanks for sharing your details, [name]. You’ve got this! We’ll provide all the support you need to succeed in your exam journey.",
      PWD: "Thanks for sharing your details, [name]. We’re here to support you every step of the way, with tailored assistance and the resources you need for success.",
    },
    subQuestions: {
      _any: [
        {
          question: "When did/will you pass Class 10th?",
          label: "",
          answerType: "dropdown",
          options: [
            { label: "2015", value: "2015" },
            { label: "2016", value: "2016" },
            { label: "2017", value: "2017" },
            { label: "2018", value: "2018" },
            { label: "2019", value: "2019" },
            { label: "2020", value: "2020" },
            { label: "2021", value: "2021" },
            { label: "2022", value: "2022" },
            { label: "2023", value: "2023" },
            { label: "2024", value: "2024" },
            { label: "2025", value: "2025" },
          ],
          responses: {
            2015: "Thanks for sharing your Class 10th year. This helps us customize your next steps!",
            2024: "Thanks for sharing your Class 10th year. This helps us customize your next steps!",
            2025: "Thanks for sharing your Class 10th year. This helps us customize your next steps!",
          },
          subQuestions: {
            _any: [
              {
                question: "Which stream are you pursuing?",
                label: "",
                answerType: "dropdown",
                options: [
                  { label: "Science (PCM)", value: "Science (PCM)" },
                  { label: "Science (PCB)", value: "Science (PCB)" },
                  { label: "Commerce", value: "Commerce" },
                  { label: "Agriculture", value: "Agriculture" },
                  { label: "Humanities / Arts", value: "Humanities / Arts" },
                ],
                responses: {
                  "Science (PCM)":
                    "PCM opens doors to engineering, tech, and more. Let’s explore your options!",
                  "Science (PCB)":
                    "PCB opens doors to agriculture, biotechnology, and more. Let’s explore your options!",
                },
                errorMessage: "Please select your option before proceeding.",
                subQuestions: {
                  "Science (PCM)": [
                    {
                      question:
                        "Do you know specific career options in your Science (PCM) stream?",
                      label: "",
                      answerType: "dropdown",
                      options: [
                        { label: "Yes", value: "Yes" },
                        { label: "No", value: "No" },
                      ],
                      responses: {
                        Yes: "PCM opens doors to engineering, tech, and more. Let’s explore your options!",
                        No: "No stress! We’ll introduce you to exciting career paths for your stream.",
                      },
                      subQuestions: {
                        _any: [
                          {
                            question: "Which career option interests you?",
                            label: "",
                            answerType: "dropdown",
                            options: [
                              {
                                label: "Hardcore Engineering",
                                value: "Hardcore Engineering",
                              },
                              {
                                label:
                                  "Defence (After 12th) – Army, Navy, Air Force",
                                value:
                                  "Defence (After 12th) – Army, Navy, Air Force",
                              },
                              {
                                label:
                                  "Defence (After Graduation) – Army, Navy, Air Force",
                                value:
                                  "Defence (After Graduation) – Army, Navy, Air Force",
                              },
                              {
                                label: "Defence: Paramilitary Forces Officer",
                                value: "Defence: Paramilitary Forces Officer",
                              },
                              {
                                label: "Manager / Analyst (Corporate Sector)",
                                value: "Manager / Analyst (Corporate Sector)",
                              },
                              {
                                label: "Finance (Investment Banker, Analyst)",
                                value: "Finance (Investment Banker, Analyst)",
                              },
                              {
                                label: "Government Jobs (Bank/SSC/Railway)",
                                value: "Government Jobs (Bank/SSC/Railway)",
                              },
                              {
                                label: "Law (Corporate Lawyer)",
                                value: "Law (Corporate Lawyer)",
                              },
                              {
                                label: "Civil Services (IAS/IPS/IFS)",
                                value: "Civil Services (IAS/IPS/IFS)",
                              },
                              {
                                label: "Teaching (Maths/Science)",
                                value: "Teaching (Maths/Science)",
                              },
                            ],
                            responses: {
                              "Hardcore Engineering":
                                "Hardcore Engineering sounds exciting! Let’s see how to make it yours.",
                              "Defence (After 12th) – Army, Navy, Air Force":
                                "Defence is a noble profession. Let’s explore the options.",
                              "Defence (After Graduation) – Army, Navy, Air Force":
                                "Defence is a noble profession. Let’s explore the options.",
                              "Defence: Paramilitary Forces Officer":
                                "Defence is a noble profession. Let’s explore the options.",
                              "Manager / Analyst (Corporate Sector)":
                                "Great choice! Let’s explore the corporate world.",
                              "Finance (Investment Banker, Analyst)":
                                "Finance is a dynamic field. Let’s explore together.",
                              "Government Jobs (Bank/SSC/Railway)":
                                "Government jobs offer stability. Let’s explore together.",
                              "Law (Corporate Lawyer)":
                                "Law is a fascinating field. Let’s explore together.",
                              "Civil Services (IAS/IPS/IFS)":
                                "Civil services are a noble profession. Let’s explore together.",
                              "Teaching (Maths/Science)":
                                "Teaching is a noble profession. Let’s explore together.",
                            },
                            subQuestions: {
                              "Hardcore Engineering": [
                                {
                                  question:
                                    "What’s the process for Hardcore Engineering?",
                                  label: "",
                                  answerType: "dropdown",
                                  options: [
                                    {
                                      label: "12th PCM → B.Tech",
                                      value: "12th PCM → B.Tech",
                                    },
                                  ],
                                  responses: {
                                    "Hardcore Engineering":
                                      "The 12th PCM → B.Tech path is clear. Let’s pick your specialization!",
                                  },
                                  subQuestions: {
                                    "12th PCM → B.Tech": [
                                      {
                                        question:
                                          "Ready to focus on 12th CBSE prep for Computer Science (CSE)?",
                                        label: "",
                                        answerType: "dropdown",
                                        options: [
                                          {
                                            label: "Yes, Go Ahead",
                                            value: "Yes, Go Ahead",
                                          },
                                          {
                                            label:
                                              "No, Want to Explore Other Streams Also",
                                            value:
                                              "No, Want to Explore Other Streams Also",
                                          },
                                        ],
                                        responses: {
                                          "Yes, Go Ahead":
                                            "Let’s dive into CBSE prep for Computer Science (CSE)! You’re on the right track.",
                                        },
                                        subQuestions: {
                                          "Yes, Go Ahead": [
                                            {
                                              question:
                                                "What’s your desired 12th percentage?",
                                              label: "",
                                              answerType: "dropdown",
                                              options: [
                                                {
                                                  label: "60-80%",
                                                  value: "60-80%",
                                                },
                                                {
                                                  label: "81-90%",
                                                  value: "81-90%",
                                                },
                                                {
                                                  label: "91-100%",
                                                  value: "91-100%",
                                                },
                                              ],
                                              responses: {
                                                "60-80%":
                                                  "Solid goal, [name]! We’ll help you hit that mark with confidence.",
                                                "81-90%":
                                                  "Solid goal, [name]! We’ll help you hit that mark with confidence.",
                                                "91-100%":
                                                  "Solid goal, [name]! We’ll help you hit that mark with confidence.",
                                              },
                                              subQuestions: {
                                                _any: [
                                                  {
                                                    question:
                                                      "How motivated are you to study? (1-10)",
                                                    label: "",
                                                    answerType: "dropdown",
                                                    options: [
                                                      {
                                                        label: "1-5",
                                                        value: "1-5",
                                                      },
                                                      {
                                                        label: "6-8",
                                                        value: "6-8",
                                                      },
                                                      {
                                                        label: "9-10",
                                                        value: "9-10",
                                                      },
                                                    ],
                                                    responses: {
                                                      "1-5":
                                                        "Your drive is inspiring! Let’s channel it into big wins.",
                                                      "6-8":
                                                        "Your drive is inspiring! Let’s channel it into big wins.",
                                                      "9-10":
                                                        "Your drive is inspiring! Let’s channel it into big wins.",
                                                    },
                                                    subQuestions: {
                                                      _any: [
                                                        {
                                                          question:
                                                            "What distracts you most while studying?",
                                                          label: "",
                                                          answerType:
                                                            "dropdown",
                                                          options: [
                                                            {
                                                              label:
                                                                "Phone / Social Media",
                                                              value:
                                                                "Phone / Social Media",
                                                            },
                                                            {
                                                              label: "Friends",
                                                              value: "Friends",
                                                            },
                                                            {
                                                              label: "Laziness",
                                                              value: "Laziness",
                                                            },
                                                            {
                                                              label: "Nothing",
                                                              value: "Nothing",
                                                            },
                                                          ],
                                                          responses: {
                                                            "Phone / Social Media":
                                                              "Phones can be tricky! Try app blockers and reward yourself after studying.",
                                                            Friends:
                                                              "Friends can be tricky! Try app blockers and reward yourself after studying.",
                                                            Laziness:
                                                              "Laziness can be tricky! Try app blockers and reward yourself after studying.",
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                No: [
                                                  {
                                                    question:
                                                      "Let us suggest some career paths based on your stream",
                                                    label: "",
                                                    answerType: "info",
                                                    content:
                                                      "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                          No: [
                                            {
                                              question:
                                                "Let us suggest some career paths based on your stream",
                                              label: "",
                                              answerType: "info",
                                              content:
                                                "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    No: [
                                      {
                                        question:
                                          "Let us suggest some career paths based on your stream",
                                        label: "",
                                        answerType: "info",
                                        content:
                                          "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                      },
                                    ],
                                  },
                                },
                              ],
                              No: [
                                {
                                  question:
                                    "Let us suggest some career paths based on your stream",
                                  label: "",
                                  answerType: "info",
                                  content:
                                    "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                                },
                              ],
                            },
                          },
                        ],
                        No: [
                          {
                            question:
                              "Let us suggest some career paths based on your stream",
                            label: "",
                            answerType: "info",
                            content:
                              "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                          },
                        ],
                      },
                    },
                  ],
                  No: [
                    {
                      question:
                        "Let us suggest some career paths based on your stream",
                      label: "",
                      answerType: "info",
                      content:
                        "Based on Science stream, consider these options: Engineering, Medical, Research, or Defense careers.",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    errorMessage: "Please select your category before proceeding.",
  },
  {
    category: "eligibility",
    categoryLabel: "Eligibility",
    subcategory: "dob",
    question: "What’s your date of birth?",
    answerType: "date",
    minDate: "1994-01-01",
    maxDate: "2008-12-31",
    cutoffDate: "2025-12-31",
    errorMessage: "Please provide your date of birth before proceeding.",
    errorResponse: {
      lessThenminDate:
        "Oops! You seem to be above the maximum eligible age of 31. Your age as of [cutoffDate]: [age] years.",
      greaterThanMaxDate:
        "You must be at least 17 years old by [cutoffDate]. Your current age: [age] years.",
    },
    errorComment: {
      noValue: "Please select your date of birth to continue.",
      lessThenminDate: "Maximum age limit for VITEEE is 31 years.",
      greaterThanMaxDate: "Minimum age requirement for VITEEE is 17 years.",
    },
    response:
      "Thank you for providing your details. As per the exam requirements, your age has been successfully recorded.",
  },
];
