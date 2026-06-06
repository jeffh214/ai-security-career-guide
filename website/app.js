/** Shared site utilities — search, bookmarks, theme, progress, nav */
(function () {
  const PAGES = [
    { href: "index.html", label: "Home" },
    { href: "quiz.html", label: "Quiz" },
    { href: "blog.html", label: "Blog" },
    { href: "projects.html", label: "Projects" },
    { href: "compare.html", label: "Compare" },
    { href: "mentor.html", label: "Mentor" },
    { href: "team.html", label: "Team" },
    { href: "submit.html", label: "Submit" },
    { href: "badges.html", label: "Badges" },
    { href: "certificate.html", label: "Certificate" },
  ];

  function renderNavGroups() {
    if (typeof NAV_GROUPS === "undefined") {
      return PAGES.map((p) =>
        `<a href="${p.href}" class="${p.href === currentPage ? "active" : ""}">${p.label}</a>`
      ).join("");
    }
    const isActive = (href) => href === currentPage;
    const groupActive = (items) => items.some((i) => isActive(i.href));

    return `
      <a href="index.html" class="${currentPage === "index.html" ? "active" : ""}">Home</a>
      ${NAV_GROUPS.map((g) => `
        <div class="nav-group ${groupActive(g.items) ? "nav-group-active" : ""}">
          <button type="button" class="nav-group-btn" aria-expanded="false">${g.label} ▾</button>
          <div class="nav-dropdown">${g.items.map((i) =>
            `<a href="${i.href}" class="${isActive(i.href) ? "active" : ""}">${i.label}</a>`
          ).join("")}</div>
        </div>`).join("")}
      ${PAGES.filter((p) => p.href !== "index.html").slice(0, 3).map((p) =>
        `<a href="${p.href}" class="${isActive(p.href) ? "active" : ""}">${p.label}</a>`
      ).join("")}
    `;
  }

  function bindNavGroups() {
    document.querySelectorAll(".nav-group-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const group = btn.closest(".nav-group");
        const open = group.classList.toggle("open");
        btn.setAttribute("aria-expanded", open);
        document.querySelectorAll(".nav-group.open").forEach((g) => {
          if (g !== group) { g.classList.remove("open"); g.querySelector(".nav-group-btn")?.setAttribute("aria-expanded", "false"); }
        });
      });
    });
    document.addEventListener("click", () => {
      document.querySelectorAll(".nav-group.open").forEach((g) => {
        g.classList.remove("open");
        g.querySelector(".nav-group-btn")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  const PROGRESS_KEY = "aiSecCareerProgress";
  const BOOKMARKS_KEY = "aiSecBookmarks";
  const THEME_KEY = "aiSecTheme";

  const currentPage = location.pathname.split("/").pop() || "index.html";

  function renderNav() {
    const el = document.getElementById("siteNav");
    if (!el) return;

    const links = renderNavGroups();

    el.innerHTML = `
      <div class="nav-inner">
        <a class="nav-brand" href="index.html">${SITE.name.replace("Academy", "")}<span>Academy</span></a>
        <div class="nav-actions">
          <span id="streakWidget" class="nav-streak" aria-live="polite"></span>
          <button class="icon-btn" id="shortcutsToggle" title="Keyboard shortcuts (?)" aria-label="Keyboard shortcuts">?</button>
          <button class="icon-btn" id="langToggle" title="Language" aria-label="Toggle language" data-i18n="lang.toggle">ES</button>
          <button class="icon-btn" id="installPwa" title="Install app" aria-label="Install app" style="display:none">⬇</button>
          <button class="icon-btn" id="searchToggle" title="Search (Ctrl+K)" aria-label="Search">⌕</button>
          <button class="icon-btn" id="themeToggle" title="Toggle theme" aria-label="Toggle theme">◐</button>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">☰</button>
        </div>
        <div class="nav-links" id="navLinks">${links}</div>
      </div>`;

    document.getElementById("navToggle")?.addEventListener("click", () => {
      document.getElementById("navLinks")?.classList.toggle("open");
    });
    document.getElementById("searchToggle")?.addEventListener("click", openSearch);
    document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
    document.getElementById("shortcutsToggle")?.addEventListener("click", () => {
      document.getElementById("shortcutsModal")?.classList.toggle("open");
    });
    bindNavGroups();
  }

  function renderFooter() {
    const el = document.querySelector(".site-footer");
    if (!el) return;
    el.innerHTML = `
      <p>${SITE.name} — ${SITE.tagline}</p>
      <p>For educational and defensive purposes only. Practice only in legal lab environments.</p>
      <p><a href="ethics.html">Ethics & Legal</a> · <a href="downloads.html">Downloads</a> · <a href="videos.html">Videos</a> · <a href="content.json">API</a></p>
    `;
  }

  /* Theme */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light") document.body.classList.add("theme-light");
  }

  function toggleTheme() {
    document.body.classList.toggle("theme-light");
    localStorage.setItem(THEME_KEY, document.body.classList.contains("theme-light") ? "light" : "dark");
  }

  /* Search */
  function buildSearchIndex() {
    const items = [];

    const add = (title, text, url, category) => {
      items.push({ title, text, url, category, hay: `${title} ${text} ${category}`.toLowerCase() });
    };

    BEGINNER_PATH.forEach((p) => add(p.title, p.goal, `paths.html#${p.id}`, "Learning Path"));
    INTERMEDIATE_PATH.forEach((p) => add(p.title, p.goal, `paths.html#${p.id}`, "Learning Path"));

    RESOURCE_CATEGORIES.forEach((cat) =>
      cat.items.forEach((i) => add(i.label, cat.title, "resources.html", "Resource"))
    );

    (GLOSSARY_LLM || []).forEach((g) => add(g.term, g.definition, "glossary.html", "Glossary"));
    (GLOSSARY_ML || []).forEach((g) => add(g.term, g.definition, "glossary.html", "Glossary"));

    if (typeof CASE_STUDIES !== "undefined")
      CASE_STUDIES.forEach((c) => add(c.title, c.summary, "case-studies.html", "Case Study"));
    if (typeof INTERVIEW_QUESTIONS !== "undefined")
      INTERVIEW_QUESTIONS.forEach((q) => add(q.q, q.outline, "interview.html", "Interview"));
    if (typeof VIDEO_CATALOG !== "undefined")
      VIDEO_CATALOG.forEach((v) => add(v.title, v.channel, "videos.html#" + v.id, "Video"));
    if (typeof BLOG_POSTS !== "undefined")
      BLOG_POSTS.forEach((b) => add(b.title, b.summary, "blog.html", "Blog"));
    if (typeof PROJECT_WALKTHROUGHS !== "undefined")
      PROJECT_WALKTHROUGHS.forEach((p) => add(p.title, p.steps.join(" "), "projects.html", "Project"));
    if (typeof COMPLIANCE_TRACK !== "undefined")
      COMPLIANCE_TRACK.forEach((c) => add(c.framework, c.summary, "compliance.html", "Compliance"));
    if (typeof BUG_BOUNTY_GUIDE !== "undefined")
      add("Bug Bounty Guide", BUG_BOUNTY_GUIDE.intro, "bounty.html", "Career");
    if (typeof MITRE_ATLAS !== "undefined")
      MITRE_ATLAS.forEach((t) => add(t.name, t.desc, "atlas.html", "ATLAS"));
    if (typeof AGENTIC_TOP_10 !== "undefined")
      AGENTIC_TOP_10.forEach((t) => add(t.name, t.desc, "agentic.html", "Agentic"));
    if (typeof SECAI_EXAM !== "undefined")
      add("CompTIA SecAI+ Exam Prep", SECAI_EXAM.code + " " + SECAI_EXAM.passing, "secai.html", "Certification");

    return items;
  }

  let searchIndex = [];

  function ensureSearchModal() {
    if (document.getElementById("searchModal")) return;
    const modal = document.createElement("div");
    modal.id = "searchModal";
    modal.className = "search-modal";
    modal.innerHTML = `
      <div class="search-modal-inner">
        <input type="search" id="searchInput" placeholder="Search paths, resources, glossary, case studies…" autocomplete="off" />
        <div id="searchResults" class="search-results"></div>
        <p class="search-hint">Press Esc to close</p>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSearch();
    });
    document.getElementById("searchInput").addEventListener("input", (e) => {
      runSearch(e.target.value);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    });
  }

  function openSearch() {
    ensureSearchModal();
    if (!searchIndex.length) searchIndex = buildSearchIndex();
    document.getElementById("searchModal").classList.add("open");
    const input = document.getElementById("searchInput");
    input.value = "";
    input.focus();
    runSearch("");
  }

  function closeSearch() {
    document.getElementById("searchModal")?.classList.remove("open");
  }

  function runSearch(query) {
    const results = document.getElementById("searchResults");
    if (!results) return;
    const q = query.trim().toLowerCase();
    const matches = q
      ? searchIndex.filter((i) => i.hay.includes(q)).slice(0, 20)
      : searchIndex.slice(0, 12);

    results.innerHTML = matches.length
      ? matches
          .map(
            (m) =>
              `<a class="search-result" href="${m.url}"><span class="tag">${m.category}</span><strong>${m.title}</strong><span>${m.text.slice(0, 100)}…</span></a>`
          )
          .join("")
      : `<p class="search-empty">No results for "${query}"</p>`;
  }

  /* Bookmarks */
  function getBookmarks() {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveBookmarks(list) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  }

  function toggleBookmark(url, label) {
    let list = getBookmarks();
    const idx = list.findIndex((b) => b.url === url);
    if (idx >= 0) list.splice(idx, 1);
    else list.push({ url, label, saved: Date.now() });
    saveBookmarks(list);
    updateBookmarkButtons();
    return idx < 0;
  }

  function isBookmarked(url) {
    return getBookmarks().some((b) => b.url === url);
  }

  function updateBookmarkButtons() {
    document.querySelectorAll("[data-bookmark-url]").forEach((btn) => {
      const on = isBookmarked(btn.dataset.bookmarkUrl);
      btn.textContent = on ? "★ Saved" : "☆ Save";
      btn.classList.toggle("bookmarked", on);
    });
  }

  function bookmarkButton(url, label) {
    const safe = label.replace(/"/g, "&quot;");
    return `<button class="bookmark-btn" data-bookmark-url="${url}" data-bookmark-label="${safe}" type="button">☆ Save</button>`;
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-bookmark-url]");
    if (!btn) return;
    toggleBookmark(btn.dataset.bookmarkUrl, btn.dataset.bookmarkLabel);
  });

  /* Progress */
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  }

  function togglePhaseComplete(phaseId) {
    const progress = getProgress();
    progress[phaseId] = !progress[phaseId];
    saveProgress(progress);
    updateProgressUI();
    if (typeof AcademyV2 !== "undefined") {
      AcademyV2.recordActivity();
      AcademyV2.checkBadges();
    }
  }

  function updateProgressUI() {
    const progress = getProgress();
    const allPhases = [...BEGINNER_PATH, ...INTERMEDIATE_PATH];
    const done = allPhases.filter((p) => progress[p.id]).length;
    const pct = allPhases.length ? Math.round((done / allPhases.length) * 100) : 0;

    const fill = document.getElementById("progressFill");
    const label = document.getElementById("progressLabel");
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${done} of ${allPhases.length} phases marked complete (${pct}%)`;

    document.querySelectorAll("[data-phase-id]").forEach((cb) => {
      cb.checked = !!progress[cb.dataset.phaseId];
    });
  }

  function initProgressChecklist() {
    document.querySelectorAll("[data-phase-id]").forEach((cb) => {
      cb.addEventListener("change", () => togglePhaseComplete(cb.dataset.phaseId));
    });
    updateProgressUI();
  }

  function exportProgress() {
    const data = {
      exported: new Date().toISOString(),
      progress: getProgress(),
      bookmarks: getBookmarks(),
      phases: [...BEGINNER_PATH, ...INTERMEDIATE_PATH].map((p) => ({
        id: p.id,
        title: p.title,
        complete: !!getProgress()[p.id],
      })),
    };
    downloadFile("ai-security-progress.json", JSON.stringify(data, null, 2));
  }

  /* Downloads */
  function downloadFile(filename, content, mime = "text/plain") {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function generateChecklist() {
    let text = "AI SECURITY CAREER ACADEMY — PHASE CHECKLIST\n" + "=".repeat(50) + "\n\n";
    BEGINNER_PATH.forEach((p) => {
      const d = (typeof PHASE_DETAILS !== "undefined" && PHASE_DETAILS[p.id]) || {};
      text += `${p.phase}: ${p.title} (${p.weeks || ""})\n`;
      text += `Goal: ${p.goal}\n`;
      if (d.doneWhen) d.doneWhen.forEach((x) => (text += `  [ ] ${x}\n`));
      text += "\n";
    });
    return text;
  }

  function generateSchedule() {
    let text = "WEEKLY STUDY SCHEDULE (10 hrs/week)\n" + "=".repeat(40) + "\n\n";
    WEEKLY_SCHEDULE.forEach((r) => (text += `${r.day.padEnd(12)} ${r.time.padEnd(8)} ${r.activity}\n`));
    return text;
  }

  function generateOwaspRef() {
    const items = typeof OWASP_LLM_QUICK_REF !== "undefined" ? OWASP_LLM_QUICK_REF : [];
    return "OWASP LLM TOP 10 — QUICK REFERENCE\n" + "=".repeat(40) + "\n\n" + items.join("\n") + "\n\nhttps://genai.owasp.org/llm-top-10/\n";
  }

  function handleGeneratedDownload(id) {
    switch (id) {
      case "checklist": return downloadFile("phase-checklist.txt", generateChecklist());
      case "schedule": return downloadFile("weekly-schedule.txt", generateSchedule());
      case "owasp-ref": return downloadFile("owasp-llm-top10.txt", generateOwaspRef());
      case "resume": return downloadFile("ai-security-resume-template.txt", typeof RESUME_TEMPLATE !== "undefined" ? RESUME_TEMPLATE : "");
      case "progress": return exportProgress();
      case "secai-notes": return downloadFile("secai-domain-notes.txt", typeof generateSecaiNotesText === "function" ? generateSecaiNotesText() : "Load secai.html for full notes.");
      case "secai-plan": return downloadFile("secai-4-week-plan.txt", typeof generateSecaiPlanText === "function" ? generateSecaiPlanText() : "");
    }
  }

  function youtubeIdFromUrl(url) {
    if (!url) return null;
    const m = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  function renderVideoPlayer({ embed, watch, title, ytId }) {
    const id = ytId || youtubeIdFromUrl(embed || watch);
    if (!id) return "";
    const watchUrl = watch || `https://www.youtube.com/watch?v=${id}`;
    const embedUrl = embed || `https://www.youtube.com/embed/${id}`;
    const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    const safeTitle = (title || "Video").replace(/"/g, "&quot;");
    const fileHint = location.protocol === "file:"
      ? `<p class="video-file-hint">Opened as a local file — click to watch on YouTube.</p>`
      : "";

    return `
      <div class="video-player" data-yt-id="${id}" data-embed="${embedUrl}" data-watch="${watchUrl}" data-title="${safeTitle}">
        <button type="button" class="video-thumb-wrap" aria-label="Play ${safeTitle}">
          <img class="video-thumb" src="${thumb}" alt="${safeTitle} thumbnail" loading="lazy" width="480" height="360" />
          <span class="video-play-btn" aria-hidden="true">▶</span>
        </button>
        ${fileHint}
        <p class="video-fallback"><a href="${watchUrl}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></p>
      </div>`;
  }

  function activateVideoPlayer(player) {
    const watchUrl = player.dataset.watch;
    const embedUrl = player.dataset.embed;
    const title = player.dataset.title || "Video";

    if (location.protocol === "file:") {
      window.open(watchUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (player.classList.contains("is-playing")) return;

    const embed = document.createElement("div");
    embed.className = "video-embed video-embed-active";
    embed.innerHTML = `<iframe src="${embedUrl}?autoplay=1&rel=0" title="${title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;

    player.querySelector(".video-thumb-wrap")?.replaceWith(embed);
    player.querySelector(".video-file-hint")?.remove();
    player.classList.add("is-playing");
  }

  function initVideoPlayers() {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".video-thumb-wrap");
      if (!trigger) return;
      e.preventDefault();
      const player = trigger.closest(".video-player");
      if (player) activateVideoPlayer(player);
    });
  }

  /* UI helpers */
  function externalLink(url, label) {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label || url}</a>`;
  }

  function freeBadge(isFree) {
    if (isFree === true) return '<span class="tag tag-free">Free</span>';
    if (isFree === false) return '<span class="tag tag-paid">Paid</span>';
    return "";
  }

  function renderResourceList(resources) {
    if (!resources?.length) return "";
    return `<ul class="resource-list">${resources
      .map((r) => `<li>${freeBadge(r.free)} ${externalLink(r.url, r.label)} ${bookmarkButton(r.url, r.label)}</li>`)
      .join("")}</ul>`;
  }

  function renderPhaseCard(p) {
    const d = (typeof PHASE_DETAILS !== "undefined" && PHASE_DETAILS[p.id]) || {};
    const resources = (p.resources || []).map((r) =>
      `<li>${freeBadge(r.free)} ${externalLink(r.url, r.label)} ${bookmarkButton(r.url, r.label)}</li>`
    ).join("");
    const concepts = (p.concepts || []).map((c) => `<li>${c}</li>`).join("");
    const doneWhen = (d.doneWhen || []).map((x) => `<li>${x}</li>`).join("");
    const labs = (d.labs || []).map((l) =>
      `<li>${freeBadge(l.free)} ${externalLink(l.url, l.label)} ${bookmarkButton(l.url, l.label)}</li>`
    ).join("");
    const video = d.video
      ? `${SiteUI.renderVideoPlayer({ embed: d.video, title: p.title })}<p style="font-size:0.8rem"><a href="videos.html">Full video library with progress tracking →</a></p>`
      : "";

    return `
      <article class="path-phase" id="${p.id}">
        <div class="phase-marker">
          <span class="phase-num">${p.phase.replace("Phase ", "P")}</span>
          <span class="phase-weeks">${p.weeks || p.duration || ""}</span>
        </div>
        <div class="phase-body">
          <label class="phase-checklist">
            <input type="checkbox" data-phase-id="${p.id}" />
            <h3 style="display:inline;margin:0">${p.title}</h3>
          </label>
          <p class="phase-goal">Goal: ${p.goal}</p>
          ${video}
          ${doneWhen ? `<div class="done-when"><strong>Done when:</strong><ul class="phase-concepts">${doneWhen}</ul></div>` : ""}
          ${concepts ? `<ul class="phase-concepts">${concepts}</ul>` : ""}
          ${labs ? `<div class="labs-block"><strong>Recommended labs:</strong><ul class="resource-list">${labs}</ul></div>` : ""}
          ${resources ? `<div class="labs-block"><strong>Resources:</strong><ul class="resource-list">${resources}</ul></div>` : ""}
          <details class="phase-notes">
            <summary>My notes for this phase</summary>
            <textarea data-note-phase="${p.id}" rows="2" placeholder="Journal: wins, blockers, questions…"
              aria-label="Notes for ${p.title}"></textarea>
          </details>
        </div>
      </article>`;
  }

  function renderPhases(phases) {
    return `<div class="path-track">${phases.map(renderPhaseCard).join("")}</div>`;
  }

  function renderComparisonTable(comp) {
    return `
      <section class="compare-block">
        <h3>${comp.title}</h3>
        <div class="table-scroll">
          <table class="data-table compare-table">
            <thead><tr>${comp.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
            <tbody>
              ${comp.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="tag-list" style="margin-top:0.75rem">
          ${(comp.links || []).map((l) => `<a class="tag" href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("")}
        </div>
      </section>`;
  }

  function initTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll(".tab-btn");
    const panels = container.querySelectorAll(".tab-panel");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        panels.forEach((p) => p.classList.toggle("active", p.id === target));
      });
    });
  }

  /* Quiz */
  function runQuiz() {
    const container = document.getElementById("quizContainer");
    if (!container || typeof QUIZ_QUESTIONS === "undefined") return;

    let score = 0;
    container.innerHTML = `
      <div class="quiz-panel">
        <div class="quiz-card">
          <div class="quiz-questions">
            ${QUIZ_QUESTIONS.map(
              (q, i) => `
              <fieldset class="quiz-q">
                <legend><span class="quiz-num">${i + 1}</span>${q.q}</legend>
                <div class="quiz-options">
                  <label><input type="radio" name="q${i}" value="yes" /> Yes</label>
                  <label><input type="radio" name="q${i}" value="no" /> No</label>
                </div>
              </fieldset>`
            ).join("")}
          </div>
          <div class="quiz-actions">
            <button class="btn btn-primary" id="quizSubmit" type="button">See my recommended path</button>
          </div>
        </div>
      </div>`;

    document.getElementById("quizSubmit").addEventListener("click", () => {
      score = 0;
      let unanswered = 0;
      QUIZ_QUESTIONS.forEach((q, i) => {
        const val = container.querySelector(`input[name="q${i}"]:checked`)?.value;
        if (!val) unanswered++;
        else if (val === "yes") score += q.yes;
        else if (val === "no") score += q.no;
      });

      if (unanswered) {
        document.getElementById("quizResult").innerHTML = `
          <div class="quiz-panel">
            <div class="alert alert-warn">Please answer all ${QUIZ_QUESTIONS.length} questions before continuing.</div>
          </div>`;
        document.getElementById("quizResult").scrollIntoView({ behavior: "smooth" });
        return;
      }

      let path, desc, link;
      if (score <= 5) {
        path = "Complete Beginner Path";
        desc = "Start at Phase 0 — digital foundations, Linux, and Python. Build the base before jumping into security or AI topics.";
        link = "paths.html#beginner";
      } else if (score <= 14) {
        path = "Beginner Path — Phases 3–4";
        desc = "You have some fundamentals. Focus on networking and intro cybersecurity labs next.";
        link = "paths.html#phase-3";
      } else if (score <= 22) {
        path = "Phase 5+ or Intermediate Path";
        desc = "Solid foundation. Move into web security and core pentest skills, then branch toward AI security.";
        link = "paths.html#tab-intermediate";
      } else {
        path = "AI Security Specialization";
        desc = "You're ready for AIRT, OWASP LLM Top 10, and the HTB AI Red Teamer path.";
        link = "paths.html#phase-6";
      }

      document.getElementById("quizResult").innerHTML = `
        <div class="quiz-panel">
          <div class="quiz-result-card">
            <p class="quiz-result-label">Your recommended starting point</p>
            <h2>${path}</h2>
            <p>${desc}</p>
            <a class="btn btn-primary" href="${link}">Go to learning path</a>
          </div>
        </div>`;
      document.getElementById("quizResult").scrollIntoView({ behavior: "smooth" });
    });
  }

  /* PWA */
  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js").catch(() => {});
    }
  }

  window.SiteUI = {
    renderNav,
    renderFooter,
    externalLink,
    freeBadge,
    renderResourceList,
    renderPhases,
    renderPhaseCard,
    renderComparisonTable,
    initTabs,
    initProgressChecklist,
    updateProgressUI,
    youtubeIdFromUrl,
    renderVideoPlayer,
    activateVideoPlayer,
    initVideoPlayers,
    getBookmarks,
    toggleBookmark,
    bookmarkButton,
    updateBookmarkButtons,
    exportProgress,
    handleGeneratedDownload,
    downloadFile,
    runQuiz,
    openSearch,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderNav();
    renderFooter();
    ensureSearchModal();
    registerServiceWorker();
    initVideoPlayers();
    setTimeout(updateBookmarkButtons, 100);
  });
})();
