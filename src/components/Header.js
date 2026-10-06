import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  LogIn, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  BookOpen, 
  FileText, 
  Home, 
  ShieldCheck, 
  Settings,
  GraduationCap
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  student, 
  onOpenStudentModal, 
  isTeacherLoggedIn, 
  onOpenLoginModal, 
  onLogoutTeacher,
  darkMode,
  setDarkMode,
  schoolSettings
}) {
  const [time, setTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update Jam Real-time setiap detik
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Tanggal (Contoh: Selasa, 6 Oktober 2026)
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format Jam (Contoh: 09:25:30 WITA)
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WITA';
  };

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'materials', label: 'Materi', icon: BookOpen },
    { id: 'assignments', label: 'Tugas', icon: FileText },
    { id: 'admin', label: 'Panel Guru', icon: ShieldCheck },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors duration-300">
      {/* Top Banner Widget Info */}
      <div className="bg-brand-600/90 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-200" />
              {formatDate(time)}
            </span>
            <span className="flex items-center gap-1.5 font-mono bg-black/20 px-2 py-0.5 rounded text-[11px] tracking-wide">
              <Clock className="w-3.5 h-3.5 text-brand-200 animate-pulse" />
              {formatTime(time)}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {student ? (
              <button 
                onClick={onOpenStudentModal}
                className="flex items-center gap-1.5 hover:text-brand-100 transition-colors bg-white/10 px-2.5 py-0.5 rounded-full"
                title="Klik untuk ubah identitas"
              >
                <User className="w-3 h-3 text-brand-200" />
                <span>{student.name} <span className="text-brand-200">({student.className})</span></span>
              </button>
            ) : (
              <button 
                onClick={onOpenStudentModal}
                className="text-amber-300 font-semibold hover:underline flex items-center gap-1"
              >
                <User className="w-3 h-3" />
                Set Nama & Kelas
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identitas Sekolah/Guru */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 p-0.5 shadow-md shadow-brand-500/20 flex-shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                {schoolSettings?.logoUrl ? (
                  <img src={schoolSettings.logoUrl} alt="Logo" className="w-9 h-9 object-contain" />
                ) : (
                  <GraduationCap className="w-7 h-7 text-brand-600 dark:text-brand-500" />
                )}
              </div>
            </div>
            
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                {schoolSettings?.schoolName || 'SMA Negeri 4 Manado'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                Informatika • <span className="text-slate-700 dark:text-slate-300 font-semibold">{schoolSettings?.teacherName || 'Glendy A. Taawoeda, S.Pd.'}</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-brand-600 text-brand-700 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons (Dark Mode & Teacher Auth) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Ganti Mode Terang" : "Ganti Mode Gelap"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Login / Logout Guru Button */}
            {isTeacherLoggedIn ? (
              <button
                onClick={onLogoutTeacher}
                className="flex items-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border border-rose-200/50 dark:border-rose-900/30"
              >
                <LogOut className="w-4 h-4" />
                Keluar Guru
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-brand-600/20"
              >
                <LogIn className="w-4 h-4" />
                Login Guru
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {isTeacherLoggedIn ? (
              <button
                onClick={() => { onLogoutTeacher(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 py-2.5 rounded-xl font-semibold text-sm"
              >
                <LogOut className="w-4 h-4" /> Keluar Akses Guru
              </button>
            ) : (
              <button
                onClick={() => { onOpenLoginModal(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md"
              >
                <LogIn className="w-4 h-4" /> Login Sebagai Guru
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}