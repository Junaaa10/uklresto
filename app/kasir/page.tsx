'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FoodItem {
  id: string | number;
  name: string;
  origin: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem {
  food: FoodItem;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  method: 'qris' | 'cash' | 'none';
  status: 'Belum Bayar' | 'Lunas';
  timestamp: string;
}

export default function KasirPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Mengambil data antrean secara live dari localStorage
  const loadOrders = () => {
    const savedOrders = localStorage.getItem('rasanusa_order_store');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Gagal parsing data order', e);
      }
    }
  };

  useEffect(() => {
    loadOrders();

    // Sinkronisasi otomatis antar-tab saat menu menambah orderan baru
    const handleStorageChange = () => {
      loadOrders();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fungsi mengubah status pembayaran (Belum Bayar -> Lunas)
  const handleMarkAsPaid = (orderId: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: 'Lunas' as const };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem('rasanusa_order_store', JSON.stringify(updatedOrders));
  };

  // Fungsi menghapus pesanan (Selesai diproses / batalkan)
  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus/menyelesaikan antrean order ini?')) {
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('rasanusa_order_store', JSON.stringify(updatedOrders));
    }
  };

  // Fungsi menghapus seluruh antrean sekaligus (reset dashboard)
  const handleResetAllOrders = () => {
    if (confirm('PENTING: Hapus seluruh histori antrean kasir hari ini?')) {
      setOrders([]);
      localStorage.removeItem('rasanusa_order_store');
    }
  };

  // Kalkulasi statistik untuk widget dashboard kasir
  const totalAntreanAktif = orders.filter(o => o.status === 'Belum Bayar').length;
  const totalPesananLunas = orders.filter(o => o.status === 'Lunas').length;
  const totalPendapatanHariIni = orders
    .filter(o => o.status === 'Lunas')
    .reduce((sum, current) => sum + current.total, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased">
      
      {/* PROFESSIONAL NAVBAR */}
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/menu" 
              className="flex items-center gap-2 text-xs font-bold text-[#EA580C] bg-orange-50 hover:bg-orange-100/70 px-4 py-2.5 rounded-xl border border-orange-100 transition"
            >
              📋 Halaman Menu Resto
            </Link>
            <div className="h-5 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🖥️</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight text-slate-900">SINAR.KASIR</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Monitor Live</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">Sistem Manajemen POS Restoran Terintegrasi</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetAllOrders}
              className="text-slate-400 hover:text-red-500 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Reset Semua Data
            </button>
            <div className="bg-slate-900 text-white text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-800 shadow-sm">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>
      </nav>

      {/* BODY INTERFACE */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* ROW 1: CORE STATS BENTO WIDGET */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Antrean Aktif</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalAntreanAktif} <span className="text-xs font-medium text-slate-400">pesanan</span></h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl">⏳</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pesanan Sukses Lunas</p>
              <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{totalPesananLunas} <span className="text-xs font-medium text-slate-400">terselesaikan</span></h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl">✅</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pendapatan Kasir Hari Ini</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rp {totalPendapatanHariIni.toLocaleString('id-ID')}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl">💰</div>
          </div>
        </section>

        {/* ROW 2: MAIN BOARD CONTROL & STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN PANEL KIRI: INFO STATUS & MONITOR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 font-black text-9xl pointer-events-none">
                POS
              </div>
              <span className="bg-orange-500 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md">
                KASIR UTAMA
              </span>
              <h3 className="text-lg font-black tracking-tight mt-3 mb-2">Alur Kerja Real-Time</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Setiap pesanan baru yang dikirim oleh pelanggan dari halaman menu utama akan langsung muncul di monitor ini secara instan tanpa perlu memuat ulang halaman *(Auto Sync)*.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Total Antrean Gabungan:</span>
                <span className="font-mono text-white text-sm font-bold bg-slate-800 px-2.5 py-1 rounded-lg">{orders.length} Pesanan</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-1.5">
                <span>💡</span> Panduan Singkat Kasir
              </h4>
              <ul className="space-y-2.5 text-[11px] text-slate-500 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">⚡</span>
                  <span>Gunakan tombol <strong>"Konfirmasi Lunas"</strong> apabila kasir telah menerima uang tunai atau verifikasi QRIS sukses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500">⚡</span>
                  <span>Pesanan berlabel <span className="text-emerald-600 bg-emerald-50 px-1 rounded font-bold">Lunas</span> akan dihitung masuk ke dalam ringkasan grafik pendapatan kasir.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMN PANEL KANAN: STREAM DAFTAR ANTREAN MASUK */}
          <main className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
                📂 Live Feed Antrean Orderan Masuk
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                Terakhir Diperbarui secara Otomatis
              </span>
            </div>

            {orders.length === 0 ? (
              /* KONDISI EMTPY STATE JIKA TIDAK ADA PESANAN */
              <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  💤
                </div>
                <h3 className="text-sm font-black text-slate-800 mb-1">Belum Ada Pesanan Masuk</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Silakan lakukan simulasi order dengan klik tombol "+ Order" dan selesaikan checkout pembayaran pada halaman menu pelanggan Anda.
                </p>
              </div>
            ) : (
              /* KONDISI BILA ANTREAN TERSEDIA */
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order.id}
                    className={`bg-white rounded-3xl border transition-all shadow-sm overflow-hidden ${
                      order.status === 'Lunas' ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'
                    }`}
                  >
                    {/* Header Item Kartu Order */}
                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold">
                          ⏰ {order.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Label Jenis Pembayaran */}
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 uppercase tracking-wider">
                          {order.method === 'qris' ? '📱 QRIS Live' : '💵 Tunai / Cash'}
                        </span>

                        {/* Status badge lunas / belum */}
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                          order.status === 'Lunas' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700 animate-pulse'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Konten Item Makanan yang Dipesan */}
                    <div className="p-6">
                      <div className="divide-y divide-slate-50">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.food.image} 
                                alt={item.food.name} 
                                className="w-10 h-10 object-cover rounded-xl border border-slate-100"
                              />
                              <div>
                                <h4 className="text-xs font-black text-slate-900">{item.food.name}</h4>
                                <p className="text-[10px] text-slate-400 font-medium">{item.food.origin}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-slate-500 mr-4">
                                x{item.quantity}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                Rp {(item.food.price * item.quantity).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Aksi Tombol */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">Total Tagihan</p>
                          <span className="text-base font-black text-slate-900">
                            Rp {order.total.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition"
                            title="Hapus / Selesaikan Pesanan"
                          >
                            🗑️
                          </button>
                          
                          {order.status === 'Belum Bayar' && (
                            <button
                              onClick={() => handleMarkAsPaid(order.id)}
                              className="bg-slate-950 hover:bg-emerald-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
                            >
                              ✓ Konfirmasi Lunas
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>

    </div>
  );
}