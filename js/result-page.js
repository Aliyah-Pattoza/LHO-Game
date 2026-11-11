(function () {
  "use strict";

  if (document.body.dataset.page !== "result") return;
  const DL = window.DL;
  const esc = (value) => DL.util.esc(value);
  const ctx = DL.guard.mission();
  if (!ctx) return;

  const mission = DL.missionById(ctx.missionId);
  const progress = ctx.state.missions[ctx.missionId];
  if (!progress.completed) {
    window.location.href = DL.util.url(`pages/quiz.html?m=${ctx.missionId}`);
    return;
  }

  let practice = null;
  if (ctx.practice) {
    try {
      practice = JSON.parse(sessionStorage.getItem("dl-practice-result") || "null");
    } catch (error) {
      practice = null;
    }
    if (!practice || Number(practice.missionId) !== ctx.missionId) practice = null;
  }

  const correct = practice ? practice.correct : progress.correct;
  const incorrect = practice ? practice.incorrect : progress.incorrect;
  const stars = practice ? practice.stars : progress.stars;
  const total = correct + incorrect;
  const accuracy = DL.util.percent(correct, total);
  const xp = DL.scoring.missionXp(progress);
  const badgeId = { 1: "pemula", 2: "struktur", 3: "kata", 4: "andal" }[ctx.missionId];
  const badge = DL.achievements.list.find((item) => item.id === badgeId);
  const nextHref = ctx.missionId === 4 ? DL.util.url("pages/reflection.html") : DL.util.url("pages/adventure.html");
  let fresh = [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem("dl-new-badges") || "[]");
    fresh = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    fresh = [];
  }
  sessionStorage.removeItem("dl-new-badges");
  const names = fresh.map((id) => DL.achievements.list.find((item) => item.id === id)?.title).filter(Boolean);

  document.title = `${mission.title} · Hasil · Detektif LHO`;
  document.getElementById("app").innerHTML = DL.ui.shell(`
    <section class="result-card celebrate">
      <p class="kicker">${practice ? "Hasil latihan" : `Misi ${mission.id} selesai`}</p>
      <h1>${practice ? "Latihan ditutup" : "Jejak berhasil ditutup"}</h1>
      <div class="stars stars-lg" role="img" aria-label="${stars} dari 3 bintang">${DL.art.stars(stars)}</div>
      <p class="quiet">3 bintang jika akurasi minimal 85%. 2 bintang jika minimal 60%. Di bawah itu tetap 1 bintang karena misi selesai.</p>
      <div class="stat-grid">
        <div><b>${correct}</b><span>Benar</span></div>
        <div><b>${incorrect}</b><span>Salah</span></div>
        <div><b>${accuracy}%</b><span>Akurasi</span></div>
        <div><b>${xp}</b><span>XP misi</span></div>
      </div>
      <p>${practice
        ? (practice.improved ? "Bintang misimu naik. XP tidak bertambah pada latihan ulang." : "XP tidak bertambah pada latihan ulang.")
        : `Bonus penyelesaian +${DL.scoring.XP_BONUS} XP sudah masuk ke catatanmu.`}</p>
      ${names.length ? `<p class="banner">Lencana baru: ${esc(names.join(", "))}</p>` : ""}
      <div class="badge-spot">
        ${DL.art.badge(badgeId, true)}
        <div>
          <strong>${esc(badge.title)}</strong>
          <p>${esc(badge.detail)}</p>
        </div>
      </div>
      ${DL.ui.speech("Inspektur Sena", ctx.missionId === 4 && !practice ? "Empat berkas tertutup. Lanjutkan ke halaman penutup untuk merangkum pelajaranmu." : "Catatanmu rapi. Lanjutkan petualangan saat kamu siap.")}
      <div class="btn-row">
        <a class="btn btn-gold" href="${practice ? DL.util.url("pages/adventure.html") : nextHref}">Lanjutkan petualangan</a>
        <a class="btn btn-ghost" href="${DL.util.url("pages/achievements.html")}">Lihat lencana</a>
      </div>
    </section>`);

  if (practice?.improved || practice?.freshBadges?.length) DL.ui.confetti();
  if (practice?.freshBadges?.length) DL.audio.play("badge");
  const fanfare = sessionStorage.getItem("dl-fanfare");
  if (!practice && fanfare === String(ctx.missionId)) {
    sessionStorage.removeItem("dl-fanfare");
    DL.audio.play("win");
    DL.ui.confetti();
    if (fresh.length) setTimeout(() => DL.audio.play("badge"), 700);
  }
})();
