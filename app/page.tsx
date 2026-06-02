'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek transparan navbar saat di-scroll demi estetika profesional
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-orange-100 antialiased">
      
      {/* HEADER NAVIGASI MODERN PREMIUM */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 h-16' : 'bg-transparent h-20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          
          {/* LOGO RESTORAN */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍲</span>
            <span className="text-lg font-black tracking-tight text-gray-950">
              SINAR<span className="text-[#EA580C]">.REMAJA</span>
            </span>
          </div>

          {/* MENU NAVIGASI KANAN */}
          <div className="flex items-center gap-6">
            <Link 
              href="/menu" 
              className="text-xs font-bold text-gray-600 hover:text-[#EA580C] transition"
            >
              Menu Kuliner
            </Link>
            <Link 
              href="/tentang" 
              className="text-xs font-bold text-gray-600 hover:text-[#EA580C] transition"
            >
              Tentang Kami
            </Link>
            <Link 
              href="/keranjang" 
              className="bg-gray-950 hover:bg-[#EA580C] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 duration-200"
            >
              Pesan Sekarang ➔
            </Link>
          </div>

        </div>
      </nav>

      {/* HERO SECTION - KARTU UTAMA ELEGAN */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-16">
        <div className="relative bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#374151] rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800">
          
          {/* Pola background hiasan halus */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.15),transparent_45%)]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12 lg:p-16 relative z-10">
            
            {/* TEXT SIDE (KIRI) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 px-3.5 py-1.5 rounded-full">
                <span className="text-[10px] font-black tracking-widest text-[#FB923C] uppercase">
                  ✨ Kuliner Warisan Leluhur ID
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Cita Rasa <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-amber-400">
                  Nusantara
                </span>
              </h1>
              
              <p className="text-gray-300 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
                Selamat datang di restoran RasaNusantara. Kami menyajikan makanan otentik khas daerah pilihan terbaik, dimasak dengan cinta, langsung menuju meja makan Anda.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/menu" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EA580C] to-amber-500 hover:from-[#D97706] hover:to-orange-600 text-white font-black text-xs px-7 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <span>Lihat Semua Daftar Menu</span>
                  <span className="text-sm">➔</span>
                </Link>
              </div>
            </div>

            {/* IMAGE SIDE (KANAN) */}
            <div className="lg:col-span-5 h-full flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000" 
                  alt="Sajian Masakan Nusantara" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS SECTION - "KENAPA MEMILIH KAMI" */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 text-center">
        
        <div className="space-y-2 mb-12">
          <span className="text-[10px] text-[#EA580C] font-black tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-full">
            Our Excellence
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Kenapa Memilih RasaNusantara?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 1: BUMBU REMPAH ASLI */}
          <div className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mx-auto mb-5 group-hover:scale-110 transition-transform">
              🌿
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">
              Bumbu Rempah Asli
            </h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Menggunakan racikan resep turun-temurun asli daerah asal masakan tanpa bahan pengawet.
            </p>
          </div>

          {/* CARD 2: KOKI BERPENGALAMAN */}
          <div className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-xl mx-auto mb-5 group-hover:scale-110 transition-transform">
              👨‍🍳
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">
              Koki Berpengalaman
            </h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Dibuat secara higienis oleh ahli kuliner nusantara profesional yang memahami keaslian cita rasa rasa tradisional.
            </p>
          </div>

          {/* CARD 3: SISTEM CEPAT */}
          <div className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-xl mx-auto mb-5 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <h3 className="font-extrabold text-gray-900 text-base mb-2">
              Sistem Cepat
            </h3>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Pemesanan ringkas terintegrasi QRIS, terdata sangat rapi, dan hidangan disajikan selalu dalam keadaan hangat dan cepat.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER RINGKAS */}
      <footer className="border-t border-gray-100 mt-12 py-8 text-center text-[11px] font-bold text-gray-400">
        © 2026 SINAR.REMAJA Resto. Semua Hak Dilindungi.
      </footer>

    </div>
  );
}