(function () {
  "use strict";

  if (document.body.dataset.page !== "achievements") return;
  const DL = window.DL;
  const esc = (value) => DL.util.esc(value);
  const state = DL.guard.player();
  if (!state) return;
  const stats = DL.stats(state);

  const badges = DL.achievements.list.map((badge) => {
    const unlocked = DL.achievements.has(state, badge.id);
    return `
      <article class="badge-card ${unlocked ? "is-on" : ""}">
        ${DL.art.badge(badge.id, unlocked)}
        <h2>${esc(badge.title)}</h2>
        <p>${esc(badge.detail)}</p>
        <span class="chip">${unlocked ? "Terbuka" : "Terkunci"}</span>
      </article>`;
  }).join("");

  document.title = "Lencana · Detektif LHO";
  document.getElementById("app").innerHTML = DL.ui.shell(`
    <section class="profile-card">
      <span class="avatar avatar-lg">${DL.art.avatar(state.avatar)}</span>
      <div>
        <p class="kicker">Catatan penyidik</p>
        <h1>${esc(state.name)}</h1>
        <p>${DL.util.formatXp(state.xp)} · ${stats.done}/4 misi · ${stats.stars}/12 bintang</p>
      </div>
    </section>
    <div class="stat-grid">
      <div><b>${stats.correct}</b><span>Jawaban benar</span></div>
      <div><b>${stats.answered}</b><span>Soal terjawab</span></div>
      <div><b>${stats.total}</b><span>Total soal</span></div>
      <div><b>${stats.accuracy}%</b><span>Akurasi</span></div>
    </div>
    <div class="progress-strip">
      <span>Progress belajar</span>
      <div class="bar" aria-hidden="true"><span style="width:${(stats.done / 4) * 100}%"></span></div>
      <span>${stats.done}/4</span>
    </div>
    <p class="quiet">Akurasi mengikuti hasil terbaik tiap misi. XP hanya dihitung pada percobaan pertama.</p>
    <div class="badge-grid">${badges}</div>
    <a class="btn btn-navy" href="${DL.util.url("pages/adventure.html")}">Kembali ke peta</a>`);
})();
