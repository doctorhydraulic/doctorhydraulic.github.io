// Mobile accordion for the part sections (added 27 Nov 2026).
// On phones each category list starts closed; tap the title to open it.
(function () {
  var MOBILE = window.matchMedia("(max-width: 859px)");

  function label(n) {
    return document.documentElement.lang === "en" ? n + " parts" : n + " قطعة";
  }

  function setup(sec) {
    if (sec.dataset.acc) return;
    var head = sec.querySelector(":scope > .ps-head");
    if (!head) return;
    sec.dataset.acc = "1";
    sec.classList.add("acc");
    if (MOBILE.matches) sec.classList.add("closed");
    head.setAttribute("role", "button");
    head.setAttribute("tabindex", "0");
    var count = document.createElement("span");
    count.className = "acc-count";
    count.textContent = label(sec.querySelectorAll("a.item").length);
    var chev = document.createElement("span");
    chev.className = "acc-chev";
    chev.setAttribute("aria-hidden", "true");
    chev.textContent = "⌄";
    head.appendChild(count);
    head.appendChild(chev);
    sync(sec);
    function toggle() {
      sec.classList.toggle("closed");
      sync(sec);
    }
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  }

  function sync(sec) {
    var head = sec.querySelector(":scope > .ps-head");
    if (head) head.setAttribute("aria-expanded", sec.classList.contains("closed") ? "false" : "true");
  }

  function openSection(id) {
    var sec = document.getElementById(id);
    if (!sec || !sec.classList.contains("acc")) return;
    sec.classList.remove("closed");
    sync(sec);
    setTimeout(function () { sec.scrollIntoView({ behavior: "smooth", block: "start" }); }, 30);
  }

  // Category cards (href="#sec-xxx") open their section.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#sec-"]');
    if (a) openSection(a.getAttribute("href").slice(1));
  }, true);

  // Extra photos on part pages (the store shows one photo per part).
  var EXTRA = {
    "cab-harness-325d": ["parts/cab-harness-2.jpg"],
    "cab-harness-330d": ["parts/cab-harness-2.jpg"],
    "cab-harness-336d": ["parts/cab-harness-2.jpg"]
  };
  function extraPhotos() {
    var m = location.hash.match(/^#\/part\/([^?]+)/);
    var media = document.querySelector(".pp-media");
    if (!media) return;
    var id = m ? m[1] : "";
    if (media.dataset.extraFor === id) return;
    media.dataset.extraFor = id;
    media.querySelectorAll(".pp-extra").forEach(function (e) { e.remove(); });
    (EXTRA[id] || []).forEach(function (src) {
      var img = document.createElement("img");
      img.className = "pp-extra"; img.src = src; img.alt = ""; img.loading = "lazy";
      media.appendChild(img);
    });
  }

  function scan() {
    extraPhotos();
    document.querySelectorAll(".part-sec").forEach(setup);
  }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
