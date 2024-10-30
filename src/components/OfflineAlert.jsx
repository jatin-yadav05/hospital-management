import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function OfflineAlert() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50"
        >
          You are currently offline. Some features may be unavailable.
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfflineAlert; 