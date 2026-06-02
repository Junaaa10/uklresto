export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h3 className="text-xl font-bold mb-4">RasaNusantara</h3>
        <p className="text-gray-400">Menyajikan cita rasa otentik Indonesia dengan bahan berkualitas.</p>
        <div className="mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} RasaNusantara. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}