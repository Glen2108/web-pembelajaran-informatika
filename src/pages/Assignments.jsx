import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Link2, User, BookOpen, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Assignments() {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Pembacaan Otomatis Profil Siswa
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setStudentName(parsed.name || '');
        setStudentClass(parsed.className ? `Kelas ${parsed.className}` : '');
      } catch (err) {
        console.error('Gagal membaca profil siswa:', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await addDoc(collection(db, 'submissions'), {
        studentName,
        studentClass,
        assignmentTitle,
        submissionUrl,
        submittedAt: serverTimestamp()
      });

      setSuccessMessage('Tugas Anda berhasil dikirim ke guru!');
      setAssignmentTitle('');
      setSubmissionUrl('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal mengirim tugas. Pastikan koneksi terhubung.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
          <Send className="w-5 h-5 text-brand-600" /> Pengumpulan Tugas Siswa
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kirimkan tautan berkas tugas (Google Drive / Canva / Cloud) langsung ke guru mata pelajaran.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Siswa
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nama lengkap siswa..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white font-semibold"
                readOnly={!!studentName}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kelas Siswa
            </label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Kelas siswa..."
              className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white font-semibold"
              readOnly={!!studentClass}
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Judul Tugas / Pertemuan
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Contoh: Tugas 1 - Algorithmic Thinking"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tautan Berkas Tugas (Google Drive / Cloud)
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Pastikan hak akses Google Drive sudah diatur menjadi "Siapa saja yang memiliki link".
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Kirimkan Tugas Sekarang</span>
        </button>
      </form>
    </div>
  );
}