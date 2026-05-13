export enum RecipeStatus {
  PENDING = "Pending",
  DRAFT = "Draft", 
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface RecipeIngredient {
  name: string
  portion?: string
  quantity?: string
}

export interface RecipeNutrition {
  calories?: number 
  protein?: number
  carbs?: number
  fat?: number
}

export interface Recipe {
  id: string
  name: string
  status: RecipeStatus
  description?: string
  servingSize: number
  preparationTime?: string
  cookingTime?: string
  video?: string
  image?: string
  ingredients?: RecipeIngredient[]
  nutrition?: RecipeNutrition
  allergens?: string[]
  feedback?: string
  createdByEmail?: string
  createdAt: string;
  updatedAt: Date;
  steps?: string;
}
