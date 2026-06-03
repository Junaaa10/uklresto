'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://backend-kuliner.up.railway.app/api';
const ENDPOINT_PESANAN = '/pesanan';

type DetailPesanan = {
  id_menu?: number;
  nama_menu?: string;
  name?: string;
  qty?: number;
  jumlah?: number;
  jumlah_pesanan?: number;
  subtotal?: number;
};

type Transaksi = {
  id_pesanan: string;
  nama_pelanggan: string;
  nomor_meja: string;
  metode_pembayaran: 'Tunai' | 'QRIS';
  total_harga: number;
  status_pesanan: string;
  waktu: string;
  detail: DetailPesanan[];
};

export default function KasirDashboard() {
  const router = useRouter();
  const [antrean, setAntrean] = useState<Transaksi[]>([]);
  const [totalKasMasuk, setTotalKasMasuk] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'Belum Bayar' | 'Lunas' | 'Semua'>('Belum Bayar');

  const fetchPesananDariBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT_PESANAN}`);
      if (response.ok) {
        const result = await response.json();
        // Mengantisipasi struktur respons bersarang dari server
        const data = result.data ? result.data : result;
        if (Array.isArray(data)) {
          setAntrean(data);
          hitungTotalLunas(data);
        }
      }
    } catch (error) {
      // Cadangan membaca data lokal browser jika backend offline/terkendala CORS
      const localData = JSON.parse(localStorage.getItem('simulasi_pesanan') || '[]');
      setAntrean(localData);
      hitungTotalLunas(localData);
    }
  };

  const hitungTotalLunas = (data: Transaksi[]) => {
    const total = data
      .filter((t) => t.status_pesanan?.toLowerCase() === 'lunas')
      .reduce((sum, t) => sum + (Number(t.total_harga) || 0), 0);
    setTotalKasMasuk(total);
  };

  useEffect(() => {
    fetchPesananDariBackend();

    // Jalur Sinkronisasi Real-Time Instan antar tab browser
    const channel = new BroadcastChannel('sinar_remaja_order_channel');
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'PESANAN_BARU') {
        try { 
          new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav').play(); 
        } catch(e){}
        
        setAntrean((prev) => {
          const baru = event.data.data;
          // Hindari duplikasi jika data keburu masuk lewat polling API
          if (prev.some(t => t.id_pesanan === baru.id_pesanan)) return prev;
          const updated = [baru, ...prev];
          hitungTotalLunas(updated);
          return updated;
        });
      }
    };

    // Sinkronisasi background otomatis ke cloud backend setiap 5 detik
    const interval = setInterval(fetchPesananDariBackend, 5000);

    return () => {
      channel.close();
      clearInterval(interval);
    };
  }, []);

  const konfirmasiLunas = async (idPesanan: string) => {
    setAntrean((prev) => {
      const updated = prev.map((t) => {
        if (t.id_pesanan === idPesanan) {
          return { ...t, status_pesanan: 'Lunas' };
        }
        return t;
      });
      localStorage.setItem('simulasi_pesanan', JSON.stringify(updated));
      hitungTotalLunas(updated);
      return updated;
    });

    try {
      await fetch(`${API_BASE_URL}${ENDPOINT_PESANAN}/${idPesanan}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pesanan: 'Lunas' })
      });
    } catch(e){}
  };

  const listTersaring = antrean.filter((t) => {
    if (!t.status_pesanan) return false;
    if (filterStatus === 'Semua') return true;
    return t.status_pesanan.toLowerCase() === filterStatus.toLowerCase();
  });

  const jumlahAntreanBelumBayar = antrean.filter(t => t.status_pesanan?.toLowerCase() === 'belum bayar').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-6">
      
      {/* Header Kasir dengan Tombol Keluar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-orange-600 tracking-tight">SINAR REMAJA</h1>
          <span className="bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded-full border border-green-200">● KASIR AKTIF</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right text-xs font-medium text-gray-500 hidden sm:block">
            PETUGAS AKTIF: <span className="font-bold text-gray-900 uppercase">JUNA</span>
          </div>
          
          <button 
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin keluar dari halaman Kasir?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }
            }}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs px-3.5 py-2 rounded-lg border border-red-200 transition-colors shadow-xs"
          >
            <span>🚪</span> Keluar
          </button>
        </div>
      </div>

      {/* Grid Informasi Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pesanan Belum Bayar</p>
          <p className="text-4xl font-black text-orange-600 mt-1">{jumlahAntreanBelumBayar} <span className="text-sm font-normal text-gray-500">Antrean</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Kas Masuk (Lunas)</p>
          <p className="text-4xl font-black text-green-600 mt-1">Rp {totalKasMasuk.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Daftar Transaksi Pelanggan</h2>
            <p className="text-xs text-gray-400">Sistem otomatis memuat pesanan baru secara real-time.</p>
          </div>
          
          {/* Tab Navigasi Kategori */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-bold">
            <button onClick={() => setFilterStatus('Belum Bayar')} className={`px-4 py-2 rounded-md transition-all ${filterStatus === 'Belum Bayar' ? 'bg-white text-orange-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}>Belum Bayar ({jumlahAntreanBelumBayar})</button>
            <button onClick={() => setFilterStatus('Lunas')} className={`px-4 py-2 rounded-md transition-all ${filterStatus === 'Lunas' ? 'bg-white text-green-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}>Sudah Lunas</button>
            <button onClick={() => setFilterStatus('Semua')} className={`px-4 py-2 rounded-md transition-all ${filterStatus === 'Semua' ? 'bg-white text-gray-800 shadow-xs' : 'text-gray-500 hover:text-gray-900'}`}>Semua Riwayat</button>
          </div>
        </div>

        {/* List Data */}
        <div className="space-y-4">
          {listTersaring.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400 font-medium">Tidak ada antrean pesanan dalam kategori ini.</div>
          ) : (
            listTersaring.map((t) => (
              <div key={t.id_pesanan} className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${t.status_pesanan?.toLowerCase() === 'lunas' ? 'bg-gray-50/50 border-gray-200' : 'bg-orange-50/20 border-orange-200 shadow-xs'}`}>
                <div className="flex items-start gap-4">
                  <div className="bg-gray-900 text-white font-black text-center px-3 py-2 rounded-lg text-sm min-w-[55px]">
                    <span className="text-[10px] block font-normal text-gray-400 uppercase">MEJA</span>
                    {t.nomor_meja || '-'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 uppercase">{t.nama_pelanggan || 'PELANGGAN'}</h4>
                      <span className="text-[11px] text-gray-400 font-medium">({t.waktu || 'Baru'})</span>
                    </div>
                    
                    {/* Render Detail Menggunakan Berbagai Alternatif Nama Properti */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-600 font-medium">
                      {t.detail && t.detail.length > 0 ? (
                        t.detail.map((d, i) => {
                          const itemQty = d.jumlah ?? d.qty ?? d.jumlah_pesanan ?? 1;
                          const itemName = d.nama_menu ?? d.name ?? 'Menu';
                          return (
                            <span key={i} className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                              {itemQty}x <span className="font-bold text-gray-900">{itemName}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 italic">Data menu kosong</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] block font-bold text-gray-400 uppercase tracking-wider">
                      {t.metode_pembayaran === 'QRIS' ? '📱 QRIS' : '💵 TUNAI'}
                    </span>
                    <span className="text-base font-black text-gray-900">Rp {(Number(t.total_harga) || 0).toLocaleString('id-ID')}</span>
                  </div>
                  
                  {t.status_pesanan?.toLowerCase() === 'belum bayar' ? (
                    <button onClick={() => konfirmasiLunas(t.id_pesanan)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors shadow-xs">
                      Konfirmasi Lunas
                    </button>
                  ) : (
                    <span className="bg-green-100 text-green-700 font-bold text-xs px-4 py-2 rounded-lg border border-green-200">
                      ✓ Selesai
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}