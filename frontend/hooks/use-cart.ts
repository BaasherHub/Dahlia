"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";

export interface CartItem {
  paintingId: string;
  title: string;
  image: string;
  type: "original" | "print";
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (paintingId: string, type: "original" | "print") => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) =>
            item.paintingId === data.paintingId && item.type === data.type
        );
        if (existingItem) {
          return toast("Item already in cart.");
        }
        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      removeItem: (paintingId: string, type: "original" | "print") => {
        set({
          items: [
            ...get().items.filter(
              (item) =>
                !(item.paintingId === paintingId && item.type === type)
            ),
          ],
        });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "dahlia-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
