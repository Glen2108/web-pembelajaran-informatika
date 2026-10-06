export const INITIAL_MATERIALS = [
  {
    id: 'mat-01',
    title: 'Pengenalan Berpikir Komputasional & Algoritma Dasar',
    classCategory: 'X',
    fileType: 'pdf',
    fileSize: '4.5 MB',
    driveUrl: 'https://drive.google.com/file/d/1EXAMPLERESOURCE1/view',
    description: 'Konsep dasar computational thinking: dekomposisi, pengenalan pola, abstraksi, dan perancangan algoritma.',
    uploadDate: '2026-10-01'
  },
  {
    id: 'mat-02',
    title: 'Sistem Komputer & Perangkat Keras (Hardware)',
    classCategory: 'X',
    fileType: 'pptx',
    fileSize: '12.8 MB',
    driveUrl: 'https://drive.google.com/file/d/1EXAMPLERESOURCE2/view',
    description: 'Slide presentasi arsitektur komputer, komponen CPU, RAM, memori internal, dan perangkat I/O.',
    uploadDate: '2026-10-03'
  },
  {
    id: 'mat-03',
    title: 'Jaringan Komputer dan Internet (JKI)',
    classCategory: 'XI',
    fileType: 'docx',
    fileSize: '3.2 MB',
    driveUrl: 'https://drive.google.com/file/d/1EXAMPLERESOURCE3/view',
    description: 'Modul praktikum topologi jaringan, pengalamatan IP Address, serta konfigurasi protokol HTTP/HTTPS.',
    uploadDate: '2026-10-02'
  },
  {
    id: 'mat-04',
    title: 'Analisis Data & Pemrograman Python Dasar',
    classCategory: 'XI',
    fileType: 'pdf',
    fileSize: '8.1 MB',
    driveUrl: 'https://drive.google.com/file/d/1EXAMPLERESOURCE4/view',
    description: 'Panduan sintaks dasar Python, tipe data, variabel, struktur kontrol keputusan, dan perulangan.',
    uploadDate: '2026-10-04'
  },
  {
    id: 'mat-05',
    title: 'Algoritma Pencarian & Pengurutan Data (Search & Sort)',
    classCategory: 'XII',
    fileType: 'pdf',
    fileSize: '5.6 MB',
    driveUrl: 'https://drive.google.com/file/d/1EXAMPLERESOURCE5/view',
    description: 'Implementasi Linear Search, Binary Search, Bubble Sort, Quick Sort, serta perhitungan kompleksitas.',
    uploadDate: '2026-10-05'
  },
  {
    id: 'mat-06',
    title: 'Infografis Keamanan Informasi & Etika Digital',
    classCategory: 'XII',
    fileType: 'img',
    fileSize: '2.4 MB',
    driveUrl: 'https://drive.google.com/file/d/1EXAMPLERESOURCE6/view',
    description: 'Ringkasan visual keamanan data pribadi, lisensi hak cipta, dan etika berinternet secara aman.',
    uploadDate: '2026-10-06'
  }
];

export const INITIAL_ASSIGNMENTS_LIST = [
  {
    id: 'asg-01',
    title: 'Tugas 1: Analisis Kasus Berpikir Komputasional',
    classCategory: 'X',
    deadline: '2026-10-15',
    maxSize: '10MB',
    instruction: 'Kerjakan soal analisis studi kasus pada modul 1. Unggah berkas dokumen/gambar hasil pengerjaan ke Google Drive Anda, lalu cantumkan tautan berbagi publik.'
  },
  {
    id: 'asg-02',
    title: 'Tugas 1: Praktikum Konfigurasi Topologi Jaringan',
    classCategory: 'XI',
    deadline: '2026-10-18',
    maxSize: '10MB',
    instruction: 'Buat skema topologi jaringan menggunakan Cisco Packet Tracer atau gambar tangan yang rapi, lalu unggah tautan Drive.'
  },
  {
    id: 'asg-03',
    title: 'Tugas 1: Program Python Pencarian Array',
    classCategory: 'XII',
    deadline: '2026-10-20',
    maxSize: '10MB',
    instruction: 'Tuliskan kode program Python untuk algoritma Binary Search beserta tangkapan layar jalannya program.'
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-01',
    assignmentId: 'asg-01',
    assignmentTitle: 'Tugas 1: Analisis Kasus Berpikir Komputasional',
    studentName: 'Christian Wuwung',
    className: 'X-1',
    driveUrl: 'https://drive.google.com/file/d/sample-sub-1/view',
    submittedAt: '2026-10-05 14:20 WITA',
    status: 'Terkirim'
  },
  {
    id: 'sub-02',
    assignmentId: 'asg-02',
    assignmentTitle: 'Tugas 1: Praktikum Konfigurasi Topologi Jaringan',
    studentName: 'Aurelia Patricia Sumual',
    className: 'XI-1',
    driveUrl: 'https://drive.google.com/file/d/sample-sub-2/view',
    submittedAt: '2026-10-05 16:45 WITA',
    status: 'Terkirim'
  }
];