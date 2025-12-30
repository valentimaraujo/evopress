import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Hook para controlar mega menu e submenus
 * Suporta hover em desktop e click em mobile
 */
export function useMegaMenu() {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Detect mobile/desktop
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1200);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const handleMouseEnter = useCallback((menuId: string) => {
        if (!isMobile) {
            setOpenMenuId(menuId);
        }
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        if (!isMobile) {
            setOpenMenuId(null);
        }
    }, [isMobile]);

    const handleClick = useCallback((menuId: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
        }

        if (isMobile) {
            setOpenMenuId((prev) => (prev === menuId ? null : menuId));
        }
    }, [isMobile]);

    const closeMenu = useCallback(() => {
        setOpenMenuId(null);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        if (openMenuId) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId, closeMenu]);

    const isOpen = useCallback((menuId: string) => {
        return openMenuId === menuId;
    }, [openMenuId]);

    return {
        openMenuId,
        menuRef,
        isMobile,
        handleMouseEnter,
        handleMouseLeave,
        handleClick,
        closeMenu,
        isOpen,
    };
}
