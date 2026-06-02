'use client';

import { FoodItem } from '@/context/CartContext';

interface DetailModalProps {
  food: FoodItem;
  onClose: () => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (name: string) => void;
  formatRupiah: (number: number) => string;
}

export default function DetailModal({ food, onClose, onToggleFavorite, onAddToCart, formatRupiah }: DetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
        
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 text-gray-700 hover:text-black rounded-full p-2 text-xl font-bold shadow-md z-10 hover:bg-white transition">
          ✕
        </button>

        {/* Gambar Banner Modal */}
        <div className="h-64 w-full bg-gray-200 relative flex-shrink-0">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <span className="bg-orange-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{food.category}</span>
            <h3 className="text-3xl font-extrabold mt-2">{food.name}</h3>
            <p className="text-sm text-gray-300">{food.origin}</p>
          </div>
        </div>

        {/* Isi Konten Detail */}
        <div className="p-6 space-y-6 overflow-y-auto flex-grow">
          
          {/* ================= BIODATA MAKANAN ================= */}
          <div>
            <h4 className="font-bold text-gray-900 text-base mb-3 flex items-center gap-2">
              <span>ℹ️</span> Biodata & Informasi Hidangan
            </h4>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
              <div className="space-y-1">
                <span className="text-gray-400 block text-xs font-medium">Nama Menu</span>
                <span className="font-semibold text-gray-800">{food.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block text-xs font-medium">Kategori Kuliner</span>
                <span className="font-semibold text-gray-800">{food.category}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block text-xs font-medium">Asal Daerah</span>
                <span className="font-semibold text-gray-800">{food.origin}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 block text-xs font-medium">Rating Penikmat</span>
                <span className="font-semibold text-amber-600 flex items-center gap-1">⭐ {food.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Tombol Interaksi Cepat */}
          <div className="bg-orange-50/50 p-3 rounded-xl flex items-center justify-between border border-orange-100/50 text-sm">
            <span className="text-gray-600 font-medium">Suka dengan hidangan ini?</span>
            <button onClick={() => onToggleFavorite(food.id)} className="font-bold text-orange-600 hover:underline flex items-center gap-1">
              {food.isFav ? '❤️ Masuk Favorit' : '🤍 Tambah ke Favorit'}
            </button>
          </div>

          {/* ================= RESEP MAKANAN ================= */}
          <div>
            <h4 className="font-bold text-gray-900 text-base mb-2 flex items-center gap-2">
              <span>📋</span> Komposisi Bahan & Cara Memasak
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm bg-white p-4 rounded-2xl border border-gray-200 whitespace-pre-line shadow-inner">
              {food.recipe}
            </p>
          </div>
        </div>

        {/* Footer Aksi */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-3xl flex-shrink-0">
          <div>
            <span className="block text-xs text-gray-400 font-medium">Harga Per Porsi</span>
            <span className="text-2xl font-black text-gray-900">{formatRupiah(food.price)}</span>
          </div>
          <button onClick={() => { onAddToCart(food.name); onClose(); }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition active:scale-95 shadow-md">
            Pesan Menu Ini
          </button>
        </div>

      </div>
    </div>
  );
}