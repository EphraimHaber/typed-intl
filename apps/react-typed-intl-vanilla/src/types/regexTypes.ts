export type ZeroOrMoreSpaces<S extends string> = S extends ""
  ? S
  : S extends ` ${infer Rest}` ? ` ${ZeroOrMoreSpaces<Rest>}` : never;

export type OneOrMoreSpaces<S extends string> = S extends ""
  ? never
  : S extends " "
  ? S
  : S extends ` ${infer Rest}` ? ` ${OneOrMoreSpaces<Rest>}` : never;