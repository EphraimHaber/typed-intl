import type { ReactNode } from "react";

export type Merge<T> = {
    [K in keyof T]: T[K];
};

export type HasKeys<T> = keyof T extends never ? false : true;

export type HasProperties<T, P extends PropertyKey> = {
    [K in P]: K extends keyof T ? true : false
}[P] extends true ? true : false;

export type ExtractPlaceholders<T extends string> =
    T extends `${infer _Start}{${infer Key}}${infer Rest}`
    ? Key | ExtractPlaceholders<Rest>
    : never;

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

type CombineIntersections<T> = {
    [K in keyof T]: T[K] extends infer O ? { [P in keyof O]: O[P] } : never;
};

type ExtractVariableAndType<T extends string> = T extends `{${infer Var}, ${infer Type}}`
    ? [Var, Type extends 'number' ? number : ReactNode]
    : T extends `{${infer Var}}`
    ? [Var, ReactNode]
    : never;

type FormatXMLElementFn<T extends ReactNode, R extends ReactNode> = (parts: T[]) => R;
export type TagType = FormatXMLElementFn<ReactNode, ReactNode>;

type ExtractTags<T extends string> = T extends `<${infer TagName}>`
    ? TagName extends `/${infer _}` | `${infer _}/` ? never : [TagName, TagType] // exclude closing and self-closing tags e.g., <br />, <br     >
    : never;

type SplitVariables<T extends string, Acc = {}> = T extends `${infer _Prefix}{${infer Var}}${infer Suffix}`
    ? SplitVariables<Suffix, Acc & { [K in ExtractVariableAndType<`{${Var}}`>[0]]: ExtractVariableAndType<`{${Var}}`>[1] }>
    : T extends `${infer _Prefix}{${infer Var}, ${infer Type}}${infer Suffix}`
    ? SplitVariables<Suffix, Acc & { [K in ExtractVariableAndType<`{${Var}, ${Type}}`>[0]]: ExtractVariableAndType<`{${Var}, ${Type}}`>[1] }>
    : Acc;

type SplitTags<T extends string, Acc = {}> = T extends `${infer _Prefix}<${infer Var}>${infer Suffix}`
    ? SplitTags<Suffix, Acc & { [K in ExtractTags<`<${Var}>`>[0]]: ExtractTags<`<${Var}>`>[1] }>
    : T extends `${infer _Prefix}<${infer Var}>${infer Suffix}`
    ? SplitTags<Suffix, Acc & { [K in ExtractTags<`<${Var}>`>[0]]: ExtractTags<`<${Var}>`>[1] }>
    : Acc;


// TODO: develop feature based toggle for types. See AllowTags
export type MessageValues<T extends string, AllowTags = true, AllowVars = true> = Merge<
    & (AllowTags extends true ? SplitTags<T> : {})
    & (AllowVars extends true ? SplitVariables<T> : {})>;

export type ExtractMessageDescriptorValues<T> = CombineIntersections<{
    [Path in FlattenKeys<T>]: NestedPropertyType<T, Path> extends string ? MessageValues<NestedPropertyType<T, Path>> : never;
}>;
