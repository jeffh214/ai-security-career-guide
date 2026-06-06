/** CompTIA SecAI+ (CY0-001) exam prep — domains, resources, study plan, quiz, flashcards */

const SECAI_EXAM = {
  name: "CompTIA Security AI+ (SecAI+)",
  code: "CY0-001",
  version: "V1",
  launch: "February 17, 2026",
  questions: "Up to 60 (multiple-choice + performance-based)",
  duration: "60 minutes",
  passing: "600 / 900",
  experience: "3–4 years IT; 2+ years hands-on cybersecurity recommended",
  prereqs: "None official — Security+, CySA+, or equivalent recommended",
  officialUrl: "https://www.comptia.org/en-us/certifications/secai/",
  objectivesUrl: "https://www.comptia.org/en-us/certifications/secai/",
};

const SECAI_DOMAINS = [
  {
    id: "d1",
    weight: "17%",
    title: "Basic AI concepts related to cybersecurity",
    topics: [
      "ML, deep learning, NLP, and automation terminology",
      "AI applications in threat detection and SOC operations",
      "AI-driven threats: automated phishing, adversarial ML, malicious GenAI",
      "Prompt engineering basics and LLM behavior",
    ],
    academy: [
      { label: "Glossary — LLM security terms", href: "glossary.html" },
      { label: "Phase 6 — AI security fundamentals", href: "paths.html#phase-6" },
      { label: "Neural networks video (3Blue1Brown)", href: "https://www.youtube.com/watch?v=aircAruvnKk", external: true },
    ],
  },
  {
    id: "d2",
    weight: "40%",
    title: "Securing AI systems",
    topics: [
      "Security controls: guardrails, rate limits, token quotas, model evaluation",
      "Access controls and API authentication for model endpoints",
      "Data security: training data protection, inference-layer defenses",
      "Adversarial risks: prompt injection, poisoning, model extraction, supply chain",
      "Monitoring, auditing, and logging AI systems",
    ],
    academy: [
      { label: "OWASP LLM Top 10 flashcards", href: "flashcards.html" },
      { label: "Interactive labs (prompt injection, RAG, agents)", href: "labs.html" },
      { label: "MITRE ATLAS techniques", href: "atlas.html" },
      { label: "Agentic AI Top 10", href: "agentic.html" },
      { label: "Match quiz — scenario → OWASP", href: "match-quiz.html" },
    ],
  },
  {
    id: "d3",
    weight: "24%",
    title: "AI-assisted security",
    topics: [
      "AI for anomaly detection and threat identification",
      "Automating triage, alert correlation, and response orchestration",
      "AI in threat modeling, behavior analysis, continuous monitoring",
      "Human oversight and avoiding over-reliance on AI outputs in SOC",
    ],
    academy: [
      { label: "Compare AI red team tools", href: "compare.html" },
      { label: "Case studies — real AI incidents", href: "case-studies.html" },
      { label: "Threat intelligence page", href: "threats.html" },
    ],
  },
  {
    id: "d4",
    weight: "19%",
    title: "AI governance, risk, and compliance",
    topics: [
      "NIST AI RMF, EU AI Act, GDPR implications for AI",
      "GRC integration across the AI lifecycle",
      "Responsible AI: ethics, bias, transparency, human-in-the-loop",
      "Scenario-based policy and risk decisions",
    ],
    academy: [
      { label: "Compliance track", href: "compliance.html" },
      { label: "Ethics & legal", href: "ethics.html" },
    ],
  },
];

const SECAI_RESOURCES = {
  official: [
    { label: "CompTIA SecAI+ certification page", url: "https://www.comptia.org/en-us/certifications/secai/", type: "Official", free: false },
    { label: "CompTIA Exam Objectives (download from cert page)", url: "https://www.comptia.org/en-us/certifications/secai/", type: "PDF", free: true },
    { label: "CompTIA CertMaster Learn (official eLearning)", url: "https://www.comptia.org/training/certmaster-learn", type: "Course", free: false },
  ],
  free: [
    { label: "OWASP GenAI Security Project", url: "https://genai.owasp.org/", type: "Reference", free: true },
    { label: "MITRE ATLAS", url: "https://atlas.mitre.org/", type: "Reference", free: true },
    { label: "NIST AI RMF", url: "https://www.nist.gov/itl/ai-risk-management-framework", type: "Framework", free: true },
    { label: "HTB Academy — AI Red Teamer (free tier modules)", url: "https://academy.hackthebox.com/path/preview/ai-red-teamer", type: "Course", free: true },
    { label: "AIRT — AI Red Team Training", url: "https://0x4d31.github.io/airt/", type: "Course", free: true },
    { label: "This academy's full career guide (PDF)", url: "../AI-Security-Career-Guide.pdf", type: "Guide", free: true },
  ],
  videos: [
    { label: "Neural networks — 3Blue1Brown", watch: "https://www.youtube.com/watch?v=aircAruvnKk", ytId: "aircAruvnKk", topic: "Domain 1 — AI concepts" },
    { label: "But what is a GPT? — 3Blue1Brown", watch: "https://www.youtube.com/watch?v=wjZofJX0v4M", ytId: "wjZofJX0v4M", topic: "Domain 1 — LLM basics" },
    { label: "NetworkChuck — Linux for Hackers EP1", watch: "https://www.youtube.com/watch?v=VbEx7B_PTOE", ytId: "VbEx7B_PTOE", topic: "Prerequisite skills" },
    { label: "Practical Networking — TCP/IP", watch: "https://www.youtube.com/watch?v=gYN2qN11-wE", ytId: "gYN2qN11-wE", topic: "Prerequisite skills" },
  ],
  paid: [
    { label: "CompTIA CertMaster Practice (official)", url: "https://www.comptia.org/training/certmaster-practice", note: "Official practice exams" },
    { label: "HTB Academy — AI Red Teamer (full path)", url: "https://academy.hackthebox.com/path/preview/ai-red-teamer", note: "Hands-on — maps heavily to Domain 2" },
    { label: "SANS SEC598 — AI Security Automation", url: "https://www.sans.org/cyber-security-courses/ai-security-automation", note: "Advanced; post-SecAI+" },
  ],
};

const SECAI_STUDY_PLAN = [
  { week: 1, domain: "Domain 1 + prerequisites", hours: "8–10", tasks: ["Download exam objectives PDF from CompTIA", "Watch 3Blue1Brown neural networks + GPT videos", "Complete glossary LLM deck (20 cards/day)", "Read compliance page — NIST AI RMF overview"] },
  { week: 2, domain: "Domain 2 (part 1)", hours: "10–12", tasks: ["OWASP LLM Top 10 — read + flashcards", "Labs: prompt injection + RAG poisoning", "MITRE ATLAS page — memorize top 5 techniques", "Match quiz until 70%+ pass"] },
  { week: 3, domain: "Domain 2 (part 2) + Domain 3", hours: "10–12", tasks: ["Agent multi-turn lab + tool abuse lab", "Agentic Top 10 read-through", "Case studies — Chevy chatbot, Samsung leak, Air Canada", "Compare Promptfoo vs PyRIT — know use cases"] },
  { week: 4, domain: "Domain 4 + review", hours: "10–12", tasks: ["Compliance + EU AI Act + ethics pages", "SecAI+ practice quiz (this site) until 80%+", "Download domain study notes — review gaps", "Cert quiz: OWASP + Security fundamentals", "Schedule exam or CertMaster Practice"] },
];

const SECAI_FLASHCARDS = [
  { id: "secai-d1-1", front: "SecAI+ Domain 1 weight?", back: "17% — Basic AI concepts related to cybersecurity", deck: "SecAI+", tag: "D1" },
  { id: "secai-d2-1", front: "SecAI+ Domain 2 weight?", back: "40% — Securing AI systems (largest domain)", deck: "SecAI+", tag: "D2" },
  { id: "secai-d3-1", front: "SecAI+ Domain 3 weight?", back: "24% — AI-assisted security (using AI in SOC)", deck: "SecAI+", tag: "D3" },
  { id: "secai-d4-1", front: "SecAI+ Domain 4 weight?", back: "19% — AI governance, risk, and compliance", deck: "SecAI+", tag: "D4" },
  { id: "secai-exam-1", front: "SecAI+ exam code & passing score?", back: "CY0-001 V1 · 600/900 · up to 60 questions · 60 min", deck: "SecAI+", tag: "Exam" },
  { id: "secai-d2-2", front: "Guardrails in AI security?", back: "Output filters, topic restrictions, and safety classifiers that limit model behavior before/after inference.", deck: "SecAI+", tag: "D2" },
  { id: "secai-d2-3", front: "Token limits / rate limiting — why?", back: "Prevents LLM10 Unbounded Consumption — cost abuse, DoS, and resource exhaustion attacks.", deck: "SecAI+", tag: "D2" },
  { id: "secai-d3-2", front: "AI-assisted triage in SOC?", back: "LLM summarizes alerts, correlates events, suggests priority — human must validate before action.", deck: "SecAI+", tag: "D3" },
  { id: "secai-d4-2", front: "NIST AI RMF four functions?", back: "Govern, Map, Measure, Manage — framework for AI risk across lifecycle.", deck: "SecAI+", tag: "D4" },
  { id: "secai-d4-3", front: "EU AI Act risk tiers?", back: "Unacceptable (banned), High (strict requirements), Limited (transparency), Minimal (few obligations).", deck: "SecAI+", tag: "D4" },
  { id: "secai-d2-4", front: "Model extraction attack?", back: "Querying API repeatedly to replicate model behavior or steal training data — ATLAS AML.T0040.", deck: "SecAI+", tag: "D2" },
  { id: "secai-d1-2", front: "Adversarial ML vs prompt injection?", back: "Adversarial ML: crafted inputs fool models at inference. Prompt injection: malicious instructions in text/context override LLM behavior.", deck: "SecAI+", tag: "D1" },
];

const SECAI_QUIZ = {
  title: "SecAI+ Domain Review",
  questions: [
    { q: "Which domain has the highest exam weight?", options: ["Domain 1 — AI concepts", "Domain 2 — Securing AI systems", "Domain 3 — AI-assisted security", "Domain 4 — GRC"], answer: 1 },
    { q: "Prompt injection primarily maps to which OWASP LLM entry?", options: ["LLM03 Supply Chain", "LLM01 Prompt Injection", "LLM09 Misinformation", "LLM05 Output Handling"], answer: 1 },
    { q: "NIST AI RMF functions include:", options: ["Plan, Do, Check, Act", "Govern, Map, Measure, Manage", "Identify, Protect, Detect, Respond", "Design, Build, Test, Deploy"], answer: 1 },
    { q: "Rate limiting on an LLM API primarily mitigates:", options: ["LLM02 Disclosure", "LLM10 Unbounded Consumption", "LLM04 Poisoning", "LLM07 Prompt Leakage"], answer: 1 },
    { q: "AI-assisted security (Domain 3) focuses on:", options: ["Securing model weights", "Using AI tools in SOC/detection workflows", "EU AI Act compliance", "Training data labeling"], answer: 1 },
    { q: "MITRE ATLAS documents:", options: ["Windows malware techniques", "Adversarial ML and AI system attacks", "Cloud IAM misconfigs", "Phishing email templates"], answer: 1 },
    { q: "Human-in-the-loop is emphasized because:", options: ["AI is always wrong", "AI outputs need validation before high-impact actions", "Regulations ban automation", "Models cannot process text"], answer: 1 },
    { q: "Model supply chain risk maps to:", options: ["LLM03 Supply Chain Vulnerabilities", "LLM01 Prompt Injection", "LLM06 Excessive Agency", "LLM08 Embeddings only"], answer: 0 },
    { q: "SecAI+ recommended experience:", options: ["No experience required", "3–4 years IT, 2+ years cybersecurity", "10 years executive only", "PhD in ML required"], answer: 1 },
    { q: "Performance-based questions (PBQs) on SecAI+ may require you to:", options: ["Write Python from memory", "Analyze scenarios and select/configure appropriate controls", "Deploy a Kubernetes cluster", "Reverse engineer binary malware"], answer: 1 },
  ],
};

function generateSecaiNotesText() {
  let t = `COMPTIA SecAI+ (${SECAI_EXAM.code}) — DOMAIN STUDY NOTES\n${"=".repeat(55)}\n\n`;
  t += `Exam: ${SECAI_EXAM.questions}\nPassing: ${SECAI_EXAM.passing}\nOfficial: ${SECAI_EXAM.officialUrl}\n\n`;
  SECAI_DOMAINS.forEach((d) => {
    t += `\n${d.title.toUpperCase()} (${d.weight})\n${"-".repeat(40)}\n`;
    d.topics.forEach((x) => (t += `• ${x}\n`));
    t += `\nAcademy links:\n`;
    d.academy.forEach((a) => (t += `  → ${a.label}: ${a.href || a.url}\n`));
  });
  t += `\n\nOWASP LLM TOP 10 (high-yield for Domain 2)\n`;
  if (typeof OWASP_LLM_QUICK_REF !== "undefined") OWASP_LLM_QUICK_REF.forEach((r) => (t += `• ${r}\n`));
  t += `\nGenerated by AI Security Career Academy\n`;
  return t;
}

function generateSecaiPlanText() {
  let t = `COMPTIA SecAI+ — 4-WEEK STUDY PLAN\n${"=".repeat(45)}\n\n`;
  SECAI_STUDY_PLAN.forEach((w) => {
    t += `WEEK ${w.week}: ${w.domain} (${w.hours} hrs)\n`;
    w.tasks.forEach((x) => (t += `  [ ] ${x}\n`));
    t += "\n";
  });
  return t;
}

if (typeof FLASHCARDS !== "undefined") FLASHCARDS.push(...SECAI_FLASHCARDS);
if (typeof CERT_QUIZZES !== "undefined") CERT_QUIZZES.secai = SECAI_QUIZ;
if (typeof DOWNLOADS !== "undefined") {
  DOWNLOADS.push(
    { label: "SecAI+ Domain Study Notes (.txt)", id: "secai-notes", type: "generated" },
    { label: "SecAI+ 4-Week Study Plan (.txt)", id: "secai-plan", type: "generated" },
  );
}
