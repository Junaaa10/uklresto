'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://backend-kuliner.up.railway.app/api';
const ENDPOINT_MENU = '/menu';
const ENDPOINT_STOCK = '/stock'; 

type MenuItem = {
  id?: number;
  id_menu?: number;
  nama_menu?: string;
  name?: string;
  kategori?: string;
  category?: string;
  harga?: number;
  price?: number;
  deskripsi?: string;
  description?: string;
  stok?: any;
  stock?: any;
  [key: string]: any;
};

export default function AdminMenuManagement() {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'stock'>('add');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const [formInput, setFormInput] = useState({
    nama_menu: '',
    kategori: 'MAKANAN',
    harga: 0,
    deskripsi: '',
    stok: 0,
    current_stok: 0 
  });

  const getMenuId = (m: MenuItem) => m.id ?? m.id_menu ?? 0;
  const getMenuName = (m: MenuItem) => m.nama_menu ?? m.name ?? '-';
  const getMenuCat = (m: MenuItem) => m.kategori ?? m.category ?? 'MAKANAN';
  const getMenuPrice = (m: MenuItem) => Number(m.harga ?? m.price ?? 0);
  const getMenuDesc = (m: MenuItem) => m.deskripsi ?? m.description ?? '-';
  
  const getStockNumber = (m: MenuItem): number => {
    const rawStock = m.stok ?? m.stock;
    if (typeof rawStock === 'number') return rawStock;
    if (typeof rawStock === 'string') return Number(rawStock) || 0;
    if (rawStock && typeof rawStock === 'object') {
      return Number(rawStock.quantity ?? rawStock.stok ?? rawStock.stock ?? 0);
    }
    return 0;
  };

  const fetchMenuAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}${ENDPOINT_MENU}`);
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
    fetchMenuAdmin();
  }, []);

  const handleOpenAddModal = () => {
    setModalMode('add');
    setSelectedId(null);
    setSelectedItem(null);
    setFormInput({ nama_menu: '', kategori: 'MAKANAN', harga: 0, deskripsi: '', stok: 10, current_stok: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setModalMode('edit');
    setSelectedId(getMenuId(item));
    setSelectedItem(item);
    setFormInput({
      nama_menu: getMenuName(item),
      kategori: getMenuCat(item).toUpperCase(),
      harga: getMenuPrice(item),
      deskripsi: getMenuDesc(item),
      stok: getStockNumber(item),
      current_stok: getStockNumber(item)
    });
    setIsModalOpen(true);
  };

  const handleOpenStockModal = (item: MenuItem) => {
    setModalMode('stock');
    setSelectedId(getMenuId(item));
    setSelectedItem(item);
    setFormInput({
      nama_menu: getMenuName(item),
      kategori: getMenuCat(item).toUpperCase(),
      harga: getMenuPrice(item),
      deskripsi: getMenuDesc(item),
      stok: 0, 
      current_stok: getStockNumber(item) 
    });
    setIsModalOpen(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalStock = modalMode === 'stock' 
      ? Number(formInput.current_stok) + Number(formInput.stok) 
      : Number(formInput.stok);
    
    let url = `${API_BASE_URL}${ENDPOINT_MENU}`;
    let method = 'POST';
    let payload: any = {};

    if (modalMode === 'add') {
      payload = {
        nama_menu: formInput.nama_menu,
        kategori: formInput.kategori,
        harga: Number(formInput.harga),
        deskripsi: formInput.deskripsi,
        stok: { quantity: finalStock }
      };
    } 
    else if (modalMode === 'edit') {
      url = `${API_BASE_URL}${ENDPOINT_MENU}/${selectedId}`;
      method = 'PUT'; 
      payload = { ...selectedItem };
      payload.nama_menu = formInput.nama_menu;
      payload.kategori = formInput.kategori;
      payload.harga = Number(formInput.harga);
      payload.deskripsi = formInput.deskripsi;
      if (payload.stok && typeof payload.stok === 'object') {
        payload.stok = { ...payload.stok, quantity: finalStock };
      } else {
        payload.stok = { quantity: finalStock };
      }
    } 
    // --- PERBAIKAN: PAYLOAD HANYA BERISI STOCK, TANPA ID ---
    else if (modalMode === 'stock') {
      const dbStockId = selectedItem?.stok?.id ?? selectedItem?.stock?.id;
      
      if (!dbStockId) {
        alert("⚠️ Gagal mendeteksi ID Stok objek ini dari database.");
        return;
      }

      url = `${API_BASE_URL}${ENDPOINT_STOCK}/${dbStockId}`;
      method = 'PATCH'; 
      
      // Hanya mengirimkan nilai quantity/stock agar lolos proteksi backend
      payload = {
        stok: finalStock,
        stock: finalStock,
        quantity: finalStock
      };
    }

    const token = localStorage.getItem('token') || 
                  localStorage.getItem('accessToken') || 
                  localStorage.getItem('token_admin') || '';

    const headersConfig: Record<string, string> = { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json' 
    };

    if (token) {
      headersConfig['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: headersConfig,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(modalMode === 'stock' ? '📦 Sukses! Stok berhasil di-update ke server.' : '✓ Data Berhasil Disimpan!');
        fetchMenuAdmin(); 
        setIsModalOpen(false);
      } else {
        if (response.status === 401) {
          alert("⚠️ Akses ditolak (401 Unauthorized). Silakan logout lalu login ulang ke akun Admin Anda.");
        } else if (response.status === 403) {
          alert("⚠️ Akses ditolak (403 Forbidden). Akun yang digunakan mungkin tidak berhak, atau endpoint PATCH menolak format ini.");
        } else {
          alert(`Server menolak dengan status eror: ${response.status}`);
        }
        console.log("Detail URL:", url);
        console.log("Payload Dikirim:", payload);
      }
    } catch (err) {
      alert("⚠️ Terjadi kendala koneksi ke server.");
      console.error(err);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Hapus menu ini secara permanen dari server?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT_MENU}/${id}`, { method: 'DELETE' });
      if (response.ok) fetchMenuAdmin();
    } catch (e) {
      console.error("Gagal menghapus:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex text-slate-100 font-sans">
      
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="mb-8">
            <h1 className="text-xl font-black text-orange-500 tracking-wider">SINAR <span className="text-white">REMAJA</span></h1>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded tracking-widest mt-1 inline-block">ADMIN PORTAL</span>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-md transition-all text-left">
              📦 Manajemen Menu & Stok
            </button>
            <button className="w-full flex items-center gap-3 text-slate-400 hover:text-white text-xs font-bold px-4 py-3 rounded-xl hover:bg-slate-900 transition-all text-left">
              📋 Riwayat Pesanan
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 bg-slate-50 text-slate-800 lg:h-screen lg:overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Menu & Stok</h2>
            <p className="text-xs text-slate-500 mt-0.5">Kelola ketersediaan data makanan, harga, dan detail menu.</p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-1"
          >
            ➕ Tambah Menu Baru
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16">ID</th>
                  <th className="py-4 px-6">Nama & Kategori</th>
                  <th className="py-4 px-6 text-center">Tersedia</th> 
                  <th className="py-4 px-6">Harga (Rp)</th>
                  <th className="py-4 px-6 max-w-xs">Deskripsi Menu</th>
                  <th className="py-4 px-6 text-center min-w-[240px]">Aksi Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {isLoading && menuList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">Menyinkronkan data dari database server...</td>
                  </tr>
                ) : (
                  menuList.map((item, index) => {
                    const mid = getMenuId(item);
                    const currentStok = getStockNumber(item); 
                    const kategori = getMenuCat(item).toUpperCase();
                    
                    return (
                      <tr key={mid || index} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-normal">#{mid}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900 text-sm mb-1">{getMenuName(item)}</p>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            kategori === 'MINUMAN' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            kategori === 'SNACK' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-orange-50 text-orange-600 border border-orange-100'
                          }`}>
                            {kategori}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`font-black px-3 py-1.5 rounded-lg text-sm ${currentStok <= 5 ? 'text-white bg-red-500 shadow-sm' : 'text-slate-700 bg-slate-100'}`}>
                            {currentStok}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-green-600 text-sm">
                          {(getMenuPrice(item)).toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-6 text-slate-500 truncate max-w-[200px]" title={getMenuDesc(item)}>
                          {getMenuDesc(item)}
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenStockModal(item)} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
                            <span className="text-base">➕</span> Tambah Stok
                          </button>
                          <button onClick={() => handleOpenEditModal(item)} className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold px-3 py-2 rounded-lg transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteMenu(mid)} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-3 py-2 rounded-lg transition-colors">
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* POPUP MODAL DINAMIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-slate-800 shadow-2xl border border-slate-100">
            <h3 className={`text-lg font-black mb-4 border-b pb-3 ${modalMode === 'stock' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {modalMode === 'stock' ? '➕ TAMBAH STOK (METHOD: PATCH)' : 
               modalMode === 'edit' ? '📝 EDIT SELURUH DATA MENU' : '➕ TAMBAH DATA MENU BARU'}
            </h3>
            
            <form onSubmit={handleSaveMenu} className="space-y-4 text-sm">
              {modalMode === 'stock' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Target Menu:</p>
                      <p className="text-lg font-black text-slate-900">{formInput.nama_menu}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Stok Saat Ini:</p>
                      <p className="text-2xl font-black text-slate-700">{formInput.current_stok}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl shadow-inner relative overflow-hidden">
                    <label className="block font-black text-emerald-800 text-center mb-3 text-base">MASUKKAN STOK TAMBAHAN (+)</label>
                    <input 
                      type="number" 
                      min="0" 
                      required 
                      value={formInput.stok === 0 ? '' : formInput.stok} 
                      onChange={e => setFormInput({...formInput, stok: Number(e.target.value)})} 
                      className="w-full border-2 border-emerald-300 rounded-lg p-4 font-black text-3xl text-emerald-700 text-center outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all bg-white" 
                      placeholder="0"
                    />
                    {formInput.stok > 0 && (
                      <div className="mt-3 text-center text-sm font-bold text-emerald-700 animate-pulse">
                        Total Akhir di DB = {Number(formInput.current_stok) + Number(formInput.stok)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Nama Menu</label>
                    <input type="text" required value={formInput.nama_menu} onChange={e => setFormInput({...formInput, nama_menu: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-orange-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Kategori</label>
                      <select value={formInput.kategori} onChange={e => setFormInput({...formInput, kategori: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 font-bold outline-none bg-white">
                        <option value="MAKANAN">MAKANAN</option>
                        <option value="MINUMAN">MINUMAN</option>
                        <option value="SNACK">SNACK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Stok Awal</label>
                      <input type="number" min="0" required value={formInput.stok} onChange={e => setFormInput({...formInput, stok: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2.5 text-center font-bold outline-none focus:border-orange-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Harga (Rupiah)</label>
                    <input type="number" min="0" required value={formInput.harga} onChange={e => setFormInput({...formInput, harga: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2.5 font-bold text-green-600 outline-none focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Deskripsi / Keterangan</label>
                    <textarea rows={2} value={formInput.deskripsi} onChange={e => setFormInput({...formInput, deskripsi: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:border-orange-500 resize-none" />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors">Batal</button>
                <button type="submit" className={`w-2/3 font-bold py-3 rounded-xl transition-all shadow-lg text-white ${modalMode === 'stock' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 text-base' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/30'}`}>
                  {modalMode === 'stock' ? '✓ PATCH KE SWAGGER' : 'Simpan Data DB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}