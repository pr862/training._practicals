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
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/api/auth/login', data),
  
  registerAdmin: (data: { name: string; email: string; password: string }) => 
    api.post('/api/auth/admin/signup', data),
  
  registerUser: (data: { name: string; email: string; password: string }) => 
    api.post('/api/auth/user/signup', data),
};

export const categoryAPI = {
  getAll: () => api.get('/api/admin/categories'),
  getById: (id: number) => api.get(`/api/admin/categories/${id}`),
  create: (data: { name: string }) => api.post('/api/admin/categories', data),
  update: (id: number, data: { name: string }) => api.put(`/api/admin/categories/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/categories/${id}`),
};

export const subcategoryAPI = {
  getAll: () => api.get('/api/admin/subcategories'),
  getById: (id: number) => api.get(`/api/admin/subcategories/${id}`),
  create: (data: { name: string; categoryId: number }) => api.post('/api/admin/subcategories', data),
  update: (id: number, data: { name: string; categoryId: number }) => api.put(`/api/admin/subcategories/${id}`, data),
  delete: (id: number) => api.delete(`/api/admin/subcategories/${id}`),
};

export const productAPI = {
  getAll: () => api.get('/api/admin/products'),
  getById: (id: number) => api.get(`/api/admin/products/${id}`),
  create: async (data: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    subcategoryId: number;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('categoryId', data.categoryId.toString());
    formData.append('subcategoryId', data.subcategoryId.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    return api.post('/api/admin/products', formData, {
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
    return api.put(`/api/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/api/admin/products/${id}`),
};

export const adminUserAPI = {
  getAll: () => api.get('/api/admin/users'),
  getById: (id: number) => api.get(`/api/admin/users/${id}`),
  delete: (id: number) => api.delete(`/api/admin/users/${id}`),
};

export const statsAPI = {
  get: () => api.get('/api/admin/stats'),
};

export const publicAPI = {
  getProducts: (params?: {
    categoryId?: number;
    subcategoryId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => api.get('/api/public/products', { params }),
  
  getProductById: (id: number) => api.get(`/api/public/products/${id}`),
  
  getCategories: () => api.get('/api/public/categories'),
  
  getSubcategories: () => api.get('/api/public/subcategories'),
  
  getSubcategoriesByCategory: (categoryId: number) => 
    api.get(`/api/public/categories/${categoryId}/subcategories`),
  
  getProductsByCategory: (categoryId: number) => 
    api.get(`/api/public/categories/${categoryId}/products`),
  
  getProductsBySubcategory: (subcategoryId: number) => 
    api.get(`/api/public/subcategories/${subcategoryId}/products`),
  
  searchProducts: (params: {
    q: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    limit?: number;
  }) => api.get('/api/public/search', { params }),
};

export const userAPI = {
  getFavorites: () => api.get('/api/user/favorites'),
  
  addFavorite: (productId: number) => api.post(`/api/user/favorites/${productId}`),
  
  removeFavorite: (productId: number) => api.delete(`/api/user/favorites/${productId}`),
  
  checkFavorite: (productId: number) => api.get(`/api/user/favorites/${productId}/check`),
  
  sendFeedback: (data: { subject: string; message: string }) => 
    api.post('/api/user/feedback', data),
};

