const PREFIX = "arrayconnection:";

export function idToCursor(id: number): string {
    return offsetToCursor(id - 1);
}

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset: number): string {
    return base64(PREFIX + offset.toString());
}

/**
 * Extracts the offset from the cursor string.
 */
export function cursorToOffset(cursor: string): number {
    return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

function base64(str: string): string {
    return btoa(str);
}

function unbase64(str: string): string {
    return atob(str);
}
