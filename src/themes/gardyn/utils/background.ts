/**
 * Background image helper for SSR-friendly rendering
 * Use this instead of data-bgimage attribute
 */

export interface BackgroundStyleOptions {
    imageUrl: string;
    position?: string;
    size?: 'cover' | 'contain' | 'auto';
    repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
}

/**
 * Generate inline background styles for SSR compatibility
 * @param imageUrl - URL of the background image
 * @param position - Background position (default: 'center')
 * @returns React CSSProperties object
 */
export function getBackgroundStyle(
    imageUrl: string,
    position: string = 'center'
): React.CSSProperties {
    return {
        background: `url(${imageUrl}) ${position}`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    };
}

/**
 * Generate inline background styles with full options
 * @param options - Background style options
 * @returns React CSSProperties object
 */
export function getBackgroundStyleFull(
    options: BackgroundStyleOptions
): React.CSSProperties {
    const { imageUrl, position = 'center', size = 'cover', repeat = 'no-repeat' } = options;

    return {
        background: `url(${imageUrl}) ${position}`,
        backgroundSize: size,
        backgroundRepeat: repeat,
    };
}

/**
 * Process data-bgimage attributes and convert to inline styles
 * Use this for migrating existing HTML with data-bgimage
 * @param dataBgImage - Value from data-bgimage attribute (e.g., "url(image.jpg) center")
 * @returns React CSSProperties object
 */
export function parseDataBgImage(dataBgImage: string): React.CSSProperties {
    // Extract URL and position from data-bgimage format
    const urlMatch = dataBgImage.match(/url\(([^)]+)\)/);
    const url = urlMatch ? urlMatch[1] : '';

    // Extract position (everything after the url)
    const position = dataBgImage.replace(/url\([^)]+\)\s*/, '').trim() || 'center';

    return getBackgroundStyle(url, position);
}
