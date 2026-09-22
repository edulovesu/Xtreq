import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async fetcher, tracks loading/error/data, and re-runs whenever
 * `deps` changes (same rules as useEffect deps). Every resource-specific
 * hook (useDashboardSummary, useRiders, ...) is a thin wrapper around this.
 *
 * @param {() => Promise<any>} fetcher
 * @param {Array} deps
 * @param {object} [opts]
 * @param {boolean} [opts.skip] - don't run the fetcher (e.g. while unauthenticated)
 */
export function useAsync(fetcher, deps, opts = {}) {
  const { skip = false } = opts;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!skip);
  // Bumping this forces a re-run without changing any real dependency.
  const [reloadToken, setReloadToken] = useState(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, reloadToken, ...deps]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { data, loading, error, refetch };
}
