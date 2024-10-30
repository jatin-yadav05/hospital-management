import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineAlert from './components/OfflineAlert';
import LoadingScreen from './components/LoadingScreen';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <OfflineAlert />
        <Navbar />
        <main className="flex-grow">
          <Outlet context={{ setShowCart, setShowFilters }} />
        </main>
        <ChatBot hideChat={showCart || showFilters} />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
