"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useFilterParams(basePath: string, filterKeys: string[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${basePath}?${params.toString()}`);
    },
    [router, searchParams, basePath]
  );

  const clearFilters = useCallback(() => {
    // Preserve non-filter params (like "view")
    const params = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (!filterKeys.includes(key)) {
        params.set(key, value);
      }
    }
    router.push(`${basePath}?${params.toString()}`);
  }, [router, searchParams, basePath, filterKeys]);

  const hasFilters = useMemo(
    () => filterKeys.some((key) => searchParams.has(key)),
    [searchParams, filterKeys]
  );

  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  return { setFilter, clearFilters, hasFilters, getParam, searchParams };
}
