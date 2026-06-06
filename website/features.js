/** Interactive features: flashcards, planner, labs, analytics, tutor, team, notifications */
(function () {
  const FC_KEY = "aiSecFlashcards";
  const VID_KEY = "aiSecVideoProgress";
  const HOURS_KEY = "aiSecStudyHours";
  const TEAM_KEY = "aiSecTeamProfiles";
  const REMINDER_KEY = "aiSecReminder";

  function getJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  }
  function setJson(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  /* ── Flashcards (SM-2 simplified) ── */
  function getFcState() {
    return getJson(FC_KEY, {});
  }

  function rateCard(id, quality) {
    const s = getFcState();
    const prev = s[id] || { interval: 0, ease: 2.5, due: Date.now() };
    if (quality < 3) {
      prev.interval = 0;
      prev.due = Date.now() + 60000;
    } else {
      prev.interval = prev.interval === 0 ? 1 : prev.interval === 1 ? 3 : Math.round(prev.interval * prev.ease);
      prev.ease = Math.max(1.3, prev.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      prev.due = Date.now() + prev.interval * 86400000;
    }
    s[id] = prev;
    setJson(FC_KEY, s);
  }

  function getDueCards(deck) {
    const s = getFcState();
    const now = Date.now();
    let cards = typeof FLASHCARDS !== "undefined" ? [...FLASHCARDS] : [];
    if (deck && deck !== "all") cards = cards.filter((c) => c.deck === deck);
    return cards.filter((c) => !s[c.id] || s[c.id].due <= now);
  }

  function initFlashcards(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof FLASHCARDS === "undefined") return;

    let deck = "all";
    let idx = 0;
    let flipped = false;
    let queue = getDueCards(deck);

    function renderControls() {
      const decks = ["all", ...new Set(FLASHCARDS.map((c) => c.deck))];
      el.innerHTML = `
        <div class="filter-bar" id="fcDecks">${decks.map((d) =>
          `<button class="filter-btn ${d === deck ? "active" : ""}" data-deck="${d}">${d}</button>`).join("")}</div>
        <p id="fcStats" style="color:var(--text-muted);font-size:0.875rem"></p>
        <div id="fcCard"></div>`;
      el.querySelector("#fcDecks").addEventListener("click", (e) => {
        if (!e.target.dataset.deck) return;
        deck = e.target.dataset.deck;
        idx = 0;
        flipped = false;
        queue = getDueCards(deck);
        initFlashcards(containerId);
      });
      showCard();
    }

    function showCard() {
      const stats = document.getElementById("fcStats");
      const cardEl = document.getElementById("fcCard");
      if (!queue.length) {
        cardEl.innerHTML = `<div class="alert alert-info"><strong>All caught up!</strong> Check back tomorrow or switch decks.</div>`;
        stats.textContent = "0 cards due";
        return;
      }
      if (idx >= queue.length) idx = 0;
      const card = queue[idx];
      stats.textContent = `${queue.length} cards due · Card ${idx + 1} of ${queue.length}`;
      cardEl.innerHTML = `
        <div class="flashcard ${flipped ? "flipped" : ""}" id="fcFlip">
          <div class="flashcard-inner">
            <div class="flashcard-front"><span class="tag">${card.deck}</span><h3>${card.front}</h3><p>Click to flip</p></div>
            <div class="flashcard-back"><p>${card.back}</p></div>
          </div>
        </div>
        <div class="fc-rating" style="display:${flipped ? "flex" : "none"};gap:0.5rem;margin-top:1rem;flex-wrap:wrap">
          <button class="btn btn-secondary" data-q="1" type="button">Again</button>
          <button class="btn btn-secondary" data-q="3" type="button">Hard</button>
          <button class="btn btn-primary" data-q="4" type="button">Good</button>
          <button class="btn btn-primary" data-q="5" type="button">Easy</button>
        </div>`;
      document.getElementById("fcFlip").addEventListener("click", () => {
        flipped = !flipped;
        document.getElementById("fcFlip").classList.toggle("flipped", flipped);
        cardEl.querySelector(".fc-rating").style.display = flipped ? "flex" : "none";
      });
      cardEl.querySelectorAll("[data-q]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          rateCard(card.id, +btn.dataset.q);
          idx++;
          flipped = false;
          queue = getDueCards(deck);
          showCard();
          logStudyMinutes(2);
          if (typeof AcademyV2 !== "undefined") AcademyV2.bumpStat("flashReviews");
        });
      });
    }
    renderControls();
  }

  /* ── Video progress ── */
  function getVideoProgress() { return getJson(VID_KEY, {}); }
  function toggleVideo(id) {
    const p = getVideoProgress();
    p[id] = !p[id];
    setJson(VID_KEY, p);
    return p[id];
  }

  function renderVideoLibrary(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof VIDEO_CATALOG === "undefined") return;
    const progress = getVideoProgress();
    el.innerHTML = VIDEO_CATALOG.map((v) => `
      <article class="glossary-item video-card" id="${v.id}">
        <label class="phase-checklist">
          <input type="checkbox" data-video-id="${v.id}" ${progress[v.id] ? "checked" : ""} />
          <strong>${v.title}</strong>
        </label>
        <p style="font-size:0.85rem;color:var(--text-muted)">${v.channel} · ${v.duration} · Phases: ${(v.phaseIds || [v.phase]).join(", ")}</p>
        ${typeof SiteUI !== "undefined" ? SiteUI.renderVideoPlayer({ embed: v.embed, watch: v.watch, title: v.title, ytId: v.ytId }) : ""}
        <a href="${v.watch}" target="_blank" rel="noopener" class="btn btn-secondary" style="margin-top:0.5rem;font-size:0.8rem">Open on YouTube ↗</a>
      </article>`).join("");
    el.querySelectorAll("[data-video-id]").forEach((cb) => {
      cb.addEventListener("change", () => toggleVideo(cb.dataset.videoId));
    });
  }

  /* ── Study planner + ICS ── */
  function generatePlan(form) {
    const hours = +form.hours.value || 10;
    const startPhase = form.startPhase.value;
    const weeks = +form.weeks.value || 12;
    const startDate = new Date(form.startDate.value || Date.now());
    const phases = [...BEGINNER_PATH, ...INTERMEDIATE_PATH];
    let startIdx = phases.findIndex((p) => p.id === startPhase);
    if (startIdx < 0) startIdx = 0;

    const events = [];
    const hrsPerPhase = Math.max(1, Math.floor((weeks * hours) / Math.max(1, phases.length - startIdx)));
    let week = 0;
    for (let i = startIdx; i < phases.length && week < weeks; i++) {
      const p = phases[i];
      const d = PHASE_DETAILS[p.id] || {};
      const labs = (d.labs || []).slice(0, 2).map((l) => l.label).join("; ") || "Review resources";
      const dt = new Date(startDate);
      dt.setDate(dt.getDate() + week * 7);
      events.push({
        title: `${p.title} — ${labs}`,
        desc: `Goal: ${p.goal}`,
        date: dt,
      });
      week += Math.max(1, Math.ceil(hrsPerPhase / hours));
    }
    return events;
  }

  function toICS(events) {
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    let ics = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//AI Security Academy//EN\r\n";
    events.forEach((e, i) => {
      const end = new Date(e.date);
      end.setHours(end.getHours() + 2);
      ics += "BEGIN:VEVENT\r\n";
      ics += `UID:aisec-${i}@academy.local\r\n`;
      ics += `DTSTART:${fmt(e.date)}\r\nDTEND:${fmt(end)}\r\n`;
      ics += `SUMMARY:${e.title.replace(/\r?\n/g, " ")}\r\n`;
      ics += `DESCRIPTION:${e.desc.replace(/\r?\n/g, " ")}\r\n`;
      ics += "END:VEVENT\r\n";
    });
    ics += "END:VCALENDAR";
    return ics;
  }

  function initPlanner(formId, outId) {
    const form = document.getElementById(formId);
    const out = document.getElementById(outId);
    if (!form) return;
    form.startDate.valueAsDate = new Date();
    if (form.startPhase) {
      form.startPhase.innerHTML = [...BEGINNER_PATH, ...INTERMEDIATE_PATH]
        .map((p) => `<option value="${p.id}">${p.phase}: ${p.title}</option>`).join("");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const events = generatePlan(form);
      out.innerHTML = `<div class="alert alert-info"><strong>${events.length} weeks planned</strong></div>
        <ul class="phase-concepts">${events.map((ev) =>
          `<li><strong>${ev.date.toLocaleDateString()}</strong> — ${ev.title}</li>`).join("")}</ul>
        <button class="btn btn-primary" type="button" id="dlIcs">Download calendar (.ics)</button>`;
      document.getElementById("dlIcs").addEventListener("click", () => {
        SiteUI.downloadFile("ai-security-study-plan.ics", toICS(events), "text/calendar");
      });
    });
  }

  /* ── Interactive labs ── */
  function initPromptLab() {
    const input = document.getElementById("labPromptInput");
    const output = document.getElementById("labPromptOutput");
    const send = document.getElementById("labPromptSend");
    if (!input || !output || typeof LAB_SCENARIOS === "undefined") return;
    const sys = LAB_SCENARIOS.promptLab;
    let messages = [{ role: "system", content: sys.systemPrompt }];

    function respond(user) {
      const lower = user.toLowerCase();
      if (sys.blocked.some((b) => lower.includes(b))) {
        if (lower.includes("ignore") || lower.includes("system prompt") || lower.includes("debug")) {
          if (typeof AcademyV2 !== "undefined") AcademyV2.bumpStat("labs");
          return "⚠️ SYSTEM PROMPT LEAKED:\n" + sys.systemPrompt + "\n\n[Attack successful — LLM01 Prompt Injection / LLM07 System Prompt Leakage]";
        }
        return "I cannot share sensitive configuration. [Guardrail blocked keyword]";
      }
      if (lower.includes("hello") || lower.includes("help")) return "Hello! I'm TechCorp Support. How can I help you today?";
      return "I'm here to help with TechCorp products. Could you describe your issue?";
    }

    send?.addEventListener("click", () => {
      const user = input.value.trim();
      if (!user) return;
      messages.push({ role: "user", content: user });
      const reply = respond(user);
      messages.push({ role: "assistant", content: reply });
      output.textContent = messages.filter((m) => m.role !== "system").map((m) =>
        `${m.role === "user" ? "You" : "Bot"}: ${m.content}`).join("\n\n---\n\n");
      input.value = "";
      logStudyMinutes(5);
    });
  }

  function initSpotAttack(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof SPOT_ATTACKS === "undefined") return;
    let score = 0;
    el.innerHTML = SPOT_ATTACKS.map((a, i) => `
      <div class="quiz-q" data-sa="${i}">
        <p><strong>Scenario:</strong> ${a.text}</p>
        ${a.options.map((o, j) => `<label><input type="radio" name="sa${i}" value="${j}" /> ${o}</label>`).join("")}
      </div>`).join("") + `<button class="btn btn-primary" id="saCheck" type="button">Check answers</button><p id="saResult"></p>`;
    document.getElementById("saCheck").addEventListener("click", () => {
      score = 0;
      SPOT_ATTACKS.forEach((a, i) => {
        const val = +el.querySelector(`input[name="sa${i}"]:checked`)?.value;
        const correct = a.options.indexOf(a.type);
        if (val === correct) score++;
      });
      document.getElementById("saResult").innerHTML = `<div class="alert alert-info">Score: ${score}/${SPOT_ATTACKS.length}</div>`;
    });
  }

  function initRagLab() {
    const poison = document.getElementById("ragPoisonInput");
    const add = document.getElementById("ragPoisonAdd");
    const ask = document.getElementById("ragQuestion");
    const ans = document.getElementById("ragAnswer");
    if (!poison || !add) return;
    let docs = [...CTF_CHALLENGES.find((c) => c.id === "ctf-rag-1").docs];

    add.addEventListener("click", () => {
      const t = poison.value.trim();
      if (t) docs.push({ title: "User upload", text: t, poison: true });
      poison.value = "";
      document.getElementById("ragDocList").innerHTML = docs.map((d) =>
        `<li>${d.title}: ${d.text.slice(0, 60)}…</li>`).join("");
    });

    ask?.addEventListener("click", () => {
      const q = "How do I reset my password?";
      const poisoned = docs.find((d) => d.poison || d.text.includes("email your current password"));
      ans.textContent = poisoned
        ? `Bot: Based on our knowledge base — "${poisoned.text}" [RAG retrieved poisoned document — LLM08]`
        : "Bot: Use the IT portal at https://it.company.com/reset [Safe response]";
    });
  }

  function initCtfPrompt() {
    const input = document.getElementById("ctfPromptInput");
    const btn = document.getElementById("ctfPromptBtn");
    const out = document.getElementById("ctfPromptOut");
    const ctf = CTF_CHALLENGES.find((c) => c.id === "ctf-prompt-1");
    if (!input || !ctf) return;
    btn?.addEventListener("click", () => {
      const msg = input.value.toLowerCase();
      if (msg.includes("ignore") || msg.includes("debug") || msg.includes("reveal") || msg.includes("secret")) {
        if (typeof AcademyV2 !== "undefined") AcademyV2.bumpStat("labs");
        out.innerHTML = `<div class="alert alert-warn">FLAG: ${ctf.flag} — Prompt injection successful!</div>`;
      } else {
        out.textContent = "Bot: I cannot help with that. [Try injection techniques from the Glossary]";
      }
    });
  }

  /* ── Cert quiz ── */
  function initCertQuiz(selectId, containerId, resultId) {
    const sel = document.getElementById(selectId);
    const el = document.getElementById(containerId);
    const res = document.getElementById(resultId);
    if (!sel || !el) return;

    function render(quizKey) {
      const quiz = CERT_QUIZZES[quizKey];
      if (!quiz) return;
      el.innerHTML = quiz.questions.map((q, i) => `
        <fieldset class="quiz-q"><legend>${i + 1}. ${q.q}</legend>
        ${q.options.map((o, j) => `<label><input type="radio" name="cq${i}" value="${j}" /> ${o}</label>`).join("")}
        </fieldset>`).join("") + `<button class="btn btn-primary" type="button" id="cqSubmit">Submit quiz</button>`;
      document.getElementById("cqSubmit").addEventListener("click", () => {
        let score = 0;
        quiz.questions.forEach((q, i) => {
          if (+el.querySelector(`input[name="cq${i}"]:checked`)?.value === q.answer) score++;
        });
        res.innerHTML = `<div class="alert alert-info"><strong>${score}/${quiz.questions.length}</strong> — ${score >= quiz.questions.length * 0.7 ? "Pass!" : "Review glossary and retry."}</div>`;
        logStudyMinutes(quiz.questions.length * 2);
      });
    }
    sel.addEventListener("change", () => render(sel.value));
    render(sel.value);
  }

  /* ── Analytics ── */
  function logStudyMinutes(m) {
    const log = getJson(HOURS_KEY, []);
    log.push({ date: new Date().toISOString().slice(0, 10), minutes: m });
    setJson(HOURS_KEY, log.slice(-500));
  }

  function renderAnalytics(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const hours = getJson(HOURS_KEY, []);
    const progress = typeof SiteUI !== "undefined" ? JSON.parse(localStorage.getItem("aiSecCareerProgress") || "{}") : {};
    const vids = getVideoProgress();
    const fc = getFcState();
    const bookmarks = typeof SiteUI !== "undefined" ? SiteUI.getBookmarks() : [];

    const phaseDone = Object.values(progress).filter(Boolean).length;
    const vidDone = Object.values(vids).filter(Boolean).length;
    const totalMin = hours.reduce((s, h) => s + h.minutes, 0);
    const fcReviewed = Object.keys(fc).length;

    const byDay = {};
    hours.forEach((h) => { byDay[h.date] = (byDay[h.date] || 0) + h.minutes; });
    const last7 = Object.entries(byDay).slice(-7);

    el.innerHTML = `
      <div class="card-grid">
        <article class="card"><h3>${phaseDone}</h3><p>Phases complete</p></article>
        <article class="card"><h3>${vidDone}/${typeof VIDEO_CATALOG !== "undefined" ? VIDEO_CATALOG.length : 0}</h3><p>Videos watched</p></article>
        <article class="card"><h3>${Math.round(totalMin / 60)}h</h3><p>Study time logged</p></article>
        <article class="card"><h3>${fcReviewed}</h3><p>Flashcards reviewed</p></article>
        <article class="card"><h3>${bookmarks.length}</h3><p>Bookmarks saved</p></article>
      </div>
      <h3 style="margin-top:2rem">Recent study activity (minutes)</h3>
      <div class="bar-chart">${last7.map(([d, m]) =>
        `<div class="bar-row"><span>${d}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, m / 2)}%"></div></div><span>${m}m</span></div>`).join("") || "<p>No activity logged yet. Use labs and flashcards!</p>"}
      </div>`;
  }

  /* ── AI Tutor (keyword search over site content) ── */
  function tutorAnswer(query) {
    if (!query.trim()) return "Ask me about learning paths, OWASP LLM Top 10, prompt injection, certifications, or where to start.";
    const q = query.toLowerCase();
    const rules = [
      { keys: ["start", "begin", "zero", "no experience"], ans: "Start at Phase 0 on the Learning Paths page, or take the Skill Quiz. This month: NetworkChuck Linux EP 1 + Python for Everybody + TryHackMe Pre Security." },
      { keys: ["prompt injection"], ans: "Prompt injection (LLM01): malicious instructions in user input or external data override system behavior. See Glossary and Labs page for interactive demo." },
      { keys: ["rag", "poison"], ans: "RAG poisoning corrupts the knowledge base so the LLM retrieves attacker-controlled documents. Try the RAG lab on the Labs page." },
      { keys: ["owasp", "top 10", "llm01"], ans: "OWASP LLM Top 10: LLM01 Prompt Injection through LLM10 Unbounded Consumption. Download quick reference from Downloads page." },
      { keys: ["cert", "security+", "coasp", "secai"], ans: "Certs: SecAI+ (CY0-001) for AI security — see secai.html for 4-week plan. Security+ after Phase 5. COASP for offensive AI. Skip certs 6–9 months if zero experience." },
      { keys: ["salary", "job", "career"], ans: "AI Security Engineer: ~$120K–$180K US (2–5 yrs). See Career page for roles and résumé template. Jobs page has curated search links." },
      { keys: ["tool", "promptfoo", "pyrit"], ans: "Promptfoo for CI/CD scanning; PyRIT for multi-turn attacks; Garak for baseline probes. Compare on Compare Tools page." },
      { keys: ["how long", "timeline", "months"], ans: "At 10–12 hrs/week: 12–18 months from zero to job-ready with AI security angle. See timeline on Home page." },
      { keys: ["video", "watch"], ans: "All videos are on the Videos page with verified YouTube links. Phase 1: NetworkChuck Linux. Phase 2: Dr. Chuck Python." },
    ];
    for (const r of rules) {
      if (r.keys.some((k) => q.includes(k))) return r.ans;
    }
    if (typeof SiteUI !== "undefined" && SiteUI.openSearch) {
      return "I couldn't find a specific answer. Try Ctrl+K site search, or browse: paths.html, glossary.html, case-studies.html.";
    }
    return "Try asking about: starting path, prompt injection, RAG poisoning, certifications, jobs, or tools.";
  }

  function initTutor(inputId, outId) {
    const input = document.getElementById(inputId);
    const out = document.getElementById(outId);
    const btn = document.getElementById("tutorSend");
    const go = () => { out.textContent = tutorAnswer(input.value); logStudyMinutes(1); };
    btn?.addEventListener("click", go);
    input?.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
  }

  /* ── Team profiles ── */
  function getTeamProfiles() { return getJson(TEAM_KEY, [{ id: "default", name: "Me", active: true }]); }

  function initTeam(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const profiles = getTeamProfiles();

    function render() {
      el.innerHTML = `
        <div class="card-grid">${profiles.map((p) => `
          <article class="card"><h3>${p.name}</h3>
          <p>Track separate progress per team member (local browser storage).</p>
          <button class="btn btn-secondary" data-switch="${p.id}" type="button">${p.active ? "Active" : "Switch to"}</button>
          </article>`).join("")}</div>
        <form id="teamAddForm" class="alert alert-info" style="margin-top:1rem">
          <label>Add member: <input name="name" required placeholder="Name" style="padding:0.4rem;margin-left:0.5rem" /></label>
          <button class="btn btn-primary" type="submit" style="margin-left:0.5rem">Add</button>
        </form>`;
      el.querySelector("#teamAddForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = e.target.name.value.trim();
        if (name) {
          profiles.push({ id: "p-" + Date.now(), name, active: false });
          setJson(TEAM_KEY, profiles);
          render();
        }
      });
    }
    render();
  }

  /* ── Study reminders ── */
  function initReminder() {
    const btn = document.getElementById("enableReminder");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      if (!("Notification" in window)) { alert("Notifications not supported in this browser."); return; }
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setJson(REMINDER_KEY, { enabled: true, hour: 19 });
        alert("Daily study reminder enabled (when site is open). Full push requires PWA install.");
        scheduleLocalReminder();
      }
    });
  }

  function scheduleLocalReminder() {
    const cfg = getJson(REMINDER_KEY, {});
    if (!cfg.enabled) return;
    setInterval(() => {
      const h = new Date().getHours();
      if (h === (cfg.hour || 19) && Notification.permission === "granted") {
        new Notification("AI Security Academy", { body: "Time for today's study session! Open your learning path." });
      }
    }, 3600000);
  }

  /* ── Newsletter (local) ── */
  function initNewsletter(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      const subs = getJson(NEWSLETTER_KEY, []);
      if (email && !subs.includes(email)) subs.push(email);
      setJson(NEWSLETTER_KEY, subs);
      form.innerHTML = `<div class="alert alert-info">Thanks! We'll remind you to check the <a href="blog.html">changelog</a> for updates. (${subs.length} subscriber(s) on this device)</div>`;
    });
  }

  /* ── Submit case study (local) ── */
  function initSubmit(formId, listId) {
    const form = document.getElementById(formId);
    const list = document.getElementById(listId);
    const KEY = "aiSecSubmissions";
    const subs = getJson(KEY, []);

    if (list) {
      list.innerHTML = subs.length
        ? subs.map((s) => `<article class="card"><h3>${s.title}</h3><p>${s.summary}</p><span class="tag">${s.date}</span></article>`).join("")
        : "<p>No local submissions yet.</p>";
    }

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      subs.unshift({
        title: form.title.value,
        summary: form.summary.value,
        date: new Date().toISOString().slice(0, 10),
      });
      setJson(KEY, subs.slice(0, 20));
      form.reset();
      initSubmit(formId, listId);
    });
  }

  window.AcademyFeatures = {
    initFlashcards,
    renderVideoLibrary,
    initPlanner,
    initPromptLab,
    initSpotAttack,
    initRagLab,
    initCtfPrompt,
    initCertQuiz,
    renderAnalytics,
    initTutor,
    initTeam,
    initReminder,
    initNewsletter,
    initSubmit,
    logStudyMinutes,
    getVideoProgress,
    tutorAnswer,
  };

  document.addEventListener("DOMContentLoaded", scheduleLocalReminder);
})();
