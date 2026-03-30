import type { ApiResponse } from '../types/api';

export const unwrapApiList = <T>(payload: unknown): { items: T[]; message?: string; ok: boolean } => {
  if (Array.isArray(payload)) {
    return { items: payload as T[], ok: true };
  }

  if (payload && typeof payload === 'object') {
    const data = (payload as ApiResponse<unknown>).data;
    const message = (payload as ApiResponse<unknown>).message;
    const success = (payload as ApiResponse<unknown>).success;

    if (Array.isArray(data)) {
      return { items: data as T[], message, ok: Boolean(success) };
    }
  }

  return { items: [], ok: false };
};
