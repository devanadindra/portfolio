import React from 'react';
import { FaTools } from 'react-icons/fa';

export function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">

      <div className="text-center p-8 bg-[#8c2b7a] rounded-xl shadow-2xl max-w-lg w-full">
        
        <FaTools className="text-6xl text-white mx-auto mb-6 animate-pulse" />
        
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Maintenance
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
          Kami sedang melakukan pemeliharaan rutin. 
          Halaman ini akan segera kembali online.
        </p>
        
        <p className="text-sm text-gray-300">
          Terima kasih atas kesabaran Anda. Silakan coba kunjungi lagi dalam beberapa saat.
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-white text-[#8c2b7a] rounded-lg hover:bg-opacity-90 transition"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default Maintenance;