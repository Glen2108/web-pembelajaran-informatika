import React from 'react';

export default function ProtectedRoute({ user, children, onUnauthorized }) {
  if (!user) {
    return (
      <div className="text-center py-12 space-y-3 glass-card rounded-2xl max-w-md mx-auto my-10">
        <p className="text-xs text-red-500 font-bold">Akses Ditolak. Anda harus login sebagai Admin.</p>
        <button
          onClick={onUnauthorized}
          className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
        >
          Ke Halaman Login
        </button>
      </div>
    );
  }
  return children;
}