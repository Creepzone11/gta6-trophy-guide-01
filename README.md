[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Creepzone11/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Creepzone11/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

# Leonida Trophy Guide — GTA VI Platinum Tracker

A complete, offline guide and progress tracker for every PlayStation 5 trophy in Grand Theft Auto VI. No build step, no libraries, no network: open `app/index.html` in any browser and it works with the Wi-Fi off.

## The tracker

Tick a trophy off when you earn it and your progress is saved in the browser (localStorage) — x/55 overall, a per-grade breakdown (platinum/gold/silver/bronze), and a progress bar. Export your progress to a JSON file and import it back whenever you like. Nothing leaves your device.

## The platinum roadmap strip

Right under the title, a single band shows the whole road to the platinum: all 7 stages with a live earned/total count for each, updating as you tick trophies off. The full roadmap underneath walks each stage in order — story Chapters 1–2, Chapters 3–5 and the finale, side-character questlines and Strangers & Freaks, activities and challenges, collectibles and exploration, crime/partner/money trophies, then the 100% checklist and the platinum. About 200 hours, one playthrough.

## The guides

Each of the 55 trophies has a guide written for this entry: what to do, where, how, and whether it can be missed — plus a "Sources:" line naming the guide it draws on (PowerPyx, Push Square, GTA Zone, PlanetGTA6). Nothing is copied from another guide.

Two trophies are confirmed in this round that were unconfirmed before: **Capital Offense** (steal the blue Banshee from the vehicle showroom in south Vice City and drive it through the glass, after the Key Cloner mission) and **The Truth Is Out There** (the UFO easter egg after 2 AM on the road north-west of the Starlet Motel). The counts are verified too: 42 shooting-range golds across the two ranges, 3 drone time trials at each of 14 locations, 480 cards in 18 sets, 397 stunts. The trophies still unconfirmed — In The Beginning…, Bad Luck, I Guess, Ten Pin — say so plainly instead of guessing.

## One missable trophy

Only one trophy is reported as possibly missable: **Positive Mental Attitude**, because Lucia's Chapter 1 balcony meditation disappears after that chapter. It is flagged in three places: in the roadmap, in its own warning box, and on the trophy itself. Everything else can be earned after the story in free-roam.

## Filters and spoiler mode

Search by name or description, filter by kind (story, missable, collectibles, activities, online) and grade, hide the trophies you have already earned, and switch on spoiler-free mode to hide the names and descriptions of the 28 hidden story trophies until you earn them.

## The list in numbers

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 are hidden on PlayStation until earned. All are single-player — there are no online trophies. Cheats disable trophies and saving, and there is no mission replay or New Game+, so the guide tells you to keep a manual save at the start of each chapter (15 manual slots).

## Run it locally

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` straight from disk — the app loads its data from the local `app/data/trophies.json` and nothing else.

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
