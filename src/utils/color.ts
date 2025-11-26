/**
 * Returns either black or white, depending on which color contrasts
 * more with the given background color.
 */
export function textColorForBackground(color: string): string {
    color = color.replace('#', '');
    const red = parseInt(color.slice(0, 2), 16);
    const green = parseInt(color.slice(2, 4), 16);
    const blue = parseInt(color.slice(4, 6), 16);

    const lum = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

    return lum > 0.5 ? '#000000' : '#ffffff';
}