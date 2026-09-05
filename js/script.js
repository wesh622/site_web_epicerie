(function () {
  "use strict";

  // ---- Config : à personnaliser par l'établissement ----
  var WHATSAPP_NUMBER = "33600000000"; // TODO: remplacer par le vrai numéro (format international, sans + ni espaces)
  var WHATSAPP_MESSAGE = "Bonjour, je souhaiterais passer une commande sur Mon Épicerie Nancy.";

  var whatsappUrl =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);

  ["hero-whatsapp", "contact-whatsapp", "floating-whatsapp"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.setAttribute("href", whatsappUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  });

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
