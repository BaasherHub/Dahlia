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
    setItems(prev => [...prev, item]);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const clear = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    return { items: [], addItem: () => {}, removeItem: () => {}, clear: () => {}, total: 0 };
  }
  return context;
}
