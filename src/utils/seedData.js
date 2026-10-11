import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { INITIAL_MATERIALS } from '../data/materialsData';
import { INITIAL_ANNOUNCEMENTS } from '../data/announcementsData';
import { INITIAL_GRADES } from '../data/gradesData';

export async function seedInitialData() {
  try {
    // 1. Seed Materi Pembelajaran
    for (const mat of INITIAL_MATERIALS) {
      await setDoc(doc(db, 'materials', mat.id), {
        title: mat.title,
        classCategory: `Kelas ${mat.classCategory}`,
        description: mat.description,
        downloadUrl: mat.driveUrl,
        fileType: mat.fileType.toUpperCase(),
        createdAt: serverTimestamp()
      }, { merge: true });
    }

    // 2. Seed Pengumuman Sekolah
    for (const ann of INITIAL_ANNOUNCEMENTS) {
      await setDoc(doc(db, 'announcements', ann.id), {
        title: ann.title,
        category: ann.category,
        content: ann.content,
        date: ann.date,
        createdAt: serverTimestamp()
      }, { merge: true });
    }

    // 3. Seed Rekapitulasi Nilai
    for (const grd of INITIAL_GRADES) {
      await setDoc(doc(db, 'grades', grd.nis), {
        nisn: grd.nis,
        studentName: grd.name,
        className: grd.className,
        assignmentScore: grd.assignmentScore,
        quizScore: grd.quizScore,
        examScore: grd.examScore,
        finalScore: Math.round((grd.assignmentScore + grd.quizScore + grd.examScore) / 3),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }

    return { success: true, message: 'Data awal berhasil diunggah ke Firestore!' };
  } catch (error) {
    console.error('Gagal mengunggah data seeder:', error);
    return { success: false, message: error.message };
  }
}