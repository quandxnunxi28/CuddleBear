import cartAxiosClient from '../utils/cartAxiosClient';

export const cartAPI = {
  // Lấy danh sách items trong cart
  getCart: async () => {
    try {
      const response = await cartAxiosClient.get('/cart');
      return response.data || [];
    } catch (error) {
      console.error('Get cart error:', error);
      return [];
    }
  },

  // Thêm sản phẩm vào cart
  addToCart: async (productId, quantity, productName, price, imageUrl) => {
    try {
      console.log('cartAPI.addToCart called with:', { productId, quantity, productName, price, imageUrl });
      
      const response = await cartAxiosClient.post('/cart/add', {
        productId,
        quantity,
        productName,
        price,
        imageUrl,
      });
      
      console.log('cartAPI.addToCart response:', response);
      return response.data || [];
    } catch (error) {
      console.error('cartAPI.addToCart error:', error);
      throw error;
    }
  },

  // Cập nhật số lượng sản phẩm
  updateQuantity: async (productId, quantity) => {
    const response = await cartAxiosClient.put('/cart/update', {}, {
      params: {
        productId,
        quantity,
      },
    });
    return response.data || [];
  },

  // Xóa sản phẩm khỏi cart
  removeFromCart: async (productId) => {
    const response = await cartAxiosClient.delete(`/cart/remove/${productId}`);
    return response.data || [];
  },

  // Xóa toàn bộ cart
  clearCart: async () => {
    const response = await cartAxiosClient.delete('/cart/clear');
    return response.data || [];
  },
};
