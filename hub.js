/* =============================================================
   hub.js – gemeinsame Logik aller Hub-Seiten
   -------------------------------------------------------------
   Hier steht nur, was mehrere Seiten brauchen:

     Inhalte          alle Kategorien und ihre Einträge (KATEGORIEN)
     Leiste           Kategorie-Leiste mit Zählern (buildNav)
     Bausteine        Hub.card() für Karten, Hub.renderGrid()
     Suche            Feld, Filter, Trefferanzeige
     Player           Einbettung, Vollbild, Fallback, #play/…
     Einstellungen    localStorage, Darstellung, Zähler
     Panik            Esc und Knopf

   Was nur eine Seite betrifft, steht in ihrer eigenen Datei – bei den
   Kategorieseiten eine einzige Zeile:

     window.HUB_PAGE = { id: "games" };

   Raster, Suche, Player und Zähler baut hub.js daraus. Einen eigenen
   Aufbau hat nur aaa.js (zwei Rahmen nebeneinander, Rest breit).

   Ablauf beim Laden einer Seite – genau zwei Skripte:

     <seite>.js  setzt window.HUB_PAGE = { id: … }
     hub.js      baut Kopf, Leiste und Inhalt

   Freiwillig in window.HUB_PAGE:

     id        Kategorie der Seite, z. B. "games"
     root      CSS-Auswahl des Bereichs, in dem gesucht wird
     render    function (page) – eigener Aufbau statt Raster
     items     function (page) – Einträge, die der Player öffnen darf
     onFilter  function (aktiv) – Zusatz beim Filtern (nur aaa)
   ============================================================= */
(function () {
  "use strict";

  /* ---------- Einstellungen ---------- */

  var SETTINGS_KEY = "nexus-hub-settings-v1";

  var DEFAULTS = {
    panicUrl: "https://www.google.com/",
    panicKey: true,
    panicButton: true,
    panicNewTab: false,
    counters: true,
    logos: true,
    blink: true
  };

  function cloneDefaults() {
    var out = {};
    Object.keys(DEFAULTS).forEach(function (key) { out[key] = DEFAULTS[key]; });
    return out;
  }

  /* Nur bekannte Schlüssel und nur passende Typen übernehmen – ein
     manipulierter Speicher kann so nichts kaputt machen. */
  function loadSettings() {
    var out = cloneDefaults();
    try {
      var raw = window.localStorage.getItem(SETTINGS_KEY);
      if (!raw) { return out; }
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") { return out; }
      Object.keys(DEFAULTS).forEach(function (key) {
        if (typeof saved[key] === typeof DEFAULTS[key]) { out[key] = saved[key]; }
      });
      if (typeof out.panicUrl !== "string" || !out.panicUrl.trim()) {
        out.panicUrl = DEFAULTS.panicUrl;
      }
    } catch (error) {
      /* Speicher gesperrt (Privatmodus, Dateizugriff): Standardwerte */
    }
    return out;
  }

  function persist() {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      /* ohne Speicher gelten die Einstellungen nur für diese Seite */
    }
  }

  function safeUrl(value) {
    try {
      var url = new URL(String(value), window.location.href);
      if (url.protocol === "http:" || url.protocol === "https:") { return url.href; }
    } catch (error) { /* ungültig -> Standard */ }
    return DEFAULTS.panicUrl;
  }

  var settings = loadSettings();
  settings.panicUrl = safeUrl(settings.panicUrl);

  /* ---------- Kleine Bausteine ---------- */

  function byId(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function capitalize(text) {
    var value = String(text);
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function plural(count) {
    return count === 1 ? "Eintrag" : "Einträge";
  }

  /* ===================================================================
     INHALTE – nur hier wird eingetragen, was auf den Seiten steht
     ===================================================================

     Eine Kategorie ist ein Block: id, label (Name in der Leiste) und
     file (ihre Seite). Darunter eintraege – ein Objekt pro Eintrag:

         { name: "Slope", url: "https://www.y8.com/games/slope",
           tag: "Action", text: "Ein Satz zur Beschreibung.",
           embed: "https://www.y8.com/embed/slope" }

     Pflicht sind name und url. tag ist die Kennzeichnung auf der Karte,
     text die Beschreibung darunter. embed braucht man nur, wenn der
     Rahmen eine andere Adresse laden soll als der Direktlink.
     Die Sprungmarke (#play/…) und die Kartenfarbe bildet hub.js aus
     name und klasse – beides muss hier nicht stehen.

     Eintrag löschen  = Objekt samt Komma entfernen
     Eintrag ändern   = Werte im Objekt ändern
     Eintrag ergänzen = Objekt kopieren und anpassen
     Die Reihenfolge hier ist die Reihenfolge auf der Seite.

     Neue Kategorie: Block kopieren, id/label/file anpassen, eine
     HTML-Seite anlegen und eine JS-Datei mit einer Zeile:

         window.HUB_PAGE = { id: "..." };

     alle: true            zeigt auf der Seite die Einträge aller Kategorien
     nichtAufStart: true   lässt die Kategorie auf der Startseite weg
     klasse: "proxy"       gibt den Karten eine eigene Farbe

     Die Texte einer Seite (Abschnittstitel, Einleitung, Hinweis) stehen
     in ihrer HTML-Datei – dort, wo sie erscheinen.
  */

  var KATEGORIEN = [
    {
      id: "start",
      label: "Start",
      file: "secret.html",
      alle: true,
      eintraege: []
    },
    {
      id: "games",
      label: "Spiele",
      file: "games.html",
      eintraege: [
        { name: "Retro Bowl", url: "https://poki.com/de/g/retro-bowl", tag: "Sport", text: "American-Football-Manager im 8-Bit-Gewand: Kader zusammenstellen, Spielzüge ansagen und die Saison gewinnen." },
        { name: "Slope", url: "https://www.y8.com/games/slope", tag: "Action", text: "Endlos-Runner auf einer sich neigenden Bahn. Tempo steigt, Reaktionszeit entscheidet über den nächsten Versuch.", embed: "https://www.y8.com/embed/slope" },
        { name: "1v1.LOL", url: "https://1v1.lol/", tag: "Action", text: "Bau-Shooter-Duell im Browser: Gebäude setzen, Deckung nutzen, Gegner im direkten Duell ausschalten." },
        { name: "Drift Hunters", url: "https://drifthunters.io/", tag: "Sport", text: "Drift-Simulation mit Tuning, Streckenwahl und Punktesystem. Fahrzeug aufbauen, Kurven halten, Combos verlängern." },
        { name: "Tunnel Rush", url: "https://www.y8.com/games/tunnel_rush", tag: "Action", text: "Schneller Bahnflug durch einen rotierenden Tunnel. Hindernissen ausweichen, Geschwindigkeit steigern, Highscore halten.", embed: "https://www.y8.com/embed/tunnel_rush" },
        { name: "Paper.io 2", url: "https://paper-io.com/", tag: ".io", text: "Flächen erobern, Gebiet schließen und Gegner abschneiden. Klassisches Gebietsrennen im Mehrspielermodus." },
        { name: "Shell Shockers", url: "https://shellshock.io/", tag: ".io", text: "Mehrspieler-Shooter, in dem alle Spieler Eier sind. Drei Waffenklassen, kurze Runden, direkter Einstieg." },
        { name: "2048", url: "https://play2048.co/", tag: "Denksport", text: "Zahlen zusammenlegen, bis das Feld voll ist. Ruhiges Strategiepuzzle für freie Minuten." },
        { name: "Hextris", url: "https://hextris.io/", tag: "Denksport", text: "Sechseckige Variante von Tetris: Blöcke rotieren und Reihen gleichfarbig abbauen, ohne den Stapel anwachsen zu lassen." },
        { name: "Classic Pac-Man", url: "https://www.google.com/logos/2010/pacman10-i.html", tag: "Retro", text: "Der Arcade-Klassiker als Browser-Emulation. Punkte fressen, Geister umgehen, alle Punkte der Ebene räumen." },
        { name: "Tetris (Browser)", url: "https://tetris.com/play-tetris", tag: "Retro", text: "Stein-Klassiker mit Tastatursteuerung, Vorschau des nächsten Steins und steigendem Tempo." },
        { name: "Schach", url: "https://lichess.org/", tag: "Denksport", text: "Schach gegen den Computer in mehreren Schwierigkeitsstufen, wahlweise mit Analysebrett und Partiehistorie." },
      ]
    },
    {
      id: "proxies",
      label: "Proxies",
      file: "proxies.html",
      klasse: "proxy",
      eintraege: [
        { name: "Ultraviolet", url: "https://github.com/titaniumnetwork-dev/Ultraviolet", tag: "Service Worker", text: "Web-Proxy auf Basis eines Service Workers. Benötigt eine eigene gehostete Instanz; das Repository enthält Aufbau und Anleitung." },
        { name: "Rammerhead", url: "https://github.com/binary-person/rammerhead", tag: "Server-Proxy", text: "Proxy mit eigener Node.js-Instanz und isolierten Sitzungen. Läuft selbst gehostet, nicht als öffentliche Daueradresse." },
        { name: "Holy Unblocker", url: "https://github.com/titaniumnetwork-dev/Holy-Unblocker", tag: "Portal", text: "Portal-Projekt mit mehreren Proxy-Backends und Nutzeroberfläche. Für den Betrieb wird ein eigener Server benötigt." },
        { name: "Corrosion", url: "https://github.com/titaniumnetwork-dev/Corrosion", tag: "Portal", text: "Schlankes Portal mit Ultraviolet-Backend und klarer Konfiguration für den Eigenbetrieb." },
        { name: "Locally", url: "https://github.com/titaniumnetwork-dev/locally", tag: "Dienst", text: "Einfache Oberfläche für den schnellen Zugriff auf Webseiten; Konfiguration und Betrieb erfolgen selbst." },
        { name: "Titanium Network", url: "https://titaniumnetwork.org/", tag: "Projektübersicht", text: "Sammelseite der oben genannten Open-Source-Projekte inklusive Dokumentation und Wechsel zwischen den Varianten." },
      ]
    },
    {
      id: "apps",
      label: "Apps",
      file: "apps.html",
      eintraege: [
        { name: "Photopea", url: "https://www.photopea.com/", tag: "Bildbearbeitung", text: "Vollwertiger Bildeditor im Browser: Ebenen, Masken, Auswahlwerkzeuge, PSD- und XCF-Unterstützung. Öffnet Dateien direkt aus dem Dateidialog." },
        { name: "Excalidraw", url: "https://excalidraw.com/", tag: "Skizze", text: "Whiteboard mit handgezeichnetem Strich. Formen, Pfeile und Text lassen sich frei anordnen; die Szene wird als Link oder Datei geteilt." },
        { name: "draw.io", url: "https://app.diagrams.net/", tag: "Diagramm", text: "Diagramme, Flusspläne und Netzwerkbilder mit großer Formbibliothek. Export als PNG, SVG oder PDF, Speichern lokal oder in der Cloud." },
        { name: "Kleki", url: "https://kleki.com/", tag: "Zeichnen", text: "Schlanker Zeichenblock mit Pinseln, Ebenen und Druckerkennung. Schnell startklar für Skizzen und Farbtests ohne Anmeldung." },
        { name: "Squoosh", url: "https://squoosh.app/", tag: "Bildoptimierung", text: "Bilder vor dem Vergleich komprimieren: Formate, Qualität und Größe werden nebeneinander angezeigt, inklusive Größenvergleich vor und nach." },
        { name: "Dillinger", url: "https://dillinger.io/", tag: "Text", text: "Markdown-Editor mit Live-Vorschau und Export nach HTML oder PDF. Praktisch für Notizen, READMEs und kurze Dokumente." },
      ]
    },
    {
      id: "tools",
      label: "Tools",
      file: "tools.html",
      eintraege: [
        { name: "regex101", url: "https://regex101.com/", tag: "Regex", text: "Reguläre Ausdrücke testen und Zeichen für Zeichen erklären lassen. Mehrere Engine-Varianten, Trefferliste und Debugger." },
        { name: "CyberChef", url: "https://gchq.github.io/CyberChef/", tag: "Encoding", text: "Datenwerkstatt mit über hundert Operationen: Base64, Hex, Hashes, Kompression, Entschlüsselung. Operationen lassen sich verketten." },
        { name: "IT-Tools", url: "https://it-tools.tech/", tag: "Sammlung", text: "Sammlung von Entwickler-Hilfen: UUID, Hash, JWT, Farben, Cron, Zeitstempel und mehr – eine Oberfläche, viele Werkzeuge." },
        { name: "JSON Formatter", url: "https://jsonformatter.org/", tag: "JSON", text: "JSON einfügen, einrücken und validieren. Zeigt Fehlerstellen und erlaubt den Wechsel zwischen Baum- und Textansicht." },
        { name: "crontab.guru", url: "https://crontab.guru/", tag: "Cron", text: "Cron-Ausdrücke im Klartext erklärt, inklusive der nächsten Ausführungszeiten. Schneller Check, ob ein Zeitplan wirklich das tut, was er soll." },
        { name: "DevDocs", url: "https://devdocs.io/", tag: "Dokumentation", text: "Dokumentation vieler Sprachen und Bibliotheken in einer Oberfläche, durchsuchbar und offlinefähig nach dem ersten Aufruf." },
      ]
    },
    {
      id: "aaa",
      label: "aaa",
      file: "aaa.html",
      nichtAufStart: true,
      eintraege: [
        { name: "Desmos", url: "https://www.desmos.com/calculator", tag: "rechner", text: "funktion plotten", embed: "https://www.desmos.com/calculator?embed" },
        { name: "OpenStreetMap", url: "https://www.openstreetmap.org/#map=13/52.5100/13.4000", tag: "karte", text: "ausschnitt berlin", embed: "https://www.openstreetmap.org/export/embed.html?bbox=13.3200%2C52.4700%2C13.4800%2C52.5500&layer=mapnik&marker=52.5100%2C13.4000" },
        { name: "Excalidraw", url: "https://excalidraw.com/", tag: "whiteboard", text: "breiter rahmen", embed: "https://excalidraw.com/" },
      ]
    },
  ];

  /* ---------- Aus den Zeilen werden Einträge ---------- */

  function slug(text) {
    return String(text)
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /* Sprungmarke und Kartenfarbe hängt hub.js an jeden Eintrag an,
     damit beides oben nicht doppelt gepflegt werden muss. */
  KATEGORIEN.forEach(function (kategorie) {
    kategorie.entries = kategorie.eintraege || [];
    kategorie.entries.forEach(function (item) {
      item.id = slug(item.name);
      item.klasse = kategorie.klasse || "";
    });
  });

  function data(id) {
    for (var i = 0; i < KATEGORIEN.length; i++) {
      if (KATEGORIEN[i].id === id) { return KATEGORIEN[i]; }
    }
    return null;
  }

  function countOf(id) {
    var kategorie = data(id);
    return kategorie ? kategorie.entries.length : 0;
  }

  /* ---------- Seite und ihre Daten ---------- */

  var PAGE = window.HUB_PAGE || {};
  var PAGE_ID = PAGE.id || document.body.getAttribute("data-hub") || "start";
  var page = data(PAGE_ID);

  /* ---------- Kopf und Statuszeile ---------- */

  var label = page && page.label ? page.label : "Hub";

  document.title = "Nexus · " + label;

  /* Abschnittstitel, Einleitung und Hinweis stehen in der HTML-Datei
     der Seite und bleiben dort – hub.js fasst sie nicht an. */

  /* Einstellungen-Knopf und Panik-Hinweis in die Statuszeile */
  (function decorateStatus() {
    var slot = document.querySelector(".secret-status .right");
    if (!slot) { return; }
    slot.innerHTML =
      '<button type="button" class="settings-btn" id="settings-open">' +
        "Einstellungen" +
      "</button>" +
      '<span id="panic-hint">Panik: ESC</span>';
  })();

  /* ---------- Navigationsleiste (Zähler für alle Kategorien) ---------- */

  function buildNav() {
    var nav = byId("hub-nav");
    if (!nav) { return; }

    nav.innerHTML = KATEGORIEN.map(function (cat) {
      var active = cat.id === PAGE_ID;
      var count = "";
      if (settings.counters && cat.id !== "start") {
        count = ' <span class="n">' + countOf(cat.id) + "</span>";
      }
      return (
        '<a class="hub-nav-btn' + (active ? " active" : "") + '"' +
          ' href="' + cat.file + '"' +
          (active ? ' aria-current="page"' : "") + ">" +
          escapeHtml(cat.label) + count +
        "</a>"
      );
    }).join("");
  }

  /* ---------- Karten und Raster ---------- */

  /* Logo: eigener Link aus der Datendatei, sonst das Favicon des Ziels.
     Die Adresse wird je Domain nur einmal gebaut und zwischengespeichert. */
  var faviconCache = {};

  function logoFor(item) {
    if (item.logo) { return item.logo; }
    var raw = item.url || item.embed || "";
    var match = /^https?:\/\/([^\/?#]+)/i.exec(raw);
    if (!match) { return ""; }
    var host = match[1].toLowerCase();
    if (!faviconCache[host]) {
      faviconCache[host] = "https://www.google.com/s2/favicons?sz=64&domain=" +
        encodeURIComponent(host);
    }
    return faviconCache[host];
  }

  /* Eine Karte. options.tag überschreibt die Kennzeichnung (Startseite
     zeigt dort die Kategorie), options.extraClass hängt eine Klasse an.
     Die Klasse der Kategorie (klasse: "proxy") kommt von selbst mit. */
  function card(item, options) {
    options = options || {};
    var tag = options.tag || item.tag || "Eintrag";
    var extraClass = options.extraClass || item.klasse || "";
    var logo = logoFor(item);
    var haystack = [item.name, tag, item.text].join(" ").toLowerCase();

    return (
      '<a class="secret-card' + (extraClass ? " " + extraClass : "") + '"' +
        ' href="#play/' + encodeURIComponent(item.id) + '"' +
        ' data-play="' + escapeHtml(item.id) + '"' +
        ' data-search="' + escapeHtml(haystack) + '">' +
        (logo
          ? '<img class="card-logo" src="' + escapeHtml(logo) + '" alt="" width="20" height="20"' +
            ' loading="lazy" decoding="async">'
          : "") +
        '<span class="tag">' + escapeHtml(tag) + "</span>" +
        "<h3>" + escapeHtml(item.name) + "</h3>" +
        "<p>" + escapeHtml(item.text || "") + "</p>" +
        '<span class="card-action">Öffnen <span>&rarr;</span></span>' +
      "</a>"
    );
  }

  /* Ein einziger Listener für alle Logos statt einem je Bild.
     Fehler-Ereignisse von Bildern blubbern nicht, daher Capture-Phase. */
  document.addEventListener("error", function (event) {
    var img = event.target;
    if (img && img.classList && img.classList.contains("card-logo")) {
      img.remove();
    }
  }, true);

  var sectionCountBefore = "";

  /* Zähler in der Abschnittsüberschrift und in der Statuszeile */
  function setCount(number) {
    var counter = byId("hub-count");
    if (counter) { counter.textContent = number + " " + plural(number); }
    if (byId("entry-count")) { byId("entry-count").textContent = number; }
    sectionCountBefore = counter ? counter.textContent : "";
  }

  /* Fertige Karten ins Raster setzen und Zähler nachziehen */
  function renderGrid(cards) {
    var grid = byId("hub-grid");
    if (!grid) { return; }
    var list = cards || [];
    grid.innerHTML = list.length
      ? list.join("")
      : '<div class="secret-note">Noch keine Einträge.</div>';
    setCount(list.length);
  }

  /* ---------- Was die page-*.js benutzen dürfen ---------- */

  window.Hub = {
    kategorien: KATEGORIEN,
    data: data,
    byId: byId,
    escape: escapeHtml,
    capitalize: capitalize,
    plural: plural,
    card: card,
    renderGrid: renderGrid,
    setCount: setCount
  };

  /* ---------- Die Seite selbst rendern ---------- */

  /* Karten der Seite; mit alle: true die aller anderen Kategorien */
  function cardsOf(kategorie) {
    var karten = [];
    if (kategorie.alle) {
      KATEGORIEN.forEach(function (andere) {
        if (andere === kategorie || andere.nichtAufStart) { return; }
        andere.entries.forEach(function (item) {
          karten.push(card(item, { tag: andere.label }));
        });
      });
    } else {
      kategorie.entries.forEach(function (item) { karten.push(card(item)); });
    }
    return karten;
  }

  if (typeof PAGE.render === "function") {
    PAGE.render(page);
  } else if (page) {
    renderGrid(cardsOf(page));
  }

  /* ---------- Suche ---------- */

  var searchInput = null;
  var searchCount = null;
  var searchClear = null;
  var searchEmpty = null;
  var searchTargets = [];
  var searchTimer = null;

  function markFiltered(el, hide) {
    el.classList.toggle("is-filtered", hide);
    if (hide) {
      el.setAttribute("aria-hidden", "true");
    } else {
      el.removeAttribute("aria-hidden");
    }
  }

  function applySearch() {
    if (!searchInput) { return; }

    var raw = searchInput.value.trim();
    var query = raw.toLowerCase();
    var terms = query ? query.split(/\s+/) : [];
    var shown = 0;

    for (var i = 0; i < searchTargets.length; i++) {
      var target = searchTargets[i];
      var match = true;
      for (var t = 0; t < terms.length; t++) {
        if (target.hay.indexOf(terms[t]) === -1) { match = false; break; }
      }
      markFiltered(target.el, !match);
      if (match) { shown++; }
    }

    if (typeof PAGE.onFilter === "function") {
      PAGE.onFilter(terms.length > 0);
    }

    searchClear.hidden = !raw;
    searchCount.textContent = terms.length ? shown + " / " + searchTargets.length : "";

    searchEmpty.hidden = !(terms.length && shown === 0);
    if (!searchEmpty.hidden) {
      searchEmpty.textContent = 'Kein Treffer für „' + raw + '“';
    }

    var count = byId("hub-count");
    if (count) {
      count.textContent = terms.length
        ? shown + " von " + searchTargets.length
        : sectionCountBefore;
    }
  }

  function scheduleSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applySearch, 80);
  }

  function clearSearch() {
    if (!searchInput) { return; }
    searchInput.value = "";
    applySearch();
    searchInput.focus();
  }

  function initSearch(root) {
    if (!root || !root.parentNode) { return; }

    var wrap = document.createElement("div");
    wrap.className = "hub-search";
    wrap.innerHTML =
      '<input type="search" class="hub-search-input" id="hub-search-input"' +
      ' placeholder="Nach Name, Kategorie oder Beschreibung suchen" autocomplete="off"' +
      ' spellcheck="false" aria-label="Einträge durchsuchen">' +
      '<span class="hub-search-count" id="hub-search-count" aria-live="polite"></span>' +
      '<button type="button" class="hub-search-clear" id="hub-search-clear"' +
      ' hidden aria-label="Suche leeren">&times;</button>';
    root.parentNode.insertBefore(wrap, root);

    var empty = document.createElement("p");
    empty.className = "hub-search-empty";
    empty.hidden = true;
    root.parentNode.insertBefore(empty, root.nextSibling);

    searchInput = byId("hub-search-input");
    searchCount = byId("hub-search-count");
    searchClear = byId("hub-search-clear");
    searchEmpty = empty;

    Array.prototype.forEach.call(
      root.querySelectorAll(".secret-card, .aaa-pane"),
      function (el) {
        searchTargets.push({
          el: el,
          hay: (el.getAttribute("data-search") || "").toLowerCase()
        });
      }
    );

    searchInput.addEventListener("input", scheduleSearch);
    searchClear.addEventListener("click", clearSearch);

    /* Esc im Suchfeld leert die Suche, ohne Panik auszulösen */
    searchInput.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" && event.key !== "Esc") { return; }
      event.preventDefault();
      event.stopPropagation();
      if (searchInput.value) {
        clearSearch();
      } else {
        searchInput.blur();
      }
    });

    applySearch();
  }

  /* ---------- Player (Einbettung mit Fallback, Cookies erlaubt) ---------- */

  document.body.insertAdjacentHTML("beforeend", [
    '<div class="player" id="player" hidden>',
    '  <div class="player-bar">',
    '    <span class="player-tag" id="player-tag">Eintrag</span>',
    '    <h2 class="player-title" id="player-title">&mdash;</h2>',
    '    <span class="player-status" id="player-status">Bereit</span>',
    '    <div class="player-actions">',
    '      <button type="button" class="player-btn" id="player-full" aria-pressed="false"',
    '              title="Vollbild umschalten (Esc beendet es)">Vollbild</button>',
    '      <button type="button" class="player-btn" id="player-reload">Neu laden</button>',
    '      <a class="player-btn" id="player-external" href="#" target="_blank" rel="noopener noreferrer">Extern &nearr;</a>',
    '      <button type="button" class="player-btn panic" id="player-panic"',
    '              title="Sofort zum Panik-Ziel wechseln">Panik<kbd>ESC</kbd></button>',
    '      <button type="button" class="player-btn danger" id="player-close">Schlie&szlig;en &times;</button>',
    '    </div>',
    '  </div>',
    '  <div class="player-stage">',
    /* kein sandbox: sonst dürften Spiele weder Cookies noch Spielstand nutzen */
    '    <iframe id="player-frame" title="Eingebettetes Ziel"',
    '            referrerpolicy="strict-origin-when-cross-origin"',
    '            allow="fullscreen; autoplay; pointer-lock; gamepad; screen-wake-lock; clipboard-read; clipboard-write; accelerometer; gyroscope; magnetometer; storage-access"',
    '            allowfullscreen></iframe>',
    '    <div class="player-fallback" id="player-fallback" hidden>',
    '      <p class="player-fallback-code">Einbettung nicht erlaubt</p>',
    '      <p>',
    '        Dieser Anbieter erlaubt keine Einbettung in fremde Seiten',
    '        (<code>X-Frame-Options</code> oder <code>frame-ancestors</code>).',
    '        Der Rahmen bleibt deshalb leer.',
    '      </p>',
    '      <p class="player-fallback-actions">',
    '        <a class="player-btn big" id="fallback-external" href="#" target="_blank" rel="noopener noreferrer">In neuem Tab &ouml;ffnen &nearr;</a>',
    '        <button type="button" class="player-btn big" id="fallback-retry">Trotzdem im Rahmen zeigen</button>',
    '      </p>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n"));

  var playerEl = byId("player");
  var frameEl = byId("player-frame");
  var titleEl = byId("player-title");
  var tagEl = byId("player-tag");
  var statusEl = byId("player-status");
  var fallbackEl = byId("player-fallback");
  var externalEl = byId("player-external");
  var fallbackExternalEl = byId("fallback-external");
  var fullBtn = byId("player-full");
  var barPanicBtn = byId("player-panic");

  /* Ein verweigerter Frame wird vom Browser mit einer Fehlerseite oder
     about:blank gefüllt: das load-Ereignis kommt dann praktisch ohne
     Netzwerklaufzeit. Beides lässt sich im geladenen Dokument erkennen. */
  var FAST_LOAD_MS = 150;
  var HANG_MS = 15000;

  var current = null;
  var loadStart = 0;
  var watchdog = null;

  /* Einträge, die diese Seite öffnen darf: die Seitendatei darf es
     festlegen, sonst gelten die Einträge der Seite (alle: true = alle). */
  function itemsOfPage() {
    if (typeof PAGE.items === "function") { return PAGE.items(page); }
    if (!page) { return []; }
    if (page.alle) {
      var alle = [];
      KATEGORIEN.forEach(function (andere) {
        if (andere !== page && !andere.nichtAufStart) {
          alle = alle.concat(andere.entries);
        }
      });
      return alle;
    }
    return page.entries.slice();
  }

  function findItem(id) {
    var pool = itemsOfPage();
    for (var i = 0; i < pool.length; i++) {
      if (pool[i].id === id) { return pool[i]; }
    }
    return null;
  }

  function targetUrl(item) {
    return item.embed || item.url;
  }

  function setStatus(text, warn) {
    statusEl.textContent = text;
    statusEl.className = "player-status" + (warn ? " warn" : "");
  }

  function showFallback() { fallbackEl.hidden = false; }
  function hideFallback() { fallbackEl.hidden = true; }

  function armWatchdog() {
    clearTimeout(watchdog);
    watchdog = setTimeout(function () {
      if (!current) { return; }
      setStatus("Keine Antwort", true);
      showFallback();
    }, HANG_MS);
  }

  function frameBlocked(elapsed) {
    var doc = null;
    try { doc = frameEl.contentDocument; } catch (error) { doc = null; }

    /* Kein Zugriff auf das Dokument: echter Fremdinhalt, also erlaubt.
       Nur ein auffällig frühes load-Ereignis deutet auf eine Blockade hin. */
    if (doc === null) { return elapsed < FAST_LOAD_MS; }

    /* Zugriff möglich: dann steckt nur eine Fehlerseite oder about:blank darin. */
    if (!doc.body) { return true; }
    return doc.body.childElementCount === 0;
  }

  function onFrameLoad() {
    if (!current) { return; }
    clearTimeout(watchdog);
    if (frameBlocked(Date.now() - loadStart)) {
      setStatus("Einbettung blockiert", true);
      showFallback();
    } else {
      setStatus("Bereit", false);
      hideFallback();
    }
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function requestFullscreen(el) {
    var fn = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fn) { return null; }
    try { return fn.call(el); } catch (error) { return null; }
  }

  function exitFullscreen() {
    var fn = document.exitFullscreen || document.webkitExitFullscreen;
    if (fn) { fn.call(document); }
  }

  function syncFullscreenButton() {
    var on = !!fullscreenElement();
    fullBtn.textContent = on ? "Vollbild beenden" : "Vollbild";
    fullBtn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function toggleFullscreen() {
    if (playerEl.hidden) { return; }
    if (fullscreenElement()) { exitFullscreen(); return; }
    /* Die ganze Überlagerung geht ins Vollbild, nicht nur der Rahmen:
       so bleiben Leiste, Schließen-, Vollbild- und Panic-Knopf sichtbar. */
    var result = requestFullscreen(playerEl) || requestFullscreen(frameEl);
    if (!result) { setStatus("Vollbild nicht verfügbar", true); return; }
    if (typeof result.catch === "function") {
      result.catch(function () {
        if (fullscreenElement()) { return; }
        var alt = requestFullscreen(frameEl);
        if (alt && typeof alt.catch === "function") { alt.catch(function () {}); }
      });
    }
  }

  document.addEventListener("fullscreenchange", syncFullscreenButton);
  document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
  fullBtn.addEventListener("click", toggleFullscreen);

  function openPlayer(item) {
    current = item;
    titleEl.textContent = item.name;
    tagEl.textContent = capitalize(item.tag || "Eintrag");
    externalEl.href = item.url;
    fallbackExternalEl.href = item.url;

    playerEl.hidden = false;
    document.body.classList.add("player-open");
    hideFallback();

    var url = targetUrl(item);
    if (frameEl.getAttribute("src") === url) {
      setStatus("Bereit", false);
      return;
    }

    setStatus("Verbinde …", false);
    loadStart = Date.now();
    frameEl.onload = onFrameLoad;
    frameEl.src = url;
    armWatchdog();
  }

  function reloadPlayer() {
    if (!current) { return; }
    hideFallback();
    setStatus("Verbinde …", false);
    loadStart = Date.now();
    frameEl.onload = onFrameLoad;
    frameEl.src = targetUrl(current);
    armWatchdog();
  }

  function closePlayer() {
    clearTimeout(watchdog);
    current = null;
    if (fullscreenElement()) { exitFullscreen(); }
    playerEl.hidden = true;
    document.body.classList.remove("player-open");
    frameEl.onload = null;
    /* src entfernen beendet Netzwerk, Audio und Timer des Ziels */
    frameEl.removeAttribute("src");
    hideFallback();
  }

  function requestClose() {
    /* Eintrag ersetzen, damit der Zurück-Button nicht erneut öffnet */
    history.replaceState(null, "", window.location.pathname + window.location.search);
    closePlayer();
  }

  function route() {
    var hash = window.location.hash || "";
    if (hash.indexOf("#play/") === 0) {
      var item = findItem(decodeURIComponent(hash.slice(6)));
      if (item) { openPlayer(item); return; }
    }
    if (current) { closePlayer(); }
  }

  byId("player-close").addEventListener("click", requestClose);
  byId("player-reload").addEventListener("click", reloadPlayer);
  byId("fallback-retry").addEventListener("click", function () {
    hideFallback();
    setStatus("Bereit", false);
  });

  window.addEventListener("hashchange", route);

  /* ---------- Einstellungen (Aussehen, Zähler, Panic) ---------- */

  document.body.insertAdjacentHTML("beforeend", [
    '<div class="settings" id="settings" hidden>',
    '  <div class="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">',
    '    <div class="settings-head">',
    '      <h2 id="settings-title">Einstellungen</h2>',
    '      <button type="button" class="player-btn" id="settings-close">Schlie&szlig;en &times;</button>',
    '    </div>',
    '    <div class="settings-body">',
    '      <fieldset class="settings-group">',
    '        <legend>Panik</legend>',
    '        <label class="settings-row">',
    '          <span class="settings-label">Ziel-URL</span>',
    '          <input type="url" id="set-panic-url" spellcheck="false" autocomplete="off"',
    '                 placeholder="https://www.google.com/">',
    '        </label>',
    '        <label class="settings-row check">',
    '          <input type="checkbox" id="set-panic-key">',
    '          <span>Esc l&ouml;st Panik aus</span>',
    '        </label>',
    '        <label class="settings-row check">',
    '          <input type="checkbox" id="set-panic-button">',
    '          <span>Panik-Knopf anzeigen</span>',
    '        </label>',
    '        <label class="settings-row check">',
    '          <input type="checkbox" id="set-panic-newtab">',
    '          <span>In neuem Tab &ouml;ffnen</span>',
    '        </label>',
    '      </fieldset>',
    '      <fieldset class="settings-group">',
    '        <legend>Darstellung</legend>',
    '        <label class="settings-row check">',
    '          <input type="checkbox" id="set-counters">',
    '          <span>Z&auml;hler in der Kategorie-Leiste</span>',
    '        </label>',
    '        <label class="settings-row check">',
    '          <input type="checkbox" id="set-logos">',
    '          <span>Logos auf den Karten</span>',
    '        </label>',
    '        <label class="settings-row check">',
    '          <input type="checkbox" id="set-blink">',
    '          <span>Blinken und Pulsieren</span>',
    '        </label>',
    '      </fieldset>',
    '      <p class="settings-note">',
    '        Einstellungen liegen nur in diesem Browser (localStorage) und gelten f&uuml;r alle Seiten des Hubs.',
    '        Einbettungen laufen ohne <code>sandbox</code> und mit <code>storage-access</code>, damit Spiele Cookies',
    '        und Spielst&auml;nde nutzen k&ouml;nnen &ndash; blockiert der Browser Drittanbieter-Cookies, hilft nur eine',
    '        Ausnahme f&uuml;r die jeweilige Seite.',
    '      </p>',
    '      <div class="settings-actions">',
    '        <button type="button" class="player-btn" id="set-reset">Zur&uuml;cksetzen</button>',
    '        <span class="settings-saved" id="set-saved">Automatisch gespeichert</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join("\n"));

  var settingsEl = byId("settings");
  var panicBtn = byId("panic");
  var panicHint = byId("panic-hint");
  var savedEl = byId("set-saved");
  var savedTimer = null;

  function flashSaved() {
    savedEl.textContent = "Gespeichert";
    savedEl.classList.add("show");
    clearTimeout(savedTimer);
    savedTimer = setTimeout(function () {
      savedEl.textContent = "Automatisch gespeichert";
      savedEl.classList.remove("show");
    }, 1600);
  }

  function applySettings() {
    document.body.classList.toggle("no-blink", !settings.blink);
    document.body.classList.toggle("no-logos", !settings.logos);

    if (panicBtn) {
      panicBtn.hidden = !settings.panicButton;
      var kbd = panicBtn.querySelector("kbd");
      if (kbd) { kbd.hidden = !settings.panicKey; }
    }

    /* Der Panic-Knopf in der Player-Leiste folgt denselben Einstellungen. */
    if (barPanicBtn) {
      barPanicBtn.hidden = !settings.panicButton;
      var barKbd = barPanicBtn.querySelector("kbd");
      if (barKbd) { barKbd.hidden = !settings.panicKey; }
    }

    if (panicHint) {
      if (!settings.panicButton && !settings.panicKey) {
        panicHint.textContent = "Panik: aus";
      } else if (settings.panicKey) {
        panicHint.textContent = "Panik: ESC";
      } else {
        panicHint.textContent = "Panik: Knopf";
      }
    }

    buildNav();
  }

  function syncSettingsInputs() {
    byId("set-panic-url").value = settings.panicUrl;
    byId("set-panic-key").checked = settings.panicKey;
    byId("set-panic-button").checked = settings.panicButton;
    byId("set-panic-newtab").checked = settings.panicNewTab;
    byId("set-counters").checked = settings.counters;
    byId("set-logos").checked = settings.logos;
    byId("set-blink").checked = settings.blink;
  }

  function update(key, value) {
    settings[key] = value;
    persist();
    applySettings();
    flashSaved();
  }

  function openSettings() {
    settingsEl.hidden = false;
    document.body.classList.add("settings-open");
    syncSettingsInputs();
    byId("set-panic-url").focus();
  }

  function closeSettings() {
    settingsEl.hidden = true;
    document.body.classList.remove("settings-open");
  }

  byId("settings-open").addEventListener("click", openSettings);
  byId("settings-close").addEventListener("click", closeSettings);

  settingsEl.addEventListener("click", function (event) {
    if (event.target === settingsEl) { closeSettings(); }
  });

  byId("set-panic-url").addEventListener("change", function () {
    var value = safeUrl(this.value);
    this.value = value;
    update("panicUrl", value);
  });

  [
    ["set-panic-key", "panicKey"],
    ["set-panic-button", "panicButton"],
    ["set-panic-newtab", "panicNewTab"],
    ["set-counters", "counters"],
    ["set-logos", "logos"],
    ["set-blink", "blink"]
  ].forEach(function (pair) {
    byId(pair[0]).addEventListener("change", function () {
      update(pair[1], this.checked);
    });
  });

  byId("set-reset").addEventListener("click", function () {
    settings = cloneDefaults();
    persist();
    syncSettingsInputs();
    applySettings();
    flashSaved();
  });

  applySettings();
  syncSettingsInputs();

  /* ---------- Panic ---------- */

  function panic() {
    var target = safeUrl(settings.panicUrl);

    if (settings.panicNewTab) {
      var opened = null;
      try { opened = window.open(target, "_blank", "noopener"); } catch (error) { opened = null; }
      if (opened) { return; }
    }

    /* replace() überschreibt den Verlaufseintrag, damit die Seite
       nicht über den Zurück-Button erneut geladen werden kann. */
    try {
      window.location.replace(target);
    } catch (error) {
      window.location.href = target;
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" && event.key !== "Esc" && event.keyCode !== 27) { return; }

    /* Offene Einstellungen schließt Esc zuerst */
    if (!settingsEl.hidden) {
      event.preventDefault();
      closeSettings();
      return;
    }

    if (!settings.panicKey) { return; }

    event.preventDefault();
    /* Im Vollbild beendet Esc zuerst das Vollbild (Browser-Verhalten);
       erst danach wechselt Esc sofort zum Panic-Ziel. */
    if (fullscreenElement()) { exitFullscreen(); return; }
    panic();
  });

  if (panicBtn) { panicBtn.addEventListener("click", panic); }
  if (barPanicBtn) { barPanicBtn.addEventListener("click", panic); }

  /* ---------- Suche einhängen und Adresse auswerten ---------- */

  initSearch(
    PAGE.root ? document.querySelector(PAGE.root) : byId("hub-grid")
  );

  /* „/“ springt ins Suchfeld */
  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) { return; }
    var el = document.activeElement;
    var tagName = el && el.tagName ? el.tagName.toLowerCase() : "";
    if (tagName === "input" || tagName === "textarea" || (el && el.isContentEditable)) { return; }
    if (!searchInput || !playerEl.hidden) { return; }
    event.preventDefault();
    searchInput.focus();
  });

  route();
})();
