import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Megaphone, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Home({ onNavigate }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(data);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Banner Utama Ringkasan */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-8 md:p-10 border border-slate-800 shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <UserCheck className="w-3.5 h-3.5" /> Portal Resmi Pembelajaran
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">
            Selamat Datang di Portal Informatika SMAN 4 Manado
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Pusat akses modul pembelajaran, pengumpulan tugas siswa, dan informasi pengumuman akademik Informatika pengampu Glendy A. Taawoeda, S.Pd.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('materi')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Akses Modul Materi
            </button>
            <button
              onClick={() => onNavigate('tugas')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/10 transition-all"
            >
              <Send className="w-4 h-4" /> Kumpul Tugas
            </button>
          </div>
        </div>
      </section>

      {/* Tampilan Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">Materi Terstruktur</h3>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">Kelas X, XI, XII</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">Pengumpulan Tugas</h3>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">Sistem Real-Time</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400">Pengumuman Akademik</h3>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">Informasi Terbaru</p>
          </div>
        </div>
      </div>

      {/* Ringkasan Pengumuman Terkini */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Pengumuman Terkini</h2>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Memuat ringkasan pengumuman...</div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {announcements.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 text-[10px] font-bold">
                  {item.category || 'Info'}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400 glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
            Belum ada pengumuman terbaru saat ini.
          </div>
        )}
      </section>
    </div>
  );
}