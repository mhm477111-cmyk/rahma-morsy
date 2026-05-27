/**
 * DR. RAHMA MERSI PLATFORM — VIDEO PLAYER MODULE
 */

const Player = (() => {
  'use strict';

  function open(videoId) {
    const v = VIDEOS.find(x => x.id === videoId);
    if (!v) return;
    if (v.locked) {
      toast('🔒 هذه المحاضرة غير متاحة — يرجى التحقق من الكود المناسب', 'warn');
      return;
    }

    STATE.currentVideoId = videoId;
    STATE.playing = false;
    STATE.progress = 0;

    // Set player UI
    document.getElementById('playerTitle').textContent = v.title;
    document.getElementById('fvTitle').textContent = v.title;
    document.getElementById('fvSubject').textContent = v.subject;
    document.getElementById('sideTitle').textContent = v.title;
    document.getElementById('sideDesc').textContent = v.desc;
    document.getElementById('timeDisplay').textContent = '00:00 / ' + v.duration;

    // Tags
    document.getElementById('sideTags').innerHTML = v.tags
      .map(t => `<span class="side-tag">${t}</span>`).join('');

    // Playlist
    renderPlaylist(videoId);

    // Reset progress
    document.getElementById('progressFill').style.width = '0%';
    document.getElementById('progressThumb').style.right = '100%';
    document.getElementById('bigPlayIcon').textContent = '▶';
    document.getElementById('ctrlPlay').textContent = '▶';

    showScreen('screenPlayer');

    // Update watermarks with user info
    if (STATE.user) {
      Security.updateWatermarks(STATE.user.name);
    }

    setTimeout(() => {
      toast('🔐 فيديو محمي — Watermark مفعّل باسمك', 'info');
    }, 600);
  }

  function renderPlaylist(activeId) {
    const list = document.getElementById('playlist');
    // Show nearby videos in playlist
    list.innerHTML = VIDEOS.map((v, i) => `
      <div class="playlist-item ${v.id === activeId ? 'active' : ''}" onclick="${v.locked ? `toast('🔒 محاضرة مقفلة', 'warn')` : `Player.open(${v.id})`}">
        <div class="pl-num">${i + 1}</div>
        <div class="pl-info">
          <div class="pl-title">${v.title}</div>
          <div class="pl-dur">${v.duration}</div>
        </div>
        ${v.locked ? '<span class="pl-lock">🔒</span>' : ''}
      </div>
    `).join('');
  }

  function togglePlay() {
    STATE.playing = !STATE.playing;
    const icon = STATE.playing ? '⏸' : '▶';
    document.getElementById('bigPlayIcon').textContent = icon;
    document.getElementById('ctrlPlay').textContent = icon;
    if (STATE.playing) startProgress();
    else stopProgress();
  }

  function startProgress() {
    stopProgress();
    STATE.progressInterval = setInterval(() => {
      if (!STATE.playing) return;
      STATE.progress += 0.3;
      if (STATE.progress >= 100) {
        STATE.progress = 100;
        STATE.playing = false;
        document.getElementById('bigPlayIcon').textContent = '▶';
        document.getElementById('ctrlPlay').textContent = '▶';
        stopProgress();
        toast('✅ انتهت المحاضرة', 'success');
        return;
      }
      updateProgressUI();
    }, 400);
  }

  function stopProgress() {
    if (STATE.progressInterval) {
      clearInterval(STATE.progressInterval);
      STATE.progressInterval = null;
    }
  }

  function updateProgressUI() {
    const v = VIDEOS.find(x => x.id === STATE.currentVideoId);
    if (!v) return;

    document.getElementById('progressFill').style.width = STATE.progress + '%';
    document.getElementById('progressThumb').style.right = (100 - STATE.progress) + '%';

    // Parse duration
    const parts = v.duration.split(':').map(Number);
    const total = parts[0] * 60 + parts[1];
    const current = Math.floor(total * STATE.progress / 100);
    const m = Math.floor(current / 60).toString().padStart(2, '0');
    const s = (current % 60).toString().padStart(2, '0');
    document.getElementById('timeDisplay').textContent = `${m}:${s} / ${v.duration}`;
  }

  function seek(e) {
    const bar = document.getElementById('progressBar');
    const rect = bar.getBoundingClientRect();
    STATE.progress = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    updateProgressUI();
  }

  function skipForward() {
    STATE.progress = Math.min(100, STATE.progress + 5);
    updateProgressUI();
  }

  function skipBack() {
    STATE.progress = Math.max(0, STATE.progress - 5);
    updateProgressUI();
  }

  function setVolume(val) {
    STATE.volume = parseInt(val);
    document.getElementById('muteBtn').textContent = STATE.volume === 0 ? '🔇' : STATE.volume < 50 ? '🔉' : '🔊';
  }

  function toggleMute() {
    STATE.muted = !STATE.muted;
    document.getElementById('muteBtn').textContent = STATE.muted ? '🔇' : '🔊';
    document.getElementById('volumeSlider').value = STATE.muted ? 0 : STATE.volume;
  }

  function toggleFullscreen() {
    const el = document.getElementById('playerWrap');
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  }

  return { open, togglePlay, seek, skipForward, skipBack, setVolume, toggleMute, toggleFullscreen };
})();

// Global wrappers
function togglePlay()      { Player.togglePlay(); }
function seekVideo(e)      { Player.seek(e); }
function skipForward()     { Player.skipForward(); }
function skipBack()        { Player.skipBack(); }
function setVolume(v)      { Player.setVolume(v); }
function toggleMute()      { Player.toggleMute(); }
function toggleFullscreen(){ Player.toggleFullscreen(); }
