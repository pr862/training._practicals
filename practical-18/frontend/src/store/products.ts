import { defineStore } from 'pinia';
import { categoryAPI, productAPI } from '@/services';
import type { Category, Product, ProductQuery } from '@/types';

interface ProductsState {
  categories: Category[];
  products: Product[];
  selectedCategory: number | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    categories: [],
    products: [],
    selectedCategory: null,
    loading: false,
    error: null,
    searchQuery: '',
    minPrice: undefined,
    maxPrice: undefined,
  }),

  getters: {
    filteredProducts: (state) => {
      let products = state.products;

      if (state.searchQuery && state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase().trim();
        products = products.filter((product) => product.name.toLowerCase().includes(query));
      }

      if (state.selectedCategory !== null) {
        const selectedId = Number(state.selectedCategory);
        const selectedCategory = state.categories.find((cat) => Number(cat.id) === selectedId);

        if (selectedCategory) {
          if (selectedCategory.parent_id === null) {
            const subcategoryIds = state.categories
              .filter((cat) => Number(cat.parent_id) === selectedId)
              .map((cat) => Number(cat.id));

            products = products.filter((product) => {
              const productCategoryId = Number(product.categoryId);
              return productCategoryId === selectedId || subcategoryIds.includes(productCategoryId);
            });
          } else {
            products = products.filter((product) => Number(product.categoryId) === selectedId);
          }
        }
      }

      if (state.minPrice !== undefined && state.minPrice !== null) {
        products = products.filter((product) => product.price >= state.minPrice!);
      }

      if (state.maxPrice !== undefined && state.maxPrice !== null) {
        products = products.filter((product) => product.price <= state.maxPrice!);
      }

      return products;
    },

    parentCategories: (state) => state.categories.filter((cat) => cat.parent_id === null),

    subcategoriesByParent: (state) =>
      state.categories
        .filter((cat) => cat.parent_id === null)
        .map((parent) => ({
          parent,
          subcategories: state.categories.filter((cat) => Number(cat.parent_id) === Number(parent.id)),
        })),
  },

  actions: {
    async fetchCategories() {
      try {
        this.categories = await categoryAPI.getAll();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        this.error = 'Failed to load categories';
      }
    },

    async fetchProducts(params?: ProductQuery) {
      this.loading = true;
      this.error = null;

      try {
        this.products = await productAPI.getAll(params);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        this.error = 'Failed to load products';
      } finally {
        this.loading = false;
      }
    },

    setSelectedCategory(categoryId: number | null) {
      this.selectedCategory = categoryId !== null ? Number(categoryId) : null;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setPriceRange(min: number | undefined, max: number | undefined) {
      this.minPrice = min;
      this.maxPrice = max;
    },

    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = null;
      this.minPrice = undefined;
      this.maxPrice = undefined;
    },
  },
});
