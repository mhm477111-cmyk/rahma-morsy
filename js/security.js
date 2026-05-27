/**
 * DR. RAHMA MERSI PLATFORM — SECURITY MODULE
 * Multi-layer protection system
 */

const Security = (() => {
  'use strict';

  let violationCount = 0;
  let devtoolsOpen = false;
  const MAX_VIOLATIONS = 3;

  // ── 1. Disable Right Click
  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    logViolation('right_click');
    toast('⚠️ النقر اليميني محظور على المنصة', 'warn');
  });

  // ── 2. Disable Keyboard Shortcuts
  document.addEventListener('keydown', e => {
    const blocked = [
      e.key === 'F12',
      e.ctrlKey && e.shiftKey && ['I','J','C','K','U'].includes(e.key.toUpperCase()),
      e.ctrlKey && ['U','S','A'].includes(e.key.toUpperCase()),
      e.key === 'F11',
      e.metaKey && e.altKey && e.key === 'I',  // Mac devtools
    ];
    if (blocked.some(Boolean)) {
      e.preventDefault();
      e.stopPropagation();
      logViolation('keyboard_shortcut');
      toast('⚠️ هذا الإجراء محظور — تم التسجيل', 'danger');
      return false;
    }
    // Print screen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      logViolation('screenshot_attempt');
      toast('📸 تم رصد محاولة لقطة شاشة — تم التسجيل', 'danger');
      // Flash screen to disrupt screenshot
      flashScreen();
    }
  });

  // ── 3. DevTools Detection (size-based)
  function detectDevTools() {
    const threshold = 160;
    const widthDiff  = window.outerWidth  - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;
    const isOpen = widthDiff > threshold || heightDiff > threshold;
    if (isOpen && !devtoolsOpen) {
      devtoolsOpen = true;
      logViolation('devtools_opened');
      toast('🚫 أدوات المطور مفتوحة — تم تسجيل هذه المحاولة', 'danger');
    } else if (!isOpen) {
      devtoolsOpen = false;
    }
  }
  setInterval(detectDevTools, 1500);

  // ── 4. Debugger trap (slows down devtools)
  setInterval(() => {
    if (devtoolsOpen) {
      // eslint-disable-next-line no-debugger
      // debugger; // Uncomment in production for aggressive protection
    }
  }, 2000);

  // ── 5. Disable Text Selection (already in CSS, JS layer too)
  document.addEventListener('selectstart', e => {
    // Allow selection only in input fields
    if (!['INPUT','TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
    }
  });

  // ── 6. Disable Drag
  document.addEventListener('dragstart', e => {
    e.preventDefault();
  });

  // ── 7. Disable Copy
  document.addEventListener('copy', e => {
    if (!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toast('📋 النسخ محظور على هذه المنصة', 'warn');
    }
  });

  // ── 8. Screen recording detection (Visibility API)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && STATE.playing) {
      // User switched tabs while video playing — possible screen record
      logViolation('tab_switch_during_playback');
    }
  });

  // ── 9. Anti-iframe embedding
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  // ── 10. Session timeout (2 hours)
  let sessionTimer = null;
  function startSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
      toast('⏱ انتهت مدة الجلسة — يرجى تسجيل الدخول مجدداً', 'warn');
      setTimeout(() => {
        if (typeof doLogout === 'function') doLogout();
      }, 2000);
    }, 2 * 60 * 60 * 1000); // 2 hours
  }

  // ── 11. Violation logger
  function logViolation(type) {
    violationCount++;
    const entry = {
      type,
      time: new Date().toISOString(),
      user: STATE.user?.name || 'unknown',
      userAgent: navigator.userAgent.substring(0, 80),
      count: violationCount
    };
    // In production: POST to /api/log-violation
    console.warn('[SECURITY] Violation logged:', entry);

    if (violationCount >= MAX_VIOLATIONS) {
      toast('🚫 تم رصد سلوك مشبوه — سيتم تسجيل خروجك', 'danger');
      setTimeout(() => {
        if (typeof doLogout === 'function') doLogout();
      }, 3000);
      violationCount = 0; // reset after logout
    }
  }

  // ── 12. Flash screen (disrupts screenshots)
  function flashScreen() {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed; inset:0; background:white;
      z-index:999999; pointer-events:none;
      animation: none;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 150);
  }

  // ── Watermark Generator
  function generateWatermark(userName, userId) {
    const timestamp = new Date().toLocaleTimeString('ar');
    const date = new Date().toLocaleDateString('ar');
    return `${userName} · ${userId} · ${date} ${timestamp}`;
  }

  function updateWatermarks(userName) {
    const userId = 'ID-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const wm = generateWatermark(userName, userId);

    const els = ['wmTR', 'wmBL', 'wmDiag', 'watermarkText'];
    els.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = wm;
    });

    // Update demo watermark on security page
    const wmDynamic = document.getElementById('wmDynamic');
    if (wmDynamic) wmDynamic.textContent = wm;

    // Rotate watermark position every 30s
    setInterval(() => {
      const newWm = generateWatermark(userName, userId);
      els.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = newWm;
      });
    }, 30000);
  }

  return {
    startSessionTimer,
    updateWatermarks,
    logViolation,
    generateWatermark
  };
})();
