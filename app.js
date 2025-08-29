/* ========== Core Storage & Seed ========= */
const LS_KEY = 'cp_db';
const nowISO = () => new Date().toISOString();

function seedDB(){
  return {
    doctors: [
      {
        id: crypto.randomUUID(),
        name: 'Dr. Aditi Mehra',
        specialty: 'Cardiology',
        location: 'Vadodara',
        photo: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=400&auto=format&fit=crop',
        slots: ['09:00','10:00','11:30','15:00','16:30']
      },
      {
        id: crypto.randomUUID(),
        name: 'Dr. Rohan Shah',
        specialty: 'General Medicine',
        location: 'Ahmedabad',
        photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=400&auto=format&fit=crop',
        slots: ['09:30','10:30','12:00','14:00','17:00']
      },
      {
        id: crypto.randomUUID(),
        name: 'Dr. Neha Patel',
        specialty: 'Dermatology',
        location: 'Surat',
        photo: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=400&auto=format&fit=crop',
        slots: ['10:00','11:00','13:00','16:00']
      },
      {
        id: crypto.randomUUID(),
        name: 'Dr. Arjun Iyer',
        specialty: 'Orthopedics',
        location: 'Vadodara',
        photo: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=400&auto=format&fit=crop',
        slots: ['09:15','10:45','12:30','15:30']
      }
    ],
    appointments: [],  // {id, patientName, patientMobile, doctorId, date, time, reason, status, createdAt}
    createdAt: nowISO()
  };
}

function getDB(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw){ const db=seedDB(); localStorage.setItem(LS_KEY, JSON.stringify(db)); return db; }
  try{ return JSON.parse(raw); } catch{ const db=seedDB(); localStorage.setItem(LS_KEY, JSON.stringify(db)); return db; }
}
function setDB(db){ localStorage.setItem(LS_KEY, JSON.stringify(db)); }
function resetDB(){ setDB(seedDB()); }

function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return alert(msg);
  t.textContent = msg;
  t.className = 'show';
  setTimeout(()=>{ t.className=''; }, 1800);
}

/* ========== Route Guards ========= */
function protectAdmin(){
  if(localStorage.getItem('cp_admin')!=='true'){ location.href='index.html'; }
}
function protectPatient(){
  const p = localStorage.getItem('cp_currentPatient');
  if(!p){ location.href='index.html'; }
}

/* ========== Helpers ========= */
function $(sel,parent=document){ return parent.querySelector(sel); }
function create(tag, cls, html){ const el=document.createElement(tag); if(cls) el.className=cls; if(html) el.innerHTML=html; return el; }
function fmtDate(d){ return new Date(d+'T00:00:00').toLocaleDateString(); }

/* ========== Patient: Doctors List & Booking ========= */
function renderDoctorsForPatient(){
  const wrap = document.getElementById('docList');
  const db = getDB();
  if(!wrap) return;

  // fill specialties filter once
  const specSel = document.getElementById('specFilter');
  if(specSel && specSel.options.length <= 1){
    [...new Set(db.doctors.map(d=>d.specialty))].sort().forEach(s=>{
      const o=document.createElement('option'); o.value=s; o.textContent=s; specSel.appendChild(o);
    });
  }

  const q = (document.getElementById('searchDoc')?.value || '').toLowerCase();
  const spec = (document.getElementById('specFilter')?.value || '');

  const list = db.doctors.filter(d=>{
    const matchesQ = (d.name+d.specialty+d.location).toLowerCase().includes(q);
    const matchesS = spec ? d.specialty===spec : true;
    return matchesQ && matchesS;
  });

  wrap.innerHTML = '';
  list.forEach(d=>{
    const card = create('div','card__doctor');
    card.innerHTML = `
      <img class="doc__avatar" src="${d.photo}" alt="${d.name}">
      <div class="doc__meta">
        <h4>${d.name}</h4>
        <small>${d.specialty} • ${d.location}</small>
        <div class="doc__tags"></div>
      </div>
      <div class="doc__actions">
        <button class="btn btn--primary" data-book="${d.id}">
          <i class="ri-calendar-event-line"></i> Book
        </button>
      </div>`;
    const tags = card.querySelector('.doc__tags');
    d.slots.slice(0,3).forEach(s=> tags.appendChild(create('span','tag',s)));
    wrap.appendChild(card);
  });

  // delegate click for Booking
  wrap.onclick = (e)=>{
    const btn = e.target.closest('[data-book]');
    if(!btn) return;
    openBookModal(btn.getAttribute('data-book'));
  };
}

function openBookModal(doctorId){
  const db = getDB();
  const d = db.doctors.find(x=>x.id===doctorId);
  const dlg = document.getElementById('bookModal');
  if(!d || !dlg) return;

  $('#bm_doctor').value = `${d.name} • ${d.specialty}`;
  $('#bm_doctorId').value = d.id;

  // date min today
  const dateInput = $('#bm_date');
  const today = new Date(); today.setHours(0,0,0,0);
  dateInput.min = today.toISOString().split('T')[0];
  dateInput.value = dateInput.min;

  // time options (filter out already booked times for that date)
  const timeSel = $('#bm_time');
  function refreshTimes(){
    const chosenDate = dateInput.value;
    const taken = getDB().appointments
      .filter(a => a.doctorId===d.id && a.date===chosenDate && a.status!=='Rejected')
      .map(a => a.time);
    timeSel.innerHTML = '';
    d.slots.forEach(s=>{
      if(!taken.includes(s)){
        const o=document.createElement('option'); o.value=s; o.textContent=s; timeSel.appendChild(o);
      }
    });
    if(!timeSel.options.length){
      const o=document.createElement('option'); o.textContent='No slots left'; o.value=''; timeSel.appendChild(o);
    }
  }
  dateInput.onchange = refreshTimes;
  refreshTimes();

  dlg.showModal();

  // Confirm
  $('#bm_submit').onclick = (e)=>{
    e.preventDefault();
    const t = timeSel.value;
    if(!t){ showToast('No slots available at this time'); return; }
    const reason = ($('#bm_reason').value || '').trim();
    const patient = JSON.parse(localStorage.getItem('cp_currentPatient') || '{}');

    const db2 = getDB();
    db2.appointments.push({
      id: crypto.randomUUID(),
      patientName: patient.name,
      patientMobile: patient.mobile,
      doctorId: d.id,
      date: dateInput.value,
      time: t,
      reason,
      status: 'Pending',
      createdAt: nowISO()
    });
    setDB(db2);
    dlg.close();
    showToast('Appointment request sent');
    renderPatientAppointments();
    renderDoctorsForPatient(); // refresh slot tags
  };
}

function renderPatientAppointments(){
  const tbody = document.getElementById('myAppsBody');
  if(!tbody) return;
  const patient = JSON.parse(localStorage.getItem('cp_currentPatient') || '{}');
  const db = getDB();
  const mine = db.appointments.filter(a => a.patientName === patient.name);

  // stats
  const p = mine.filter(a=>a.status==='Pending').length;
  const ap = mine.filter(a=>a.status==='Approved').length;
  document.getElementById('statPending').textContent = p;
  document.getElementById('statApproved').textContent = ap;
  document.getElementById('statTotal').textContent = mine.length;

  tbody.innerHTML = '';
  mine.sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time)).forEach(a=>{
    const d = db.doctors.find(x=>x.id===a.doctorId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d?.name || '—'}</td>
      <td>${d?.specialty || '—'}</td>
      <td>${fmtDate(a.date)}</td>
      <td>${a.time}</td>
      <td>${badge(a.status)}</td>
      <td class="actionbar">
        <button class="btn btn--ghost" data-cancel="${a.id}"><i class="ri-close-circle-line"></i> Cancel</button>
      </td>`;
    tbody.appendChild(tr);
  });

  // cancel
  tbody.onclick = (e)=>{
    const btn = e.target.closest('[data-cancel]');
    if(!btn) return;
    const id = btn.getAttribute('data-cancel');
    const db2 = getDB();
    const idx = db2.appointments.findIndex(x=>x.id===id);
    if(idx>=0){
      // if already approved, allow cancel but mark rejected
      db2.appointments[idx].status = 'Rejected';
      setDB(db2);
      showToast('Appointment cancelled');
      renderPatientAppointments();
      renderDoctorsForPatient();
    }
  };
}

/* ========== Admin: Overview, Approvals, Doctors ========= */
function badge(status){
  const cls = status==='Approved'?'badge--approved':status==='Rejected'?'badge--rejected':'badge--pending';
  return `<span class="badge ${cls}">${status}</span>`;
}

function renderAdminOverview(){
  const db = getDB();
  const apps = db.appointments;
  const qs = sel => document.getElementById(sel);
  qs('a_total').textContent = apps.length;
  qs('a_pending').textContent = apps.filter(a=>a.status==='Pending').length;
  qs('a_approved').textContent = apps.filter(a=>a.status==='Approved').length;
  qs('a_rejected').textContent = apps.filter(a=>a.status==='Rejected').length;
}

function renderAdminAppointments(){
  const db = getDB();
  const tbody = document.getElementById('a_apps');
  if(!tbody) return;

  const status = document.getElementById('af_status')?.value || '';
  const q = (document.getElementById('af_search')?.value || '').toLowerCase();

  const list = db.appointments
    .filter(a => status ? a.status===status : true)
    .filter(a => {
      const doc = db.doctors.find(d=>d.id===a.doctorId);
      return (a.patientName + (doc?.name||'')).toLowerCase().includes(q);
    })
    .sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time));

  tbody.innerHTML = '';
  list.forEach(a=>{
    const d = db.doctors.find(x=>x.id===a.doctorId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.patientName}</td>
      <td>${d?.name || '—'}</td>
      <td>${d?.specialty || '—'}</td>
      <td>${fmtDate(a.date)}</td>
      <td>${a.time}</td>
      <td>${badge(a.status)}</td>
      <td class="actionbar">
        <button class="btn btn--primary" data-approve="${a.id}"><i class="ri-check-line"></i></button>
        <button class="btn btn--ghost" data-reject="${a.id}"><i class="ri-close-line"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });

  // actions
  tbody.onclick = (e)=>{
    const approve = e.target.closest('[data-approve]');
    const reject = e.target.closest('[data-reject]');
    if(!approve && !reject) return;
    const id = (approve||reject).getAttribute('data-approve') || (approve||reject).getAttribute('data-reject');
    const db2 = getDB();
    const idx = db2.appointments.findIndex(a=>a.id===id);
    if(idx<0) return;

    // ensure slot still free if approving
    if(approve){
      const a = db2.appointments[idx];
      const conflict = db2.appointments.some(x => x.id!==a.id && x.doctorId===a.doctorId && x.date===a.date && x.time===a.time && x.status==='Approved');
      if(conflict){ showToast('Slot conflict! Choose reject or edit.'); return; }
      db2.appointments[idx].status = 'Approved';
    } else {
      db2.appointments[idx].status = 'Rejected';
    }
    setDB(db2);
    showToast('Updated');
    renderAdminOverview();
    renderAdminAppointments();
  };
}

function renderAdminDoctors(){
  const wrap = document.getElementById('a_docs');
  if(!wrap) return;
  const db = getDB();
  wrap.innerHTML = '';
  db.doctors.forEach(d=>{
    const card = create('div','card__doctor');
    card.innerHTML = `
      <img class="doc__avatar" src="${d.photo}" alt="${d.name}">
      <div class="doc__meta">
        <h4>${d.name}</h4>
        <small>${d.specialty} • ${d.location}</small>
        <div class="doc__tags">${d.slots.map(s=>`<span class="tag">${s}</span>`).join('')}</div>
      </div>
      <div class="doc__actions">
        <button class="btn btn--ghost" data-remove="${d.id}"><i class="ri-delete-bin-6-line"></i> Remove</button>
      </div>`;
    wrap.appendChild(card);
  });

  wrap.onclick = (e)=>{
    const btn = e.target.closest('[data-remove]');
    if(!btn) return;
    const id = btn.getAttribute('data-remove');
    const db2 = getDB();
    // prevent removing a doctor with approved future appointments
    const hasFuture = db2.appointments.some(a => a.doctorId===id && a.status==='Approved' && new Date(a.date) >= new Date());
    if(hasFuture){ showToast('Cannot remove: doctor has approved upcoming appointments'); return; }
    db2.doctors = db2.doctors.filter(d=>d.id!==id);
    setDB(db2);
    showToast('Doctor removed');
    renderAdminDoctors();
  };
}

function addDoctorFromForm(){
  const name = document.getElementById('d_name').value.trim();
  const spec = document.getElementById('d_spec').value.trim();
  const loc = document.getElementById('d_loc').value.trim();
  const slots = document.getElementById('d_slots').value.split(',').map(s=>s.trim()).filter(Boolean);
  if(!name || !spec || !loc || !slots.length){ showToast('Fill all doctor fields'); return; }
  const photos = [
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555448248-2571daf6344b?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=400&auto=format&fit=crop'
  ];
  const db = getDB();
  db.doctors.unshift({
    id: crypto.randomUUID(),
    name, specialty: spec, location: loc,
    photo: photos[Math.floor(Math.random()*photos.length)],
    slots
  });
  setDB(db);
  document.getElementById('addDoctor').reset();
  showToast('Doctor added');
  renderAdminDoctors();
}

/* ========== Tiny Toast ========== */
(function initToast(){
  const t = document.getElementById('toast');
  if(!t) return;
  const css = `
  #toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);background:#06111f;border:1px solid #1e2c50;color:#cde9f7;padding:10px 14px;border-radius:10px;opacity:0;pointer-events:none;transition:all .25s;box-shadow:0 10px 25px rgba(0,0,0,.35)}
  #toast.show{opacity:1;transform:translateX(-50%) translateY(0)}`;
  const s = document.createElement('style'); s.innerHTML = css; document.head.appendChild(s);
})();

/* ========== Expose for HTML pages ========== */
window.protectAdmin = protectAdmin;
window.protectPatient = protectPatient;
window.renderDoctorsForPatient = renderDoctorsForPatient;
window.renderPatientAppointments = renderPatientAppointments;
window.renderAdminOverview = renderAdminOverview;
window.renderAdminAppointments = renderAdminAppointments;
window.renderAdminDoctors = renderAdminDoctors;
window.addDoctorFromForm = addDoctorFromForm;
window.showToast = showToast;
