import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
    api.post('/auth/login', data),
  
  registerAdmin: (data: { name: string; email: string; password: string }) => 
    api.post('/auth/admin/signup', data),
  
  registerUser: (data: { name: string; email: string; password: string }) => 
    api.post('/auth/user/signup', data),
};

export const categoryAPI = {
  getAll: () => api.get('/admin/categories'),
  getById: (id: number) => api.get(`/admin/categories/${id}`),
  create: (data: { name: string }) => api.post('/admin/categories', data),
  update: (id: number, data: { name: string }) => api.put(`/admin/categories/${id}`, data),
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
};

export const subcategoryAPI = {
  getAll: () => api.get('/admin/subcategories'),
  getById: (id: number) => api.get(`/admin/subcategories/${id}`),
  create: (data: { name: string; categoryId: number }) => api.post('/admin/subcategories', data),
  update: (id: number, data: { name: string; categoryId: number }) => api.put(`/admin/subcategories/${id}`, data),
  delete: (id: number) => api.delete(`/admin/subcategories/${id}`),
};

export const productAPI = {
  getAll: () => api.get('/admin/products'),
  getById: (id: number) => api.get(`/admin/products/${id}`),
  create: async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    subcategoryId: number;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('categoryId', data.categoryId.toString());
    formData.append('subcategoryId', data.subcategoryId.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    return api.post('/admin/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: async (id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
    subcategoryId?: number;
    image?: File;
  }) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.categoryId !== undefined) formData.append('categoryId', data.categoryId.toString());
    if (data.subcategoryId !== undefined) formData.append('subcategoryId', data.subcategoryId.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    return api.put(`/admin/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

export const adminUserAPI = {
  getAll: () => api.get('/admin/users'),
  getById: (id: number) => api.get(`/admin/users/${id}`),
  delete: (id: number) => api.delete(`/admin/users/${id}`),
};

export const statsAPI = {
  get: () => api.get('/admin/stats'),
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
  }) => api.get('/public/products', { params }),
  
  getProductById: (id: number) => api.get(`/public/products/${id}`),
  
  getCategories: () => api.get('/public/categories'),
  
  getSubcategories: () => api.get('/public/subcategories'),
  
  getSubcategoriesByCategory: (categoryId: number) => 
    api.get(`/public/categories/${categoryId}/subcategories`),
  
  getProductsByCategory: (categoryId: number) => 
    api.get(`/public/categories/${categoryId}/products`),
  
  getProductsBySubcategory: (subcategoryId: number) => 
    api.get(`/public/subcategories/${subcategoryId}/products`),
  
  searchProducts: (params: {
    q: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number;
    limit?: number;
  }) => api.get('/public/search', { params }),
};

export const userAPI = {
  getFavorites: () => api.get('/user/favorites'),
  
  addFavorite: (productId: number) => api.post(`/user/favorites/${productId}`),
  
  removeFavorite: (productId: number) => api.delete(`/user/favorites/${productId}`),
  
  checkFavorite: (productId: number) => api.get(`/user/favorites/${productId}/check`),
};
