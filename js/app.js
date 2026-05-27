/**
 * DR. RAHMA MERSI PLATFORM — MAIN APPLICATION
 */

'use strict';

// ══════════════════════════════════
//  SCREEN MANAGEMENT
// ══════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ══════════════════════════════════
//  TOAST NOTIFICATION
// ══════════════════════════════════
let toastTimer = null;
function toast(msg, type = 'info') {
  const el   = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const text = document.getElementById('toastMsg');
  const icons = { info: '🔐', success: '✅', warn: '⚠️', danger: '🚫' };
  icon.textContent = icons[type] || '🔔';
  text.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

// ══════════════════════════════════
//  LOGIN
// ══════════════════════════════════
function togglePassword() {
  const inp = document.getElementById('inpCode');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function doLogin() {
  const name = document.getElementById('inpName').value.trim();
  const code = document.getElementById('inpCode').value.trim().toLowerCase();
  const errBox = document.getElementById('errorBox');
  const errTxt = document.getElementById('errorText');

  // Validate name
  if (!name || name.length < 2) {
    errTxt.textContent = 'يرجى كتابة اسمك الكامل (حرفان على الأقل)';
    errBox.style.display = 'flex';
    document.getElementById('inpName').focus();
    return;
  }
  if (name.length > 60) {
    errTxt.textContent = 'الاسم طويل جداً';
    errBox.style.display = 'flex';
    return;
  }

  // Validate code
  const codeData = STATE.codes[code];
  if (!codeData) {
    Security.logViolation('invalid_code_attempt');
    errTxt.textContent = 'كود الدخول غير صحيح — تم تسجيل هذه المحاولة';
    errBox.style.display = 'flex';
    document.getElementById('inpCode').value = '';
    document.getElementById('inpCode').focus();
    // Shake animation
    const card = document.querySelector('.login-card');
    card.style.animation = 'shake 0.5s ease';
    setTimeout(() => card.style.animation = '', 500);
    return;
  }

  errBox.style.display = 'none';

  // Set user state
  STATE.user = {
    name,
    code,
    role: codeData.role,
    subject: codeData.subject,
    loginTime: new Date().toISOString(),
    id: 'U-' + Date.now().toString(36).toUpperCase()
  };

  // Update UI
  document.getElementById('userAvatar').textContent = name.charAt(0);
  document.getElementById('userName').textContent = name;
  document.getElementById('heroGreeting').textContent = `أهلاً ${name} 👋`;

  // Show admin tab if admin
  if (codeData.role === 'admin') {
    document.getElementById('adminNavBtn').style.display = 'flex';
    renderCodesTable();
  }

  // Render content
  renderVideos();
  renderSubjects();
  renderStudents();

  // Watermarks
  Security.updateWatermarks(name);

  // Start session timer
  Security.startSessionTimer();

  showScreen('screenMain');
  animateStats();

  setTimeout(() => toast(`أهلاً ${name} — دخول آمن ومشفر ✓`, 'success'), 400);
}

function doLogout() {
  STATE.user = null;
  STATE.playing = false;
  STATE.currentVideoId = null;
  document.getElementById('inpName').value = '';
  document.getElementById('inpCode').value = '';
  document.getElementById('adminNavBtn').style.display = 'none';
  showScreen('screenLogin');
}

// ══════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════
function switchTab(name, btn) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.add('active');
}

// ══════════════════════════════════
//  BACK TO MAIN
// ══════════════════════════════════
function backToMain() {
  if (STATE.progressInterval) clearInterval(STATE.progressInterval);
  STATE.playing = false;
  STATE.currentVideoId = null;
  showScreen('screenMain');
}

// ══════════════════════════════════
//  RENDER: VIDEOS
// ══════════════════════════════════
function renderVideos(filter = null) {
  const query   = STATE.searchQuery.toLowerCase();
  const subject = filter ?? STATE.filterSubject;

  let list = VIDEOS;
  if (subject !== 'all') list = list.filter(v => v.subject === subject);
  if (query) list = list.filter(v =>
    v.title.includes(query) || v.subject.includes(query) || v.tags.some(t => t.includes(query))
  );

  document.getElementById('videoCount').textContent = list.length + ' فيديو';
  const grid = document.getElementById('videosGrid');

  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted); font-size:14px;">
      🔍 لا توجد نتائج
    </div>`;
    return;
  }

  grid.innerHTML = list.map((v, i) => `
    <div class="video-card ${v.locked ? 'locked' : ''}"
         style="animation-delay:${i * 0.05}s"
         onclick="${v.locked ? `toast('🔒 محاضرة مقفلة — تحقق من الكود المناسب', 'warn')` : `Player.open(${v.id})`}">
      <div class="card-thumb" style="background: linear-gradient(135deg, ${v.thumb_color}ee, ${v.thumb_color}88);">
        ${v.locked
          ? '<div class="thumb-lock">🔒</div>'
          : `<div class="thumb-play">▶</div>`
        }
        <span class="thumb-subject">${v.subject}</span>
        <span class="thumb-duration">${v.duration}</span>
      </div>
      <div class="card-body">
        <h4>${v.title}</h4>
        <div class="card-meta">
          ${v.locked
            ? `<span class="card-locked-label">🔒 يتطلب كود خاص</span>`
            : `<span class="card-views">👁 ${v.views} مشاهدة</span>
               ${v.isNew ? '<span class="card-new">جديد</span>' : ''}`
          }
        </div>
      </div>
    </div>
  `).join('');
}

function filterVideos(query) {
  STATE.searchQuery = query;
  renderVideos();
}

function filterBySubject(subject, btn) {
  STATE.filterSubject = subject;
  STATE.searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderVideos();
}

// ══════════════════════════════════
//  RENDER: SUBJECTS
// ══════════════════════════════════
function renderSubjects() {
  document.getElementById('subjectsGrid').innerHTML = SUBJECTS.map(s => `
    <div class="subject-card" onclick="filterBySubject('${s.name}', document.querySelector('[data-tab=videos]')); switchTab('videos', document.querySelector('[data-tab=videos]'))">
      <div class="subject-thumb" style="background: linear-gradient(135deg, ${s.color}dd, ${s.color}88)">
        <span style="position:relative;z-index:1">${s.icon}</span>
      </div>
      <div class="subject-body">
        <h4>${s.name}</h4>
        <p>${s.count} محاضرات · كود: <code style="font-family:monospace;font-size:11px;color:var(--blue)">${s.code}</code></p>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════
//  RENDER: STUDENTS (Admin)
// ══════════════════════════════════
function renderStudents() {
  const tbody = document.getElementById('studentsTable');
  if (!tbody) return;
  tbody.innerHTML = STUDENTS.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td>${s.subject}</td>
      <td>${s.last}</td>
      <td><span style="font-family:monospace;font-weight:700">${s.views}</span></td>
      <td class="${s.active ? 'status-active' : 'status-blocked'}">${s.active ? '● نشط' : '● موقوف'}</td>
      <td>
        <button class="btn-sm ${s.active ? 'btn-danger' : 'btn-success'}"
          onclick="toggleStudent(this,'${s.name}',${s.active})">
          ${s.active ? 'إيقاف' : 'تفعيل'}
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleStudent(btn, name, wasActive) {
  btn.textContent = wasActive ? 'تفعيل' : 'إيقاف';
  btn.className = `btn-sm ${wasActive ? 'btn-success' : 'btn-danger'}`;
  const td = btn.closest('tr').children[4];
  td.className = wasActive ? 'status-blocked' : 'status-active';
  td.textContent = wasActive ? '● موقوف' : '● نشط';
  toast(`${wasActive ? '🚫 تم إيقاف' : '✅ تم تفعيل'} ${name}`, wasActive ? 'warn' : 'success');
}

// ══════════════════════════════════
//  RENDER: CODES TABLE (Admin)
// ══════════════════════════════════
function renderCodesTable() {
  const tbody = document.getElementById('codesTable');
  if (!tbody) return;
  tbody.innerHTML = Object.entries(STATE.codes).map(([code, data]) => `
    <tr>
      <td><span class="code-pill">${code}</span></td>
      <td>${data.subject}</td>
      <td>${data.uses} / ${data.limit}</td>
      <td class="${data.uses < data.limit ? 'status-active' : 'status-blocked'}">
        ${data.uses < data.limit ? '● نشط' : '● اكتمل'}
      </td>
      <td>
        <button class="btn-sm btn-danger" onclick="deleteCode('${code}')">حذف</button>
      </td>
    </tr>
  `).join('');
}

function addNewCode() {
  const subject = document.getElementById('newCodeSubject').value.trim();
  const code    = document.getElementById('newCodeValue').value.trim().toLowerCase();
  const limit   = parseInt(document.getElementById('newCodeLimit').value) || 50;

  if (!subject || !code) {
    toast('⚠️ أدخل اسم المادة والكود', 'warn');
    return;
  }
  if (STATE.codes[code]) {
    toast('⚠️ هذا الكود موجود بالفعل', 'warn');
    return;
  }
  if (!/^[a-z0-9]+$/.test(code)) {
    toast('⚠️ الكود يجب أن يحتوي على أحرف إنجليزية وأرقام فقط', 'warn');
    return;
  }

  STATE.codes[code] = { role: 'student', subject, limit, uses: 0 };
  document.getElementById('newCodeSubject').value = '';
  document.getElementById('newCodeValue').value = '';
  document.getElementById('newCodeLimit').value = '';
  renderCodesTable();
  toast(`✅ تم إضافة الكود: ${code}`, 'success');
}

function deleteCode(code) {
  if (code === 'admin2025') {
    toast('⚠️ لا يمكن حذف كود الأدمن', 'warn');
    return;
  }
  delete STATE.codes[code];
  renderCodesTable();
  toast(`🗑 تم حذف الكود: ${code}`, 'warn');
}

// ══════════════════════════════════
//  UPLOAD SIMULATION
// ══════════════════════════════════
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('uploadZone').classList.add('drag-over');
}
function handleDragLeave() {
  document.getElementById('uploadZone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  handleDragLeave();
  const file = e.dataTransfer.files[0];
  if (file) simulateUpload(file.name);
}
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) simulateUpload(file.name);
}
function simulateUpload(name) {
  const prog = document.getElementById('uploadProgress');
  const fill = document.getElementById('uploadFill');
  const status = document.getElementById('uploadStatus');
  prog.style.display = 'block';
  let pct = 0;
  const steps = [
    [20, 'جاري رفع الملف...'],
    [45, 'تحليل الفيديو...'],
    [65, 'تطبيق تشفير AES-256...'],
    [80, 'إضافة HLS Segments...'],
    [95, 'إنشاء Signed URLs...'],
    [100,'✅ تم الرفع والتشفير بنجاح!']
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (i >= steps.length) { clearInterval(interval); return; }
    pct = steps[i][0];
    fill.style.width = pct + '%';
    status.textContent = steps[i][1];
    i++;
    if (pct === 100) {
      toast(`✅ تم رفع "${name}" وتشفيره بنجاح`, 'success');
      setTimeout(() => { prog.style.display = 'none'; fill.style.width = '0%'; }, 3000);
    }
  }, 700);
}

// ══════════════════════════════════
//  ANIMATED STAT COUNTERS
// ══════════════════════════════════
function animateStats() {
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

// ══════════════════════════════════
//  SHAKE KEYFRAME (CSS injection)
// ══════════════════════════════════
(function injectKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      15%{transform:translateX(-8px)}
      30%{transform:translateX(8px)}
      45%{transform:translateX(-6px)}
      60%{transform:translateX(6px)}
      75%{transform:translateX(-4px)}
      90%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);
})();

// ══════════════════════════════════
//  INIT
// ══════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  // Enter key on login
  document.getElementById('inpCode')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('inpName')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('inpCode').focus();
  });
});
