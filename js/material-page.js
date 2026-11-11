(function () {
  "use strict";

  if (document.body.dataset.page !== "material") return;
  const DL = window.DL;
  const esc = (value) => DL.util.esc(value);
  const ctx = DL.guard.mission();
  if (!ctx) return;

  const slides = DL.materials[ctx.missionId];
  const mission = DL.missionById(ctx.missionId);
  let slide = 0;

  function blocks(list) {
    return list.map((block) => {
      if (block.type === "p") return `<p>${esc(block.text)}</p>`;
      if (block.type === "list") return `<ul class="nice">${block.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
      if (block.type === "example") return `<aside class="example"><strong>${esc(block.title)}</strong><p>${esc(block.text)}</p></aside>`;
      if (block.type === "note") return `<aside class="note"><strong>Catatan detektif</strong><p>${esc(block.text)}</p></aside>`;
      if (block.type === "compare") {
        return `<div class="compare">${block.rows.map((row) => `<div><strong>${esc(row.name)}</strong><span>${esc(row.desc)}</span></div>`).join("")}</div>`;
      }
      return "";
    }).join("");
  }

  function render() {
    const card = slides[slide];
    const last = slide === slides.length - 1;
    const practice = ctx.state.missions[ctx.missionId].completed;
    const dots = slides.map((_, index) => `<button type="button" class="dot ${index === slide ? "is-now" : ""}" data-action="go-slide" data-index="${index}" aria-label="Kartu ${index + 1}"></button>`).join("");
    document.title = `${mission.title} · Materi · Detektif LHO`;
    document.getElementById("app").innerHTML = DL.ui.shell(`
      <section class="material-card">
        <div class="material-hero">
          <span class="big-icon">${DL.art.icon(mission.icon)}</span>
          <div>
            <p class="kicker">Misi ${mission.id} · Catatan ${slide + 1}/${slides.length}</p>
            <h1>${esc(card.title)}</h1>
            <p class="quiet">${esc(card.kicker)}</p>
          </div>
        </div>
        ${slide === 0 ? DL.ui.speech("Inspektur Sena", mission.brief) : ""}
        <div class="dots">${dots}</div>
        ${blocks(card.blocks)}
        <div class="btn-row">
          <button type="button" class="btn btn-ghost" data-action="prev-slide" ${slide === 0 ? "disabled" : ""}>Sebelumnya</button>
          ${last
            ? `<a class="btn btn-gold" href="${DL.util.url(`pages/quiz.html?m=${mission.id}${practice ? "&practice=1" : ""}`)}">${practice ? "Mulai latihan" : "Mulai tantangan"}</a>`
            : `<button type="button" class="btn btn-gold" data-action="next-slide">Selanjutnya</button>`}
          <a class="btn btn-navy" href="${DL.util.url("pages/adventure.html")}">Kembali ke peta</a>
        </div>
      </section>`);
    window.scrollTo(0, 0);
  }

  function go(next) {
    if (next < 0 || next >= slides.length) return;
    slide = next;
    render();
  }

  DL.on("prev-slide", () => go(slide - 1));
  DL.on("next-slide", () => go(slide + 1));
  DL.on("go-slide", (el) => go(Number(el.dataset.index)));
  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea")) return;
    if (event.key === "ArrowRight") go(slide + 1);
    if (event.key === "ArrowLeft") go(slide - 1);
  });
  render();
})();
