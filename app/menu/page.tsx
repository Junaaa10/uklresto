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
  description?: string;
}

interface CartItem {
  food: FoodItem;
  quantity: number;
}

export default function MenuPage() {
  // State Utama Menu
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State Fitur Keranjang & Pembayaran
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'none' | 'qris' | 'cash'>('none');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // State Fitur Responsif Klik Order
  const [clickedItemId, setClickedItemId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State Fitur Manipulasi Menu
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [imagePreview, setImagePreview] = useState<string>(''); 
  const [newFood, setNewFood] = useState({
    name: '',
    origin: '',
    price: '',
    category: 'Makanan Utama',
    description: ''
  });

  // Load data menu & keranjang dari localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem('rasanusa_menu_store');
    if (savedMenu) {
      try { setFoods(JSON.parse(savedMenu)); } catch (e) { loadDefaultMenu(); }
    } else {
      loadDefaultMenu();
    }

    const savedCart = localStorage.getItem('rasanusa_cart_store');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  const loadDefaultMenu = () => {
    const defaultMenu: FoodItem[] = [
      {
        id: 'default-1',
        name: 'Ayam Bakar Taliwang',
        origin: 'Khas Lombok, NTB',
        price: 25000,
        category: 'Makanan Utama',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
        description: 'Ayam bakar legendaris khas suku Sasak Lombok dengan sensasi bumbu rempah pedas yang meresap sempurna hingga ke dalam serat daging.'
      },
      {
        id: 'default-2',
        name: 'Es Dawet Ayu Selasih',
        origin: 'Khas Banjarnegara',
        price: 13000,
        category: 'Minuman Segar',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
        description: 'Minuman tradisional segar penyegar dahaga yang memadukan kelembutan dawet pandan, manisnya gula aren murni, gurihnya santan, dan selasih.'
      },
      {
        id: 'default-3',
        name: 'Batagor Bandung Asli',
        origin: 'Khas Bandung, Jawa Barat',
        price: 25000,
        category: 'Camilan',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800',
        description: 'Bakso tahu goreng renyah berbahan dasar adonan ikan tenggiri premium, disiram dengan saus kacang kental khas Priangan yang gurih nan legit.'
      }
    ];
    setFoods(defaultMenu);
    localStorage.setItem('rasanusa_menu_store', JSON.stringify(defaultMenu));
  };

  const saveAndPersistMenu = (updatedMenu: FoodItem[]) => {
    setFoods(updatedMenu);
    localStorage.setItem('rasanusa_menu_store', JSON.stringify(updatedMenu));
  };

  const saveAndPersistCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('rasanusa_cart_store', JSON.stringify(updatedCart));
  };

  // Manajemen Keranjang Belanja
  const handleAddToOrder = (item: FoodItem) => {
    const existingIndex = cart.findIndex(cartItem => cartItem.food.id === item.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push({ food: item, quantity: 1 });
    }
    
    saveAndPersistCart(newCart);

    // Memicu Efek Visual Responsif Sementara pada Tombol & Toast
    setClickedItemId(item.id);
    setToastMessage(`✨ ${item.name} berhasil ditambahkan!`);
    
    setTimeout(() => {
      setClickedItemId(null);
    }, 600);

    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const updateQuantity = (id: string | number, amount: number) => {
    const newCart = cart.map(item => {
      if (item.food.id === id) {
        const nextQty = item.quantity + amount;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];

    saveAndPersistCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.food.price * item.quantity), 0);
  };

  const handleProcessCheckout = () => {
    if (paymentMethod === 'none') {
      alert('Silakan pilih salah satu metode pembayaran terlebih dahulu!');
      return;
    }

    const orderBaru = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total: calculateTotal(),
      method: paymentMethod,
      status: 'Belum Bayar',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const antreanLama = localStorage.getItem('rasanusa_order_store');
    const antreanUpdate = antreanLama ? JSON.parse(antreanLama) : [];
    antreanUpdate.push(orderBaru);
    
    localStorage.setItem('rasanusa_order_store', JSON.stringify(antreanUpdate));
    window.dispatchEvent(new Event('storage'));
    setIsCheckoutSuccess(true);
  };

  const handleClearCart = () => {
    saveAndPersistCart([]);
    setIsCartModalOpen(false);
    setIsCheckoutSuccess(false);
    setPaymentMethod('none');
  };

  // Manajemen Upload & Manipulasi Menu
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar! Maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price || !imagePreview) return;

    const itemBaru: FoodItem = {
      id: `custom-${Date.now()}`,
      name: newFood.name,
      origin: newFood.origin || 'Nusantara',
      price: Math.abs(parseInt(newFood.price)) || 0,
      category: newFood.category,
      image: imagePreview,
      description: newFood.description || 'Hidangan nusantara kuliner pilihan berkualitas tinggi.'
    };

    saveAndPersistMenu([...foods, itemBaru]);
    setIsAddModalOpen(false);
    setImagePreview('');
    setNewFood({ name: '', origin: '', price: '', category: 'Makanan Utama', description: '' });
  };

  const handleUpdatePrice = (id: string | number, currentPrice: number) => {
    const inputPrompt = prompt('Masukkan nominal harga baru:', currentPrice.toString());
    if (inputPrompt === null) return;
    const hargaBaru = parseInt(inputPrompt);
    if (isNaN(hargaBaru) || hargaBaru < 0) return alert('Masukkan angka valid!');
    
    saveAndPersistMenu(foods.map(item => item.id === id ? { ...item, price: hargaBaru } : item));
  };

  const handleRemoveMenu = (id: string | number, name: string) => {
    if (confirm(`Hapus "${name}" dari menu?`)) {
      saveAndPersistMenu(foods.filter(item => item.id !== id));
    }
  };

  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredFoods = foods.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] pb-24 relative">
      
      {/* Toast Notifikasi Elegan */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <p className="text-xs font-bold tracking-tight">{toastMessage}</p>
        </div>
      )}

      {/* Header Navbar */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200/50">
              🏡 Dashboard Utama
            </Link>
            <div className="h-5 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍲</span>
              <span className="text-base font-black tracking-tight text-gray-900">
                SINAR<span className="text-[#EA580C]">.REMAJA</span>
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsCartModalOpen(true)}
            className="bg-gray-950 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1 transition-transform active:scale-95"
          >
            🛒 Keranjang <span className="bg-[#EA580C] ml-1 text-[10px] px-1.5 py-0.5 rounded-full transition-all scale-110 duration-200">{totalItemsInCart}</span>
          </button>
        </div>
      </nav>

      {/* Control Bar */}
      <section className="max-w-7xl mx-auto px-6 mt-12 mb-12">
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-80">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Cari menu hidangan favorit Anda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-xs font-medium outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5 mr-2"
            >
              <span className="text-sm">➕</span> Tambah Menu
            </button>

            {['Semua', 'Makanan Utama', 'Minuman Segar', 'Camilan'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === category ? 'bg-[#EA580C] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Daftar Menu */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFoods.map((item) => (
            <article key={item.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col shadow-sm relative">
              <button
                onClick={() => handleRemoveMenu(item.id, item.name)}
                className="absolute top-4 right-4 z-10 bg-white/90 text-gray-500 hover:text-red-600 w-8 h-8 rounded-xl flex items-center justify-center shadow-md border border-gray-100/50"
              >
                🗑️
              </button>

              <div onClick={() => setSelectedFood(item)} className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden cursor-pointer">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-white/95 text-[#EA580C] font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-6">
                  <h3 onClick={() => setSelectedFood(item)} className="font-black text-gray-900 text-base mb-1.5 tracking-tight hover:text-[#EA580C] cursor-pointer">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                    <span className="text-[#EA580C]">📍</span> {item.origin}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Harga</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-gray-900">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <button onClick={() => handleUpdatePrice(item.id, item.price)} className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToOrder(item)}
                    className={`text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all duration-200 transform active:scale-95 ${
                      clickedItemId === item.id 
                        ? 'bg-emerald-600 text-white scale-105' 
                        : 'bg-[#EA580C] hover:bg-gray-950 text-white'
                    }`}
                  >
                    {clickedItemId === item.id ? '✓ Tersimpan' : '+ Order'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* MODAL KERANJANG BELANJA & PEMBAYARAN */}
      {isCartModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base tracking-tight flex items-center gap-2">
                <span>🛒</span> Detail Pesanan Keranjang
              </h3>
              <button onClick={() => setIsCartModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            {!isCheckoutSuccess ? (
              <>
                <div className="flex-grow overflow-y-auto py-4 space-y-3 pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 font-medium text-xs">
                      Keranjang belanja masih kosong. Yuk pilih makanan favoritmu terlebih dahulu!
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.food.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                          <img src={item.food.image} alt={item.food.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-gray-900 text-xs tracking-tight">{item.food.name}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">Rp {item.food.price.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-sm">
                          <button onClick={() => updateQuantity(item.food.id, -1)} className="text-xs font-black text-gray-400 hover:text-red-500">-</button>
                          <span className="text-xs font-extrabold text-gray-800 min-w-[12px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.food.id, 1)} className="text-xs font-black text-gray-400 hover:text-emerald-600">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 space-y-4 bg-white">
                    <div className="flex justify-between items-center bg-orange-50/50 p-3 rounded-2xl">
                      <span className="text-xs font-bold text-gray-500">Total Pembayaran:</span>
                      <span className="text-base font-black text-[#EA580C]">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Metode Pembayaran:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          type="button"
                          onClick={() => setPaymentMethod('qris')}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === 'qris' ? 'border-[#EA580C] bg-orange-50/30' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <span className="block text-base mb-0.5">📱</span>
                          <span className="text-xs font-black text-gray-800">Bayar via QRIS</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMethod === 'cash' ? 'border-[#EA580C] bg-orange-50/30' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <span className="block text-base mb-0.5">💵</span>
                          <span className="text-xs font-black text-gray-800">Cash ke Kasir</span>
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={handleProcessCheckout}
                      className="w-full bg-[#EA580C] hover:bg-gray-950 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all"
                    >
                      Proses Pembayaran Sekarang
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                {paymentMethod === 'qris' ? (
                  <>
                    {/* BAGIAN DIUBAH: MENYISIPKAN ASSET qr.jpeg ASLI SEPERTI REKOMENDASI DESIGN */}
                    <div className="bg-white p-3 border-2 border-gray-200 rounded-2xl shadow-sm">
                      <div className="w-40 h-40 bg-white rounded-lg flex flex-col items-center justify-center p-1 border border-dashed border-gray-400 overflow-hidden">
                        <span className="text-[10px] font-black text-blue-900 tracking-widest mb-1">QRIS - PASAR</span>
                        <img 
                          src="/qr.jpeg" 
                          alt="QRIS Sinar Remaja Resto" 
                          className="w-28 h-28 object-contain rounded"
                        />
                        <span className="text-[9px] text-gray-400 font-bold mt-1">Sinar Remaja Resto</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">Silakan Scan Kode QRIS</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs">Scan menggunakan e-wallet Anda. Pesanan otomatis terdeteksi langsung di layar monitor kasir.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-2xl">
                      📝
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm">Nomor Antrean Berhasil Dibuat</h4>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs">Silakan menuju ke meja Kasir untuk membayar tunai sebesar <strong className="text-gray-900">Rp {calculateTotal().toLocaleString('id-ID')}</strong>.</p>
                    </div>
                  </>
                )}

                <button 
                  onClick={handleClearCart}
                  className="bg-gray-900 hover:bg-[#EA580C] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors w-full mt-4"
                >
                  Selesai & Bersihkan Keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DETAIL BIODATA HIDANGAN */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
            <div className="relative aspect-[16/10]">
              <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedFood(null)} className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-[9px] bg-orange-50 text-[#EA580C] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">{selectedFood.category}</span>
                <h2 className="text-xl font-black text-gray-900 mt-2 tracking-tight">{selectedFood.name}</h2>
                <p className="text-xs font-bold text-gray-400 mt-1">📍 Asal Kuliner: <span className="text-gray-600">{selectedFood.origin}</span></p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Biodata & Deskripsi Rasa</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{selectedFood.description}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-black text-gray-900">Rp {selectedFood.price.toLocaleString('id-ID')}</span>
                <button onClick={() => setSelectedFood(null)} className="bg-gray-100 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl">Tutup Detail</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH MENU BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-sm tracking-tight flex items-center gap-1.5">
                <span className="text-purple-600 text-base">✛</span> Tambahkan Menu Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCreateMenu} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 font-bold mb-1">Nama Menu Hidangan *</label>
                <input required type="text" placeholder="Contoh: Nasi Goreng Kampung" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Asal Daerah</label>
                  <input type="text" placeholder="Misal: Jawa Timur" value={newFood.origin} onChange={e => setNewFood({...newFood, origin: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Harga (Nominal) *</label>
                  <input required type="number" min="0" placeholder="25000" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-gray-500 font-bold mb-1">Kategori Menu</label>
                <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 font-bold text-gray-700">
                  <option value="Makanan Utama">Makanan Utama</option>
                  <option value="Minuman Segar">Minuman Segar</option>
                  <option value="Camilan">Camilan</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 font-bold mb-1">Foto Kuliner Hidangan *</label>
                <div className="flex flex-col gap-2">
                  <input required={!imagePreview} type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#EA580C] bg-gray-50 p-1.5 rounded-xl border border-gray-200" />
                  {imagePreview && <div className="w-16 h-12 rounded-lg overflow-hidden border"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
                </div>
              </div>
              <div>
                <label className="block text-gray-500 font-bold mb-1">Biodata / Deskripsi Hidangan</label>
                <textarea rows={2} placeholder="Tulis deskripsi rasa kuliner warisan leluhur..." value={newFood.description} onChange={e => setNewFood({...newFood, description: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 resize-none" />
              </div>
              <button type="submit" className="w-full bg-[#EA580C] text-white font-black py-3 rounded-xl mt-2 shadow-md">Simpan Ke Daftar Menu</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}