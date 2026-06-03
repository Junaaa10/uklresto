'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// 1. IMPORT USEROUTER UNTUK PINDAH HALAMAN
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'https://backend-kuliner.up.railway.app/api';
// CATATAN: Pastikan endpoint ini sesuai dengan yang ada di Swagger (contoh: /transaksi, /order, /pesanan)
const ENDPOINT_TRANSAKSI = '/transaksi'; 

type CartItem = {
  id: number;
  nama: string;
  harga: number;
  qty: number;
};

export default function MenuPage() {
  // 2. INISIALISASI ROUTER
  const router = useRouter();

  const [menuList, setMenuList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('SEMUA');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const fetchMenu = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/menu`);
      if (response.ok) {
        const result = await response.json();
        const data = result.data ? result.data : result;
        if (Array.isArray(data)) setMenuList(data);
      }
    } catch (error) {
      console.error("Gagal memuat API Menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const getMenuId = (m: any) => m.id ?? m.id_menu ?? 0;
  
  const getStock = (item: any) => {
    const raw = item.stok ?? item.stock;
    if (typeof raw === 'number') return raw;
    if (raw && typeof raw === 'object') return Number(raw.quantity ?? raw.stok ?? raw.stock ?? 0);
    return 0;
  };

  const addToCart = (item: any) => {
    const id = getMenuId(item);
    const harga = Number(item.harga ?? item.price ?? 0);
    const nama = item.nama_menu ?? item.name ?? 'Menu';

    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) {
        return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { id, nama, harga, qty: 1 }];
    });
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(prev => {
      return prev.map(c => {
        if (c.id === id) {
          const newQty = c.qty + delta;
          return { ...c, qty: newQty > 0 ? newQty : 0 };
        }
        return c;
      }).filter(c => c.qty > 0);
    });
  };

  const totalCartItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
  const totalCartPrice = cart.reduce((acc, curr) => acc + (curr.harga * curr.qty), 0);

  // --- 3. FUNGSI CHECKOUT TERHUBUNG KE BACKEND & ROUTING ---
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Keranjang masih kosong!");
    if (!customerName) return alert("Mohon isi nama Anda!");

    setIsSubmitting(true);

    // FORMAT DATA CHECKOUT
    // (Jika API Anda menolak/error 422, cek dokumentasi Swagger bagian POST /transaksi untuk menyesuaikan nama variabel (key) ini)
    const payload = {
      nama_pelanggan: customerName,
      nomor_meja: tableNumber || "Takeaway",
      total_harga: totalCartPrice,
      status: "Belum Bayar",
      detail_pesanan: cart.map(c => ({
        id_menu: c.id,
        kuantitas: c.qty,
        subtotal: c.harga * c.qty
      }))
    };

    // Opsional: Jika endpoint transaksi butuh token login, ambil dari localstorage
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT_TRANSAKSI}`, {
        method: 'POST',
        headers: headersConfig,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Jika sukses tersimpan di database backend
        setCart([]); 
        setIsCartOpen(false);
        
        // 4. ALIHKAN (REDIRECT) LANGSUNG KE HALAMAN KASIR
        router.push('/kasir');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gagal Checkout:", errorData);
        alert(`⚠️ Gagal mengirim pesanan. Server merespon status: ${response.status}. Pastikan format JSON sesuai dengan Swagger.`);
      }
    } catch (error) {
      console.error("Error Checkout:", error);
      alert("⚠️ Terjadi kesalahan koneksi saat checkout ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMenu = activeCategory === 'SEMUA' 
    ? menuList 
    : menuList.filter(m => (m.kategori || m.category || '').toUpperCase() === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      
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

      {/* BANNER HEADER */}
      <div className="bg-slate-900 py-12 md:py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/40 to-slate-900/40 z-0"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-orange-500 font-bold tracking-widest text-xs uppercase mb-3 block">Pesan Langsung</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Menu Sinar Remaja</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Klik tombol pesan pada menu favorit Anda, dan pesanan akan langsung masuk ke antrean Kasir kami.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        
        {/* FILTER KATEGORI */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {['SEMUA', 'MAKANAN', 'MINUMAN', 'SNACK'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* KONTEN MENU */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">🍽️</div>
            <p className="text-slate-500 font-bold animate-pulse">Menyiapkan hidangan lezat...</p>
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 font-bold">Menu untuk kategori ini sedang kosong.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMenu.map((item, i) => {
              const stock = getStock(item);
              const isAvailable = stock > 0;

              return (
                <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full relative overflow-hidden">
                  <div className="bg-slate-50 rounded-2xl h-40 mb-4 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                    {(item.kategori || item.category || '').toUpperCase() === 'MINUMAN' ? '🍹' : 
                     (item.kategori || item.category || '').toUpperCase() === 'SNACK' ? '🍟' : '🍛'}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800 text-lg leading-tight mb-2">
                      {item.nama_menu || item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {item.deskripsi || item.description || "Hidangan spesial dan otentik."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
                    <div>
                      <p className="font-black text-orange-600 text-lg">
                        Rp {(Number(item.harga || item.price || 0)).toLocaleString('id-ID')}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      disabled={!isAvailable}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                        isAvailable 
                          ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? '+ PESAN' : 'HABIS'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FLOATING CART BUTTON */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40 pointer-events-none">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="pointer-events-auto bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-full shadow-2xl shadow-orange-600/40 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 border-2 border-white/20 w-full max-w-sm justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-orange-600 w-8 h-8 flex items-center justify-center rounded-full font-black text-sm">
                {totalCartItems}
              </span>
              <span className="font-bold text-sm">Lihat Pesanan</span>
            </div>
            <span className="font-black">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
          </button>
        </div>
      )}

      {/* MODAL KERANJANG & CHECKOUT */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-fade-in-right">
            
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                🛒 Pesanan Anda
              </h3>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl p-2">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {cart.map((c, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl mb-3 shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{c.nama}</h4>
                    <p className="text-orange-600 font-black text-xs mt-1">Rp {c.harga.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button type="button" onClick={() => updateCartQty(c.id, -1)} className="w-7 h-7 bg-white text-slate-600 rounded shadow-sm font-bold hover:bg-slate-200">−</button>
                    <span className="font-black text-slate-800 text-sm w-4 text-center">{c.qty}</span>
                    <button type="button" onClick={() => updateCartQty(c.id, 1)} className="w-7 h-7 bg-white text-slate-600 rounded shadow-sm font-bold hover:bg-slate-200">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Pemesan</label>
                    <input 
                      type="text" 
                      required 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)} 
                      placeholder="Cth: Arka" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">No. Meja (Opsional)</label>
                    <input 
                      type="text" 
                      value={tableNumber} 
                      onChange={e => setTableNumber(e.target.value)} 
                      placeholder="Cth: 04" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-orange-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 pb-2">
                  <span className="text-slate-500 font-bold text-sm">Total Tagihan</span>
                  <span className="text-2xl font-black text-slate-900">
                    Rp {totalCartPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-xl shadow-lg shadow-orange-600/30 transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'MENGIRIM PESANAN...' : 'KIRIM KE KASIR SEKARANG'}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}