import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

function ChatBot({ hideChat }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Hide chat when cart or filters are open
  useEffect(() => {
    if (hideChat) {
      setIsOpen(false);
    }
  }, [hideChat]);

  if (hideChat) return null; // Don't render if hideChat is true

  return (
    <div className={`fixed ${isMobile ? 'bottom-0 right-0 left-0' : 'bottom-6 right-6'} z-40`}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`
              bg-white shadow-xl overflow-hidden
              ${isMobile 
                ? 'w-full h-[80vh] rounded-t-lg' 
                : 'w-[380px] sm:w-[400px] rounded-lg'
              }
            `}
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-medium flex items-center">
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                Healthcare Assistant
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label="Close chat"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Interface */}
            <div className={`${isMobile ? 'h-full' : 'h-[600px]'} w-full`}>
              <iframe
                src="https://www.chatbase.co/chatbot-iframe/nCvWGJAY3TDgzNyMD4sm6"
                width="100%"
                height="100%"
                frameBorder="0"
                className="w-full h-full"
                title="Healthcare Chatbot"
              ></iframe>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`
              bg-blue-600 text-white shadow-lg hover:bg-blue-700 
              transition-colors duration-200
              ${isMobile 
                ? 'w-full py-4 rounded-t-lg flex items-center justify-center space-x-2' 
                : 'p-4 rounded-full'
              }
            `}
            aria-label="Open chat"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
            {isMobile && <span className="font-medium">Chat with us</span>}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatBot; 