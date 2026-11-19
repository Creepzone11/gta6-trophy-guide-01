// Leonida Trophy Guide — the hand-in program for gta6-trophy-guide-01.
//
// The entry itself is plain static files: app/ holds the guide and tracker
// (index.html, style.css, app.js and app/data/trophies.json), screenshots/
// holds four renders of the app taken in a browser. There is no build step
// and nothing is fetched over the network, at build time or at run time.
//
// This program copies app/ and screenshots/ from beside this file into the
// output directory and writes dossier.json there with buildDossier from the
// vendored make.fun library (vendor/makefun-frontend.ts — leave that file
// exactly as the kit shipped it: the scorer rebuilds the dossier with its own
// copy and compares the two byte for byte).
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and the output
// directory is /output. Run it twice: both runs must write identical bytes.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Fail loudly instead of handing in half an entry if a folder is missing.
for (const needed of ['app', 'screenshots']) {
  if (!existsSync(join(repoRoot, needed))) {
    throw new Error(`missing ${needed}/ beside main.ts — refusing to build an incomplete entry`);
  }
}

// The tracker data is the entry: refuse a build whose trophy list is not
// exactly the 55 official trophies, so a bad edit fails here instead of at
// the scorer. (v2: the five once-unconfirmed trophies were re-researched on
// 19 November 2026 — Capital Offense and The Truth Is Out There confirmed,
// In The Beginning… method agreed with the exact spot still open, Bad Luck,
// I Guess and Ten Pin still honestly unconfirmed — and the counts re-checked
// against a second source.)
const trophies = JSON.parse(readFileSync(join(repoRoot, 'app', 'data', 'trophies.json'), 'utf-8'));
if (!Array.isArray(trophies.trophies) || trophies.trophies.length !== 55) {
  throw new Error(`expected 55 trophies in app/data/trophies.json, found ${Array.isArray(trophies.trophies) ? trophies.trophies.length : 'none'} — refusing to build an incomplete entry`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });

// The caps mirror the scorer's own gate (reference/gate.json): at most four
// screenshots of 256 KiB each, at most 993 files and directories totalling
// 48 MiB under app/, and the dossier text capped at 160 KiB. Only the text
// cap shapes bytes; the rest refuse an entry the scorer would refuse anyway.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
