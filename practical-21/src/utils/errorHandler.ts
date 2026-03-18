// API Response error types
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Show user-friendly error toast
export const showError = (error: ApiError | string, title?: string) => {
  // Using browser alert as toast alternative (react-hot-toast installed)
  const msg = typeof error === 'string' ? error : error.message || 'Something went wrong';
  alert(title ? `${title}: ${msg}` : msg);
};

// Parse backend validation errors
export const parseValidationErrors = (error: ApiError): Record<string, string> => {
  if (!error.errors) return {};
  return Object.entries(error.errors).reduce((acc, [field, msgs]) => {
    acc[field] = Array.isArray(msgs) ? msgs[0] : msgs;
    return acc;
  }, {} as Record<string, string>);
};

// Global axios request interceptor (auth token)
export const addRequestInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error)
  );
};

// Global axios response interceptor (error handling)
export const addResponseInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.response.use(
    (response: any) => response,
    (error: unknown) => {
      const apiError: ApiError = {
        message: (error as any)?.response?.data?.message || (error as Error)?.message || 'Network error',
        statusCode: (error as any)?.response?.status,
        errors: (error as any)?.response?.data?.errors,
      };

      // 401: logout
      if (apiError.statusCode === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(apiError);
      }

      // 403: permission denied
      if (apiError.statusCode === 403) {
        showError(apiError, 'Access denied');
        return Promise.reject(apiError);
      }

      showError(apiError);
      return Promise.reject(apiError);
    }
  );
};

// Handle form submission errors
export const handleApiError = (error: unknown, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
  const apiError = error as ApiError;
  if (apiError.errors) {
    const validationErrors = parseValidationErrors(apiError);
    setErrors(validationErrors);
  } else {
    showError(apiError);
  }
};

