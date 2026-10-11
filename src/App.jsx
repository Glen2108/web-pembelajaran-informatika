import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Materials from './pages/Materials';
import Assignments from './pages/Assignments';
import Announcements from './pages/Announcements';
import Grades from './pages/Grades';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RoleModal from './components/RoleModal';
import HeroSection from './components/HeroSection';
import StudentModal from './components/StudentModal';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import yang ditambahkan
import Footer from './components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // Load Profil Siswa dari LocalStorage
  useEffect(() => {
    const savedStudent = localStorage.getItem('studentProfile');
    if (savedStudent) {
      try {
        setStudent(JSON.parse(savedStudent));
      } catch (e) {
        console.error('Gagal membaca data siswa:', e);
      }
    }
  }, []);

  // Monitor Auth State Firebase (Admin Guru)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveStudent = (studentData) => {
    setStudent(studentData);
    localStorage.setItem('studentProfile', JSON.stringify(studentData));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col justify-between">
      {/* Pop-up Penanya Peran Awal */}
      <RoleModal onAdminLoginSuccess={() => setActiveTab('admin')} />

      {/* Modal Identitas Siswa */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={student}
        onSaveStudent={handleSaveStudent}
      />

      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={user}
          onOpenStudentModal={() => setIsStudentModalOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          {activeTab === 'home' && (
            <>
              <HeroSection 
                user={user} 
                onOpenMateri={() => setActiveTab('materi')} 
                onOpenKumpulTugas={() => setActiveTab('tugas')} 
                onOpenAdmin={() => setActiveTab('admin')} 
              />
              <Home onNavigate={setActiveTab} />
            </>
          )}
          {activeTab === 'materi' && <Materials />}
          {activeTab === 'tugas' && <Assignments />}
          {activeTab === 'announcements' && <Announcements />}
          {activeTab === 'grades' && <Grades student={student} />}
          {activeTab === 'login' && <Login onLoginSuccess={() => setActiveTab('admin')} />}
          
          {/* Admin Dashboard terproteksi dengan ProtectedRoute */}
          {activeTab === 'admin' && (
            <ProtectedRoute user={user} onUnauthorized={() => setActiveTab('login')}>
              <AdminDashboard user={user} onLogout={() => setActiveTab('home')} />
            </ProtectedRoute>
          )}
        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}