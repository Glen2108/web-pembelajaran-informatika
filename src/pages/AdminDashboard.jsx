import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  Megaphone, 
  Inbox, 
  Users,
  Award,
  LogOut, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Database,
  X
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { exportSubmissionsToCSV } from '../utils/exportCsv';
import { seedInitialData } from '../utils/seedData';
import StudentList from '../components/StudentList';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('materi');
  const [loading, setLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Form states untuk Materi
  const [matTitle, setMatTitle] = useState('');
  const [matCategory, setMatCategory] = useState('Kelas X');
  const [matDesc, setMatDesc] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matAvailableAt, setMatAvailableAt] = useState('');

  // Form states untuk Pengumuman
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('Pengumuman');
  const [annContent, setAnnContent] = useState('');

  // Form states untuk Nilai Siswa
  const [gradeNisn, setGradeNisn] = useState('');
  const [gradeName, setGradeName] = useState('');
  const [gradeClass, setGradeClass] = useState('X-1');
  const [assignmentScore, setAssignmentScore] = useState(80);
  const [quizScore, setQuizScore] = useState(80);
  const [examScore, setExamScore] = useState(80);

  // States untuk Fitur Kelola Tugas Baru Guru
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskClass, setTaskClass] = useState('X-1');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskInstruction, setTaskInstruction] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [taskSort, setTaskSort] = useState('title-asc');
  const [taskPage, setTaskPage] = useState(1);
  const tasksPerPage = 5;

  // Data states
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(true);

  // Load daftar pengumpulan tugas siswa
  useEffect(() => {
    const qSub = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    const unsubSub = onSnapshot(qSub, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setSubmissions(data);
      setLoadingSubmissions(false);
    }, () => setLoadingSubmissions(false));

    return () => unsubSub();
  }, []);

  // Load data nilai siswa
  useEffect(() => {
    const qGrd = query(collection(db, 'grades'), orderBy('studentName', 'asc'));
    const unsubGrd = onSnapshot(qGrd, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setGrades(data);
      setLoadingGrades(false);
    }, () => setLoadingGrades(false));

    return () => unsubGrd();
  }, []);

  // Load data tugas yang diterbitkan guru
  useEffect(() => {
    const qTask = query(collection(db, 'assigned_tasks'), orderBy('createdAt', 'desc'));
    const unsubTask = onSnapshot(qTask, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setAssignedTasks(data);
    });
    return () => unsubTask();
  }, []);

  // Handle Tambah Materi dengan Jadwal Rilis
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
        availableAt: matAvailableAt ? new Date(matAvailableAt).toISOString() : null,
        createdAt: serverTimestamp()
      });
      setStatusMsg({ type: 'success', text: 'Modul materi dan jadwal rilis berhasil disimpan!' });
      setMatTitle('');
      setMatDesc('');
      setMatUrl('');
      setMatAvailableAt('');
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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      await addDoc(collection(db, 'assigned_tasks'), {
        title: taskTitle.trim(),
        className: taskClass,
        deadline: taskDeadline,
        instruction: taskInstruction,
        createdAt: serverTimestamp()
      });
      setTaskTitle('');
      setTaskInstruction('');
      setIsTaskModalOpen(false);
      setStatusMsg({ type: 'success', text: 'Tugas baru berhasil diterbitkan!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Gagal menerbitkan tugas.' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Hapus tugas terdaftar ini?')) {
      try {
        await deleteDoc(doc(db, 'assigned_tasks', taskId));
      } catch (err) {
        alert('Gagal menghapus tugas.');
      }
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!gradeNisn.trim() || !gradeName.trim()) return;

    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    const finalScore = Math.round((Number(assignmentScore) + Number(quizScore) + Number(examScore)) / 3);

    try {
      await setDoc(doc(db, 'grades', gradeNisn.trim()), {
        nisn: gradeNisn.trim(),
        studentName: gradeName.trim(),
        className: gradeClass,
        assignmentScore: Number(assignmentScore),
        quizScore: Number(quizScore),
        examScore: Number(examScore),
        finalScore,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setStatusMsg({ type: 'success', text: `Nilai siswa ${gradeName} berhasil disimpan!` });
      setGradeNisn('');
      setGradeName('');
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Gagal menyimpan nilai siswa.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGrade = async (id, name) => {
    if (window.confirm(`Hapus data nilai untuk ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'grades', id));
      } catch (err) {
        alert('Gagal menghapus data nilai.');
      }
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

  const handleSeedData = async () => {
    if (window.confirm('Unggah data materi, pengumuman, dan nilai sampel awal ke Firestore?')) {
      setIsSeeding(true);
      const result = await seedInitialData();
      setIsSeeding(false);
      setStatusMsg({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    onLogout();
  };

  // Sorting & Pagination Logic untuk Tugas Terdaftar
  const sortedAssignedTasks = [...assignedTasks].sort((a, b) => {
    if (taskSort === 'title-asc') return (a.title || '').localeCompare(b.title || '');
    if (taskSort === 'class-asc') return (a.className || '').localeCompare(b.className || '');
    return 0;
  });

  const totalTaskPages = Math.ceil(sortedAssignedTasks.length / tasksPerPage) || 1;
  const currentTasks = sortedAssignedTasks.slice(
    (taskPage - 1) * tasksPerPage,
    taskPage * tasksPerPage
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Panel Utama Kelola Guru</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pengelola: {user?.email || 'Glendy A. Taawoeda, S.Pd.'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-3.5 py-2 bg-brand-600/10 hover:bg-brand-600/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            title="Isi database dengan data sampel awal"
          >
            <Database className="w-4 h-4" />
            <span>{isSeeding ? 'Mengunggah...' : 'Inisialisasi Data Awal'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
        </div>
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
          <Inbox className="w-4 h-4" /> Kelola & Tugas Masuk ({submissions.length})
        </button>
        <button
          onClick={() => { setActiveTab('nilai'); setStatusMsg({ type: '', text: '' }); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'nilai' ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4" /> Input & Kelola Nilai ({grades.length})
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
          <div>
            <label className="block font-semibold mb-1">Jadwal Jam & Tanggal Buka (Opsional)</label>
            <input
              type="datetime-local"
              value={matAvailableAt}
              onChange={(e) => setMatAvailableAt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Kosongkan jika materi ingin langsung dibuka saat ini.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Simpan Materi & Jadwal</span>
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

      {/* Tab 3: Kelola Tugas Terdaftar Guru & Rekapitulasi Tugas Masuk Siswa */}
      {activeTab === 'tugas' && (
        <div className="space-y-8">
          
          {/* BAGIAN 1: KELOLA TUGAS TERDAFTAR (GURU) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" /> Daftar Tugas Pembelajaran Diterbitkan
                </h2>
                <p className="text-[11px] text-slate-400">
                  Tugas yang dibuat guru akan langsung menjadi rujukan pengumpulan bagi siswa.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={taskSort}
                  onChange={(e) => setTaskSort(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="title-asc">Urut Nama Tugas (A - Z)</option>
                  <option value="class-asc">Urut Kelas (X - XII)</option>
                </select>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah Tugas Baru
                </button>
              </div>
            </div>

            {/* TABEL PENAMPUNGAN TUGAS TERDAFTAR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {currentTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 italic">
                  Belum ada tugas yang diterbitkan guru.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Nama Tugas / Judul</th>
                      <th className="p-3.5">Target Kelas</th>
                      <th className="p-3.5">Batas Waktu (Deadline)</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-white">{task.title}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold">
                            Kelas {task.className}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-amber-400">{task.deadline || 'Tidak Ada'}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Hapus Tugas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Pagination Controls */}
              {assignedTasks.length > 0 && (
                <div className="p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Halaman {taskPage} dari {totalTaskPages}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setTaskPage(p => Math.max(p - 1, 1))}
                      disabled={taskPage === 1}
                      className="px-3 py-1 bg-slate-800 rounded-lg disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setTaskPage(p => Math.min(p + 1, totalTaskPages))}
                      disabled={taskPage === totalTaskPages}
                      className="px-3 py-1 bg-slate-800 rounded-lg disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BAGIAN 2: REKAP TUGAS MASUK SISWA */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Daftar Pengumpulan Tugas Masuk Siswa
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

        </div>
      )}

      {/* Tab 4: Input & Kelola Nilai Siswa */}
      {activeTab === 'nilai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form onSubmit={handleSaveGrade} className="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4 text-xs h-fit">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Input / Update Nilai Siswa</h2>
            <div>
              <label className="block font-semibold mb-1">NISN Siswa</label>
              <input
                type="text"
                value={gradeNisn}
                onChange={(e) => setGradeNisn(e.target.value)}
                placeholder="Contoh: 0081234001"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Nama Lengkap Siswa</label>
              <input
                type="text"
                value={gradeName}
                onChange={(e) => setGradeName(e.target.value)}
                placeholder="Nama lengkap..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Kelas</label>
              <select
                value={gradeClass}
                onChange={(e) => setGradeClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 font-semibold"
              >
                {['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].map((c) => (
                  <option key={c} value={c}>Kelas {c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Nilai Tugas</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={assignmentScore}
                  onChange={(e) => setAssignmentScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 text-center font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nilai Kuis</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={quizScore}
                  onChange={(e) => setQuizScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 text-center font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Nilai UH</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={examScore}
                  onChange={(e) => setExamScore(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl dark:border-slate-700 text-center font-bold"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              <span>Simpan Nilai Siswa</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Daftar Nilai Terrekam</h2>
            {loadingGrades ? (
              <div className="py-8 text-center text-xs text-slate-400">Memuat data nilai...</div>
            ) : grades.length > 0 ? (
              <div className="overflow-x-auto glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Siswa</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3 text-center">Tugas</th>
                      <th className="p-3 text-center">UH</th>
                      <th className="p-3 text-center">Akhir</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {grades.map((grd) => (
                      <tr key={grd.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{grd.studentName}</td>
                        <td className="p-3">{grd.className}</td>
                        <td className="p-3 text-center">{grd.assignmentScore}</td>
                        <td className="p-3 text-center">{grd.examScore}</td>
                        <td className="p-3 text-center font-bold text-brand-600 dark:text-brand-400">{grd.finalScore}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteGrade(grd.id, grd.studentName)}
                            className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Hapus Nilai"
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
                Belum ada data nilai tersimpan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Kelola Daftar Siswa */}
      {activeTab === 'siswa' && <StudentList />}

      {/* POPUP MODAL TAMBAH TUGAS BARU */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" /> Terbitkan Tugas Baru
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Judul Tugas / Pertemuan</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Contoh: Tugas 1 - Algorithmic Thinking"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Kelas</label>
                <select
                  value={taskClass}
                  onChange={(e) => setTaskClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  {['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].map((cls) => (
                    <option key={cls} value={cls}>Kelas {cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Batas Waktu (Deadline)</label>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Instruksi Tugas Ringkas</label>
                <textarea
                  value={taskInstruction}
                  onChange={(e) => setTaskInstruction(e.target.value)}
                  placeholder="Tuliskan petunjuk pengerjaan..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}