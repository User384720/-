/* =============================================================
   aaa.js – aaa.html
   -------------------------------------------------------------
   Der einzige eigene Aufbau: die ersten zwei Einträge stehen
   nebeneinander, alle weiteren als breiter Streifen darunter.
   Einträge ändern: in hub.js unter "aaa", ein Objekt pro Rahmen.
   ============================================================= */

(function () {
  "use strict";

  /* Ein Rahmen mit Kopfzeile und Direktlink */
  function pane(item, extraClass) {
    var src = item.embed || item.url;
    var haystack = [item.name, item.tag, item.text].join(" ").toLowerCase();

    return (
      '<div class="aaa-pane' + (extraClass ? " " + extraClass : "") + '"' +
        ' data-search="' + Hub.escape(haystack) + '">' +
        '<div class="aaa-pane-head">' +
          '<span class="aaa-pane-tag">' + Hub.escape(item.tag || "Einbettung") + "</span>" +
          "<h3>" + Hub.escape(item.name) + "</h3>" +
          (item.text ? '<span class="aaa-pane-note">' + Hub.escape(item.text) + "</span>" : "") +
          '<a class="aaa-open" href="' + Hub.escape(item.url || src) + '"' +
            ' target="_blank" rel="noopener noreferrer">extern &nearr;</a>' +
        "</div>" +
        '<div class="aaa-frame">' +
          '<iframe src="' + Hub.escape(src) + '" title="' + Hub.escape(item.name) + '"' +
            ' loading="lazy" referrerpolicy="strict-origin-when-cross-origin"' +
            ' allow="fullscreen; autoplay; gamepad; pointer-lock;' +
            ' clipboard-read; clipboard-write; storage-access"></iframe>' +
        "</div>" +
      "</div>"
    );
  }

  window.HUB_PAGE = {
    id: "aaa",
    root: "#aaa-layout",

    render: function (page) {
      var layout = Hub.byId("aaa-layout");
      if (!layout) { return; }

      var list = page && page.entries ? page.entries : [];
      if (!list.length) {
        layout.innerHTML = '<div class="secret-note">Noch keine Einträge.</div>';
        return;
      }

      layout.innerHTML =
        '<div class="aaa-split">' +
          list.slice(0, 2).map(function (item) { return pane(item, ""); }).join("") +
        "</div>" +
        list.slice(2).map(function (item) {
          return '<div class="aaa-wide">' + pane(item, "wide") + "</div>";
        }).join("");

      Hub.setCount(list.length);
    },

    /* Bei aktiver Suche stehen die Hälften untereinander statt nebeneinander */
    onFilter: function (active) {
      var split = document.querySelector(".aaa-split");
      if (split) { split.classList.toggle("is-filtering", active); }
    }
  };
})();
