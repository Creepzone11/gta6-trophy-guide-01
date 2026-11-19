[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Creepzone11/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Creepzone11/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI Platinum Tracker

An offline, single-file-style web guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. No build step, no network, no libraries: open `app/index.html` in any browser and it works with the Wi-Fi off.

## What it does

- **Tracker** — tick off trophies as you earn them; progress is saved in your browser (localStorage) and shown as x/55 with a per-grade breakdown. Export your progress to a JSON file and import it back any time. The masthead puts the big progress card beside a featured card for the one missable trophy, always open, so the first screen already shows where you stand and what you must not miss.
- **Guides with sources** — every trophy has a guide written for this entry (2–4 sentences: what to do, where, how, and when it can be missed) plus a "Sources:" line naming the guide it draws on — PowerPyx, Push Square, GTA Zone, PlanetGTA6, GTABase, GamesHorizon and Beebom. Nothing is copied from another guide. Two trophies (Bad Luck, I Guess and Ten Pin) still have no confirmed unlock method and say so plainly instead of guessing; a third, In The Beginning…, has a method agreed across guides while the exact spot is still being pinned down. Two more were confirmed from updated post-launch guides: Capital Offense (the blue Banshee) and The Truth Is Out There (the Kelly County UFO event).
- **Roadmap to Platinum** — seven stages built from the official descriptions: story Chapters 1–2, Chapters 3–5 and the finale, side-character questlines and Strangers & Freaks, activities and challenges, collectibles and exploration, crime/partner/money trophies, then the 100% checklist and the platinum. About 200 hours, one playthrough.
- **Missable warning** — one trophy is reported as possibly missable: Positive Mental Attitude, because Lucia's Chapter 1 balcony meditation disappears after that chapter. It is flagged in the roadmap, in its own warning box, and on the trophy itself.
- **Filters and spoiler mode** — search by name or description, filter by kind (story, missable, collectibles, activities, online) and grade, hide earned trophies, and switch on spoiler-free mode to hide the names and descriptions of the 28 hidden story trophies until you earn them.

## Facts about the list

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 are hidden on PlayStation until earned. All are single-player — there are no online trophies. Cheats disable trophies and saving, and there is no mission replay or New Game+, so the guide tells you to keep a manual save at the start of each chapter.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` directly from disk — the app loads its data from the local `app/data/trophies.json` and nothing else.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored library. Run it twice: both runs must produce identical bytes.

## Sources

- PowerPyx — GTA 6 Trophy Guide & Roadmap: https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- PowerPyx — GTA 6 100% Completion Checklist: https://www.powerpyx.com/gta-6-100-completion-checklist-guide/
- PowerPyx — GTA 6 UFO Aliens Easter Egg Location: https://www.powerpyx.com/gta-6-ufo-aliens-easter-egg-location/
- Push Square — GTA 6 Trophy Guide & Roadmap: https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
- GTA Zone — GTA 6 Trophy List: https://gta-zone.com/news/gta-6-trophies-achievements/
- PlanetGTA6 — GTA 6 Trophies: https://www.planetgta6.com/en/gta-6-trophies/
- GTABase — GTA 6 Trophy Guide & Achievements List: https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series
- GamesHorizon — GTA 6 UFO Event Location: https://gameshorizon.com/games/gta-6-ufo-event-location/
- Beebom — All GTA 6 Meditation Spots Locations: https://beebom.com/gta-6-meditation-spots-locations/

Names, descriptions and grades are PlayStation's official trophy text. The look is original — no Rockstar logo or artwork.

---

Built for the [make.fun GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01). New to make.fun? Sign up with my referral link: https://make.fun/?ref=kh987p5b
