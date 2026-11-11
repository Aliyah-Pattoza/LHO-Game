(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});
  const esc = (value) => DL.util.esc(value);

  const session = {
    missionId: 0,
    practice: false,
    order: [],
    index: 0,
    answers: {},
    drafts: {},
    hints: {},
    caseOpen: true,
    busy: false,
  };

  function missionSave() {
    return DL.player.current().missions[session.missionId];
  }

  function saved(questionId) {
    if (session.practice) return session.answers[questionId] || null;
    return missionSave().answers[questionId] || null;
  }

  function current() {
    return DL.questionById(session.missionId, session.order[session.index]);
  }

  function keyOf(question) {
    if (question.type === "mcq") return question.answer;
    if (question.type === "blank") return question.answers.map((accepted) => accepted[0]);
    if (question.type === "match") return Object.fromEntries(question.pairs.map((pair) => [pair.id, pair.right]));
    if (question.type === "order") return [...question.answer];
    if (question.type === "structure") return Object.fromEntries(question.blocks.map((block) => [block.id, block.answer]));
    return null;
  }

  function grade(question, response) {
    if (question.type === "mcq") {
      const choice = question.choices.find((item) => item.id === question.answer);
      return { correct: response === question.answer, key: choice ? choice.text : "" };
    }
    if (question.type === "blank") {
      const values = Array.isArray(response) ? response : [];
      const correct = question.answers.every((accepted, index) => {
        const given = String(values[index] || "").trim().toLowerCase();
        return accepted.some((word) => word.toLowerCase() === given);
      });
      return { correct, key: question.answers.map((accepted) => accepted[0]).join(" · ") };
    }
    if (question.type === "match") {
      const map = response || {};
      const correct = question.pairs.every((pair) => map[pair.id] === pair.right);
      return { correct, key: question.pairs.map((pair) => `${pair.left} → ${pair.right}`).join("\n") };
    }
    if (question.type === "order") {
      const ids = Array.isArray(response) ? response : [];
      const correct = question.answer.length === ids.length && question.answer.every((id, index) => id === ids[index]);
      const labels = question.answer.map((id) => question.items.find((item) => item.id === id)?.text || id);
      return { correct, key: labels.join(" → ") };
    }
    if (question.type === "structure") {
      const map = response || {};
      const correct = question.blocks.every((block) => map[block.id] === block.answer);
      const key = question.blocks.map((block) => {
        const label = question.labels.find((item) => item.id === block.answer);
        return `${label ? label.text : block.answer}: ${block.text}`;
      }).join("\n");
      return { correct, key };
    }
    return { correct: false, key: "" };
  }

  function shuffledOrder(question) {
    const ids = DL.util.shuffle(question.items.map((item) => item.id));
    const same = ids.every((id, index) => id === question.answer[index]);
    if (same && ids.length > 1) [ids[0], ids[1]] = [ids[1], ids[0]];
    return ids;
  }

  function shuffledRights(question) {
    const rights = DL.util.shuffle(question.pairs.map((pair) => pair.right));
    const same = question.pairs.every((pair, index) => pair.right === rights[index]);
    if (same && rights.length > 1) [rights[0], rights[1]] = [rights[1], rights[0]];
    return rights;
  }

  function ensureDraft(question) {
    if (saved(question.id)) return null;
    if (!session.drafts[question.id]) {
      if (question.type === "mcq") session.drafts[question.id] = { choice: null };
      else if (question.type === "blank") session.drafts[question.id] = { blanks: question.answers.map(() => ""), focus: 0 };
      else if (question.type === "match") session.drafts[question.id] = { pairs: {}, active: question.pairs[0]?.id || null, rights: shuffledRights(question) };
      else if (question.type === "order") session.drafts[question.id] = { order: shuffledOrder(question) };
      else if (question.type === "structure") session.drafts[question.id] = { labels: {} };
      else session.drafts[question.id] = {};
    }
    return session.drafts[question.id];
  }

  function ready(question, draft) {
    if (!draft) return false;
    if (question.type === "mcq") return Boolean(draft.choice);
    if (question.type === "blank") return draft.blanks.every(Boolean);
    if (question.type === "match") return question.pairs.every((pair) => draft.pairs[pair.id]);
    if (question.type === "order") return draft.order.length === question.items.length;
    if (question.type === "structure") return question.blocks.every((block) => draft.labels[block.id]);
    return false;
  }

  function responseOf(question, draft) {
    if (question.type === "mcq") return draft.choice;
    if (question.type === "blank") return [...draft.blanks];
    if (question.type === "match") return { ...draft.pairs };
    if (question.type === "order") return [...draft.order];
    if (question.type === "structure") return { ...draft.labels };
    return null;
  }

  function helpText(question) {
    const help = {
      mcq: "Pilih satu jawaban, lalu kirim.",
      match: "Pilih kartu kiri, lalu pilih pasangannya di kanan.",
      order: "Seret gagang atau gunakan tombol Naik dan Turun.",
      structure: "Beri label pada setiap cuplikan.",
      blank: "Ketuk kotak rumpang, lalu pilih kata dari bank kata.",
    };
    return help[question.type] || "";
  }

  function lines(text) {
    return String(text || "")
      .split("\n")
      .map((line) => `<li>${esc(line)}</li>`)
      .join("");
  }

  function caseFile() {
    const mission = DL.missionById(session.missionId);
    if (!mission?.caseFile) return "";
    const paragraphs = mission.caseFile.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
    return `
      <details class="case-file" ${session.caseOpen ? "open" : ""}>
        <summary>${esc(mission.caseFile.title)}</summary>
        <div class="case-body">${paragraphs}</div>
      </details>`;
  }

  function renderMcq(question, record, draft) {
    const chosen = record ? record.response : draft.choice;
    return `<div class="choices">${question.choices.map((choice, index) => {
      const classes = ["choice"];
      if (chosen === choice.id) classes.push(record ? (record.correct ? "is-correct" : "is-wrong") : "is-selected");
      if (record && choice.id === question.answer) classes.push("is-correct");
      return `<button type="button" class="${classes.join(" ")}" data-action="pick-choice" data-choice="${esc(choice.id)}" ${record ? "disabled" : ""}>
        <span class="choice-key">${"ABCD"[index] || index + 1}</span>
        <span>${esc(choice.text)}</span>
      </button>`;
    }).join("")}</div>`;
  }

  function renderBlank(question, record, draft) {
    const values = record ? record.response || [] : draft.blanks;
    const focus = record ? -1 : draft.focus;
    const parts = question.template.split(/\{\{(\d+)\}\}/);
    let sentence = "";
    parts.forEach((part, index) => {
      if (index % 2 === 0) sentence += esc(part);
      else {
        const slot = Number(part);
        const value = values[slot] || "";
        sentence += `<button type="button" class="blank-slot ${value ? "is-filled" : ""} ${focus === slot ? "is-focus" : ""}" data-action="focus-blank" data-index="${slot}" ${record ? "disabled" : ""}>${value ? esc(value) : "····"}</button>`;
      }
    });
    const used = new Set(values.filter(Boolean));
    const bank = question.bank.filter((word) => !used.has(word)).map((word) => `
      <button type="button" class="word-chip" data-action="use-word" data-word="${esc(word)}" ${record ? "disabled" : ""}>${esc(word)}</button>`).join("");
    return `<p class="blank-sentence">${sentence}</p><div class="bank">${bank || "<span class=\"quiet\">Semua kata sudah dipakai.</span>"}</div>`;
  }

  function renderMatch(question, record, draft) {
    if (record) {
      return question.pairs.map((pair) => {
        const chosen = record.response?.[pair.id] || "Belum dipasangkan";
        const ok = chosen === pair.right;
        return `<div class="review-row ${ok ? "is-ok" : "is-bad"}"><p>${esc(pair.left)}</p><strong>${esc(chosen)}</strong></div>`;
      }).join("");
    }
    const left = question.pairs.map((pair) => `
      <button type="button" class="match-card ${draft.active === pair.id ? "is-active" : ""}" data-action="pick-left" data-left="${esc(pair.id)}">
        <span>${esc(pair.left)}</span>
        <small>${draft.pairs[pair.id] ? esc(draft.pairs[pair.id]) : "Pilih pasangan"}</small>
      </button>`).join("");
    const right = draft.rights.map((label) => {
      const used = Object.values(draft.pairs).includes(label);
      return `<button type="button" class="match-card ${used ? "is-used" : ""}" data-action="pick-right" data-right="${esc(label)}">${esc(label)}</button>`;
    }).join("");
    return `<div class="match-board"><div class="match-col">${left}</div><div class="match-col">${right}</div></div>`;
  }

  function renderOrder(question, record, draft) {
    const ids = record ? record.response || [] : draft.order;
    return `<ol class="order-list">${ids.map((id, index) => {
      const item = question.items.find((entry) => entry.id === id);
      const correctHere = record && question.answer[index] === id;
      return `<li data-id="${esc(id)}" class="${record ? (correctHere ? "is-correct" : "is-wrong") : ""}">
        <button type="button" class="drag-handle" data-action="drag-handle" aria-label="Seret untuk mengurutkan" ${record ? "disabled" : ""}>⋮⋮</button>
        <span class="order-copy"><span class="ord"></span>${esc(item ? item.text : id)}</span>
        ${record ? "" : `<span class="order-move">
          <button type="button" data-action="move-up" data-index="${index}" ${index === 0 ? "disabled" : ""}>Naik</button>
          <button type="button" data-action="move-down" data-index="${index}" ${index === ids.length - 1 ? "disabled" : ""}>Turun</button>
        </span>`}
      </li>`;
    }).join("")}</ol>`;
  }

  function renderStructure(question, record, draft) {
    return question.blocks.map((block) => {
      const chosen = record ? record.response?.[block.id] : draft.labels[block.id];
      const labels = question.labels.map((label) => {
        const classes = ["label-btn"];
        if (chosen === label.id) classes.push(record ? (label.id === block.answer ? "is-correct" : "is-wrong") : "is-selected");
        if (record && label.id === block.answer) classes.push("is-correct");
        return `<button type="button" class="${classes.join(" ")}" data-action="pick-label" data-block="${esc(block.id)}" data-label="${esc(label.id)}" ${record ? "disabled" : ""}>${esc(label.text)}</button>`;
      }).join("");
      return `<article class="struct-block"><p>${esc(block.text)}</p><div class="label-row">${labels}</div></article>`;
    }).join("");
  }

  function interaction(question, record, draft) {
    if (question.type === "mcq") return renderMcq(question, record, draft);
    if (question.type === "blank") return renderBlank(question, record, draft);
    if (question.type === "match") return renderMatch(question, record, draft);
    if (question.type === "order") return renderOrder(question, record, draft);
    if (question.type === "structure") return renderStructure(question, record, draft);
    return "";
  }

  function scoreLine() {
    const entries = session.practice ? Object.values(session.answers) : Object.values(missionSave().answers);
    const correct = entries.filter((item) => item.correct).length;
    return `${correct} benar · ${entries.length - correct} salah`;
  }

  function feedback(question, record) {
    if (!record) return "";
    const result = grade(question, record.response);
    const multi = String(result.key).includes("\n");
    let xp = "Tidak ada XP untuk jawaban ini. Bacalah penjelasannya, lalu lanjutkan.";
    if (session.practice) xp = record.correct ? "Tepat. Latihan ulang tidak menambah XP." : "Belum tepat. Latihan ulang tidak mengurangi XP.";
    else if (record.correct) xp = `Jejak yang tepat. +${record.xpGain || 0} XP.`;
    return `
      <div class="feedback ${record.correct ? "is-ok" : "is-bad"}" role="status">
        <span class="stamp" aria-hidden="true">${record.correct ? "Tepat" : "Ulangi"}</span>
        <strong>${record.correct ? "Tepat, Detektif!" : "Belum kena."}</strong>
        <p>${esc(xp)}</p>
        ${record.correct ? "" : `<div><b>Jawaban yang tepat</b>${multi ? `<ul>${lines(result.key)}</ul>` : `<p>${esc(result.key)}</p>`}</div>`}
        <p>${esc(question.explanation)}</p>
      </div>`;
  }

  function paint(scrollTop, focusFeedback) {
    const question = current();
    const mission = DL.missionById(session.missionId);
    const record = saved(question.id);
    const draft = record ? null : ensureDraft(question);
    const total = session.order.length;
    const answered = session.order.filter((id) => saved(id)).length;
    const allDone = answered === total;
    const dots = session.order.map((id, index) => {
      const classes = ["dot"];
      if (saved(id)) classes.push("is-done");
      if (index === session.index) classes.push("is-now");
      return `<button type="button" class="${classes.join(" ")}" data-action="jump-question" data-index="${index}" aria-label="Soal ${index + 1}"></button>`;
    }).join("");
    const actions = [];
    if (session.index > 0) actions.push(`<button type="button" class="btn btn-ghost" data-action="prev-question">Sebelumnya</button>`);
    if (!record) actions.push(`<button type="button" class="btn btn-gold" data-action="submit-answer">Kirim jawaban</button>`);
    else if (session.index < total - 1) actions.push(`<button type="button" class="btn btn-gold" data-action="next-question">Soal berikutnya</button>`);
    if (allDone) actions.push(`<button type="button" class="btn btn-navy" data-action="finish-mission">${session.practice ? "Lihat hasil latihan" : "Selesaikan misi"}</button>`);

    const html = `
      ${session.index === 0 ? DL.ui.speech("Inspektur Sena", mission.brief) : ""}
      ${session.practice ? `<p class="banner">Mode latihan. Bintang dapat naik, XP tidak bertambah.</p>` : ""}
      <section class="quiz-card">
        <div class="quiz-top">
          <span class="chip">${esc(DL.questionLabel(question))}</span>
          <span>Soal ${session.index + 1} dari ${total}</span>
          <span>${session.practice ? "Latihan" : DL.util.formatXp(missionSave().xpAwarded || 0)}</span>
        </div>
        <div class="bar" aria-hidden="true"><span style="width:${Math.round((answered / total) * 100)}%"></span></div>
        <div class="dots">${dots}</div>
        <p class="quiet">${esc(scoreLine())} · ${esc(helpText(question))}</p>
        ${caseFile()}
        <h1>${esc(question.prompt)}</h1>
        ${question.hint ? `<button type="button" class="text-btn" data-action="toggle-hint">${session.hints[question.id] ? "Sembunyikan petunjuk" : "Minta petunjuk"}</button>` : ""}
        ${session.hints[question.id] ? `<p class="hint">${esc(question.hint)}</p>` : ""}
        ${interaction(question, record, draft)}
        ${feedback(question, record)}
        <div class="btn-row">${actions.join("")}</div>
        <p class="quiet links"><a href="${DL.util.url(`pages/material.html?m=${session.missionId}`)}">Baca materi</a> · <a href="${DL.util.url("pages/adventure.html")}">Kembali ke peta</a></p>
      </section>`;
    const app = document.getElementById("app");
    const y = scrollTop ? 0 : window.scrollY;
    app.innerHTML = DL.ui.shell(html);
    window.scrollTo(0, y);
    if (focusFeedback) {
      const box = app.querySelector(".feedback");
      if (box) box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function persistView() {
    if (session.practice) return;
    DL.player.update((state) => {
      state.missions[session.missionId].viewIndex = session.index;
    });
  }

  function go(index) {
    if (index < 0 || index >= session.order.length) return;
    const frontier = session.order.findIndex((id) => !saved(id));
    const allowed = saved(session.order[index]) || index === frontier || index === session.index;
    if (!allowed) {
      DL.ui.toast("Selesaikan soal yang sedang terbuka terlebih dahulu.");
      return;
    }
    session.index = index;
    persistView();
    paint(true);
  }

  function submit() {
    const question = current();
    if (!question || saved(question.id) || session.busy) return;
    const draft = ensureDraft(question);
    if (!ready(question, draft)) {
      DL.ui.toast("Lengkapi jawabanmu terlebih dahulu, Detektif.");
      return;
    }
    session.busy = true;
    try {
      const response = responseOf(question, draft);
      const result = grade(question, response);
      if (session.practice) {
        session.answers[question.id] = { correct: result.correct, response, xpGain: 0 };
      } else {
        DL.player.update((state) => {
          const mission = state.missions[session.missionId];
          if (mission.answers[question.id] || mission.completed) return;
          const gained = DL.scoring.record(state, session.missionId, result.correct);
          mission.answers[question.id] = { correct: result.correct, response, xpGain: gained.xpGain };
          mission.viewIndex = session.index;
        });
      }
      DL.audio.play(result.correct ? "ok" : "bad");
      paint(false, true);
    } finally {
      session.busy = false;
    }
  }

  function finish() {
    if (!session.order.every((id) => saved(id)) || session.busy) return;
    session.busy = true;
    if (session.practice) {
      const correct = session.order.filter((id) => session.answers[id].correct).length;
      const total = session.order.length;
      let outcome = null;
      DL.player.update((state) => {
        outcome = DL.scoring.applyPractice(state, session.missionId, correct, total);
      });
      sessionStorage.setItem("dl-practice-result", JSON.stringify({
        missionId: session.missionId,
        correct,
        incorrect: total - correct,
        stars: outcome.stars,
        improved: outcome.improved,
        freshBadges: outcome.freshBadges,
      }));
      window.location.href = DL.util.url(`pages/result.html?m=${session.missionId}&practice=1`);
      return;
    }
    let outcome = null;
    DL.player.update((state) => {
      outcome = DL.scoring.finish(state, session.missionId);
    });
    if (!outcome.already) sessionStorage.setItem("dl-fanfare", String(session.missionId));
    if (outcome.freshBadges?.length) sessionStorage.setItem("dl-new-badges", JSON.stringify(outcome.freshBadges));
    window.location.href = DL.util.url(`pages/result.html?m=${session.missionId}`);
  }

  DL.quiz = {
    grade,
    keyOf,
    open(missionId, practice) {
      const state = DL.player.current();
      const mission = state.missions[missionId];
      const ids = DL.questions[missionId].map((question) => question.id);
      session.missionId = missionId;
      session.practice = Boolean(practice);
      session.answers = {};
      session.drafts = {};
      session.hints = {};
      session.caseOpen = true;
      session.busy = false;
      if (session.practice) {
        session.order = DL.util.shuffle(ids);
        session.index = 0;
      } else {
        const valid = mission.questionOrder && mission.questionOrder.length === ids.length && mission.questionOrder.every((id) => ids.includes(id));
        if (!valid) {
          if (Object.keys(mission.answers).length === 0) mission.questionOrder = DL.util.shuffle(ids);
          else {
            const merged = (mission.questionOrder || []).filter((id) => ids.includes(id));
            ids.forEach((id) => {
              if (!merged.includes(id)) merged.push(id);
            });
            mission.questionOrder = merged;
          }
          DL.player.save(state);
        }
        session.order = mission.questionOrder.slice();
        session.index = Math.min(mission.viewIndex || 0, session.order.length - 1);
      }
      document.title = `${DL.missionById(missionId).title} · Detektif LHO`;
      paint(true);
    },
    commitOrder(ids) {
      const question = current();
      if (!question || question.type !== "order" || saved(question.id)) return;
      ensureDraft(question).order = ids;
      paint(false);
    },
    canDrag() {
      const question = current();
      return Boolean(question && question.type === "order" && !saved(question.id));
    },
    selfTest() {
      const problems = [];
      const seen = new Set();
      [1, 2, 3, 4].forEach((missionId) => {
        const pack = DL.questions[missionId] || [];
        if (pack.length < 5 || pack.length > 8) problems.push(`jumlah soal misi ${missionId}`);
        if (!DL.materials[missionId]?.length) problems.push(`materi misi ${missionId}`);
        pack.forEach((question) => {
          if (seen.has(question.id)) problems.push(`id ganda ${question.id}`);
          seen.add(question.id);
          if (!question.explanation || question.explanation.length < 20) problems.push(`penjelasan ${question.id}`);
          if (!grade(question, keyOf(question)).correct) problems.push(`kunci gagal ${question.id}`);
          if (question.type === "mcq" && !question.choices.some((choice) => choice.id === question.answer)) problems.push(`pilihan ${question.id}`);
          if (question.type === "blank") {
            const slots = question.template.match(/\{\{(\d+)\}\}/g) || [];
            if (slots.length !== question.answers.length) problems.push(`rumpang ${question.id}`);
          }
          const wrong = wrongOf(question);
          if (grade(question, wrong).correct) problems.push(`jawaban salah lolos ${question.id}`);
        });
      });
      const types = new Set(Object.values(DL.questions).flat().map((question) => question.type));
      ["mcq", "match", "order", "structure", "blank"].forEach((type) => {
        if (!types.has(type)) problems.push(`tipe hilang ${type}`);
      });
      return problems;
    },
  };

  function wrongOf(question) {
    if (question.type === "mcq") return question.choices.find((choice) => choice.id !== question.answer).id;
    if (question.type === "blank") return question.answers.map(() => "___salah___");
    if (question.type === "order") return [...question.answer].reverse();
    if (question.type === "match") {
      const map = {};
      question.pairs.forEach((pair, index) => {
        map[pair.id] = question.pairs[(index + 1) % question.pairs.length].right;
      });
      return map;
    }
    const map = {};
    question.blocks.forEach((block) => {
      map[block.id] = question.labels.find((label) => label.id !== block.answer).id;
    });
    return map;
  }

  DL.on("pick-choice", (el) => {
    const question = current();
    if (!question || saved(question.id)) return;
    ensureDraft(question).choice = el.dataset.choice;
    paint(false);
  });

  DL.on("focus-blank", (el) => {
    const question = current();
    if (!question || saved(question.id)) return;
    const draft = ensureDraft(question);
    const index = Number(el.dataset.index);
    if (draft.blanks[index]) draft.blanks[index] = "";
    draft.focus = index;
    paint(false);
  });

  DL.on("use-word", (el) => {
    const question = current();
    if (!question || saved(question.id)) return;
    const draft = ensureDraft(question);
    const word = el.dataset.word;
    let slot = draft.focus;
    if (draft.blanks[slot]) slot = draft.blanks.findIndex((value) => !value);
    if (slot < 0) return;
    draft.blanks = draft.blanks.map((value, index) => {
      if (index === slot) return word;
      return value === word ? "" : value;
    });
    const next = draft.blanks.findIndex((value) => !value);
    draft.focus = next === -1 ? slot : next;
    paint(false);
  });

  DL.on("pick-left", (el) => {
    const question = current();
    if (!question || saved(question.id)) return;
    ensureDraft(question).active = el.dataset.left;
    paint(false);
  });

  DL.on("pick-right", (el) => {
    const question = current();
    if (!question || saved(question.id)) return;
    const draft = ensureDraft(question);
    if (!draft.active) {
      DL.ui.toast("Pilih kartu di kolom kiri terlebih dahulu.");
      return;
    }
    const label = el.dataset.right;
    Object.keys(draft.pairs).forEach((key) => {
      if (draft.pairs[key] === label) delete draft.pairs[key];
    });
    if (draft.pairs[draft.active] === label) delete draft.pairs[draft.active];
    else draft.pairs[draft.active] = label;
    paint(false);
  });

  DL.on("pick-label", (el) => {
    const question = current();
    if (!question || saved(question.id)) return;
    ensureDraft(question).labels[el.dataset.block] = el.dataset.label;
    paint(false);
  });

  DL.on("move-up", (el) => move(Number(el.dataset.index), -1));
  DL.on("move-down", (el) => move(Number(el.dataset.index), 1));

  function move(index, delta) {
    const question = current();
    if (!question || question.type !== "order" || saved(question.id)) return;
    const draft = ensureDraft(question);
    const next = index + delta;
    if (next < 0 || next >= draft.order.length) return;
    const ids = [...draft.order];
    [ids[index], ids[next]] = [ids[next], ids[index]];
    draft.order = ids;
    paint(false);
  }

  DL.on("toggle-hint", () => {
    const question = current();
    if (!question) return;
    session.hints[question.id] = !session.hints[question.id];
    paint(false);
  });

  DL.on("submit-answer", () => submit());
  DL.on("next-question", () => go(session.index + 1));
  DL.on("prev-question", () => go(session.index - 1));
  DL.on("jump-question", (el) => go(Number(el.dataset.index)));
  DL.on("finish-mission", () => finish());
  DL.on("drag-handle", () => {});

  document.addEventListener("toggle", (event) => {
    if (event.target.matches?.(".case-file")) session.caseOpen = event.target.open;
  }, true);

  let dragItem = null;
  document.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest(".drag-handle");
    if (!handle || !DL.quiz.canDrag()) return;
    dragItem = handle.closest("li");
    dragItem.classList.add("is-dragging");
    dragItem.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });
  document.addEventListener("pointermove", (event) => {
    if (!dragItem) return;
    const list = dragItem.parentElement;
    const items = [...list.querySelectorAll("li")].filter((item) => item !== dragItem);
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) return;
      const after = event.clientY > rect.top + rect.height / 2;
      list.insertBefore(dragItem, after ? item.nextSibling : item);
    });
  });
  document.addEventListener("pointerup", () => {
    if (!dragItem) return;
    const ids = [...dragItem.parentElement.querySelectorAll("li")].map((item) => item.dataset.id);
    dragItem.classList.remove("is-dragging");
    dragItem = null;
    DL.quiz.commitOrder(ids);
  });

  if (document.body.dataset.page === "quiz") {
    const ctx = DL.guard.mission();
    if (ctx) {
      const mission = ctx.state.missions[ctx.missionId];
      if (ctx.practice && !mission.completed) {
        window.location.href = DL.util.url(`pages/quiz.html?m=${ctx.missionId}`);
      } else if (!ctx.practice && mission.completed) {
        window.location.href = DL.util.url(`pages/result.html?m=${ctx.missionId}`);
      } else {
        DL.quiz.open(ctx.missionId, ctx.practice);
      }
    }
  }
})();
