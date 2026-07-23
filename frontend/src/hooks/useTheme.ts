import { useEffect, useState } from 'react';

type Tema = 'light' | 'dark';
const KEY = 'agora:tema';

export function useTheme() {
  const [tema, setTema] = useState<Tema>(() => {
    const salvo = (typeof localStorage !== 'undefined' && localStorage.getItem(KEY)) as Tema | null;
    if (salvo) return salvo;
    return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    try {
      localStorage.setItem(KEY, tema);
    } catch {
      /* noop */
    }
  }, [tema]);

  return { tema, alternar: () => setTema((t) => (t === 'light' ? 'dark' : 'light')) };
}
