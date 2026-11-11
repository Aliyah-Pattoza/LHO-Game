(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});
  DL.actions = DL.actions || {};
  DL.on = function (name, handler) {
    DL.actions[name] = handler;
  };

  function esc(value) {
    return DL.util.esc(value);
  }

  DL.ui = {
    header(state) {
      const soundOn = DL.player.soundOn();
      const page = document.body.dataset.page;
      const mapHref = DL.util.url("pages/adventure.html");
      const badgeHref = DL.util.url("pages/achievements.html");
      const homeHref = DL.util.url("index.html");
      const profileHref = !state?.name ? homeHref : page === "map" ? badgeHref : mapHref;
      return `
        <header class="hud">
          <a class="hud-player" href="${profileHref}">
            <span class="avatar">${state?.name ? DL.art.avatar(state.avatar) : DL.art.icon("search")}</span>
            <span class="hud-id">
              <strong>${state?.name ? esc(state.name) : "Detektif LHO"}</strong>
              <small>${state?.name ? DL.util.formatXp(state.xp) : "Belum memulai kasus"}</small>
            </span>
          </a>
          <div class="hud-actions">
            <button type="button" class="icon-btn ${soundOn ? "" : "is-off"}" data-sound-toggle data-action="toggle-sound" aria-pressed="${soundOn ? "true" : "false"}" aria-label="${soundOn ? "Matikan suara" : "Nyalakan suara"}">
              <span class="icon">${DL.art.icon(soundOn ? "sound" : "mute")}</span>
            </button>
            ${state?.name ? `<a class="icon-btn" href="${mapHref}" aria-label="Peta petualangan"><span class="icon">${DL.art.icon("map")}</span></a>` : ""}
            ${state?.name ? `<a class="icon-btn" href="${badgeHref}" aria-label="Lencana"><span class="icon">${DL.art.icon("badge")}</span></a>` : ""}
            ${state?.name ? `<button type="button" class="icon-btn" data-action="restart" aria-label="Ulangi dari awal"><span class="icon">${DL.art.icon("restart")}</span></button>` : ""}
          </div>
        </header>`;
    },

    footer() {
      const warning = DL.player.usingFallback()
        ? `<p class="warn">Penyimpanan peramban tidak tersedia. Progres hanya bertahan selama sesi ini.</p>`
        : "";
      return `<footer class="foot">${warning}Bahasa Indonesia · SMA Kelas X · Fase E · Progres tersimpan di perangkatmu</footer>`;
    },

    shell(content) {
      return `<div class="app-wrap">${this.header(DL.player.current())}<main class="stage stage-in">${content}</main>${this.footer()}</div>`;
    },

    speech(name, text) {
      return `
        <div class="speech">
          <div class="speech-face">${DL.art.inspector()}</div>
          <div>
            <strong>${esc(name)}</strong>
            <p>${esc(text)}</p>
          </div>
        </div>`;
    },

    toast(message) {
      let el = document.querySelector(".toast");
      if (!el) {
        el = document.createElement("div");
        el.className = "toast";
        el.setAttribute("role", "status");
        document.body.appendChild(el);
      }
      el.textContent = message;
      el.classList.add("is-on");
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => el.classList.remove("is-on"), 2600);
    },

    closeModal() {
      const root = document.getElementById("modal-root");
      if (root) root.innerHTML = "";
      DL._confirm = null;
    },

    confirm(options) {
      this.dialog({
        title: options.title,
        html: `<p>${esc(options.text)}</p>`,
        actions: `
          <button type="button" class="btn btn-ghost" data-action="close-modal" data-dismiss="1">${esc(options.cancel || "Batal")}</button>
          <button type="button" class="btn btn-coral" data-action="confirm-ok">${esc(options.ok || "Ya")}</button>`,
      });
      DL._confirm = options.onOk || null;
    },

    dialog({ title, html, actions }) {
      const root = document.getElementById("modal-root");
      if (!root) return;
      root.innerHTML = `
        <div class="modal-back" data-action="close-modal">
          <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" data-modal-panel tabindex="-1">
            <h2 id="modalTitle">${esc(title)}</h2>
            <div class="modal-copy">${html}</div>
            <div class="modal-actions">
              ${actions || `<button type="button" class="btn btn-navy" data-action="close-modal" data-dismiss="1">Tutup</button>`}
            </div>
          </div>
        </div>`;
      const dialog = root.querySelector(".modal");
      if (dialog) dialog.focus();
    },

    confetti() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const layer = document.createElement("div");
      layer.className = "confetti";
      layer.setAttribute("aria-hidden", "true");
      const colors = ["#F5C451", "#72BDEB", "#F28C65", "#8BC99A", "#FFF6E8"];
      for (let index = 0; index < 36; index += 1) {
        const piece = document.createElement("i");
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[index % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.35}s`;
        piece.style.transform = `rotate(${Math.random() * 80}deg)`;
        layer.appendChild(piece);
      }
      document.body.appendChild(layer);
      setTimeout(() => layer.remove(), 2200);
    },
  };

  DL.on("toggle-sound", () => {
    const next = !DL.player.soundOn();
    DL.audio.setEnabled(next);
    if (next) DL.audio.play("tap");
  });

  DL.on("restart", () => {
    DL.ui.confirm({
      title: "Ulangi dari awal?",
      text: "Progres detektif yang sedang bermain akan dihapus. Catatan siswa lain di Dashboard Guru tetap ada.",
      ok: "Hapus progres",
      cancel: "Batal",
      onOk() {
        DL.player.clear();
        window.location.href = DL.util.url("index.html");
      },
    });
  });

  DL.on("close-modal", (el, event) => {
    const inside = event.target.closest("[data-modal-panel]");
    const dismiss = event.target.closest("[data-dismiss]");
    if (inside && !dismiss) return;
    DL.ui.closeModal();
  });

  DL.on("confirm-ok", () => {
    const action = DL._confirm;
    DL.ui.closeModal();
    if (typeof action === "function") action();
  });

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-action]");
    if (!el || el.disabled) return;
    const action = DL.actions[el.dataset.action];
    if (action) action(el, event);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") DL.ui.closeModal();
  });
})();
