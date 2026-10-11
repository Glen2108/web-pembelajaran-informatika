import React, { useState, useEffect } from 'react';
import { Award, Search, GraduationCap, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Grades({ student }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');

  useEffect(() => {
    const q = query(collection(db, 'grades'), orderBy('studentName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setGrades(data);
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data nilai:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredGrades = grades.filter((item) => {
    const matchesClass = selectedClass === 'Semua' || item.className === selectedClass;
    const matchesSearch = (item.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.nisn || '').includes(searchTerm);
    return matchesClass && matchesSearch;
  });

  // Pencarian otomatis nilai untuk siswa yang sedang aktif
  const currentStudentGrade = grades.find(
    (item) => student && (
      (item.nisn && item.nisn === student.nisn) || 
      (item.studentName?.toLowerCase() === student.name?.toLowerCase())
    )
  );

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
          <Award className="w-3.5 h-3.5" /> Portal Transparansi Nilai
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rekapitulasi Nilai Siswa</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Daftar perolehan nilai tugas, kuis, dan ujian mata pelajaran Informatika.
        </p>
      </div>

      {/* Kartu Ringkasan Hasil Belajar Personal Siswa */}
      {student && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-900/40 via-slate-900 to-slate-900 border border-teal-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Kartu Hasil Belajar Anda
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
              Kelas {student.className}
            </span>
          </div>

          {currentStudentGrade ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 font-medium">Nama Siswa</p>
                <p className="text-xs font-bold text-white truncate">{currentStudentGrade.studentName}</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 font-medium">Nilai Tugas</p>
                <p className="text-sm font-black text-teal-400">{currentStudentGrade.assignmentScore}</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 font-medium">Nilai UH / Kuis</p>
                <p className="text-sm font-black text-amber-400">{currentStudentGrade.examScore}</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                <p className="text-[10px] text-slate-400 font-medium">Rata-Rata Akhir</p>
                <p className="text-sm font-black text-emerald-400">{currentStudentGrade.finalScore}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              Data nilai untuk <strong>{student.name}</strong> belum diinput oleh guru pengampu.
            </p>
          )}
        </div>
      )}

      {/* Filter dan Pencarian */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama siswa atau NISN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <GraduationCap className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
          >
            <option value="Semua">Semua Kelas</option>
            {['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Rekapitulasi Nilai Seluruh Siswa */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4 text-center">No</th>
              <th className="py-3.5 px-4">NISN</th>
              <th className="py-3.5 px-4">Nama Siswa</th>
              <th className="py-3.5 px-4">Kelas</th>
              <th className="py-3.5 px-4 text-center">Nilai Tugas</th>
              <th className="py-3.5 px-4 text-center">Nilai UH</th>
              <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 font-semibold">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-600" />
                  Memuat data nilai dari database...
                </td>
              </tr>
            ) : filteredGrades.length > 0 ? (
              filteredGrades.map((item, idx) => (
                <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                  student && student.name?.toLowerCase() === item.studentName?.toLowerCase() ? 'bg-brand-500/10 dark:bg-brand-500/20 font-bold' : ''
                }`}>
                  <td className="py-3 px-4 text-center font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">{item.nisn}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{item.studentName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                      {item.className}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">{item.assignmentScore}</td>
                  <td className="py-3 px-4 text-center text-slate-700 dark:text-slate-300">{item.examScore}</td>
                  <td className="py-3 px-4 text-center font-bold text-brand-600 dark:text-brand-400">{item.finalScore}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400 italic">
                  Belum ada data nilai yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}