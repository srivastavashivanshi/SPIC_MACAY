import { useEffect } from 'react';

const SITE = 'SPIC MACAY · IIM Lucknow';

// Sets the browser tab title for the current page.
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} — India's living heritage`;
  }, [title]);
}
