import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  ArrowUpDown, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Send,
  Zap,
  GraduationCap
} from 'lucide-react';
import { INITIAL_STUDENTS_BY_CLASS, MOTIVATIONAL_QUOTES } from '../data/studentsData';

export default function Home({ student, schoolSettings, setActiveTab }) {
  // Random quote index
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // Accordion state (kelas mana yang sedang dibuka)
  const [expandedClass, setExpandedClass] = useState(null);
  
  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  
  // Pagination State per accordion
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const toggleAccordion = (className) => {
    if (expandedClass === className) {
      setExpandedClass(null);
    } else {
      setExpandedClass(className);
      setSearchTerm('');
      setSortOrder('asc');
      setCurrentPage(1);
    }
  };

  const classList = Object.keys(INITIAL_STUDENTS_BY_CLASS);

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-700 to-teal-800 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-200 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Portal Digital Informatika SMA Negeri 4 Manado</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Portal Pembelajaran <span className="text-teal-300">Informatika</span>
          </h1>

          {/* Moto Informatika */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-100 text-sm sm:text-base font-medium leading-relaxed">
            <span className="font-bold text-amber-300 block mb-1 text-xs uppercase tracking-wider">Moto Informatika untuk Masa Depan:</span>
            “Menguasai Teknologi, Membangun Generasi Cerdas, Inovatif, dan Berkarakter di Era Digital.”
          </div>

          {/* Sambutan Kelas */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {student ? (
              <>
                Halo, <span className="font-bold text-white underline underline-offset-4 decoration-amber-400">{student.name}</span> dari <span className="font-bold text-teal-200">Kelas {student.className}</span>! Selamat bergabung di kelas yang luar biasa ini. Siapkan semangatmu untuk menjelajahi dunia komputasi hari ini!
              </>
            ) : (
              <>
                Selamat Datang bagi siswa-siswi luar biasa! Silakan atur nama dan kelas Anda untuk dapat mengakses dan mengumpulkan tugas dengan cepat.
              </>
            )}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('materials')}
              className="px-6 py-3 bg-white text-brand-900 font-bold rounded-2xl text-sm hover:bg-teal-50 transition-all shadow-lg flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-brand-600" />
              Mulai Belajar Materi
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className="px-6 py-3 bg-brand-600/60 hover:bg-brand-600 text-white font-semibold rounded-2xl text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Kirim Tugas
            </button>
          </div>
        </div>
      </section>

      {/* Widget Kalimat Penyemangat (Quote Box) */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl flex-shrink-0 border border-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Penyemangat Hari Ini</h3>
              <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mt-1 italic">
                "{MOTIVATIONAL_QUOTES[quoteIndex]}"
              </p>
            </div>
          </div>
          <button
            onClick={nextQuote}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex-shrink-0 self-end sm:self-auto"
          >
            Ganti Kalimat ↺
          </button>
        </div>
      </section>

      {/* Accordion Daftar Siswa per Kelas */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              Daftar Siswa Per Kelas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Klik nama kelas untuk menampilkan list siswa terdaftar secara otomatis (sesuai abjad).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {classList.map((clsName) => {
            const isExpanded = expandedClass === clsName;
            const rawStudents = INITIAL_STUDENTS_BY_CLASS[clsName] || [];

            // Filter
            const filtered = rawStudents.filter((s) =>
              s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              s.nisn.includes(searchTerm)
            );

            // Sort
            const sorted = [...filtered].sort((a, b) => {
              if (sortOrder === 'asc') return a.name.localeCompare(b.name);
              return b.name.localeCompare(a.name);
            });

            // Pagination
            const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedStudents = sorted.slice(startIndex, startIndex + itemsPerPage);

            return (
              <div 
                key={clsName}
                className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-all duration-200"
              >
                {/* Header Accordion */}
                <button
                  onClick={() => toggleAccordion(clsName)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-sm flex items-center justify-center border border-brand-500/20">
                      {clsName}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">Kelas {clsName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {rawStudents.length} Siswa Terdaftar
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="text-xs font-semibold hidden sm:inline-block">
                      {isExpanded ? 'Sembunyikan' : 'Tampilkan List'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Body Accordion (Tampil jika diklik) */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-4 animate-fade-in">
                    
                    {/* Controls: Search & Sort */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="Cari nama atau NISN..."
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                        />
                      </div>

                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="w-full sm:w-auto px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-brand-600" />
                        <span>Urutkan Abjad: {sortOrder === 'asc' ? 'A - Z' : 'Z - A'}</span>
                      </button>
                    </div>

                    {/* Tabel Siswa */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            <th className="py-3 px-4 w-12 text-center">No</th>
                            <th className="py-3 px-4">Nama Lengkap Siswa</th>
                            <th className="py-3 px-4">NISN</th>
                            <th className="py-3 px-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {paginatedStudents.length > 0 ? (
                            paginatedStudents.map((siswa, idx) => (
                              <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-4 text-center font-mono text-slate-400">
                                  {startIndex + idx + 1}
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                                  {siswa.name}
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                                  {siswa.nisn}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                                    <UserCheck className="w-3 h-3" /> Aktif
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="py-6 text-center text-slate-400 italic">
                                Tidak ada siswa yang sesuai pencarian.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Halaman <strong className="text-slate-800 dark:text-white">{currentPage}</strong> dari <strong>{totalPages}</strong>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          </button>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}