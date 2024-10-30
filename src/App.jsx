import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import { useState } from 'react';

function App() {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet context={{ setShowCart, setShowFilters }} />
      </main>
      <ChatBot hideChat={showCart || showFilters} />
      <Footer />
    </div>
  );
}

export default App;
