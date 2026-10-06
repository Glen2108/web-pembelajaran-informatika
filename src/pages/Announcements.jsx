import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Tag, Search, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(data);
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data pengumuman:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-2">
          <Megaphone className="w-3.5 h-3.5" /> Pusat Informasi
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengumuman & Berita Sekolah</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Informasi terbaru seputar kegiatan pembelajaran Informatika SMAN 4 Manado.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['Semua', 'Penting', 'Akademik', 'Kegiatan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
          <p className="text-xs">Memuat pengumuman dari database...</p>
        </div>
      ) : filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAnnouncements.map((item) => (
            <article key={item.id} className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" />
                    {item.date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-[11px] flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 italic text-xs">
          Tidak ada pengumuman yang sesuai dengan pencarian.
        </div>
      )}
    </div>
  );
}