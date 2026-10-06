import React, { useState, useEffect } from 'react';
import { BookOpen, Send, UserCheck, Sparkles, Clock, ShieldCheck, ShieldAlert, LayoutDashboard } from 'lucide-react';

export default function HeroSection({ user, onOpenMateri, onOpenKumpulTugas, onOpenAdmin }) {
  const [displayName, setDisplayName] = useState('');
  const [userRole, setUserRole] = useState('siswa'); // 'admin' atau 'siswa'
  const [userClass, setUserClass] = useState('');
  const [greeting, setGreeting] = useState({ text: 'Selamat Datang', icon: '✨' });

  useEffect(() => {
    // 1. Cek Waktu Otomatis
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 11) setGreeting({ text: 'Selamat Pagi', icon: '☀️' });
    else if (hour >= 11 && hour < 15) setGreeting({ text: 'Selamat Siang', icon: '🌤️' });
    else if (hour >= 15 && hour < 18) setGreeting({ text: 'Selamat Sore', icon: '🌇' });
    else setGreeting({ text: 'Selamat Malam', icon: '🌙' });

    // 2. Deteksi Login Admin vs Siswa
    if (user) {
      setUserRole('admin');
      setDisplayName(user.displayName || user.email?.split('@')[0] || 'Admin');
    } else {
      setUserRole('siswa');
      const savedStudent = localStorage.getItem('studentProfile');
      if (savedStudent) {
        try {
          const parsed = JSON.parse(savedStudent);
          if (parsed.name) setDisplayName(parsed.name);
          if (parsed.className) setUserClass(parsed.className);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* SISI KIRI: Banner Utama Portal */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Portal Resmi Pembelajaran</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Selamat Datang di Portal Informatika SMAN 4 Manado
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            Pusat akses modul pembelajaran, pengumpulan tugas siswa, dan informasi pengumuman akademik Informatika pengampu Glendy A. Taawoeda, S.Pd.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenMateri}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-600/20 transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" /> Akses Modul Materi
            </button>

            {userRole === 'admin' ? (
              <button
                onClick={onOpenAdmin}
                className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-amber-600/20"
              >
                <LayoutDashboard className="w-4 h-4" /> Buka Panel Kelola
              </button>
            ) : (
              <button
                onClick={onOpenKumpulTugas}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-2 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" /> Kumpul Tugas
              </button>
            )}
          </div>
        </div>

        {/* SISI KANAN: Kartu Sapaan Dinamis (Admin & Siswa) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-teal-500/40 transition-all">
            
            <div className="space-y-4 relative z-10">
              
              {/* Header Sapaan & Icon Tangan Bergerak */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-700/60 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    <span>{greeting.icon}</span>
                    <span>{greeting.text}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {displayName ? `Hai, ${displayName}! 👋` : 'Halo, Semuanya! 👋'}
                  </h3>
                </div>

                {/* ANIMASI TANGAN BERGERAK */}
                <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-2xl shadow-inner shrink-0">
                  <span className="animate-waving-hand">👋</span>
                </div>
              </div>

              {/* Status Lencana dan Pesan Khusus */}
              <div className="space-y-2 text-xs">
                {userRole === 'admin' ? (
                  <div className="flex items-center gap-2 text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 font-semibold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Mode Pengelola (Guru / Admin)</span>
                  </div>
                ) : userClass ? (
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Terdaftar sebagai Siswa <strong>Kelas {userClass}</strong></span>
                  </div>
                ) : null}

                <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-700/40 text-slate-300 leading-relaxed text-[11px]">
                  <p className="flex items-center gap-1.5 font-semibold text-teal-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> 
                    {userRole === 'admin' ? 'Catatan Guru:' : 'Pesan Semangat:'}
                  </p>
                  {userRole === 'admin'
                    ? '"Semangat mengajar hari ini! Jangan lupa periksa rekap tugas siswa yang baru masuk."'
                    : '"Siap belajar hari ini? Jangan lupa cek modul materi terbaru dan kumpulkan tugas tepat waktu ya!"'}
                </div>
              </div>

              {/* Footer Kartu Waktu */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> SMAN 4 Manado
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Sistem Online
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}