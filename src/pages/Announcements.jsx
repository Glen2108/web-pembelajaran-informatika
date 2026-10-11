// Gantikan format tanggal statis pada daftar kartu pengumuman:
<span className="inline-flex items-center gap-1.5 font-medium">
  <Calendar className="w-3.5 h-3.5 text-brand-500" />
  {item.createdAt?.seconds 
    ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : item.date || 'Baru Saja'}
</span>