(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});
  const KEY = "detektif-lho-v1";

  function blankMission(unlocked) {
    return {
      unlocked,
      completed: false,
      correct: 0,
      incorrect: 0,
      stars: 0,
      xpAwarded: 0,
      bonusGiven: false,
      questionOrder: null,
      viewIndex: 0,
      answers: {},
    };
  }

  function freshState(partial) {
    return {
      v: 1,
      name: "",
      className: "",
      avatar: "nara",
      sound: localStorage.getItem("dl-sound") !== "0",
      xp: 0,
      createdAt: new Date().toISOString(),
      badges: [],
      reflection: { learned: "", easy: "", more: "" },
      missions: {
        1: blankMission(true),
        2: blankMission(false),
        3: blankMission(false),
        4: blankMission(false),
      },
      ...partial,
    };
  }

  function normalize(raw) {
    if (!raw || typeof raw !== "object" || !raw.name) return null;
    const state = freshState();
    state.name = String(raw.name).slice(0, 18);
    state.className = String(raw.className || "").trim().slice(0, 16);
    state.avatar = ["nara", "dimas", "milo", "luna"].includes(raw.avatar) ? raw.avatar : "nara";
    state.sound = raw.sound !== false;
    state.xp = Number(raw.xp) || 0;
    state.createdAt = raw.createdAt || state.createdAt;
    state.badges = Array.isArray(raw.badges) ? raw.badges : [];
    state.reflection = {
      learned: raw.reflection?.learned || "",
      easy: raw.reflection?.easy || "",
      more: raw.reflection?.more || "",
    };
    for (let id = 1; id <= 4; id += 1) {
      const saved = raw.missions?.[id] || raw.missions?.[String(id)] || {};
      state.missions[id] = {
        ...blankMission(id === 1),
        ...saved,
        answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
      };
    }
    state.missions[1].unlocked = true;
    for (let id = 1; id <= 3; id += 1) {
      if (state.missions[id].completed) state.missions[id + 1].unlocked = true;
    }
    return state;
  }

  const memory = { state: null, fallback: false };

  const player = {
    avatars: [
      { id: "nara", name: "Nara", note: "Detektif muda" },
      { id: "dimas", name: "Dimas", note: "Penyelidik kota" },
      { id: "milo", name: "Milo", note: "Kucing akademi" },
      { id: "luna", name: "Luna", note: "Penjaga malam" },
    ],

    load() {
      if (memory.state) return memory.state;
      try {
        const raw = localStorage.getItem(KEY);
        memory.state = raw ? normalize(JSON.parse(raw)) : null;
      } catch (error) {
        memory.state = null;
      }
      return memory.state;
    },

    current() {
      return this.load();
    },

    soundOn() {
      const state = this.current();
      if (state) return state.sound !== false;
      return localStorage.getItem("dl-sound") !== "0";
    },

    save(state) {
      memory.state = state;
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
        memory.fallback = false;
      } catch (error) {
        memory.fallback = true;
      }
      if (state?.name && state.className && DL.roster) DL.roster.sync(state);
      return state;
    },

    update(mutator) {
      const state = this.load();
      if (!state) return null;
      mutator(state);
      return this.save(state);
    },

    create(name, avatar, className) {
      const state = freshState({
        name,
        className: className || "",
        avatar,
        sound: localStorage.getItem("dl-sound") !== "0",
      });
      return this.save(state);
    },

    restore(raw) {
      const state = normalize(raw);
      if (!state) return null;
      return this.save(state);
    },

    clear(options) {
      const state = this.load();
      if (!options?.skipRoster && state?.name && state.className && DL.roster) {
        DL.roster.remove(DL.roster.idFor(state.name, state.className));
      }
      memory.state = null;
      try {
        localStorage.removeItem(KEY);
      } catch (error) {
        memory.fallback = true;
      }
    },

    usingFallback() {
      return memory.fallback;
    },
  };

  DL.player = player;
})();
