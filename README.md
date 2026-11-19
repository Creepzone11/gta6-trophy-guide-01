[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Creepzone11/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Creepzone11/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI Platinum Tracker

An offline, single-file-style web guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. No build step, no network, no libraries: open `app/index.html` in any browser and it works with the Wi-Fi off.

## What it does

- **Tracker** — tick off trophies as you earn them; progress is saved in your browser (localStorage) and shown as x/55 with a per-grade breakdown. Export your progress to a JSON file and import it back any time.
- **Guides with sources** — every trophy has a guide written for this entry (2–4 sentences: what to do, where, how, and when it can be missed) plus a "Sources:" line naming the guide it draws on — PowerPyx, Push Square, GTA Zone and PlanetGTA6. Nothing is copied from another guide. The five trophies whose unlock method is still unconfirmed (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) say so plainly instead of guessing.
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
- Push Square — GTA 6 Trophy Guide & Roadmap: https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
- GTA Zone — GTA 6 Trophy List: https://gta-zone.com/news/gta-6-trophies-achievements/
- PlanetGTA6 — GTA 6 Trophies: https://www.planetgta6.com/en/gta-6-trophies/

Names, descriptions and grades are PlayStation's official trophy text. The look is original — no Rockstar logo or artwork.

---

Built for the [make.fun GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01). New to make.fun? Sign up with my referral link: https://make.fun/?ref=kh987p5b
