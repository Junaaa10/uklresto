'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FoodStockItem {
  id: string | number;
  name: string;
  category: string;
  currentStock: number;
  minimumLimit: number;
  image: string;
  price: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Data State Stok Makanan (Mensimulasikan beberapa item kritis/habis)
  const [stockItems, setStockItems] = useState<FoodStockItem[]>([
    {
      id: 'stk-1',
      name: 'Ayam Bakar Taliwang',
      category: 'Makanan Utama',
      currentStock: 0, // Habis
      minimumLimit: 15,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
      price: 25000
    },
    {
      id: 'stk-2',
      name: 'Es Dawet Ayu Selasih',
      category: 'Minuman Segar',
      currentStock: 3, // Kritis (Di bawah limit 10)
      minimumLimit: 20,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
      price: 13000
    },
    {
      id: 'stk-3',
      name: 'Batagor Bandung Asli',
      category: 'Camilan',
      currentStock: 18, // Aman
      minimumLimit: 10,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
      price: 25000
    },
    {
      id: 'stk-4',
      name: 'Sate Maranggi Purwakarta',
      category: 'Makanan Utama',
      currentStock: 0, // Habis
      minimumLimit: 12,
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=800',
      price: 35000
    }
  ]);

  useEffect(() => {
    const session = localStorage.getItem('rasanusa_user_session');
    if (!session) {
      router.push('/register');
      return;
    }
    const parsedUser = JSON.parse(session);
    if (parsedUser.role !== 'admin') {
      alert('Akses Ditolak! Halaman ini hanya untuk Super Admin/Owner.');
      router.push('/register');
    } else {
      setUser(parsedUser);
    }
  }, [router]);

  // Fungsi Aksi Responsif Cepat untuk Mengisi Ulang Stok (Quick Re-stock)
  const handleRestock = (id: string | number, currentStock: number) => {
    const inputAmount = prompt(`Masukkan jumlah porsi stock tambahan:`, "30");
    if (inputAmount === null) return;
    
    const amount = parseInt(inputAmount);
    if (isNaN(amount) || amount <= 0) return alert('Masukkan nominal angka yang valid!');

    setStockItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, currentStock: item.currentStock + amount } : item
      )
    );
  };

  if (!user) return <div className="p-8 text-xs font-bold text-center text-slate-400">Membuka Panel Kontrol Admin...</div>;

  // Penghitungan metrik otomatis untuk indikator status
  const outOfStockCount = stockItems.filter(item => item.currentStock === 0).length;
  const criticalStockCount = stockItems.filter(item => item.currentStock > 0 && item.currentStock <= item.minimumLimit).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 antialiased">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER MANAGEMENT */}
        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-red-500/10 text-red-400 font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-red-500/20">
                Owner Mode
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-xl font-black text-white mt-2 tracking-tight">Kontrol Inventori & Bahan Makanan</h1>
            <p className="text-xs text-slate-400 mt-1">Pemilik akun aktif: <strong className="text-slate-200">{user.name}</strong> ({user.email})</p>
          </div>
          <Link href="/register" className="text-xs font-bold text-red-400 bg-red-500/10 px-5 py-2.5 rounded-xl hover:bg-red-500/20 border border-red-500/10 transition-all active:scale-95">
            🔒 Keluar Panel
          </Link>
        </div>

        {/* METRICS ROW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400">🚨 Sudah Habis (0 Porsi)</h3>
              <p className="text-2xl font-black text-red-500 mt-1">{outOfStockCount} <span className="text-xs text-slate-500 font-semibold">Menu</span></p>
            </div>
            <span className="text-2xl bg-red-500/10 p-3 rounded-xl border border-red-500/10">❌</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400">⚠️ Kritis (Perlu Re-stock)</h3>
              <p className="text-2xl font-black text-amber-500 mt-1">{criticalStockCount} <span className="text-xs text-slate-500 font-semibold">Menu</span></p>
            </div>
            <span className="text-2xl bg-amber-500/10 p-3 rounded-xl border border-amber-500/10">⚖️</span>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400">✅ Stok Aman Terkendali</h3>
              <p className="text-2xl font-black text-emerald-400 mt-1">{stockItems.length - outOfStockCount - criticalStockCount} <span className="text-xs text-slate-500 font-semibold">Menu</span></p>
            </div>
            <span className="text-2xl bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/10">📦</span>
          </div>
        </div>

        {/* UTAMA: DAFTAR PANTAUAN STOK INVENTORI */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
              <h2 className="text-sm font-black text-white tracking-tight">Daftar Menu Kritis & Habis</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Segera isi kembali porsi menu agar pelanggan dapat mengorder kembali di frontend.</p>
            </div>
            <button 
              onClick={() => alert('Fitur integrasi penambahan suplai supplier otomatis aktif!')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl border border-blue-500 shadow-lg transition-all"
            >
              🔄 Refresh Status
            </button>
          </div>

          {/* TABEL LIST MAKANAN */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
                  <th className="py-4 px-6">Detail Produk Kuliner</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Sisa Stok Saat Ini</th>
                  <th className="py-4 px-6">Status Batas Kritis</th>
                  <th className="py-4 px-6 text-right">Tindakan Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                {stockItems.map((item) => {
                  const isOutOfStock = item.currentStock === 0;
                  const isCritical = item.currentStock > 0 && item.currentStock <= item.minimumLimit;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                      {/* Image & Name */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-10 rounded-xl object-cover border border-slate-700 shadow-inner" />
                        <div>
                          <h4 className="font-bold text-white tracking-tight">{item.name}</h4>
                          <p className="text-[10px] text-slate-500">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-slate-400">
                        <span className="bg-slate-950 px-2.5 py-1 rounded-md text-[10px] font-bold border border-slate-800 text-slate-300">
                          {item.category}
                        </span>
                      </td>

                      {/* Stock Info */}
                      <td className="py-4 px-6">
                        <span className={`text-sm font-black ${isOutOfStock ? 'text-red-500' : isCritical ? 'text-amber-500' : 'text-emerald-400'}`}>
                          {item.currentStock} <span className="text-[10px] font-bold text-slate-500">Porsi</span>
                        </span>
                      </td>

                      {/* Badge Status */}
                      <td className="py-4 px-6">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 text-[10px] px-2.5 py-1 rounded-full font-bold border border-red-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Wajib Re-stock (Kosong)
                          </span>
                        ) : isCritical ? (
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-[10px] px-2.5 py-1 rounded-full font-bold border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Limit Tipis (Min. {item.minimumLimit})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Pasokan Aman
                          </span>
                        )}
                      </td>

                      {/* Button Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleRestock(item.id, item.currentStock)}
                          className={`font-black text-[11px] px-3.5 py-2 rounded-xl shadow-md transition-transform active:scale-95 ${
                            isOutOfStock 
                              ? 'bg-red-600 hover:bg-red-500 text-white' 
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          }`}
                        >
                          ➕ Pasok Stok
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}