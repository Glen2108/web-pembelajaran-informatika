// Tambahkan impor ini di bagian atas Materials.jsx
import { getDriveDirectLink } from '../utils/drive';

// Pada bagian render tombol unduh:
<a
  href={getDriveDirectLink(item.downloadUrl || item.driveUrl)}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
>
  <Download className="w-3.5 h-3.5" />
  <span>Unduh Modul</span>
  <ExternalLink className="w-3 h-3 opacity-60 ml-auto" />
</a>