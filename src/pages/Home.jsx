import React from 'react';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Halo Semua <span className="animate-waving-hand">👋</span>
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Selamat datang di halaman utama.
      </p>
    </div>
  );
}