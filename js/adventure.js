(function () {
  "use strict";

  if (document.body.dataset.page !== "map") return;
  const DL = window.DL;
  const esc = (value) => DL.util.esc(value);
  const state = DL.guard.player();
  if (!state) return;

  const stats = DL.stats(state);
  const flash = DL.util.flash();
  const current = DL.missions.find((mission) => state.missions[mission.id].unlocked && !state.missions[mission.id].completed);
  const speech = flash || (stats.done === 4
    ? "Empat berkas sudah tertutup. Buka halaman penutup untuk merangkum penyelidikanmu."
    : current?.brief || "Akademi menunggu laporan barumu.");

  const cards = DL.missions.map((mission) => {
    const progress = state.missions[mission.id];
    const total = DL.questions[mission.id].length;
    const answered = Object.keys(progress.answers || {}).length;
    const locked = !progress.unlocked;
    const classes = ["mission-card"];
    if (locked) classes.push("is-locked");
    if (current && current.id === mission.id) classes.push("is-current");
    let status = "Siap diselidiki";
    let actions = `<a class="btn btn-gold" href="${DL.util.url(`pages/material.html?m=${mission.id}`)}">Mulai misi</a>`;
    if (locked) {
      status = "Terkunci";
      actions = `<button type="button" class="btn btn-ghost" data-action="locked-mission">Terkunci</button>`;
    } else if (progress.completed) {
      status = "Selesai";
      actions = `
        <a class="btn btn-navy" href="${DL.util.url(`pages/result.html?m=${mission.id}`)}">Lihat hasil</a>
        <a class="btn btn-ghost" href="${DL.util.url(`pages/material.html?m=${mission.id}`)}">Baca materi</a>
        <a class="btn btn-ghost" href="${DL.util.url(`pages/quiz.html?m=${mission.id}&practice=1`)}">Latihan ulang</a>`;
    } else if (answered > 0) {
      status = `Sedang dikerjakan · ${answered}/${total}`;
      actions = `
        <a class="btn btn-gold" href="${DL.util.url(`pages/quiz.html?m=${mission.id}`)}">Lanjutkan tantangan</a>
        <a class="btn btn-ghost" href="${DL.util.url(`pages/material.html?m=${mission.id}`)}">Baca materi</a>`;
    }
    return `
      <article class="${classes.join(" ")}" data-step="${mission.id}">
        <div class="mission-icon">${DL.art.icon(mission.icon)}</div>
        <div>
          <p class="kicker">Misi ${mission.id} · ${esc(mission.place)}</p>
          <h2>${esc(mission.title)}</h2>
          <p>${esc(mission.summary)}</p>
          <div class="mission-meta">
            <span class="chip">${esc(status)}</span>
            ${progress.completed ? `<span class="stars stars-sm" aria-label="${progress.stars} dari 3 bintang">${DL.art.stars(progress.stars)}</span>` : ""}
          </div>
          <div class="btn-row">${actions}</div>
        </div>
      </article>`;
  }).join("");

  document.title = "Peta Petualangan · Detektif LHO";
  document.getElementById("app").innerHTML = DL.ui.shell(`
    <section class="map-hero">
      ${DL.art.academy()}
      <div>
        <p class="kicker">Peta Kasus</p>
        <h1>Empat jejak menunggumu</h1>
        <p>Selesaikan misi berurutan untuk menyandang lencana Detektif LHO.</p>
      </div>
    </section>
    <div class="progress-strip">
      <span>Misi selesai ${stats.done}/4</span>
      <div class="bar" aria-hidden="true"><span style="width:${(stats.done / 4) * 100}%"></span></div>
      <span>${stats.stars}/12 bintang</span>
    </div>
    ${DL.ui.speech("Inspektur Sena", speech)}
    ${stats.done === 4 ? `<a class="btn btn-gold btn-block" href="${DL.util.url("pages/reflection.html")}">Buka penutupan kasus</a>` : ""}
    <div class="route map-board">${cards}</div>
    <div class="btn-row">
      <a class="btn btn-ghost" href="${DL.util.url("pages/achievements.html")}">Lihat lencana</a>
      <button type="button" class="btn btn-ghost" data-action="restart">Ulangi dari awal</button>
    </div>`);

  DL.on("locked-mission", () => {
    DL.audio.play("bad");
    DL.ui.toast("Misi ini masih terkunci. Selesaikan misi sebelumnya.");
  });
})();
