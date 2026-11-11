(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  function face(skin, hair, extra) {
    return `
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="46" r="24" fill="${skin}"/>
        <path d="M20 42 Q22 16 40 16 Q58 16 60 44 Q52 24 40 24 Q28 24 20 42" fill="${hair}"/>
        <ellipse cx="40" cy="22" rx="26" ry="7" fill="#18243A"/>
        <rect x="24" y="6" width="32" height="16" rx="7" fill="#18243A"/>
        <rect x="24" y="18" width="32" height="5" fill="#F5C451"/>
        <ellipse cx="26" cy="52" rx="5" ry="3" fill="#F28C65" opacity=".45"/>
        <ellipse cx="54" cy="52" rx="5" ry="3" fill="#F28C65" opacity=".45"/>
        <ellipse cx="32" cy="48" rx="3.2" ry="3.6" fill="#18243A"/>
        <ellipse cx="48" cy="48" rx="3.2" ry="3.6" fill="#18243A"/>
        <circle cx="33" cy="47" r="1.1" fill="#fff"/>
        <circle cx="49" cy="47" r="1.1" fill="#fff"/>
        <path d="M33 56 Q40 62 47 56" stroke="#C47B5A" stroke-width="2" fill="none" stroke-linecap="round"/>
        ${extra || ""}
      </svg>`;
  }

  DL.art = {
    avatar(id) {
      if (id === "dimas") {
        return face("#E8B48A", "#1C1A17", `<path d="M30 44 h6 M44 44 h6" stroke="#1C1A17" stroke-width="1.4"/>`);
      }
      if (id === "milo") {
        return `
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <ellipse cx="40" cy="22" rx="26" ry="7" fill="#18243A"/>
            <path d="M16 40 L24 16 L34 34 Z" fill="#F28C65"/>
            <path d="M64 40 L56 16 L46 34 Z" fill="#F28C65"/>
            <circle cx="40" cy="48" r="22" fill="#F28C65"/>
            <circle cx="32" cy="48" r="3" fill="#18243A"/>
            <circle cx="48" cy="48" r="3" fill="#18243A"/>
            <path d="M37 54 h6 l-3 4 z" fill="#F5C451"/>
            <path d="M30 60 Q40 66 50 60" stroke="#18243A" stroke-width="1.6" fill="none"/>
          </svg>`;
      }
      if (id === "luna") {
        return `
          <svg viewBox="0 0 80 80" aria-hidden="true">
            <ellipse cx="40" cy="20" rx="24" ry="6" fill="#18243A"/>
            <circle cx="24" cy="34" r="12" fill="#8BC99A"/>
            <circle cx="56" cy="34" r="12" fill="#8BC99A"/>
            <circle cx="40" cy="48" r="20" fill="#C9F2D4"/>
            <circle cx="33" cy="48" r="7" fill="#fff" stroke="#18243A"/>
            <circle cx="47" cy="48" r="7" fill="#fff" stroke="#18243A"/>
            <circle cx="33" cy="48" r="3" fill="#18243A"/>
            <circle cx="47" cy="48" r="3" fill="#18243A"/>
            <path d="M38 56 l2 3 2-3" fill="#F5C451"/>
          </svg>`;
      }
      return face("#F3C3A0", "#3B2A22", `<circle cx="62" cy="58" r="8" fill="none" stroke="#72BDEB" stroke-width="3"/>`);
    },

    detective() {
      return `
        <svg class="fluid" viewBox="0 0 320 380" role="img" aria-label="Detektif muda membawa kaca pembesar">
          <ellipse cx="168" cy="356" rx="92" ry="14" fill="#18243A" opacity=".14"/>
          <path d="M78 214c8 62 18 112 46 124 34 14 78 10 108-12 22-16 34-70 28-124-22-6-48-16-86-16s-70 8-96 28z" fill="#243656"/>
          <path d="M154 198l18 146h-28z" fill="#72BDEB"/>
          <path d="M132 206l28 34 26-34" fill="#FFF6E8"/>
          <circle cx="160" cy="268" r="4" fill="#F5C451"/>
          <circle cx="160" cy="292" r="4" fill="#F5C451"/>
          <path d="M108 220c-28 8-40 36-24 62" stroke="#F6C7A1" stroke-width="18" fill="none" stroke-linecap="round"/>
          <circle cx="160" cy="132" r="54" fill="#F6C7A1"/>
          <circle cx="110" cy="136" r="11" fill="#F0B48E"/>
          <circle cx="210" cy="136" r="11" fill="#F0B48E"/>
          <path d="M114 124c4-48 34-66 46-66s44 18 50 66c-18-30-36-36-50-36s-32 8-46 36z" fill="#3B2A22"/>
          <ellipse cx="160" cy="92" rx="70" ry="14" fill="#18243A"/>
          <path d="M116 42h88c10 0 16 8 14 18l-6 24H108l-6-24c-2-10 4-18 14-18z" fill="#18243A"/>
          <rect x="112" y="76" width="96" height="14" rx="4" fill="#F5C451"/>
          <ellipse cx="140" cy="134" rx="8" ry="9" fill="#18243A"/>
          <ellipse cx="182" cy="134" rx="8" ry="9" fill="#18243A"/>
          <circle cx="143" cy="131" r="2.4" fill="#fff"/>
          <circle cx="185" cy="131" r="2.4" fill="#fff"/>
          <ellipse cx="124" cy="150" rx="9" ry="5" fill="#F28C65" opacity=".4"/>
          <ellipse cx="198" cy="150" rx="9" ry="5" fill="#F28C65" opacity=".4"/>
          <path d="M142 156q18 16 40 0" stroke="#C47B5A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <circle cx="250" cy="214" r="40" fill="#E7F6FF" stroke="#18243A" stroke-width="8"/>
          <circle cx="250" cy="214" r="18" fill="#72BDEB" opacity=".35"/>
          <path d="M250 196v36M232 214h36" stroke="#18243A" stroke-width="2" opacity=".35"/>
          <path d="M222 242l-34 48" stroke="#F5C451" stroke-width="12" stroke-linecap="round"/>
          <circle cx="184" cy="294" r="9" fill="#F6C7A1" stroke="#18243A" stroke-width="3"/>
        </svg>`;
    },

    academy() {
      return `
        <svg viewBox="0 0 420 210" aria-hidden="true" class="fluid">
          <rect width="420" height="210" rx="18" fill="#8ec8ee"/>
          <circle cx="78" cy="42" r="16" fill="#fff6e8" opacity=".9"/>
          <circle cx="330" cy="36" r="22" fill="#fff" opacity=".75"/>
          <circle cx="352" cy="48" r="14" fill="#fff" opacity=".8"/>
          <path d="M0 150c40-28 70-18 110-4s70-8 100 10 80 8 120-12 70 6 90 16v50H0z" fill="#8BC99A"/>
          <path d="M0 168c50-10 80 8 130 4s90-20 140-6 80 16 150 0v44H0z" fill="#6eaf7c"/>
          <rect x="118" y="78" width="184" height="78" rx="6" fill="#243656"/>
          <path d="M96 84 L210 28 L324 84" fill="#18243A"/>
          <rect x="190" y="40" width="40" height="28" fill="#F5C451"/>
          <circle cx="210" cy="34" r="7" fill="#F28C65"/>
          <rect x="142" y="100" width="26" height="30" rx="3" fill="#d7f1ff"/>
          <rect x="178" y="100" width="26" height="30" rx="3" fill="#fff6e8"/>
          <rect x="246" y="100" width="26" height="30" rx="3" fill="#fff6e8"/>
          <rect x="282" y="100" width="26" height="30" rx="3" fill="#d7f1ff"/>
          <rect x="214" y="104" width="36" height="52" rx="4" fill="#F5C451"/>
          <circle cx="242" cy="130" r="3" fill="#18243A"/>
          <path d="M168 168c18-16 28-16 46 0" stroke="#e7c56a" stroke-width="8" fill="none"/>
          <circle cx="52" cy="146" r="16" fill="#2f7d4a"/>
          <rect x="48" y="146" width="8" height="28" fill="#6b4a2b"/>
          <circle cx="368" cy="142" r="18" fill="#2f7d4a"/>
          <rect x="364" y="142" width="8" height="32" fill="#6b4a2b"/>
        </svg>`;
    },

    icon(name) {
      const icons = {
        search: `<circle cx="28" cy="28" r="14" fill="#E7F6FF" stroke="currentColor" stroke-width="4"/><path d="M38 38 L50 50" stroke="#F5C451" stroke-width="6" stroke-linecap="round"/>`,
        book: `<path d="M10 18h20v30c-6 4-14 4-20 0z" fill="#72BDEB"/><path d="M34 18h20v30c-6 4-14 4-20 0z" fill="#F5C451"/><path d="M30 16v34" stroke="currentColor" stroke-width="3"/>`,
        words: `<path d="M14 46c8-28 28-28 36 0" fill="none" stroke="#8BC99A" stroke-width="5"/><circle cx="22" cy="28" r="5" fill="#F28C65"/><circle cx="42" cy="24" r="5" fill="#72BDEB"/>`,
        badge: `<circle cx="32" cy="28" r="14" fill="#F5C451" stroke="currentColor" stroke-width="3"/><path d="M24 40l-4 14 12-6 12 6-4-14" fill="currentColor"/>`,
        star: `<path d="M32 8 L38 24 H54 L42 34 L46 50 L32 40 L18 50 L22 34 L10 24 H26 Z" fill="currentColor"/>`,
        lock: `<rect x="18" y="28" width="28" height="22" rx="4" fill="currentColor"/><path d="M24 28 V22 a8 8 0 0 1 16 0 V28" fill="none" stroke="currentColor" stroke-width="4"/>`,
        sound: `<path d="M14 26 H24 L36 16 V48 L24 38 H14 Z" fill="currentColor"/><path d="M42 24 Q50 32 42 40" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
        mute: `<path d="M14 26 H24 L36 16 V48 L24 38 H14 Z" fill="currentColor"/><path d="M42 24 L54 40 M54 24 L42 40" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
        trophy: `<path d="M20 14 H44 V28 a12 12 0 0 1-24 0 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 18 H12 V24 a8 8 0 0 0 8 8 M44 18 H52 V24 a8 8 0 0 1-8 8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M32 40 V48 M22 54 H42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
        map: `<path d="M10 18 L26 12 L38 18 L54 12 V46 L38 52 L26 46 L10 52 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M26 12 V46 M38 18 V52" stroke="currentColor" stroke-width="3"/>`,
        teacher: `<path d="M32 10 L54 22 L32 34 L10 22 Z" fill="#F5C451" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M20 26 V38 C24 44 40 44 44 38 V26" fill="none" stroke="currentColor" stroke-width="3"/><path d="M54 22 V36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="54" cy="40" r="3" fill="currentColor"/>`,
        restart: `<path d="M32 14 a18 18 0 1 1-12 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M32 8 V18 H22" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
      };
      return `<svg viewBox="0 0 64 64" aria-hidden="true">${icons[name] || icons.search}</svg>`;
    },

    stars(count) {
      return [1, 2, 3]
        .map((star) => `<span class="star ${star <= count ? "is-on" : ""}" aria-hidden="true">${this.icon("star")}</span>`)
        .join("");
    },

    badge(id, unlocked) {
      const tones = {
        pemula: "#F5C451",
        struktur: "#72BDEB",
        kata: "#8BC99A",
        andal: "#F28C65",
        master: "#F5C451",
      };
      const color = unlocked ? tones[id] || "#F5C451" : "#C8C2B6";
      const glyphs = {
        pemula: `<circle cx="60" cy="50" r="7" fill="none" stroke="#18243A" stroke-width="3"/><path d="M65 55l7 8" stroke="#18243A" stroke-width="3" stroke-linecap="round"/>`,
        struktur: `<path d="M48 44h24M48 52h24M48 60h16" stroke="#18243A" stroke-width="3" stroke-linecap="round"/>`,
        kata: `<path d="M50 64 L60 40 L70 64M54 56h12" fill="none" stroke="#18243A" stroke-width="3" stroke-linejoin="round"/>`,
        andal: `<path d="M60 38l4 10h10l-8 6 3 10-9-6-9 6 3-10-8-6h10z" fill="#18243A"/>`,
        master: `<path d="M44 62l6-18 10 10 10-10 6 18z" fill="#18243A"/>`,
      };
      const mark = unlocked
        ? glyphs[id] || glyphs.pemula
        : `<rect x="52" y="50" width="16" height="12" rx="2" fill="#18243A"/><path d="M56 50v-5a6 6 0 0 1 12 0v5" fill="none" stroke="#18243A" stroke-width="3"/>`;
      return `
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="52" r="36" fill="${color}" stroke="#18243A" stroke-width="4"/>
          <circle cx="60" cy="52" r="28" fill="none" stroke="#18243A" stroke-width="2" opacity=".25"/>
          <path d="M38 78 L28 110 L60 96 L92 110 L82 78" fill="${unlocked ? "#18243A" : "#A9A396"}"/>
          <circle cx="60" cy="52" r="20" fill="#FFF6E8"/>
          ${mark}
        </svg>`;
    },

    inspector() {
      return `
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle cx="40" cy="46" r="22" fill="#F6C7A1"/>
          <path d="M18 40 Q24 16 40 16 Q58 18 62 42 Q50 22 40 24 Q28 24 18 40" fill="#d8d2c8"/>
          <rect x="22" y="8" width="36" height="16" rx="6" fill="#18243A"/>
          <rect x="18" y="20" width="44" height="6" fill="#F5C451"/>
          <circle cx="32" cy="48" r="3" fill="#18243A"/>
          <circle cx="50" cy="48" r="3" fill="#18243A"/>
          <path d="M34 58 Q40 63 48 58" stroke="#C47B5A" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="58" cy="58" r="10" fill="none" stroke="#72BDEB" stroke-width="3"/>
        </svg>`;
    },
  };
})();
