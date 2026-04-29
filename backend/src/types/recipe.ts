export enum RecipeStatus {
  PENDING = "Pending",
  DRAFT = "Draft",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  preparationTime?: number;
  cookingTime?: string;
  steps: string;
  image?: string;
  video?: string;
  allergens?: string[];
  nutrition?: any;
  servingSize: number;
  status: RecipeStatus;
  feedback?: string;
  createdBy: string;
  createdByEmail: string;
  createdAt: Date;
  updatedAt: Date;
}