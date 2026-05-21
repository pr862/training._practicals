import { useState } from "react";

export function useImageFallback(src?: string) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  return {
    hasError: Boolean(src && failedSrc === src),
    handleError: () => setFailedSrc(src ?? null),
  };
}
