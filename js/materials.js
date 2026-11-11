(function () {
  "use strict";

  const DL = (window.DL = window.DL || {});

  DL.materials = {
    1: [
      {
        kicker: "Pengertian",
        title: "Apa itu teks LHO?",
        blocks: [
          { type: "p", text: "Teks laporan hasil observasi adalah teks yang menyajikan informasi tentang suatu objek berdasarkan pengamatan. Objeknya bisa makhluk hidup, benda, atau lingkungan." },
          { type: "p", text: "Isi laporan berupa fakta yang dapat diperiksa ulang. Penulis tidak mengarang peristiwa dan tidak memaksakan selera pribadi." },
          { type: "example", title: "Cuplikan", text: "Kucing adalah hewan mamalia pemakan daging yang memiliki kumis peka dan kuku yang dapat ditarik." },
          { type: "note", text: "Amati terlebih dahulu, lalu tuliskan apa yang benar-benar ditemukan." },
        ],
      },
      {
        kicker: "Tujuan",
        title: "Untuk apa laporan ini ditulis?",
        blocks: [
          { type: "p", text: "Teks LHO bertujuan menyampaikan hasil pengamatan secara jelas, mengelompokkan objek, dan menjelaskan cirinya secara runtut." },
          { type: "list", items: [
            "Memberi informasi berdasarkan fakta pengamatan.",
            "Mengklasifikasikan objek agar mudah dikenali.",
            "Menggambarkan bagian, ciri, atau perilaku secara objektif.",
          ] },
          { type: "note", text: "LHO tidak bertujuan menghibur dengan cerita fiksi, menuliskan curahan hati, atau membujuk pembaca seperti iklan." },
        ],
      },
      {
        kicker: "Sifat",
        title: "Faktual, objektif, dan sistematis",
        blocks: [
          { type: "compare", rows: [
            { name: "Faktual", desc: "Berangkat dari fakta hasil mengamati, bukan khayalan." },
            { name: "Objektif", desc: "Tidak memihak dan tidak melebih-lebihkan." },
            { name: "Sistematis", desc: "Disusun rapi, biasanya dari penjelasan umum menuju rincian." },
          ] },
          { type: "p", text: "Kata seperti \"menurut saya\", \"paling keren\", atau \"wajib dibeli\" membuat laporan kehilangan sifat objektif." },
        ],
      },
      {
        kicker: "Membedakan teks",
        title: "Jangan tertukar jejaknya",
        blocks: [
          { type: "compare", rows: [
            { name: "LHO", desc: "Fakta hasil pengamatan tentang suatu objek." },
            { name: "Narasi", desc: "Cerita tokoh, alur, dan konflik." },
            { name: "Prosedur", desc: "Langkah-langkah melakukan sesuatu." },
            { name: "Iklan", desc: "Ajakan agar pembaca membeli atau mengikuti sesuatu." },
          ] },
          { type: "example", title: "Bukan LHO", text: "Alkisah, seekor kucing ajaib meloncat ke bulan untuk mencari mahkota emas." },
        ],
      },
      {
        kicker: "Siap bertugas",
        title: "Bekal detektif pemula",
        blocks: [
          { type: "p", text: "Sebelum masuk tantangan, ingat tiga pertanyaan pemeriksaan: apa objeknya, fakta apa yang diamati, dan apakah kalimatnya bebas dari opini?" },
          { type: "list", items: [
            "Objek diperkenalkan secara umum.",
            "Ciri yang ditulis dapat diamati.",
            "Nada kalimat tenang dan tidak mengajak.",
          ] },
          { type: "note", text: "Inspektur Sena menunggu laporanmu di ruang tantangan." },
        ],
      },
    ],
    2: [
      {
        kicker: "Peta struktur",
        title: "Tiga bagian yang berurutan",
        blocks: [
          { type: "p", text: "Pada petualangan ini, struktur teks LHO dibagi menjadi tiga bagian agar mudah diselidiki: pernyataan umum, deskripsi bagian, dan deskripsi manfaat." },
          { type: "p", text: "Beberapa sumber menempatkan manfaat di dalam deskripsi. Di game ini manfaat dipisah supaya kamu terlatih mengenali fungsinya." },
          { type: "list", items: [
            "Pernyataan umum: memperkenalkan dan mengklasifikasikan objek.",
            "Deskripsi bagian: merinci bagian, ciri, atau perilaku.",
            "Deskripsi manfaat: menjelaskan kegunaan objek.",
          ] },
        ],
      },
      {
        kicker: "Bagian awal",
        title: "Pernyataan umum",
        blocks: [
          { type: "p", text: "Pernyataan umum berada di awal laporan. Bagian ini memberi gambaran umum: apa objek itu, termasuk kelompok apa, dan kadang di mana objek biasa ditemukan." },
          { type: "example", title: "Contoh", text: "Kupu-kupu adalah serangga yang memiliki dua pasang sayap bersisik dan mengalami metamorfosis sempurna." },
          { type: "note", text: "Kalimat definisi sering muncul di sini, ditandai kata adalah, merupakan, atau termasuk." },
        ],
      },
      {
        kicker: "Bagian tengah",
        title: "Deskripsi bagian",
        blocks: [
          { type: "p", text: "Deskripsi bagian menguraikan objek menjadi bagian-bagian yang lebih kecil. Penulis dapat menjelaskan bentuk, warna, ukuran, atau cara bagian itu bekerja." },
          { type: "example", title: "Contoh", text: "Sayap kupu-kupu berwarna-warni dan ditutupi sisik halus. Antenanya berbentuk gada. Mulutnya berupa alat pengisap untuk menghisap nektar." },
        ],
      },
      {
        kicker: "Bagian akhir",
        title: "Deskripsi manfaat",
        blocks: [
          { type: "p", text: "Deskripsi manfaat menutup laporan dengan kegunaan objek bagi alam, manusia, atau kegiatan tertentu. Manfaat tetap ditulis sebagai fakta, bukan janji berlebihan." },
          { type: "example", title: "Contoh", text: "Kupu-kupu membantu penyerbukan tanaman. Kehadirannya juga menjadi petunjuk lingkungan yang masih mendukung kehidupan serangga." },
        ],
      },
      {
        kicker: "Latihan mata",
        title: "Membaca dari umum ke rinci",
        blocks: [
          { type: "p", text: "Saat memeriksa sebuah laporan, tandai dulu kalimat klasifikasi. Setelah itu kumpulkan ciri bagian tubuh atau bagian benda. Terakhir, cari kalimat yang menyatakan kegunaan." },
          { type: "note", text: "Urutan yang kamu pakai di misi ini: pernyataan umum, deskripsi bagian, lalu deskripsi manfaat." },
        ],
      },
    ],
    3: [
      {
        kicker: "Jejak bahasa",
        title: "Mengapa kaidah kebahasaan penting?",
        blocks: [
          { type: "p", text: "Kaidah kebahasaan adalah ciri bahasa yang membuat laporan terasa faktual dan mudah diuji. Dari pilihan katanya, detektif bisa membedakan laporan dari cerita atau ajakan." },
          { type: "note", text: "Isi yang benar pun bisa melenceng jika bahasanya berubah menjadi opini." },
        ],
      },
      {
        kicker: "Kelas kata",
        title: "Nomina dan verba relasional",
        blocks: [
          { type: "p", text: "Teks LHO banyak memakai kata benda atau frasa nomina untuk menamai objek dan bagiannya, misalnya daun, batang, paruh pendek, dan gel bening." },
          { type: "p", text: "Verba relasional menghubungkan objek dengan identitas atau kelompoknya. Kata yang sering dipakai: adalah, merupakan, yaitu, dan termasuk." },
          { type: "example", title: "Contoh", text: "Kelinci merupakan hewan herbivora. Kata \"merupakan\" menghubungkan kelinci dengan kelompoknya." },
        ],
      },
      {
        kicker: "Pewarna fakta",
        title: "Kata sifat dan konjungsi",
        blocks: [
          { type: "p", text: "Kata sifat menggambarkan ciri yang dapat diamati, seperti hijau, tebal, licin, atau berduri. Pilihlah sifat yang bisa dicek, bukan sifat yang hanya berupa selera." },
          { type: "p", text: "Konjungsi menghubungkan gagasan secara rapi. Kata dan, serta, sedangkan, sementara, dan karena sering muncul dalam laporan." },
          { type: "example", title: "Contoh", text: "Daunnya tebal serta berdaging, sedangkan bunganya berukuran kecil." },
        ],
      },
      {
        kicker: "Jenis kalimat",
        title: "Kalimat definisi dan deskripsi",
        blocks: [
          { type: "compare", rows: [
            { name: "Kalimat definisi", desc: "Menjelaskan objek termasuk apa. Contoh: Burung pipit termasuk hewan aves." },
            { name: "Kalimat deskripsi", desc: "Menggambarkan bagian atau ciri. Contoh: Paruhnya pendek dan keras." },
          ] },
          { type: "p", text: "Laporan juga dapat memakai kalimat simpleks yang berisi satu gagasan, atau kalimat kompleks yang menghubungkan dua gagasan." },
        ],
      },
      {
        kicker: "Yang dihindari",
        title: "Jejak yang mengaburkan fakta",
        blocks: [
          { type: "list", items: [
            "Opini pribadi: menurut saya, favoritku, paling hebat.",
            "Ajakan: ayo beli, jangan lewatkan, segera miliki.",
            "Majas berlebihan yang tidak bisa diamati.",
            "Konflik tokoh atau alur cerita fiksi.",
          ] },
          { type: "example", title: "Perbaikan", text: "\"Bunga ini paling keren sedunia\" lebih tepat ditulis \"Mahkota bunganya berwarna merah dan tersusun berlapis.\"" },
        ],
      },
    ],
    4: [
      {
        kicker: "Pengarahan",
        title: "Kasus besar di aula sidang",
        blocks: [
          { type: "p", text: "Sebuah berkas observasi tentang lidah buaya ditemukan di pot percobaan sekolah. Tugasmu adalah memeriksa klasifikasi, rincian, manfaat, dan bahasa laporan itu." },
          { type: "note", text: "Kamu sudah punya tiga bekal: sifat teks, struktur, dan kaidah kebahasaan. Pakai ketiganya sekaligus." },
        ],
      },
      {
        kicker: "Berkas",
        title: "Laporan pengamatan lidah buaya",
        blocks: [
          { type: "example", title: "Paragraf 1", text: "Lidah buaya (Aloe vera) adalah tumbuhan sukulen yang menyimpan air pada daunnya. Tumbuhan ini termasuk famili Asphodelaceae dan banyak ditanam di halaman rumah serta lingkungan sekolah karena mudah dirawat." },
          { type: "example", title: "Paragraf 2", text: "Daun lidah buaya tebal, berdaging, dan berwarna hijau. Tepi daunnya bergerigi kecil. Jika daun disayat, bagian dalam mengeluarkan gel bening yang terasa dingin dan licin. Akarnya serabut dan tumbuh dangkal di dalam tanah. Batangnya sangat pendek sehingga daun tampak muncul langsung dari permukaan tanah." },
          { type: "example", title: "Paragraf 3", text: "Gel lidah buaya bermanfaat untuk melembapkan kulit. Masyarakat juga memanfaatkan tanaman ini sebagai penyejuk halaman dan bahan perawatan rambut alami. Karena tahan kekeringan, lidah buaya cocok ditanam di pot sekolah sebagai media pengamatan." },
        ],
      },
      {
        kicker: "Cara memeriksa",
        title: "Empat langkah detektif",
        blocks: [
          { type: "list", items: [
            "Kenali objek dan klasifikasinya pada pernyataan umum.",
            "Tandai rincian ciri pada deskripsi bagian.",
            "Catat manfaat yang benar-benar disebutkan.",
            "Periksa kaidah kebahasaan: verba relasional, kata sifat, dan konjungsi.",
          ] },
          { type: "p", text: "Jika ada kalimat berisi \"menurutku\" atau pujian berlebihan, kalimat itu tidak layak ditambahkan ke dalam laporan." },
        ],
      },
      {
        kicker: "Sebelum sidang",
        title: "Daftar periksa singkat",
        blocks: [
          { type: "compare", rows: [
            { name: "Objek", desc: "Lidah buaya, tumbuhan sukulen penyimpan air." },
            { name: "Rincian", desc: "Daun tebal, tepi bergerigi, gel bening, akar serabut, batang pendek." },
            { name: "Manfaat", desc: "Melembapkan kulit, menyejukkan halaman, media pengamatan." },
            { name: "Bahasa", desc: "Ada kata adalah, termasuk, tebal, karena, dan serta." },
          ] },
          { type: "note", text: "Di tantangan, berkas yang sama tampil tanpa label bagian. Kamu yang menentukan jejaknya." },
        ],
      },
    ],
  };
})();
