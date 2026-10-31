/* =============================================================
   data-index.js - Inhalte des oeffentlichen Portals (index.html)
   -------------------------------------------------------------
   Nur diese Datei wird von index.html geladen. Sie enthaelt
   keinerlei Daten des internen Hubs.

     SCHOOL_DATA  Werkzeuge des Portals
     ARTICLES     redaktionelle Ratgeber
   ============================================================= */

const SCHOOL_DATA = [
  {
    id: "desmos",
    name: "Desmos Grafikrechner",
    category: "Rechnen & Mathematik",
    description:
      "Interaktiver Funktionsplotter für Analysis, Geometrie und Datenanalyse. " +
      "Funktionen werden direkt eingegeben, Parameter lassen sich als Schieberegler " +
      "verändern – so wird der Einfluss einzelner Werte sofort sichtbar.",
    url: "https://www.desmos.com/calculator",
    embed: "https://www.desmos.com/calculator?embed"
  },
  {
    id: "geogebra",
    name: "GeoGebra Classic",
    category: "Rechnen & Mathematik",
    description:
      "Dynamische Geometrie, Algebra und Stochastik in einer Anwendung. " +
      "Konstruktionen bleiben veränderbar, Messwerte aktualisieren sich automatisch. " +
      "Geeignet für Skizzen, Beweise und die Visualisierung von Zusammenhängen.",
    url: "https://www.geogebra.org/classic",
    embed: "https://www.geogebra.org/classic?embed"
  },
  {
    id: "wolframalpha",
    name: "WolframAlpha",
    category: "Rechnen & Mathematik",
    description:
      "Wissensmaschine für Gleichungen, Ableitungen, Integrale, Einheiten und " +
      "naturwissenschaftliche Fragestellungen. Ergebnisse erscheinen mit Rechenweg, " +
      "Diagramm und alternativen Schreibweisen.",
    url: "https://www.wolframalpha.com/",
    embed: "https://www.wolframalpha.com/"
  },
  {
    id: "wikipedia",
    name: "Wikipedia (Deutsch)",
    category: "Wissen & Recherche",
    description:
      "Freie Enzyklopädie für den Einstieg in ein Thema. Artikel enthalten in der Regel " +
      "Belege, weiterführende Literatur und Weblinks – die Grundlage für belastbare " +
      "Recherche.",
    url: "https://de.wikipedia.org/wiki/Wikipedia:Hauptseite",
    embed: "https://de.wikipedia.org/wiki/Wikipedia:Hauptseite"
  },
  {
    id: "duden",
    name: "Duden Sprachwissen",
    category: "Sprache & Text",
    description:
      "Rechtschreibung, Grammatik und Bedeutung von Wörtern. Nützlich für " +
      "Textüberarbeitungen, Bewerbungen und alle Fälle, in denen es auf die korrekte " +
      "Schreibweise ankommt.",
    url: "https://www.duden.de/",
    embed: "https://www.duden.de/"
  },
  {
    id: "leo",
    name: "LEO Wörterbuch",
    category: "Sprache & Text",
    description:
      "Zweisprachiges Wörterbuch mit Beispielsätzen und Foren. Unterstützt Englisch, " +
      "Französisch, Spanisch, Italienisch, Latein und weitere Sprachen – inklusive " +
      "Verbtabellen und Aussprachehinweisen.",
    url: "https://dict.leo.org/",
    embed: "https://dict.leo.org/"
  },
  {
    id: "deepl",
    name: "DeepL Übersetzer",
    category: "Sprache & Text",
    description:
      "Maschinelle Übersetzung für ganze Absätze und Dokumente. Der Text lässt sich " +
      "vor dem Übersetzen bearbeiten; Fachbegriffe können im Wörterbuch gezielt " +
      "nachgeschlagen werden.",
    url: "https://www.deepl.com/translator",
    embed: "https://www.deepl.com/translator"
  },
  {
    id: "phet",
    name: "PhET Simulationen",
    category: "Wissenschaft",
    description:
      "Interaktive Simulationen zu Mechanik, Elektrizität, Optik, Chemie und Biologie. " +
      "Parameter lassen sich im laufenden Experiment verändern, Messwerte werden " +
      "direkt angezeigt.",
    url: "https://phet.colorado.edu/de/",
    embed: "https://phet.colorado.edu/sims/html/graphing-lines/latest/graphing-lines_de.html"
  },
  {
    id: "periodensystem",
    name: "Periodensystem (PSE)",
    category: "Wissenschaft",
    description:
      "Vollständiges Periodensystem der Elemente mit Ordnungszahl, Atommasse, " +
      "Elektronegativität und weiteren Stoffdaten zu jedem Element.",
    url: "https://www.periodensystem-online.de/",
    embed: "https://www.periodensystem-online.de/"
  }
];

/* -------------------------------------------------------------
   2) RATGEBER – redaktionelle Artikel
   -------------------------------------------------------------
   sections[] enthält Abschnitte mit optionalem Titel,
   Absätzen (paragraphs) und Aufzählungspunkten (bullets).
   ------------------------------------------------------------- */
const ARTICLES = [
  {
    id: "desmos-funktionen",
    title: "Funktionen lesen statt nur zeichnen",
    category: "Rechnen & Mathematik",
    date: "12. Oktober 2026",
    readingTime: "6 Minuten",
    teaser:
      "Ein Graph zeigt auf einen Blick, was eine Funktionsgleichung beschreibt. " +
      "Wer die vier typischen Merkmale systematisch abarbeitet, erkennt den Verlauf " +
      "ohne Wertetabelle.",
    sections: [
      {
        title: "Vier Merkmale, die jeden Graphen erklären",
        paragraphs: [
          "Bevor ein Plot überhaupt etwas nützt, sollte klar sein, wonach man sucht. " +
          "Vier Merkmale decken die meisten Fragen ab: Definitionsbereich, Nullstellen, " +
          "Extrempunkte und das Verhalten für sehr große beziehungsweise sehr kleine " +
          "Werte. Sie beantworten, wo die Funktion definiert ist, wo sie die Achse " +
          "schneidet, wo sie ihren höchsten oder tiefsten Punkt erreicht und wohin die " +
          "Kurve langfristig läuft."
        ],
        bullets: [
          "Definitionsbereich: Senkrechte Linien, an denen der Graph abbricht, deuten auf Definitionslücken hin.",
          "Nullstellen: Schnittpunkte mit der waagerechten Achse – oft der Ausgangspunkt jeder Rechnung.",
          "Extrempunkte: Hoch- und Tiefpunkte zeigen, wo sich das Verhalten der Funktion ändert.",
          "Grenzverhalten: Der Verlauf am linken und rechten Rand verrät die führende Potenz."
        ]
      },
      {
        title: "Parameter sichtbar machen",
        paragraphs: [
          "Der eigentliche Vorteil digitaler Plotter liegt in den Schiebereglern. Statt " +
          "mehrere Gleichungen zu vergleichen, wird ein Parameter wie ein Faktor vor der " +
          "Variable langsam verändert. Der Graph reagiert unmittelbar: Stauchung, " +
          "Streckung, Verschiebung nach oben oder unten.",
          "Sinnvoll ist es, immer nur einen Parameter zu bewegen und die übrigen " +
          "konstant zu halten. Wer zwei Regler gleichzeitig verschiebt, sieht zwar eine " +
          "Veränderung, kann sie aber nicht mehr eindeutig zuordnen."
        ]
      },
      {
        title: "Vom Bild zur Begründung",
        paragraphs: [
          "Ein Plot ist ein Hinweis, kein Beweis. Die Vermutung, die man am Graphen " +
          "abliest, wird anschließend rechnerisch geprüft: Ableitung null setzen, " +
          "Vorzeichenwechsel kontrollieren, Grenzwerte berechnen. Erst wenn Rechnung und " +
          "Zeichnung übereinstimmen, ist das Ergebnis belastbar.",
          "Für die Dokumentation lohnt es sich, den betrachteten Ausschnitt zu notieren. " +
          "Ein Fenster von minus zehn bis zehn zeigt andere Strukturen als eines von " +
          "minus eins bis eins – und genau dieser Bereich entscheidet oft über die " +
          "Interpretation."
        ]
      }
    ]
  },
  {
    id: "wikipedia-quellen",
    title: "Quellen prüfen: fünf Schritte vor dem Zitieren",
    category: "Wissen & Recherche",
    date: "28. September 2026",
    readingTime: "5 Minuten",
    teaser:
      "Ein Enzyklopädieartikel ist ein Einstieg, keine Endstation. Fünf Prüfschritte " +
      "trennen eine brauchbare Grundlage von einer Behauptung ohne Beleg.",
    sections: [
      {
        title: "Warum der Einstieg nicht das Ergebnis ist",
        paragraphs: [
          "Übersichtsartikel bündeln Wissen, das an anderer Stelle entstanden ist. " +
          "Der Wert liegt in der Struktur: Definition, Zusammenhang, Literatur. " +
          "Wer daraus zitiert, zitiert eine Zusammenfassung – und übernimmt damit auch " +
          "deren mögliche Fehler."
        ]
      },
      {
        title: "Die fünf Prüfschritte",
        paragraphs: [
          "Die Reihenfolge ist bewusst gewählt: Sie beginnt bei der Frage, ob der " +
          "Artikel überhaupt zum Thema gehört, und endet bei der Prüfung der " +
          "Originalquelle."
        ],
        bullets: [
          "1. Thema prüfen: Behandelt der Artikel genau die gestellte Frage oder nur einen Nachbarbegriff?",
          "2. Belege ansehen: Gibt es Einzelnachweise an der betreffenden Stelle – oder nur am Artikelende?",
          "3. Quelle einordnen: Fachaufsatz, Behörde, Lehrbuch oder Nachrichtenmeldung?",
          "4. Original lesen: Die zitierte Stelle in der Originalquelle aufsuchen und im Zusammenhang prüfen.",
          "5. Datum und Aktualität: Bei Zahlen, Rechtslagen und Technik entscheidet das Erscheinungsjahr."
        ]
      },
      {
        title: "Zitierfähig wird es erst mit dem Original",
        paragraphs: [
          "Für schriftliche Arbeiten empfiehlt sich die Regel: Der Beleg stammt aus der " +
          "Originalquelle, nicht aus der Übersicht. Lässt sich das Original nicht " +
          "beschaffen, wird die Zusammenfassung als solche gekennzeichnet – mit " +
          "Verweis auf den Stand des Artikels.",
          "Ein letzter Kontrollgriff: Behauptet der Artikel etwas Auffälliges, sollte " +
          "sich dieselbe Aussage in einer zweiten, unabhängigen Quelle finden. " +
          "Übereinstimmende unabhängige Belege sind ein deutlich stärkeres Signal als " +
          "die Zahl der Fußnoten."
        ]
      }
    ]
  },
  {
    id: "wolframalpha-eingabe",
    title: "WolframAlpha: Eingaben, die zuverlässig zum Ergebnis führen",
    category: "Rechnen & Mathematik",
    date: "14. September 2026",
    readingTime: "7 Minuten",
    teaser:
      "Die Antwort ist nur so gut wie die Frage. Wer die Eingabesprache beherrscht, " +
      "bekommt Rechenwege statt Fehlinterpretationen.",
    sections: [
      {
        title: "Klartext mit Struktur",
        paragraphs: [
          "Die Wissensmaschine versteht natürliche Sprache, aber nicht Beliebiges. " +
          "Eingaben werden dann zuverlässig gedeutet, wenn sie eindeutig sind: " +
          "Gleichungen mit Gleichheitszeichen, Funktionen mit ausgeschriebener " +
          "Variable, Grenzen in eckigen Klammern."
        ],
        bullets: [
          "Gleichung lösen: \"solve 3x + 7 = 22 for x\" statt \"3x+7 22\".",
          "Ableitung: \"derivative of x^3 sin(x)\" – die Funktion wird als Ganzes erkannt.",
          "Integral mit Grenzen: \"integrate x^2 from 0 to 4\".",
          "Einheiten: \"45 km/h in m/s\" liefert Umrechnung samt Formel.",
          "Statistik: \"mean, median of 4, 9, 9, 12, 17\"."
        ]
      },
      {
        title: "Mehrere Schreibweisen zulassen",
        paragraphs: [
          "Bevor eine Eingabe als falsch verworfen wird, lohnt ein zweiter Versuch mit " +
          "anderer Schreibweise. Brüche funktionieren als \"1/3\" oder \"one third\", " +
          "Wurzeln als \"sqrt(2)\" oder \"square root of 2\". Die Ergebnisblöcke zeigen " +
          "dann unterschiedliche Darstellungen derselben Zahl: exakt, dezimal und als " +
          "Näherung."
        ]
      },
      {
        title: "Ergebnis prüfen, nicht übernehmen",
        paragraphs: [
          "Jede Ausgabe enthält Annahmen – etwa den Zahlenbereich oder die Variable, " +
          "nach der aufgelöst wurde. Diese Annahmen stehen direkt über dem Ergebnis und " +
          "sollten mit der eigenen Aufgabe verglichen werden.",
          "Für schriftliche Lösungen ist der Rechenweg entscheidend. Zeigt das Werkzeug " +
          "einen Lösungsweg, dient er der Kontrolle des eigenen Vorgehens; er ersetzt " +
          "ihn nicht. Wer den Weg nachvollzieht, erkennt auch, an welcher Stelle eine " +
          "eigene Rechnung abweicht."
        ]
      }
    ]
  },
  {
    id: "einheiten-umrechnen",
    title: "Einheiten sicher umrechnen – ohne Vorzeichenfehler",
    category: "Alltag & Praxis",
    date: "31. August 2026",
    readingTime: "4 Minuten",
    teaser:
      "Die meisten Rechenfehler entstehen nicht beim Rechnen, sondern beim Wechsel " +
      "der Einheit. Zwei Regeln verhindern das.",
    sections: [
      {
        title: "Regel eins: Einheiten wie Zahlen behandeln",
        paragraphs: [
          "Eine Einheit ist ein Faktor, kein Etikett. Wer 45 Kilometer pro Stunde in " +
          "Meter pro Sekunde umrechnet, multipliziert mit 1000 und teilt durch 3600 – " +
          "die Einheiten kürzen sich dabei heraus. Schreibt man die Einheiten mit, " +
          "zeigt sich ein Fehler sofort: Steht am Ende Meter pro Stunde, wurde die " +
          "Division vergessen."
        ]
      },
      {
        title: "Regel zwei: Überschlägig prüfen",
        paragraphs: [
          "Vor der exakten Rechnung eine Größenordnung schätzen. 45 km/h müssen etwas " +
          "über 12 m/s ergeben, weil eine Sekunde deutlich kürzer als eine Stunde ist. " +
          "Liefert der Taschenrechner 162, wurde mit dem Kehrwert gerechnet."
        ],
        bullets: [
          "1 km/h entspricht rund 0,28 m/s.",
          "1 Liter entspricht 1000 Kubikzentimetern – nicht 100.",
          "1 Kilowattstunde entspricht 3,6 Megajoule.",
          "Bei Flächen wirkt der Faktor quadratisch: 1 m² sind 10.000 cm²."
        ]
      },
      {
        title: "Runden erst am Ende",
        paragraphs: [
          "Zwischenergebnisse sollten ungerundet weiterverwendet werden. Wer bei jedem " +
          "Schritt auf zwei Stellen rundet, summiert die Abweichungen und liegt am Ende " +
          "deutlich neben dem exakten Wert. Gerundet wird die Ergebniszeile – mit so " +
          "vielen Stellen, wie die ungenaueste Eingangsgröße zulässt."
        ]
      }
    ]
  },
  {
    id: "texte-pruefen",
    title: "Texte prüfen: Rechtschreibung, Stil und Lesbarkeit",
    category: "Sprache & Text",
    date: "17. August 2026",
    readingTime: "5 Minuten",
    teaser:
      "Rechtschreibprüfungen finden Tippfehler, keine Denkfehler. Ein dreistufiges " +
      "Verfahren deckt beides ab.",
    sections: [
      {
        title: "Stufe eins: technische Prüfung",
        paragraphs: [
          "Zuerst die automatische Prüfung: Rechtschreibung, Grammatik, doppelte " +
          "Leerzeichen. Sie ist schnell und unzuverlässig – Eigennamen werden markiert, " +
          "Fachbegriffe fehlen im Wörterbuch. Jede Korrektur wird einzeln bestätigt, " +
          "nie pauschal übernommen."
        ]
      },
      {
        title: "Stufe zwei: Satzbau",
        paragraphs: [
          "Danach der Blick auf die Struktur. Sätze über 25 Wörter werden geteilt, " +
          "Schachtelsätze aufgelöst, Nominalstil durch Verben ersetzt. Ein Test: " +
          "Lässt sich der Satz beim ersten Lesen verstehen, ohne zurückzuspringen? " +
          "Wenn nicht, liegt es fast immer an der Satzlänge."
        ],
        bullets: [
          "Ein Gedanke pro Satz, höchstens zwei Nebensätze.",
          "Aktiv statt Passiv, Verb statt Substantivierung.",
          "Füllwörter streichen: eigentlich, quasi, sozusagen, gewissermaßen.",
          "Aufzählungen nur, wenn alle Punkte dieselbe Form haben."
        ]
      },
      {
        title: "Stufe drei: Vorlesen",
        paragraphs: [
          "Der letzte Durchgang erfolgt laut oder mit einer Vorlesefunktion. Stolperer " +
          "markieren genau die Stellen, an denen Leser hängen bleiben. Anschließend " +
          "eine Pause von mindestens einer Stunde – der zweite Blick findet fast immer " +
          "noch einen Fehler, den der erste übersehen hat."
        ]
      }
    ]
  },
  {
    id: "lernplan",
    title: "Ein Lernplan, der hält: 90-Minuten-Blöcke und Pausen",
    category: "Arbeitstechnik",
    date: "3. August 2026",
    readingTime: "6 Minuten",
    teaser:
      "Pläne scheitern selten am fehlenden Willen, sondern an zu großen Einheiten. " +
      "Ein belastbarer Plan besteht aus wenigen, klaren Blöcken.",
    sections: [
      {
        title: "Der Block als kleinste Einheit",
        paragraphs: [
          "Ein Lernblock umfasst 90 Minuten mit einer kurzen Pause nach 45 Minuten. " +
          "Diese Länge entspricht dem Zeitraum, in dem konzentriertes Arbeiten ohne " +
          "deutlichen Qualitätsverlust möglich ist. Vier Blöcke pro Tag sind für die " +
          "meisten Menschen bereits die Obergrenze."
        ]
      },
      {
        title: "Was in einen Block gehört",
        paragraphs: [
          "Jeder Block bekommt genau ein Ziel, das am Ende überprüfbar ist. " +
          "\"Kapitel 4 lesen\" ist kein Ziel, \"die drei Beweise aus Kapitel 4 ohne " +
          "Vorlage aufschreiben\" schon. Überprüfbare Ziele verhindern, dass eine " +
          "Aufgabe als erledigt gilt, obwohl sie nur begonnen wurde."
        ],
        bullets: [
          "Ziel zuerst notieren, dann den Block starten.",
          "Ablenkungen vorher klären: Benachrichtigungen aus, Wasser bereitstellen.",
          "Am Blockende fünf Minuten zusammenfassen, was offen geblieben ist.",
          "Pausen nicht aufsparen – sie gehören zum Plan, nicht zum Rest."
        ]
      },
      {
        title: "Wiederholung einplanen",
        paragraphs: [
          "Lernen ohne Wiederholung verfällt schnell. Deshalb wird rund ein Drittel " +
          "aller Blöcke für die Wiederholung früherer Inhalte reserviert: Montag neu, " +
          "Mittwoch wiederholen, Freitag prüfen. Der Aufwand ist gering, der Effekt " +
          "deutlich größer als zusätzliche neue Kapitel.",
          "Ein Plan, der eine Woche lang funktioniert hat, ist besser als ein " +
          "perfekter Plan, der nach zwei Tagen aufgegeben wird. Nach der ersten Woche " +
          "wird deshalb angepasst: zu volle Tage kürzen, zu leichte Tage zusammenlegen."
        ]
      }
    ]
  }
];
