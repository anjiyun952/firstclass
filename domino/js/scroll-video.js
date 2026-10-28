/* Scroll distance maps to the video timeline; no ordinary autoplay. */
(() => {
  const section = document.querySelector('.domino-video-sec');
  const video = section?.querySelector('video');
  if (!section || !video) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let duration = 0;
  let framePending = false;
  let lastTarget = -1;

  video.pause();
  video.muted = true;
  video.playsInline = true;

  function updateFrame() {
    framePending = false;
    if (!duration || reduceMotion.matches) return;
    const availableScroll = Math.max(1, section.offsetHeight - window.innerHeight);
    const rect = section.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / availableScroll));
    const target = progress * duration;
    // Avoid redundant video seeks, which can cause visible stuttering.
    if (Math.abs(target - lastTarget) < 0.015) return;
    lastTarget = target;
    if (Math.abs(video.currentTime - target) > 0.015) {
      try { video.currentTime = target; } catch (_) { /* Wait for metadata */ }
    }
  }

  function requestFrame() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateFrame);
  }

  function onMetadata() {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    requestFrame();
  }

  video.addEventListener('loadedmetadata', onMetadata);
  video.addEventListener('durationchange', onMetadata);
  video.addEventListener('play', () => video.pause());
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  reduceMotion.addEventListener?.('change', requestFrame);
  if (video.readyState >= 1) onMetadata();
  else video.load();
})();
