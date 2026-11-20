# Spec: Pain and Fatigue Diary


## Goal (one or two sentences)

A single-page website where I log my pain and fatigue once a day (0–10) and see my good and bad days as a table, a chart and a short summary. Data is saved in the browser, so I can show my rheumatologist how the last weeks really were.

## Users

Just me. It should also be usable on my phone.

## Features (numbered, so prompts can refer to them)

F1. Add a daily entry with a form: date (default today), pain 0–10 (slider), fatigue 0–10 (slider), optional sleep hours and a short note. F2. Show all saved entries in a table, newest first. F3. Colour the pain and fatigue cells in the table: 0–3 green, 4–6 yellow, 7–10 red. F4. Delete an entry from the table. F5. Save entries in localStorage so they survive a page reload. F6. Summary for the chosen period: average, lowest and highest pain and fatigue, and the number of "bad days" (pain or fatigue 7 or higher). F7. Period buttons: last 7 days, last 30 days, all. The table, summary and chart only show that period. F8. Simple line chart (drawn with SVG by hand) of pain and fatigue over time, with a dashed line at 7. F9. "Load file" button: import entries from a text file in the format date;pain;fatigue;sleep;note (one line per day, first line is the header). F10. "Load sample data" button that adds 14 days of example entries, for demonstrating the site in class.

## Acceptance criteria (how I know a feature works)
F1: The form cannot be submitted without date, pain and fatigue. Pain and fatigue must be between 0 and 10. After saving, the form is reset (date back to today).
F1: If an entry for the same date already exists, it is replaced, not added twice.
F2: The newest date is always at the top.
F3: A value of 3 is green, 4 is yellow, 7 is red.
F4: After deleting, the entry is gone from the table, summary and chart.
F5: After reload, all entries are still there.
F6: The averages are shown with one decimal place. With no entries, a friendly message is shown instead of numbers.
F7: The selected period button is highlighted. Switching periods updates the table, summary and chart without reloading the page.
F8: The chart shows two lines in different colours with a small legend. The y-axis always goes from 0 to 10.
F9: Lines with wrong values are skipped, and a message says how many were skipped.

## Out of scope (do NOT build)
No login, no server, no database
No frameworks or libraries (no React, no jQuery, no Bootstrap, no Chart.js)
No sending data anywhere, as it is private health data
No medical advice or diagnosis
No sound, no animations beyond simple CSS transitions
No mobile app

## Look & feel

Calm, simple and readable. One column, max width ~700px, large touch-friendly controls. One accent colour. Green, yellow and red are only used for severity, never for decoration.
