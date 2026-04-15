/**
 * Wrapper around the built-in structured clone. Uses `JSON.parse(JSON.stringify(...))`
 * as a fallback.
 */
declare function structuredClone_2<T>(obj: T): T;
export { structuredClone_2 as structuredClone }

export { }
