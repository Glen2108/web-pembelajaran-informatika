import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Send, 
  Award, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  Laptop, 
  Menu, 
  X,
  GraduationCap
} from 'lucide-react';

import Materials from './pages/Materials';
import Assignments from './pages/Assignments';
import Grades from './pages/Grades';
import Announcements from './pages/Announcements';

export default function App() {
  const [activeTab, setActiveTab] = useState('materials');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('student_info');
    return saved ? JSON.parse(saved) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempClass, setTempClass] = useState('X-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSaveStudent = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    const newStudent = { name: tempName.trim(), className: tempClass };
    setStudent(newStudent);
    localStorage.setItem('student_info', JSON.stringify(newStudent));
    setIsModalOpen(false);
  };

  const navItems = [
    { id: 'materials', label: 'Materi', icon: BookOpen },
    { id: 'assignments', label: 'Pengumpulan Tugas', icon: Send },
    { id: 'grades', label: 'Nilai Siswa', icon: Award },
    { id: 'announcements', label: 'Pengumuman', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans flex flex-col justify-between">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('materials')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-600/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">
                INFORMATIKA
              </h1>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                SMAN 4 MANADO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Status & Dark Mode Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTempName(student ? student.name : '');
                setTempClass(student ? student.className : 'X-1');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all text-xs font-semibold"
            >
              <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="hidden sm:inline max-w-[120px] truncate">
                {student ? student.name : 'Set Identitas'}
              </span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.id
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {activeTab === 'materials' && <Materials />}
        {activeTab === 'assignments' && (
          <Assignments 
            student={student} 
            onOpenStudentModal={() => {
              setTempName(student ? student.name : '');
              setTempClass(student ? student.className : 'X-1');
              setIsModalOpen(true);
            }} 
          />
        )}
        {activeTab === 'grades' && <Grades />}
        {activeTab === 'announcements' && <Announcements />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Portal Pembelajaran Informatika SMAN 4 Manado. Seluruh hak cipta dilindungi.</p>
      </footer>

      {/* Student Identity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                Atur Identitas Siswa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nama dan kelas ini akan digunakan secara otomatis saat Anda mengirimkan tugas.
              </p>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Contoh: Christian Wuwung"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Kelas
                </label>
                <select
                  value={tempClass}
                  onChange={(e) => setTempClass(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white font-semibold"
                >
                  {['X-1', 'X-2', 'XI-1', 'XI-2', 'XII-1', 'XII-2'].map((c) => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/30"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}