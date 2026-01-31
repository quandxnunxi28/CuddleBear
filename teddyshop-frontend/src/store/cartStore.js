import { create } from 'zustand';
import { cartAPI } from '../api/cartApi';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,

  
  // Lấy cart từ backend
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const items = await cartAPI.getCart();
      set({ cartItems: items || [] });
    } catch (error) {
      set({ error: error.message });
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Thêm sản phẩm vào cart
  addToCart: async (productId, quantity, productName, price, imageUrl) => {
    set({ loading: true, error: null });
    try {
      console.log('cartStore.addToCart called with:', { productId, quantity, productName, price, imageUrl });
      
      const updatedCart = await cartAPI.addToCart(
        productId,
        quantity,
        productName,
        price,
        imageUrl
      );
      
      console.log('Backend response:', updatedCart);
      
      // Refetch cart để chắc chắn dữ liệu mới nhất
      const freshCart = await cartAPI.getCart();
      console.log('Fresh cart after add:', freshCart);
      
      set({ cartItems: freshCart || updatedCart || [], loading: false });
      return true;
    } catch (error) {
      console.error('cartStore.addToCart error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to add to cart';
      set({ error: errorMsg, loading: false });
      console.error('Failed to add to cart:', error);
      return false;
    }
  },

  // Cập nhật số lượng
  updateQuantity: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }
      const updatedCart = await cartAPI.updateQuantity(productId, quantity);
      set({ cartItems: updatedCart || [], loading: false });
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update quantity';
      set({ error: errorMsg, loading: false });
      console.error('Failed to update quantity:', error);
      return false;
    }
  },

  // Xóa sản phẩm
  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      const updatedCart = await cartAPI.removeFromCart(productId);
      set({ cartItems: updatedCart || [], loading: false });
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to remove from cart';
      set({ error: errorMsg, loading: false });
      console.error('Failed to remove from cart:', error);
      return false;
    }
  },

  // Xóa toàn bộ cart
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await cartAPI.clearCart();
      set({ cartItems: [], loading: false });
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to clear cart';
      set({ error: errorMsg, loading: false });
      console.error('Failed to clear cart:', error);
      return false;
    }
  },

  // Getter: Tính tổng số sản phẩm
  getTotalItems: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  },

  // Getter: Tính tổng tiền
  getTotalPrice: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity || 0), 0);
  },
}));
