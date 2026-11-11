(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  DL.util = {
    esc(value) {
      return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]));
    },

    shuffle(list) {
      const copy = [...list];
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swap]] = [copy[swap], copy[index]];
      }
      return copy;
    },

    formatXp(value) {
      return `${Number(value || 0).toLocaleString("id-ID")} XP`;
    },

    percent(correct, total) {
      if (!total) return 0;
      return Math.round((correct / total) * 100);
    },

    query() {
      return new URLSearchParams(window.location.search);
    },

    base() {
      return document.body.dataset.base || ".";
    },

    url(path) {
      return `${this.base()}/${path}`.replace(/\/{2,}/g, "/").replace(":/", "://");
    },

    flash(message) {
      if (message) sessionStorage.setItem("dl-flash", message);
      else {
        const current = sessionStorage.getItem("dl-flash");
        sessionStorage.removeItem("dl-flash");
        return current || "";
      }
      return message;
    },

    validName(name) {
      return /^[\p{L}\p{N}][\p{L}\p{N} .'-]{1,17}$/u.test(name);
    },

    validClass(value) {
      return /^[\p{L}\p{N}][\p{L}\p{N} .'-]{0,15}$/u.test(value);
    },

    paragraphs(text) {
      return String(text || "")
        .split(/\n+/)
        .filter(Boolean)
        .map((line) => `<p>${this.esc(line)}</p>`)
        .join("");
    },
  };
})();
