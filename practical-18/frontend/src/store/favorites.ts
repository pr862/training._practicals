import { defineStore } from 'pinia';
import { userAPI } from '@/services/users';
import type { Product } from '@/types';

interface FavoritesState {
  favorites: Product[];
  favoriteIds: Set<number>;
  loading: boolean;
  error: string | null;
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): FavoritesState => ({
    favorites: [],
    favoriteIds: new Set(),
    loading: false,
    error: null,
  }),

  getters: {
    isFavorite: (state) => (productId: number) => state.favoriteIds.has(productId),
    favoriteCount: (state) => state.favorites.length,
  },

  actions: {
    async fetchFavorites() {
      this.loading = true;
      this.error = null;

      try {
        this.favorites = await userAPI.getFavorites();
        this.favoriteIds = new Set(this.favorites.map((p) => p.id));
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to load favorites';
      } finally {
        this.loading = false;
      }
    },

    async addFavorite(productId: number) {
      this.loading = true;
      this.error = null;

      try {
        await userAPI.addFavorite(productId);
        this.favoriteIds.add(productId);
        await this.fetchFavorites();
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to add favorite';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async removeFavorite(productId: number) {
      this.loading = true;
      this.error = null;

      try {
        await userAPI.removeFavorite(productId);
        this.favoriteIds.delete(productId);
        this.favorites = this.favorites.filter((p) => p.id !== productId);
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to remove favorite';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(productId: number) {
      if (this.favoriteIds.has(productId)) {
        return await this.removeFavorite(productId);
      }
      return await this.addFavorite(productId);
    },

    async checkFavorite(productId: number) {
      try {
        const isFavorited = await userAPI.checkFavorite(productId);
        if (isFavorited) {
          this.favoriteIds.add(productId);
        }
        return isFavorited;
      } catch (error) {
        return false;
      }
    },

    clearFavorites() {
      this.favorites = [];
      this.favoriteIds = new Set();
    },
  },
});
