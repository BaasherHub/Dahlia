import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    // Prevent duplicate originals (one-of-a-kind paintings)
    if (item.selectedVersion === 'original') {
      const alreadyInCart = items.some(
        (i) => i.id === item.id && i.selectedVersion === 'original'
      );
      if (alreadyInCart) return false;
    }
    setItems((prev) => [...prev, { ...item, quantity: item.quantity || 1 }]);
    return true;
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx === -1) return prev;
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clear = () => {
    setItems([]);
  };

  // Alias for backwards compat
  const clearCart = clear;

  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return {
      items: [],
      addItem: () => false,
      removeItem: () => {},
      updateQuantity: () => {},
      clear: () => {},
      clearCart: () => {},
      total: 0,
    };
  }
  return context;
}
