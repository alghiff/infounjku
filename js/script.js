/* ══════════════════════════════════════════════════════════
   INFOUNJKU — PRODUCTION SCRIPT v12
   + share pakai logo SVG asli aplikasi
   + hapus preview link di share sheet
   + tombol "Reminder" & "Share" (tanpa H-1 / Bebas)
   + modal detail compact di HP
   + banner install PWA bottom-sheet rapi (floating, di luar form)
   + bintang hero inline (posisi konsisten)
   + anti info-leak di toast durasi custom
   ══════════════════════════════════════════════════════════ */

const SUPABASE_URL = 'https://ntleoqyavsdhfmamuewe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bGVvcXlhdnNkaGZtYW11ZXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MDM5ODksImV4cCI6MjEwNzM3OTk4OX0.WXilYHDb4TXZcYh-p9NNeqGXu5dQYFFOlqYqiV4OAlQ';
const HEADERS = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` };

let JOBS = [];
let EVENTS = [];
const grid = document.getElementById('jobsGrid');
const rail = document.getElementById('igRail');
const agendaList = document.getElementById('agendaList');
const now = () => Date.now();
const MONTHS = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'];
const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = u => /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}

function handleHashRoute(){
  const m = location.hash.match(/^#job-(\d+)$/);
  if (m) {
    const j = JOBS.find(x => x.id === +m[1]);
    if (j) { openDetail(j, true); return true; }
  }
  return false;
}
window.addEventListener('hashchange', () => handleHashRoute());

(function injectCSS(){
  const st = document.createElement('style');
  st.textContent = `
  .ticker{overflow:hidden}
  .ticker__track{display:flex;align-items:center;width:max-content;animation:tickerScroll 45s linear infinite;will-change:transform;transition:opacity .4s ease}
  .ticker__track.fade{opacity:0}
  .ticker:hover .ticker__track{animation-play-state:paused}
  @keyframes tickerScroll{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
  .ticker__group{display:flex;align-items:center;gap:2.4rem;padding-right:2.4rem;flex:none}
  .modal{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(23,21,18,.55);backdrop-filter:blur(3px);opacity:0;pointer-events:none;transition:opacity .25s ease}
  .modal.open{opacity:1;pointer-events:auto}
  .modal__card{position:relative;background:var(--card);border:2.5px solid var(--ink);box-shadow:10px 10px 0 var(--ink);max-width:660px;width:100%;max-height:88vh;overflow:auto;padding:36px 30px 30px;transform:translateY(16px) rotate(-.6deg);transition:transform .3s cubic-bezier(.2,.9,.3,1.15)}
  .modal.open .modal__card{transform:translateY(0) rotate(0)}
  .modal__card .tape{position:absolute;top:-13px;left:50%;transform:translateX(-50%) rotate(-2deg);width:120px;height:26px;background:var(--lime);border:2px solid var(--ink)}
  .modal__close{position:absolute;top:12px;right:12px;border:2px solid var(--ink);background:var(--paper);width:36px;height:36px;font-weight:800;box-shadow:3px 3px 0 var(--ink);transition:.15s;z-index:2}
  .modal__close:hover{background:var(--red);color:#fff;transform:rotate(90deg)}
  .modal__card h2{font-family:var(--display);font-weight:800;font-size:1.6rem;line-height:1.1;text-transform:uppercase;margin:8px 0 6px}
  .dt__org{font-weight:700;font-size:.92rem;margin-bottom:4px}
  .dt__cdwrap{background:var(--ink);color:var(--yellow);padding:14px 18px;margin:14px 0 12px;display:inline-block;transform:rotate(-1deg)}
  .dt__cdwrap .big-cd{font-family:var(--mono);font-weight:700;font-size:1.45rem;letter-spacing:.06em}
  .dt__cdwrap .cd-label{display:block;font-family:var(--mono);font-size:9px;letter-spacing:.18em;color:var(--paper);opacity:.75;margin-top:4px}
  .dt__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0}
  .dt__grid div{border:2px dashed rgba(23,21,18,.45);padding:10px 12px;background:var(--paper)}
  .dt__grid span{display:block;font-family:var(--mono);font-size:9px;letter-spacing:.16em;color:var(--ink-soft);margin-bottom:4px}
  .dt__grid b{font-size:.8rem;line-height:1.3}
  .dt__steps{border:2.5px solid var(--ink);background:var(--lime);padding:14px 16px;margin:14px 0;transform:rotate(.4deg)}
  .dt__steps ol{margin:8px 0 0 18px;font-size:.86rem;font-weight:600}
  .dt__steps li{margin:4px 0}
  .dt__actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
  .share-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px}
  .share-grid button{border:2.5px solid var(--ink);background:var(--paper);padding:12px 6px;font-weight:800;font-size:.7rem;box-shadow:4px 4px 0 var(--ink);transition:.15s;display:flex;flex-direction:column;align-items:center;gap:6px}
  .share-grid .ic{display:flex;align-items:center;justify-content:center;width:32px;height:32px;margin:0 auto}
  .share-grid .ic svg{width:26px;height:26px;display:block}
  .share-grid button:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 var(--ink);background:var(--yellow)}
  /* BANNER INSTALL PWA — BOTTOM SHEET RAPI HP & DESKTOP (floating, di luar form) */
  #installBanner{position:fixed;left:12px;right:12px;bottom:12px;margin:0 auto;max-width:520px;z-index:130;background:var(--card);border:2.5px solid var(--ink);box-shadow:8px 8px 0 var(--blue);padding:14px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 12px;transform:translateY(160%);visibility:hidden;transition:transform .35s cubic-bezier(.2,.7,.2,1),visibility .35s}
  #installBanner.show{transform:translateY(0);visibility:visible}
  #installBanner .ib__ic{font-size:1.6rem;flex-shrink:0}
  #installBanner .ib__txt{font-size:.85rem;font-weight:800;flex:1 1 180px;min-width:0}
  #installBanner .ib__txt small{display:block;font-weight:500;color:var(--ink-soft);font-size:.72rem}
  #installBanner .ib__yes,#installBanner .ib__no{flex:0 0 auto}
  @media(max-width:560px){
    .modal{padding:10px}
    .modal__card{padding:26px 14px 20px;max-height:92vh}
    .modal__card h2{font-size:1.25rem}
    .dt__cdwrap{padding:10px 12px;margin:10px 0 8px}
    .dt__cdwrap .big-cd{font-size:1.05rem}
    .dt__cdwrap .cd-label{font-size:8px}
    .dt__grid{grid-template-columns:1fr 1fr;gap:8px}
    .dt__grid div{padding:8px}
    .dt__grid b{font-size:.72rem}
    .dt__steps{padding:12px}
    .dt__steps ol{font-size:.8rem;margin-left:16px}
    .dt__actions{gap:8px}
    .dt__actions .btn{flex:1 1 46%;justify-content:center;padding:12px 10px;font-size:.8rem}
    .share-grid{grid-template-columns:repeat(3,1fr)}
  }
  @media(max-width:520px){
    #installBanner{left:10px;right:10px;bottom:10px}
    #installBanner .ib__yes,#installBanner .ib__no{flex:1 1 40%;justify-content:center}
  }
  `;
  document.head.appendChild(st);
})();

const loaderStart = Date.now();
function hideLoader(){
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('done')) return;
  const wait = Math.max(0, 900 - (Date.now() - loaderStart));
  setTimeout(() => { loader.classList.add('done'); setTimeout(() => loader.remove(), 600); }, wait);
}
window.addEventListener('load', hideLoader);
setTimeout(hideLoader, 3000);

function fmtShort(ms){
  const d = Math.floor(ms / 864e5);
  if (d >= 1) return d + ' hari';
  const h = Math.floor(ms / 36e5);
  if (h >= 1) return h + ' jam';
  return Math.max(1, Math.floor(ms / 6e4)) + ' menit';
}
function fmtCd(ms){
  if (ms <= 0) return 'DITUTUP';
  const d = Math.floor(ms/864e5), h = Math.floor(ms%864e5/36e5), m = Math.floor(ms%36e5/6e4), s = Math.floor(ms%6e4/1e3);
  return `${d} hr ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function fmtDateLong(ms){
  return new Date(ms).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
    + ' • ' + new Date(ms).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) + ' WIB';
}
function fmtNum(n){ return n >= 1000 ? (n/1000).toFixed(1).replace('.0','') + 'K' : n; }

function quotaPct(j){ return j.quota[1] ? j.quota[0] / j.quota[1] : 0; }
function statusOf(j){
  const left = j.deadline - now();
  const pct = quotaPct(j);
  if (left <= 0) return 'closed';
  if (pct >= 1) return 'full';
  if (left <= 3*864e5 || pct >= 0.8) return 'urgent';
  return 'open';
}
function computeHot(){
  const sorted = [...JOBS].sort((a,b) => b.clicks - a.clicks);
  const topIds = new Set(sorted.filter(j => j.clicks > 0).slice(0, 2).map(j => j.id));
  JOBS.forEach(j => { j.hot = j.clicks >= 20 || topIds.has(j.id); });
}
function jobScore(j){
  const left = j.deadline - now();
  if (left <= 0 || quotaPct(j) >= 1) return -1;
  const daysLeft = left / 864e5;
  let s = Math.max(0, 10 - daysLeft);
  if (daysLeft <= 3) s += 15;
  if (quotaPct(j) >= 0.8) s += 12;
  if (quotaPct(j) >= 0.95) s += 8;
  if (j.hot) s += 10;
  s += Math.min(10, j.clicks / 10);
  return s;
}
function pickTopJob(){
  if (!JOBS.length) return null;
  const pool = JOBS.filter(j => jobScore(j) >= 0);
  const list = pool.length ? pool : JOBS;
  return [...list].sort((a,b) => jobScore(b) - jobScore(a))[0];
}

function updateStatJobs(){
  const el = document.getElementById('statJobs');
  if (el) el.textContent = JOBS.filter(j => statusOf(j) !== 'closed' && statusOf(j) !== 'full').length;
}
function updateStatEvents(){
  const el = document.getElementById('statEvents');
  if (el) el.textContent = EVENTS.length;
}

function purgeExpired(){
  const jBefore = JOBS.length, eBefore = EVENTS.length;
  JOBS = JOBS.filter(j => j.deadline > now());
  EVENTS = EVENTS.filter(ev => ev.start.getTime() > now());
  if (JOBS.length !== jBefore || EVENTS.length !== eBefore) {
    computeHot();
    renderJobs();
    updateHeroCard();
    renderAgenda();
    renderTicker();
    updateHeroMinis();
    updateStatJobs();
    updateStatEvents();
    showToast('🧹 Lowongan/event yang udah lewat deadline otomatis disembunyiin.');
    return true;
  }
  return false;
}

let tickerSig = '';
function renderTicker(){
  const items = [];
  JOBS.filter(j => statusOf(j) === 'urgent').slice(0, 3)
    .forEach(j => items.push(`<b>HOT</b> — ${escHtml(j.title)} tutup ${fmtShort(j.deadline - now())} lagi`));
  JOBS.filter(j => statusOf(j) === 'open').slice(0, 2)
    .forEach(j => items.push(`BARU — ${escHtml(j.title)} • ${escHtml(j.org)}`));
  EVENTS.slice(0, 3)
    .forEach(ev => items.push(`EVENT — ${escHtml(ev.title)} • ${String(ev.start.getDate()).padStart(2,'0')} ${MONTHS[ev.start.getMonth()]} @ ${escHtml(ev.location)}`));
  items.push(`follow <b>@infounjku</b> biar gak FOMO`);
  if (!JOBS.length && !EVENTS.length) {
    items.length = 0;
    items.push('Belum ada info baru — pantau terus <b>@infounjku</b>');
  }
  const group = `<div class="ticker__group">${items.map(t => `<span><span class="dotp">✦</span> ${t}</span>`).join('')}</div>`;
  if (group === tickerSig) return;
  tickerSig = group;
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  track.classList.add('fade');
  setTimeout(() => {
    track.innerHTML = group + group;
    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.animationDuration = Math.max(30, items.length * 7) + 's';
    track.style.animation = '';
    track.classList.remove('fade');
  }, 220);
}

async function fetchLowongan() {
  const loadingGrid = document.getElementById('loadingGrid');
  try {
    if (JOBS.length === 0 && loadingGrid) loadingGrid.style.display = 'grid';
    
    // Tarik data manual DAN data AI sekaligus
    const [resManual, resAI] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/lowongan?select=*&order=created_at.desc`, { headers: HEADERS }),
      fetch(`${SUPABASE_URL}/rest/v1/ig_ai_scraped?select=*&kategori=eq.Open Recruitment&is_approved=eq.true`, { headers: HEADERS })
    ]);
    
    const dataManual = await resManual.json();
    const dataAI = await resAI.json();

    // Map Data Manual
    let jobsManual = dataManual.map(item => ({
      created: item.created_at ? new Date(item.created_at).getTime() : 0,
      id: item.id, code: `OPR-${String(item.id).padStart(3, '0')}`,
      org: item.org, badge: (item.category || 'umum').toUpperCase(), cat: item.category || 'umum',
      title: item.title, tags: item.tags ? String(item.tags).split(',') : ['Umum'],
      roles: item.roles || '', quota: [item.quota_filled || 0, item.quota_total || 50],
      deadline: new Date(item.deadline).getTime(), clicks: item.clicks || 0,
      link_daftar: safeUrl(item.link_daftar), src: `@${String(item.org).toLowerCase().replace(/\s/g, '')}`
    }));

    // Map Data AI (Sesuaikan ke format JOBS)
    let jobsAI = dataAI.map(item => ({
      created: new Date().getTime(), id: item.ig_media_id, code: `AI-${String(item.ig_media_id).slice(-3)}`,
      org: item.organisasi || 'Unknown', badge: 'AI SYNC', cat: (item.organisasi || 'umum').toLowerCase().includes('bem') ? 'bem' : 'umum',
      title: item.judul, tags: item.tags ? String(item.tags).split(',') : ['Info AI'],
      roles: item.role || '', quota: [0, item.kuota || 50],
      deadline: item.deadline ? new Date(item.deadline).getTime() : Date.now() + 7*864e5, 
      clicks: 0, link_daftar: safeUrl(item.link_pendaftaran), src: `@ig_target`
    }));

    // Gabungkan dan bersihkan yang udah lewat deadline
    JOBS = [...jobsManual, ...jobsAI].filter(j => j.deadline > now());
    JOBS.forEach((j, i) => { j.idx = i; });

    computeHot();
    if (loadingGrid) loadingGrid.style.display = 'none';
    renderJobs();
    updateHeroCard();
    updateStatJobs();
    renderTicker();
    updateHeroMinis();
  } catch (e) {
    console.error('Gagal narik lowongan:', e);
    if (JOBS.length === 0) {
      if (loadingGrid) loadingGrid.style.display = 'none';
      const emptyState = document.getElementById('emptyState');
      if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.querySelector('h3').textContent = 'Koneksi Terputus';
        emptyState.querySelector('p').textContent = 'Gagal memuat data dari server. Cek koneksi internet lu atau refresh halaman.';
      }
    }
  }
}

function renderJobs(){
  const loadingGrid = document.getElementById('loadingGrid');
  const jobsGrid = document.getElementById('jobsGrid');
  const emptyState = document.getElementById('emptyState');
  if (loadingGrid) loadingGrid.style.display = 'none';
  if (!JOBS.length || !grid) {
    if (jobsGrid) jobsGrid.style.display = 'none';
    if (emptyState) {
      emptyState.style.display = 'block';
      emptyState.querySelector('h3').textContent = 'Belum Ada Lowongan Aktif';
      emptyState.querySelector('p').innerHTML = 'Semua lowongan yang lewat deadline otomatis hilang. Pantau terus IG <b>@infounjku</b> buat update terbarunya!';
    }
    updateCount();
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (jobsGrid) jobsGrid.style.display = 'grid';
  grid.innerHTML = sortedJobs().map((j,i) => {
    const st = statusOf(j), pct = Math.min(100, Math.round(quotaPct(j)*100));
    const stamp = st==='full'    ? '<span class="stamp stamp--closed">KUOTA PENUH</span>'
                : st==='urgent'  ? '<span class="stamp stamp--urgent">SEGERA TUTUP</span>'
                : '<span class="stamp stamp--open">DIBUKA</span>';
    const hot = j.hot ? '<span class="stamp stamp--hot">🔥 HOT</span>' : '';
    const disabled = (st==='full') ? 'disabled' : '';
    return `<article class="job reveal in ${st==='full'?'job--closed':''}" data-id="${j.id}" data-cat="${escHtml(j.cat)}" data-deadline="${j.deadline}" data-search="${escHtml((j.title+' '+j.org+' '+j.tags.join(' ')+' '+(j.roles||'')).toLowerCase())}" style="transition-delay:${i*0.04}s">
      <div class="job__top"><span class="job__code mono">${j.code} • via ${escHtml(j.src)}</span><span class="job__stamps">${hot}${stamp}</span></div>
      <div class="job__org"><span class="mono-badge">${escHtml(j.badge)}</span>${escHtml(j.org)}</div>
      <h3>${escHtml(j.title)}</h3>
      <div class="job__tags">${j.tags.map(t=>`<span>${escHtml(t)}</span>`).join('')}</div>
      ${j.roles ? `<div class="job__roles mono">👥 DIBUTUHKAN: ${escHtml(j.roles)}</div>` : ''}
      <div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <div class="meta mono" style="font-size:11px;color:var(--ink-soft);display:flex;justify-content:space-between">
          <span>${j.quota[0]}/${j.quota[1]} pendaftar</span><span>${pct}%</span>
        </div>
      </div>
      <div class="job__deadline ${st==='urgent'?'hot':''}">⏳ <b class="cd" data-deadline="${j.deadline}">${fmtCd(j.deadline-now())}</b></div>
      <div class="job__actions">
        <button class="btn btn--sm js-apply" data-id="${j.id}" ${disabled}>${st==='full'?'Kuota Penuh':'Lamar'}</button>
        <button class="btn btn--sm btn--ghost js-detail" data-id="${j.id}">Detail</button>
        <button class="btn btn--sm btn--ghost js-remind" data-id="${j.id}" title="Ingatkan di kalender">📅</button>
        <button class="btn btn--sm btn--ghost js-share" data-id="${j.id}" title="Share">↗ Share</button>
      </div>
    </article>`;
  }).join('');
  applyFilter();
}

async function fetchEvents() {
  try {
    // Tarik data manual DAN data AI sekaligus
    const [resManual, resAI] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/events?select=*&order=event_date.asc`, { headers: HEADERS }),
      fetch(`${SUPABASE_URL}/rest/v1/ig_ai_scraped?select=*&kategori=eq.Agenda Acara&is_approved=eq.true`, { headers: HEADERS })
    ]);

    const dataManual = await resManual.json();
    const dataAI = await resAI.json();

    // Map Data Manual
    let eventsManual = dataManual.map(r => {
      const [y,m,d] = String(r.event_date).split('-').map(Number);
      const [hh,mm] = (r.event_time || '09:00').split(':').map(Number);
      return { id:r.id, title:r.title, tag:r.tag || 'EVENT', location:r.location || 'TBA', time:r.event_time || '09:00', start:new Date(y, m-1, d, hh, mm) };
    });

    // Map Data AI
    let eventsAI = dataAI.map(r => {
      // Ambil tanggal dari waktu_acara atau deadline
      const dateStr = r.waktu_acara || r.deadline || new Date().toISOString();
      const dateObj = new Date(dateStr);
      return { 
        id: r.ig_media_id, 
        title: r.judul, 
        tag: 'AGENDA AI', 
        location: r.lokasi || 'TBA', 
        time: dateObj.toLocaleTimeString('id-ID', {hour:'2-digit',minute:'2-digit'}), 
        start: dateObj 
      };
    });

    // Gabungkan, urutkan berdasarkan tanggal terdekat, buang yang lewat
    EVENTS = [...eventsManual, ...eventsAI]
      .filter(ev => ev.start.getTime() > now())
      .sort((a,b) => a.start - b.start);

    renderAgenda();
    renderTicker();
    updateStatEvents();
  } catch (e) {
    console.error('Gagal narik events:', e);
    if (!EVENTS.length && agendaList) {
      agendaList.innerHTML = `<div class="agenda-empty">🗓️ Belum ada info agenda sekarang. Coba refresh lagi ya.</div>`;
    }
  }
}

function renderAgenda(){
  if (!agendaList) return;
  const box = document.getElementById('agendaLimitBox');
  if (!EVENTS.length) {
    agendaList.innerHTML = `<div class="agenda-empty">🗓️ Belum ada info event terjadwal. Event yang udah lewat otomatis hilang — pantau terus IG <b>@infounjku</b>!</div>`;
    if (box) box.style.display = 'none';
    return;
  }
  if (box) box.style.display = '';
  agendaList.innerHTML = EVENTS.map((ev,i) => `
    <a href="${gcalEventUrl(ev)}" target="_blank" rel="noopener" class="agenda-item reveal in" style="transition-delay:${i*0.06}s" title="Klik buat masukin ke kalender lu">
      <div class="agenda-date"><b>${String(ev.start.getDate()).padStart(2,'0')}</b><span>${MONTHS[ev.start.getMonth()]}</span></div>
      <div class="agenda-info"><h4>${escHtml(ev.title)}</h4><p>📍 ${escHtml(ev.location)} • 🕐 ${escHtml(ev.time)} WIB</p></div>
      <span class="agenda-tag">${escHtml(ev.tag)}</span><span class="agenda-arrow">→</span>
    </a>`).join('');
  applyAgendaLimit();
}
let perAgenda = 6;
function applyAgendaLimit(){
  if (!agendaList) return;
  const items = agendaList.querySelectorAll('.agenda-item');
  let shown = 0;
  items.forEach(el => {
    const hide = shown >= perAgenda;
    if (!hide) shown++;
    el.classList.toggle('limit-hide', hide);
  });
  const info = document.getElementById('agendaLimitInfo');
  if (info) info.textContent = `// ${shown} dari ${items.length} agenda ditampilkan`;
}
const agendaLimitSelect = document.getElementById('agendaLimitSelect');
if (agendaLimitSelect) agendaLimitSelect.addEventListener('change', e => {
  perAgenda = e.target.value === 'all' ? Number.MAX_SAFE_INTEGER : +e.target.value;
  applyAgendaLimit();
});

async function fetchIgPosts() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ig_posts?select=*&order=ig_timestamp.desc&limit=12`, { headers: HEADERS });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    
    if (!data.length) {
      rail.innerHTML = `<div class="empty-state rail-empty"><div class="empty-icon">📸</div><h3>Belum Ada Info</h3><p>Post IG organisasi bakal muncul otomatis di sini begitu ada yang publish.</p></div>`;
      return;
    }
    
    rail.innerHTML = data.map(p => {
      const mc = /^m[1-6]$/.test(p.media_class || '') ? p.media_class : 'm1';
      const cap = escHtml(p.caption || '').replace(/#([\w\d_]+)/g, '<b>#$1</b>');
      
      // 1. Ambil URL gambar (media_url dari Supabase Storage)
      const imgSrc = p.media_url; 
      
      // 2. Render Gambar. Kalau gak ada gambar, baru tampilin teks.
      const mediaHtml = imgSrc
        ? `<img src="${escHtml(imgSrc)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
        : `<span class="poster">${escHtml(p.poster_text || '📷')}</span>`;

      const permalink = p.permalink || '#';
      const dateLabel = p.posted_label || (p.ig_timestamp ? new Date(p.ig_timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

      // 3. Bungkus dengan <a> biar bisa diklik ke IG
      return `<article class="ig-card reveal in">
        <a class="ig-media ${mc}" href="${escHtml(permalink)}" target="_blank" rel="noopener">
          ${mediaHtml}
          <span class="auto-badge">AUTO • SYNC</span>
        </a>
        <div class="ig-body">
          <div class="ig-user"><span class="av">IU</span>@infounjku<time>${escHtml(dateLabel)}</time></div>
          <p>${cap}</p>
          <div class="ig-meta"><span>❤ ${fmtNum(p.likes)}</span><span>💬 ${fmtNum(p.comments)}</span><span>↗ ${fmtNum(p.shares)}</span></div>
        </div>
      </article>`;
    }).join('');
    
    rail.dataset.loaded = '1';
  } catch (e) {
    console.error('Gagal narik IG feed:', e);
    if (rail.dataset.loaded !== '1') {
      rail.innerHTML = `<div class="empty-state rail-empty"><div class="empty-icon">📸</div><h3>Belum Ada Info</h3><p>Gagal memuat feed sekarang. Data bakal muncul otomatis begitu koneksi pulih.</p></div>`;
    }
  }
}

function updateHeroCard(){
  const heroCard = document.querySelector('.pinned--main');
  if (!heroCard) return;
  const top = pickTopJob();
  if (!top) {
    heroCard.innerHTML = `
      <span class="tape"></span>
      <span class="urgent-tag">✨ BELUM ADA LOWONGAN AKTIF</span>
      <h3>Lowongan baru segera hadir</h3>
      <p class="org">infounjku • sinkron otomatis</p>
      <div class="big-cd" id="heroCd">--:--:--:--</div>
      <span class="cd-label">HARI : JAM : MENIT : DETIK</span>
      <div class="bar"><i style="width:0%"></i></div>
      <div class="meta"><span>-/- pendaftar</span><span>via @infounjku</span></div>
      <div class="pinned__actions"><button class="btn" disabled>Gas Daftar →</button></div>`;
    return;
  }
  const pct = Math.min(100, Math.round(quotaPct(top)*100));
  const st = statusOf(top);
  const label = top.hot ? '🔥 HOT & SEGERA TUTUP' : (st==='urgent' ? '🔥 URGENT — SEGERA TUTUP' : '✨ REKOMENDASI UNTUK LU');
  heroCard.innerHTML = `
    <span class="tape"></span>
    <span class="urgent-tag">${label}</span>
    <h3>${escHtml(top.title)}</h3>
    <p class="org">${escHtml(top.org)} • ${escHtml(top.tags[0])}</p>
    <div class="big-cd" id="heroCd">--:--:--:--</div>
    <span class="cd-label">HARI : JAM : MENIT : DETIK</span>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="meta"><span>${top.quota[0]}/${top.quota[1]} pendaftar</span><span>via ${escHtml(top.src)}</span></div>
    <div class="pinned__actions">
      <button class="btn js-apply" data-id="${top.id}">Gas Daftar →</button>
      <button class="btn btn--ghost js-remind" data-id="${top.id}" title="Ingatkan di kalender">📅</button>
      <button class="btn btn--ghost js-share" data-id="${top.id}" title="Share">↗</button>
    </div>`;
}
function updateHeroMinis(){
  const a = document.getElementById('miniA');
  const b = document.getElementById('miniB');
  if (a) {
    const week = JOBS.filter(j => { const l = j.deadline - now(); return l > 0 && l <= 7*864e5; }).length;
    a.textContent = week > 0 ? `🔔 ${week} lowongan tutup minggu ini` : `✅ Aman! gak ada deadline minggu ini`;
  }
  if (b) {
    const fresh = JOBS.filter(j => j.created && (now() - j.created) <= 7*864e5);
    if (fresh.length > 0) b.textContent = `✨ ${fresh.length} lowongan baru minggu ini`;
    else if (JOBS.length > 0) b.textContent = `✨ ${JOBS.length} lowongan aktif sekarang`;
    else b.textContent = `✨ Lowongan baru segera hadir`;
  }
}

setInterval(() => {
  purgeExpired();
  document.querySelectorAll('.cd').forEach(el => { el.textContent = fmtCd(+el.dataset.deadline - now()); });
  const heroCd = document.getElementById('heroCd');
  const top = pickTopJob();
  if (heroCd && top) {
    const ms = Math.max(0, top.deadline - now());
    const d = Math.floor(ms/864e5), h = Math.floor(ms%864e5/36e5), m = Math.floor(ms%36e5/6e4), s = Math.floor(ms%6e4/1e3);
    heroCd.textContent = `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
}, 1000);

function icsStamp(d){ return d.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'; }
function gcalUrl(j){
  const s = new Date(j.deadline - 864e5); s.setHours(9,0,0,0);
  const e = new Date(s.getTime() + 36e5);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('⏰ Reminder: Deadline ' + j.title)
    + '&dates=' + icsStamp(s) + '/' + icsStamp(e)
    + '&details=' + encodeURIComponent('Deadline pendaftaran ' + j.org + '. Kuota tersisa: ' + Math.max(0, j.quota[1]-j.quota[0]) + ' slot. Sumber: infounjku')
    + '&location=' + encodeURIComponent('Kampus UNJKU / Online');
}
function gcalEventUrl(ev){
  const e = new Date(ev.start.getTime() + 2*36e5);
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent('🎪 ' + ev.title)
    + '&dates=' + icsStamp(ev.start) + '/' + icsStamp(e)
    + '&location=' + encodeURIComponent(ev.location)
    + '&details=' + encodeURIComponent('Event kampus via infounjku');
}

async function bumpClicks(id){
  if (!id || isNaN(id)) return false;
  const key = 'iu_ck_' + id;
  if (sessionStorage.getItem(key)) return false;
  let sess = sessionStorage.getItem('iu_session');
  if (!sess) { sess = 's_' + Math.random().toString(36).slice(2, 12); sessionStorage.setItem('iu_session', sess); }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_clicks`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_id: id, p_session: sess })
    });
    const data = await res.json().catch(() => ({}));
    if (data && data.ok === false) { showToast('⏱ Bentar bro, kebanyakan klik.'); return false; }
    sessionStorage.setItem(key, '1');
    const j = JOBS.find(x => x.id === id);
    if (j) j.clicks++;
    return true;
  } catch(e){ return false; }
}

let curFilter = 'all', curSearch = '', curSort = 'newest', curDeadline = 'any';
let pendFilter = 'all', pendDeadline = 'any', pendSort = 'newest';
const DL_RANGE = { '3d': 3, 'week': 7, 'month': 30 };

function sortedJobs(){
  const list = [...JOBS];
  switch (curSort) {
    case 'deadline': list.sort((a,b) => a.deadline - b.deadline); break;
    case 'popular':  list.sort((a,b) => b.clicks - a.clicks); break;
    case 'quota':    list.sort((a,b) => quotaPct(b) - quotaPct(a)); break;
    default:         list.sort((a,b) => a.idx - b.idx);
  }
  return list;
}
function updateCount(){
  const visible = [...document.querySelectorAll('.job')].filter(j => !j.classList.contains('hide') && !j.classList.contains('limit-hide')).length;
  const cl = document.getElementById('countLine');
  if (cl) cl.textContent = `// menampilkan ${visible} dari ${JOBS.length} lowongan`;
  const li = document.getElementById('limitInfo');
  if (li) {
    const matched = [...document.querySelectorAll('.job')].filter(j => !j.classList.contains('hide')).length;
    li.textContent = `// ${visible} dari ${matched} lowongan cocok ditampilkan`;
  }
}
function applyFilter(){
  document.querySelectorAll('.job').forEach(el => {
    const okCat = curFilter === 'all' || el.dataset.cat === curFilter;
    const okSearch = el.dataset.search.includes(curSearch);
    let okDl = true;
    if (curDeadline !== 'any') {
      const left = +el.dataset.deadline - now();
      okDl = left > 0 && left <= (DL_RANGE[curDeadline] || 0) * 864e5;
    }
    el.classList.toggle('hide', !(okCat && okSearch && okDl));
  });
  applyLimit();
}
let perPage = 6;
function applyLimit(){
  let shown = 0;
  document.querySelectorAll('.job').forEach(el => {
    let limitHide = false;
    if (!el.classList.contains('hide')) {
      if (shown >= perPage) limitHide = true; else shown++;
    }
    el.classList.toggle('limit-hide', limitHide);
  });
  updateCount();
}
const limitSelect = document.getElementById('limitSelect');
if (limitSelect) limitSelect.addEventListener('change', e => {
  perPage = e.target.value === 'all' ? Number.MAX_SAFE_INTEGER : +e.target.value;
  applyLimit();
});
function previewCount(){
  return JOBS.filter(j => {
    const okCat = pendFilter === 'all' || j.cat === pendFilter;
    const okSearch = (j.title + ' ' + j.org + ' ' + j.tags.join(' ') + ' ' + (j.roles||'')).toLowerCase().includes(curSearch);
    let okDl = true;
    if (pendDeadline !== 'any') {
      const left = j.deadline - now();
      okDl = left > 0 && left <= (DL_RANGE[pendDeadline] || 0) * 864e5;
    }
    return okCat && okSearch && okDl;
  }).length;
}
function updatePreview(){
  const fc = document.getElementById('filterCount');
  if (fc) fc.textContent = `${previewCount()} lowongan cocok — tekan "Selesai ✓" untuk terapkan`;
}
function syncChipUI(){
  document.querySelectorAll('#chipsRow .chip').forEach(c => c.classList.toggle('active', c.dataset.filter === pendFilter));
  document.querySelectorAll('#deadlineRow .chip').forEach(c => c.classList.toggle('active', c.dataset.deadline === pendDeadline));
  document.querySelectorAll('#sortRow .chip').forEach(c => c.classList.toggle('active', c.dataset.sort === pendSort));
}
function updateBadge(){
  let n = 0;
  if (curFilter !== 'all') n++;
  if (curDeadline !== 'any') n++;
  if (curSearch) n++;
  filterBadge.hidden = n === 0;
  filterBadge.textContent = n;
}
function commitFilters(){
  const sortChanged = pendSort !== curSort;
  curFilter = pendFilter; curDeadline = pendDeadline; curSort = pendSort;
  if (sortChanged) renderJobs(); else applyFilter();
  updateBadge();
  setFilterOpen(false);
  showToast('🎛 Filter diterapkan!');
}

const filterBox = document.getElementById('filterBox');
const filterToggle = document.getElementById('filterToggle');
const filterBadge = document.getElementById('filterBadge');
const searchClear = document.getElementById('searchClear');
const searchInput = document.getElementById('searchBox');
function setFilterOpen(open){ filterBox.classList.toggle('open', open); filterToggle.setAttribute('aria-expanded', open); }

if (filterToggle) {
  filterToggle.addEventListener('click', () => {
    const willOpen = !filterBox.classList.contains('open');
    if (willOpen) {
      pendFilter = curFilter; pendDeadline = curDeadline; pendSort = curSort;
      syncChipUI(); updatePreview();
    }
    setFilterOpen(willOpen);
  });
  document.getElementById('filterDone').addEventListener('click', commitFilters);
  document.getElementById('filterReset').addEventListener('click', () => {
    pendFilter = 'all'; pendDeadline = 'any'; pendSort = 'newest';
    syncChipUI(); updatePreview();
  });
  document.addEventListener('click', e => { if (!e.target.closest('#filterBox')) setFilterOpen(false); });
  document.querySelectorAll('#chipsRow .chip').forEach(c => c.addEventListener('click', () => { pendFilter = c.dataset.filter; syncChipUI(); updatePreview(); }));
  document.querySelectorAll('#deadlineRow .chip').forEach(c => c.addEventListener('click', () => { pendDeadline = c.dataset.deadline; syncChipUI(); updatePreview(); }));
  document.querySelectorAll('#sortRow .chip').forEach(c => c.addEventListener('click', () => { pendSort = c.dataset.sort; syncChipUI(); updatePreview(); }));
  searchInput.addEventListener('input', e => {
    curSearch = e.target.value.toLowerCase().trim();
    applyFilter(); updateBadge();
    if (filterBox.classList.contains('open')) updatePreview();
  });
  searchInput.addEventListener('focus', () => { searchClear.hidden = false; });
  searchInput.addEventListener('blur',  () => { searchClear.hidden = true; });
  searchClear.addEventListener('mousedown', e => e.preventDefault());
  searchClear.addEventListener('click', () => {
    searchInput.value = ''; curSearch = '';
    applyFilter(); updateBadge();
    if (filterBox.classList.contains('open')) updatePreview();
    searchInput.focus();
  });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { setFilterOpen(false); closeModals(); } });

function makeModal(id){
  const d = document.createElement('div');
  d.className = 'modal'; d.id = id;
  d.innerHTML = `<div class="modal__card"><span class="tape"></span><button class="modal__close" type="button" aria-label="Tutup">✕</button><div class="modal__body"></div></div>`;
  document.body.appendChild(d);
  return d;
}
const detailModal = makeModal('detailModal');
const shareModal  = makeModal('shareModal');
function openModal(m){
  m.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  const card = m.querySelector('.modal__card');
  if (card) { card.style.overscrollBehavior = 'contain'; card.scrollTop = 0; }
}
function closeModals(){
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  if (location.hash.startsWith('#job-')) history.replaceState(null, '', location.pathname + location.search);
}
[detailModal, shareModal].forEach(m => m.addEventListener('click', e => { if (e.target === m) closeModals(); }));
document.addEventListener('click', e => { if (e.target.closest('.modal__close')) closeModals(); });

function openDetail(j, skipBump){
  if (!skipBump) bumpClicks(j.id);
  const newHash = '#job-' + j.id;
  if (location.hash !== newHash) history.replaceState(null, '', newHash);
  const st = statusOf(j), pct = Math.min(100, Math.round(quotaPct(j)*100));
  const stamp = st==='full'   ? '<span class="stamp stamp--closed">KUOTA PENUH</span>'
              : st==='urgent' ? '<span class="stamp stamp--urgent">SEGERA TUTUP</span>'
              : '<span class="stamp stamp--open">DIBUKA</span>';
  const hot = j.hot ? '<span class="stamp stamp--hot">🔥 HOT</span>' : '';
  const linkBtn = j.link_daftar
    ? `<a class="btn" href="${escHtml(j.link_daftar)}" target="_blank" rel="noopener noreferrer">Gas Daftar →</a>`
    : `<button class="btn" disabled>Link belum tersedia</button>`;
  detailModal.querySelector('.modal__body').innerHTML = `
    <span class="mono-kick" style="color:var(--blue)">📄 DETAIL LOWONGAN • ${j.code}</span>
    <h2>${escHtml(j.title)}</h2>
    <p class="dt__org"><span class="mono-badge">${escHtml(j.badge)}</span> ${escHtml(j.org)} • via ${escHtml(j.src)} ${hot}${stamp}</p>
    <div class="dt__cdwrap">
      <div class="big-cd cd" data-deadline="${j.deadline}">${fmtCd(j.deadline - now())}</div>
      <span class="cd-label">SISA WAKTU — HARI : JAM : MENIT : DETIK</span>
    </div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="meta mono" style="font-size:11px;color:var(--ink-soft);display:flex;justify-content:space-between;margin-top:6px">
      <span>${j.quota[0]}/${j.quota[1]} pendaftar • sisa ${Math.max(0, j.quota[1]-j.quota[0])} slot</span><span>${pct}%</span>
    </div>
    <div class="dt__grid">
      <div><span>KODE</span><b>${j.code}</b></div>
      <div><span>KATEGORI</span><b>${escHtml(j.cat)}</b></div>
      <div><span>MINAT</span><b>${j.clicks} klik 🔥</b></div>
      <div><span>ROLE DIBUTUHKAN</span><b>${escHtml(j.roles || '—')}</b></div>
      <div><span>DEADLINE</span><b>${fmtDateLong(j.deadline)}</b></div>
      <div><span>DIPOSTING</span><b>${j.created ? new Date(j.created).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : '—'}</b></div>
    </div>
    <div class="job__tags" style="margin-bottom:4px">${j.tags.map(t=>`<span>${escHtml(t)}</span>`).join('')}</div>
    <div class="dt__steps">
      <span class="mono" style="font-size:10px;letter-spacing:.16em;font-weight:700">CARA DAFTAR VERSI INFOUNJKU ✦</span>
      <ol>
        <li>Follow <b>@infounjku</b> biar gak ketinggalan update detik terakhir.</li>
        <li>Siapin CV + portofolio paling daging versi lu.</li>
        <li>${j.link_daftar ? 'Klik <b>Gas Daftar</b> — form resmi dibuka di tab baru.' : 'Hubungi kontak organisasi buat link pendaftaran.'}</li>
        <li>Pasang <b>reminder H-1</b> di kalender biar deadline gak nyeremin diam-diam.</li>
      </ol>
    </div>
    <div class="dt__actions">
      ${linkBtn}
      <button class="btn btn--ghost js-remind" data-id="${j.id}">📅 Reminder</button>
      <button class="btn btn--ghost js-share" data-id="${j.id}">↗ Share</button>
    </div>`;
  openModal(detailModal);
}

let shareTarget = null;
function shareText(j){
  const dl = new Date(j.deadline);
  return `🔥 ${j.title} — ${j.org}\n⏳ Deadline: ${dl.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}\n🎯 Kuota tersisa: ${Math.max(0, j.quota[1]-j.quota[0])} slot\n\nCek selengkapnya di infounjku 👇`;
}
const SHARE_NETS = [
  { k:'wa',  label:'WhatsApp',  svg:'<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 7 9.9 9.9 0 0 1-9.9 9.87m8.42-18.3A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.44h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.42"/></svg>', url:(t,u)=>`https://wa.me/?text=${encodeURIComponent(t+'\n'+u)}` },
  { k:'tg',  label:'Telegram',  svg:'<svg viewBox="0 0 24 24" fill="#229ED9"><path d="M11.94 0A12 12 0 1 0 24 12 12 12 0 0 0 11.94 0zm5.87 8.16-1.97 9.28c-.15.66-.54.82-1.1.51l-3.02-2.23-1.46 1.4a.76.76 0 0 1-.6.3l.22-3.08 5.6-5.06c.24-.22-.05-.34-.38-.13l-6.93 4.37-2.98-.93c-.65-.2-.66-.65.14-.96l11.65-4.49c.54-.2 1.01.12.83.96z"/></svg>', url:(t,u)=>`https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { k:'x',   label:'X / Twitter', svg:'<svg viewBox="0 0 24 24" fill="#000000"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z"/></svg>', url:(t,u)=>`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { k:'fb',  label:'Facebook',  svg:'<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>', url:(t,u)=>`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}&quote=${encodeURIComponent(t)}` },
  { k:'li',  label:'LinkedIn',  svg:'<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>', url:(t,u)=>`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { k:'em',  label:'Email',     svg:'<svg viewBox="0 0 24 24" fill="#EA4335"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>', url:(t,u)=>`mailto:?subject=${encodeURIComponent('Info lowongan: '+t.split('\n')[0])}&body=${encodeURIComponent(t+'\n'+u)}` },
  { k:'cp',  label:'Salin Link', svg:'<svg viewBox="0 0 24 24" fill="#171512"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>', url:null },
  { k:'sys', label:'Lainnya',   svg:'<svg viewBox="0 0 24 24" fill="#171512"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>', url:null },
];
function openShareSheet(j){
  shareTarget = j;
  shareModal.querySelector('.modal__body').innerHTML = `
    <span class="mono-kick" style="color:var(--red)">↗ SHARE — PILIH MAU KEMANA</span>
    <h2>${escHtml(j.title)}</h2>
    <p style="font-size:.85rem;font-weight:600;color:var(--ink-soft)">Sekali klik, langsung kebuka di aplikasi tujuan lu. Gak perlu copy-paste manual.</p>
    <div class="share-grid">
      ${SHARE_NETS.map(n => `<button type="button" class="${n.k}" data-net="${n.k}"><span class="ic">${n.svg}</span>${n.label}</button>`).join('')}
    </div>`;
  openModal(shareModal);
}
shareModal.addEventListener('click', e => {
  const b = e.target.closest('[data-net]');
  if (!b || !shareTarget) return;
  const j = shareTarget, t = shareText(j), u = location.href.split('#')[0] + '#lowongan';
  const net = SHARE_NETS.find(n => n.k === b.dataset.net);
  if (net.k === 'cp') { copyFallback(t + '\n' + u); return; }
  if (net.k === 'sys') {
    if (navigator.share) { navigator.share({ title: `infounjku — ${j.title}`, text: t, url: u }).catch(()=>{}); closeModals(); }
    else showToast('📤 Browser lu gak punya system share — pilih aplikasi di atas ya.');
    return;
  }
  window.open(net.url(t, u), '_blank', 'noopener');
  showToast('↗ Dibuka di tab baru: ' + net.label);
});

function copyFallback(t){
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(t).then(() => showToast('📋 Tersalin! Tinggal paste di mana aja lu mau.')).catch(() => legacyCopy(t));
    return;
  }
  legacyCopy(t);
}
function legacyCopy(t){
  const ta = document.createElement('textarea');
  ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast('📋 Tersalin! Tinggal paste di mana aja lu mau.'); }
  catch (e) { showToast('⚠️ Browser lu gak ngizinin auto-copy. Copy manual ya bro.'); }
  ta.remove();
}

document.addEventListener('click', e => {
  const remind = e.target.closest('.js-remind');
  if (remind) {
    const j = JOBS.find(x => x.id == remind.dataset.id);
    if (j) { window.open(gcalUrl(j), '_blank', 'noopener'); showToast('📅 Reminder deadline dibuka di Google Calendar lu!'); }
    return;
  }
  const share = e.target.closest('.js-share');
  if (share) {
    const j = JOBS.find(x => x.id == share.dataset.id);
    if (j) openShareSheet(j);
    return;
  }
  const detail = e.target.closest('.js-detail');
  if (detail) {
    const j = JOBS.find(x => x.id == detail.dataset.id);
    if (j) openDetail(j, false);
    return;
  }
  const apply = e.target.closest('.js-apply');
  if (apply && !apply.disabled) {
    const j = JOBS.find(x => x.id == apply.dataset.id);
    if (j && j.link_daftar) {
      bumpClicks(+apply.dataset.id);
      window.open(j.link_daftar, '_blank', 'noopener');
      showToast('↗ Form pendaftaran dibuka di tab baru!');
    } else {
      showToast('⚠️ Link pendaftaran belum tersedia. Buka detail buat info kontak.');
    }
  }
});

const ORG_LOGOS = [
  { n:'BEM KM UNJKU' },{ n:'Senat Mahasiswa' },{ n:'HIMA Teknik Informatika' },{ n:'HIMA Manajemen' },
  { n:'HIMA PGSD' },{ n:'HIMA Akuntansi' },{ n:'UKM Fotografi Lensa' },{ n:'UKM Badminton' },
  { n:'UKM KSR PMI' },{ n:'Resimen Mahasiswa' },{ n:'Panitia PENS 2026' },{ n:'Panitia Dies Natalis' },
  { n:'LPM Suara Mahasiswa' },{ n:'Tim Riset Kampus' },
];
function renderOrgLogos(){
  const track = document.getElementById('orgTrack');
  if (!track) return;
  const html = ORG_LOGOS.map((o, i) =>
    `<img class="org-logo" src="https://picsum.photos/seed/iu${i + 7}/112/112" alt="Logo ${escHtml(o.n)}" title="${escHtml(o.n)}" loading="lazy">`
  ).join('');
  track.innerHTML = html + html;
  track.querySelectorAll('img').forEach(im =>
    im.addEventListener('error', () => { im.src = `https://picsum.photos/seed/alt${Math.random().toString(36).slice(2,7)}/112/112`; }, { once:true }));
}
renderOrgLogos();

const collabForm = document.getElementById('collabForm');
if (collabForm) {
  collabForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. CEK RECAPTCHA DULU
    if (typeof grecaptcha !== 'undefined') {
      const captchaResponse = grecaptcha.getResponse();
      if (captchaResponse.length === 0) {
        showToast('⚠️ Tolong centang "I am not a robot" dulu!', 'error');
        return;
      }
    }

    const submitBtn = collabForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Mengirim...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(collabForm);
      const captchaToken = typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : '';
      const payload = {
        org_name: formData.get('org_name'),
        contact: formData.get('contact'),
        collab_type: formData.get('collab_type'),
        message: formData.get('message'),
        captchaToken: captchaToken
      };

      const res = await fetch('https://ntleoqyavsdhfmamuewe.supabase.co/functions/v1/collab-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal kirim');
      }
      // -----------------------

      showToast('✅ Proposal kolaborasi berhasil dikirim! Admin akan segera review.');
      collabForm.reset();
      
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Gagal mengirim. Coba lagi nanti.', 'error');
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}

const words = ['LOWONGAN PANITIA','OPEN RECRUITMENT','KEPANITIAAN','EVENT KAMPUS','VOLUNTEER'];
let wi = 0;
const flip = document.getElementById('flipWord');
setInterval(() => {
  flip.classList.add('swap');
  setTimeout(() => { wi = (wi+1) % words.length; flip.textContent = words[wi]; flip.classList.remove('swap'); }, 300);
}, 2600);

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('igNext').onclick = () => rail.scrollBy({ left: 320, behavior: 'smooth' });
document.getElementById('igPrev').onclick = () => rail.scrollBy({ left: -320, behavior: 'smooth' });

const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg, dur = 3200){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  const ms = Number.isFinite(+dur) && +dur > 0 ? +dur : 3200;
  toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
}

document.getElementById('burger').onclick = () => document.getElementById('navLinks').classList.toggle('open');
document.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open')));
document.getElementById('footTop').addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
document.getElementById('year').textContent = new Date().getFullYear();

function updateSyncTime(){
  const el = document.getElementById('syncTime');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) + ' WIB';
}

function getSessionId(){
  let s = sessionStorage.getItem('iu_session');
  if (!s) { s = 's_' + Math.random().toString(36).slice(2, 12); sessionStorage.setItem('iu_session', s); }
  return s;
}
async function trackPageView(){
  if (!sessionStorage.getItem('iu_pv')) {
    sessionStorage.setItem('iu_pv', '1');
    fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ session_id: getSessionId() })
    }).catch(() => {});
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/page_views?select=id`, {
      headers: { ...HEADERS, 'Prefer': 'count=exact', 'Range': '0-0' }
    });
    const range = res.headers.get('content-range');
    const total = range ? (parseInt(range.split('/')[1], 10) || 0) : 0;
    const el = document.getElementById('statViews');
    if (el) el.textContent = fmtNum(total);
  } catch (e) {}
}

function updateIgNav(){
  const nav = document.querySelector('.ig-nav');
  if (!nav) return;
  const canScroll = rail.scrollWidth > rail.clientWidth + 8;
  nav.style.visibility = canScroll ? 'visible' : 'hidden';
}
window.addEventListener('resize', updateIgNav);

const SYNC_INTERVAL = 15 * 60 * 1000;
async function refreshAll(){
  await Promise.all([fetchLowongan(), fetchIgPosts(), fetchEvents()]);
  updateSyncTime();
  trackPageView();
  setTimeout(updateIgNav, 80);
}
refreshAll().then(() => setTimeout(handleHashRoute, 600));
setInterval(refreshAll, SYNC_INTERVAL);

// ==========================================
// LOGIC PWA UNIVERSAL (CHROME, EDGE, BRAVE, SAFARI)
// floating bottom-sheet, TERPISAH dari form
// ==========================================
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installYes = document.getElementById('installYes');
const installNo  = document.getElementById('installNo');
const IU_INSTALL_DISMISS = 'iu_install_dismiss';

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

function showInstallBanner(){
  if (!installBanner || !deferredPrompt) return;
  if (isStandalone()) return;                            // udah terinstall → skip
  if (sessionStorage.getItem(IU_INSTALL_DISMISS)) return; // pernah pencet "Nanti" sesi ini
  installBanner.classList.add('show');
  installBanner.setAttribute('aria-hidden', 'false');
}
function hideInstallBanner(){
  if (!installBanner) return;
  installBanner.classList.remove('show');
  installBanner.setAttribute('aria-hidden', 'true');
}

// Chromium (Chrome/Edge/Brave/Opera) — HP & Desktop
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(showInstallBanner, 2500);
});

window.addEventListener('appinstalled', () => {
  deferredPrompt = null;
  hideInstallBanner();
  showToast('✅ Aplikasi infounjku terpasang di perangkat lu!');
});

if (installYes) installYes.addEventListener('click', async () => {
  hideInstallBanner();
  if (!deferredPrompt) {
    showToast('ℹ️ Install manual: menu browser (⋮) → "Install app / Tambahkan ke Layar Utama".');
    return;
  }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') showToast('✅ Aplikasi berhasil diinstall ke HP/Desktop!');
  deferredPrompt = null;
});

if (installNo) installNo.addEventListener('click', () => {
  sessionStorage.setItem(IU_INSTALL_DISMISS, '1');
  hideInstallBanner();
});

// iOS Safari (iPhone/iPad)
const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIos && !isStandalone()) {
  setTimeout(() => {
    showToast('📱 User iPhone: Tap ikon Share (⬆️) di bawah > pilih "Add to Home Screen" buat install!', 8000);
  }, 3000);
}