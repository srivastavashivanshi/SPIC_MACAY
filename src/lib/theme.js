import { useCallback, useEffect, useState } from 'react';

// 'auto' follows the device; 'light' / 'dark' are the reader's choice, remembered per browser.
const read = () => {
  try {
    const t = localStorage.getItem('theme');
    return t === 'light' || t === 'dark' ? t : 'auto';
  } catch {
    return 'auto';
  }
};

export function useTheme() {
  const [theme, setTheme] = useState(read);
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    try {
      if (theme === 'auto') localStorage.removeItem('theme');
      else localStorage.setItem('theme', theme);
    } catch {
      /* storage blocked: the choice lasts for this visit */
    }
  }, [theme]);
  const cycle = useCallback(() => setTheme((t) => (t === 'auto' ? 'light' : t === 'light' ? 'dark' : 'auto')), []);
  return { theme, cycle };
}
