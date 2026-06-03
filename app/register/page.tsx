'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // State baru untuk menampung nomor telepon
  const [setuju, setSetuju] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'pelanggan' | 'admin' | 'kasir'>('pelanggan');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setuju) {
      alert('Anda harus menyetujui syarat dan ketentuan layanan.');
      return;
    }
    setIsLoading(true);

    try {
      // Menembak ke endpoint tunggal sesuai dengan spesifikasi cURL backend Anda
      const response = await fetch('https://backend-kuliner.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 
          'accept': '*/*',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          name: nama, 
          email: email, 
          password: password,
          phone: phone,             // Mengirim data phone ke backend
          role: role.toUpperCase()  // Mengubah 'pelanggan' -> 'PELANGGAN' sesuai kebutuhan backend
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server mengembalikan respon non-JSON (Status: ${response.status}). Pastikan rute /api/auth/register tersedia.`);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Gagal mendaftarkan akun ${role}.`);

      alert(`Registrasi Berhasil! Akun ${data.data.name} sebagai ${data.data.role} siap digunakan.`);
      
      // Mengarahkan pengguna langsung ke halaman utama/login setelah sukses
      router.push('/'); 
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-[#fffdfa] rounded-3xl max-w-md w-full p-8 md:p-10 shadow-xl text-center">
        <h2 className="text-3xl font-black text-gray-950 tracking-tight">
          Buat Akun <span className="text-orange-600">Baru</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Sudah punya akun?{' '}
          <Link href="/" className="text-orange-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>

        {/* Tab Selector Role */}
        <div className="grid grid-cols-3 gap-2 mt-6 p-1 bg-gray-100 rounded-xl">
          {(['pelanggan', 'admin', 'kasir'] as const).map((r) => (
            <button
              key={r} type="button" onClick={() => setRole(r)}
              className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition-all ${
                role === r ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form Pendaftaran */}
        <form onSubmit={handleRegister} className="text-left mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
            <input 
              type="text" required placeholder="Ryu" value={nama} onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800 bg-gray-50/50"
            />
          </div>

          {/* Input Baru: Nomor Telepon */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nomor Telepon</label>
            <input 
              type="tel" required placeholder="81234567890" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alamat Email</label>
            <input 
              type="email" required placeholder="kokoci@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800 bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kata Sandi</label>
            <input 
              type="password" required placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800 bg-gray-50/50"
            />
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input 
              type="checkbox" id="agree" checked={setuju} onChange={(e) => setSetuju(e.target.checked)}
              className="w-4 h-4 accent-orange-600 cursor-pointer rounded mt-0.5" 
            />
            <label htmlFor="agree" className="text-xs text-gray-500 cursor-pointer select-none font-medium leading-tight">
              Saya menyetujui seluruh syarat dan ketentuan layanan kuliner.
            </label>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-600/20 text-sm uppercase tracking-wider disabled:opacity-50"
          >
            {isLoading ? 'Memproses Akun...' : `Daftar Sebagai ${role}`}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          © 2026 RASANUSA Resto App Router
        </div>
      </div>
    </div>
  );
}