import { useEffect, useState } from 'react';

/** Retorna o valor após `ms` sem mudanças — usado nas buscas. */
export function useDebounce<T>(value: T, ms = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}
