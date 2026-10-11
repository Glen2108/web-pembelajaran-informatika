import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Tag, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'announcements'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          id: doc.id,
          ...item,
          displayDate: item.createdAt?.seconds 
            ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : item.date || 'Baru Saja'
        };
      });

      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setAnnouncements(data);
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data pengumuman:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-teal-400" /> Papan Informasi & Pengumuman
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Pengumuman resmi terkait aktivitas belajar Informatika.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
          <span>Memuat pengumuman...</span>
        </div>
      ) : announcements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {announcements.map((item) => (
            <div key={item.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  {item.displayDate}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {item.category || 'Info'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{item.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-900 border border-slate-800 rounded-2xl">
          Belum ada pengumuman yang diterbitkan.
        </div>
      )}
    </div>
  );
}