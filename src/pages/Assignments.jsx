import React, { useState, useEffect } from 'react';
import { 
  Send, CheckCircle, AlertCircle, Loader2, Link2, User, BookOpen, 
  Lock, ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, Clock, UserCheck
} from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { isValidDriveUrl } from '../utils/drive';

export default function Assignments({ onOpenStudentModal }) {
  const [student, setStudent] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // States untuk Tabel Progress Pengumpulan
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (Terbaru) atau 'asc' (Terlama)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Pembacaan & Locking Profil Siswa dari LocalStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setStudent(parsed);
        if (parsed.name) setStudentName(parsed.name);
        if (parsed.className) setStudentClass(`Kelas ${parsed.className}`);
      } catch (err) {
        console.error('Gagal membaca profil siswa:', err);
      }
    }
  }, []);

  // 2. Fetch Riwayat Pengumpulan Tugas Terkini milik Siswa Aktif dari Firestore
  useEffect(() => {
    if (!studentName) {
      setLoadingHistory(false);
      return;
    }

    // Query pengumpulan tugas khusus siswa ini
    const q = query(
      collection(db, 'submissions'),
      where('studentName', '==', studentName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Format waktu lokal device
          formattedTime: data.clientDeviceTime || (data.submittedAt?.seconds 
            ? new Date(data.submittedAt.seconds * 1000).toLocaleString('id-ID')
            : new Date().toLocaleString('id-ID'))
        };
      });
      setMySubmissions(docsData);
      setLoadingHistory(false);
    }, (error) => {
      console.error("Gagal mengambil riwayat tugas:", error);
      setLoadingHistory(false);
    });

    return () => unsubscribe();
  }, [studentName]);

  // 3. Proses Pengiriman Tugas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!studentName || !studentClass) {
      setErrorMessage('Identitas nama dan kelas belum teratur. Silakan atur profil Anda terlebih dahulu.');
      return;
    }

    if (!isValidDriveUrl(submissionUrl)) {
      setErrorMessage('Tautan berkas harus berasal dari Google Drive atau Google Docs!');
      return;
    }

    setLoading(true);

    // Mencatat waktu persis perangkat pengguna (device time)
    const deviceTimeStr = new Date().toLocaleString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WITA';

    try {
      await addDoc(collection(db, 'submissions'), {
        studentName,
        studentClass,
        assignmentTitle: assignmentTitle.trim(),
        submissionUrl: submissionUrl.trim(),
        clientDeviceTime: deviceTimeStr,
        submittedAt: serverTimestamp(),
        status: 'Berhasil'
      });

      setSuccessMessage('Tugas Anda berhasil dikirim dan terrekam ke sistem Guru!');
      setAssignmentTitle('');
      setSubmissionUrl('');
    } catch (err) {
      console.error(err);
      setErrorMessage('Gagal mengirim tugas. Pastikan koneksi terhubung.');
    } finally {
      setLoading(false);
    }
  };

  // Sorting Logic (Berdasarkan waktu)
  const sortedSubmissions = [...mySubmissions].sort((a, b) => {
    const timeA = a.submittedAt?.seconds || 0;
    const timeB = b.submittedAt?.seconds || 0;
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage) || 1;
  const currentSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 animate-fade-in text-slate-100">
      
      {/* Header Utama */}
      <div className="space-y-1 text-center sm:text-left border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
          <Send className="w-6 h-6 text-teal-400" /> Pengumpulan Tugas Siswa
        </h1>
        <p className="text-xs text-slate-400">
          Kirimkan tautan berkas tugas (Google Drive / Canva / Cloud) langsung ke guru mata pelajaran.
        </p>
      </div>

      {/* Warning jika profil belum terisi */}
      {!student && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 shrink-0" />
            <span>Identitas Anda belum tersimpan di perangkat ini. Silakan atur nama dan kelas terlebih dahulu.</span>
          </div>
          <button
            onClick={onOpenStudentModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shrink-0"
          >
            Atur Profil Siswa
          </button>
        </div>
      )}

      {/* FORM PENGUMPULAN TUGAS */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          
          {/* NAMA LENGKAP SISWA (LOCKED) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-slate-300">Nama Lengkap Siswa</label>
              <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Terkunci Otomatis
              </span>
            </div>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={studentName}
                placeholder="Nama terisi otomatis dari profil..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 font-bold focus:outline-none cursor-not-allowed"
                readOnly
                required
              />
            </div>
          </div>

          {/* KELAS SISWA (LOCKED) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-slate-300">Kelas Siswa</label>
              <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Terkunci Otomatis
              </span>
            </div>
            <input
              type="text"
              value={studentClass}
              placeholder="Kelas terisi otomatis dari profil..."
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 font-bold focus:outline-none cursor-not-allowed"
              readOnly
              required
            />
          </div>

          {/* JUDUL TUGAS */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Judul Tugas / Pertemuan <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                placeholder="Contoh: Tugas 1 - Algorithmic Thinking"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* TAUTAN DRIVE */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Tautan Berkas Tugas (Google Drive / Cloud) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          disabled={loading || !studentName}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>Kirimkan Tugas Sekarang</span>
        </button>
      </form>

      {/* TABEL PROGRES PENGUMPULAN TUGAS BERHASIL (SORTING + PAGINATION) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" /> Progress Pengumpulan Tugas Saya
            </h2>
            <p className="text-[11px] text-slate-400">
              Riwayat pengumpulan tugas berdasarkan pencatatan waktu resmi perangkat Anda.
            </p>
          </div>

          {/* Sorting Control */}
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="self-start sm:self-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-teal-400" />
            <span>Urutan Waktu: {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loadingHistory ? (
            <div className="p-8 text-center text-slate-400 text-xs">Memuat riwayat pengumpulan...</div>
          ) : currentSubmissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              Belum ada riwayat pengumpulan tugas yang dikirim dari akun ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Judul Tugas</th>
                    <th className="py-3.5 px-4">Waktu Terkirim (Device)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Tautan Berkas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentSubmissions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{item.assignmentTitle}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        {item.formattedTime}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" /> Berhasil
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={item.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-teal-400 hover:underline font-bold"
                        >
                          <span>Buka Berkas</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {sortedSubmissions.length > 0 && (
            <div className="p-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Menampilkan {currentSubmissions.length} dari {sortedSubmissions.length} tugas
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}