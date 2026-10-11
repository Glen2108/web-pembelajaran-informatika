import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Tag, BookOpen, Send, Award, Sparkles, AlertCircle } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Home({ onNavigate }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data pengumuman realtime dari Firestore
    const q = query(collection(db, 'announcements'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          id: doc.id,
          ...item,
          // Fallback parsing tanggal agar aman dari error timestamp
          displayDate: item.createdAt?.seconds 
            ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : item.date || 'Baru Saja'
        };
      });

      // Sort manual di frontend berdasarkan timestamp / waktu pembuatan untuk mencegah error query indeks
      data.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setAnnouncements(data);
      setLoading(false);
    }, (err) => {
      console.error("Gagal memuat pengumuman:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-10 pb-12 animate-fade-in text-slate-100">
      
      {/* PAPAN PENGUMUMAN UTAMA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
              <Megaphone className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Papan Pengumuman Sekolah</h2>
              <p className="text-xs text-slate-400">Informasi dan instruksi resmi dari guru pengampu.</p>
            </div>
          </div>
          {announcements.length > 0 && (
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-bold text-teal-400 hover:underline"
            >
              Lihat Semua ({announcements.length}) →
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-2xl">
            Memuat papan pengumuman...
          </div>
        ) : announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3 hover:border-teal-500/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    {item.displayDate}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {item.category || 'Pengumuman'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-900/80 border border-slate-800 rounded-2xl">
            Belum ada pengumuman terbaru yang diterbitkan.
          </div>
        )}
      </section>

      {/* TAUTAN PINTAS FITUR */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onNavigate('materi')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl text-left space-y-2 transition-all group shadow-lg"
        >
          <BookOpen className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Modul Pembelajaran</h3>
          <p className="text-xs text-slate-400">Unduh materi & bahan ajar Informatika lengkap.</p>
        </button>

        <button
          onClick={() => onNavigate('tugas')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl text-left space-y-2 transition-all group shadow-lg"
        >
          <Send className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Pengumpulan Tugas</h3>
          <p className="text-xs text-slate-400">Kirimkan tautan berkas tugas langsung ke guru.</p>
        </button>

        <button
          onClick={() => onNavigate('grades')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl text-left space-y-2 transition-all group shadow-lg"
        >
          <Award className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
          <h3 className="text-sm font-bold text-white">Portal Nilai</h3>
          <p className="text-xs text-slate-400">Cek rekapitulasi nilai tugas & kuis Anda.</p>
        </button>
      </section>

    </div>
  );
}