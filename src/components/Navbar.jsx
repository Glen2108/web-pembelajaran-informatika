import React from 'react';
import { Home, BookOpen, FileCheck, Megaphone, Award } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { key: 'home', label: 'Beranda', icon: Home },
    { key: 'materi', label: 'Materi Pembelajaran', icon: BookOpen },
    { key: 'tugas', label: 'Pengumpulan Tugas', icon: FileCheck },
    { key: 'announcements', label: 'Pengumuman Sekolah', icon: Megaphone },
    { key: 'grades', label: 'Rekapitulasi Nilai', icon: Award },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}