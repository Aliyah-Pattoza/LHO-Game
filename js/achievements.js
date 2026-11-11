(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  DL.achievements = {
    list: [
      {
        id: "pemula",
        title: "Detektif Pemula",
        detail: "Menyelesaikan Misi 1.",
        test: (state) => state.missions[1].completed,
      },
      {
        id: "struktur",
        title: "Ahli Struktur",
        detail: "Menyelesaikan Misi 2.",
        test: (state) => state.missions[2].completed,
      },
      {
        id: "kata",
        title: "Pemburu Kata",
        detail: "Menyelesaikan Misi 3.",
        test: (state) => state.missions[3].completed,
      },
      {
        id: "andal",
        title: "Detektif Andal",
        detail: "Menyelesaikan Misi 4.",
        test: (state) => state.missions[4].completed,
      },
      {
        id: "master",
        title: "Master LHO",
        detail: "Menyelesaikan semua misi dengan 3 bintang.",
        test: (state) => [1, 2, 3, 4].every((id) => state.missions[id].stars >= 3),
      },
    ],

    sync(state) {
      const owned = new Set(state.badges || []);
      const unlocked = this.list.filter((badge) => badge.test(state)).map((badge) => badge.id);
      const fresh = unlocked.filter((id) => !owned.has(id));
      state.badges = unlocked;
      return fresh;
    },

    has(state, id) {
      return (state.badges || []).includes(id);
    },
  };
})();