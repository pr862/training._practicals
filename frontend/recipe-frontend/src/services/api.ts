import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string, role = "chef") => api.post("/auth/register", { name, email, password, role }),
};

export const recipeAPI = {
  submit: (data: FormData) => api.post("/recipes", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: string, data: FormData) => api.put(`/recipes/${id}`, data),
  myList: (status?: string) => api.get(`/recipes${status ? `?status=${status}` : ""}`),
  details: (id: string) => api.get(`/recipes/${id}`),
};

export const adminRecipeAPI = {
  list: (status?: string) => api.get(`/recipes${status ? `?status=${status}` : ""}`),
  details: (id: string) => api.get(`/recipes/${id}`),
  updateStatus: (id: string, status: string, feedback?: string) => api.put(`/recipes/${id}/status`, { status, feedback }),
};

export const publicRecipeAPI = {
  listApproved: () => api.get("/recipes/public/approved"),
  details: (id: string) => api.get(`/recipes/public/${id}`),
};

export default api;