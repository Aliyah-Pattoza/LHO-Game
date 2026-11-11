(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  DL.scoring = {
    XP_CORRECT: 100,
    XP_BONUS: 200,

    stars(correct, total) {
      if (!total) return 1;
      const accuracy = correct / total;
      if (accuracy >= 0.85) return 3;
      if (accuracy >= 0.6) return 2;
      return 1;
    },

    // Nilai hanya dicatat sekali per soal pada percobaan pertama.
    record(state, missionId, correct) {
      const mission = state.missions[missionId];
      if (mission.completed) return { xpGain: 0 };
      if (!mission.startedAt) mission.startedAt = new Date().toISOString();
      if (correct) {
        mission.correct += 1;
        mission.xpAwarded += this.XP_CORRECT;
        state.xp += this.XP_CORRECT;
        return { xpGain: this.XP_CORRECT };
      }
      mission.incorrect += 1;
      return { xpGain: 0 };
    },

    finish(state, missionId) {
      const mission = state.missions[missionId];
      if (mission.completed) {
        return {
          bonus: 0,
          stars: mission.stars,
          freshBadges: [],
          total: mission.correct + mission.incorrect,
          already: true,
        };
      }
      const values = Object.values(mission.answers || {});
      mission.correct = values.filter((item) => item.correct).length;
      mission.incorrect = values.length - mission.correct;
      const total = mission.correct + mission.incorrect;
      mission.stars = this.stars(mission.correct, total);
      mission.completed = true;
      mission.completedAt = new Date().toISOString();
      let bonus = 0;
      if (!mission.bonusGiven) {
        mission.bonusGiven = true;
        bonus = this.XP_BONUS;
        state.xp += bonus;
      }
      if (state.missions[missionId + 1]) state.missions[missionId + 1].unlocked = true;
      const freshBadges = DL.achievements.sync(state);
      return { bonus, stars: mission.stars, freshBadges, total };
    },

    // Latihan ulang boleh menaikkan bintang, tetapi tidak menambah XP.
    applyPractice(state, missionId, correct, total) {
      const mission = state.missions[missionId];
      const stars = this.stars(correct, total);
      const improved = stars > mission.stars || (stars === mission.stars && correct > mission.correct);
      if (improved) {
        mission.stars = stars;
        mission.correct = correct;
        mission.incorrect = total - correct;
      }
      const freshBadges = DL.achievements.sync(state);
      return { stars, improved, freshBadges };
    },

    missionXp(mission) {
      return (mission.xpAwarded || 0) + (mission.bonusGiven ? this.XP_BONUS : 0);
    },
  };
})();
