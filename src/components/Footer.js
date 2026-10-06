import React from 'react';
import { GraduationCap, Heart, Mail, MapPin, Shield } from 'lucide-react';

export default function Footer({ schoolSettings, setActiveTab }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          
          {/* Kolom 1: Profil Sekolah */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{schoolSettings?.schoolName || 'SMA Negeri 4 Manado'}</h3>
                <p className="text-xs text-brand-400 font-medium">Mata Pelajaran Informatika</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform pembelajaran digital interaktif untuk membangun pemikiran komputasional dan literasi teknologi generasi masa depan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span>Manado, Sulawesi Utara, Indonesia</span>
            </div>
          </div>

          {/* Kolom 2: Profil Guru Pengampu */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-400" /> Guru Pengampu
            </h4>
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-1">
              <p className="text-white font-bold text-sm">{schoolSettings?.teacherName || 'Glendy A. Taawoeda, S.Pd.'}</p>
              <p className="text-xs text-slate-400">NIP. {schoolSettings?.teacherNip || '199308212022211005'}</p>
              <p className="text-xs text-brand-400 font-medium pt-1">Guru Mata Pelajaran Informatika</p>
            </div>
          </div>

          {/* Kolom 3: Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Navigasi Pembelajaran</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-brand-400 transition-colors">
                  • Beranda & Daftar Siswa
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('materials')} className="hover:text-brand-400 transition-colors">
                  • Materi Pembelajaran (Google Drive)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('assignments')} className="hover:text-brand-400 transition-colors">
                  • Pengumpulan Tugas Siswa
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-brand-400 transition-colors">
                  • Portal Manajemen Guru
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} Informatika {schoolSettings?.schoolName || 'SMA Negeri 4 Manado'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dirancang dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk pendidikan Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}