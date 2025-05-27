import { useState, useCallback } from "react";
import type { ApiError } from "../types/api.types";
import type { LoadingState } from "../types/common.types";

interface UseApiState<T> {
  data: T | null;
  loading: LoadingState;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: "idle",
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setState((prev) => ({ ...prev, loading: "loading", error: null }));

        const result = await apiFunction(...args);

        setState({
          data: result,
          loading: "success",
          error: null,
        });

        return result;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({
          ...prev,
          loading: "error",
          error: apiError,
        }));

        console.error("API Error:", apiError);
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: "idle",
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
