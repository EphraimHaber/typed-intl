export type ZeroOrMoreSpaces<S extends string> = S extends ""
    ? S
    : S extends ` ${infer Rest}` ? ` ${ZeroOrMoreSpaces<Rest>}` : never;

export type OneOrMoreSpaces<S extends string> = S extends ""
    ? never
    : S extends " "
    ? S
    : S extends ` ${infer Rest}` ? ` ${OneOrMoreSpaces<Rest>}` : never;

export type TrimRight<S extends string> = S extends ""
    ? S
    : S extends " "
    ? ""
    : S extends `${infer Prefix} ` ? TrimRight<Prefix> : S;

export type TrimLeft<S extends string> = S extends ""
    ? S
    : S extends " "
    ? ""
    : S extends ` ${infer Prefix}` ? TrimLeft<Prefix> : S;

export type Trim<S extends string> = TrimRight<TrimLeft<S>>;