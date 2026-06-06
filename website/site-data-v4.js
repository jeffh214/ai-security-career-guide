/** v4: compliance, bounty, badges, platform rooms, match quiz, i18n, extra labs */

const BADGES = [
  { id: "first-lab", name: "First Blood", desc: "Complete any interactive lab", icon: "🧪" },
  { id: "streak-3", name: "On Fire", desc: "3-day study streak", icon: "🔥" },
  { id: "streak-7", name: "Week Warrior", desc: "7-day study streak", icon: "⚡" },
  { id: "streak-30", name: "Dedicated", desc: "30-day study streak", icon: "🏆" },
  { id: "phase-1", name: "Linux Initiate", desc: "Complete Phase 1", icon: "🐧" },
  { id: "video-5", name: "Binge Learner", desc: "Watch 5 videos", icon: "📺" },
  { id: "flash-50", name: "Card Shark", desc: "Review 50 flashcards", icon: "🃏" },
  { id: "quiz-pass", name: "Cert Ready", desc: "Pass a cert quiz (70%+)", icon: "✅" },
  { id: "portfolio", name: "Job Hunter", desc: "Export portfolio PDF", icon: "📄" },
  { id: "notes-5", name: "Chronicler", desc: "Add notes to 5 phases", icon: "📝" },
];

const PLATFORM_ROOMS = {
  "phase-1": [
    { label: "TryHackMe — Linux Fundamentals Part 1", url: "https://tryhackme.com/room/linuxfundamentalspart1" },
    { label: "TryHackMe — Linux Fundamentals Part 2", url: "https://tryhackme.com/room/linuxfundamentalspart2" },
    { label: "HTB Academy — Linux Fundamentals", url: "https://academy.hackthebox.com/" },
  ],
  "phase-2": [
    { label: "TryHackMe — Python Basics", url: "https://tryhackme.com/room/pythonbasics" },
    { label: "TryHackMe — Scripting", url: "https://tryhackme.com/room/scripting" },
  ],
  "phase-4": [
    { label: "TryHackMe — Pre Security (full path)", url: "https://tryhackme.com/path/outline/presecurity" },
    { label: "TryHackMe — Intro to Offensive Security", url: "https://tryhackme.com/room/introtooffensivesecurity" },
    { label: "TryHackMe — Phishing", url: "https://tryhackme.com/room/phishing" },
  ],
  "phase-5": [
    { label: "TryHackMe — OWASP Top 10", url: "https://tryhackme.com/room/owasptop10" },
    { label: "TryHackMe — Jr Penetration Tester path", url: "https://tryhackme.com/path/outline/jrpenetrationtester" },
    { label: "PortSwigger — SQL Injection", url: "https://portswigger.net/web-security/sql-injection" },
  ],
  "phase-6": [
    { label: "AIRT Module 1 — Prompt Injection", url: "https://0x4d31.github.io/airt/" },
    { label: "HTB Academy — AI Red Teamer", url: "https://academy.hackthebox.com/path/preview/ai-red-teamer" },
  ],
};

const COMPLIANCE_TRACK = [
  {
    framework: "NIST AI RMF",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    summary: "US government framework for managing AI risks across design, development, deployment, and use.",
    phases: ["Govern", "Map", "Measure", "Manage"],
    aiSecRelevance: "Use when building AI governance programs or responding to enterprise RFPs requiring NIST alignment.",
  },
  {
    framework: "ISO/IEC 42001",
    url: "https://www.iso.org/standard/81230.html",
    summary: "International standard for AI management systems — organizational certification, not individual.",
    phases: ["Context", "Leadership", "Planning", "Support", "Operation", "Evaluation", "Improvement"],
    aiSecRelevance: "Relevant for AI Governance / Risk Specialist career lane.",
  },
  {
    framework: "EU AI Act",
    url: "https://artificialintelligenceact.eu/",
    summary: "EU regulation classifying AI systems by risk level (unacceptable, high, limited, minimal).",
    phases: ["Risk classification", "Conformity assessment", "Transparency obligations", "Penalties"],
    aiSecRelevance: "High-risk AI (biometrics, critical infrastructure) requires rigorous testing — AI security skills in demand.",
  },
  {
    framework: "Google SAIF",
    url: "https://saif.google/",
    summary: "Secure AI Framework — expand strong security foundations to AI-specific threats.",
    phases: ["Secure by default", "Detect and respond", "Automate defenses", "Align with industry frameworks"],
    aiSecRelevance: "HTB AI Red Teamer path aligns with SAIF. Good talking point in interviews.",
  },
  {
    framework: "OWASP GenAI Security Project",
    url: "https://genai.owasp.org/",
    summary: "Community-driven LLM Top 10, Agentic Top 10, tooling landscape, and getting-started guides.",
    phases: ["LLM Top 10", "Agentic Top 10", "ML Security", "Solution landscape"],
    aiSecRelevance: "Primary offensive/defensive reference for AI red teamers and AppSec engineers.",
  },
];

const BUG_BOUNTY_GUIDE = {
  intro: "Bug bounty programs pay researchers for responsibly disclosed vulnerabilities. AI/LLM bugs are an emerging category.",
  platforms: [
    { name: "HackerOne", url: "https://www.hackerone.com/", desc: "Largest platform; some programs now include AI scope." },
    { name: "Bugcrowd", url: "https://www.bugcrowd.com/", desc: "Enterprise programs; check for LLM/chatbot in scope." },
    { name: "Intigriti", url: "https://www.intigriti.com/", desc: "European focus; growing AI program list." },
    { name: "YesWeHack", url: "https://www.yeswehack.com/", desc: "EU-based; GDPR-aware programs." },
  ],
  aiTargets: [
    "Company chatbots and customer-support AI",
    "RAG-powered search and documentation assistants",
    "AI agents with tool/API access (email, CRM, code execution)",
    "Model APIs with insufficient rate limiting or auth",
    "Fine-tuning / upload portals (poisoning, indirect injection)",
  ],
  reportTips: [
    "Map finding to OWASP LLM Top 10 entry (e.g. LLM01 Prompt Injection)",
    "Include MITRE ATLAS technique ID if applicable",
    "Provide reproducible steps with sanitized screenshots",
    "Demonstrate impact (data exfil, unauthorized action) not just 'it said a bad word'",
    "Never test out-of-scope systems — read program rules for AI/ML exclusions",
  ],
  legal: "Only test systems explicitly in scope. Unauthorized AI probing is still illegal. See Ethics page.",
};

const MATCH_QUIZ_ITEMS = [
  { scenario: "Attacker hides instructions in an email the AI assistant reads", answer: "LLM01", options: ["LLM01", "LLM03", "LLM06", "LLM08"] },
  { scenario: "Poisoned document indexed into vector database", answer: "LLM08", options: ["LLM02", "LLM04", "LLM08", "LLM10"] },
  { scenario: "Agent sends email to attacker without authorization", answer: "LLM06", options: ["LLM05", "LLM06", "LLM07", "LLM09"] },
  { scenario: "Backdoored model uploaded to Hugging Face", answer: "LLM03", options: ["LLM01", "LLM03", "LLM04", "LLM02"] },
  { scenario: "System prompt extracted via 'ignore previous instructions'", answer: "LLM07", options: ["LLM01", "LLM07", "LLM02", "LLM09"] },
  { scenario: "API abused for unlimited free inference", answer: "LLM10", options: ["LLM08", "LLM09", "LLM10", "LLM05"] },
  { scenario: "Chatbot confidently gives false medical advice", answer: "LLM09", options: ["LLM05", "LLM06", "LLM09", "LLM01"] },
  { scenario: "Training data leaked through API responses", answer: "LLM02", options: ["LLM02", "LLM04", "LLM07", "LLM03"] },
];

const SPAM_WORDS_BAD = ["free", "winner", "click", "urgent", "prize"];
const SPAM_WORDS_GOOD = ["quarterly", "report", "meeting", "regarding", "team"];

const I18N = {
  en: {
    "nav.home": "Home", "nav.learn": "Learn", "nav.practice": "Practice", "nav.career": "Career", "nav.tools": "Tools",
    "hero.title": "Learn AI security from zero to job-ready",
    "hero.cta.quiz": "Take skill quiz", "streak.label": "day streak",
    "badge.title": "Badges", "notes.title": "Phase notes", "timer.start": "Start focus",
    "sync.export": "Export profile", "sync.import": "Import profile",
    "install.pwa": "Install app", "lang.toggle": "ES",
    "dashboard.title": "Your dashboard", "dashboard.continue": "Continue learning",
    "onboard.title": "Welcome!", "onboard.cta": "Take skill quiz",
    "file.banner": "Opened as local file — run npm start for full features",
  },
  es: {
    "nav.home": "Inicio", "nav.learn": "Aprender", "nav.practice": "Práctica", "nav.career": "Carrera", "nav.tools": "Herramientas",
    "hero.title": "Aprende seguridad IA desde cero hasta empleo",
    "hero.cta.quiz": "Hacer quiz", "streak.label": "días seguidos",
    "badge.title": "Insignias", "notes.title": "Notas por fase", "timer.start": "Enfocar",
    "sync.export": "Exportar perfil", "sync.import": "Importar perfil",
    "install.pwa": "Instalar app", "lang.toggle": "EN",
    "dashboard.title": "Tu panel", "dashboard.continue": "Continuar aprendiendo",
    "onboard.title": "¡Bienvenido!", "onboard.cta": "Hacer quiz",
    "file.banner": "Archivo local — ejecuta npm start para todas las funciones",
  },
};

const SYNC_KEYS = [
  "aiSecCareerProgress", "aiSecBookmarks", "aiSecTheme", "aiSecFlashcards",
  "aiSecVideoProgress", "aiSecStudyHours", "aiSecTeamProfiles", "aiSecReminder",
  "aiSecStreak", "aiSecBadges", "aiSecPhaseNotes", "aiSecPlatformRooms",
  "aiSecNewsletter", "aiSecSubmissions", "aiSecStats", "aiSecApiKey", "aiSecOnboarded", "aiSecResumeDraft",
];
