(function () {
  "use strict";

  if (document.body.dataset.page !== "reflection") return;
  const DL = window.DL;
  const esc = (value) => DL.util.esc(value);
  const state = DL.guard.finale();
  if (!state) return;
  const stats = DL.stats(state);
  const badges = DL.achievements.list.filter((badge) => DL.achievements.has(state, badge.id));

  const summary = [
    ["Pengertian", "LHO menyampaikan fakta hasil pengamatan secara objektif, bukan cerita, opini, atau ajakan."],
    ["Struktur", "Pada game ini urutannya adalah pernyataan umum, deskripsi bagian, lalu deskripsi manfaat."],
    ["Kebahasaan", "Laporan memakai nomina, verba relasional, kata sifat yang teramati, dan konjungsi."],
    ["Penerapan", "Kasus lidah buaya dilatih untuk menggabungkan isi, struktur, dan jejak bahasa."],
  ];

  document.title = "Penutupan Kasus · Detektif LHO";
  document.getElementById("app").innerHTML = DL.ui.shell(`
    <section class="result-card">
      <p class="kicker">Akademi Detektif</p>
      <h1>Kasus besar tertutup, ${esc(state.name)}</h1>
      ${DL.ui.speech("Inspektur Sena", "Kamu sudah menelusuri pengertian, struktur, kebahasaan, dan sebuah laporan utuh. Itu bekal seorang Detektif LHO.")}
      <p class="banner">Bintang misi terkumpul: ${stats.stars} dari 12</p>
      <div class="stat-grid">
        <div><b>${DL.util.formatXp(state.xp).replace(" XP", "")}</b><span>Total XP</span></div>
        <div><b>${stats.correct}</b><span>Jawaban benar</span></div>
        <div><b>${stats.done}/4</b><span>Misi selesai</span></div>
        <div><b>${badges.length}/5</b><span>Lencana</span></div>
      </div>
      <div class="summary-grid">
        ${summary.map(([title, text]) => `<article><h2>${title}</h2><p>${text}</p></article>`).join("")}
      </div>
      <div class="badge-row">
        ${DL.achievements.list.map((badge) => `<div class="${DL.achievements.has(state, badge.id) ? "is-on" : ""}" title="${esc(badge.title)}">${DL.art.badge(badge.id, DL.achievements.has(state, badge.id))}<span>${esc(badge.title)}</span></div>`).join("")}
      </div>
      <form id="reflectForm" class="reflect">
        <h2>Refleksi singkat</h2>
        <label>Apa hal baru yang kamu pelajari?<textarea name="learned" maxlength="500">${esc(state.reflection.learned)}</textarea></label>
        <label>Materi apa yang paling mudah dipahami?<textarea name="easy" maxlength="500">${esc(state.reflection.easy)}</textarea></label>
        <label>Materi apa yang masih ingin kamu pelajari?<textarea name="more" maxlength="500">${esc(state.reflection.more)}</textarea></label>
        <p id="reflectNote" class="quiet" role="status"></p>
        <div class="btn-row">
          <button type="submit" class="btn btn-gold">Simpan refleksi</button>
          <button type="button" class="btn btn-coral" data-action="restart">Main lagi</button>
          <a class="btn btn-navy" href="${DL.util.url("index.html")}">Kembali ke beranda</a>
        </div>
      </form>
    </section>`);

  const form = document.getElementById("reflectForm");
  const note = document.getElementById("reflectNote");

  function saveReflection() {
    const data = new FormData(form);
    DL.player.update((current) => {
      current.reflection.learned = String(data.get("learned") || "").slice(0, 500);
      current.reflection.easy = String(data.get("easy") || "").slice(0, 500);
      current.reflection.more = String(data.get("more") || "").slice(0, 500);
    });
    note.textContent = "Refleksi tersimpan di perangkatmu.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveReflection();
    DL.audio.play("ok");
  });
  form.addEventListener("change", saveReflection);
})();