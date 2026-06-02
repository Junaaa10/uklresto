'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login berhasil, langsung lempar ke beranda utama
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Dekorasi latar belakang */}
      <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 blur-2xl pointer-events-none" />
      <div className="absolute w-96 h-96 bg-amber-500/20 rounded-full -bottom-20 -right-20 blur-2xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full p-8 md:p-10 shadow-2xl border border-white/20 transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Header Form */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-950 tracking-tight">
            Selamat <span className="text-orange-600">Datang</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="text-orange-600 hover:text-orange-700 font-bold hover:underline transition">
              Daftar akun baru
            </Link>
          </p>
        </div>

        {/* Form Input */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Alamat Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@gmail.com" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-800 transition bg-gray-50/50"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Kata Sandi</label>
              <a href="#" className="text-xs text-orange-600 hover:underline font-semibold">Lupa Sandi?</a>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-800 transition bg-gray-50/50"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="remember" className="w-4 h-4 accent-orange-600 cursor-pointer rounded" />
            <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none font-medium">
              Ingat akun saya di perangkat ini
            </label>
          </div>

          {/* Tombol Submit Login */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-600/20 active:scale-[0.99] mt-2 text-sm uppercase tracking-wider"
          >
            Masuk Sekarang
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          © 2026 SINAR.REMAJA Resto App Router
        </div>
      </div>
    </div>
  );
}