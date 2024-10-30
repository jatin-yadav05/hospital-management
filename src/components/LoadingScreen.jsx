import React from 'react';
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center min-h-screen min-w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center flex flex-col items-center justify-center"
      >
        <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
        <h2 className="text-2xl font-bold text-blue-600">MediCare</h2>
        <p className="text-gray-500 mt-2">Loading your healthcare experience...</p>
      </motion.div>
    </div>
  );
}

export default LoadingScreen; 