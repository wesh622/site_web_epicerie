(function () {
  "use strict";

  // ---- Menu mobile ----
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Année dans le footer ----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Statut ouvert / fermé en direct ----
  // Ouvert tous les jours 11h-5h (12h-5h le vendredi), fermeture toujours après minuit.
  (function updateOpenStatus() {
    var statusEl = document.getElementById("open-status");
    var now = new Date();
    var day = now.getDay(); // 0 = dimanche ... 6 = samedi
    var nowMinutes = now.getHours() * 60 + now.getMinutes();
    var closeMinutes = 5 * 60;
    var openHour = day === 5 ? 12 : 11; // vendredi ouvre à midi
    var openMinutes = openHour * 60;

    var isOpen = nowMinutes < closeMinutes || nowMinutes >= openMinutes;

    if (statusEl) {
      statusEl.classList.remove("is-open", "is-closed");
      if (isOpen) {
        statusEl.classList.add("is-open");
        statusEl.innerHTML = '<span class="dot"></span> Ouvert · ferme à 05h00';
      } else {
        statusEl.classList.add("is-closed");
        statusEl.innerHTML =
          '<span class="dot"></span> Fermé · ouvre à ' + (openHour === 12 ? "12h00" : "11h00");
      }
    }

    var todayRow = document.querySelector('.hours-table tr[data-day="' + day + '"]');
    if (todayRow) todayRow.classList.add("today");
  })();

  // ---- Galerie photo (lightbox) ----
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
  }

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var full = item.getAttribute("data-full");
      var img = item.querySelector("img");
      openLightbox(full, img ? img.alt : "");
    });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  // ---- Animation au scroll ----
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
