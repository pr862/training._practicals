
import { defineStore } from 'pinia';
import { categoryAPI, subcategoryAPI, productAPI } from '../services/api';

interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  Category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: number;
  subcategoryId: number;
  Category?: Category;
  Subcategory?: Subcategory;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsState {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  selectedCategory: number | null;
  selectedSubcategory: number | null;
  loading: boolean;
  error: string | null;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    categories: [],
    subcategories: [],
    products: [],
    selectedCategory: null,
    selectedSubcategory: null,
    loading: false,
    error: null,
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = state.products;
      
      if (state.selectedCategory) {
        filtered = filtered.filter(p => p.categoryId === state.selectedCategory);
      }
      
      if (state.selectedSubcategory) {
        filtered = filtered.filter(p => p.subcategoryId === state.selectedSubcategory);
      }
      
      return filtered;
    },
    
    getSubcategoriesByCategory: (state) => (categoryId: number) => {
      return state.subcategories.filter(s => s.categoryId === categoryId);
    },
  },

  actions: {
    async fetchCategories() {
      try {
        const response = await categoryAPI.getAll();
        this.categories = response.data.filter((cat: any) => !cat.parent_id);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.error = 'Failed to load categories';
      }
    },

    async fetchSubcategories() {
      try {
        const response = await subcategoryAPI.getAll();
        this.subcategories = response.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          categoryId: cat.parent_id,
          Category: cat.Category,
        }));
      } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        this.error = 'Failed to load subcategories';
      }
    },

    async fetchProducts(filters?: {
      categoryId?: number;
      subcategoryId?: number;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: string;
    }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await productAPI.getAll(filters);
        this.products = response.data;
      } catch (error) {
        console.error('Failed to fetch products:', error);
        this.error = 'Failed to load products';
      } finally {
        this.loading = false;
      }
    },

    setSelectedCategory(categoryId: number | null) {
      this.selectedCategory = categoryId;
      this.selectedSubcategory = null;
    },

    setSelectedSubcategory(subcategoryId: number | null) {
      this.selectedSubcategory = subcategoryId;
    },
  },
});

