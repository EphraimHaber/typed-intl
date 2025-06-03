import type { ReactNode } from "react";
import type { Merge, CombineIntersections, FlattenKeys, NestedPropertyType } from "./utilityTypes";
import type { ExtractBracesAtLevel, Trim } from "./stringTypes";


type GetVarType<T extends string> = T extends 'string' ? string : T extends 'number' ? number : T extends 'date' ? Date : ReactNode;

type ExtractVarTypeSkeleton<T extends string> = T extends `{${infer Var},${infer Type},${infer Skeleton}}`
    ? [Trim<Var>, GetVarType<Trim<Type>>, Trim<Skeleton>]
    : T extends `{${infer Var}, ${infer Type}}`
    ? [Trim<Var>, GetVarType<Trim<Type>>]
    : T extends `{${infer Var}}`
    ? [Trim<Var>, ReactNode]
    : never;

type FormatXMLElementFn<T extends ReactNode, R extends ReactNode> = (parts: T[]) => R;
type TagType = FormatXMLElementFn<ReactNode, ReactNode>;

type ExtractTags<T extends string> = T extends `<${infer TagName}>`
    ? TagName extends `/${string}` | `${string}/` ? never : [TagName, TagType] // exclude closing and self-closing tags e.g., <br />, <br     >
    : never;

type VarMapping<Placeholder extends `{${string}}`> = { [K in ExtractVarTypeSkeleton<Placeholder>[0]]: ExtractVarTypeSkeleton<Placeholder>[1] }

type SplitVariables<T extends string> = ExtractBracesAtLevel<T, 1> extends "" ? object : VarMapping<ExtractBracesAtLevel<T, 1>>;

type SplitTags<T extends string, Acc = object> = T extends `${string}<${infer Var}>${infer Suffix}`
    ? SplitTags<Suffix, Acc & { [K in ExtractTags<`<${Var}>`>[0]]: ExtractTags<`<${Var}>`>[1] }>
    : T extends `${string}<${infer Var}>${infer Suffix}`
    ? SplitTags<Suffix, Acc & { [K in ExtractTags<`<${Var}>`>[0]]: ExtractTags<`<${Var}>`>[1] }>
    : Acc;

// TODO: develop feature based toggle for types. See AllowTags
export type MessageValues<T extends string, AllowTags = true, AllowVars = true> = Merge<
    & (AllowTags extends true ? SplitTags<T> : object)
    & (AllowVars extends true ? SplitVariables<T> : object)>;

export type ExtractMessageDescriptorValues<T> = CombineIntersections<{
    [Path in FlattenKeys<T>]: NestedPropertyType<T, Path> extends string ? MessageValues<NestedPropertyType<T, Path>> : never;
}>;