import { tokenStorage } from '../lib/storage';

const getApiBaseUrl = (): string => 
  import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:3000/api';

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

const buildUrl = (path: string): string => {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
};

const toApiError = async (res: Response): Promise<ApiError> => {
  let details: unknown = undefined;
  try {
    details = await res.json();
  } catch {
  }
  const message =
    (details as any)?.message ||
    `Request failed (${res.status} ${res.statusText || 'Error'})`;
  return { status: res.status, message, details };
};

export const api = {
  async json<TResponse>(
    path: string,
    options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
  ): Promise<TResponse> {
    const token = tokenStorage.get();
    const res = await fetch(buildUrl(path), {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    if (!res.ok) throw await toApiError(res);
    return (await res.json()) as TResponse;
  },

  async form<TResponse>(path: string, formData: FormData, options: RequestInit = {}): Promise<TResponse> {
    const token = tokenStorage.get();
    const res = await fetch(buildUrl(path), {
      ...options,
      method: options.method ?? 'POST',
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) throw await toApiError(res);
    return (await res.json()) as TResponse;
  },
};

