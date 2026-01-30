import axiosClient from '../utils/axiosClient';

export const authAPI = {
  login: async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await axiosClient.post('/auth/register', { 
      username, 
      email, 
      password 
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },
};

export const productAPI = {
  getAll: async (params = {}) => {
    const response = await axiosClient.get('/products', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/products', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },
};

export const orderAPI = {
  getAll: async () => {
    const response = await axiosClient.get('/orders');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axiosClient.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosClient.put(`/orders/${id}/status`, { status });
    return response.data;
  },
};

export const categoryAPI = {
  getAll: async () => {
    const response = await axiosClient.get('/categories');
    return response.data;
  },
};
