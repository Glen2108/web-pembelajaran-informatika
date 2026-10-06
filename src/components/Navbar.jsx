import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  FileCheck, 
  ChevronDown, 
  Lock, 
  Menu, 
  X, 
  GraduationCap,
  UserCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup dropdown saat mengklik di luar menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMenu = (tabKey) => {
    setActiveTab(tabKey);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { key: 'home', label: 'Beranda / Home', icon: Home, desc: 'Ringkasan utama portal' },
    { key: 'materi', label: 'Materi Pembelajaran', icon: BookOpen, desc: 'Modul dan bahan ajar' },
    { key: 'tugas', label: 'Pengumpulan Tugas', icon: FileCheck, desc: 'Kirim tugas siswa' },
  ];

  const currentActiveLabel = navItems.find((item) => item.key === activeTab)?.label || 'Beranda / Home';

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identitas Sekolah */}
          <div 
            onClick={() => handleSelectMenu('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                INFORMATIKA
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                SMA Negeri 4 Manado
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Admin */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Dropdown Menu Utama */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                <span>{currentActiveLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Isi Dropdown */}
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 animate-fade-in z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Menu Pembelajaran</p>
                  </div>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleSelectMenu(item.key)}
                        className={`w-full px-3 py-2.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left ${
                          isActive ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tombol Login Admin / Panel Guru */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectMenu('admin')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'admin'
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Panel Guru</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleSelectMenu('login')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'login'
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login Admin</span>
              </button>
            )}
          </div>

          {/* Tombol Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Seluler */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleSelectMenu(item.key)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 ${
                  activeTab === item.key ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => handleSelectMenu(user ? 'admin' : 'login')}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{user ? 'Panel Guru' : 'Login Admin'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}