'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://backend-kuliner.up.railway.app/api'; 

// =========================================================================
// 🛑 UBAH KATA '/reservasi' DI BAWAH INI SESUAI DENGAN YANG ADA DI SWAGGER
// Jika di Swagger tulisannya '/booking', ubah menjadi '/booking'
// =========================================================================
const ENDPOINT_RESERVASI = '/reservasi'; 

export default function ReservasiPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama_pelanggan: '',
    nomor_hp: '',
    tanggal_reservasi: '',
    waktu_reservasi: '',
    jumlah_orang: 2,
    nomor_meja: '',
    catatan: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format data yang dikirim ke server (Pastikan nama kiri/key sesuai dengan Swagger)
    const payload = {
      nama: formData.nama_pelanggan,           
      telepon: formData.nomor_hp,              
      tanggal: formData.tanggal_reservasi,     
      waktu: formData.waktu_reservasi,
      jumlah_tamu: Number(formData.jumlah_orang),
      meja: formData.nomor_meja || "Bebas",
      catatan_khusus: formData.catatan
    };

    const token = localStorage.getItem('token') || '';
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headersConfig['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    // Menggabungkan URL
    const finalUrl = `${API_BASE_URL}${ENDPOINT_RESERVASI}`;
    
    // Alat bantu cek URL (Tekan F12 -> tab Console untuk melihatnya saat tombol ditekan)
    console.log("➡️ Mencoba mengirim data ke URL:", finalUrl);
    console.log("📦 Data yang dikirim (Payload):", payload);

    try {
      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: headersConfig,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("🎉 Reservasi berhasil dibuat! Menunggu konfirmasi dari admin.");
        router.push('/dashboard'); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Gagal Reservasi. Detail dari server:", errorData);
        
        if (response.status === 404) {
          alert(`⚠️ ERROR 404: Alamat ${finalUrl} TIDAK DITEMUKAN!\n\nSilakan buka file kodenya dan ubah variabel ENDPOINT_RESERVASI agar sama persis dengan yang ada di Swagger.`);
        } else if (response.status === 422 || response.status === 400) {
          alert(`⚠️ ERROR ${response.status}: Format data ditolak server. Buka tab Console (F12) untuk melihat detail variabel yang salah eja.`);
        } else {
          alert(`⚠️ Gagal memproses. Status server: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error Reservasi:", error);
      alert("⚠️ Terjadi masalah koneksi internet saat mengirim data ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* NAVBAR */}
      <header className="bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-40 flex justify-between items-center shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition font-bold text-sm">
          <span>← Kembali</span>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-slate-900">
          SINAR <span className="text-orange-600">REMAJA</span>
        </h1>
        <div className="w-16"></div>
      </header>

      {/* BANNER */}
      <div className="bg-slate-900 py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 to-slate-900/40 z-0"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-3 block">Booking Tempat</span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Reservasi Meja Anda</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Pastikan Anda mendapatkan tempat terbaik untuk momen spesial Anda dengan melakukan reservasi terlebih dahulu.
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 mt-8">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 relative -mt-16 z-20">
          
          <form onSubmit={handleReservation} className="space-y-6">
            
            {/* INFO PERSONAL */}
            <div>
              <h3 className="font-black text-slate-800 border-b border-slate-100 pb-2 mb-4 text-sm uppercase tracking-wide">Informasi Pemesan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    name="nama_pelanggan"
                    value={formData.nama_pelanggan}
                    onChange={handleChange}
                    required 
                    placeholder="Contoh: Arka"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Nomor HP / WhatsApp *</label>
                  <input 
                    type="tel" 
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleChange}
                    required 
                    placeholder="Contoh: 08123456789"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* DETAIL RESERVASI */}
            <div>
              <h3 className="font-black text-slate-800 border-b border-slate-100 pb-2 mb-4 text-sm uppercase tracking-wide mt-8">Detail Waktu & Tempat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Tanggal Reservasi *</label>
                  <input 
                    type="date" 
                    name="tanggal_reservasi"
                    value={formData.tanggal_reservasi}
                    onChange={handleChange}
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Waktu / Jam *</label>
                  <input 
                    type="time" 
                    name="waktu_reservasi"
                    value={formData.waktu_reservasi}
                    onChange={handleChange}
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Jumlah Orang *</label>
                  <input 
                    type="number" 
                    min="1"
                    name="jumlah_orang"
                    value={formData.jumlah_orang}
                    onChange={handleChange}
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Nomor/Area Meja (Opsional)</label>
                  <select 
                    name="nomor_meja"
                    value={formData.nomor_meja}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors text-slate-700"
                  >
                    <option value="">Pilih Area (Bebas)</option>
                    <option value="Indoor AC">Indoor AC</option>
                    <option value="Outdoor Smoking">Outdoor / Smoking Area</option>
                    <option value="VIP Room">VIP Room</option>
                  </select>
                </div>
              </div>

              {/* CATATAN */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Catatan Khusus (Opsional)</label>
                <textarea 
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Misal: Mohon siapkan kursi bayi, atau untuk acara ulang tahun..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors resize-none"
                ></textarea>
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-600/30 transition-all active:scale-95 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'MEMPROSES RESERVASI...' : 'KONFIRMASI RESERVASI SEKARANG'}
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-4 font-semibold uppercase tracking-wider">
                Tim Sinar Remaja akan menghubungi Anda untuk konfirmasi lebih lanjut.
              </p>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}