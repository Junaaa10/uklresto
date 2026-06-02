'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'CASH' | 'QRIS';
  status: string;
  createdAt: string;
}

export default function PemesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ambil data nota pesanan aktif yang dikirim customer
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('antrean_kasir_rasanusa');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, []);

  // Update status hidangan (Contoh: Selesai Dimasak / Lunas)
  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = orders.map(order => order.id === id ? { ...order, status: newStatus } : order);
    setOrders(updated);
    localStorage.setItem('antrean_kasir_rasanusa', JSON.stringify(updated));
  };

  // Hapus nota dari antrean kasir jika transaksi benar-benar selesai
  const handleClearOrder = (id: string) => {
    const konfirmasi = window.confirm('Arsipkan nota transaksi yang telah selesai ini, bos?');
    if (!konfirmasi) return;

    const updated = orders.filter(order => order.id !== id);
    setOrders(updated);
    localStorage.setItem('antrean_kasir_rasanusa', JSON.stringify(updated));
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-100 pb-16 pt-6">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Wadah utama putih mirip dengan desain image_9daf37.png */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[500px]">
          <div className="flex items-center gap-3 border-b pb-4 mb-6">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-xl font-black text-gray-900">Daftar Nota Pemesan (Panel Kasir)</h2>
              <p className="text-xs text-gray-400">Kelola pengiriman makanan kuliner pesanan aktif Anda.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl mb-3">🍱</span>
              <h4 className="text-sm font-bold text-gray-800">Belum Ada Pemersanan Aktif</h4>
              <p className="text-xs text-gray-400 max-w-sm mt-1">
                Silakan menunggu customer melakukan check-out hidangan lezat dari halaman keranjang mereka.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50 space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-md">
                        {order.id}
                      </span>
                      <h3 className="font-extrabold text-gray-900 text-base mt-1">{order.customerName}</h3>
                      <p className="text-xs text-gray-500 font-medium">📍 {order.tableNumber} • 🕒 {order.createdAt}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      order.status === 'Selesai & Lunas' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Rincian Menu yang Dipesan */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 text-xs space-y-2">
                    <span className="font-bold text-gray-400 block tracking-wide uppercase text-[9px]">Daftar Hidangan:</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-gray-700">
                        <span>{item.name} <strong className="text-gray-900">x{item.quantity}</strong></span>
                        <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-1 flex justify-between items-center font-black text-gray-900">
                      <span>Total Transaksi</span>
                      <span className="text-orange-600">Rp {order.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Informasi Metode Pembayaran */}
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                      <span>Metode:</span>
                      <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
                        {order.paymentMethod === 'QRIS' ? '📱 QRIS' : '💵 CASH'}
                      </span>
                    </div>

                    {/* Tombol Aksi Kasir */}
                    <div className="flex items-center gap-2">
                      {order.status !== 'Selesai & Lunas' ? (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'Selesai & Lunas')}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                        >
                          ✓ Selesaikan
                        </button>
                      ) : (
                        <button
                          onClick={() => handleClearOrder(order.id)}
                          className="bg-gray-200 hover:bg-red-500 hover:text-white text-gray-600 font-bold text-[11px] px-3 py-1.5 rounded-lg transition"
                        >
                          🗑️ Arsipkan
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}