import { useEffect, useState } from 'react';

/**
 * Hook para detectar scroll e aplicar classe sticky no header
 * Baseado em designesia.js (linhas 44-59)
 */
export function useHeaderSticky(threshold: number = 50) {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop >= threshold);
        };

        // Check initial state
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return isSticky;
}
