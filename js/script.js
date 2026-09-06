(function () {
  "use strict";

  /* ---- Menu mobile ---- */
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
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }

  /* ---- Année dans le footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Ouvert / fermé en direct -------------------------------------------
     Horaires relevés sur la fiche Google et les annuaires professionnels :
     lundi→vendredi 7h30–19h15, samedi 8h00–19h15, dimanche 9h00–12h15.
     Index = jour JS (0 = dimanche).                                          */
  var SCHEDULE = [
    { open: 9 * 60,          close: 12 * 60 + 15 },  // dimanche
    { open: 7 * 60 + 30,     close: 19 * 60 + 15 },  // lundi
    { open: 7 * 60 + 30,     close: 19 * 60 + 15 },  // mardi
    { open: 7 * 60 + 30,     close: 19 * 60 + 15 },  // mercredi
    { open: 7 * 60 + 30,     close: 19 * 60 + 15 },  // jeudi
    { open: 7 * 60 + 30,     close: 19 * 60 + 15 },  // vendredi
    { open: 8 * 60,          close: 19 * 60 + 15 }   // samedi
  ];
  var DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  // Heure locale du commerce (Europe/Paris), quel que soit le fuseau du visiteur.
  function nancyNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Paris",
        weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var day = days[map.weekday];
      var hour = parseInt(map.hour, 10) % 24;
      if (day === undefined || isNaN(hour)) throw new Error("format inattendu");
      return { day: day, minutes: hour * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function fmt(minutes) {
    var h = Math.floor(minutes / 60);
    var m = minutes % 60;
    return h + "h" + (m < 10 ? "0" + m : m);
  }

  function nextOpening(day, minutes) {
    // Aujourd'hui, plus tard dans la journée ?
    if (SCHEDULE[day] && minutes < SCHEDULE[day].open) {
      return { label: "aujourd'hui", at: SCHEDULE[day].open };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (day + i) % 7;
      if (SCHEDULE[d]) {
        return { label: i === 1 ? "demain" : DAY_NAMES[d], at: SCHEDULE[d].open };
      }
    }
    return null;
  }

  function refreshStatus() {
    var now = nancyNow();
    var today = SCHEDULE[now.day];
    var isOpen = !!today && now.minutes >= today.open && now.minutes < today.close;

    var shortText, title, detail;

    if (isOpen) {
      shortText = "Ouvert · ferme à " + fmt(today.close);
      title = "Ouvert maintenant";
      detail = "Fermeture à " + fmt(today.close) + ".";
      if (today.close - now.minutes <= 45) {
        detail = "Ferme bientôt : à " + fmt(today.close) + ".";
      }
    } else {
      var next = nextOpening(now.day, now.minutes);
      shortText = next ? "Fermé · ouvre " + next.label + " à " + fmt(next.at) : "Fermé";
      title = "Fermé actuellement";
      detail = next ? "Réouverture " + next.label + " à " + fmt(next.at) + "." : "";
    }

    var pill = document.getElementById("status-pill");
    var pillText = document.getElementById("status-text");
    if (pill && pillText) {
      pill.setAttribute("data-status", isOpen ? "open" : "closed");
      pillText.textContent = shortText;
    }

    var block = document.getElementById("hours-status-block");
    var blockTitle = document.getElementById("hours-status-title");
    var blockDetail = document.getElementById("hours-status-detail");
    if (block && blockTitle && blockDetail) {
      block.setAttribute("data-status", isOpen ? "open" : "closed");
      blockTitle.textContent = title;
      blockDetail.textContent = detail;
    }

    // Surlignage de la ligne du jour dans le tableau
    document.querySelectorAll(".hours-table tr[data-day]").forEach(function (row) {
      row.classList.toggle("is-today", Number(row.getAttribute("data-day")) === now.day);
    });
  }

  refreshStatus();
  setInterval(refreshStatus, 60000);

  /* ---- Galerie : uniquement de vraies photos (voir js/photos.js) ---- */
  var photos = window.TOTEM_PHOTOS || [];
  var gallery = document.getElementById("galerie");
  var grid = document.getElementById("gallery-grid");

  if (gallery && grid && photos.length) {
    photos.forEach(function (photo) {
      var figure = document.createElement("figure");
      figure.className = "reveal";

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "Photo de la boutique Totem à Nancy";
      img.loading = "lazy";
      figure.appendChild(img);

      if (photo.caption) {
        var caption = document.createElement("figcaption");
        caption.textContent = photo.caption;
        figure.appendChild(caption);
      }
      grid.appendChild(figure);
    });
    gallery.hidden = false;
  }

  /* ---- Animation au scroll ---- */
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
