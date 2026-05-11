import { createRouter, createWebHistory } from 'vue-router'
import { UserRole } from '../types/user'

const routes = [
  { path: "/", name: 'home', component: () => import('../pages/Public/Home.vue') },
  { path: '/recipe/:id', name: 'PublicRecipeDetail', component: () => import('../pages/RecipeDetail.vue'),props: { role: UserRole.PUBLIC } },
  
  { path: '/login', name: 'Login', component: () => import('../pages/Auth/login.vue') },
  { path: '/register', name: 'Register', component: () => import('../pages/Auth/register.vue') },
  
  { 
    path: '/chef', 
    children: [
      { path: 'dashboard', name: 'ChefDashboard', component: () => import('../pages/Chef/Dashboard.vue') },
      { path: 'submit', name: 'SubmitRecipe', component: () => import('../pages/Chef/SubmitRecipe.vue') },
      { path: 'recipes/:id', name: 'ChefRecipeDetail', component: () => import('../pages/RecipeDetail.vue'), props: { role: UserRole.CHEF } },
    ]
  },
  
  {
    path: '/admin',
    children:[
      { path:'dashboard', name: 'adminDashboard', component: () => import('../pages/admin/Dashboard.vue')  },
      { path: 'recipe/:id', name: 'AdminRecipeDetail', component: () => import('../pages/RecipeDetail.vue'), props: { role: UserRole.ADMIN } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const publicRouteNames = ['home', 'PublicRecipeDetail', 'Login', 'Register']
  const isPublic = publicRouteNames.includes(to.name as string)

  if (!isPublic && !token) {
    return { name: 'Login' }
  }
})

export default router