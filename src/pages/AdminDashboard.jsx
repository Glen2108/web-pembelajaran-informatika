import React, { useState } from 'react';
import { Plus, BookOpen, Bell, Award, LogOut } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../services/firebase';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('materi');
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classCategory, setClassCategory] = useState('Kelas X');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'materials'), {
        title,
        description,
        classCategory,
        downloadUrl,
        fileType: 'PDF Document',
        createdAt: serverTimestamp()
      });
      alert('Materi berhasil ditambahkan!');
      setTitle('');
      setDescription('');
      setDownloadUrl('');
    } catch (err) {
      console.error(err);
      alert('Gagal menambah materi.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    onLogout();
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Panel Kelola Guru</h1>
          <p className="text-xs text-slate-500">Login sebagai: {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-500/20"
        >
          <LogOut className="w-3.5 h-3.5" /> Keluar
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('materi')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            activeTab === 'materi' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Tambah Materi
        </button>
      </div>

      {activeTab === 'materi' && (
        <form onSubmit={handleAddMaterial} className="glass-card p-6 rounded-2xl max-w-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Tambah Modul Pembelajaran Baru</h2>
          <div>
            <label className="block font-semibold mb-1">Judul Materi</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengenalan Algoritma Pemrograman"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Kategori Kelas</label>
            <select
              value={classCategory}
              onChange={(e) => setClassCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            >
              <option value="Kelas X">Kelas X</option>
              <option value="Kelas XI">Kelas XI</option>
              <option value="Kelas XII">Kelas XII</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Deskripsi Singkat</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan ringkas materi..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl h-20"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tautan Unduh (Google Drive / PDF URL)</label>
            <input
              type="url"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-brand-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Simpan Ke Database
          </button>
        </form>
      )}
    </div>
  );
}