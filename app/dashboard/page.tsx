"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
// 1. IMPORT USEROUTER UNTUK NAVIGASI
import { useRouter } from "next/navigation";

export default function Dashboard() {
  // 2. INISIALISASI ROUTER
  const router = useRouter();
  const [username, setUsername] = useState("Pelanggan");

  useEffect(() => {
    // Opsional: Mengambil nama user dari localStorage jika ada
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
    else setUsername("arka");
  }, []);

  // 3. FUNGSI LOGOUT
  const handleLogout = () => {
    // Hapus token atau data sesi yang tersimpan di localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");

    // Arahkan ke halaman login
    // Catatan: Jika halaman login Anda ada di path utama (localhost:3000/), ubah menjadi router.push('/')
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-orange-200">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12 border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <Link href="/dashboard">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 cursor-pointer hover:opacity-80 transition">
              SINAR <span className="text-orange-600">REMAJA</span>
            </h1>
          </Link>

          <nav className="hidden md:flex gap-8 font-bold text-sm mt-1">
            <Link
              href="/dashboard"
              className="text-orange-600 border-b-2 border-orange-600 pb-1"
            >
              Beranda
            </Link>
            <Link
              href="/menu"
              className="text-slate-400 hover:text-slate-900 transition-colors pb-1"
            >
              Daftar Menu
            </Link>
            <Link
              href="/reservasi"
              className="text-slate-400 hover:text-orange-500 transition-colors pb-1 flex items-center gap-1"
            >
              Reservasi Meja{" "}
              <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Selamat Datang,
            </p>
            <p className="text-sm font-black text-slate-800">{username}</p>
          </div>
          {/* 4. PASANG FUNGSI LOGOUT KE TOMBOL KELUAR */}
          <button
            onClick={handleLogout}
            className="px-6 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Konten Kiri */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">
            ✨ Terhubung Sempurna dengan Backend
          </div>

          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">
            Kehangatan <br /> Rasa <br /> Kuliner{" "}
            <span className="text-orange-600">
              Sinar <br /> Remaja
            </span>
            .
          </h2>

          <p className="text-slate-500 text-base md:text-lg max-w-md leading-relaxed mt-4">
            Halo <strong className="text-slate-800">{username}</strong>, nikmati
            hidangan legendaris dengan cita rasa otentik yang diproses higienis
            dan cepat langsung dari dapur utama kami.
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <Link
              href="/menu"
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white text-xs md:text-sm font-black rounded-xl shadow-xl shadow-orange-600/30 transition-all text-center tracking-wide"
            >
              LIHAT & PESAN MENU
            </Link>

            <Link
              href="/reservasi"
              className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-black rounded-xl transition-all text-center tracking-wide"
            >
              RESERVASI TEMPAT
            </Link>
          </div>
        </div>

        {/* Card Kanan */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[3rem] p-10 md:p-12 text-center text-white shadow-2xl shadow-orange-600/20 flex flex-col justify-center items-center aspect-square lg:aspect-auto lg:h-[550px] relative overflow-hidden group">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

          <div className="text-7xl mb-6 drop-shadow-md z-10 animate-bounce">
            🍛
          </div>
          <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight z-10">
            Sinar Remaja Resto
          </h3>
          <p className="text-orange-100/90 leading-relaxed max-w-sm font-medium z-10">
            Kombinasi resep warisan asli dan sistem pemesanan modern berbasis
            API terintegrasi.
          </p>
        </div>
      </main>
    </div>
  );
}
