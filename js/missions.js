(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  DL.missions = [
    {
      id: 1,
      title: "Mengenal Dunia LHO",
      place: "Gerbang Akademi",
      summary: "Pahami pengertian, tujuan, dan sifat teks laporan hasil observasi.",
      brief: "Kasus pertama ada di gerbang akademi. Sebelum memeriksa bukti, kenali dulu apa itu teks LHO.",
      icon: "search",
    },
    {
      id: 2,
      title: "Rahasia Struktur Teks",
      place: "Perpustakaan Bukti",
      summary: "Bedakan pernyataan umum, deskripsi bagian, dan deskripsi manfaat.",
      brief: "Setiap laporan menyimpan pola. Telusuri tiga bagian struktur sebelum melangkah lebih jauh.",
      icon: "book",
    },
    {
      id: 3,
      title: "Memburu Jejak Kebahasaan",
      place: "Lorong Kata",
      summary: "Temukan nomina, verba relasional, kata sifat, dan konjungsi dalam laporan.",
      brief: "Jejak bahasa sering tersembunyi di antara kalimat. Ayo tandai kata-kata kuncinya.",
      icon: "words",
    },
    {
      id: 4,
      title: "Kasus Besar Sang Detektif",
      place: "Aula Sidang Fakta",
      summary: "Analisis laporan utuh tentang lidah buaya seperti detektif yang sudah terlatih.",
      brief: "Ini ujian terakhir. Satu berkas observasi menunggumu di aula sidang fakta.",
      icon: "badge",
      caseFile: {
        title: "Berkas Kasus: Lidah Buaya",
        paragraphs: [
          "Lidah buaya (Aloe vera) adalah tumbuhan sukulen yang menyimpan air pada daunnya. Tumbuhan ini termasuk famili Asphodelaceae dan banyak ditanam di halaman rumah serta lingkungan sekolah karena mudah dirawat.",
          "Daun lidah buaya tebal, berdaging, dan berwarna hijau. Tepi daunnya bergerigi kecil. Jika daun disayat, bagian dalam mengeluarkan gel bening yang terasa dingin dan licin. Akarnya serabut dan tumbuh dangkal di dalam tanah. Batangnya sangat pendek sehingga daun tampak muncul langsung dari permukaan tanah.",
          "Gel lidah buaya bermanfaat untuk melembapkan kulit. Masyarakat juga memanfaatkan tanaman ini sebagai penyejuk halaman dan bahan perawatan rambut alami. Karena tahan kekeringan, lidah buaya cocok ditanam di pot sekolah sebagai media pengamatan.",
        ],
      },
    },
  ];

  DL.missionById = function (id) {
    return DL.missions.find((mission) => mission.id === Number(id)) || null;
  };
})();
