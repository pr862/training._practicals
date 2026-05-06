import { emitToast } from './toast';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export const showError = (error: ApiError | string, title?: string) => {
  const msg = typeof error === 'string' ? error : error.message || 'Something went wrong';
  emitToast({
    type: 'error',
    message: title ? `${title}: ${msg}` : msg,
  });
};

export const parseValidationErrors = (error: ApiError): Record<string, string> => {
  if (!error.errors) return {};
  return Object.entries(error.errors).reduce((acc, [field, msgs]) => {
    acc[field] = Array.isArray(msgs) ? msgs[0] : msgs;
    return acc;
  }, {} as Record<string, string>);
};

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

export const addResponseInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.response.use(
    (response: any) => response,
    (error: unknown) => {
      const apiError: ApiError = {
        message: (error as any)?.response?.data?.message || (error as Error)?.message || 'Network error',
        statusCode: (error as any)?.response?.status,
        errors: (error as any)?.response?.data?.errors,
      };

      if (apiError.statusCode === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(apiError);
      }

      if (apiError.statusCode === 403) {
        showError(apiError, 'Access denied');
        return Promise.reject(apiError);
      }

      showError(apiError);
      return Promise.reject(apiError);
    }
  );
};

export const handleApiError = (error: unknown, setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
  const apiError = error as ApiError;
  if (apiError.errors) {
    const validationErrors = parseValidationErrors(apiError);
    setErrors(validationErrors);
  } else {
    showError(apiError);
  }
};
