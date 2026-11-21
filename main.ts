// Hand-in script for the Leonida Trophy Guide (gta6-trophy-guide-01).
//
// What the entry is: static files, nothing more. `app/` is the guide and
// tracker itself (HTML, CSS, JS, plus the trophy data in JSON); `screenshots/`
// is four renders of the app taken in a browser. There is no build step, no
// bundler, and the app never touches the network — at build time or at run
// time, the only files it reads are the ones in this repo.
//
// Round 6 changes (vs round 5): every trophy now cites the official trophy
// list by name (PlayStation, Exophase, PSNProfiles) beside its guide sources,
// and the three trophies whose trigger is still unconfirmed are flagged
// "own advice — not yet checked in the game". The kind dropdown is replaced
// by visible category filter chips (Story, Strangers, Crime, Activities,
// Collectibles, Money, Combat, Secret, Missable) that really filter, and
// clicking a trophy name opens a detail panel with the official description,
// grade, "Can it be missed?" flag, own-words steps and the Sources block.
// The 7-stage platinum roadmap and the saved-progress checklist are kept.
//
// What this script does, step by step:
//   1. Checks that `app/` and `screenshots/` are actually here. If one is
//      missing, it throws instead of handing in half an entry.
//   2. Copies both folders into the output directory.
//   3. Writes `dossier.json` into the output directory with buildDossier
//      from the vendored make.fun library in vendor/makefun-frontend.ts.
//      That vendor file is kit code — do not edit it: the scorer rebuilds
//      the dossier with its own copy and compares the two byte for byte.
//
// Where the output goes: the MAKEFUN_OUTPUT_DIR environment variable when
// it is set, otherwise /output (the grader's container). Try it locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice and the two dossiers must be byte-identical.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const folders = ['app', 'screenshots'];

// Refuse to hand in an entry that is missing a piece.
for (const folder of folders) {
  if (!existsSync(join(here, folder))) {
    throw new Error(`cannot build the entry: ${folder}/ is missing beside main.ts`);
  }
}

// Refuse to hand in an entry whose trophy data does not parse or is not the
// full official list of 55 — a broken or partial list would silently ship.
const trophyDoc = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf-8'));
if (!Array.isArray(trophyDoc.trophies) || trophyDoc.trophies.length !== 55) {
  throw new Error(`cannot build the entry: trophies.json must hold 55 trophies, found ${trophyDoc.trophies?.length ?? 0}`);
}

mkdirSync(outDir, { recursive: true });
for (const folder of folders) {
  cpSync(join(here, folder), join(outDir, folder), { recursive: true });
}

// Caps taken from the scorer's own gate (reference/gate.json): no more than
// four screenshots of 256 KiB each, no more than 993 files and directories
// totalling 48 MiB under app/, and the dossier text capped at 160 KiB.
// Only the text cap changes any bytes; the rest simply refuse an entry the
// scorer would refuse anyway.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
