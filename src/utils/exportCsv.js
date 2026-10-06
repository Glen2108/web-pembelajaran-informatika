export function exportSubmissionsToCSV(data, filename = 'rekap_tugas_siswa.csv') {
  if (!data || data.length === 0) return;

  const headers = ['Nama Siswa', 'Kelas', 'Judul Tugas', 'Tautan Tugas', 'Waktu Pengiriman'];
  const rows = data.map((item) => [
    `"${item.studentName || ''}"`,
    `"${item.studentClass || ''}"`,
    `"${item.assignmentTitle || ''}"`,
    `"${item.submissionUrl || ''}"`,
    `"${item.submittedAt ? new Date(item.submittedAt.seconds * 1000).toLocaleString('id-ID') : ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}