 import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stylesphere-4qp1.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/api/auth/login', data),
  
  registerAdmin: (data: { name: string; email: string; password: string }) => 
    api.post('/api/auth/signup', { ...data, role: 'admin' }),
  
  registerUser: (data: { name: string; email: string; password: string }) => 
    api.post('/api/auth/signup', { ...data, role: 'user' }),
};

export const categoryAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id: number) => api.get(`/api/categories/${id}`),
  create: (data: { name: string }) => api.post('/api/categories', data),
  update: (id: number, data: { name: string }) => api.put(`/api/categories/${id}`, data),
  delete: (id: number) => api.delete(`/api/categories/${id}`),
};

export const subcategoryAPI = {
  getByCategory: (categoryId: number) => 
    api.get(`/api/categories/${categoryId}/subcategories`),
  
  getAll: async () => {
    const response = await api.get('/api/categories');
    const allCategories = response.data;
    return {
      data: allCategories.filter((cat: any) => cat.parent_id !== null)
    };
  },
  
  getById: (id: number) => api.get(`/api/categories/${id}`),
  
  create: (data: { name: string; categoryId: number }) => 
    api.post('/api/categories', { name: data.name, parent_id: data.categoryId }),
  
  update: (id: number, data: { name: string; categoryId: number }) => 
    api.put(`/api/categories/${id}`, { name: data.name, parent_id: data.categoryId }),
  
  delete: (id: number) => api.delete(`/api/categories/${id}`),
};

export const productAPI = {
  getAll: (params?: {
    search?: string;
    categoryId?: number;
    subcategoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return api.get('/api/products', { params });
  },
  getById: (id: number) => api.get(`/api/products/${id}`),
  create: async (data: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    subcategoryId?: number;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('categoryId', data.categoryId.toString());
    if (data.subcategoryId) {
      formData.append('subcategoryId', data.subcategoryId.toString());
    }
    if (data.image) {
      formData.append('image', data.image);
    }
    return api.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: async (id: number, data: {
    name?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
    subcategoryId?: number;
    image?: File;
  }) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId.toString());
    if (data.subcategoryId !== undefined) formData.append('subcategoryId', data.subcategoryId.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    return api.put(`/api/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/api/products/${id}`),
};

export const adminUserAPI = {
  getAll: () => api.get('/api/admin/users'),
  getById: (id: number) => api.get(`/api/admin/users/${id}`),
  delete: (id: number) => api.delete(`/api/admin/users/${id}`),
};

export const statsAPI = {
  get: () => api.get('/api/admin/analytics'),
};

export const userAPI = {
  getFavorites: () => api.get('/api/user/favorites'),
  
  addFavorite: (productId: number) => api.post(`/api/user/favorites/${productId}`),
  
  removeFavorite: (productId: number) => api.delete(`/api/user/favorites/${productId}`),
  
  checkFavorite: (productId: number) => api.get(`/api/user/favorites/${productId}/check`),
  
  sendFeedback: (data: { subject: string; message: string }) => 
    api.post('/api/user/feedback', data),
};

