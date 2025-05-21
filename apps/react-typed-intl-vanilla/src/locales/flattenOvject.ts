import type { FlattenObject } from "../types/utilityTypes";

export function flattenObject<T>(obj: T, parentKey: string = ''): FlattenObject<T> {
    let flatObject: Record<string, any> = {};
    for (let key in obj) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            Object.assign(flatObject, flattenObject(obj[key], fullKey));
        } else {
            flatObject[fullKey] = obj[key];
        }
    }
    return flatObject as FlattenObject<T>;
}