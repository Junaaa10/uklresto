'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function KeranjangPage() {
  const context = useCart() as any;
  const cartItems = context?.cartItems || [];
  const removeFromCart = context?.removeFromCart || (() => {});
  const clearCart = context?.clearCart || (() => {});
  const updateQuantity = context?.updateQuantity || (() => {});

  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'QRIS'>('CASH');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🛠️ FUNGSI EKSTRAKSI ANTI-ERROR: Mengisolasi objek agar tidak bocor ke komponen React Child
  const dapatkanDetailItem = (item: any) => {
    // Jika item kosong, beri nilai default berupa string/angka murni
    if (!item) return { id: '0', name: 'Menu Kuliner', price: 0, image: '', quantity: 1 };

    // Jika item membungkus objek utama di properti 'food', gunakan itu
    const target = item.food ? item.food : item;

    // Pastikan ID berupa teks murni
    const id = target.id && typeof target.id !== 'object' ? String(target.id) : String(Math.random());

    // Pastikan NAMA berupa teks murni (Jika nama berupa objek, ambil string default agar tidak crash)
    let name = 'Menu Kuliner';
    if (target.name && typeof target.name === 'string') {
      name = target.name;
    } else if (target.nama && typeof target.nama === 'string') {
      name = target.nama;
    }

    // Pastikan HARGA berupa angka murni
    const rawPrice = target.price ?? target.harga ?? item.price ?? 0;
    const price = typeof rawPrice === 'number' ? rawPrice : parseInt(rawPrice as any) || 0;

    // Pastikan GAMBAR berupa teks murni
    const image = typeof target.image === 'string' ? target.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800';

    // Pastikan KUANTITAS berupa angka murni
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;

    return { id, name, price, image, quantity };
  };

  // Menghitung total harga belanjaan secara aman
  const totalPrice = cartItems.reduce((acc: number, rawItem: any) => {
    if (!rawItem) return acc;
    const item = dapatkanDetailItem(rawItem);
    return acc + (item.price * item.quantity);
  }, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Keranjang kamu masih kosong!');
      return;
    }
    if (!customerName || !tableNumber) {
      alert('Mohon isi nama pemesan dan nomor meja!');
      return;
    }

    const notaBaru = {
      id: `TXT-${Date.now()}`,
      customerName,
      tableNumber,
      items: cartItems.map((rawItem: any) => {
        const item = dapatkanDetailItem(rawItem);
        return { name: item.name, price: item.price, quantity: item.quantity };
      }),
      total: totalPrice,
      paymentMethod,
      status: 'Belum Diproses',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('antrean_kasir_rasanusa') || '[]');
      localStorage.setItem('antrean_kasir_rasanusa', JSON.stringify([notaBaru, ...existingOrders]));
      clearCart();
      setCustomerName('');
      setTableNumber('');
      alert(`🎉 Pesanan sukses dikirim ke Kasir!`);
    } catch (err) {
      alert('Gagal memproses nota.');
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#A3A3A3] flex items-center justify-center">
        <p className="text-sm font-bold text-white/80 animate-pulse">Sinkronisasi menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#A3A3A3] pb-16 pt-10">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-black text-[#1E293B] flex items-center gap-2">
            <span>🛒</span> Keranjang Belanja Anda
          </h2>
          <Link href="/menu" className="text-xs font-bold text-[#EA580C] hover:underline transition">
            ← Kembali Tambah Menu
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* DAFTAR ITEM DI KERANJANG */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white p-16 rounded-2xl text-center border border-gray-100 shadow-sm">
                <span className="text-5xl block mb-4">📥</span>
                <p className="text-base font-bold text-gray-700">Keranjang Belanja Kosong</p>
              </div>
            ) : (
              cartItems.map((rawItem: any, index: number) => {
                if (!rawItem) return null;
                
                // DATA DI-EKSTRAK KE DALAM FORMAT STRING DAN ANGKA MURNI
                const item = dapatkanDetailItem(rawItem);

                return (
                  <div key={item.id || index} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between gap-4 shadow-sm">
                    
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div>
                        {/* DI-RENDER SEBAGAI STRING MURNI: Mencegah error 'Objects are not valid' */}
                        <h4 className="font-extrabold text-[#1E293B] text-base mb-1">
                          {String(item.name)}
                        </h4>
                        <span className="text-sm text-[#EA580C] font-black block">
                          Rp {Number(item.price).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-lg border border-gray-200">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="bg-white text-gray-800 w-7 h-7 text-xs rounded-md font-black hover:bg-gray-200 shadow-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        {/* DI-RENDER SEBAGAI ANGKA MURNI */}
                        <span className="text-xs font-black text-gray-900 w-5 text-center">
                          {Number(item.quantity)}
                        </span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-white text-gray-800 w-7 h-7 text-xs rounded-md font-black hover:bg-gray-200 shadow-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center"
                      >
                        🗑️
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* SISI KANAN: FORM CHECKOUT */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <h3 className="font-extrabold text-[#1E293B] text-sm border-b border-gray-100 pb-3 mb-4">Detail Nota & Pembayaran</h3>
            
            <form onSubmit={handleCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Nama Pemesan *</label>
                <input 
                  type="text"
                  required
                  placeholder="Nama pembeli..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-1">Nomor Meja *</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Meja 03"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-500 mb-2">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'CASH' ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C]' : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-base">💵</span>
                    <span>Cash / Tunai</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition ${
                      paymentMethod === 'QRIS' ? 'border-[#EA580C] bg-orange-50/50 text-[#EA580C]' : 'border-gray-200 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-base">📱</span>
                    <span>QRIS Digital</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold">Total Tagihan:</span>
                <span className="text-base font-black text-[#EA580C]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full bg-[#EA580C] text-white font-black py-3 rounded-xl shadow-md text-sm mt-2"
              >
                Konfirmasi & Bayar Pesanan ➔
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}