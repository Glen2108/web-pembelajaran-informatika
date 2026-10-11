import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Download, ExternalLink, FileText, Filter } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterials(data);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, []);

  const filteredMaterials = materials.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'Semua' || item.classCategory === selectedClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-600" /> Modul & Materi Pembelajaran
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Akses modul, slide presentasi, dan materi pembelajaran Informatika kelas X, XI, dan XII.
        </p>
      </div>

      {/* Panel Pencarian dan Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul modul atau materi..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {['Semua', 'Kelas X', 'Kelas XI', 'Kelas XII'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedClass === cls
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Materi */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Memuat materi pembelajaran...</div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-brand-500/50 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold">
                    {item.classCategory || 'Umum'}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {item.fileType || 'PDF'}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                  {item.description}
                </p>
              </div>

              <a
                href={item.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Modul</span>
                <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-slate-400 glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
          Tidak ada materi pembelajaran yang sesuai dengan pencarian.
        </div>
      )}
    </div>
  );
}