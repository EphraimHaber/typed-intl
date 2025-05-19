type ICUTypes =
  | 'number'
  | 'string'
  | 'date'

type ICUMessage<S extends string> =
  S extends `${infer Prefix}{${infer Arg}`
    ? `${Prefix}{${Arg}, ${ICUTypes}`
    : never;

type Test = ICUMessage<'The price of this bagel is {num'>;

function _foo<S extends string>(s: S | ICUMessage<S>) {
    return s as ICUMessage<S>;
}

_foo('The price of this bagel is {num, number, ');