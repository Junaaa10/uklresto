'use client';

import { FoodItem } from '@/context/CartContext';

interface FoodCardProps {
  food: FoodItem;
  onOpenModal: () => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (name: string) => void;
  formatRupiah: (number: number) => string;
}

export default function FoodCard({ food, onOpenModal, onToggleFavorite, onAddToCart, formatRupiah }: FoodCardProps) {
  return (
    <div 
      onClick={onOpenModal} // <--- SEKARANG SELURUH KARTU BISA DIKLIK UNTUK BUKA MODAL
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      {/* Area Gambar */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Tombol Favorit (Gunakan e.stopPropagation agar modal tidak ikut terbuka saat icon diklik) */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleFavorite(food.id); 
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition active:scale-90 z-10"
        >
          <span className="text-xl">{food.isFav ? '❤️' : '🤍'}</span>
        </button>
        
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md font-medium">
          {food.category}
        </span>
      </div>

      {/* Area Konten Informasi */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-400">{food.origin}</span>
            <div className="flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-md">
              <span className="text-amber-500 text-xs">★</span>
              <span className="text-xs font-bold text-amber-800">{food.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
            {food.name}
          </h4>
          
          <span className="text-xs font-semibold text-orange-600 group-hover:underline mb-4 block text-left">
            Klik untuk detail & resep 📖
          </span>
        </div>

        {/* Tombol Tambah (Gunakan e.stopPropagation agar modal tidak ikut terbuka saat klik pesan) */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-lg font-black text-gray-900">{formatRupiah(food.price)}</span>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAddToCart(food.name); 
            }} 
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition active:scale-95 shadow-md z-10"
          >
            + Tambah
          </button>
        </div>
      </div>
    </div>
  );
}