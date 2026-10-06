import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Materials from './pages/Materials';
import Assignments from './pages/Assignments';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
          {activeTab === 'materi' && <Materials />}
          {activeTab === 'tugas' && <Assignments />}
          {activeTab === 'login' && <Login onLoginSuccess={() => setActiveTab('admin')} />}
          {activeTab === 'admin' && <AdminDashboard user={user} onLogout={() => setActiveTab('home')} />}
        </main>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        © 2026 Informatika SMA Negeri 4 Manado — Glendy A. Taawoeda, S.Pd.
      </footer>
    </div>
  );
}