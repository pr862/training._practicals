import { Router } from 'express';
import { submitRecipe, updateUserRecipe, adminUpdateStatus, getRecipes, getRecipeDetails } from '../controllers/recipe';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import upload from '../middleware/upload';

const router = Router();
router.get('/public/approved', getRecipes);
router.get('/public/:id', getRecipeDetails);

const recipeUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

router.post('/', authMiddleware, recipeUpload, submitRecipe);
router.put('/:id', authMiddleware, recipeUpload, updateUserRecipe);
router.get('/', authMiddleware, getRecipes);
router.get('/:id', authMiddleware, getRecipeDetails);

router.put('/:id/status', authMiddleware, adminMiddleware, adminUpdateStatus);

export default router;
