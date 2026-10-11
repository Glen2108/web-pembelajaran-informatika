import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  Users, Search, Filter, Edit3, Trash2, ChevronLeft, ChevronRight, 
  Circle, Check, X, ShieldAlert 
} from 'lucide-react';

const CLASS_LIST = [
  'Semua Kelas',
  'X-1', 'X-2', 'X-3', 'X-4',
  'XI-1', 'XI-2', 'XI-3', 'XI-4', 'XI-5',
  'XII-1', 'XII-2', 'XII-3', 'XII-4', 'XII-5'
];

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status Tab & Filter State
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'online' | 'offline'
  const [selectedClass, setSelectedClass] = useState('Semua Kelas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc' | 'name-desc' | 'class'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal Edit State
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editClass, setEditClass] = useState('X-1');

  // Realtime listener dari Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'students'), (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setStudents(list);
      setLoading(false);
    }, (err) => {
      console.error("Gagal mengambil data siswa:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Filter & Search Logic
  const filteredStudents = students.filter((std) => {
    // Filter status online/offline
    if (statusFilter === 'online' && std.status !== 'online') return false;
    if (statusFilter === 'offline' && std.status === 'online') return false;

    // Filter Kelas
    if (selectedClass !== 'Semua Kelas' && std.className !== selectedClass) return false;

    // Search Nama
    if (searchQuery && !std.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    return true;
  });

  // Sorting Logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'class') return a.className.localeCompare(b.className);
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage) || 1;
  const currentData = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Total online & offline count
  const onlineCount = students.filter((s) => s.status === 'online').length;
  const offlineCount = students.filter((s) => s.status !== 'online').length;

  // Actions: Edit & Delete
  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditClass(student.className || 'X-1');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingStudent || !editName.trim()) return;

    try {
      await updateDoc(doc(db, 'students', editingStudent.id), {
        name: editName.trim(),
        className: editClass
      });
      setEditingStudent(null);
    } catch (err) {
      alert('Gagal memperbarui data siswa: ' + err.message);
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${studentName}"?`)) {
      try {
        await deleteDoc(doc(db, 'students', studentId));
      } catch (err) {
        alert('Gagal menghapus data siswa: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* Header Cards Ringkasan Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'all' 
              ? 'bg-teal-500/20 border-teal-500 text-white' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div>
            <p className="text-xs font-semibold">Total Seluruh Siswa</p>
            <p className="text-2xl font-extrabold text-white mt-1">{students.length}</p>
          </div>
          <Users className="w-8 h-8 text-teal-400 opacity-80" />
        </button>

        <button
          onClick={() => { setStatusFilter('online'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'online' 
              ? 'bg-emerald-500/20 border-emerald-500 text-white' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div>
            <p className="text-xs font-semibold">Siswa sedang Online</p>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{onlineCount}</p>
          </div>
          <Circle className="w-6 h-6 text-emerald-400 fill-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => { setStatusFilter('offline'); setCurrentPage(1); }}
          className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
            statusFilter === 'offline' 
              ? 'bg-slate-700/40 border-slate-500 text-white' 
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
          }`}
        >
          <div>
            <p className="text-xs font-semibold">Siswa Offline</p>
            <p className="text-2xl font-extrabold text-slate-300 mt-1">{offlineCount}</p>
          </div>
          <Circle className="w-6 h-6 text-slate-500" />
        </button>
      </div>

      {/* Control Bar: Search, Class Filter, Sorting */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Cari nama siswa..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          
          {/* Class Filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-white focus:outline-none"
            >
              {CLASS_LIST.map((cls) => (
                <option key={cls} value={cls} className="bg-slate-900 text-white">{cls}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-slate-400">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            >
              <option value="name-asc" className="bg-slate-900">Nama (A - Z)</option>
              <option value="name-desc" className="bg-slate-900">Nama (Z - A)</option>
              <option value="class" className="bg-slate-900">Kelas</option>
            </select>
          </div>

        </div>

      </div>

      {/* Student List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Memuat data siswa...</div>
        ) : currentData.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">Tidak ada data siswa yang ditemukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Nama Siswa</th>
                  <th className="py-3.5 px-4 font-bold">Kelas</th>
                  <th className="py-3.5 px-4 font-bold text-right">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {currentData.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      {std.status === 'online' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Circle className="w-2 h-2 fill-emerald-400 animate-pulse" /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          <Circle className="w-2 h-2 fill-slate-500" /> Offline
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{std.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                        Kelas {std.className || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(std)}
                          className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 transition-colors"
                          title="Ubah Data Siswa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(std.id, std.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Menampilkan {currentData.length} dari {sortedStudents.length} siswa
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
              Halaman {currentPage} dari {totalPages}
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

      </div>

      {/* Modal Edit Data Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-400" /> Edit Data Siswa
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Kelas</label>
                <select
                  value={editClass}
                  onChange={(e) => setEditClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CLASS_LIST.filter(c => c !== 'Semua Kelas').map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}