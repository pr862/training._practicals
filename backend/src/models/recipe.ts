import { db } from "../config/firebase";
import { Recipe, RecipeStatus } from "../types/recipe";

const recipeCollection = db.collection("recipes");

export const createRecipe = async (
  data: Omit<Recipe, "id" | "status" | "createdAt" | "updatedAt">
) => {
  const newRecipe = {
    ...data,
    status: RecipeStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await recipeCollection.add(newRecipe);
  return { id: docRef.id, ...newRecipe };
};

export const getRecipeById = async (id: string) => {
  const doc = await recipeCollection.doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data() as Omit<Recipe, "id">;
  return { id: doc.id, ...data };
};

export const getAllRecipes = async (status?: RecipeStatus, createdBy?: string) => {
  let query: FirebaseFirestore.Query = recipeCollection;
  if (status) query = query.where("status", "==", status);
  if (createdBy) query = query.where("createdBy", "==", createdBy);

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Recipe, "id">;
    return { id: doc.id, ...data };
  });
};

export const updateRecipeStatus = async (
  id: string,
  status: RecipeStatus,
  feedback?: string
) => {
  const updatedData: Partial<Recipe> = { status, updatedAt: new Date() };
  if (feedback) updatedData.feedback = feedback;

  const docRef = recipeCollection.doc(id);
  await docRef.update(updatedData);
  return getRecipeById(id) as Promise<Recipe>;
};

export const updateRecipe = async (
  id: string,
  data: Partial<Omit<Recipe, "id" | "createdAt" | "updatedAt">>
) => {
  const updatedData = { ...data, updatedAt: new Date() };
  const docRef = recipeCollection.doc(id);
  await docRef.update(updatedData);
  return getRecipeById(id) as Promise<Recipe>;
};
