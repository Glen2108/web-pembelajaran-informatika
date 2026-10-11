import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Lock, Clock, ExternalLink, Search } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getDriveDirectLink } from '../utils/drive';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMaterials(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMaterials = materials.filter((item) => {
    const matchesClass = selectedClass === 'Semua' || item.classCategory === selectedClass;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in text-slate-100">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-teal-400" /> Modul & Materi Pembelajaran
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Unduh bahan ajar sesuai jadwal waktu yang telah disesuaikan oleh guru pengampu.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari judul materi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-white"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white"
        >
          <option value="Semua">Semua Kelas</option>
          <option value="Kelas X">Kelas X</option>
          <option value="Kelas XI">Kelas XI</option>
          <option value="Kelas XII">Kelas XII</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
          Memuat modul pembelajaran...
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((item) => {
            const releaseDate = item.availableAt ? new Date(item.availableAt) : null;
            const isLocked = releaseDate && now < releaseDate;

            return (
              <div
                key={item.id}
                className={`p-5 bg-slate-900 border rounded-2xl flex flex-col justify-between space-y-4 transition-all shadow-xl ${
                  isLocked ? 'border-amber-500/30 opacity-80' : 'border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {item.classCategory}
                    </span>
                    
                    {isLocked ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.fileType || 'PDF'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{item.description}</p>
                </div>

                <div className="pt-2">
                  {isLocked ? (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center space-y-1">
                      <p className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Terbuka Sesuai Jadwal
                      </p>
                      <p className="text-[10px] text-amber-200/80 font-mono">
                        {releaseDate.toLocaleString('id-ID', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })} WITA
                      </p>
                    </div>
                  ) : (
                    <a
                      href={getDriveDirectLink(item.downloadUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-600/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Modul</span>
                      <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-900 border border-slate-800 rounded-2xl">
          Belum ada materi pembelajaran yang diunggah.
        </div>
      )}
    </div>
  );
}