// ============================================================
//  Settings (language / theme / shift rotation)
// ============================================================
let lang  = localStorage.getItem('aziz_lang')  || 'en';        // 'en' | 'ar'
let theme = localStorage.getItem('aziz_theme') || 'minimal';   // 'minimal' | 'starry'
let shiftPhase = parseInt(localStorage.getItem('aziz_shift_phase'), 10);
if(isNaN(shiftPhase)) shiftPhase = 0;                          // 0..4 (phase offset in the 5-day cycle)
let appTitle = localStorage.getItem('aziz_title') || '';       // custom app name (empty = use translated default)
const APP_BUILD = 'v16';                                       // shown in Settings so the running build is verifiable

function saveSetting(key, val){ localStorage.setItem(key, val); }

// ============================================================
//  i18n dictionaries
// ============================================================
const WEEKDAYS_I18N = {
  ar: ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
};
const MONTHS_I18N = {
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December']
};
const SHIFT_LABELS = {
  ar: { day:'صباحي', afternoon:'عصر', night:'ليل', off:'إجازة' },
  en: { day:'Day',   afternoon:'Afternoon', night:'Night', off:'Off' }
};
const T = {
  en: {
    appName:'Jadwali', tagline:"Shift organizer",
    loading:'Loading…',
    navShifts:'Shifts', navAppt:'Appointments', navTasks:'Tasks', navHabits:'Habits', navIdeas:'Ideas',
    todayBtn:'Today ▾', rangeToday:'Today', range3:'3 days', rangeWeek:'Week',
    heroOnNow:"You're on shift now", heroNext:'Next shift', heroNone:'No upcoming shift',
    heroEnds:'Ends', heroStarts:'Starts',
    qvToday:'Today', qv3:'Next 3 days', qvWeek:'Next week', qvOff:'Off',
    apptNamePh:'Appointment name…', apptAdd:'Add appointment',
    apptNote:'Adding an appointment auto-downloads a small calendar file — open it and your phone asks "Add to Calendar". You can re-download it anytime from the 📅 button next to the appointment.',
    apptEmpty:'No appointments added', apptWriteName:'Enter an appointment name', apptChooseDate:'Choose a date',
    apptAdded:'Added ✓ — open the calendar file that downloaded to confirm',
    upcomingTitle:'🗓️ Upcoming', today:'Today', tomorrow:'Tomorrow',
    taskPh:'Add a new task…', add:'Add',
    taskNote:'Tap the colored dot to switch priority: red = important/urgent, teal = normal (anytime). Important ones rise to the top automatically.',
    taskEmpty:'No tasks yet', pending:'Pending', done:'Done', taskAllDone:'All done 🎉',
    taskMovedDone:'Moved to "Done"', taskMovedPending:'Moved back to "Pending"', taskDeleted:'Task deleted', undo:'Undo',
    habitPh:'New habit… e.g. Drink water', habitEmpty:'No habits added',
    freq_daily:'Daily', freq_weekly:'Weekly', freq_monthly:'Monthly',
    streakUnit_daily:'Day', streakUnit_weekly:'Week', streakUnit_monthly:'Month',
    iconLabel:'Icon', colorLabel:'Color', repeatLabel:'Repeat on', noHabitsToday:'No habits for this day',
    newHabit:'New Habit', summaryTitle:'Weekly Summary', emojiHint:'Tap the box and use your keyboard’s emoji 😀 to pick any icon.',
    habitTrackerTitle:'Habit Tracker', habitTrackerTagline:'Small steps, every single day 🌟', restDay:'Rest day — nothing scheduled',
    legDone:'Done', legMissed:'Missed', legPending:'Pending', legOff:'Not scheduled',
    settingsTitle:'App title', appTitlePh:'App title', manageCats:'Categories', newCat:'New category', catNamePh:'Category name',
    taskPriorityBtn:'Priority', grpImportant:'Important', grpNormal:'Normal (anytime)', grpCompleted:'Completed', noneHere:'Nothing here',
    chooseLevel:'Add this task as…', lvlNormal:'Normal', cancelWord:'Cancel',
    deleteWord:'Delete', editHint:'Tap a habit to edit or delete it.', confirmDelete:'Delete this habit? Its history will be removed.',
    repeatLabelAppt:'Repeat', repOnce:'Once', repDaily:'Daily', repWeekly:'Weekly', repCustom:'Days',
    untilLabel:'Ends on (optional)', thisWeekOnly:'This week only', everyWord:'Every', pickDaysMsg:'Pick at least one day',
    left:'left', goalPh:'Goal (optional)', unitPh:'Unit (ml, times…)', addAmountPh:'amount', save:'Save',
    habitNote:'Choose a frequency (daily / weekly / monthly). Add an optional goal + unit to make it measurable — e.g. Drink water 2000 ml, or Gym 3 times/week. Tap ⚙️ on any habit to edit it. The dots show your last 7 periods; the 🔥 streak counts consecutive completed periods.',
    foodDivider:'🍽️ Food', foodCaloriesToday:"Today's calories",
    foodPh:'What did you eat / amount…', foodCalPh:'Calories (optional)', foodLog:'Log',
    foodEmpty:'No food logged yet', calUnit:'cal',
    ideaTitlePh:'Idea title…', acctTech:'🎬 Tech — @tech3zoz', acctChef:'🍳 Cooking — @chef3zoz',
    ideaScriptPh:'Script space (optional)… add it now or later', ideaAdd:'Add idea',
    filterAll:'All', filterTech:'🎬 Tech', filterChef:'🍳 Cooking',
    ideaNote:'Open any idea later to add/edit its script or publish date. I can’t see your ideas inside the app — if you want help with a script, tell me here in chat and paste it into the script box yourself.',
    ideaEmpty:'No ideas added', ideaNoScript:'No script yet — tap ✏️ to add', scheduledTitle:'📆 Scheduled to publish',
    tagTech:'🎬 Tech', tagChef:'🍳 Cooking',
    settings:'Settings', settingsLanguage:'Language', settingsTheme:'Theme', settingsShift:'My shift rotation',
    langAr:'العربية', langEn:'English', themeMinimal:'Minimal', themeStarry:'Starry',
    shiftHint:'Pick the rotation that matches your real schedule — the hint shows what today would be.',
    shiftTodayIs:'Today', shiftLabel:'Rotation', close:'Close'
  },
  ar: {
    appName:'جدولي', tagline:'منظّم الدوام',
    loading:'جاري التحميل…',
    navShifts:'الدوام', navAppt:'مواعيدي', navTasks:'المهام', navHabits:'العادات', navIdeas:'أفكار',
    todayBtn:'اليوم ▾', rangeToday:'اليوم', range3:'٣ أيام', rangeWeek:'أسبوع',
    heroOnNow:'أنت بالدوام الحين', heroNext:'الشفت الجاي', heroNone:'ما فيه شفت قريب',
    heroEnds:'ينتهي', heroStarts:'يبدأ',
    qvToday:'اليوم', qv3:'٣ أيام الجاية', qvWeek:'الأسبوع الجاي', qvOff:'راحة',
    apptNamePh:'اسم الموعد…', apptAdd:'إضافة الموعد',
    apptNote:'لما تضيف موعد بينزل ملف تقويم صغير بالتنزيلات تلقائي — افتحه وبيسألك "Add to Calendar" مباشرة. تقدر تنزّله ثانية من زر 📅 بجانب الموعد بأي وقت.',
    apptEmpty:'ما فيه مواعيد مضافة', apptWriteName:'اكتب اسم الموعد', apptChooseDate:'اختر التاريخ',
    apptAdded:'تمت الإضافة ✓ — افتح ملف التقويم اللي نزل عشان تأكد الإضافة',
    upcomingTitle:'🗓️ مواعيد قريبة', today:'اليوم', tomorrow:'باجر',
    taskPh:'أضف مهمة جديدة…', add:'إضافة',
    taskNote:'اضغط النقطة الملونة لتبديل الأولوية: أحمر = مهم/عاجل، تركواز = عادي (بأي وقت). المهم يطلع فوق تلقائي.',
    taskEmpty:'ما فيه مهام حالياً', pending:'باقي', done:'خلصت', taskAllDone:'خلصت المهام 🎉',
    taskMovedDone:'انتقلت لـ"خلصت"', taskMovedPending:'رجعت لـ"باقي"', taskDeleted:'تم حذف المهمة', undo:'تراجع',
    habitPh:'عادة جديدة… مثل: اشرب ماي', habitEmpty:'ما فيه عادات مضافة',
    freq_daily:'يومي', freq_weekly:'أسبوعي', freq_monthly:'شهري',
    streakUnit_daily:'يوم', streakUnit_weekly:'أسبوع', streakUnit_monthly:'شهر',
    iconLabel:'الأيقونة', colorLabel:'اللون', repeatLabel:'يتكرر أيام', noHabitsToday:'ما فيه عادات لهذا اليوم',
    newHabit:'عادة جديدة', summaryTitle:'ملخّص الأسبوع', emojiHint:'دوس على المربع واستخدم لوحة الإيموجي 😀 بجوالك لاختيار أي أيقونة.',
    habitTrackerTitle:'متتبع العادات', habitTrackerTagline:'خطوة صغيرة كل يوم 🌟', restDay:'يوم راحة — ما فيه شي مجدول',
    legDone:'تم', legMissed:'فات', legPending:'باقي', legOff:'غير مجدول',
    settingsTitle:'اسم التطبيق', appTitlePh:'اسم التطبيق', manageCats:'التصنيفات', newCat:'تصنيف جديد', catNamePh:'اسم التصنيف',
    taskPriorityBtn:'الأولوية', grpImportant:'مهم', grpNormal:'عادي (بأي وقت)', grpCompleted:'مكتمل', noneHere:'ما فيه شي هنا',
    chooseLevel:'أضف المهمة كـ…', lvlNormal:'عادي', cancelWord:'إلغاء',
    deleteWord:'حذف', editHint:'دوس على العادة عشان تعدّلها أو تحذفها.', confirmDelete:'تحذف هذه العادة؟ راح ينحذف سجلها.',
    repeatLabelAppt:'التكرار', repOnce:'مرة', repDaily:'يومي', repWeekly:'أسبوعي', repCustom:'أيام',
    untilLabel:'ينتهي في (اختياري)', thisWeekOnly:'هذا الأسبوع فقط', everyWord:'كل', pickDaysMsg:'اختر يوم واحد على الأقل',
    left:'باقي', goalPh:'الهدف (اختياري)', unitPh:'الوحدة (مل، مرات…)', addAmountPh:'كمية', save:'حفظ',
    habitNote:'اختر التكرار (يومي / أسبوعي / شهري). تقدر تضيف هدف + وحدة عشان تصير قابلة للقياس — مثل: اشرب ماي ٢٠٠٠ مل، أو نادي ٣ مرات/أسبوع. دوس ⚙️ على أي عادة عشان تعدّلها. النقاط توريك آخر ٧ فترات، والستريك 🔥 يحسب الفترات المكتملة المتتالية.',
    foodDivider:'🍽️ الأكل', foodCaloriesToday:'سعرات اليوم',
    foodPh:'وش أكلت / الكمية…', foodCalPh:'سعرات (اختياري)', foodLog:'تسجيل',
    foodEmpty:'ما فيه تسجيلات أكل بعد', calUnit:'سعرة',
    ideaTitlePh:'اسم الفكرة…', acctTech:'🎬 تك — @tech3zoz', acctChef:'🍳 طبخ — @chef3zoz',
    ideaScriptPh:'مساحة السكربت (اختياري)… تقدر تضيفه الحين أو بعدين', ideaAdd:'إضافة الفكرة',
    filterAll:'الكل', filterTech:'🎬 تك', filterChef:'🍳 طبخ',
    ideaNote:'أي فكرة تضيفها تقدر تفتحها بعدين وتضيف/تعدل السكربت أو تاريخ النشر حقها. أنا ما أقدر أدخل التطبيق نفسه أشوف أفكارك — لو تبي مساعدة بسكربت، قولي الموضوع هنا بالشات وأكتبه لك، وبعدها تلصقه بنفسك بخانة السكربت.',
    ideaEmpty:'ما فيه أفكار مضافة', ideaNoScript:'ما فيه سكربت بعد — دوس ✏️ تضيف', scheduledTitle:'📆 مجدولة للنشر',
    tagTech:'🎬 تك', tagChef:'🍳 طبخ',
    settings:'الإعدادات', settingsLanguage:'اللغة', settingsTheme:'المظهر', settingsShift:'دوامي',
    langAr:'العربية', langEn:'English', themeMinimal:'مبسّط', themeStarry:'نجوم',
    shiftHint:'اختر الدوام اللي يطابق جدولك الحقيقي — التلميح يوريك وش يطلع اليوم.',
    shiftTodayIs:'اليوم', shiftLabel:'دوام', close:'إغلاق'
  }
};
function t(key){ return (T[lang] && T[lang][key]) != null ? T[lang][key] : (T.en[key] != null ? T.en[key] : key); }
function WEEKDAYS(){ return WEEKDAYS_I18N[lang]; }
function MONTHS(){ return MONTHS_I18N[lang]; }

// ============================================================
//  Shift engine
// ============================================================
const ANCHOR = new Date(2026, 6, 5); // 2026-07-05, phase 0 => Day
const CYCLE = ['day','afternoon','night','off','off'];
const SHIFT_INFO = {
  day:       { start:7,  end:15, hex:'#38BDF8', text:'#06202f', icon:'☀️' },
  afternoon: { start:15, end:23, hex:'#F5B942', text:'#2b1c00', icon:'🌇' },
  night:     { start:23, end:31, hex:'#8B93B8', text:'#0d1120', icon:'🌙' },
  off:       { start:null, end:null, hex:'#1A2136', text:'#5b6784', icon:'🛌' }
};
function shiftLabel(key){ return SHIFT_LABELS[lang][key]; }
function shiftShort(key){ return key === 'off' ? '' : SHIFT_LABELS[lang][key]; }

function dateOnly(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function shiftKeyForDate(d){
  const diff = Math.round((dateOnly(d) - ANCHOR) / 86400000);
  return CYCLE[((diff + shiftPhase) % 5 + 5) % 5];
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
// NOTE: never use toISOString() for calendar dates — it converts to UTC, which
// rolls back a day for every UTC+ timezone. Always build from LOCAL parts.
function ymd(d){
  const x = dateOnly(d);
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
}
function todayStr(){ return ymd(new Date()); }

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
    eyebrow.textContent = t('heroOnNow');
    title.textContent = shiftLabel(current.key);
    countdown.textContent = fmtHMS(current.end - now);
    sub.textContent = `${t('heroEnds')} ${fmtTime(current.end)}`;
    icon.textContent = info.icon;
    const frac = Math.min(1, Math.max(0,(now - current.start)/(current.end-current.start)));
    ring.setAttribute('stroke-dashoffset', RING_LEN * (1-frac));
    ring.style.stroke = info.hex;
  } else if(next){
    const info = SHIFT_INFO[next.key];
    eyebrow.textContent = t('heroNext');
    title.textContent = `${shiftLabel(next.key)} — ${WEEKDAYS()[next.date.getDay()]}`;
    countdown.textContent = fmtHMS(next.start - now);
    sub.textContent = `${t('heroStarts')} ${fmtTime(next.start)}`;
    icon.textContent = info.icon;
    ring.style.stroke = info.hex;
    ring.setAttribute('stroke-dashoffset', RING_LEN * 0.75);
  } else {
    eyebrow.textContent = t('heroNone');
    title.textContent = '—'; countdown.textContent = '--:--:--'; sub.textContent = '';
  }
}

// ============================================================
//  Month grid
// ============================================================
let viewDate = dateOnly(new Date());
viewDate.setDate(1);

function renderMonthGrid(){
  const label = document.getElementById('monthLabel');
  label.textContent = `${MONTHS()[viewDate.getMonth()]} ${viewDate.getFullYear()}`;

  const grid = document.getElementById('calGrid');
  let html = WEEKDAYS().map(w => `<div class="wd">${w}</div>`).join('');

  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startPad = firstDay.getDay(); // 0=Sun
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 0).getDate();
  const todayKey = dateOnly(new Date()).getTime();

  for(let i=0; i<startPad; i++) html += `<div class="cal-cell pad"></div>`;

  for(let day=1; day<=daysInMonth; day++){
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const ev = shiftEventForDate(d);
    const info = SHIFT_INFO[ev.key];
    const short = shiftShort(ev.key);
    const isToday = d.getTime() === todayKey;
    html += `<div class="cal-cell ${isToday?'today':''}" style="background:${info.hex};color:${info.text}">
      <div class="num">${day}</div>
      ${short ? `<div class="lbl">${short}</div>` : ''}
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

let quickViewDays = 0; // remember open quick-view so it re-renders on lang change
function renderQuickView(days){
  quickViewDays = days;
  const el = document.getElementById('quickView');
  if(!days){ el.innerHTML = ''; return; }
  const base = dateOnly(new Date());
  let rows = '';
  for(let i=0; i<days; i++){
    const d = new Date(base); d.setDate(d.getDate()+i);
    const ev = shiftEventForDate(d);
    const info = SHIFT_INFO[ev.key];
    const isToday = i===0;
    const timeText = ev.key==='off' ? t('qvOff') : `${fmtHour12(info.start)} - ${fmtHour12(info.end % 24)}`;
    rows += `<div class="day-row ${isToday?'today':''}">
      <div class="day-date"><div class="wd2">${WEEKDAYS()[d.getDay()]}</div><div class="dn mono">${d.getDate()}</div></div>
      <div class="badge" style="background:${info.hex};color:${info.text}">${shiftLabel(ev.key)}</div>
      <div class="day-time">${timeText}</div>
    </div>`;
  }
  const labelMap = { 1:t('qvToday'), 3:t('qv3'), 7:t('qvWeek') };
  el.innerHTML = `<div class="qv-card">
    <div class="qv-head"><span>${labelMap[days] || ''}</span><button class="qv-close" id="qvClose">✕</button></div>
    ${rows}
  </div>`;
  document.getElementById('qvClose').addEventListener('click', () => { renderQuickView(0); });
}

// ============================================================
//  ICS export
// ============================================================
function toICSDate(dt){
  const p = n => String(n).padStart(2,'0');
  return `${dt.getFullYear()}${p(dt.getMonth()+1)}${p(dt.getDate())}T${p(dt.getHours())}${p(dt.getMinutes())}00`;
}
function addToPhoneCalendar(title, start, end, rrule){
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
    `UID:${Date.now()}@jadwali`,`DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,`DTEND:${toICSDate(end)}`];
  if(rrule) lines.push(`RRULE:${rrule}`);
  lines.push(`SUMMARY:${title.replace(/\r?\n/g,' ')}`,'END:VEVENT','END:VCALENDAR');
  const ics = lines.join('\r\n');
  const blob = new Blob([ics], {type:'text/calendar'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'event.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 15000);
}

// ============================================================
//  Appointments
// ============================================================
function loadAppt(){
  let arr;
  try{ arr = JSON.parse(localStorage.getItem('aziz_appointments')||'[]'); }catch(e){ return []; }
  let changed = false;
  arr = arr.map(a => {                       // migrate one-off appointments
    if(a.repeat) return a;
    changed = true;
    return Object.assign({}, a, { repeat:'once', days:[], until:null });
  });
  if(changed) localStorage.setItem('aziz_appointments', JSON.stringify(arr));
  return arr;
}
function saveAppt(a){ localStorage.setItem('aziz_appointments', JSON.stringify(a)); }

// ---- recurrence ----
function apptOccursOn(a, d){
  const day = dateOnly(d);
  const start = dateOnly(new Date(a.date + 'T00:00:00'));
  if(day < start) return false;
  if(a.until){ const u = dateOnly(new Date(a.until + 'T00:00:00')); if(day > u) return false; }
  const rep = a.repeat || 'once';
  if(rep === 'once')   return dstr(day) === a.date;
  if(rep === 'daily')  return true;
  if(rep === 'weekly') return day.getDay() === start.getDay();
  if(rep === 'custom') return (a.days || []).includes(day.getDay());
  return false;
}
function apptNextOccurrence(a, from){
  const f = dateOnly(from || new Date());
  for(let i=0; i<420; i++){
    const d = new Date(f); d.setDate(d.getDate()+i);
    if(apptOccursOn(a, d)) return d;
  }
  return null;
}
function apptRepeatLabel(a){
  const rep = a.repeat || 'once';
  const wd = WD_LONG[lang] || WD_LONG.en;
  let s = '';
  if(rep === 'daily') s = t('repDaily');
  else if(rep === 'weekly') s = `${t('everyWord')} ${wd[dateOnly(new Date(a.date+'T00:00:00')).getDay()]}`;
  else if(rep === 'custom') s = `${t('everyWord')} ${(a.days||[]).map(d => wd[d]).join(', ')}`;
  if(s && a.until) s += ` → ${a.until}`;
  return s;
}
function apptRRule(a){
  const rep = a.repeat || 'once';
  if(rep === 'once') return null;
  const codes = ['SU','MO','TU','WE','TH','FR','SA'];
  let r;
  if(rep === 'daily') r = 'FREQ=DAILY';
  else if(rep === 'weekly') r = `FREQ=WEEKLY;BYDAY=${codes[dateOnly(new Date(a.date+'T00:00:00')).getDay()]}`;
  else r = `FREQ=WEEKLY;BYDAY=${(a.days||[]).map(d => codes[d]).join(',')}`;
  if(a.until){ const u = new Date(a.until + 'T23:59:00'); r += `;UNTIL=${toICSDate(u)}`; }
  return r;
}

function renderAppt(){
  const items = loadAppt().slice().sort((a,b) => {
    const na = apptNextOccurrence(a), nb = apptNextOccurrence(b);
    if(!na && !nb) return 0;
    if(!na) return 1;
    if(!nb) return -1;
    return (na - nb) || (a.time||'').localeCompare(b.time||'');
  });
  const el = document.getElementById('apptList');
  if(!items.length){ el.innerHTML = `<div class="empty">${t('apptEmpty')}</div>`; return; }
  el.innerHTML = items.map(a => {
    const next = apptNextOccurrence(a);
    const timeD = new Date((next ? dstr(next) : a.date) + 'T' + (a.time||'09:00'));
    const dateLabel = next ? `${WEEKDAYS()[next.getDay()]} ${next.getDate()}/${next.getMonth()+1}` : '—';
    const rep = apptRepeatLabel(a);
    return `<div class="item-row" data-id="${a.id}">
      <div style="flex:1; min-width:0;">
        <div class="item-text">${escapeHtml(a.title)}</div>
        <div class="item-meta mono">${dateLabel} — ${fmtTime(timeD)}</div>
        ${rep ? `<div class="item-meta rep-badge">🔁 ${escapeHtml(rep)}</div>` : ''}
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
// ---- repeat controls in the add form ----
let apptRepeat = 'once';
let apptDays = [];
function setupApptRepeat(){
  document.getElementById('apptDaysSel').innerHTML = daysPicker(apptDays);
  document.getElementById('apptDaysSel').style.display = apptRepeat === 'custom' ? '' : 'none';
  document.getElementById('apptUntilWrap').style.display = apptRepeat === 'once' ? 'none' : 'block';
}
document.getElementById('apptRepeatSeg').addEventListener('click', e => {
  const b = e.target.closest('[data-rep]'); if(!b) return;
  apptRepeat = b.dataset.rep;
  document.querySelectorAll('#apptRepeatSeg .seg-btn').forEach(x => x.classList.toggle('active', x === b));
  setupApptRepeat();
});
document.getElementById('apptDaysSel').addEventListener('click', e => {
  const b = e.target.closest('[data-day]'); if(!b) return;
  const d = Number(b.dataset.day);
  if(apptDays.includes(d)) apptDays = apptDays.filter(x => x !== d); else apptDays.push(d);
  b.classList.toggle('on');
});
document.getElementById('apptThisWeek').addEventListener('click', () => {
  const base = document.getElementById('apptDate').value
    ? dateOnly(new Date(document.getElementById('apptDate').value + 'T00:00:00'))
    : dateOnly(new Date());
  const end = mondayOf(base); end.setDate(end.getDate() + 6);   // Sunday of that week
  document.getElementById('apptUntil').value = dstr(end);
});

document.getElementById('apptAdd').addEventListener('click', () => {
  const title = document.getElementById('apptTitle').value.trim();
  const date = document.getElementById('apptDate').value;
  const time = document.getElementById('apptTime').value || '09:00';
  const until = document.getElementById('apptUntil').value || null;
  if(!title){ setApptMsg(t('apptWriteName'), true); return; }
  if(!date){ setApptMsg(t('apptChooseDate'), true); return; }
  if(apptRepeat === 'custom' && !apptDays.length){ setApptMsg(t('pickDaysMsg'), true); return; }
  const item = { id: Date.now().toString(), title, date, time,
    repeat: apptRepeat, days: apptRepeat === 'custom' ? apptDays.slice().sort((a,b)=>a-b) : [],
    until: apptRepeat === 'once' ? null : until };
  const items = loadAppt();
  items.push(item);
  saveAppt(items);
  const start = new Date(date + 'T' + time);
  const end = new Date(start.getTime() + 60*60*1000);
  addToPhoneCalendar(title, start, end, apptRRule(item));
  document.getElementById('apptTitle').value = '';
  document.getElementById('apptDate').value = todayStr();
  document.getElementById('apptUntil').value = '';
  apptRepeat = 'once'; apptDays = [];
  document.querySelectorAll('#apptRepeatSeg .seg-btn').forEach(x => x.classList.toggle('active', x.dataset.rep === 'once'));
  setupApptRepeat();
  setApptMsg(t('apptAdded'));
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
    const next = apptNextOccurrence(item) || dateOnly(new Date(item.date + 'T00:00:00'));
    const start = new Date(dstr(next) + 'T' + (item.time || '09:00'));
    const end = new Date(start.getTime() + 60*60*1000);
    addToPhoneCalendar(item.title, start, end, apptRRule(item));
  }
});

function renderUpcomingWidget(){
  const el = document.getElementById('upcomingWidget');
  const today = dateOnly(new Date());
  const tmrw = new Date(today); tmrw.setDate(tmrw.getDate()+1);
  const rows = [];
  loadAppt().forEach(a => {
    [[today,true],[tmrw,false]].forEach(([d,isToday]) => {
      if(apptOccursOn(a, d)) rows.push({ a, d, isToday, ts:new Date(dstr(d)+'T'+(a.time||'09:00')).getTime() });
    });
  });
  if(!rows.length){ el.innerHTML = ''; return; }
  rows.sort((x,y) => x.ts - y.ts);
  el.innerHTML = `<div class="upcoming-card">
    <div class="uc-title">${t('upcomingTitle')}</div>
    ${rows.map(r => `<div class="upcoming-row">
        <div class="when">${r.isToday?t('today'):t('tomorrow')} ${fmtTime(new Date(r.ts))}</div>
        <div class="title">${escapeHtml(r.a.title)}</div>
      </div>`).join('')}
  </div>`;
}

// ============================================================
//  Tasks
// ============================================================
// Two priorities only: 'high' (important/urgent) and 'normal' (anytime).
function loadTasks(){
  let arr;
  try{ arr = JSON.parse(localStorage.getItem('aziz_tasks')||'[]'); }catch(e){ return []; }
  let changed = false;
  arr = arr.map(t => {
    if(t.level !== 'high' && t.level !== 'normal'){ changed = true; return Object.assign({}, t, { level:'normal' }); }
    return t;
  });
  if(changed) localStorage.setItem('aziz_tasks', JSON.stringify(arr));
  return arr;
}
function saveTasks(t){ localStorage.setItem('aziz_tasks', JSON.stringify(t)); }
const LEVEL_ORDER = { high:0, normal:1 };
const LEVEL_CYCLE = ['high','normal'];

function taskRowHtml(t){
  return `<div class="item-row ${t.level==='high'?'is-priority':''}" data-id="${t.id}">
      <div class="dot ${t.level}" data-action="cycle" title="priority"></div>
      <div class="chk ${t.done?'done':''}" data-action="toggle">${t.done?'✓':''}</div>
      <div class="item-text ${t.done?'done':''}">${escapeHtml(t.text)}</div>
      <button class="icon-btn" data-action="del">✕</button>
    </div>`;
}
// Marking a task important moves it out of the normal list into its own
// Priority section automatically (grouping is derived from level, so the
// task jumps sections the moment its dot is tapped).
function taskGroupsHtml(all){
  const important = all.filter(x => !x.done && x.level === 'high');
  const normal    = all.filter(x => !x.done && x.level === 'normal');
  const done      = all.filter(x => x.done);
  const group = (cls, icon, label, arr, emptyMsg) =>
    `<div class="task-group-label ${cls}">${icon} ${label} (${arr.length})</div>` +
    (arr.length ? arr.map(taskRowHtml).join('') : `<div class="empty">${emptyMsg}</div>`);
  let html = group('is-priority', '🔴', t('grpImportant'), important, t('noneHere'));
  html += group('', '⚪', t('grpNormal'), normal, t('noneHere'));
  if(done.length) html += group('', '✅', t('grpCompleted'), done, t('noneHere'));
  return html;
}
function renderTasks(){
  const all = loadTasks();
  const el = document.getElementById('taskList');
  if(!all.length){ el.innerHTML = `<div class="empty">${t('taskEmpty')}</div>`; return; }
  el.innerHTML = taskGroupsHtml(all);
}

function refreshTaskViews(){ renderTasks(); }

// Pressing Add asks whether the task is Priority or Normal, then files it.
function addTask(level){
  const input = document.getElementById('taskInput');
  const text = input.value.trim(); if(!text) return;
  const tasks = loadTasks();
  tasks.unshift({ id: Date.now().toString(), text, done:false, level: level === 'high' ? 'high' : 'normal' });
  saveTasks(tasks); input.value=''; refreshTaskViews();
}
function askTaskLevel(){
  const text = document.getElementById('taskInput').value.trim();
  if(!text) return;                                   // nothing typed yet
  document.getElementById('levelTaskText').textContent = text;
  document.getElementById('levelModal').classList.add('open');
}
function closeLevelModal(){ document.getElementById('levelModal').classList.remove('open'); }

document.getElementById('taskAdd').addEventListener('click', askTaskLevel);
document.getElementById('taskInput').addEventListener('keydown', e => { if(e.key === 'Enter') askTaskLevel(); });
document.getElementById('levelModal').addEventListener('click', e => {
  // tapping the dimmed backdrop cancels (keeps whatever was typed)
  if(e.target.id === 'levelModal'){ closeLevelModal(); return; }
  const b = e.target.closest('[data-lvl]'); if(!b) return;
  const lvl = b.dataset.lvl;
  if(lvl !== 'cancel') addTask(lvl);
  closeLevelModal();
});
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLevelModal(); });
function handleTaskListClick(e){
  const row = e.target.closest('.item-row'); if(!row) return;
  const id = row.dataset.id;
  let tasks = loadTasks();
  const idx = tasks.findIndex(x => x.id === id);
  if(idx === -1) return;
  const action = e.target.dataset.action;
  if(action === 'toggle'){
    const prevDone = tasks[idx].done;
    tasks[idx].done = !prevDone;
    saveTasks(tasks); refreshTaskViews();
    showUndoToast(tasks[idx].done ? t('taskMovedDone') : t('taskMovedPending'), () => {
      const t2 = loadTasks(); const i2 = t2.findIndex(x => x.id === id);
      if(i2 > -1){ t2[i2].done = prevDone; saveTasks(t2); refreshTaskViews(); }
    });
  } else if(action === 'del'){
    const removed = tasks[idx]; const removedIndex = idx;
    tasks.splice(idx, 1);
    saveTasks(tasks); refreshTaskViews();
    showUndoToast(t('taskDeleted'), () => {
      const t2 = loadTasks(); t2.splice(removedIndex, 0, removed); saveTasks(t2); refreshTaskViews();
    });
  } else if(action === 'cycle'){
    tasks[idx].level = LEVEL_CYCLE[(LEVEL_CYCLE.indexOf(tasks[idx].level)+1) % LEVEL_CYCLE.length];
    saveTasks(tasks); refreshTaskViews();
  }
}
document.getElementById('taskList').addEventListener('click', handleTaskListClick);

// ============================================================
//  Undo toast
// ============================================================
let undoTimer = null;
function showUndoToast(text, undoFn){
  const el = document.getElementById('undoToast');
  clearTimeout(undoTimer);
  el.innerHTML = `<span>${text}</span><button id="undoBtn">${t('undo')}</button>`;
  el.classList.add('show');
  document.getElementById('undoBtn').onclick = () => { undoFn(); hideUndoToast(); };
  undoTimer = setTimeout(hideUndoToast, 4000);
}
function hideUndoToast(){ document.getElementById('undoToast').classList.remove('show'); }

// ============================================================
//  Habits (daily/weekly/monthly, measurable goals, icon + color)
//    schema: { id, text, freq, goal, unit, icon, color, log:{periodKey:amount} }
// ============================================================
function dstr(d){ return ymd(d); }   // timezone-safe (see ymd)

const HABIT_COLORS = ['#2DD4BF','#4ADE80','#38BDF8','#A78BFA','#FB7185','#F5B942','#F97316','#F472B6'];
// Large habit-relevant quick-pick set (the icon box also accepts ANY emoji from the keyboard)
const EMOJI_SUGGEST = [
  '⭐','💧','🥛','☕','🍵','🚭','🍎','🥗','🥦','🥕','🍌','🥑','🍚','🍞','🥚','🍗','🐟','🧂','🍫',
  '🏋️','🏃','🚶','🚴','🧗','🤸','🏊','🤾','⚽','🏀','🎾','🥊','💪','🦵','🧘','⛹️','🏸','🥋',
  '💊','🩺','🩹','🦷','🪥','🚿','🛁','🧴','🧼','😴','🛌','🌡️','🫀','🩸','❤️','🧠','⚖️',
  '📖','📚','✍️','📝','💻','🖥️','📅','⏰','🎯','📈','📊','🎓','🔬','🗂️','🌐','🧑‍💻',
  '🙏','📿','🧎','🕌','🌙','☀️','✨','🕯️','💭','😌','🧘‍♂️',
  '🧹','🧺','🧽','🛒','🍳','🪴','🌱','🌳','🐕','🐈','🚗','🔧','🪥',
  '💰','💵','🏦','🪙','🎸','🎮','🎨','📷','🎬','🎧','✈️','🧩','🎵','📸',
  '👕','💇','🪒','🧖','🌸','💅','🚰','🔥','🏆','✅'
];
const WD_FULL = { en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], ar:['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] };
const WD_LONG = { en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], ar:['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] };
// compact headers for the weekly matrix (7 columns must fit without scrolling)
const WD_SHORT = { en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], ar:['أحد','اثن','ثلا','أرب','خمي','جمع','سبت'] };
const DEFAULT_COLOR = HABIT_COLORS[0];
const ALL_DAYS = [0,1,2,3,4,5,6];

let habitDay = dateOnly(new Date());          // selected day in the rail
let weekStart = mondayOf(new Date());         // Monday of the viewed week
let addColor = DEFAULT_COLOR;
let addIcon  = '⭐';
let addDays  = ALL_DAYS.slice();

function mondayOf(d){ const m = dateOnly(d); m.setDate(m.getDate() - ((m.getDay()+6)%7)); return m; }
function habitDays(h){ return (Array.isArray(h.days) && h.days.length) ? h.days : ALL_DAYS; }
function scheduledOn(h, d){ return habitDays(h).includes(d.getDay()); }
function habitGoalNum(h){ return (h.goal && h.goal > 0) ? h.goal : 1; }
function isMeasurable(h){ return !!(h.goal && h.goal > 0); }
function habitAmount(h, key){ return (h.log && h.log[key]) || 0; }
function habitDoneOn(h, d){ return habitAmount(h, dstr(d)) >= habitGoalNum(h); }

// One-time repair: habit log keys written before the timezone fix were stored
// one day early on UTC+ devices (toISOString rolled local midnight back a day).
// Shift them forward so existing streaks/history land on the right dates.
(function fixLegacyLogDates(){
  if(localStorage.getItem('aziz_tzfix_v1')) return;
  try{
    // getTimezoneOffset() is negative for UTC+ zones — only those were affected.
    if(new Date().getTimezoneOffset() < 0){
      const raw = localStorage.getItem('aziz_habits');
      if(raw){
        const items = JSON.parse(raw);
        items.forEach(h => {
          if(!h || !h.log) return;
          const moved = {};
          Object.keys(h.log).forEach(k => {
            const d = new Date(k + 'T00:00:00');
            if(isNaN(d)){ moved[k] = h.log[k]; return; }
            d.setDate(d.getDate() + 1);
            moved[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`] = h.log[k];
          });
          h.log = moved;
        });
        localStorage.setItem('aziz_habits', JSON.stringify(items));
      }
    }
  }catch(e){}
  localStorage.setItem('aziz_tzfix_v1', '1');
})();

function loadHabits(){
  const raw = localStorage.getItem('aziz_habits');
  if(raw === null){
    const seed = [
      { id:'seed1', text:'Drink water',   days:ALL_DAYS.slice(), goal:2000, unit:'ml', icon:'💧', image:null, color:'#38BDF8', order:0, log:{} },
      { id:'seed2', text:'Take vitamins', days:ALL_DAYS.slice(), goal:null, unit:null, icon:'💊', image:null, color:'#4ADE80', order:1, log:{} }
    ];
    localStorage.setItem('aziz_habits', JSON.stringify(seed));
    return seed;
  }
  let items;
  try{ items = JSON.parse(raw); }catch(e){ return []; }
  let migrated = false;
  items = items.map((h, i) => {
    let nh = h;
    if(!nh.log){                                          // migrate oldest check habits (history[] -> log)
      migrated = true;
      const hist = nh.history || (nh.lastDone ? [nh.lastDone] : []);
      const log = {}; hist.forEach(d => { log[d] = 1; });
      nh = { id:nh.id, text:nh.text, goal:null, unit:null, log };
    }
    if(!Array.isArray(nh.days)){                          // freq -> weekday schedule (all days)
      migrated = true;
      nh = Object.assign({}, nh, { days: ALL_DAYS.slice() });
      delete nh.freq;
    }
    if(nh.icon === undefined || nh.color === undefined || nh.image === undefined || nh.order === undefined){
      migrated = true;
      nh = Object.assign({ icon:'⭐', color:DEFAULT_COLOR, image:null, order:i }, nh);
    }
    return nh;
  });
  if(migrated) localStorage.setItem('aziz_habits', JSON.stringify(items));
  return items;
}
function saveHabits(h){ localStorage.setItem('aziz_habits', JSON.stringify(h)); }

// Streak = consecutive SCHEDULED days (up to today) that were completed.
function computeStreak(h){
  const today = dateOnly(new Date());
  let cur = new Date(today);
  if(scheduledOn(h, cur) && !habitDoneOn(h, cur)) cur.setDate(cur.getDate() - 1); // today may still be in progress
  let count = 0, guard = 0;
  while(guard++ < 420){
    if(scheduledOn(h, cur)){ if(habitDoneOn(h, cur)) count++; else break; }
    cur.setDate(cur.getDate() - 1);
  }
  return count;
}
function quickChips(h){
  const u = (h.unit || '').toLowerCase();
  if(u === 'ml' || u === 'مل') return [250, 500];
  if(u.includes('time') || u.includes('مر')) return [1];
  if(u.includes('page') || u.includes('صفح')) return [5, 10];
  const g = habitGoalNum(h);
  return g >= 8 ? [1, Math.max(2, Math.round(g/4))] : [1];
}
function colorSwatches(sel){
  return HABIT_COLORS.map(c => `<button type="button" class="swatch ${c===sel?'active':''}" data-color="${c}" style="--c:${c}"></button>`).join('');
}
function emojiButtons(){
  return EMOJI_SUGGEST.map(e => `<button type="button" class="emoji-btn">${e}</button>`).join('');
}
function daysPicker(sel){
  const lbl = WD_LONG[lang] || WD_LONG.en;
  return ALL_DAYS.map(d => `<button type="button" class="day-toggle ${sel.includes(d)?'on':''}" data-day="${d}">${lbl[d]}</button>`).join('');
}
// average completion of scheduled habits on a given date (null if none scheduled)
function dayCompletion(items, d){
  const sched = items.filter(h => scheduledOn(h, d));
  if(!sched.length) return null;
  return sched.filter(h => habitDoneOn(h, d)).length / sched.length;
}

function renderWeekStrip(){
  const items = loadHabits();
  const today = dateOnly(new Date());
  const wd = WD_FULL[lang] || WD_FULL.en;
  const strip = document.getElementById('weekStrip');
  const CIRC = 62.83; // 2*pi*10
  let html = '';
  for(let i=0; i<7; i++){
    const d = new Date(weekStart); d.setDate(weekStart.getDate()+i);
    const sel = d.getTime() === habitDay.getTime();
    const isToday = d.getTime() === today.getTime();
    const frac = dayCompletion(items, d);
    const offset = frac == null ? CIRC : CIRC * (1 - frac);
    html += `<button class="ws-day ${sel?'sel':''} ${isToday?'today':''}" data-date="${dstr(d)}">
      <span class="ws-wd">${wd[d.getDay()]}</span>
      <span class="ws-ring">
        <svg viewBox="0 0 28 28" width="32" height="32">
          <circle class="ws-track" cx="14" cy="14" r="10"></circle>
          <circle class="ws-fill" cx="14" cy="14" r="10" stroke-dasharray="${CIRC}" stroke-dashoffset="${offset}"></circle>
        </svg>
        <span class="ws-num mono">${d.getDate()}</span>
      </span>
    </button>`;
  }
  strip.innerHTML = html;
  const end = new Date(weekStart); end.setDate(weekStart.getDate()+6);
  const p = n => String(n).padStart(2,'0');
  document.getElementById('weekRange').textContent =
    `${p(weekStart.getDate())}/${p(weekStart.getMonth()+1)} ~ ${p(end.getDate())}/${p(end.getMonth()+1)}`;
}

function renderHabits(){
  const all = loadHabits().slice().sort((a,b) => (a.order||0)-(b.order||0));
  const items = all.filter(h => scheduledOn(h, habitDay));
  const el = document.getElementById('habitList');
  if(!items.length){ el.innerHTML = `<div class="empty">${t('noHabitsToday')}</div>`; return; }
  const key = dstr(habitDay);
  el.innerHTML = items.map(h => {
    const amt = habitAmount(h, key);
    const goal = habitGoalNum(h);
    const done = amt >= goal;
    const measurable = isMeasurable(h);
    const streak = computeStreak(h);
    const countText = `${amt}/${h.goal || 1}${h.unit ? ' ' + escapeHtml(h.unit) : ''}`;
    const iconHtml = h.image ? `<img src="${h.image}" alt="">` : (h.icon || '⭐');
    const chips = measurable
      ? `<div class="habit-log">
           ${quickChips(h).map(a => `<button class="qadd" data-action="add" data-amt="${a}">+${a}</button>`).join('')}
           <input class="qadd-input mono" type="number" inputmode="numeric" placeholder="${t('addAmountPh')}">
           <button class="qadd" data-action="addcustom">+</button>
         </div>`
      : '';
    const panel = `<div class="hcard-panel">
        ${chips}
        <div class="picker-label">${t('iconLabel')}</div>
        <div class="icon-row">
          <input class="edit-icon icon-input" maxlength="2" value="${escapeHtml(h.icon||'⭐')}">
          <div class="emoji-grid">${emojiButtons()}</div>
        </div>
        <div class="picker-label">${t('colorLabel')}</div>
        <div class="color-row edit-colors">${colorSwatches(h.color||DEFAULT_COLOR)}</div>
        <div class="picker-label">${t('repeatLabel')}</div>
        <div class="days-row edit-days">${daysPicker(habitDays(h))}</div>
        <div class="row2">
          <input class="edit-goal efield mono" type="number" inputmode="numeric" value="${h.goal||''}" placeholder="${t('goalPh')}">
          <input class="edit-unit efield" type="text" value="${escapeHtml(h.unit||'')}" placeholder="${t('unitPh')}">
        </div>
        <div class="panel-actions">
          <button class="primary" data-action="saveedit">${t('save')}</button>
          <button class="btn-del" data-action="del">🗑️ ${t('deleteWord')}</button>
        </div>
        <div class="panel-hint">${t('editHint')}</div>
      </div>`;
    return `<div class="hcard ${done?'done':''}" data-id="${h.id}" style="--c:${h.color||DEFAULT_COLOR}">
        <div class="hcard-main">
          <div class="hcard-tap" data-action="expand">
            <div class="hcard-icon ${h.image?'has-img':''}">${iconHtml}</div>
            <div class="hcard-body">
              <div class="hcard-name">${escapeHtml(h.text)}</div>
              <div class="hcard-count mono">${countText}</div>
            </div>
            ${streak > 0 ? `<div class="hcard-streak">🔥 ${streak}</div>` : ''}
          </div>
          <button class="hcard-check ${done?'done':''}" data-action="toggle">✓</button>
        </div>
        ${panel}
      </div>`;
  }).join('');
  const ss = document.getElementById('summarySheet');
  if(ss && ss.classList.contains('open')) renderSummary();
}

// ---- Week rail: pick day + navigate weeks ----
// Selecting a day only re-flags the existing buttons. Rebuilding the whole
// strip on every tap replaced the very element being tapped, which can make a
// touch get dropped mid-gesture on iOS.
function setWeekStripSelection(){
  const key = dstr(habitDay);
  document.querySelectorAll('#weekStrip .ws-day').forEach(b => {
    b.classList.toggle('sel', b.dataset.date === key);
  });
}
document.getElementById('weekStrip').addEventListener('click', e => {
  const b = e.target.closest('[data-date]'); if(!b) return;
  habitDay = dateOnly(new Date(b.dataset.date + 'T00:00:00'));
  setWeekStripSelection();
  renderHabits();
});
document.getElementById('weekPrev').addEventListener('click', () => { weekStart.setDate(weekStart.getDate()-7); renderWeekStrip(); });
document.getElementById('weekNext').addEventListener('click', () => { weekStart.setDate(weekStart.getDate()+7); renderWeekStrip(); });

// ---- Add-form pickers ----
function setupHabitAddPickers(){
  document.getElementById('emojiSuggest').innerHTML = emojiButtons();
  document.getElementById('habitColorRow').innerHTML = colorSwatches(addColor);
  document.getElementById('habitDaysSel').innerHTML = daysPicker(addDays);
  document.getElementById('habitIcon').value = addIcon;
}
document.getElementById('emojiSuggest').addEventListener('click', e => {
  const b = e.target.closest('.emoji-btn'); if(!b) return;
  addIcon = b.textContent; document.getElementById('habitIcon').value = addIcon;
});
document.getElementById('habitIcon').addEventListener('input', e => { addIcon = e.target.value.trim() || '⭐'; });
document.getElementById('habitColorRow').addEventListener('click', e => {
  const b = e.target.closest('[data-color]'); if(!b) return;
  addColor = b.dataset.color;
  document.querySelectorAll('#habitColorRow .swatch').forEach(x => x.classList.toggle('active', x === b));
});
document.getElementById('habitDaysSel').addEventListener('click', e => {
  const b = e.target.closest('[data-day]'); if(!b) return;
  const d = Number(b.dataset.day);
  if(addDays.includes(d)) addDays = addDays.filter(x => x !== d); else addDays.push(d);
  b.classList.toggle('on');
});
document.getElementById('habitAdd').addEventListener('click', () => {
  const input = document.getElementById('habitInput');
  const text = input.value.trim(); if(!text) return;
  const goalVal = document.getElementById('habitGoal').value;
  const unitVal = document.getElementById('habitUnit').value.trim();
  const days = addDays.length ? addDays.slice().sort((a,b)=>a-b) : ALL_DAYS.slice();
  const all = loadHabits();
  const maxOrder = all.reduce((m,h) => Math.max(m, h.order||0), -1);
  all.push({ id: Date.now().toString(), text, days,
    goal: goalVal ? Number(goalVal) : null, unit: unitVal || null,
    icon: (document.getElementById('habitIcon').value.trim() || '⭐'), image:null, color: addColor, order:maxOrder+1, log:{} });
  saveHabits(all);
  input.value = ''; document.getElementById('habitGoal').value = ''; document.getElementById('habitUnit').value = '';
  addIcon = '⭐'; document.getElementById('habitIcon').value = addIcon;
  document.getElementById('habitSheet').classList.remove('open');
  renderWeekStrip(); renderHabits();
});

// ---- New Habit sheet (opened from the header + button) ----
function openHabitSheet(){
  addColor = DEFAULT_COLOR; addIcon = '⭐';
  // default the repeat to the day currently selected in the rail, so adding a
  // habit while viewing e.g. Thursday creates it on Thursday
  addDays = [habitDay.getDay()];
  document.getElementById('habitInput').value = '';
  document.getElementById('habitGoal').value = '';
  document.getElementById('habitUnit').value = '';
  setupHabitAddPickers();
  document.getElementById('habitSheet').classList.add('open');
}
document.getElementById('newHabitBtn').addEventListener('click', openHabitSheet);
document.getElementById('habitCancel').addEventListener('click', () => {
  document.getElementById('habitSheet').classList.remove('open');   // close without adding
});
document.querySelectorAll('[data-close-sheet]').forEach(b =>
  b.addEventListener('click', () => b.closest('.settings-sheet').classList.remove('open')));

// ---- Weekly summary grid (opened from the header sheet-of-paper button) ----
let sumWeekStart = mondayOf(new Date());
function openSummary(){ renderSummary(); document.getElementById('summarySheet').classList.add('open'); }
document.getElementById('summaryBtn').addEventListener('click', openSummary);
document.getElementById('sumPrev').addEventListener('click', () => { sumWeekStart.setDate(sumWeekStart.getDate()-7); renderSummary(); });
document.getElementById('sumNext').addEventListener('click', () => { sumWeekStart.setDate(sumWeekStart.getDate()+7); renderSummary(); });

// Matrix layout (like a printed habit tracker): habits down the side, the 7
// days across the top. Sized to fit the screen — no horizontal swiping.
function renderSummary(){
  const items = loadHabits().slice().sort((a,b) => (a.order||0)-(b.order||0));
  const el = document.getElementById('summaryGrid');
  const short = WD_SHORT[lang] || WD_SHORT.en;
  const today = dateOnly(new Date()).getTime();
  const cols = [];
  for(let i=0; i<7; i++){ const d = new Date(sumWeekStart); d.setDate(sumWeekStart.getDate()+i); cols.push(d); } // Mon..Sun

  if(!items.length){
    el.innerHTML = `<div class="empty">${t('habitEmpty')}</div>`;
  } else {
    const head = `<tr><th class="hm-corner"></th>` +
      cols.map(d => `<th class="${d.getTime()===today?'is-today':''}">
        <span class="hm-wd">${short[d.getDay()]}</span>
        <span class="hm-dn mono">${d.getDate()}</span>
      </th>`).join('') + `<th class="hm-sum">✓</th></tr>`;

    const rows = items.map(h => {
      let done = 0, sched = 0, missed = 0;
      const cells = cols.map(d => {
        if(!scheduledOn(h, d)) return `<td><span class="hm-cell na"></span></td>`;
        sched++;
        const isDone = habitDoneOn(h, d);
        if(isDone){ done++; return `<td><span class="hm-cell done" style="--c:${h.color||DEFAULT_COLOR}">✓</span></td>`; }
        // a scheduled day already in the past that was not completed = missed
        if(d.getTime() < today){ missed++; return `<td><span class="hm-cell missed">✕</span></td>`; }
        return `<td><span class="hm-cell pending" style="--c:${h.color||DEFAULT_COLOR}"></span></td>`;
      }).join('');
      const icon = h.image ? `<img src="${h.image}" alt="">` : (h.icon || '⭐');
      return `<tr>
        <td class="hm-name">
          <span class="hm-ic">${icon}</span><span class="hm-tx">${escapeHtml(h.text)}</span>
          ${missed ? `<span class="hm-missed-tag">-${missed}</span>` : ''}
        </td>
        ${cells}
        <td class="hm-sum mono">${done}/${sched}</td>
      </tr>`;
    }).join('');

    el.innerHTML = `<div class="hm-wrap"><table class="hm-grid">${head}${rows}</table></div>
      <div class="hm-legend">
        <span><i class="hm-cell done sample">✓</i>${t('legDone')}</span>
        <span><i class="hm-cell missed sample">✕</i>${t('legMissed')}</span>
        <span><i class="hm-cell pending sample"></i>${t('legPending')}</span>
        <span><i class="hm-cell na sample"></i>${t('legOff')}</span>
      </div>`;
  }
  const end = new Date(sumWeekStart); end.setDate(sumWeekStart.getDate()+6);
  const p = n => String(n).padStart(2,'0');
  document.getElementById('sumRange').textContent =
    `${p(sumWeekStart.getDate())}/${p(sumWeekStart.getMonth()+1)} ~ ${p(end.getDate())}/${p(end.getMonth()+1)}`;
}

// ---- Card interactions ----
document.getElementById('habitList').addEventListener('click', e => {
  const card = e.target.closest('.hcard'); if(!card) return;
  const id = card.dataset.id;
  let items = loadHabits();
  const idx = items.findIndex(h => h.id === id);
  if(idx === -1) return;
  const h = items[idx];

  // in-panel pickers handled before data-action:
  const emojiBtn = e.target.closest('.hcard-panel .emoji-btn');
  if(emojiBtn){ card.querySelector('.edit-icon').value = emojiBtn.textContent; return; }
  const swatch = e.target.closest('.hcard-panel .swatch');
  if(swatch){ card.querySelectorAll('.edit-colors .swatch').forEach(s => s.classList.remove('active')); swatch.classList.add('active'); return; }
  const dayTog = e.target.closest('.hcard-panel .day-toggle');
  if(dayTog){ dayTog.classList.toggle('on'); return; }

  const action = e.target.dataset.action || ((e.target.closest('[data-action]') || {}).dataset || {}).action;
  const key = dstr(habitDay);
  h.log = h.log || {};
  if(action === 'del'){
    if(!confirm(t('confirmDelete'))) return;          // deleting drops its history — confirm first
    items.splice(idx,1); saveHabits(items); renderWeekStrip(); renderHabits();
  }
  else if(action === 'toggle'){
    const goal = habitGoalNum(h);
    if(habitAmount(h, key) >= goal) delete h.log[key]; else h.log[key] = goal;
    saveHabits(items); renderWeekStrip(); renderHabits();
  } else if(action === 'expand'){
    card.querySelector('.hcard-panel').classList.toggle('open');
  } else if(action === 'add'){
    h.log[key] = (h.log[key] || 0) + (Number(e.target.dataset.amt) || 0);
    saveHabits(items); renderWeekStrip(); renderHabits();
  } else if(action === 'addcustom'){
    const amt = Number(card.querySelector('.qadd-input').value) || 0;
    if(!amt) return;
    h.log[key] = Math.max(0, (h.log[key] || 0) + amt);
    saveHabits(items); renderWeekStrip(); renderHabits();
  } else if(action === 'saveedit'){
    const p = card.querySelector('.hcard-panel');
    const sw = p.querySelector('.edit-colors .swatch.active');
    const days = Array.from(p.querySelectorAll('.edit-days .day-toggle.on')).map(b => Number(b.dataset.day));
    h.days = days.length ? days.sort((a,b)=>a-b) : ALL_DAYS.slice();
    h.icon = p.querySelector('.edit-icon').value.trim() || '⭐';
    h.color = sw ? sw.dataset.color : (h.color || DEFAULT_COLOR);
    const gv = p.querySelector('.edit-goal').value;
    const uv = p.querySelector('.edit-unit').value.trim();
    h.goal = gv ? Number(gv) : null; h.unit = uv || null;
    saveHabits(items); renderWeekStrip(); renderHabits();
  }
});

// ============================================================
//  Food log
// ============================================================
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
  if(!items.length){ el.innerHTML = `<div class="empty">${t('foodEmpty')}</div>`; return; }
  el.innerHTML = items.map(f => {
    const d = new Date(f.ts);
    return `<div class="item-row" data-id="${f.id}">
      <div style="flex:1; min-width:0;">
        <div class="item-text">${escapeHtml(f.text)}</div>
        <div class="item-meta mono">${fmtTime(d)}${f.cal ? ' — ' + f.cal + ' ' + t('calUnit') : ''}</div>
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

// ============================================================
//  Content ideas
// ============================================================
function loadIdeas(){ try{ return JSON.parse(localStorage.getItem('aziz_ideas')||'[]'); }catch(e){ return []; } }
function saveIdeas(items){ localStorage.setItem('aziz_ideas', JSON.stringify(items)); }
let ideaFilter = 'all';
let selectedAcct = 'tech';

// ---- Idea categories (user-managed) ----
function loadCats(){
  try{ const c = JSON.parse(localStorage.getItem('aziz_idea_cats')); if(Array.isArray(c) && c.length) return c; }catch(e){}
  const def = [{ id:'tech', emoji:'🎬', name:'Tech' }, { id:'chef', emoji:'🍳', name:'Cooking' }];
  localStorage.setItem('aziz_idea_cats', JSON.stringify(def));
  return def;
}
function saveCats(c){ localStorage.setItem('aziz_idea_cats', JSON.stringify(c)); }
function catById(id){ return loadCats().find(c => c.id === id); }
function catEmoji(id){ const c = catById(id); return c ? c.emoji : '🏷️'; }
function catLabel(id){ const c = catById(id); return c ? `${c.emoji} ${escapeHtml(c.name)}` : '🏷️ —'; }

function renderIdeaControls(){
  const cats = loadCats();
  if(!cats.some(c => c.id === selectedAcct)) selectedAcct = cats.length ? cats[0].id : '';
  if(ideaFilter !== 'all' && !cats.some(c => c.id === ideaFilter)) ideaFilter = 'all';
  document.getElementById('acctToggle').innerHTML = cats.map(c =>
    `<button type="button" class="acct-btn ${c.id===selectedAcct?'active':''}" data-acct="${c.id}">${c.emoji} ${escapeHtml(c.name)}</button>`).join('');
  document.getElementById('ideaFilters').innerHTML =
    `<button type="button" class="filter-chip ${ideaFilter==='all'?'active':''}" data-filter="all">${t('filterAll')}</button>` +
    cats.map(c => `<button type="button" class="filter-chip ${ideaFilter===c.id?'active':''}" data-filter="${c.id}">${c.emoji} ${escapeHtml(c.name)}</button>`).join('');
}

function fmtShortDate(dateStr){
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTHS()[d.getMonth()]}`;
}

function renderIdeas(){
  renderIdeaControls();
  const all = loadIdeas().slice().sort((a,b)=> b.ts - a.ts);
  const items = ideaFilter === 'all' ? all : all.filter(i => i.acct === ideaFilter);
  const el = document.getElementById('ideaList');
  if(!items.length){ el.innerHTML = `<div class="empty">${t('ideaEmpty')}</div>`; renderScheduled(); return; }
  el.innerHTML = items.map(i => `
    <div class="idea-card" data-id="${i.id}">
      <div class="idea-head">
        <span class="idea-tag">${catLabel(i.acct)}</span>
        <div class="item-text" style="flex:1;">${escapeHtml(i.title)}</div>
        ${i.pubDate ? `<span class="idea-date-badge" data-action="date">📆 ${fmtShortDate(i.pubDate)}</span>` : `<button class="icon-btn" data-action="date">📆</button>`}
        <button class="icon-btn" data-action="edit">✏️</button>
        <button class="icon-btn" data-action="del">✕</button>
      </div>
      ${i.script
        ? `<div class="idea-script" data-action="edit">${escapeHtml(i.script)}</div>`
        : `<div class="idea-script empty-script" data-action="edit">${t('ideaNoScript')}</div>`}
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
    <div class="sc-title">${t('scheduledTitle')}</div>
    ${items.map(i => `<div class="sched-row">
        <div class="when">${fmtShortDate(i.pubDate)}</div>
        <div class="title">${catEmoji(i.acct)} ${escapeHtml(i.title)}</div>
      </div>`).join('')}
  </div>`;
}

document.getElementById('acctToggle').addEventListener('click', e => {
  const b = e.target.closest('[data-acct]'); if(!b) return;
  selectedAcct = b.dataset.acct;
  renderIdeaControls();
});

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

document.getElementById('ideaFilters').addEventListener('click', e => {
  const b = e.target.closest('[data-filter]'); if(!b) return;
  ideaFilter = b.dataset.filter;
  renderIdeas();
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

// ---- Category manager (opened from the Ideas header + button) ----
function renderCatList(){
  const cats = loadCats();
  const el = document.getElementById('catList');
  el.innerHTML = cats.length ? cats.map(c => `<div class="cat-row" data-id="${c.id}">
      <span class="cat-emoji">${c.emoji}</span>
      <span class="cat-name">${escapeHtml(c.name)}</span>
      <button class="btn-del" data-action="delcat" aria-label="Delete">🗑️</button>
    </div>`).join('') : `<div class="empty">${t('ideaEmpty')}</div>`;
}
document.getElementById('ideasBtn').addEventListener('click', () => {
  renderCatList();
  document.getElementById('catsSheet').classList.add('open');
});
document.getElementById('catAdd').addEventListener('click', () => {
  const name = document.getElementById('catName').value.trim();
  const emoji = document.getElementById('catEmoji').value.trim() || '🏷️';
  if(!name) return;
  const cats = loadCats();
  cats.push({ id: 'c' + Date.now().toString(), emoji, name });
  saveCats(cats);
  document.getElementById('catName').value = '';
  document.getElementById('catEmoji').value = '🏷️';
  renderCatList(); renderIdeaControls(); renderIdeas();
});
document.getElementById('catList').addEventListener('click', e => {
  const row = e.target.closest('.cat-row'); if(!row) return;
  if(e.target.dataset.action !== 'delcat') return;
  const id = row.dataset.id;
  saveCats(loadCats().filter(c => c.id !== id));
  if(selectedAcct === id) selectedAcct = '';
  if(ideaFilter === id) ideaFilter = 'all';
  renderCatList(); renderIdeaControls(); renderIdeas();
});

// ============================================================
//  Tabs
// ============================================================
document.querySelectorAll('nav.bottom button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('nav.bottom button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('section.panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.getElementById('panel-'+tab).classList.add('active');
    const hdr = document.querySelector('header.top');
    hdr.classList.toggle('habits-active', tab === 'habits');
    hdr.classList.toggle('ideas-active', tab === 'ideas');
  });
});

function escapeHtml(str){ const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }

// ============================================================
//  Settings: language / theme / shift rotation
// ============================================================
function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
  applyAppTitle();
  const ti = document.getElementById('appTitleInput');
  if(ti && document.activeElement !== ti) ti.value = appTitle;
}
function applyAppTitle(){
  const title = (appTitle && appTitle.trim()) || t('appName');
  document.title = title;
  document.querySelectorAll('[data-i18n="appName"]').forEach(el => { el.textContent = title; });
}
function applyLangDir(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
function applyTheme(){
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', theme === 'starry' ? '#050414' : '#000000');
}
function rerenderAll(){
  applyStaticI18n();
  renderMonthGrid();
  renderQuickView(quickViewDays);
  renderAppt(); renderUpcomingWidget();
  renderTasks(); renderWeekStrip(); renderHabits(); renderFood(); renderIdeas();
  updateHero();
  renderSettings();
}

function renderSettings(){
  const bb = document.getElementById('buildBadge');
  if(bb) bb.textContent = `build ${APP_BUILD}`;
  // language + theme active states
  document.querySelectorAll('#settingsSheet [data-set-lang]').forEach(b =>
    b.classList.toggle('active', b.dataset.setLang === lang));
  document.querySelectorAll('#settingsSheet [data-set-theme]').forEach(b =>
    b.classList.toggle('active', b.dataset.setTheme === theme));
  // shift rotation options (5 phases)
  const todayDiff = Math.round((dateOnly(new Date()) - ANCHOR) / 86400000);
  const wrap = document.getElementById('shiftOptions');
  let html = '';
  for(let p = 0; p < 5; p++){
    const key = CYCLE[((todayDiff + p) % 5 + 5) % 5];
    const info = SHIFT_INFO[key];
    html += `<button type="button" class="shift-opt ${p===shiftPhase?'active':''}" data-set-phase="${p}">
      <span class="so-name">${t('shiftLabel')} ${p+1}</span>
      <span class="so-hint"><span class="so-swatch" style="background:${info.hex}"></span>${t('shiftTodayIs')}: ${shiftLabel(key)}</span>
    </button>`;
  }
  wrap.innerHTML = html;
}

document.getElementById('settingsBtn').addEventListener('click', () => {
  renderSettings();
  document.getElementById('settingsSheet').classList.add('open');
});
document.getElementById('appTitleInput').addEventListener('input', e => {
  appTitle = e.target.value;
  if(appTitle.trim()) saveSetting('aziz_title', appTitle); else localStorage.removeItem('aziz_title');
  applyAppTitle();
});
document.querySelectorAll('#settingsSheet [data-close-settings]').forEach(b =>
  b.addEventListener('click', () => document.getElementById('settingsSheet').classList.remove('open')));

document.getElementById('settingsSheet').addEventListener('click', e => {
  const langBtn  = e.target.closest('[data-set-lang]');
  const themeBtn = e.target.closest('[data-set-theme]');
  const phaseBtn = e.target.closest('[data-set-phase]');
  if(langBtn){
    lang = langBtn.dataset.setLang; saveSetting('aziz_lang', lang);
    applyLangDir(); rerenderAll();
  } else if(themeBtn){
    theme = themeBtn.dataset.setTheme; saveSetting('aziz_theme', theme);
    applyTheme(); renderSettings();
  } else if(phaseBtn){
    shiftPhase = parseInt(phaseBtn.dataset.setPhase, 10); saveSetting('aziz_shift_phase', shiftPhase);
    renderMonthGrid(); renderQuickView(quickViewDays); updateHero(); renderSettings();
  }
});

// ============================================================
//  Init
// ============================================================
applyLangDir();
applyTheme();
document.getElementById('apptDate').value = todayStr();
applyStaticI18n();
setupHabitAddPickers();
setupApptRepeat();
renderMonthGrid(); renderAppt(); renderUpcomingWidget(); renderTasks(); renderWeekStrip(); renderHabits(); renderFood(); renderIdeas(); updateHero();
setInterval(updateHero, 1000);

// ---------- Service worker (offline / installable PWA) ----------
if('serviceWorker' in navigator){
  // If a NEW service worker takes over an already-running app, reload once so
  // the page actually picks up the new code instead of staying on the old one.
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(!hadController || reloaded) return;   // first install => nothing to refresh
    reloaded = true;
    location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(reg => {
      reg.update();                                   // check for a new build on every launch
      setInterval(() => reg.update(), 60 * 60 * 1000);
    }).catch(() => {});
  });
}
