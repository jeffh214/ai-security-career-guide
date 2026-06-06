const CACHE = "ai-sec-academy-v4";
const ASSETS = [
  "./", "./index.html", "./quiz.html", "./paths.html", "./videos.html", "./labs.html",
  "./flashcards.html", "./planner.html", "./timer.html", "./resources.html", "./glossary.html", "./threats.html",
  "./case-studies.html", "./interview.html", "./cert-quiz.html", "./match-quiz.html", "./certifications.html",
  "./projects.html", "./career.html", "./jobs.html", "./compare.html", "./tutor.html",
  "./analytics.html", "./blog.html", "./mentor.html", "./team.html", "./submit.html",
  "./community.html", "./ethics.html", "./downloads.html",
  "./compliance.html", "./bounty.html", "./notes.html", "./sync.html", "./badges.html",
  "./atlas.html", "./agentic.html", "./resume.html", "./certificate.html", "./secai.html", "./og-image.svg",
  "./styles.css", "./site-data.js", "./site-data-extra.js", "./site-data-v3.js", "./site-data-v4.js",
  "./site-data-v5.js", "./site-data-secai.js", "./app.js", "./features.js", "./features-v2.js", "./features-v3.js",
  "./manifest.webmanifest", "./content.json",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached)
    )
  );
});
