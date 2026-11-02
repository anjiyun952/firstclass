/* Switch only the optional theme stylesheet; keep original page CSS untouched. */
(() => {
  const themes = {
    original: { file: "", className: "" },
    neo: { file: "neo-brutalism.css", className: "neo-brutalism" },
    collage: { file: "collage.css", className: "collage-style" },
    glass: { file: "glassmorphism.css", className: "glassmorphism" }
  };
  const storageKey = "starbucks-design-theme";
  const select = document.getElementById("design-theme");
  const stylesheet = document.getElementById("active-theme-css");
  if (!select || !stylesheet) return;
  const classes = Object.values(themes).map(theme => theme.className).filter(Boolean);
  const apply = key => {
    const theme = themes[key] || themes.original;
    document.body.classList.remove(...classes);
    if (theme.className) document.body.classList.add(theme.className);
    if (theme.file) {
      stylesheet.href = theme.file;
      stylesheet.disabled = false;
    } else {
      stylesheet.disabled = true;
      stylesheet.removeAttribute("href");
    }
    select.value = themes[key] ? key : "original";
  };
  let initial = "collage";
  try { initial = localStorage.getItem(storageKey) || initial; } catch (_) {}
  apply(initial);
  select.addEventListener("change", () => {
    apply(select.value);
    try { localStorage.setItem(storageKey, select.value); } catch (_) {}
  });
})();
