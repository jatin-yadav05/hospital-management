import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch cart from Firestore when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) {
        setCart([]);
        setLoading(false);
        return;
      }

      try {
        const cartDoc = await getDoc(doc(db, 'carts', currentUser.uid));
        if (cartDoc.exists()) {
          setCart(cartDoc.data().items || []);
        } else {
          // Initialize empty cart for new users
          await setDoc(doc(db, 'carts', currentUser.uid), {
            items: [],
            updatedAt: serverTimestamp()
          });
          setCart([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  // Save cart to Firestore whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (!currentUser) return;

      try {
        await setDoc(doc(db, 'carts', currentUser.uid), {
          items: cart,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    if (!loading) {
      saveCart();
    }
  }, [cart, currentUser, loading]);

  // Add this function to calculate total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Update addToCart function
  const addToCart = async (product) => {
    if (!currentUser) return;

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      };

      const existingCart = cart;
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);

      let updatedCart;
      if (existingItemIndex >= 0) {
        updatedCart = existingCart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...existingCart, newItem];
      }

      await setDoc(cartRef, {
        items: updatedCart,
        updatedAt: serverTimestamp()
      });

      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Update updateQuantity function
  const updateQuantity = async (productId, newQuantity) => {
    if (!currentUser) return;

    try {
      const cartRef = doc(db, 'carts', currentUser.uid);
      let updatedCart;

      if (newQuantity <= 0) {
        updatedCart = cart.filter(item => item.id !== productId);
      } else {
        updatedCart = cart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }

      await setDoc(cartRef, {
        items: updatedCart,
        updatedAt: serverTimestamp()
      });

      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 