import React, { useState, useEffect } from 'react';
import { 
  Send, 
  FileText, 
  Link as LinkIcon, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Clock,
  Loader2
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { INITIAL_ASSIGNMENTS_LIST } from '../data/materialsData';

export default function Assignments({ student, onOpenStudentModal }) {
  const [assignments] = useState(INITIAL_ASSIGNMENTS_LIST);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(INITIAL_ASSIGNMENTS_LIST[0]?.id || '');
  const [driveUrl, setDriveUrl] = useState('');
  const [alertState, setAlertState] = useState(null);

  // Table Filter, Sorting, & Pagination State
  const [filterClass, setFilterClass] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  // Mengambil data pengumpulan tugas secara real-time dari Firestore
  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(data);
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data dari Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Submit Handler ke Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student || !student.name) {
      setAlertState({
        type: 'warning',
        message: 'Silakan atur nama dan kelas Anda terlebih dahulu sebelum mengumpulkan tugas!'
      });
      onOpenStudentModal();
      return;
    }

    if (!driveUrl.trim() || !driveUrl.includes('drive.google.com')) {
      setAlertState({
        type: 'error',
        message: 'Mohon masukkan tautan Google Drive yang valid (Contoh: https://drive.google.com/file/...)'
      });
      return;
    }

    // Proteksi Pengiriman Tunggal
    const isAlreadySubmitted = submissions.some(
      (sub) => sub.assignmentId === selectedAssignmentId && 
               sub.studentName?.toLowerCase() === student.name.toLowerCase()
    );

    if (isAlreadySubmitted) {
      setAlertState({
        type: 'warning',
        message: `PERINGATAN: ${student.name}, Anda sudah pernah mengumpulkan "${currentAssignment?.title}". Pengiriman hanya diizinkan 1 kali per tugas!`
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'submissions'), {
        assignmentId: selectedAssignmentId,
        assignmentTitle: currentAssignment?.title || 'Tugas Informatika',
        studentName: student.name,
        className: student.className,
        driveUrl: driveUrl.trim(),
        submittedAt: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) + ' WITA',
        createdAt: serverTimestamp(),
        status: 'Terkirim'
      });

      setDriveUrl('');
      setAlertState({
        type: 'success',
        message: 'Berhasil! Tugas Anda telah tersimpan di Firestore dan dicatat pada tabel rekapitulasi.'
      });
    } catch (error) {
      console.error("Gagal menyimpan tugas:", error);
      setAlertState({
        type: 'error',
        message: 'Terjadi kesalahan sistem saat menyimpan tugas. Silakan coba lagi.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Sorting Logic
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesClass = filterClass === 'Semua' || sub.className === filterClass;
    const matchesSearch = (sub.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (sub.assignmentTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortOrder === 'desc') return (b.id || '').localeCompare(a.id || '');
    return (a.id || '').localeCompare(b.id || '');
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubmissions = sortedSubmissions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      
      {/* Form Pengumpulan Tugas */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="border-b border-slate-200/60 dark:border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
            <Send className="w-3.5 h-3.5" /> Portal Pengumpulan Tugas
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Formulir Penyerahan Tugas Siswa</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Isikan link tautan Google Drive berkas tugas Anda (Gambar, PDF, DOCX). Batas maksimal ukuran file: <strong>10MB</strong>.
          </p>
        </div>

        {/* Alert Notification Box */}
        {alertState && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-3 animate-fade-in ${
            alertState.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
              : alertState.type === 'warning'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}>
            {alertState.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {alertState.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            {alertState.type === 'error' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <p className="leading-relaxed">{alertState.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Identitas Siswa Otomatis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Nama Pengirim (Siswa)
              </label>
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-600" />
                  {student ? student.name : 'Belum Diatur'}
                </span>
                <button
                  type="button"
                  onClick={onOpenStudentModal}
                  className="text-[11px] font-semibold text-brand-600 hover:underline"
                >
                  {student ? 'Ubah' : 'Set Nama'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                Kelas
              </label>
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  {student ? `Kelas ${student.className}` : 'Belum Diatur'}
                </span>
              </div>
            </div>
          </div>

          {/* Pilih Tugas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Pilih Penugasan
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            >
              {assignments.map((asg) => (
                <option key={asg.id} value={asg.id}>
                  [{asg.classCategory}] {asg.title} (Deadline: {asg.deadline})
                </option>
              ))}
            </select>
          </div>

          {/* Instruksi Tugas Aktif */}
          {currentAssignment && (
            <div className="p-4 bg-brand-500/5 dark:bg-brand-500/10 rounded-2xl border border-brand-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-brand-600 dark:text-brand-400 block">Instruksi Tugas:</span>
              <p>{currentAssignment.instruction}</p>
            </div>
          )}

          {/* Input Link Google Drive */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Tautan Google Drive Berkas Tugas (Max 10MB)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              *Pastikan akses berbagi tautan Google Drive telah diubah menjadi <strong>"Siapa saja yang memiliki link"</strong>.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Database...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Tugas Sekarang</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Tabel Rekapitulasi Tugas Terkirim */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Rekapitulasi Tugas Terkirim
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daftar siswa yang telah berhasil mengumpulkan tugas (Tersinkronisasi Real-Time).
            </p>
          </div>

          {/* Filter Kelas */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Kelas:</span>
            <select
              value={filterClass}
              onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold dark:text-white"
            >
              <option value="Semua">Semua Kelas</option>
              {['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Controls: Search & Order */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama siswa atau judul tugas..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-full sm:w-auto px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-brand-600" />
            <span>Urutan: {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>

        {/* Table Submissions */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Judul Tugas</th>
                <th className="py-3 px-4">Waktu Pengiriman</th>
                <th className="py-3 px-4 text-center">Berkas Drive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-semibold">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-600" />
                    Memuat data rekapitulasi dari database...
                  </td>
                </tr>
              ) : paginatedSubmissions.length > 0 ? (
                paginatedSubmissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {sub.studentName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-[11px]">
                        {sub.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {sub.assignmentTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-500" />
                      {sub.submittedAt}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <a
                        href={sub.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> Buka
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                    Belum ada riwayat pengumpulkan tugas yang sesuai di database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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
      </section>

    </div>
  );
}