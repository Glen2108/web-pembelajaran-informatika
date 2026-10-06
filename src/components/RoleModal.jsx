import React, { useState, useEffect } from 'react';
import { GraduationCap, ShieldCheck, ArrowLeft, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const CLASS_OPTIONS = [
  'X-1', 'X-2', 'X-3', 'X-4',
  'XI-1', 'XI-2', 'XI-3', 'XI-4', 'XI-5',
  'XII-1', 'XII-2', 'XII-3', 'XII-4', 'XII-5'
];

export default function RoleModal({ onAdminLoginSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('select-role'); // 'select-role' | 'student-form' | 'admin-login'

  // Student Form State
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('X-1');

  // Admin Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedStudent = localStorage.getItem('studentProfile');
    
    if (!savedRole && !savedStudent) {
      setIsOpen(true);
    }
  }, []);

  const handleSelectStudentRole = () => {
    setStep('student-form');
  };

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const profile = { name: studentName.trim(), className: studentClass };
    localStorage.setItem('userRole', 'siswa');
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    setIsOpen(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userRole', 'guru');
      setIsOpen(false);
      if (onAdminLoginSuccess) onAdminLoginSuccess();
    } catch (err) {
      setAdminError('Email atau password salah. Periksa kembali akun Anda.');
    } finally {
      setAdminLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Step 1: Pilihan Peran Awal */}
        {step === 'select-role' && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Selamat Datang!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Silakan pilih peran Anda untuk melanjutkan akses ke portal pembelajaran Informatika.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={handleSelectStudentRole}
                className="p-4 rounded-2xl border-2 border-brand-500/20 hover:border-brand-500 bg-brand-500/5 hover:bg-brand-500/10 text-left flex items-center gap-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Saya Seorang Siswa</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Akses modul materi dan kumpulkan tugas sekolah.</p>
                </div>
              </button>

              <button
                onClick={() => setStep('admin-login')}
                className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-100/50 dark:bg-slate-800/50 text-left flex items-center gap-4 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Saya Seorang Guru / Admin</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Kelola modul, pengumuman, dan rekapitulasi nilai.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2A: Form Data Siswa */}
        {step === 'student-form' && (
          <form onSubmit={handleSaveStudent} className="space-y-5 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('select-role')}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Lengkapi Data Siswa</h2>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
              >
                {CLASS_OPTIONS.map((cls) => (
                  <option key={cls} value={cls}>Kelas {cls}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all mt-2"
            >
              Lanjutkan ke Website
            </button>
          </form>
        )}

        {/* Step 2B: Form Login Guru / Admin */}
        {step === 'admin-login' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Login Admin Guru</h2>
              <button
                type="button"
                onClick={() => setStep('select-role')}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Kembali
              </button>
            </div>

            {adminError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Guru</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@sekolah.sch.id"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>Masuk Sebagai Admin</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}