import { useEffect, useState } from 'react';

export function useAsync(asyncFunction, immediate = true) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!immediate) return;
    let active = true;

    const run = async () => {
      try {
        setLoading(true);
        const result = await asyncFunction();
        if (active) setData(result);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [asyncFunction, immediate]);

  return { data, error, loading };
}
