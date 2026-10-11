export function exportSubmissionsToCSV(data, filename = 'rekap_tugas_siswa.csv') {
  if (!data || data.length === 0) return;

  const headers = ['Nama Siswa', 'Kelas', 'Judul Tugas', 'Tautan Tugas', 'Waktu Pengiriman'];
  const rows = data.map((item) => {
    let dateStr = '';
    if (item.submittedAt) {
      if (typeof item.submittedAt.toDate === 'function') {
        dateStr = item.submittedAt.toDate().toLocaleString('id-ID');
      } else if (item.submittedAt.seconds) {
        dateStr = new Date(item.submittedAt.seconds * 1000).toLocaleString('id-ID');
      } else {
        dateStr = new Date(item.submittedAt).toLocaleString('id-ID');
      }
    }

    return [
      `"${item.studentName || ''}"`,
      `"${item.studentClass || ''}"`,
      `"${item.assignmentTitle || ''}"`,
      `"${item.submissionUrl || ''}"`,
      `"${dateStr}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}