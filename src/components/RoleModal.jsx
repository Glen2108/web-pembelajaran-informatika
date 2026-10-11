// Tambahkan listener untuk event unload/visibilitychange
useEffect(() => {
  const studentId = localStorage.getItem('studentId');
  if (!studentId) return;

  const handleBeforeUnload = () => {
    // Memperbarui status menjadi offline di Firestore saat tab ditutup
    updateDoc(doc(db, 'students', studentId), {
      status: 'offline',
      lastSeen: serverTimestamp()
    });
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);