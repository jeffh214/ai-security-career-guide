/** v5: ATLAS, Agentic Top 10, phase tips, case study links, nav groups, resume fields */

const NAV_GROUPS = [
  {
    label: "Learn",
    items: [
      { href: "paths.html", label: "Paths" },
      { href: "videos.html", label: "Videos" },
      { href: "glossary.html", label: "Glossary" },
      { href: "threats.html", label: "Threats" },
      { href: "atlas.html", label: "MITRE ATLAS" },
      { href: "agentic.html", label: "Agentic Top 10" },
    ],
  },
  {
    label: "Practice",
    items: [
      { href: "labs.html", label: "Labs" },
      { href: "flashcards.html", label: "Flashcards" },
      { href: "match-quiz.html", label: "Match Quiz" },
      { href: "cert-quiz.html", label: "Cert Quiz" },
      { href: "quiz.html", label: "Skill Quiz" },
    ],
  },
  {
    label: "Career",
    items: [
      { href: "jobs.html", label: "Jobs" },
      { href: "interview.html", label: "Interview" },
      { href: "certifications.html", label: "Certifications" },
      { href: "secai.html", label: "SecAI+ Prep" },
      { href: "career.html", label: "Salary Guide" },
      { href: "bounty.html", label: "Bug Bounty" },
      { href: "compliance.html", label: "Compliance" },
      { href: "resume.html", label: "Résumé Builder" },
      { href: "case-studies.html", label: "Case Studies" },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "planner.html", label: "Planner" },
      { href: "timer.html", label: "Timer" },
      { href: "tutor.html", label: "Tutor" },
      { href: "analytics.html", label: "Stats" },
      { href: "notes.html", label: "Notes" },
      { href: "sync.html", label: "Sync" },
      { href: "downloads.html", label: "Downloads" },
      { href: "community.html", label: "Community" },
    ],
  },
];

const MITRE_ATLAS = [
  { id: "AML.T0051", name: "LLM Prompt Injection", tactic: "Initial Access", desc: "Malicious instructions in prompts or retrieved data override model behavior.", owasp: "LLM01" },
  { id: "AML.T0054", name: "LLM Jailbreak", tactic: "Defense Evasion", desc: "Bypass safety filters to produce restricted or harmful outputs.", owasp: "LLM01" },
  { id: "AML.T0024", name: "Adversarial Example", tactic: "Evasion", desc: "Crafted inputs cause misclassification at inference time without changing the model.", owasp: "—" },
  { id: "AML.T0018", name: "Backdoor ML Model", tactic: "Persistence", desc: "Model contains hidden triggers causing malicious behavior on specific inputs.", owasp: "LLM03/04" },
  { id: "AML.T0020", name: "Poison Training Data", tactic: "Impact", desc: "Corrupt training data to degrade performance or insert backdoors.", owasp: "LLM04" },
  { id: "AML.T0040", name: "ML Model Inference API Access", tactic: "Collection", desc: "Abuse API access to extract model behavior or training data.", owasp: "LLM02/10" },
  { id: "AML.T0043", name: "Craft Adversarial Data", tactic: "Resource Development", desc: "Create datasets designed to fool or poison ML systems.", owasp: "LLM08" },
  { id: "AML.T0053", name: "LLM Plugin Compromise", tactic: "Initial Access", desc: "Compromise tools/plugins an LLM agent can invoke.", owasp: "LLM06" },
];

const AGENTIC_TOP_10 = [
  { id: "ASI01", name: "Agent Goal Hijack", desc: "Attacker redirects agent objective via injected instructions in emails, docs, or tool outputs." },
  { id: "ASI02", name: "Tool Misuse", desc: "Agent invokes tools (email, CRM, shell) in unintended or unauthorized ways." },
  { id: "ASI03", name: "Identity & Privilege Abuse", desc: "Agent operates with excessive OAuth/API scopes or impersonates users." },
  { id: "ASI04", name: "Agentic Supply Chain", desc: "Compromised plugins, MCP servers, or third-party agent frameworks." },
  { id: "ASI05", name: "Unexpected Code Execution", desc: "Agent generates or runs code beyond sandbox boundaries." },
  { id: "ASI06", name: "Memory & Context Poisoning", desc: "Long-term agent memory corrupted with persistent malicious instructions." },
  { id: "ASI07", name: "Insecure Inter-Agent Communication", desc: "Agents trust unverified messages from other agents without authentication." },
  { id: "ASI08", name: "Cascading Failures", desc: "One compromised step in a multi-agent workflow propagates to downstream agents." },
  { id: "ASI09", name: "Human Trust Exploitation", desc: "Agent output presented as authoritative causes users to take harmful actions." },
  { id: "ASI10", name: "Rogue Agents", desc: "Autonomous agents persist and act outside intended lifecycle or scope." },
];

const PHASE_MONTHLY = {
  "phase-0": { tasks: ["Watch: What happens when you type a URL?", "Enable 2FA on email and GitHub", "Read glossary: HTTP, HTTPS, DNS"], link: "paths.html#phase-0" },
  "phase-1": { tasks: ["NetworkChuck Linux EP 1", "TryHackMe Linux Fundamentals Part 1", "Practice: cd, ls, chmod in terminal"], link: "paths.html#phase-1" },
  "phase-2": { tasks: ["Dr. Chuck Python Lecture 1", "Build password strength checker", "TryHackMe Python Basics"], link: "paths.html#phase-2" },
  "phase-3": { tasks: ["Practical Networking — Network Devices", "TryHackMe Intro to Networking", "Use browser DevTools → Network tab"], link: "paths.html#phase-3" },
  "phase-4": { tasks: ["TryHackMe Pre Security path", "Complete Intro to Offensive Security room", "Review CIA triad in glossary"], link: "paths.html#phase-4" },
  "phase-5": { tasks: ["PortSwigger SQL Injection labs", "TryHackMe OWASP Top 10", "Practice Burp Suite basics"], link: "paths.html#phase-5" },
  "phase-6": { tasks: ["AIRT Module 1 — Prompt Injection", "OWASP LLM Top 10 flashcards", "Labs: prompt injection playground"], link: "paths.html#phase-6" },
  "int-1": { tasks: ["Review MITRE ATLAS techniques", "Case study: Chevy chatbot", "Match quiz: OWASP scenarios"], link: "paths.html#tab-intermediate" },
};

const CASE_STUDY_LINKS = {
  "Chevrolet Chatbot — $1 Taco Prompt Injection": { lab: "labs.html", labLabel: "Prompt injection lab", glossary: "glossary.html", term: "Prompt injection" },
  "Samsung — Engineers Leaking Source Code via ChatGPT": { lab: null, glossary: "glossary.html", term: "Sensitive information disclosure" },
  "Air Canada — Chatbot Liability": { lab: null, glossary: "glossary.html", term: "Hallucination" },
  "Microsoft Tay — Twitter Bot Manipulation": { lab: "labs.html", labLabel: "Spam evasion lab", glossary: "glossary.html", term: "Data poisoning" },
  "GPT-4 Vulnerable to Automated Jailbreaks (Research)": { lab: "labs.html", labLabel: "Agent multi-turn lab", glossary: "glossary.html", term: "Jailbreaking" },
  "PoisonGPT — Hugging Face Model Backdoor": { lab: "labs.html", labLabel: "RAG poisoning simulator", glossary: "glossary.html", term: "Model supply chain" },
};

const RESUME_SECTIONS = [
  { id: "name", label: "Full name", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "linkedin", label: "LinkedIn URL", type: "url" },
  { id: "github", label: "GitHub URL", type: "url" },
  { id: "summary", label: "Professional summary", type: "textarea" },
  { id: "skills", label: "Skills (comma-separated)", type: "textarea" },
  { id: "projects", label: "Projects / portfolio", type: "textarea" },
];

const KEYBOARD_SHORTCUTS = [
  { keys: "Ctrl + K", action: "Open search" },
  { keys: "?", action: "Show keyboard shortcuts" },
  { keys: "Esc", action: "Close search / modals" },
  { keys: "◐ button", action: "Toggle dark / light theme" },
  { keys: "Space (flashcards)", action: "Flip card" },
  { keys: "1–4 (flashcards)", action: "Rate card (Again / Hard / Good / Easy)" },
];
