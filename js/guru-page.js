(function () {
  "use strict";

  if (document.body.dataset.page !== "guru") return;
  const DL = window.DL;
  const esc = (value) => DL.util.esc(value);
  const SESSION = "dl-guru-session";
  const PAGE_SIZE = 8;
  const root = document.getElementById("app");

  const view = {
    query: "",
    className: "semua",
    sort: "score-desc",
    page: 1,
    showPassword: false,
    error: "",
    draft: "",
  };

  function signedIn() {
    return sessionStorage.getItem(SESSION) === "1";
  }

  function when(iso) {
    if (!iso) return "Tidak tercatat";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Tidak tercatat";
    return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  }

  function missionRows(state) {
    return [1, 2, 3, 4].map((id) => {
      const saved = state.missions?.[id] || state.missions?.[String(id)] || {};
      const mission = DL.missionById(id);
      return {
        missionId: id,
        missionName: mission ? mission.title : `Misi ${id}`,
        score: DL.scoring.missionXp(saved),
        correctAnswers: Number(saved.correct) || 0,
        wrongAnswers: Number(saved.incorrect) || 0,
        completed: Boolean(saved.completed),
        completedAt: saved.completedAt || "",
        startedAt: saved.startedAt || "",
      };
    });
  }

  function present(record) {
    const state = record.state || {};
    const missions = missionRows(state);
    const completedMissions = missions.filter((mission) => mission.completed).length;
    const progress = Math.round((completedMissions / 4) * 100);
    return {
      id: record.id,
      name: state.name || "Tanpa nama",
      className: state.className || "—",
      totalScore: Number(state.xp) || 0,
      completedMissions,
      totalMissions: 4,
      progress,
      status: completedMissions === 4 ? "Selesai" : "Belum Selesai",
      missions,
      lastPlayed: record.lastPlayed || state.createdAt || "",
    };
  }

  function students() {
    return DL.roster.list().map(present).filter((student) => student.name);
  }

  function absorbCodes() {
    if (!DL.classbook) return;
    DL.classbook.list().forEach((student) => {
      const missions = {};
      for (let id = 1; id <= 4; id += 1) {
        const saved = student.missions?.[id] || {};
        const correct = Number(saved.correct) || 0;
        missions[id] = {
          unlocked: id === 1 || Boolean(student.missions?.[id - 1]?.completed),
          completed: Boolean(saved.completed),
          correct,
          incorrect: Number(saved.incorrect) || 0,
          stars: Number(saved.stars) || 0,
          xpAwarded: correct * DL.scoring.XP_CORRECT,
          bonusGiven: Boolean(saved.completed),
          questionOrder: null,
          viewIndex: 0,
          answers: {},
        };
      }
      DL.roster.upsert({
        id: `kode|${student.createdAt || "kode"}|${student.name.toLocaleLowerCase("id-ID")}`,
        lastPlayed: student.savedAt || student.createdAt || "",
        state: {
          v: 1,
          name: student.name,
          className: "Dari kode",
          avatar: student.avatar,
          xp: student.xp,
          createdAt: student.createdAt,
          badges: student.badges,
          reflection: student.reflection,
          missions,
        },
      });
    });
  }

  function summary(rows) {
    const total = rows.length;
    const done = rows.filter((student) => student.status === "Selesai").length;
    const score = total ? Math.round(rows.reduce((sum, student) => sum + student.totalScore, 0) / total) : 0;
    return { total, done, score, open: total - done };
  }

  function classesOf(rows) {
    return [...new Set(rows.map((student) => student.className))].sort((a, b) => a.localeCompare(b, "id"));
  }

  function filtered(rows) {
    const query = view.query.trim().toLocaleLowerCase("id-ID");
    return rows.filter((student) => {
      const nameOk = !query || student.name.toLocaleLowerCase("id-ID").includes(query);
      const classOk = view.className === "semua" || student.className === view.className;
      return nameOk && classOk;
    });
  }

  function sorted(rows) {
    const copy = [...rows];
    const byName = (a, b) => a.name.localeCompare(b.name, "id");
    if (view.sort === "score-asc") copy.sort((a, b) => a.totalScore - b.totalScore || byName(a, b));
    else if (view.sort === "progress-desc") copy.sort((a, b) => b.progress - a.progress || b.totalScore - a.totalScore || byName(a, b));
    else if (view.sort === "progress-asc") copy.sort((a, b) => a.progress - b.progress || a.totalScore - b.totalScore || byName(a, b));
    else copy.sort((a, b) => b.totalScore - a.totalScore || byName(a, b));
    return copy;
  }

  function csvCell(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function download(name, text) {
    const blob = new Blob([`\uFEFF${text}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function exportCsv(rows) {
    const head = [
      "No", "Nama", "Kelas", "Total skor", "Misi selesai", "Progres", "Status", "Terakhir bermain",
      "Skor M1", "Benar M1", "Salah M1", "Selesai M1",
      "Skor M2", "Benar M2", "Salah M2", "Selesai M2",
      "Skor M3", "Benar M3", "Salah M3", "Selesai M3",
      "Skor M4", "Benar M4", "Salah M4", "Selesai M4",
    ];
    const lines = [head.map(csvCell).join(",")];
    rows.forEach((student, index) => {
      const cells = [
        index + 1,
        student.name,
        student.className,
        student.totalScore,
        student.completedMissions,
        `${student.progress}%`,
        student.status,
        when(student.lastPlayed),
      ];
      student.missions.forEach((mission) => {
        cells.push(mission.score, mission.correctAnswers, mission.wrongAnswers, mission.completed ? when(mission.completedAt) : "Belum");
      });
      lines.push(cells.map(csvCell).join(","));
    });
    download("rekap-detektif-lho.csv", lines.join("\r\n"));
  }

  function detailHtml(student) {
    const missions = student.missions.map((mission) => `
      <article class="mission-result">
        <h3>Misi ${mission.missionId} · ${esc(mission.missionName)}</h3>
        <p>${mission.completed ? "Selesai" : "Belum selesai"} · Skor ${mission.score} XP</p>
        <p>Benar ${mission.correctAnswers} · Salah ${mission.wrongAnswers}</p>
        <p class="quiet">Mulai: ${esc(when(mission.startedAt))}<br>Selesai: ${esc(mission.completed ? when(mission.completedAt) : "")}</p>
      </article>`).join("");
    return `
      <p><strong>${esc(student.name)}</strong> · Kelas ${esc(student.className)}</p>
      <div class="stat-grid">
        <div><b>${student.totalScore}</b><span>Total skor</span></div>
        <div><b>${student.completedMissions}/${student.totalMissions}</b><span>Misi selesai</span></div>
        <div><b>${student.progress}%</b><span>Progres</span></div>
        <div><b>${esc(student.status)}</b><span>Status</span></div>
      </div>
      <div class="mission-results">${missions}</div>`;
  }

  function loginScreen() {
    return `
      <div class="guru-wrap">
        <header class="home-bar">
          <a class="brand" href="${DL.util.url("index.html")}">${DL.art.icon("search")} Akademi Detektif</a>
          <a class="btn btn-ghost" href="${DL.util.url("index.html")}">Kembali</a>
        </header>
        <section class="card guru-login">
          <div class="guru-mark" aria-hidden="true">${DL.art.icon("teacher")}</div>
          <p class="kicker">Detektif LHO</p>
          <h1>Login Guru</h1>
          <p>Masuk untuk melihat hasil belajar yang tersimpan di peramban ini.</p>
          <form id="guruLogin" novalidate>
            <div class="field">
              <label for="guruPassword">Kata sandi</label>
              <span class="pass-wrap">
                <input id="guruPassword" type="${view.showPassword ? "text" : "password"}" autocomplete="current-password" value="${esc(view.draft)}" required>
                <button type="button" class="text-btn" data-action="guru-toggle-password" aria-pressed="${view.showPassword ? "true" : "false"}">${view.showPassword ? "Sembunyikan" : "Tampilkan"}</button>
              </span>
            </div>
            <p class="form-error" role="alert">${esc(view.error)}</p>
            <button class="btn btn-gold btn-block" type="submit">Masuk</button>
          </form>
          <a class="btn btn-ghost btn-block" href="${DL.util.url("index.html")}">Kembali ke halaman utama</a>
        </section>
      </div>`;
  }

  function board() {
    const all = students();
    const stats = summary(all);
    const classes = classesOf(all);
    if (view.className !== "semua" && !classes.includes(view.className)) view.className = "semua";
    const rows = sorted(filtered(all));
    const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    if (view.page > pages) view.page = pages;
    if (view.page < 1) view.page = 1;
    const start = (view.page - 1) * PAGE_SIZE;
    const pageRows = rows.slice(start, start + PAGE_SIZE);
    const classOptions = [`<option value="semua">Semua kelas</option>`]
      .concat(classes.map((name) => `<option value="${esc(name)}" ${name === view.className ? "selected" : ""}>${esc(name)}</option>`))
      .join("");
    const body = pageRows.length
      ? pageRows.map((student, index) => `
          <tr>
            <td>${start + index + 1}</td>
            <td>${esc(student.name)}</td>
            <td>${esc(student.className)}</td>
            <td>${student.totalScore}</td>
            <td>${student.completedMissions}/${student.totalMissions}</td>
            <td>${student.progress}%</td>
            <td><span class="chip ${student.status === "Selesai" ? "is-done" : ""}">${esc(student.status)}</span></td>
            <td>${esc(when(student.lastPlayed))}</td>
            <td class="row-actions">
              <button type="button" class="btn btn-navy" data-action="guru-detail" data-id="${esc(student.id)}">Detail</button>
              <button type="button" class="btn btn-ghost" data-action="guru-remove" data-id="${esc(student.id)}">Hapus</button>
            </td>
          </tr>`).join("")
      : `<tr><td colspan="9">
          <div class="empty-state">
            <strong>${all.length ? "Tidak ada siswa pada saringan ini." : "Belum ada siswa yang bermain."}</strong>
            <p>${all.length ? "Ubah pencarian atau filter kelas." : "Data muncul setelah siswa memasukkan nama dan kelas, lalu bermain di peramban ini."}</p>
          </div>
        </td></tr>`;
    return `
      <div class="guru-wrap">
        <header class="guru-head card">
          <div>
            <p class="kicker">Detektif LHO</p>
            <h1>Dashboard Guru</h1>
            <p>Pantau perkembangan belajar siswa dalam permainan Detektif LHO.</p>
          </div>
          <div class="guru-actions">
            <a class="btn btn-ghost" href="${DL.util.url("index.html")}">Halaman utama</a>
            <button type="button" class="btn btn-navy" data-action="guru-logout">Keluar</button>
          </div>
        </header>
        <section class="guru-stats" aria-label="Ringkasan">
          <div><b>${stats.total}</b><span>Siswa bermain</span></div>
          <div><b>${stats.done}</b><span>Semua misi selesai</span></div>
          <div><b>${stats.score}</b><span>Rata-rata skor</span></div>
          <div><b>${stats.open}</b><span>Belum selesai</span></div>
        </section>
        <section class="card guru-panel">
          <div class="section-head">
            <h2>Data siswa</h2>
            <div class="guru-actions">
              <button type="button" class="btn btn-gold" data-action="guru-csv">Download CSV</button>
              <button type="button" class="btn btn-ghost" data-action="guru-clear">Hapus seluruh data</button>
            </div>
          </div>
          <div class="guru-tools">
            <label class="field" for="guruFind">Cari nama
              <input id="guruFind" type="search" value="${esc(view.query)}" placeholder="Nama siswa">
            </label>
            <label class="field" for="guruClass">Kelas
              <select id="guruClass">${classOptions}</select>
            </label>
            <div class="guru-actions sort-row" aria-label="Urutkan">
              <button type="button" class="btn btn-ghost ${view.sort === "score-desc" ? "is-on" : ""}" data-action="guru-sort" data-sort="score-desc">Skor tertinggi</button>
              <button type="button" class="btn btn-ghost ${view.sort === "score-asc" ? "is-on" : ""}" data-action="guru-sort" data-sort="score-asc">Skor terendah</button>
              <button type="button" class="btn btn-ghost ${view.sort === "progress-desc" ? "is-on" : ""}" data-action="guru-sort" data-sort="progress-desc">Progres tertinggi</button>
              <button type="button" class="btn btn-ghost ${view.sort === "progress-asc" ? "is-on" : ""}" data-action="guru-sort" data-sort="progress-asc">Progres terendah</button>
            </div>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>No</th><th>Nama</th><th>Kelas</th><th>Total skor</th><th>Misi</th><th>Progres</th><th>Status</th><th>Terakhir bermain</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>${body}</tbody>
            </table>
          </div>
          <div class="pager">
            <button type="button" class="btn btn-ghost" data-action="guru-page" data-page="${view.page - 1}" ${view.page <= 1 ? "disabled" : ""}>Sebelumnya</button>
            <span>Halaman ${view.page} dari ${pages}</span>
            <button type="button" class="btn btn-ghost" data-action="guru-page" data-page="${view.page + 1}" ${view.page >= pages ? "disabled" : ""}>Berikutnya</button>
          </div>
          <details class="code-fold">
            <summary>Catat kode dari perangkat lain</summary>
            <p class="quiet">Siswa di komputer lain dapat menyalin kode nilai. Kode itu tidak memakai kelas, jadi barisnya ditandai “Dari kode”.</p>
            <label class="field" for="guruCode">Kode nilai
              <textarea id="guruCode" placeholder="Tempel kode LHO1 di sini"></textarea>
            </label>
            <div class="guru-actions">
              <button type="button" class="btn btn-navy" data-action="guru-add">Catat kode</button>
              <button type="button" class="btn btn-ghost" data-action="guru-local">Catat pemain di perangkat ini</button>
            </div>
          </details>
        </section>
      </div>`;
  }

  let codesAbsorbed = false;

  function paint() {
    if (signedIn() && !codesAbsorbed) {
      absorbCodes();
      codesAbsorbed = true;
    }
    root.innerHTML = signedIn() ? board() : loginScreen();
    const form = document.getElementById("guruLogin");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("guruPassword");
        if (input.value === DL.guruConfig.password) {
          sessionStorage.setItem(SESSION, "1");
          view.error = "";
          view.draft = "";
          view.showPassword = false;
          paint();
          return;
        }
        view.error = "Kata sandi belum tepat.";
        view.draft = input.value;
        view.showPassword = input.type === "text";
        paint();
        const again = document.getElementById("guruPassword");
        if (again) again.focus();
      });
    }
    const find = document.getElementById("guruFind");
    if (find) {
      find.addEventListener("input", () => {
        view.query = find.value;
        view.page = 1;
        const caret = find.selectionStart;
        paint();
        const next = document.getElementById("guruFind");
        if (next) {
          next.focus();
          next.setSelectionRange(caret, caret);
        }
      });
    }
    const classSelect = document.getElementById("guruClass");
    if (classSelect) {
      classSelect.addEventListener("change", () => {
        view.className = classSelect.value;
        view.page = 1;
        paint();
      });
    }
  }

  function studentById(id) {
    return students().find((student) => student.id === id) || null;
  }

  DL.on("guru-toggle-password", () => {
    view.draft = document.getElementById("guruPassword")?.value || "";
    view.showPassword = !view.showPassword;
    paint();
    const input = document.getElementById("guruPassword");
    if (input) input.focus();
  });

  DL.on("guru-logout", () => {
    sessionStorage.removeItem(SESSION);
    view.error = "";
    view.draft = "";
    view.showPassword = false;
    paint();
  });

  DL.on("guru-sort", (el) => {
    view.sort = el.dataset.sort || "score-desc";
    view.page = 1;
    paint();
  });

  DL.on("guru-page", (el) => {
    view.page = Number(el.dataset.page) || 1;
    paint();
  });

  DL.on("guru-detail", (el) => {
    const student = studentById(el.dataset.id);
    if (!student) return;
    DL.ui.dialog({ title: "Detail hasil", html: detailHtml(student) });
  });

  DL.on("guru-remove", (el) => {
    const student = studentById(el.dataset.id);
    if (!student) return;
    DL.ui.confirm({
      title: "Hapus data siswa?",
      text: `Data ${student.name} akan dihapus dari Dashboard Guru di peramban ini.`,
      ok: "Hapus",
      cancel: "Batal",
      onOk() {
        const active = DL.player.current();
        DL.roster.remove(student.id);
        if (active && DL.roster.idFor(active.name, active.className) === student.id) {
          DL.player.clear({ skipRoster: true });
        }
        if (String(student.id).startsWith("kode|") && DL.classbook) {
          const match = DL.classbook.list().find((item) => `kode|${item.createdAt || "kode"}|${item.name.toLocaleLowerCase("id-ID")}` === student.id);
          if (match) DL.classbook.remove(DL.classbook.id(match));
        }
        paint();
      },
    });
  });

  DL.on("guru-clear", () => {
    DL.ui.confirm({
      title: "Hapus seluruh data permainan?",
      text: "Semua catatan siswa di peramban ini akan dihapus, termasuk petualangan yang sedang tersimpan.",
      ok: "Hapus semua",
      cancel: "Batal",
      onOk() {
        DL.roster.clear();
        if (DL.classbook) DL.classbook.clear();
        DL.player.clear({ skipRoster: true });
        view.page = 1;
        paint();
      },
    });
  });

  DL.on("guru-csv", () => {
    const rows = sorted(filtered(students()));
    if (!rows.length) {
      DL.ui.toast("Belum ada data untuk diunduh.");
      return;
    }
    exportCsv(rows);
  });

  DL.on("guru-add", () => {
    const field = document.getElementById("guruCode");
    if (!field || !DL.classbook) return;
    try {
      const result = DL.classbook.addText(field.value);
      field.value = "";
      codesAbsorbed = false;
      DL.ui.toast(`${result.names.join(", ")} masuk catatan.`);
      paint();
    } catch (error) {
      DL.ui.toast(error.message || "Kode tidak bisa dibaca.");
    }
  });

  DL.on("guru-local", () => {
    const state = DL.player.current();
    if (!state?.name) {
      DL.ui.toast("Belum ada pemain tersimpan di perangkat ini.");
      return;
    }
    if (!state.className) {
      DL.ui.toast("Pemain ini belum memiliki kelas. Minta siswa mengisi kelas di beranda.");
      return;
    }
    DL.roster.sync(state);
    DL.ui.toast(`${state.name} diperbarui di dasbor.`);
    paint();
  });

  document.title = "Dashboard Guru · Detektif LHO";
  paint();
})();
