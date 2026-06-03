'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State Otentikasi Multi-Role untuk kebutuhan routing internal frontend Anda
  const [role, setRole] = useState<'pelanggan' | 'admin' | 'kasir'>('pelanggan');
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Mengarah langsung ke single endpoint terpusat sesuai data cURL backend Anda
      const response = await fetch('https://backend-kuliner.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          password: password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server mengembalikan respon non-JSON (Status: ${response.status}). Pastikan backend berjalan aktif.`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email atau password salah!');
      }

      // 2. Menyimpan accessToken dan data user berdasarkan skema response asli backend
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken); // Menyimpan properti accessToken backend Anda
      }
      
      localStorage.setItem('role', role);
      
      if (data.data) {
        localStorage.setItem('user', JSON.stringify(data.data)); // Menyimpan objek data user (id, name, email, role)
      }

      alert(`Login Berhasil! Selamat datang kembali, ${data.data?.name || 'User'}.`);
      
      // 3. Routing pengalihan halaman internal Next.js berdasarkan hak akses peran (role frontend)
      if (role === 'pelanggan') {
        router.push('/menu');
      } else if (role === 'kasir') {
        router.push('/kasir');
      } else if (role === 'admin') {
        router.push('/admin');
      }
      
      router.refresh();
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan koneksi ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Dekorasi latar belakang */}
      <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 blur-2xl pointer-events-none" />
      <div className="absolute w-96 h-96 bg-amber-500/20 rounded-full -bottom-20 -right-20 blur-2xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md rounded-3xl max-w-md w-full p-8 md:p-10 shadow-2xl border border-white/20 transition-all duration-300 transform hover:scale-[1.01]">
        
        {/* Header Form */}
        <div className="text-center mb-6">
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

        {/* Tab Selector Role terintegrasi */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          {(['pelanggan', 'admin', 'kasir'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                role === r 
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Alamat Email / Username ({role})
            </label>
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
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-600/20 active:scale-[0.99] mt-2 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : `Masuk Sebagai ${role}`}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          © 2026 SINAR.REMAJA Resto App Router
        </div>
      </div>
    </div>
  );
}