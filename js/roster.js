(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});
  const KEY = "detektif-lho-siswa";

  function norm(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
  }

  function idFor(name, className) {
    return `siswa|${norm(name)}|${norm(className)}`;
  }

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter((item) => item && item.id && item.state && item.state.name);
    } catch (error) {
      return [];
    }
  }

  function persist(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
    return list;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  DL.roster = {
    idFor,

    list() {
      return load().sort((a, b) => String(b.lastPlayed || "").localeCompare(String(a.lastPlayed || "")));
    },

    upsert(record) {
      if (!record?.id || !record.state?.name) return null;
      const list = load();
      const index = list.findIndex((item) => item.id === record.id);
      if (index >= 0) list[index] = record;
      else list.push(record);
      persist(list);
      return record;
    },

    sync(state) {
      if (!state?.name || !state.className) return null;
      const list = load();
      const id = idFor(state.name, state.className);
      const next = {
        id,
        lastPlayed: new Date().toISOString(),
        state: clone(state),
      };
      const index = list.findIndex((item) => item.id === id);
      if (index >= 0) list[index] = next;
      else list.push(next);
      persist(list);
      return next;
    },

    find(name, className) {
      const id = idFor(name, className);
      return load().find((item) => item.id === id) || null;
    },

    remove(id) {
      persist(load().filter((item) => item.id !== id));
    },

    clear() {
      try {
        localStorage.removeItem(KEY);
      } catch (error) {
        persist([]);
      }
    },
  };
})();
