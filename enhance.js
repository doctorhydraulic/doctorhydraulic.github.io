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

  function scan() {
    document.querySelectorAll(".part-sec").forEach(setup);
  }
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
