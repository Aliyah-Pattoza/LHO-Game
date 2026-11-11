(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});
  if (document.body.dataset.page !== "home") return;

  const esc = (value) => DL.util.esc(value);
  DL.audio.setEnabled(DL.player.soundOn());
  const form = document.getElementById("startForm");
  const nameInput = document.getElementById("playerName");
  const classInput = document.getElementById("playerClass");
  const error = document.getElementById("formError");
  const welcome = document.getElementById("welcomeSlot");
  const hero = document.getElementById("heroArt");
  let avatar = "nara";

  hero.innerHTML = DL.art.detective();
  document.getElementById("avatarPicker").innerHTML = DL.player.avatars.map((item) => `
    <button type="button" class="avatar-btn ${item.id === avatar ? "is-selected" : ""}" data-action="pick-avatar" data-avatar="${item.id}" aria-pressed="${item.id === avatar ? "true" : "false"}">
      <span class="avatar">${DL.art.avatar(item.id)}</span>
      <strong>${esc(item.name)}</strong>
      <small>${esc(item.note)}</small>
    </button>`).join("");

  const existing = DL.player.load();
  if (existing?.name) {
    avatar = existing.avatar;
    nameInput.value = existing.name;
    if (existing.className) classInput.value = existing.className;
    document.querySelectorAll("[data-avatar]").forEach((button) => {
      const on = button.dataset.avatar === avatar;
      button.classList.toggle("is-selected", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
    const stats = DL.stats(existing);
    welcome.innerHTML = `
      <div class="welcome">
        <span class="avatar">${DL.art.avatar(existing.avatar)}</span>
        <div>
          <strong>Selamat datang kembali, ${esc(existing.name)}</strong>
          <p>${existing.className ? `${esc(existing.className)} · ` : ""}${stats.done}/4 misi selesai · ${DL.util.formatXp(existing.xp)}</p>
          ${existing.className ? "" : `<p class="quiet">Isi kelas pada formulir supaya progresmu tercatat di Dashboard Guru.</p>`}
        </div>
        <a class="btn btn-navy" href="${DL.util.url("pages/adventure.html")}">Lanjutkan</a>
      </div>`;
  }

  function selectAvatar(id) {
    avatar = id;
    document.querySelectorAll("[data-avatar]").forEach((button) => {
      const on = button.dataset.avatar === id;
      button.classList.toggle("is-selected", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function identity() {
    return {
      name: nameInput.value.trim().replace(/\s+/g, " "),
      className: classInput.value.trim().replace(/\s+/g, " "),
    };
  }

  function sameStudent(state, next) {
    if (!state?.name) return false;
    const name = state.name.trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
    const room = String(state.className || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
    return name === next.name.toLocaleLowerCase("id-ID") && room === next.className.toLocaleLowerCase("id-ID");
  }

  function startGame() {
    const next = identity();
    if (!DL.util.validName(next.name)) {
      error.textContent = "Tuliskan nama 2–18 huruf, Detektif.";
      nameInput.focus();
      return;
    }
    if (!DL.util.validClass(next.className)) {
      error.textContent = "Tuliskan kelas, misalnya X-A.";
      classInput.focus();
      return;
    }
    error.textContent = "";
    const saved = DL.roster.find(next.name, next.className);
    const current = DL.player.current();
    if (saved) {
      saved.state.name = next.name;
      saved.state.className = next.className;
      saved.state.avatar = avatar;
      DL.player.restore(saved.state);
    } else if (current?.name && sameStudent(current, next)) {
      DL.player.update((state) => {
        state.name = next.name;
        state.className = next.className;
        state.avatar = avatar;
      });
    } else if (current?.name && !current.className && current.name.trim().toLocaleLowerCase("id-ID") === next.name.toLocaleLowerCase("id-ID")) {
      DL.player.update((state) => {
        state.name = next.name;
        state.className = next.className;
        state.avatar = avatar;
      });
    } else {
      DL.player.create(next.name, avatar, next.className);
    }
    DL.audio.play("tap");
    window.location.href = DL.util.url("pages/adventure.html");
  }

  DL.on("pick-avatar", (el) => {
    selectAvatar(el.dataset.avatar);
    DL.audio.play("tap");
  });

  DL.on("how", () => {
    DL.ui.dialog({
      title: "Cara bermain",
      html: `<ol>
        <li>Masukkan nama, kelas, dan pilih avatar.</li>
        <li>Buka peta. Misi terbuka satu per satu.</li>
        <li>Baca catatan materi sebelum tantangan.</li>
        <li>Jawab soal. Jawaban benar memberi 100 XP dan hanya dihitung sekali.</li>
        <li>Menyelesaikan misi memberi bonus 200 XP dan 1–3 bintang.</li>
        <li>Kumpulkan lima lencana. Progres tersimpan di perangkatmu.</li>
        <li>Suara dapat dimatikan. Tombol ulangi menghapus progres setelah konfirmasi.</li>
      </ol>`,
    });
  });

  DL.on("about", () => {
    DL.ui.dialog({
      title: "Tentang game",
      html: `<p>Detektif LHO adalah petualangan edukatif untuk siswa SMA Kelas X pada materi Teks Laporan Hasil Observasi.</p>
        <p>Kamu berperan sebagai detektif muda yang menutup empat kasus: pengertian teks, struktur, kaidah kebahasaan, dan analisis laporan utuh.</p>
        <p>Game berjalan di peramban. Nama, XP, dan progres hanya disimpan di perangkat pemain melalui LocalStorage, tanpa server.</p>`,
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = identity();
    const current = DL.player.current();
    const returning = DL.roster.find(next.name, next.className) || (current && sameStudent(current, next));
    const attaching = current?.name && !current.className && current.name.trim().toLocaleLowerCase("id-ID") === next.name.toLocaleLowerCase("id-ID");
    if (current?.name && !returning && !attaching) {
      DL.ui.confirm({
        title: "Mulai petualangan baru?",
        text: "Petualangan yang sedang terbuka akan diganti. Catatan siswa lain di Dashboard Guru tetap tersimpan.",
        ok: "Ganti petualangan",
        cancel: "Batal",
        onOk: startGame,
      });
      return;
    }
    startGame();
  });
})();
