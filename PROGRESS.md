# Progress

## Done
- Schritt 1: Grundgerüst (index.html, style.css), eine Spalte 700px, Akzentfarbe Blau
- Schritt 2: F1 – Formular (Datum, Schmerz/Erschöpfung-Regler, Schlaf, Notiz), Prüfung 0–10, gleiches Datum wird ersetzt, Formular-Reset auf heute
- Schritt 3: F2 – Tabelle (Date, Pain, Fatigue, Sleep, Note), neuestes Datum oben, render() als zentrale Anzeige-Funktion, Meldung bei leerer Liste
- Schritt 4: F3 – Pain-/Fatigue-Zellen nach Schwere gefärbt (getSeverityClass, createLevelCell), Farben nur dafür verwendet
- Schritt 5: F4 – Löschen mit Rückfrage in der Zeile ("Delete? Yes / No"), Fokus auf "No", Löschen über das Datum
- Schritt 6: F5 – localStorage (Key "painFatigueEntries"), speichern nach Hinzufügen/Ersetzen/Löschen, laden beim Seitenstart
- Schritt 7: F7 – Zeitraum-Buttons (7 / 30 Tage / All, Start: All), gewählter Button hervorgehoben (aria-pressed), Tabelle zeigt nur Zeitraum
- Schritt 8: F6 – Zusammenfassung (Ø/min/max Schmerz + Erschöpfung, Bad days), Ø mit 1 Nachkommastelle, bezieht sich auf gewählten Zeitraum, bei 0 Einträgen ausgeblendet
- Schritt 9: F8 – SVG-Liniendiagramm (von Hand), y-Achse immer 0–10, gestrichelte Linie bei 7, Legende, Pain blau / Fatigue beere, älteste links

## Next
Schritt 10: F9 – "Load file" (Textdatei importieren)

## Decisions & notes
Diagramm: Punkte gleichmäßig verteilt, nicht nach echtem Zeitabstand

## Known problems
