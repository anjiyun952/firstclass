(() => {
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  const sub = params.get('sub');
  if (!category) return;
  const page = location.pathname.split('/').pop();
  const clickLabel = (buttons, label) => {
    const target = [...buttons].find(b => b.textContent.trim() === label);
    if (target) target.click();
    return target;
  };
  if (page === 'menu.html') {
    clickLabel(document.querySelectorAll('.menu-primary button'), category);
    if (sub) clickLabel(document.querySelectorAll('.menu-secondary-scroll:not([hidden]) [role="tab"]'), sub);
  } else if (page === 'event.html' || page === 'coupon.html') {
    const main = clickLabel(document.querySelectorAll('.coupon-primary [role="tab"]'), category);
    if (main && sub) {
      const panel = document.getElementById(main.getAttribute('aria-controls'));
      if (panel) clickLabel(panel.querySelectorAll('.menu-secondary [role="tab"]'), sub);
    }
  } else if (page === 'history.html') {
    clickLabel(document.querySelectorAll('.brand-tabs [role="tab"]'), category);
  }
})();