import React, { useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function RoleModal() {
  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) return;

    const handleBeforeUnload = () => {
      updateDoc(doc(db, 'students', studentId), {
        status: 'offline',
        lastSeen: serverTimestamp()
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return null;
}