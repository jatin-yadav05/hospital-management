import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import ProductCard from '../components/store/ProductCard';
import CartSidebar from '../components/store/CartSidebar';
import ProductFilters from '../components/store/ProductFilters';
import { useCart } from '../context/CartContext';
import ChatBot from '../components/ChatBot';

function MediStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  const { currentUser } = useAuth();
  const { cart, addToCart } = useCart();

  const categories = [
    'all',
    'prescription',
    'over-the-counter',
    'vitamins',
    'personal care',
    'first aid',
    'baby care',
    'health devices'
  ];

  // Fetch medicines from Firestore
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const medicinesRef = collection(db, 'medicines');
        const medicinesSnapshot = await getDocs(medicinesRef);
        const medicinesData = medicinesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(medicinesData);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setError('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      setShowCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MediStore</h1>
            <p className="mt-2 text-gray-500">Find and order your medications easily</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <AdjustmentsHorizontalIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        <ChatBot hideChat={showCart || showFilters} />

        <CartSidebar
          isOpen={showCart}
          onClose={() => setShowCart(false)}
        />

        <ProductFilters
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />
      </div>
    </div>
  );
}

export default MediStore; 