import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  Megaphone, 
  Inbox, 
  Users,
  LogOut, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Download
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { exportSubmissionsToCSV } from '../utils/exportCsv';
import StudentList from '../components/StudentList';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('materi');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Form states untuk Materi
  const [matTitle, setMatTitle] = useState('');
  const [matCategory, setMatCategory] = useState('Kelas X');
  const [matDesc, setMatDesc] = useState('');
  const [matUrl, setMatUrl] = useState('');

  // Form states untuk Pengumuman
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('Pengumuman');
  const [annContent, setAnnContent] = useState('');

  // Data siswa
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  // Load daftar pengumpulan tugas siswa
  useEffect(() => {
    const q = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(data);
      setLoadingSubmissions(false);
    }, () => setLoadingSubmissions(false));

    return () => unsubscribe();
  }, []);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      await addDoc(collection(db, 'materials'), {
        title: matTitle,
        classCategory: matCategory,
        description: matDesc,
        downloadUrl: matUrl,
        fileType: 'PDF Document',
        createdAt: serverTimestamp()
      });
      setStatusMsg({ type: 'success', text: 'Modul materi berhasil ditambahkan!' });
      setMatTitle('');
      setMatDesc('');
      setMatUrl('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Gagal menambahkan materi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      await addDoc(collection(db, 'announcements'), {
        title: annTitle,
        category: annCategory,
        content: annContent,
        createdAt: serverTimestamp()
      });
      setStatusMsg({ type: 'success', text: 'Pengumuman berhasil diterbitkan!' });
      setAnnTitle('');
      setAnnContent('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Gagal menerbitkan pengumuman.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (window.confirm('Hapus data pengumpulan tugas ini?')) {
      try {
        await deleteDoc(doc(db, 'submissions', id));
      } catch (err) {
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    onLogout();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Panel Utama Kelola Guru</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pengelola: {user?.email || 'Admin'}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar Akun
        </button>
      </div>

      {/* Navigasi Tab Admin */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('materi'); setStatusMsg({ type: '', text: '' }); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'materi' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Tambah Materi
        </button>
        <button
          onClick={() => { setActiveTab('pengumuman'); setStatusMsg({ type: '', text: '' }); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'pengumuman' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Megaphone className="w-4 h-4" /> Buat Pengumuman
        </button>
        <button
          onClick={() => { setActiveTab('tugas'); setStatusMsg({ type: '', text: '' }); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'tugas' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Inbox className="w-4 h-4" /> Tugas Masuk Siswa ({submissions.length})
        </button>
        <button
          onClick={() => { setActiveTab('siswa'); setStatusMsg({ type: '', text: '' }); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'siswa' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> Daftar Siswa
        </button>
      </div>

      {statusMsg.text && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Tab 1: Form Tambah Materi */}
      {activeTab === 'materi' && (
        <form onSubmit={handleAddMaterial} className="glass-card p-6 rounded-3xl max-w-2xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tambah Modul Pembelajaran Baru</h2>
          <div>
            <label className="block font-semibold mb-1">Judul Materi</label>
            <input
              type="text"
              value={matTitle}
              onChange={(e) => setMatTitle(e.target.value)}
              placeholder="Contoh: Bab 1 - Berpikir Komputasional"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Kategori Kelas</label>
            <select
              value={matCategory}
              onChange={(e) => setMatCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
            >
              <option value="Kelas X">Kelas X</option>
              <option value="Kelas XI">Kelas XI</option>
              <option value="Kelas XII">Kelas XII</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Deskripsi Ringkas</label>
            <textarea
              value={matDesc}
              onChange={(e) => setMatDesc(e.target.value)}
              placeholder="Rincian materi..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 h-24"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tautan Unduhan Berkas (Google Drive / PDF)</label>
            <input
              type="url"
              value={matUrl}
              onChange={(e) => setMatUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Simpan Materi</span>
          </button>
        </form>
      )}

      {/* Tab 2: Form Buat Pengumuman */}
      {activeTab === 'pengumuman' && (
        <form onSubmit={handleAddAnnouncement} className="glass-card p-6 rounded-3xl max-w-2xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Terbitkan Pengumuman Baru</h2>
          <div>
            <label className="block font-semibold mb-1">Judul Pengumuman</label>
            <input
              type="text"
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              placeholder="Contoh: Jadwal Ujian Akhir Semester Informatika"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Kategori Pengumuman</label>
            <select
              value={annCategory}
              onChange={(e) => setAnnCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
            >
              <option value="Pengumuman">Pengumuman</option>
              <option value="Info Ujian">Info Ujian</option>
              <option value="Tugas Tambahan">Tugas Tambahan</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Isi Pesan Pengumuman</label>
            <textarea
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              placeholder="Tuliskan pengumuman lengkap..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 h-28"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
            <span>Terbitkan Pengumuman</span>
          </button>
        </form>
      )}

      {/* Tab 3: Rekapitulasi Tugas Masuk Siswa */}
      {activeTab === 'tugas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Pengumpulan Tugas Siswa
            </h2>
            <button
              onClick={() => exportSubmissionsToCSV(submissions)}
              disabled={submissions.length === 0}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" /> Unduh Rekap Excel
            </button>
          </div>

          {loadingSubmissions ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Memuat data tugas...
            </div>
          ) : submissions.length > 0 ? (
            <div className="overflow-x-auto glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Siswa</th>
                    <th className="p-3.5">Kelas</th>
                    <th className="p-3.5">Judul Tugas</th>
                    <th className="p-3.5">Tautan Tugas</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">{sub.studentName}</td>
                      <td className="p-3.5">{sub.studentClass}</td>
                      <td className="p-3.5">{sub.assignmentTitle}</td>
                      <td className="p-3.5">
                        <a
                          href={sub.submissionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Buka Berkas</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Hapus Tugas"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 glass-card rounded-2xl">
              Belum ada tugas siswa yang masuk.
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Kelola Daftar Siswa (Realtime, Status Online/Offline, Sorting & Pagination) */}
      {activeTab === 'siswa' && <StudentList />}
    </div>
  );
}