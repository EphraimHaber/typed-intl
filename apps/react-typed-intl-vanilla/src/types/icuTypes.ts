import type { ReactNode } from "react";
import type { Merge, CombineIntersections, FlattenKeys, NestedPropertyType } from "./utilityTypes";


type ExtractVariableAndType<T extends string> = T extends `{${infer Var}, ${infer Type}}`
    ? [Var, Type extends 'number' ? number : ReactNode]
    : T extends `{${infer Var}}`
    ? [Var, ReactNode]
    : never;

type FormatXMLElementFn<T extends ReactNode, R extends ReactNode> = (parts: T[]) => R;
type TagType = FormatXMLElementFn<ReactNode, ReactNode>;

type ExtractTags<T extends string> = T extends `<${infer TagName}>`
    ? TagName extends `/${string}` | `${string}/` ? never : [TagName, TagType] // exclude closing and self-closing tags e.g., <br />, <br     >
    : never;

type SplitVariables<T extends string, Acc = object> = T extends `${string}{${infer Var}}${infer Suffix}`
    ? SplitVariables<Suffix, Acc & { [K in ExtractVariableAndType<`{${Var}}`>[0]]: ExtractVariableAndType<`{${Var}}`>[1] }>
    : T extends `${string}{${infer Var}, ${infer Type}}${infer Suffix}`
    ? SplitVariables<Suffix, Acc & { [K in ExtractVariableAndType<`{${Var}, ${Type}}`>[0]]: ExtractVariableAndType<`{${Var}, ${Type}}`>[1] }>
    : Acc;

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
