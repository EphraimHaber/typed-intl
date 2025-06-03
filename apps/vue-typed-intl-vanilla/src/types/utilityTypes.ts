export type Merge<T> = {
    [K in keyof T]: T[K];
};

export type HasKeys<T> = keyof T extends never ? false : true;

export type FlattenKeys<T> = T extends object
    ? { [K in keyof T]: K extends string
        ? T[K] extends object
        ? `${K}.${FlattenKeys<T[K]>}`
        : K
        : never
    }[keyof T]
    : never;

export type NestedPropertyType<T, Path extends FlattenKeys<T>> =
    Path extends `${infer FirstKey}.${infer RemainingPath}`
    ? FirstKey extends keyof T
    ? RemainingPath extends FlattenKeys<T[FirstKey]> // Check if RemainingPath is a valid flattened key for the sub-object
    ? NestedPropertyType<T[FirstKey], RemainingPath>
    : never
    : never
    : Path extends keyof T
    ? T[Path]
    : never;

export type FlattenObject<T> = {
    [P in FlattenKeys<T>]: NestedPropertyType<T, P>
};

export type CombineIntersections<T> = {
    [K in keyof T]: T[K] extends infer O ? { [P in keyof O]: O[P] } : never;
};

export type UnionToIntersection<U> =
    (U extends any ? (x: U) => void : never) extends (x: infer I) => void
    ? I
    : never;

export type UnionLast<U> =
    UnionToIntersection<U extends any ? () => U : never> extends () => infer R
    ? R
    : never;