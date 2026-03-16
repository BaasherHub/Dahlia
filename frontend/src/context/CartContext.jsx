import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dahlia-cart')) || []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('dahlia-cart', JSON.stringify(items))
  }, [items])

  const addItem = (painting) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === painting.id)
      if (exists) return prev
      return [...prev, { ...painting, quantity: 1 }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
