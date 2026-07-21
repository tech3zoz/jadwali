// ---------- Shift engine ----------
const ANCHOR = new Date(2026, 6, 5);
const CYCLE = ['day','afternoon','night','off','off'];
const SHIFT_INFO = {
  day:       { label:'صباحي', short:'صباحي', start:7,  end:15, hex:'#38BDF8', text:'#06202f', icon:'☀️' },
  afternoon: { label:'عصر',   short:'عصر',   start:15, end:23, hex:'#F5B942', text:'#2b1c00', icon:'🌇' },
  night:     { label:'ليل',   short:'ليل',   start:23, end:31, hex:'#8B93B8', text:'#0d1120', icon:'🌙' },
  off:       { label:'إجازة', short:'',      start:null, end:null, hex:'#1A2136', text:'#5b6784', icon:'🛌' }
};
const WEEKDAYS = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function dateOnly(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function shiftKeyForDate(d){
  const diff = Math.round((dateOnly(d) - ANCHOR) / 86400000);
  return CYCLE[((diff % 5) + 5) % 5];
}
function shiftEventForDate(d){
  const key = shiftKeyForDate(d);
  const info = SHIFT_INFO[key];
  if(key === 'off') return { key, date:dateOnly(d), start:null, end:null };
  const start = new Date(d); start.setHours(info.start,0,0,0);
  const end = new Date(d);
  if(info.end > 24){ end.setDate(end.getDate()+1); end.setHours(info.end-24,0,0,0); }
  else { end.setHours(info.end,0,0,0); }
  return { key, date:dateOnly(d), start, end };
}
function upcomingEvents(fromOffsetDays, toOffsetDays){
  const list = []; const base = dateOnly(new Date());
  for(let i=fromOffsetDays; i<=toOffsetDays; i++){
    const d = new Date(base); d.setDate(d.getDate()+i);
    const ev = shiftEventForDate(d);
    if(ev.key !== 'off') list.push(ev);
  }
  return list.sort((a,b)=>a.start-b.start);
}
function getCurrentAndNext(now){
  const events = upcomingEvents(-1, 10);
  let current = null, next = null;
  for(const ev of events){
    if(ev.start <= now && now < ev.end) current = ev;
    if(ev.start > now && !next) next = ev;
  }
  return { current, next };
}
function fmtTime(d){
  let h = d.getHours(); const m = String(d.getMinutes()).padStart(2,'0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if(h === 0) h = 12;
  return `${h}:${m} ${ap}`;
}
function fmtHour12(h24){
  const ap = h24 >= 12 ? 'PM' : 'AM';
  let h = h24 % 12; if(h === 0) h = 12;
  return `${h} ${ap}`;
}
function fmtHMS(ms){
  if(ms < 0) ms = 0;
  const s = Math.floor(ms/1000);
  return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
function todayStr(){ return dateOnly(new Date()).toISOString().slice(0,10); }
function yesterdayStr(){ const d=new Date(); d.setDate(d.getDate()-1); return dateOnly(d).toISOString().slice(0,10); }

const RING_LEN = 157;

function updateHero(){
  const now = new Date();
  const { current, next } = getCurrentAndNext(now);
  const eyebrow = document.getElementById('heroEyebrow');
  const title = document.getElementById('heroTitle');
  const countdown = document.getElementById('heroCountdown');
  const sub = document.getElementById('heroSub');
  const icon = document.getElementById('heroIcon');
  const ring = document.getElementById('gaugeRing');

  if(current){
    const info = SHIFT_INFO[current.key];
    eyebrow.textContent = 'أنت بالدوام الحين';
    title.textContent = info.label;
    countdown.textContent = fmtHMS(current.end - now);
    sub.textContent = `ينتهي ${fmtTime(current.end)}`;
    icon.textContent = info.icon;
    const frac = Math.min(1, Math.max(0,(now - current.start)/(current.end-current.start)));
    ring.setAttribute('stroke-dashoffset', RING_LEN * (1-frac));
    ring.style.stroke = info.hex;
  } else if(next){
    const info = SHIFT_INFO[next.key];
    eyebrow.textContent = 'الشفت الجاي';
    title.textContent = `${info.label} — ${WEEKDAYS[next.date.getDay()]}`;
    countdown.textContent = fmtHMS(next.start - now);
    sub.textContent = `يبدأ ${fmtTime(next.start)}`;
    icon.textContent = info.icon;
    ring.style.stroke = info.hex;
    ring.setAttribute('stroke-dashoffset', RING_LEN * 0.75);
  } else {
    eyebrow.textContent = 'ما فيه شفت قريب';
    title.textContent = '—'; countdown.textContent = '--:--:--'; sub.textContent = '';
  }
}

// ---------- Month grid ----------
let viewDate = dateOnly(new Date());
viewDate.setDate(1);

function renderMonthGrid(){
  const label = document.getElementById('monthLabel');
  label.textContent = `${MONTHS_AR[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const grid = document.getElementById('calGrid');
  let html = WEEKDAYS.map(w => `<div class="wd">${w}</div>`).join('');

  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startPad = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 0).getDate();
  const todayKey = dateOnly(new Date()).getTime();

  for(let i=0; i<startPad; i++) html += `<div class="cal-cell pad"></div>`;

  for(let day=1; day<=daysInMonth; day++){
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const ev = shiftEventForDate(d);
    const info = SHIFT_INFO[ev.key];
    const isToday = d.getTime() === todayKey;
    html += `<div class="cal-cell ${isToday?'today':''}" style="background:${info.hex};color:${info.text}">
      <div class="num">${day}</div>
      ${info.short ? `<div class="lbl">${info.short}</div>` : ''}
    </div>`;
  }
  grid.innerHTML = html;
}
document.getElementById('prevMonth').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()-1); renderMonthGrid(); });
document.getElementById('nextMonth').addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()+1); renderMonthGrid(); });

document.getElementById('todayBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('todayMenu').classList.toggle('open');
});
document.addEventListener('click', () => document.getElementById('todayMenu').classList.remove('open'));
document.getElementById('todayMenu').addEventListener('click', e => {
  const range = e.target.dataset.range; if(!range) return;
  document.getElementById('todayMenu').classList.remove('open');
  viewDate = dateOnly(new Date()); viewDate.setDate(1); renderMonthGrid();
  renderQuickView(Number(range));
});

function renderQuickView(days){
  const el = document.getElementById('quickView');
  const base = dateOnly(new Date());
  let rows = '';
  for(let i=0; i<days; i++){
    const d = new Date(base); d.setDate(d.getDate()+i);
    const ev = shiftEventForDate(d);
    const info = SHIFT_INFO[ev.key];
    const isToday = i===0;
    const timeText = ev.key==='off' ? 'راحة' : `${fmtHour12(info.start)} - ${fmtHour12(info.end % 24)}`;
    rows += `<div class="day-row ${isToday?'today':''}">
      <div class="day-date"><div class="wd2">${WEEKDAYS[d.getDay()]}</div><div class="dn mono">${d.getDate()}</div></div>
      <div class="badge" style="background:${info.hex};color:${info.text}">${info.label}</div>
      <div class="day-time">${timeText}</div>
    </div>`;
  }
  const labelMap = { 1:'اليوم', 3:'٣ أيام الجاية', 7:'الأسبوع الجاي' };
  el.innerHTML = `<div class="qv-card">
    <div class="qv-head"><span>${labelMap[days] || ''}</span><button class="qv-close" id="qvClose">✕</button></div>
    ${rows}
  </div>`;
  document.getElementById('qvClose').addEventListener('click', () => { el.innerHTML = ''; });
}

// ---------- ICS export (download-based, avoids raw text showing in-browser) ----------
function toICSDate(dt){
  const p = n => String(n).padStart(2,'0');
  return `${dt.getFullYear()}${p(dt.getMonth()+1)}${p(dt.getDate())}T${p(dt.getHours())}${p(dt.getMinutes())}00`;
}
function addToPhoneCalendar(title, start, end){
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
    `UID:${Date.now()}@jadwali`,`DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,`DTEND:${toICSDate(end)}`,
    `SUMMARY:${title.replace(/\r?\n/g,' ')}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'event.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 15000);
}

// ---------- Appointments ----------
function loadAppt(){ try{ return JSON.parse(localStorage.getItem('aziz_appointments')||'[]'); }catch(e){ return []; } }
function saveAppt(a){ localStorage.setItem('aziz_appointments', JSON.stringify(a)); }

function renderAppt(){
  const items = loadAppt().sort((a,b)=> new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
  const el = document.getElementById('apptList');
  if(!items.length){ el.innerHTML = '<div class="empty">ما فيه مواعيد مضافة</div>'; return; }
  el.innerHTML = items.map(a => {
    const d = new Date(a.date+'T'+a.time);
    const dateLabel = `${WEEKDAYS[d.getDay()]} ${d.getDate()}/${d.getMonth()+1}`;
    return `<div class="item-row" data-id="${a.id}">
      <div style="flex:1; min-width:0;">
        <div class="item-text">${escapeHtml(a.title)}</div>
        <div class="item-meta mono">${dateLabel} — ${fmtTime(d)}</div>
      </div>
      <button class="cal-btn" data-action="ics">📅</button>
      <button class="icon-btn" data-action="del">✕</button>
    </div>`;
  }).join('');
}
function setApptMsg(msg, isError){
  const el = document.getElementById('apptMsg');
  el.textContent = msg;
  el.style.color = isError ? 'var(--high)' : 'var(--ok)';
  if(msg) setTimeout(()=>{ if(el.textContent===msg) el.textContent=''; }, 3500);
}
document.getElementById('apptAdd').addEventListener('click', () => {
  const title = document.getElementById('apptTitle').value.trim();
  const date = document.getElementById('apptDate').value;
  const time = document.getElementById('apptTime').value || '09:00';
  if(!title){ setApptMsg('اكتب اسم الموعد', true); return; }
  if(!date){ setApptMsg('اختر التاريخ', true); return; }
  const items = loadAppt();
  items.push({ id: Date.now().toString(), title, date, time });
  saveAppt(items);
  const start = new Date(date + 'T' + time);
  const end = new Date(start.getTime() + 60*60*1000);
  addToPhoneCalendar(title, start, end);
  document.getElementById('apptTitle').value = '';
  document.getElementById('apptTime').value = '';
  document.getElementById('apptDate').value = todayStr();
  setApptMsg('تمت الإضافة ✓ — افتح ملف التقويم اللي نزل عشان تأكد الإضافة');
  renderAppt();
  renderUpcomingWidget();
});
document.getElementById('apptList').addEventListener('click', e => {
  const row = e.target.closest('.item-row'); if(!row) return;
  const id = row.dataset.id;
  let items = loadAppt();
  const item = items.find(a => a.id === id);
  if(e.target.dataset.action === 'del'){
    items = items.filter(a => a.id !== id); saveAppt(items); renderAppt(); renderUpcomingWidget();
  } else if(e.target.dataset.action === 'ics' && item){
    const start = new Date(item.date + 'T' + item.time);
    const end = new Date(start.getTime() + 60*60*1000);
    addToPhoneCalendar(item.title, start, end);
  }
});

function renderUpcomingWidget(){
  const el = document.getElementById('upcomingWidget');
  const today = todayStr();
  const tmrw = (() => { const d = new Date(); d.setDate(d.getDate()+1); return dateOnly(d).toISOString().slice(0,10); })();
  const items = loadAppt()
    .filter(a => a.date === today || a.date === tmrw)
    .sort((a,b) => new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time));
  if(!items.length){ el.innerHTML = ''; return; }
  el.innerHTML = `<div class="upcoming-card">
    <div class="uc-title">🗓️ مواعيد قريبة</div>
    ${items.map(a => {
      const d = new Date(a.date+'T'+a.time);
      const isToday = a.date === today;
      return `<div class="upcoming-row">
        <div class="when">${isToday?'اليوم':'باجر'} ${fmtTime(d)}</div>
        <div class="title">${escapeHtml(a.title)}</div>
      </div>`;
    }).join('')}
  </div>`;
}

// ---------- Tasks ----------
function loadTasks(){ try{ return JSON.parse(localStorage.getItem('aziz_tasks')||'[]'); }catch(e){ return []; } }
function saveTasks(t){ localStorage.setItem('aziz_tasks', JSON.stringify(t)); }
const LEVEL_ORDER = { high:0, med:1, low:2 };
const LEVEL_CYCLE = ['high','med','low'];

function taskRowHtml(t){
  return `<div class="item-row" data-id="${t.id}">
      <div class="dot ${t.level}" data-action="cycle"></div>
      <div class="chk ${t.done?'done':''}" data-action="toggle">${t.done?'✓':''}</div>
      <div class="item-text ${t.done?'done':''}">${escapeHtml(t.text)}</div>
      <button class="icon-btn" data-action="del">✕</button>
    </div>`;
}
function renderTasks(){
  const all = loadTasks();
  const el = document.getElementById('taskList');
  if(!all.length){ el.innerHTML = '<div class="empty">ما فيه مهام حالياً</div>'; return; }
  const pending = all.filter(t => !t.done).sort((a,b) => LEVEL_ORDER[a.level]-LEVEL_ORDER[b.level]);
  const done = all.filter(t => t.done).sort((a,b) => LEVEL_ORDER[a.level]-LEVEL_ORDER[b.level]);
  let html = `<div class="task-group-label">⏳ باقي (${pending.length})</div>`;
  html += pending.length ? pending.map(taskRowHtml).join('') : `<div class="empty">خلصت المهام 🎉</div>`;
  if(done.length){
    html += `<div class="task-group-label">✅ خلصت (${done.length})</div>`;
    html += done.map(taskRowHtml).join('');
  }
  el.innerHTML = html;
}
document.getElementById('taskAdd').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keydown', e => { if(e.key==='Enter') addTask(); });
function addTask(){
  const input = document.getElementById('taskInput');
  const text = input.value.trim(); if(!text) return;
  const tasks = loadTasks();
  tasks.unshift({ id: Date.now().toString(), text, done:false, level:'med' });
  saveTasks(tasks); input.value=''; renderTasks();
}
document.getElementById('taskList').addEventListener('click', e => {
  const row = e.target.closest('.item-row'); if(!row) return;
  const id = row.dataset.id;
  let tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === id);
  const action = e.target.dataset.action;
  if(action === 'toggle'){
    const prevDone = tasks[idx].done;
    tasks[idx].done = !prevDone;
    saveTasks(tasks); renderTasks();
    showUndoToast(tasks[idx].done ? 'انتقلت لـ"خلصت"' : 'رجعت لـ"باقي"', () => {
      const t2 = loadTasks(); const i2 = t2.findIndex(x => x.id === id);
      if(i2 > -1){ t2[i2].done = prevDone; saveTasks(t2); renderTasks(); }
    });
  } else if(action === 'del'){
    const removed = tasks[idx]; const removedIndex = idx;
    tasks.splice(idx, 1);
    saveTasks(tasks); renderTasks();
    showUndoToast('تم حذف المهمة', () => {
      const t2 = loadTasks(); t2.splice(removedIndex, 0, removed); saveTasks(t2); renderTasks();
    });
  } else if(action === 'cycle'){
    tasks[idx].level = LEVEL_CYCLE[(LEVEL_CYCLE.indexOf(tasks[idx].level)+1)%3];
    saveTasks(tasks); renderTasks();
  }
});

// ---------- Undo toast ----------
let undoTimer = null;
function showUndoToast(text, undoFn){
  const el = document.getElementById('undoToast');
  clearTimeout(undoTimer);
  el.innerHTML = `<span>${text}</span><button id="undoBtn">تراجع</button>`;
  el.classList.add('show');
  document.getElementById('undoBtn').onclick = () => { undoFn(); hideUndoToast(); };
  undoTimer = setTimeout(hideUndoToast, 4000);
}
function hideUndoToast(){ document.getElementById('undoToast').classList.remove('show'); }

// ---------- Habits ----------
function dstr(d){ return dateOnly(d).toISOString().slice(0,10); }

function loadHabits(){
  const raw = localStorage.getItem('aziz_habits');
  if(raw === null){
    const seed = [
      { id:'seed1', text:'اشرب ماي', history:[] },
      { id:'seed2', text:'اخذ حبوبي', history:[] }
    ];
    localStorage.setItem('aziz_habits', JSON.stringify(seed));
    return seed;
  }
  let items;
  try{ items = JSON.parse(raw); }catch(e){ return []; }
  let migrated = false;
  items = items.map(h => {
    if(!h.history){
      migrated = true;
      return { id:h.id, text:h.text, history: h.lastDone ? [h.lastDone] : [] };
    }
    return h;
  });
  if(migrated) localStorage.setItem('aziz_habits', JSON.stringify(items));
  return items;
}
function saveHabits(h){ localStorage.setItem('aziz_habits', JSON.stringify(h)); }

function computeStreak(history){
  const set = new Set(history);
  let streak = 0;
  const cur = new Date();
  if(!set.has(dstr(cur))) cur.setDate(cur.getDate() - 1);
  while(set.has(dstr(cur))){ streak++; cur.setDate(cur.getDate() - 1); }
  return streak;
}
function last7(history){
  const set = new Set(history);
  const days = [];
  for(let i = 6; i >= 0; i--){
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(set.has(dstr(d)));
  }
  return days;
}

function renderHabits(){
  const items = loadHabits();
  const el = document.getElementById('habitList');
  const today = todayStr();
  if(!items.length){ el.innerHTML = '<div class="empty">ما فيه عادات مضافة</div>'; return; }
  el.innerHTML = items.map(h => {
    const done = h.history.includes(today);
    const streak = computeStreak(h.history);
    const dots = last7(h.history).map(on => `<span class="hdot ${on?'on':''}"></span>`).join('');
    return `<div class="item-row" data-id="${h.id}">
      <div class="chk ${done?'done':''}" data-action="toggle">${done?'✓':''}</div>
      <div style="flex:1; min-width:0;">
        <div class="item-text ${done?'done':''}">${escapeHtml(h.text)}</div>
        <div class="hdots">${dots}</div>
      </div>
      ${streak > 0 ? `<div class="streak">🔥${streak}</div>` : ''}
      <button class="icon-btn" data-action="del">✕</button>
    </div>`;
  }).join('');
}
document.getElementById('habitAdd').addEventListener('click', () => {
  const input = document.getElementById('habitInput');
  const text = input.value.trim(); if(!text) return;
  const items = loadHabits();
  items.push({ id: Date.now().toString(), text, history:[] });
  saveHabits(items); input.value=''; renderHabits();
});
document.getElementById('habitList').addEventListener('click', e => {
  const row = e.target.closest('.item-row'); if(!row) return;
  const id = row.dataset.id;
  let items = loadHabits();
  const idx = items.findIndex(h => h.id === id);
  const action = e.target.dataset.action;
  if(action === 'del'){ items.splice(idx,1); }
  else if(action === 'toggle'){
    const h = items[idx]; const today = todayStr();
    const set = new Set(h.history);
    if(set.has(today)) set.delete(today); else set.add(today);
    h.history = Array.from(set);
  } else return;
  saveHabits(items); renderHabits();
});

// ---------- Food log ----------
function loadFood(){ try{ return JSON.parse(localStorage.getItem('aziz_food')||'[]'); }catch(e){ return []; } }
function saveFood(f){ localStorage.setItem('aziz_food', JSON.stringify(f)); }

function renderFood(){
  const items = loadFood().slice().sort((a,b)=> b.ts - a.ts);
  const el = document.getElementById('foodList');
  const totalEl = document.getElementById('foodTotal');
  const todayD = dateOnly(new Date()).toDateString();
  const todayTotal = items.filter(f => new Date(f.ts).toDateString()===todayD)
    .reduce((s,f)=> s + (Number(f.cal)||0), 0);
  totalEl.textContent = todayTotal;
  if(!items.length){ el.innerHTML = '<div class="empty">ما فيه تسجيلات أكل بعد</div>'; return; }
  el.innerHTML = items.map(f => {
    const d = new Date(f.ts);
    return `<div class="item-row" data-id="${f.id}">
      <div style="flex:1; min-width:0;">
        <div class="item-text">${escapeHtml(f.text)}</div>
        <div class="item-meta mono">${fmtTime(d)}${f.cal ? ' — ' + f.cal + ' سعرة' : ''}</div>
      </div>
      <button class="icon-btn" data-action="del">✕</button>
    </div>`;
  }).join('');
}
document.getElementById('foodAdd').addEventListener('click', () => {
  const text = document.getElementById('foodText').value.trim();
  const cal = document.getElementById('foodCal').value;
  if(!text) return;
  const items = loadFood();
  items.push({ id: Date.now().toString(), text, cal: cal ? Number(cal) : null, ts: Date.now() });
  saveFood(items);
  document.getElementById('foodText').value=''; document.getElementById('foodCal').value='';
  renderFood();
});
document.getElementById('foodList').addEventListener('click', e => {
  const row = e.target.closest('.item-row'); if(!row) return;
  if(e.target.dataset.action !== 'del') return;
  const items = loadFood().filter(f => f.id !== row.dataset.id);
  saveFood(items); renderFood();
});

// ---------- Content ideas ----------
function loadIdeas(){ try{ return JSON.parse(localStorage.getItem('aziz_ideas')||'[]'); }catch(e){ return []; } }
function saveIdeas(items){ localStorage.setItem('aziz_ideas', JSON.stringify(items)); }
let ideaFilter = 'all';
let selectedAcct = 'tech';

function fmtShortDate(dateStr){
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_AR[d.getMonth()]}`;
}

function renderIdeas(){
  const all = loadIdeas().slice().sort((a,b)=> b.ts - a.ts);
  const items = ideaFilter === 'all' ? all : all.filter(i => i.acct === ideaFilter);
  const el = document.getElementById('ideaList');
  if(!items.length){ el.innerHTML = '<div class="empty">ما فيه أفكار مضافة</div>'; return; }
  el.innerHTML = items.map(i => `
    <div class="idea-card" data-id="${i.id}">
      <div class="idea-head">
        <span class="idea-tag ${i.acct}">${i.acct==='tech' ? '🎬 تك' : '🍳 طبخ'}</span>
        <div class="item-text" style="flex:1;">${escapeHtml(i.title)}</div>
        ${i.pubDate ? `<span class="idea-date-badge" data-action="date">📆 ${fmtShortDate(i.pubDate)}</span>` : `<button class="icon-btn" data-action="date">📆</button>`}
        <button class="icon-btn" data-action="edit">✏️</button>
        <button class="icon-btn" data-action="del">✕</button>
      </div>
      ${i.script
        ? `<div class="idea-script" data-action="edit">${escapeHtml(i.script)}</div>`
        : `<div class="idea-script empty-script" data-action="edit">ما فيه سكربت بعد — دوس ✏️ تضيف</div>`}
      <textarea class="idea-script-edit" data-id="${i.id}">${escapeHtml(i.script||'')}</textarea>
      <input type="date" class="idea-date-edit" data-id="${i.id}" value="${i.pubDate||''}">
    </div>`).join('');
  renderScheduled();
}

function renderScheduled(){
  const el = document.getElementById('scheduledWidget');
  const today = todayStr();
  const items = loadIdeas()
    .filter(i => i.pubDate && i.pubDate >= today)
    .sort((a,b) => a.pubDate.localeCompare(b.pubDate))
    .slice(0, 10);
  if(!items.length){ el.innerHTML = ''; return; }
  el.innerHTML = `<div class="sched-card">
    <div class="sc-title">📆 مجدولة للنشر</div>
    ${items.map(i => `<div class="sched-row">
        <div class="when">${fmtShortDate(i.pubDate)}</div>
        <div class="title">${i.acct==='tech'?'🎬':'🍳'} ${escapeHtml(i.title)}</div>
      </div>`).join('')}
  </div>`;
}

function setAcct(a){
  selectedAcct = a;
  document.getElementById('acctTech').classList.toggle('active', a==='tech');
  document.getElementById('acctChef').classList.toggle('active', a==='chef');
}
document.getElementById('acctTech').addEventListener('click', () => setAcct('tech'));
document.getElementById('acctChef').addEventListener('click', () => setAcct('chef'));

document.getElementById('ideaAdd').addEventListener('click', () => {
  const title = document.getElementById('ideaTitle').value.trim();
  const script = document.getElementById('ideaScript').value.trim();
  const pubDate = document.getElementById('ideaDate').value || null;
  if(!title) return;
  const items = loadIdeas();
  items.push({ id: Date.now().toString(), title, acct: selectedAcct, script, pubDate, ts: Date.now() });
  saveIdeas(items);
  document.getElementById('ideaTitle').value = '';
  document.getElementById('ideaScript').value = '';
  document.getElementById('ideaDate').value = '';
  renderIdeas();
});

document.querySelectorAll('.filter-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ideaFilter = btn.dataset.filter;
    renderIdeas();
  });
});

document.getElementById('ideaList').addEventListener('click', e => {
  const card = e.target.closest('.idea-card'); if(!card) return;
  const id = card.dataset.id;
  const action = e.target.dataset.action;
  if(action === 'del'){
    saveIdeas(loadIdeas().filter(i => i.id !== id)); renderIdeas(); return;
  }
  if(action === 'edit'){
    const ta = card.querySelector('.idea-script-edit');
    const showing = ta.style.display === 'block';
    ta.style.display = showing ? 'none' : 'block';
    if(!showing) ta.focus();
  }
  if(action === 'date'){
    const inp = card.querySelector('.idea-date-edit');
    const showing = inp.style.display === 'block';
    inp.style.display = showing ? 'none' : 'block';
    if(!showing) inp.focus();
  }
});
document.getElementById('ideaList').addEventListener('change', e => {
  if(!e.target.classList.contains('idea-date-edit')) return;
  const items = loadIdeas();
  const idx = items.findIndex(i => i.id === e.target.dataset.id);
  if(idx === -1) return;
  items[idx].pubDate = e.target.value || null;
  saveIdeas(items);
  renderIdeas();
});
document.getElementById('ideaList').addEventListener('focusout', e => {
  if(!e.target.classList.contains('idea-script-edit')) return;
  const items = loadIdeas();
  const idx = items.findIndex(i => i.id === e.target.dataset.id);
  if(idx === -1) return;
  items[idx].script = e.target.value.trim();
  saveIdeas(items);
  renderIdeas();
});

// ---------- Tabs ----------
document.querySelectorAll('nav.bottom button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav.bottom button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('section.panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-'+btn.dataset.tab).classList.add('active');
  });
});

function escapeHtml(str){ const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

// ---------- Init ----------
document.getElementById('apptDate').value = todayStr();
renderMonthGrid(); renderAppt(); renderUpcomingWidget(); renderTasks(); renderHabits(); renderFood(); renderIdeas(); updateHero();
setInterval(updateHero, 1000);

// ---------- Service worker (offline / installable PWA) ----------
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}
