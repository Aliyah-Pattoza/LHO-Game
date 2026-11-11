(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  // Efek suara dibuat dengan Web Audio agar game tetap utuh tanpa berkas audio.
  const audio = {
    ctx: null,

    enabled() {
      if (DL.player) return DL.player.soundOn();
      return localStorage.getItem("dl-sound") !== "0";
    },

    setEnabled(on) {
      localStorage.setItem("dl-sound", on ? "1" : "0");
      if (DL.player && DL.player.current()) {
        DL.player.update((state) => {
          state.sound = on;
        });
      }
      document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
        button.setAttribute("aria-pressed", on ? "true" : "false");
        button.setAttribute("aria-label", on ? "Matikan suara" : "Nyalakan suara");
        button.classList.toggle("is-off", !on);
        const icon = button.querySelector(".icon");
        if (icon && DL.art) icon.innerHTML = DL.art.icon(on ? "sound" : "mute");
      });
    },

    context() {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        this.ctx = new Ctx();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },

    tone(freq, offset, duration, type, volume) {
      const ctx = this.context();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + offset;
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    },

    play(kind) {
      if (!this.enabled()) return;
      try {
        if (kind === "ok") {
          this.tone(523, 0, 0.14, "sine", 0.07);
          this.tone(659, 0.08, 0.14, "sine", 0.07);
          this.tone(784, 0.16, 0.2, "triangle", 0.06);
        } else if (kind === "bad") {
          this.tone(196, 0, 0.16, "triangle", 0.05);
          this.tone(146, 0.12, 0.22, "sawtooth", 0.03);
        } else if (kind === "win") {
          [523, 659, 784, 1046].forEach((freq, index) => {
            this.tone(freq, index * 0.12, 0.2, "triangle", 0.07);
          });
        } else if (kind === "badge") {
          this.tone(880, 0, 0.12, "sine", 0.05);
          this.tone(1174, 0.1, 0.16, "sine", 0.05);
          this.tone(1568, 0.2, 0.24, "triangle", 0.05);
        } else if (kind === "tap") {
          this.tone(740, 0, 0.06, "sine", 0.04);
        }
      } catch (error) {
        // Game tetap bisa dimainkan bila audio ditolak peramban.
      }
    },
  };

  DL.audio = audio;
})();
