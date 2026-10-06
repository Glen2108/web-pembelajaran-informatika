import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, X, KeyRound } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    // Default Password Guru: admin123
    if (password === 'admin123') {
      setError('');
      setPassword('');
      onLoginSuccess();
    } else {
      setError('Password salah! Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm glass-modal rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/20 dark:border-slate-700/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Akses Guru / Admin</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Khusus Pengampu: <span className="font-semibold text-slate-700 dark:text-slate-300">Glendy A. Taawoeda, S.Pd.</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Masukkan Password Guru
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">Password bawaan: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-brand-600 dark:text-brand-400 font-mono">admin123</code></p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <KeyRound className="w-4 h-4" />
            <span>Masuk Panel Admin</span>
          </button>
        </form>

      </div>
    </div>
  );
}