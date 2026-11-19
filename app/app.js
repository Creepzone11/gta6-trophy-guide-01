// Leonida Trophy Guide — offline tracker for the 55 GTA VI trophies on PS5.
// Loads app/data/trophies.json (a local file, never the network), renders the
// roadmap, the missable list and the checklist, and saves progress in
// localStorage. Export downloads the progress as JSON; import reads it back.
// Query parameters (for linking to a view, and for screenshots):
//   ?spoiler=1  spoiler-free mode on   ?kind=story|missable|collectibles|activities|online
//   ?grade=bronze|silver|gold|platinum ?search=text   ?earned=2,3,8  pre-tick trophies
//   ?focus=roadmap|missable|trophy-<id>  scroll that part into view on load
const KEY = 'gta6-trophy-checklist';
const SPOILER_KEY = 'gta6-trophy-spoiler';

// The seven roadmap stages, built from the official trophy descriptions:
// which story chapters and missions, which collectibles and counts, in order.
const ROADMAP = [
  { n: 1, title: 'Stage 1 — Play the story, Chapters 1–2', text: 'Finish the opening missions and Chapters 1 and 2. Do the Chapter 1 balcony meditation with Lucia before the chapter ends (see the missable warning below). Scan vehicles and study animals as you go — the counts already bank toward later trophies.', trophies: [2, 3, 4, 8, 28] },
  { n: 2, title: 'Stage 2 — Chapters 3–5 and the finale', text: 'Play through Chapters 3 and 4 to the final mission. Every chapter and mission trophy here is automatic story progress and cannot be missed.', trophies: [5, 6, 7, 9, 10, 11, 12, 13] },
  { n: 3, title: 'Stage 3 — Side characters and strangers', text: 'Finish the optional questlines for Andy, Kenton, Billy, Randy, Tyrone and Bret, and complete 8 Strangers & Freaks strands. Note: only Kirk, Kyle, Yago and Pilot Pete count toward Strangers & Freaks — the named characters above have their own trophies instead.', trophies: [22, 23, 24, 25, 26, 27, 29] },
  { n: 4, title: 'Stage 4 — Activities and challenges', text: 'Try all 9 activity types, win races and drone races, gold every shooting range, finish an arcade game, beat Cal at fishing and complete 50 of the 80 challenges (70 for the 100% checklist).', trophies: [15, 16, 17, 18, 19, 20, 21, 32] },
  { n: 5, title: 'Stage 5 — Collectibles and exploration', text: 'Complete 3 of the 18 card sets, scan 100 WAiNK locations, discover 100 vehicles and unfog the whole map of Leonida by plane.', trophies: [30, 31, 35, 42] },
  { n: 6, title: 'Stage 6 — Crime, partners and money', text: 'Partner robberies, bank vaults, armored trucks, gang operations, the airport plane and the tank, plus the money trophies: launder $250,000 in marked bills, spend $100,000, buy all 8 garages and register 10 vehicles.', trophies: [33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55] },
  { n: 7, title: 'Stage 7 — 100% Completion, then platinum', text: 'After the credits, open the 100% checklist (Progress, then Stats, then 100% Completion) and finish it. It is closer to 60% true completion — partial counts for most collectibles — and nothing on it is missable. The platinum pops the moment this gold does.', trophies: [14, 1] },
];

const params = new URLSearchParams(location.search);
const rows = document.getElementById('rows');
const empty = document.getElementById('empty');
const showing = document.getElementById('showing');
const searchInput = document.getElementById('search');
const kindSelect = document.getElementById('kind');
const gradeSelect = document.getElementById('grade');
const hideEarnedBox = document.getElementById('hideEarned');
const spoilerBox = document.getElementById('spoiler');

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
if (params.get('earned')) {
  for (const id of params.get('earned').split(',')) earned.add(Number(id));
}
let spoiler = localStorage.getItem(SPOILER_KEY) === '1' || params.get('spoiler') === '1';
if (params.get('kind')) kindSelect.value = params.get('kind');
if (params.get('grade')) gradeSelect.value = params.get('grade');
if (params.get('search')) searchInput.value = params.get('search');
spoilerBox.checked = spoiler;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const KIND_LABELS = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function renderRoadmap() {
  const stages = document.getElementById('stages');
  for (const stage of ROADMAP) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const p = document.createElement('p');
    p.textContent = stage.text;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    const earnedInStage = stage.trophies.filter((id) => earned.has(id)).length;
    names.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = `${earnedInStage}/${stage.trophies.length} earned — `;
    names.append(b);
    names.append(stage.trophies.map((id) => byId.get(id)?.name ?? `#${id}`).join(' · '));
    li.append(h, p, names);
    stages.append(li);
  }
}

function renderMissable() {
  const list = document.getElementById('missableList');
  const missable = trophies.filter((t) => t.missable);
  if (!missable.length) {
    const li = document.createElement('li');
    li.textContent = 'No trophy in this list is missable.';
    list.append(li);
    return;
  }
  for (const t of missable) {
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = t.name;
    li.append(b, ` — ${t.missable_note || t.description}`);
    list.append(li);
  }
}

function trophyIsHidden(t) {
  // Story trophies stay hidden in spoiler-free mode until earned.
  return spoiler && t.hidden && !earned.has(t.id);
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const kind = kindSelect.value;
  const grade = gradeSelect.value;
  const hideEarned = hideEarnedBox.checked;
  rows.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (grade !== 'all' && t.grade !== grade) continue;
    if (kind !== 'all' && !t.kind.includes(kind)) continue;
    if (hideEarned && earned.has(t.id)) continue;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) continue;
    shown += 1;
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    li.id = `trophy-${t.id}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      save();
      render();
    });
    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const h = document.createElement('h3');
    if (trophyIsHidden(t)) {
      h.textContent = 'Hidden trophy — earn it to reveal';
      h.className = 'hidden-name';
    } else {
      h.textContent = t.name;
    }
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = t.grade;
    head.append(h, badge);
    for (const k of t.kind) {
      const tag = document.createElement('span');
      tag.className = 'tag' + (k === 'missable' ? ' missable' : '');
      tag.textContent = KIND_LABELS[k] ?? k;
      head.append(tag);
    }
    if (t.hidden) {
      const tag = document.createElement('span');
      tag.className = 'tag hidden';
      tag.textContent = 'Hidden on PS5';
      head.append(tag);
    }
    if (t.missable) {
      const tag = document.createElement('span');
      tag.className = 'tag missable';
      tag.textContent = '⚠ Missable';
      head.append(tag);
    }
    body.append(head);
    const official = document.createElement('p');
    official.className = 'official';
    official.textContent = trophyIsHidden(t)
      ? 'Official description hidden until earned (spoiler-free mode).'
      : `“${t.description}” — official PlayStation description.`;
    body.append(official);
    if (!trophyIsHidden(t)) {
      const guide = document.createElement('p');
      guide.className = 'guide';
      const label = document.createElement('strong');
      label.textContent = 'How to get it: ';
      guide.append(label, t.guide);
      body.append(guide);
      if (t.missable_note) {
        const warn = document.createElement('p');
        warn.className = 'missable-note';
        warn.textContent = `⚠ Missable: ${t.missable_note}`;
        body.append(warn);
      }
      const sources = document.createElement('p');
      sources.className = 'sources';
      sources.textContent = 'Sources: ';
      t.sources.forEach((s, i) => {
        if (i) sources.append(' · ');
        const a = document.createElement('a');
        a.href = s.url;
        a.textContent = s.name;
        a.target = '_blank';
        a.rel = 'noopener';
        sources.append(a);
      });
      body.append(sources);
    }
    li.append(box, body);
    rows.append(li);
  }
  empty.hidden = shown !== 0;
  showing.textContent = `Showing ${shown} of ${trophies.length} trophies` +
    (kind === 'online' ? ' — there are no online trophies; all 55 are single-player.' : '');
  const total = trophies.length;
  const n = earned.size;
  document.getElementById('earnedCount').textContent = n;
  document.getElementById('toolbarProgress').textContent = `${n} / ${total} earned`;
  document.getElementById('progressFill').style.width = `${Math.round((n / total) * 100)}%`;
  document.getElementById('progressText').textContent =
    `${n} of ${total} earned · ${Math.round((n / total) * 100)}% to platinum`;
  const counts = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${earned.size && trophies.filter((t) => t.grade === g && earned.has(t.id)).length}/${trophies.filter((t) => t.grade === g).length} ${g}`)
    .join(' · ');
  document.getElementById('gradeCounts').innerHTML = '';
  document.getElementById('gradeCounts').textContent = counts;
}

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(ids.filter((id) => byId.has(Number(id))).map(Number));
    earned = valid;
    save();
    render();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
});
spoilerBox.addEventListener('change', () => {
  spoiler = spoilerBox.checked;
  localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
  render();
});
for (const el of [searchInput, kindSelect, gradeSelect, hideEarnedBox]) {
  el.addEventListener('input', render);
}

renderRoadmap();
renderMissable();
render();

const focus = params.get('focus');
if (focus) {
  const target = focus === 'roadmap' ? document.getElementById('roadmap')
    : focus === 'missable' ? document.getElementById('missableBox')
    : document.getElementById(focus);
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo(0, top);
  }
}
