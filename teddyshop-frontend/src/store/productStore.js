import { create } from 'zustand';

export const useProductStore = create((set) => ({
  products: [],
  cart: [],
  
  setProducts: (products) => set({ products }),
  
  addToCart: (product) => set((state) => ({
    cart: [...state.cart, product],
  })),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== productId),
  })),
  
  clearCart: () => set({ cart: [] }),
}));
