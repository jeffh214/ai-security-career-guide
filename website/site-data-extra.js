/** Extended content — labs, case studies, interview prep, comparisons, etc. */

const PHASE_DETAILS = {
  "phase-0": {
    doneWhen: [
      "Can explain what happens when you type a URL and press Enter",
      "Understand difference between HTTP and HTTPS",
      "Set up strong passwords and enable 2FA on main accounts",
      "Recognize a basic phishing email",
    ],
    labs: [],
    video: null,
  },
  "phase-1": {
    doneWhen: [
      "Navigate filesystem using only terminal (cd, ls, pwd, mkdir, rm)",
      "Edit a file with nano or vim basics",
      "Change file permissions with chmod",
      "SSH into a remote machine",
      "Complete HTB Linux Fundamentals module",
    ],
    labs: [
      { label: "TryHackMe — Linux Fundamentals (Parts 1–3)", url: "https://tryhackme.com/room/linuxfundamentalspart1", free: true },
      { label: "TryHackMe — What is Networking?", url: "https://tryhackme.com/room/whatisnetworking", free: true },
      { label: "HTB Academy — Linux Fundamentals", url: "https://academy.hackthebox.com/", free: true },
    ],
    video: "https://www.youtube.com/embed/VbEx7B_PTOE",
  },
  "phase-2": {
    doneWhen: [
      "Write a 20+ line Python script without copying blindly",
      "Use variables, loops, if/else, and functions",
      "Read and write files in Python",
      "Complete password strength checker project",
      "Complete log file parser project",
    ],
    labs: [
      { label: "TryHackMe — Python Basics", url: "https://tryhackme.com/room/pythonbasics", free: true },
      { label: "TryHackMe — Scripting", url: "https://tryhackme.com/room/scripting", free: true },
      { label: "HTB Academy — Introduction to Python", url: "https://academy.hackthebox.com/", free: false },
    ],
    video: null,
  },
  "phase-3": {
    doneWhen: [
      "Explain IP address, subnet mask, and port in your own words",
      "Describe how DNS resolves a domain name",
      "Explain difference between TCP and UDP",
      "Identify HTTP vs HTTPS in browser dev tools",
      "Complete TryHackMe Intro to Networking room",
    ],
    labs: [
      { label: "TryHackMe — Intro to Networking", url: "https://tryhackme.com/room/introtonetworking", free: true },
      { label: "TryHackMe — What is Networking?", url: "https://tryhackme.com/room/whatisnetworking", free: true },
      { label: "TryHackMe — Intro to LAN", url: "https://tryhackme.com/room/introtolan", free: true },
    ],
    video: null,
  },
  "phase-4": {
    doneWhen: [
      "Explain CIA triad (confidentiality, integrity, availability)",
      "Complete TryHackMe Pre Security path",
      "Finish 5+ beginner rooms without walkthrough copy-paste",
      "Identify phishing, malware, and password attack types",
      "Explain XSS and SQL injection at concept level",
    ],
    labs: [
      { label: "TryHackMe — Pre Security Path", url: "https://tryhackme.com/path/outline/presecurity", free: true },
      { label: "TryHackMe — Intro to Cyber Security", url: "https://tryhackme.com/room/introtooffensivesecurity", free: true },
      { label: "TryHackMe — Phishing", url: "https://tryhackme.com/room/phishing", free: true },
      { label: "TryHackMe — Basic Pentesting", url: "https://tryhackme.com/room/basicpentestingjt", free: true },
    ],
    video: null,
  },
  "phase-5": {
    doneWhen: [
      "Complete 10+ PortSwigger Web Security labs",
      "Explain a full attack chain: recon → access → exfil",
      "Use Burp Suite or OWASP ZAP at basic level",
      "Complete 3+ HTB Academy or TryHackMe intermediate rooms",
    ],
    labs: [
      { label: "PortSwigger — SQL Injection labs", url: "https://portswigger.net/web-security/sql-injection", free: true },
      { label: "PortSwigger — XSS labs", url: "https://portswigger.net/web-security/cross-site-scripting", free: true },
      { label: "TryHackMe — OWASP Top 10", url: "https://tryhackme.com/room/owasptop10", free: true },
      { label: "TryHackMe — Jr Penetration Tester Path", url: "https://tryhackme.com/path/outline/jrpenetrationtester", free: false },
    ],
    video: null,
  },
  "phase-6": {
    doneWhen: [
      "Explain prompt injection, tool abuse, and RAG poisoning with examples",
      "Read OWASP LLM Top 10 and name all 10 risks",
      "Complete AIRT Module 1 (Prompt Injection)",
      "Run Promptfoo against a test LLM app",
      "Publish one portfolio writeup on GitHub or blog",
    ],
    labs: [
      { label: "AIRT — AI Red Team Academy (Module 1+)", url: "https://0x4d31.github.io/airt/", free: true },
      { label: "HTB Academy — AI Red Teamer Path", url: "https://academy.hackthebox.com/path/preview/ai-red-teamer", free: false },
      { label: "HTB Academy — Prompt Injection", url: "https://academy.hackthebox.com/", free: false },
      { label: "Promptfoo — Getting Started", url: "https://www.promptfoo.dev/docs/getting-started/", free: true },
    ],
    video: null,
  },
};

INTERMEDIATE_PATH.forEach((p) => {
  if (!PHASE_DETAILS[p.id]) {
    PHASE_DETAILS[p.id] = { doneWhen: [`Complete all resources for ${p.title}`], labs: p.resources || [], video: null };
  }
});

const CASE_STUDIES = [
  {
    title: "Chevrolet Chatbot — $1 Taco Prompt Injection",
    year: "2023",
    type: "Prompt Injection",
    owasp: "LLM01",
    summary: "A GM dealership chatbot powered by ChatGPT was tricked via prompt injection into agreeing to sell a Chevy Tahoe for $1 and calling the offer 'legally binding.'",
    lesson: "Never let LLM outputs directly trigger business transactions without human approval. Validate and sandbox agent actions.",
    link: "https://www.theverge.com/2023/12/18/24008882/gm-chatgpt-chevy-dealership-tahoe-chatbot",
  },
  {
    title: "Samsung — Engineers Leaking Source Code via ChatGPT",
    year: "2023",
    type: "Sensitive Data Disclosure",
    owasp: "LLM02",
    summary: "Samsung employees pasted confidential source code and meeting notes into ChatGPT on three separate occasions, potentially exposing trade secrets to OpenAI's training pipeline.",
    lesson: "Deploy enterprise AI with DLP controls. Ban pasting proprietary code into public LLMs. Use private/on-prem models for sensitive work.",
    link: "https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-after-employee-data-leak",
  },
  {
    title: "Air Canada — Chatbot Liability",
    year: "2024",
    type: "Misinformation / Bad Advice",
    owasp: "LLM09",
    summary: "Air Canada's chatbot gave incorrect bereavement fare policy information. A tribunal ruled the airline liable for the chatbot's bad advice — not the passenger.",
    lesson: "Companies are legally responsible for AI-generated customer advice. RAG must cite authoritative sources; human escalation for high-stakes decisions.",
    link: "https://www.bbc.com/news/world-us-canada-68410029",
  },
  {
    title: "Microsoft Tay — Twitter Bot Manipulation",
    year: "2016",
    type: "Training Data / Manipulation",
    summary: "Microsoft's Tay chatbot was manipulated by Twitter users within 16 hours to post offensive content, demonstrating early ML safety failures at scale.",
    lesson: "User input can corrupt model behavior in real-time. Rate limiting, content filters, and kill switches are essential for public-facing bots.",
    link: "https://en.wikipedia.org/wiki/Tay_(chatbot)",
  },
  {
    title: "GPT-4 Vulnerable to Automated Jailbreaks (Research)",
    year: "2024",
    type: "Jailbreaking",
    owasp: "LLM01",
    summary: "Researchers demonstrated automated multi-turn jailbreak techniques achieving near-100% success rates against GPT-4, Claude, and other models using adversarial prompt algorithms.",
    lesson: "Single-shot safety filters fail against persistent multi-turn attacks. Red-team continuously with tools like PyRIT and Promptfoo.",
    link: "https://arxiv.org/abs/2402.09127",
  },
  {
    title: "PoisonGPT — Hugging Face Model Backdoor",
    year: "2023",
    type: "Supply Chain / Backdoor",
    owasp: "LLM03",
    summary: "Researchers uploaded a backdoored LLM to Hugging Face that appeared normal but spread misinformation when specific triggers were present — demonstrating model supply chain risk.",
    lesson: "Verify model provenance, use private registries, scan models before deployment, pin known-good versions.",
    link: "https://blog.mithrilsecurity.io/poisongpt-how-we-hid-a-lobotomized-llm-on-hugging-face-to-spread-fake-news/",
  },
];

const INCIDENT_TIMELINE = [
  { date: "2016-03", event: "Microsoft Tay manipulated on Twitter within 16 hours" },
  { date: "2023-03", event: "Samsung bans ChatGPT after employee data leaks (3 incidents)" },
  { date: "2023-07", event: "PoisonGPT demonstrates Hugging Face supply chain backdoor" },
  { date: "2023-12", event: "Chevy chatbot prompt injection — $1 Tahoe offer goes viral" },
  { date: "2024-02", event: "Research: automated jailbreaks achieve near-100% vs major LLMs" },
  { date: "2024-02", event: "Air Canada held liable for chatbot's incorrect fare advice" },
  { date: "2024-11", event: "OWASP releases Agentic AI Top 10 for autonomous agents" },
  { date: "2025-01", event: "OWASP LLM Top 10 updated for 2025 — vector/embedding risks added" },
];

const INTERVIEW_QUESTIONS = [
  {
    q: "Explain prompt injection and how it differs from jailbreaking.",
    outline: "Prompt injection: malicious instructions in input/external data override system behavior (direct vs indirect). Jailbreaking: techniques to bypass safety filters for restricted outputs. Injection can trigger actions; jailbreaking typically targets content policy.",
  },
  {
    q: "How would you red-team a RAG-based corporate chatbot?",
    outline: "1) Map architecture (LLM, vector DB, tools). 2) Direct/indirect prompt injection tests. 3) RAG poisoning via uploaded docs. 4) Test data exfil via retrieval. 5) Tool abuse if agentic. 6) Document with OWASP LLM Top 10 + MITRE ATLAS.",
  },
  {
    q: "What is in the OWASP LLM Top 10?",
    outline: "LLM01 Prompt Injection, LLM02 Sensitive Info Disclosure, LLM03 Supply Chain, LLM04 Data/Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector/Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption.",
  },
  {
    q: "Explain adversarial evasion vs data poisoning.",
    outline: "Evasion: manipulate input at inference time to cause misclassification (model unchanged). Poisoning: corrupt training data to degrade model or insert backdoors (model weights changed). Evasion is real-time; poisoning is pre-deployment.",
  },
  {
    q: "What tools would you use for LLM red teaming?",
    outline: "Promptfoo (automated scanning, CI/CD), PyRIT (multi-turn AI-vs-AI), Garak (probe suites). Manual testing for business logic. Map findings to OWASP LLM Top 10 and MITRE ATLAS.",
  },
  {
    q: "How do you secure an AI agent with tool access?",
    outline: "Principle of least privilege on tools, authorization per tool call, input/output filtering, separate system/user prompts, logging all agent actions, human-in-the-loop for high-impact operations, rate limiting.",
  },
  {
    q: "What is MITRE ATLAS and when do you use it?",
    outline: "Adversarial Threat Landscape for AI Systems — taxonomy of ML/AI attacks (prompt injection, evasion, poisoning, model extraction). Use alongside OWASP LLM Top 10 to categorize and report AI security findings professionally.",
  },
  {
    q: "Describe a data poisoning attack on a fraud detection model.",
    outline: "Attacker inserts fake transactions matching their laundering pattern labeled 'legitimate' into training data. After retraining, real fraudulent transactions bypass detection. Defense: data provenance, anomaly detection on training data, differential privacy.",
  },
];

const CERT_GUIDE = [
  {
    cert: "CompTIA SecAI+ (Security AI+)",
    level: "AI Security",
    cost: "~$404 exam",
    bestFor: "Vendor-neutral AI security credential; stacks on Security+/CySA+",
    prereqs: "Security+ or 2+ yrs cyber experience recommended",
    link: "secai.html",
  },
  {
    cert: "CompTIA Security+",
    level: "Entry",
    cost: "~$400",
    bestFor: "Complete beginners wanting structured baseline; HR filter on résumés",
    prereqs: "None — take after Phase 4–5",
    link: "https://www.comptia.org/certifications/security",
  },
  {
    cert: "HTB CPTS / PJPT",
    level: "Intermediate",
    cost: "HTB subscription",
    bestFor: "Hands-on pentesters; proves practical skill",
    prereqs: "Linux, networking, web security labs",
    link: "https://academy.hackthebox.com/",
  },
  {
    cert: "EC-Council COASP",
    level: "AI Security",
    cost: "~$1,500+",
    bestFor: "Offensive AI security specialization",
    prereqs: "Security background + AI fundamentals",
    link: "https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional/",
  },
  {
    cert: "SANS SEC598",
    level: "Advanced",
    cost: "~$8,000+",
    bestFor: "Red/blue/purple teams using AI automation at scale",
    prereqs: "Strong security + scripting background",
    link: "https://www.sans.org/cyber-security-courses/ai-security-automation",
  },
];

const CERT_DECISION_TREE = [
  { condition: "No IT or security experience", recommendation: "Skip certs for 6–9 months. Focus on TryHackMe Pre Security + Python. Consider Security+ after Phase 5." },
  { condition: "Some IT helpdesk/sysadmin background", recommendation: "Security+ within 3 months while doing PortSwigger. Then HTB Academy paths." },
  { condition: "AppSec or pentest experience", recommendation: "Skip Security+. Go straight to AIRT + HTB AI Red Teamer. Consider COASP." },
  { condition: "ML engineer wanting security skills", recommendation: "OWASP LLM Top 10 + AIRT + HTB AI Red Teamer. COASP or internal red team." },
  { condition: "Blue team / SOC analyst", recommendation: "SANS SEC598 or HTB AI modules + learn Promptfoo for detection engineering." },
  { condition: "Have Security+ and want AI security cert", recommendation: "CompTIA SecAI+ (CY0-001) — use secai.html study plan. Domain 2 = 40% of exam." },
  { condition: "Preparing for SecAI+ exam", recommendation: "4-week plan on SecAI+ page → OWASP flashcards → labs → compliance → CertMaster Practice." },
];

const TOOL_COMPARISONS = [
  {
    title: "AI Red Team Tools",
    headers: ["Feature", "Promptfoo", "PyRIT", "Garak"],
    rows: [
      ["Primary use", "Automated scanning + CI/CD", "Multi-turn AI-vs-AI attacks", "Broad probe/vulnerability sweep"],
      ["Skill level", "Beginner–intermediate", "Advanced", "Intermediate"],
      ["CI/CD integration", "Excellent", "Manual scripting", "CLI/batch"],
      ["Multi-turn attacks", "Supported", "Core strength", "Limited"],
      ["Reporting", "Built-in HTML/JSON", "Custom", "JSON output"],
      ["Best for", "Dev teams, continuous testing", "Deep exploitation research", "Baseline vulnerability scans"],
      ["License", "Open source + Enterprise", "Open source (Microsoft)", "Open source (NVIDIA)"],
    ],
    links: [
      { label: "Promptfoo", url: "https://www.promptfoo.dev/" },
      { label: "PyRIT", url: "https://github.com/Azure/PyRIT" },
      { label: "Garak", url: "https://github.com/NVIDIA/garak" },
    ],
  },
  {
    title: "Beginner Linux Distros",
    headers: ["Feature", "Ubuntu", "Parrot OS", "Kali Linux"],
    rows: [
      ["Best for beginners", "General computing + learning", "Security learning (NetworkChuck)", "Offensive security tools"],
      ["Pre-installed tools", "Minimal", "Security tools included", "600+ security tools"],
      ["Resource usage", "Light", "Medium", "Medium–heavy"],
      ["Daily driver?", "Yes", "Yes", "Possible but not ideal"],
      ["Used in this academy", "Recommended VM", "Phase 1 primary", "Phase 5+ labs"],
    ],
    links: [
      { label: "Ubuntu", url: "https://ubuntu.com/" },
      { label: "Parrot OS", url: "https://parrotsec.org/" },
      { label: "Kali", url: "https://www.kali.org/" },
    ],
  },
  {
    title: "Learning Platforms",
    headers: ["Feature", "TryHackMe", "HackTheBox Academy", "PortSwigger"],
    rows: [
      ["Best for", "Absolute beginners", "Structured modules + certs", "Web security depth"],
      ["Hand-holding", "Excellent", "Good", "Self-guided labs"],
      ["AI security content", "Limited", "AI Red Teamer path", "Some LLM content"],
      ["Cost", "Free tier + ~$14/mo", "Subscription", "100% free"],
      ["Start when", "Phase 4", "Phase 1+ modules", "Phase 5"],
    ],
    links: [
      { label: "TryHackMe", url: "https://tryhackme.com/" },
      { label: "HTB Academy", url: "https://academy.hackthebox.com/" },
      { label: "PortSwigger", url: "https://portswigger.net/web-security" },
    ],
  },
];

const COMMUNITY_LINKS = [
  { category: "Reddit", items: [
    { label: "r/cybersecurity", url: "https://www.reddit.com/r/cybersecurity/" },
    { label: "r/netsec", url: "https://www.reddit.com/r/netsec/" },
    { label: "r/AskNetsec", url: "https://www.reddit.com/r/AskNetsec/" },
    { label: "r/MachineLearning", url: "https://www.reddit.com/r/MachineLearning/" },
  ]},
  { category: "Discord & Communities", items: [
    { label: "TryHackMe Discord", url: "https://tryhackme.com/" },
    { label: "HackTheBox Discord", url: "https://www.hackthebox.com/" },
    { label: "OWASP Slack", url: "https://owasp.org/slack/invite" },
    { label: "Promptfoo Discord", url: "https://www.promptfoo.dev/" },
  ]},
  { category: "Conferences & Events", items: [
    { label: "DEF CON — AI Village", url: "https://aivillage.org/" },
    { label: "BSides (local chapters)", url: "https://www.securitybsides.com/" },
    { label: "OWASP Global AppSec", url: "https://owasp.org/events/" },
    { label: "Black Hat", url: "https://www.blackhat.com/" },
  ]},
  { category: "News & Research", items: [
    { label: "OWASP GenAI Security Project", url: "https://genai.owasp.org/" },
    { label: "MITRE ATLAS", url: "https://atlas.mitre.org/" },
    { label: "Krebs on Security", url: "https://krebsonsecurity.com/" },
    { label: "The Hacker News", url: "https://thehackernews.com/" },
  ]},
];

const ETHICS_CONTENT = {
  legal: [
    "Only test systems you own or have written authorization to test (scope of engagement letter).",
    "TryHackMe, HackTheBox, AIRT Docker labs, and your own VMs are legal practice environments.",
    "Scanning/exploiting systems without permission is illegal in virtually all jurisdictions (CFAA in US, Computer Misuse Act in UK, etc.).",
    "Using AI to generate malware for deployment against real targets is criminal — studying in isolated labs is not.",
  ],
  responsible: [
    "Follow responsible disclosure: report vulnerabilities to the vendor first, allow reasonable fix time before public disclosure.",
    "Bug bounty programs (HackerOne, Bugcrowd) provide legal scope for testing specific targets.",
    "Document everything during authorized engagements — chain of custody matters for forensics.",
    "AI red team findings should be reported through the same channels as traditional AppSec findings.",
  ],
  personal: [
    "Never use employer AI tools to process confidential data without policy approval.",
    "Be transparent on your résumé about lab experience vs production experience.",
    "Build portfolio projects on synthetic/fake data only — never use real breached data.",
  ],
};

const PROJECT_WALKTHROUGHS = [
  {
    title: "Red-Team a RAG Chatbot with Promptfoo",
    difficulty: "Intermediate",
    time: "8–12 hours",
    steps: [
      "Deploy a simple RAG app (LangChain + local Ollama, or use AIRT lab environment).",
      "Index 10–20 sample corporate documents (fake data: HR policies, product specs).",
      "Install Promptfoo: npm install -g promptfoo",
      "Create promptfooconfig.yaml with OWASP LLM probe plugins enabled.",
      "Run scan: promptfoo eval — note any prompt injection or data leakage.",
      "Attempt manual indirect injection via uploaded document.",
      "Write report mapping each finding to OWASP LLM Top 10 entry.",
      "Publish sanitized report on GitHub (remove any real API keys).",
    ],
    tools: ["Promptfoo", "Ollama or OpenAI API", "LangChain/LlamaIndex"],
  },
  {
    title: "Evasion Attack on a Spam Classifier",
    difficulty: "Beginner–Intermediate",
    time: "6–8 hours",
    steps: [
      "Download UCI SMS Spam Collection dataset.",
      "Train Naive Bayes classifier with scikit-learn (follow HTB AI Evasion module).",
      "Verify baseline accuracy on test set.",
      "Implement GoodWords attack: insert benign words to flip spam → ham.",
      "Measure attack success rate at various word insertion counts.",
      "Document white-box vs black-box attack differences.",
      "Propose defenses: adversarial training, ensemble models.",
    ],
    tools: ["Python", "scikit-learn", "Jupyter"],
  },
  {
    title: "Agent Tool Abuse Lab",
    difficulty: "Intermediate",
    time: "10–15 hours",
    steps: [
      "Build simple agent with 3 tools: search_docs(), send_email(), query_db() (mock implementations).",
      "Use OpenAI/Anthropic function calling or open-source agent framework.",
      "Test direct prompt injection to call send_email with attacker address.",
      "Test parameter manipulation on query_db to extract all records.",
      "Implement authorization layer on each tool — retest.",
      "Add logging and anomaly detection on tool call patterns.",
      "Write up before/after security posture.",
    ],
    tools: ["Python", "LLM API", "AIRT Module 3 reference"],
  },
  {
    title: "MITRE ATLAS Mapping Report",
    difficulty: "Intermediate",
    time: "4–6 hours",
    steps: [
      "Pick a public AI incident from Case Studies page.",
      "Identify attack techniques used (prompt injection, data leak, etc.).",
      "Map each technique to MITRE ATLAS ID (e.g. AML.T0051 for prompt injection).",
      "Map to OWASP LLM Top 10 entry.",
      "Propose 3 defensive controls that would have prevented or detected the attack.",
      "Format as 2-page professional report — good portfolio piece.",
    ],
    tools: ["MITRE ATLAS website", "OWASP LLM Top 10 PDF"],
  },
];

const SALARY_ROLES = [
  { title: "SOC Analyst (entry)", experience: "0–2 yrs", salary: "$55K–$80K", requirements: "Security+, networking, log analysis. AI: using LLM for triage." },
  { title: "Junior Pentester", experience: "0–2 yrs", salary: "$65K–$90K", requirements: "TryHackMe/HTB labs, OSCP or PJPT preferred, web basics." },
  { title: "AppSec Engineer", experience: "2–5 yrs", salary: "$100K–$150K", requirements: "Web security depth, SAST/DAST, code review. AI: LLM app testing." },
  { title: "AI Security Engineer", experience: "2–5 yrs", salary: "$120K–$180K", requirements: "ML basics + security, OWASP LLM Top 10, red team experience, portfolio." },
  { title: "AI Red Teamer", experience: "3–7 yrs", salary: "$140K–$200K+", requirements: "Pentest background + AI/ML, Promptfoo/PyRIT, published research preferred." },
  { title: "ML Security Researcher", experience: "3+ yrs", salary: "$150K–$220K+", requirements: "ML PhD or equivalent, adversarial ML publications, ATLAS knowledge." },
];

const RESUME_TEMPLATE = `YOUR NAME
City, State | email@example.com | linkedin.com/in/you | github.com/you

SUMMARY
AI security professional with hands-on experience red-teaming LLM applications and
adversarial ML systems. Skilled in prompt injection testing, RAG security, and
mapping findings to OWASP LLM Top 10 and MITRE ATLAS.

TECHNICAL SKILLS
• AI Security: Prompt injection, RAG poisoning, tool abuse, jailbreaking, model extraction
• Tools: Promptfoo, PyRIT, Garak, Burp Suite, Nmap, BloodHound
• Frameworks: OWASP LLM Top 10, MITRE ATLAS, MITRE ATT&CK, NIST AI RMF
• Languages: Python, Bash, SQL
• ML: scikit-learn, PyTorch basics, RAG pipelines, embeddings

PROJECTS
LLM Red Team Assessment — Personal Project | 2025
• Deployed RAG chatbot lab; ran Promptfoo automated scan with OWASP probes
• Found 3 critical prompt injection vectors enabling system prompt extraction
• Documented findings mapped to LLM01 and LLM07; published on GitHub

Adversarial Evasion — Spam Classifier | 2025
• Trained Naive Bayes on UCI SMS dataset; implemented GoodWords evasion attack
• Achieved 78% evasion rate with 5-word insertion; proposed adversarial training defense

CERTIFICATIONS & TRAINING
• HTB Academy — AI Red Teamer Path (in progress)
• AIRT — AI Red Team Academy (completed Module 1–3)
• TryHackMe — Pre Security, Jr Penetration Tester paths

EDUCATION
[Your degree or self-taught path — be honest]`;

const QUIZ_QUESTIONS = [
  { q: "Have you written code before (any language)?", yes: 2, no: 0 },
  { q: "Can you use a Linux terminal comfortably?", yes: 3, no: 0 },
  { q: "Do you understand HTTP, DNS, and IP addresses?", yes: 3, no: 0 },
  { q: "Have you completed any cybersecurity labs (TryHackMe, HTB)?", yes: 4, no: 0 },
  { q: "Can you explain what an LLM is and how RAG works?", yes: 4, no: 0 },
  { q: "Have you tested an AI system for prompt injection?", yes: 5, no: 0 },
  { q: "Do you have a security certification (Security+, OSCP, etc.)?", yes: 3, no: 0 },
  { q: "Have you published a security writeup or portfolio project?", yes: 3, no: 0 },
];

const DOWNLOADS = [
  { label: "Full Career Guide (PDF)", file: "../AI-Security-Career-Guide.pdf", type: "pdf" },
  { label: "Full Career Guide (Word)", file: "../AI-Security-Career-Guide.docx", type: "docx" },
  { label: "Weekly Study Schedule", id: "schedule", type: "generated" },
  { label: "Phase Checklist (All Phases)", id: "checklist", type: "generated" },
  { label: "OWASP LLM Top 10 Quick Reference", id: "owasp-ref", type: "generated" },
  { label: "Resume Template (AI Security)", id: "resume", type: "generated" },
  { label: "Progress Export (JSON)", id: "progress", type: "generated" },
  { label: "Content API (JSON)", file: "content.json", type: "json" },
];

const OWASP_LLM_QUICK_REF = [
  "LLM01 — Prompt Injection",
  "LLM02 — Sensitive Information Disclosure",
  "LLM03 — Supply Chain Vulnerabilities",
  "LLM04 — Data and Model Poisoning",
  "LLM05 — Improper Output Handling",
  "LLM06 — Excessive Agency",
  "LLM07 — System Prompt Leakage",
  "LLM08 — Vector and Embedding Weaknesses",
  "LLM09 — Misinformation",
  "LLM10 — Unbounded Consumption",
];
