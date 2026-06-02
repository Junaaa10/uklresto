'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  // State Form Pengguna
  const [fullName, setFullName] = useState('Budi Santoso');
  const [email, setEmail] = useState('budi@gmail.com');
  const [password, setPassword] = useState('password123');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // --- SINGKRONISASI 3 ROLE UNTUK FOLDER DAN BACKEND ---
  const [role, setRole] = useState<'customer' | 'kasir' | 'admin'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreeTerms) {
      setErrorMessage('Anda harus menyetujui seluruh syarat dan ketentuan layanan.');
      return;
    }

    setIsLoading(true);

    const payloadBackend = {
      name: fullName,
      email: email,
      password: password,
      role: role 
    };

    console.log('Mengirim data pendaftaran ke Backend:', payloadBackend);

    try {
      // Simulasi delay response API backend selama 1 detik
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simpan session info ke LocalStorage
      localStorage.setItem('rasanusa_user_session', JSON.stringify({
        name: fullName,
        email: email,
        role: role
      }));

      alert(`Pendaftaran Akun Berhasil sebagai ${role.toUpperCase()}!`);
      
      // Otomatis mengarahkan user masuk ke halaman sesuai folder role masing-masing
      if (role === 'kasir') {
        router.push('/kasir');
      } else if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/customer');
      }

    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan koneksi sistem, coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F95006] flex items-center justify-center p-4 antialiased">
      <div className="bg-[#FFFDF9] rounded-[36px] max-w-md w-full px-10 py-12 shadow-2xl text-[#1E293B]">
        
        {/* Teks Judul */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Buat Akun <span className="text-[#F95006]">Baru</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-2">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-[#F95006] font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Notifikasi Error jika ada */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form Input Konten */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Input Nama Lengkap */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Budi Santoso"
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#EFF5FF]/40 text-xs font-medium outline-none text-slate-700"
            />
          </div>

          {/* Input Alamat Email */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#EFF5FF]/60 text-xs font-medium outline-none text-slate-700 focus:bg-[#EFF5FF]"
            />
          </div>

          {/* INPUT DROPDOWN 3 ROLE */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Daftar Sebagai (Peran Hak Akses)
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'customer' | 'kasir' | 'admin')}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#EFF5FF]/60 text-xs font-black text-slate-700 outline-none cursor-pointer focus:bg-[#EFF5FF]"
            >
              <option value="customer">🍽️ Pelanggan / Customer Restoran</option>
              <option value="kasir">🖥️ Petugas Kasir / Admin POS</option>
              <option value="admin">👑 Owner / Super Admin Resto</option>
            </select>
          </div>

          {/* Input Kata Sandi */}
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-[#EFF5FF]/60 text-xs font-medium outline-none text-slate-700 focus:bg-[#EFF5FF]"
            />
          </div>

          {/* Checkbox Persetujuan Syarat & Ketentuan */}
          <div className="flex items-start gap-2.5 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#F95006] focus:ring-[#F95006] w-3.5 h-3.5 cursor-pointer"
            />
            <label htmlFor="terms" className="text-[10px] font-semibold text-slate-500 leading-tight cursor-pointer select-none">
              Saya menyetujui seluruh syarat dan ketentuan layanan kuliner.
            </label>
          </div>

          {/* Tombol Utama Kirim Data */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E45B06] hover:bg-slate-900 text-white font-extrabold text-xs tracking-wider uppercase py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] mt-2 disabled:bg-slate-400"
          >
            {isLoading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Hak Cipta Footer */}
        <p className="text-[10px] text-center text-slate-400 font-semibold mt-8 tracking-wide">
          © 2026 SINAR.REMAJA Resto App Router
        </p>

      </div>
    </div>
  );
}