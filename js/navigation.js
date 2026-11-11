(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  function repair(state) {
    let dirty = false;
    const before = (state.badges || []).join("|");
    for (let id = 1; id <= 3; id += 1) {
      if (state.missions[id].completed && !state.missions[id + 1].unlocked) {
        state.missions[id + 1].unlocked = true;
        dirty = true;
      }
    }
    DL.achievements.sync(state);
    if (dirty || (state.badges || []).join("|") !== before) DL.player.save(state);
    return state;
  }

  DL.stats = function (state) {
    const stats = { correct: 0, incorrect: 0, done: 0, stars: 0, answered: 0, total: 0 };
    for (let id = 1; id <= 4; id += 1) {
      const mission = state.missions[id];
      stats.correct += mission.correct || 0;
      stats.incorrect += mission.incorrect || 0;
      stats.stars += mission.stars || 0;
      stats.answered += Object.keys(mission.answers || {}).length;
      stats.total += (DL.questions[id] || []).length;
      if (mission.completed) stats.done += 1;
    }
    const graded = stats.correct + stats.incorrect;
    stats.accuracy = graded ? Math.round((stats.correct / graded) * 100) : 0;
    return stats;
  };

  DL.guard = {
    player() {
      const state = DL.player.load();
      if (!state?.name) {
        window.location.href = DL.util.url("index.html");
        return null;
      }
      return repair(state);
    },

    mission() {
      const state = this.player();
      if (!state) return null;
      const missionId = Number(DL.util.query().get("m"));
      const mission = state.missions[missionId];
      if (!mission || !mission.unlocked) {
        DL.util.flash("Misi itu masih terkunci. Selesaikan misi sebelumnya terlebih dahulu.");
        window.location.href = DL.util.url("pages/adventure.html");
        return null;
      }
      return {
        state,
        missionId,
        practice: DL.util.query().get("practice") === "1",
      };
    },

    finale() {
      const state = this.player();
      if (!state) return null;
      const done = [1, 2, 3, 4].every((id) => state.missions[id].completed);
      if (!done) {
        DL.util.flash("Selesaikan empat misi untuk membuka halaman penutup.");
        window.location.href = DL.util.url("pages/adventure.html");
        return null;
      }
      return state;
    },
  };
})();
