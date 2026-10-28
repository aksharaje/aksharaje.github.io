// Rotating "currently thinking about..." line under your name.
// Edit the list below. One line shown at a time, crossfades every 4s.

const lines = [
  "thinking about appropriate reliance",
  "thinking about end-user customization of AI",
  "thinking about what models treat as settled",
  "thinking about who pays to verify"
];

(function () {
  const el = document.getElementById("rotating");
  if (!el || lines.length < 2) return;
  let i = 0;
  el.style.transition = "opacity 0.5s";
  setInterval(() => {
    el.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % lines.length;
      el.textContent = lines[i];
      el.style.opacity = 1;
    }, 500);
  }, 4000);
})();
