import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Recipe } from "../types/recipe";
import { recipeAPI, publicRecipeAPI, adminRecipeAPI } from "../services/api";

export const useRecipeStore = defineStore("recipe", () => {
  const recipes = ref<Recipe[]>([]);
  const loading = ref(false);
  const error = ref("");
  const filter = ref<"all" | "pending" | "draft" | "approved" | "rejected">("all");

  const filteredRecipes = computed(() => {
    if (filter.value === "all") return recipes.value;
    return recipes.value.filter(
      (r) => r.status.toLowerCase() === filter.value
    );
  });

  const statusCounts = computed(() => ({
    all: recipes.value.length,
    pending: recipes.value.filter((r) => r.status.toLowerCase() === "pending").length,
    draft: recipes.value.filter((r) => r.status.toLowerCase() === "draft").length,
    approved: recipes.value.filter((r) => r.status.toLowerCase() === "approved").length,
    rejected: recipes.value.filter((r) => r.status.toLowerCase() === "rejected").length,
  }));

  const handleError = (msg: string) => {
    error.value = msg;
    console.error(msg);
  };

  async function performFetch(apiCall: () => Promise<any>) {
    loading.value = true;
    try {
      const res = await apiCall();
      recipes.value = res.data.recipes;
    } catch {
      handleError("Failed to fetch recipes");
    } finally {
      loading.value = false;
    }
  }

  const fetchPublicRecipes = () => performFetch(() => publicRecipeAPI.listApproved());
  const fetchMyRecipes = (status?: string) => performFetch(() => recipeAPI.myList(status));
  const fetchAdminRecipes = (status?: string) => performFetch(() => adminRecipeAPI.list(status));

  async function fetchRecipeDetails(id: string) {
    loading.value = true;
    try {
      const res = await publicRecipeAPI.details(id);
      return res.data.recipe;
    } catch {
      handleError("Failed to fetch recipe");
      return null;
    } finally {
      loading.value = false;
    }
  }

  function setFilter(value: typeof filter.value) {
    filter.value = value;
  }

  function clearError() {
    error.value = "";
  }

  return {
    recipes,
    loading,
    error,
    filter,
    filteredRecipes,
    statusCounts,
    fetchPublicRecipes,
    fetchMyRecipes,
    fetchAdminRecipes,
    fetchRecipeDetails,
    setFilter,
    clearError,
  };
});