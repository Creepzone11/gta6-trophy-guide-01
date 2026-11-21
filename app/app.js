// Leonida Trophy Guide — offline tracker for the 55 GTA VI trophies on PS5.
// The app loads app/data/trophies.json (a local file, never the network),
// renders the platinum roadmap strip, the full roadmap, the missable list and
// the checklist, and saves progress in localStorage. Export downloads the
// progress as JSON; import reads it back. Query parameters (for linking to a
// view, and for screenshots):
//   ?spoiler=1  spoiler-free mode on   ?kind=story|missable|collectibles|activities|online
//   ?grade=bronze|silver|gold|platinum ?search=text   ?earned=2,3,8  pre-tick trophies
//   ?focus=roadmap|missable|trophy-<id>|strip  scroll that part into view on load
//   ?detail=<id>  open the per-trophy detail panel on load
const CHECKLIST_KEY = 'gta6-trophy-checklist';
const SPOILER_KEY = 'gta6-trophy-spoiler';

// The seven roadmap stages, built from the official trophy descriptions:
// which story chapters and missions, which collectibles and counts, in order.
const ROADMAP = [
  { n: 1, short: 'Story, Ch. 1–2', title: 'Stage 1 — Play the story, Chapters 1–2', text: 'Finish the opening missions and Chapters 1 and 2. Do the Chapter 1 balcony meditation with Lucia before the chapter ends (see the missable warning below). Scan vehicles and study animals as you go — the counts already bank toward later trophies.', trophies: [2, 3, 4, 8, 28] },
  { n: 2, short: 'Story, Ch. 3–5', title: 'Stage 2 — Chapters 3–5 and the finale', text: 'Play through Chapters 3 and 4 to the final mission. Every chapter and mission trophy here is automatic story progress and cannot be missed.', trophies: [5, 6, 7, 9, 10, 11, 12, 13] },
  { n: 3, short: 'Side characters', title: 'Stage 3 — Side characters and strangers', text: 'Finish the optional questlines for Andy, Kenton, Billy, Randy, Tyrone and Bret, and complete 8 Strangers & Freaks strands. Note: only Kirk, Kyle, Yago and Pilot Pete count toward Strangers & Freaks — the named characters above have their own trophies instead.', trophies: [22, 23, 24, 25, 26, 27, 29] },
  { n: 4, short: 'Activities', title: 'Stage 4 — Activities and challenges', text: 'Try all 9 activity types, win races and drone races, gold every shooting range, finish an arcade game, beat Cal at fishing and complete 50 of the 80 challenges (70 for the 100% checklist).', trophies: [15, 16, 17, 18, 19, 20, 21, 32] },
  { n: 5, short: 'Collectibles', title: 'Stage 5 — Collectibles and exploration', text: 'Complete 3 of the 18 card sets, scan 100 WAiNK locations, discover 100 vehicles and unfog the whole map of Leonida by plane.', trophies: [30, 31, 35, 42] },
  { n: 6, short: 'Crime & money', title: 'Stage 6 — Crime, partners and money', text: 'Partner robberies, bank vaults, armored trucks, gang operations, the airport plane and the tank, plus the money trophies: launder $250,000 in marked bills, spend $100,000, buy all 8 garages and register 10 vehicles.', trophies: [33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55] },
  { n: 7, short: '100% + Platinum', title: 'Stage 7 — 100% Completion, then platinum', text: 'After the credits, open the 100% checklist (Progress, then Stats, then 100% Completion) and finish it. It is closer to 60% true completion — partial counts for most collectibles — and nothing on it is missable. The platinum pops the moment this gold does.', trophies: [14, 1] },
];

const params = new URLSearchParams(location.search);
const rows = document.getElementById('rows');
const empty = document.getElementById('empty');
const showing = document.getElementById('showing');
const searchInput = document.getElementById('search');
const gradeSelect = document.getElementById('grade');
const hideEarnedBox = document.getElementById('hideEarned');
const spoilerBox = document.getElementById('spoiler');
const chipButtons = [...document.querySelectorAll('#chips .chip')];
const overlay = document.getElementById('detailOverlay');
const detailBody = document.getElementById('detailBody');

// Category filter chips: a set of active kinds (empty = all). Clicking a chip
// toggles it; "All" clears the set. ?kind=<kind> pre-activates one chip.
const activeKinds = new Set();
function syncChips() {
  for (const b of chipButtons) {
    const k = b.dataset.kind;
    b.classList.toggle('active', k === 'all' ? activeKinds.size === 0 : activeKinds.has(k));
    b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
  }
}
for (const b of chipButtons) {
  b.addEventListener('click', () => {
    const k = b.dataset.kind;
    if (k === 'all') activeKinds.clear();
    else if (activeKinds.has(k)) activeKinds.delete(k);
    else activeKinds.add(k);
    syncChips();
    render();
  });
}

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? '[]')); } catch { earned = new Set(); }
if (params.get('earned')) {
  for (const id of params.get('earned').split(',')) earned.add(Number(id));
}
let spoiler = localStorage.getItem(SPOILER_KEY) === '1' || params.get('spoiler') === '1';
if (params.get('kind')) {
  const k = params.get('kind');
  if (['story', 'strangers', 'crime', 'activities', 'collectibles', 'money', 'combat', 'secret', 'missable'].includes(k)) activeKinds.add(k);
}
if (params.get('grade')) gradeSelect.value = params.get('grade');
if (params.get('search')) searchInput.value = params.get('search');
spoilerBox.checked = spoiler;
syncChips();

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const KIND_LABELS = { story: 'Story', strangers: 'Strangers', crime: 'Crime', activities: 'Activities', collectibles: 'Collectibles', money: 'Money', combat: 'Combat', secret: 'Secret', missable: 'Missable', online: 'Online' };

// The per-trophy detail panel: official name, description, grade, a "Can it be
// missed?" flag, own-words steps and the Sources block (trophy-list sources
// first, then the guide sources). Opened by clicking a trophy name.
function listSources(t) {
  return t.sources.filter((s) => /PlayStation|Exophase|PSNProfiles/.test(s.name));
}
function guideSources(t) {
  return t.sources.filter((s) => !/PlayStation|Exophase|PSNProfiles/.test(s.name));
}
function sourceLinks(sources) {
  const p = document.createElement('p');
  p.className = 'detail-sources';
  p.textContent = '';
  sources.forEach((s, i) => {
    if (i) p.append(' · ');
    const a = document.createElement('a');
    a.href = s.url;
    a.textContent = s.name;
    a.target = '_blank';
    a.rel = 'noopener';
    p.append(a);
  });
  return p;
}
function openDetail(id) {
  const t = byId.get(Number(id));
  if (!t) return;
  detailBody.replaceChildren();
  const head = document.createElement('div');
  head.className = 'detail-head';
  const h = document.createElement('h2');
  h.id = 'detailName';
  h.textContent = trophyHidden(t) ? 'Hidden trophy — earn it to reveal' : t.name;
  const badge = document.createElement('span');
  badge.className = `badge ${t.grade}`;
  badge.textContent = t.grade;
  head.append(h, badge);
  detailBody.append(head);
  const stage = ROADMAP.find((s) => s.trophies.includes(t.id));
  const meta = document.createElement('p');
  meta.className = 'detail-meta';
  meta.textContent = (stage ? `Roadmap stage ${stage.n} — ${stage.short} · ` : '') +
    `Trophy ${t.id} of 55 · ${t.kind.map((k) => KIND_LABELS[k] ?? k).join(' · ') || 'Platinum'}`;
  detailBody.append(meta);
  const official = document.createElement('p');
  official.className = 'detail-official';
  official.textContent = trophyHidden(t)
    ? 'Official description hidden until earned (spoiler-free mode).'
    : `“${t.description}” — official PlayStation description.`;
  detailBody.append(official);
  if (!trophyHidden(t)) {
    const miss = document.createElement('p');
    miss.className = 'detail-missable';
    miss.textContent = t.missable
      ? `Can it be missed? YES — ${t.missable_note || t.description}`
      : 'Can it be missed? No — this trophy can be earned after the story in free-roam.';
    detailBody.append(miss);
    const guide = document.createElement('p');
    guide.className = 'detail-guide';
    const label = document.createElement('strong');
    label.textContent = 'How to get it: ';
    guide.append(label, t.guide);
    detailBody.append(guide);
    if (t.unverified) {
      const own = document.createElement('p');
      own.className = 'own-advice';
      own.textContent = 'Own advice — not yet checked in the game. The exact trigger is still unconfirmed.';
      detailBody.append(own);
    }
    const listLabel = document.createElement('p');
    listLabel.className = 'detail-sources-label';
    listLabel.textContent = 'Sources — trophy list (name, description, grade):';
    detailBody.append(listLabel, sourceLinks(listSources(t)));
    const guideLabel = document.createElement('p');
    guideLabel.className = 'detail-sources-label';
    guideLabel.textContent = 'Sources — guide:';
    detailBody.append(guideLabel, sourceLinks(guideSources(t)));
    const earn = document.createElement('label');
    earn.className = 'detail-earned';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.id);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveProgress();
      render();
    });
    earn.append(box, ' Mark as earned');
    detailBody.append(earn);
  }
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeDetail() {
  overlay.hidden = true;
  document.body.style.overflow = '';
}
document.getElementById('detailClose').addEventListener('click', closeDetail);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDetail(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) closeDetail(); });

function saveProgress() {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function stageEarned(stage) {
  return stage.trophies.filter((id) => earned.has(id)).length;
}

// The platinum roadmap strip: the whole 7-stage road to the platinum as one
// compact band on the cover, with a live earned/total count per stage.
function renderStrip() {
  const list = document.getElementById('stripStages');
  list.replaceChildren();
  for (const stage of ROADMAP) {
    const li = document.createElement('li');
    const got = stageEarned(stage);
    li.className = 'strip-stage' + (got === stage.trophies.length ? ' done' : '');
    const num = document.createElement('span');
    num.className = 'strip-num';
    num.textContent = stage.n;
    const label = document.createElement('span');
    label.className = 'strip-label';
    label.textContent = stage.short;
    const count = document.createElement('span');
    count.className = 'strip-count';
    count.textContent = `${got}/${stage.trophies.length}`;
    li.append(num, label, count);
    list.append(li);
  }
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
    const b = document.createElement('b');
    b.textContent = `${stageEarned(stage)}/${stage.trophies.length} earned — `;
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

function trophyHidden(t) {
  // Story trophies stay hidden in spoiler-free mode until earned.
  return spoiler && t.hidden && !earned.has(t.id);
}

function updateProgress() {
  const total = trophies.length;
  const n = earned.size;
  document.getElementById('earnedCount').textContent = n;
  document.getElementById('toolbarProgress').textContent = `${n} / ${total} earned`;
  document.getElementById('progressFill').style.width = `${Math.round((n / total) * 100)}%`;
  document.getElementById('progressText').textContent =
    `${n} of ${total} earned · ${Math.round((n / total) * 100)}% to platinum`;
  const counts = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${trophies.filter((t) => t.grade === g && earned.has(t.id)).length}/${trophies.filter((t) => t.grade === g).length} ${g}`)
    .join(' · ');
  document.getElementById('gradeCounts').textContent = counts;
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const grade = gradeSelect.value;
  const hideEarned = hideEarnedBox.checked;
  rows.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (grade !== 'all' && t.grade !== grade) continue;
    if (activeKinds.size && ![...activeKinds].some((k) => t.kind.includes(k))) continue;
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
      saveProgress();
      render();
    });
    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const nameBtn = document.createElement('button');
    nameBtn.type = 'button';
    nameBtn.className = 'trophy-name';
    nameBtn.title = 'Open details';
    if (trophyHidden(t)) {
      nameBtn.textContent = 'Hidden trophy — earn it to reveal';
      nameBtn.className += ' hidden-name';
    } else {
      nameBtn.textContent = t.name;
    }
    nameBtn.addEventListener('click', () => openDetail(t.id));
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = t.grade;
    head.append(nameBtn, badge);
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
    official.textContent = trophyHidden(t)
      ? 'Official description hidden until earned (spoiler-free mode).'
      : `“${t.description}” — official PlayStation description.`;
    body.append(official);
    if (!trophyHidden(t)) {
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
      if (t.unverified) {
        const own = document.createElement('p');
        own.className = 'own-advice';
        own.textContent = 'Own advice — not yet checked in the game. The exact trigger is still unconfirmed.';
        body.append(own);
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
  const kindLabel = activeKinds.size
    ? ' — ' + [...activeKinds].map((k) => KIND_LABELS[k] ?? k).join(', ')
    : '';
  showing.textContent = `Showing ${shown} of ${trophies.length} trophies${kindLabel}`;
  updateProgress();
  renderStrip();
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
    saveProgress();
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
for (const el of [searchInput, gradeSelect, hideEarnedBox]) {
  el.addEventListener('input', render);
}

renderRoadmap();
renderMissable();
render();

const detailId = params.get('detail');
if (detailId) openDetail(detailId);

const focus = params.get('focus');
if (focus) {
  const target = focus === 'roadmap' ? document.getElementById('roadmap')
    : focus === 'missable' ? document.getElementById('missableBox')
    : focus === 'strip' ? document.getElementById('platinumStrip')
    : document.getElementById(focus);
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo(0, top);
  }
}
