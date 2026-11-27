// Mobile accordion for the part sections (added 27 Nov 2026).
// On phones each category list starts closed; tap the title to open it.
(function () {
  var MOBILE = window.matchMedia("(max-width: 859px)");

  function label(n) {
    if (document.documentElement.lang === "en") return n + (n === 1 ? " part" : " parts");
    if (n === 1) return "قطعة وحدة";
    if (n === 2) return "قطعتين";
    if (n >= 3 && n <= 10) return n + " قطع";
    return n + " قطعة";
  }
  function isEn() { return document.documentElement.lang === "en"; }

  // Experience item in the trust strip (added 27 Nov 2026).
  function trustExp() {
    var w = document.querySelector(".trust .wrap");
    if (!w) return;
    var key = isEn() ? "en" : "ar";
    var old = w.querySelector(".t-exp");
    if (old && old.dataset.lang === key) return;
    if (old) old.remove();
    var d = document.createElement("div");
    d.className = "t-exp"; d.dataset.lang = key;
    d.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"></circle><path d="m8.5 14.2-1.5 7.3 5-2.8 5 2.8-1.5-7.3"></path></svg>' +
      (key === "en" ? "<span><b>10+ years experience</b><small>In heavy-equipment parts</small></span>"
                    : "<span><b>خبرة أكثر من ١٠ سنين</b><small>بقطع المعدات الثقيلة</small></span>");
    w.insertBefore(d, w.firstChild);
  }

  // Fuller footer: WhatsApp number + map (added 27 Nov 2026).
  function footer() {
    var f = document.querySelector("footer .foot");
    if (!f) return;
    var key = isEn() ? "en" : "ar";
    var old = f.querySelector(".foot-extra");
    if (old && old.dataset.lang === key) return;
    if (old) old.remove();
    var s = document.createElement("span");
    s.className = "foot-extra"; s.dataset.lang = key;
    s.innerHTML = '<a href="https://wa.me/96565888222" target="_blank" rel="noopener" dir="ltr">WhatsApp +965 6588 8222</a> · ' +
      '<a href="https://maps.app.goo.gl/Z3EMKijjHS32cFyWA" target="_blank" rel="noopener">' + (key === "en" ? "Shop location" : "موقع المحل") + "</a>";
    f.appendChild(s);
  }

  // On part pages hide the floating WhatsApp bar (the page has its own button).
  function partPage() {
    document.body.classList.toggle("on-part", !!document.querySelector(".pp-grid"));
  }

  function setup(sec) {
    if (sec.dataset.acc) {
      var c = sec.querySelector(".acc-count"), t = label(sec.querySelectorAll("a.item").length);
      if (c && c.textContent !== t) c.textContent = t;
      return;
    }
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
    "cab-harness-336d": ["parts/cab-harness-2.jpg"],
    "injector-harness-c9": ["parts/injector-harness-c9-2b.jpg", "parts/injector-harness-c9-3.jpg"],
    "loader-joystick-950h": ["parts/loader-joystick-2.jpg", "parts/loader-joystick-3.jpg", "parts/loader-joystick-4.jpg"]
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
    partPage(); trustExp(); footer();
    document.querySelectorAll(".part-sec").forEach(setup);
  }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
