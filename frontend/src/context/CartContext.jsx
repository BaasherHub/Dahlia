// src/context/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // array of painting objects

  const add = (painting) => {
    setItems((prev) =>
      prev.find((p) => p.id === painting.id) ? prev : [...prev, painting]
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((sum, p) => sum + p.price, 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
