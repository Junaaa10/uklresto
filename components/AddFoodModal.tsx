'use client';

import { useState, useRef } from 'react';
import { FoodItem } from '@/context/CartContext';

interface AddFoodModalProps {
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
}

export default function AddFoodModal({ onClose, onAddFood }: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Makanan Utama');
  const [image, setImage] = useState(''); // Menyimpan string base64 gambar
  const [fileName, setFileName] = useState(''); // Menyimpan nama file yang diupload
  const [recipe, setRecipe] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk menangani upload file dan konversi ke Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Hasil konversi base64 disimpan ke state image
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Jika user tidak upload file, gunakan gambar default nusantara
    const fallbackImage = image.trim() !== '' ? image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop';
    
    const newFood: FoodItem = {
      id: Date.now(),
      name,
      origin,
      price: Number(price),
      rating: 5.0,
      category,
      image: fallbackImage,
      recipe,
      isFav: false
    };

    onAddFood(newFood);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold p-2">✕</button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Tambah Menu Kuliner Baru</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nama Hidangan</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Ayam Bakar Taliwang" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Asal Daerah</label>
              <input type="text" required value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Contoh: Khas Lombok" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Harga (Rp)</label>
              <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Contoh: 35000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kategori Menu</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800 bg-white">
              <option value="Makanan Utama">Makanan Utama</option>
              <option value="Minuman Segar">Minuman Segar</option>
              <option value="Camilan">Camilan Tradisional</option>
            </select>
          </div>

          {/* PERUBAHAN UTAMA: Elemen Input File Gambar Interaktif */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Upload File Gambar</label>
            
            {/* Input asli disembunyikan agar kita bisa membuat tombol custom yang rapi */}
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" 
            />
            
            {/* Tombol pemicu klik file */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 outline-none hover:border-orange-500 cursor-pointer text-sm transition flex items-center justify-between bg-gray-50/50 hover:bg-orange-50/20"
            >
              <span className={`truncate ${fileName ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                {fileName || 'Klik untuk pilih file gambar hidangan...'}
              </span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-lg font-semibold shrink-0">
                Pilih File
              </span>
            </div>
            
            {/* Pratinjau mini gambar jika file berhasil diunggah */}
            {image && (
              <div className="mt-2 flex items-center gap-2">
                <img src={image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                <span className="text-xs text-green-600 font-medium">✓ Gambar berhasil dimuat</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Resep & Cara Penyajian</label>
            <textarea required rows={3} value={recipe} onChange={(e) => setRecipe(e.target.value)} placeholder="Tuliskan bahan pokok utama serta instruksi penyajian..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-800 resize-none" />
          </div>
          
          <div className="pt-4 flex space-x-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition">Batal</button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-700 shadow-md transition">Simpan Menu</button>
          </div>
        </form>
      </div>
    </div>
  );
}