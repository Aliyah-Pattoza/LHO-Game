(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});
  const KEY = "detektif-lho-kelas";
  const AVATARS = ["nara", "dimas", "milo", "luna"];

  function encode(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decode(code) {
    const normalized = code.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "===".slice((normalized.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new TextDecoder().decode(bytes);
  }

  function clip(value, max) {
    return String(value || "").trim().slice(0, max);
  }

  function missionBlock(raw) {
    const questions = {};
    const source = raw?.questions && typeof raw.questions === "object" ? raw.questions : {};
    Object.entries(source).forEach(([id, mark]) => {
      if (!/^m[1-4]q\d+$/.test(id)) return;
      questions[id] = mark ? 1 : 0;
    });
    return {
      completed: Boolean(raw?.completed),
      correct: Math.max(0, Number(raw?.correct) || 0),
      incorrect: Math.max(0, Number(raw?.incorrect) || 0),
      stars: Math.min(3, Math.max(0, Number(raw?.stars) || 0)),
      questions,
    };
  }

  function cleanStudent(student) {
    if (!student?.name || !DL.util.validName(student.name)) return null;
    const missions = {};
    for (let id = 1; id <= 4; id += 1) missions[id] = missionBlock(student.missions?.[id]);
    return {
      name: clip(student.name, 18),
      avatar: AVATARS.includes(student.avatar) ? student.avatar : "nara",
      xp: Math.max(0, Number(student.xp) || 0),
      createdAt: clip(student.createdAt, 40),
      badges: Array.isArray(student.badges) ? student.badges.map((id) => clip(id, 20)).filter(Boolean).slice(0, 8) : [],
      reflection: {
        learned: clip(student.reflection?.learned, 280),
        easy: clip(student.reflection?.easy, 280),
        more: clip(student.reflection?.more, 280),
      },
      missions,
    };
  }

  function fromState(state) {
    if (!state?.name) return null;
    const missions = {};
    for (let id = 1; id <= 4; id += 1) {
      const saved = state.missions?.[id] || {};
      const questions = {};
      Object.entries(saved.answers || {}).forEach(([questionId, record]) => {
        if (record && typeof record === "object") questions[questionId] = record.correct ? 1 : 0;
      });
      missions[id] = {
        completed: saved.completed,
        correct: saved.correct,
        incorrect: saved.incorrect,
        stars: saved.stars,
        questions,
      };
    }
    return cleanStudent({ ...state, missions });
  }

  function fromPacked(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.name && raw.missions && !raw.n) return fromState(raw);
    if (!raw.n || !raw.m) return null;
    const missions = {};
    for (let id = 1; id <= 4; id += 1) {
      const packed = raw.m[id] || raw.m[String(id)] || [];
      missions[id] = {
        completed: packed[0],
        correct: packed[1],
        incorrect: packed[2],
        stars: packed[3],
        questions: packed[4],
      };
    }
    const notes = Array.isArray(raw.r) ? raw.r : [];
    return cleanStudent({
      name: raw.n,
      avatar: raw.a,
      xp: raw.x,
      createdAt: raw.t,
      badges: raw.b,
      reflection: { learned: notes[0], easy: notes[1], more: notes[2] },
      missions,
    });
  }

  function pack(student) {
    const missions = {};
    for (let id = 1; id <= 4; id += 1) {
      const mission = student.missions[id];
      missions[id] = [mission.completed ? 1 : 0, mission.correct, mission.incorrect, mission.stars, mission.questions];
    }
    return {
      n: student.name,
      a: student.avatar,
      x: student.xp,
      t: student.createdAt,
      b: student.badges,
      r: [student.reflection.learned, student.reflection.easy, student.reflection.more],
      m: missions,
    };
  }

  function recordId(student) {
    return `${student.createdAt}|${student.name.toLocaleLowerCase("id-ID")}`;
  }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.map((item) => {
        const student = fromPacked(item);
        if (!student) return null;
        student.savedAt = item.savedAt || "";
        return student;
      }).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function save(list) {
    const packed = list.map((student) => ({ ...pack(student), savedAt: student.savedAt || new Date().toISOString() }));
    localStorage.setItem(KEY, JSON.stringify(packed));
    return list;
  }

  function parsePayload(text) {
    const source = String(text || "").trim();
    if (!source) throw new Error("Kode nilai masih kosong.");
    if (source.startsWith("LHO1.")) {
      const student = fromPacked(JSON.parse(decode(source.slice(5))));
      if (!student) throw new Error("Kode nilai tidak dikenali.");
      return [student];
    }
    const data = JSON.parse(source);
    const rows = Array.isArray(data) ? data : data.students || [data.code || data];
    const students = rows.map((item) => {
      if (typeof item === "string") return parsePayload(item)[0];
      return fromPacked(item);
    }).filter(Boolean);
    if (!students.length) throw new Error("Berkas tidak berisi nilai siswa.");
    return students;
  }

  DL.classbook = {
    codeFromState(state) {
      const student = fromState(state);
      if (!student) return "";
      return `LHO1.${encode(JSON.stringify(pack(student)))}`;
    },

    list() {
      return load();
    },

    add(student) {
      const list = load();
      const id = recordId(student);
      const next = { ...student, savedAt: new Date().toISOString() };
      const index = list.findIndex((item) => recordId(item) === id);
      if (index >= 0) list[index] = next;
      else list.push(next);
      save(list);
      return { updated: index >= 0, total: list.length };
    },

    addText(text) {
      let students;
      try {
        students = parsePayload(text);
      } catch (error) {
        if (String(error.message || "").startsWith("Kode") || String(error.message || "").startsWith("Berkas")) throw error;
        throw new Error("Kode atau berkas tidak bisa dibaca.");
      }
      let updated = 0;
      students.forEach((student) => {
        if (this.add(student).updated) updated += 1;
      });
      return { count: students.length, updated, names: students.map((student) => student.name) };
    },

    remove(id) {
      save(load().filter((student) => recordId(student) !== id));
    },

    clear() {
      localStorage.removeItem(KEY);
    },

    id: recordId,

    exportJson() {
      return JSON.stringify({ students: load().map(pack) }, null, 2);
    },
  };

  DL.on("copy-score", async () => {
    const state = DL.player.current();
    const code = state ? DL.classbook.codeFromState(state) : "";
    if (!code) {
      DL.ui.toast("Nilai belum bisa disalin.");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      DL.ui.toast("Kode nilai tersalin. Tempel di dasbor guru.");
    } catch (error) {
      DL.ui.dialog({
        title: "Kode nilai",
        html: `<p>Salin kode di bawah ini, lalu tempel di dasbor guru.</p><textarea class="score-code" readonly>${DL.util.esc(code)}</textarea>`,
      });
    }
  });
})();
