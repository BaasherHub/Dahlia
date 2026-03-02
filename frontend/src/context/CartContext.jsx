import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (painting) => {
    setItems((prev) =>
      prev.find((p) => p.id === painting.id && p.selectedVersion === painting.selectedVersion)
        ? prev : [...prev, painting]
    );
  };

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));
  const clear = () => setItems([]);
  const total = items.reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
