/* Scroll-synchronized subtitle opacity, including reverse scrolling. */
(() => {
  const video = document.querySelector('.domino-video-sec .domino-scroll-video');
  if (!video) return;
  const subtitles = [...document.querySelectorAll('.domino-video-subtitle')];
  // Times refer to the 19.969-second reference video. Adjust these when the source edit changes.
  const cues = [
    { start: 0.35, end: 4.72, fade: 0.4 },
    { start: 4.75, end: 8.95, fade: 0.4 },
    { start: 9.05, end: 13.25, fade: 0.4 },
    { start: 13.65, end: 19.969, fade: 0.45 }
  ];
  function render() {
    const t = video.currentTime || 0;
    subtitles.forEach((element, index) => {
      const cue = cues[index];
      if (!cue) return;
      // The final caption remains visible after fading in, through the video end.
      const opacity = index === subtitles.length - 1
        ? Math.max(0, Math.min(1, (t - cue.start) / cue.fade))
        : Math.max(0, Math.min(1,
            (t - cue.start) / cue.fade,
            (cue.end - t) / cue.fade
          ));
      element.style.opacity = opacity.toFixed(3);
    });
  }
  video.addEventListener('timeupdate', render);
  video.addEventListener('seeked', render);
  video.addEventListener('loadedmetadata', render);
  // Keep opacity aligned with the target video frame while seeking via scroll.
  const section = video.closest('.domino-video-sec');
  let pending = false;
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; render(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  render();
})();
