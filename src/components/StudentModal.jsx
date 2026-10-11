import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function StudentModal({ isOpen, onClose, student, onSaveStudent }) {
  const [name, setName] = useState(student?.name || '');
  const [className, setClassName] = useState(student?.className || 'X-1');
  const [nisn, setNisn] = useState(student?.nisn || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !nisn.trim()) return;

    setIsSaving(true);
    const studentData = {
      name: name.trim(),
      className,
      nisn: nisn.trim(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'students', nisn.trim()), studentData, { merge: true });
      onSaveStudent({ name: name.trim(), className, nisn: nisn.trim() });
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan identitas siswa:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Atur Identitas Siswa</h2>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">NISN</label>
            <input
              type="text"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="Masukkan NISN Anda..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-semibold"
            >
              {['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].map((c) => (
                <option key={c} value={c}>Kelas {c}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Simpan Identitas</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}