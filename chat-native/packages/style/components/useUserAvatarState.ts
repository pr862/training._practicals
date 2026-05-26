import { useEffect, useState } from "react";

export function useUserAvatarState(image?: string) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [image]);

  return {
    hasError,
    handleImageError: () => setHasError(true),
  };
}
