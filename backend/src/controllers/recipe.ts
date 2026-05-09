import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { RecipeStatus, Recipe } from "../types/recipe";
import { createRecipe, getRecipeById, getAllRecipes, updateRecipeStatus, updateRecipe } from "../repository/recipe";
import { sendStatusUpdateEmail } from "../utils/mail";

const parseJSON = (value: any) => {
  if (typeof value !== "string" || !value.trim()) return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const parseRecipeFields = (body: any) => ({
  ingredients: parseJSON(body.ingredients),
  allergens: parseJSON(body.allergens),
  nutrition: parseJSON(body.nutrition),
});

const normalizeStatus = (status?: string): RecipeStatus | null => {
  if (!status) return null;
  const normalized = status.toString().trim().toLowerCase();
  switch (normalized) {
    case "pending": return RecipeStatus.PENDING;
    case "draft": return RecipeStatus.DRAFT;
    case "approved": return RecipeStatus.APPROVED;
    case "rejected": return RecipeStatus.REJECTED;
    default: return null;
  }
};

const resolveFiles = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  return {
    imagePath: files?.image?.[0]?.path || req.body.image || "",
    videoPath: files?.video?.[0]?.path || req.body.video || "",
  };
};

const validateRecipeData = (body: any, parsedIngredients: any) => {
  if (!body.name?.trim()) return "Name is required";
  if (!body.steps?.trim()) return "Cooking steps are required";
  if (!body.servingSize?.trim()) return "Serving size is required";
  if (!Array.isArray(parsedIngredients) || parsedIngredients.length === 0) {
    return "At least one ingredient is required";
  }
  return null;
};

export const submitRecipe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const parsed = parseRecipeFields(req.body);
    const errorMsg = validateRecipeData(req.body, parsed.ingredients);
    if (errorMsg) return res.status(400).json({ message: errorMsg });

    const { imagePath, videoPath } = resolveFiles(req);

    const newRecipe = await createRecipe({
      ...req.body,
      preparationTime: Number(req.body.preparationTime) || 0,
      ingredients: parsed.ingredients,
      allergens: parsed.allergens || [],
      nutrition: parsed.nutrition || {},
      image: imagePath,
      video: videoPath,
      createdBy: req.user.id,
      createdByEmail: req.user.email,
    });

    return res.status(201).json({ message: "Recipe submitted", recipe: newRecipe });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateUserRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const existing = await getRecipeById(id);
    if (!existing) return res.status(404).json({ message: "Recipe not found" });
    if (existing.createdBy !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const parsed = parseRecipeFields(req.body);
    const { imagePath, videoPath } = resolveFiles(req);

    const recipeData: Partial<Recipe> = {
      ...req.body,
      preparationTime: req.body.preparationTime ? Number(req.body.preparationTime) : undefined,
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : undefined,
      allergens: Array.isArray(parsed.allergens) ? parsed.allergens : undefined,
      nutrition: parsed.nutrition || undefined,
      status: existing.status === RecipeStatus.REJECTED ? RecipeStatus.DRAFT : existing.status,
      image: imagePath || undefined,
      video: videoPath || undefined,
      updatedAt: new Date(),
    };

    const updatedRecipe = await updateRecipe(id, recipeData);
    return res.status(200).json({ message: "Recipe updated", recipe: updatedRecipe });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update recipe" });
  }
};

export const adminUpdateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const normalizedStatus = normalizeStatus(status);

    if (!id) return res.status(400).json({ message: "Recipe ID is required" });
    if (!normalizedStatus) return res.status(400).json({ message: "Invalid status" });

    const updatedRecipe = await updateRecipeStatus(
      id,
      normalizedStatus,
      normalizedStatus === RecipeStatus.APPROVED ? "" : feedback
    );

    if (updatedRecipe.createdByEmail) {
      await sendStatusUpdateEmail(updatedRecipe.createdByEmail, updatedRecipe, normalizedStatus, feedback);
    }

    return res.status(200).json({ message: `Status updated to ${normalizedStatus}`, recipe: updatedRecipe });
  } catch (error: any) {
    return res.status(500).json({ message: "Failed to update status" });
  }
};

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    let status = normalizeStatus(req.query.status as string);
    let createdBy: string | undefined = undefined;

    if (!req.user) {
      status = RecipeStatus.APPROVED;
    } else if (req.user.role !== "admin") {
      createdBy = req.user.id;
    }

    const recipes = await getAllRecipes(status || undefined, createdBy);
    return res.status(200).json({ recipes });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRecipeDetails = async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const isAdmin = req.user?.role === "admin";
    const isCreator = req.user?.id === recipe.createdBy;

    if (!isAdmin && !isCreator && recipe.status !== RecipeStatus.APPROVED) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ recipe });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
