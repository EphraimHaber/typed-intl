import type { UnionLast } from "./utilityTypes";


export type WhiteSpace = " " | "\n" | "\t";

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
    : S extends WhiteSpace
    ? ""
    : S extends `${infer Prefix}${WhiteSpace}` ? TrimRight<Prefix> : S;

export type TrimLeft<S extends string> = S extends ""
    ? S
    : S extends WhiteSpace
    ? ""
    : S extends `${WhiteSpace}${infer Prefix}` ? TrimLeft<Prefix> : S;

export type Trim<S extends string> = TrimRight<TrimLeft<S>>;


type SplitByOneSep<S extends string, Sep extends string> =
    string extends S
    ? string[]
    : S extends `${infer Head}${Sep}${infer Tail}`
    ? [Head, ...SplitByOneSep<Tail, Sep>]
    : [S];

type LastSep<SepUnion extends string> = Extract<UnionLast<SepUnion>, string>;

type SplitRecursive<S extends string, SepUnion extends string> =
    [SepUnion] extends [never]
    ? [S]
    : SplitFlatten<
        SplitByOneSep<S, LastSep<SepUnion>>,
        Exclude<SepUnion, LastSep<SepUnion>>
    >;

type SplitFlatten<Parts extends readonly string[], RemainingSeps extends string> =
    Parts extends [infer First, ...infer Rest]
    ? First extends string
    ? [
        ...SplitRecursive<First, RemainingSeps>,
        ...SplitFlatten<Rest extends readonly string[] ? Rest : [], RemainingSeps>
    ]
    : []
    : [];

/**
 * Recursively splits a string `Str` by one or more separator strings in `SepUnion`.
 * @template Str       The string literal type to split.
 * @template SepUnion  A union of string literal separators.
 */
export type Split<Str extends string, SepUnion extends string> =
    string extends Str
    ? string[]
    : [SepUnion] extends [never]
    ? (Str extends '' ? [] : [Str])
    : SplitRecursive<Str, SepUnion>;

/**
 * Extracts all balanced substrings from `S` that lie between `Open` and `Close`
 * at the specified nesting `Level`.
 *
 * - Level `1` → only the outermost delimiters
 * - Level `2` → the next layer in, etc.
 *
 * @template S       The string literal to scan.
 * @template Level   The nesting depth to capture (1 = outermost).
 * @template Open    The opening delimiter (e.g. `"{"`).
 * @template Close   The closing delimiter (e.g. `"}"`).
 * @template Stack   Internal: a stack of buffers for each open delimiter.
 * @template Result  Internal: the union of all captured substrings at the target level.
 */
export type ExtractDelimitedAtLevel<
    S extends string,
    Level extends number,
    Open extends string,
    Close extends string,
    Stack extends string[] = [],
    Result extends string = never
> =
    // 1) If S starts with an opening delimiter, push a new empty buffer onto the stack
    S extends `${Open}${infer AfterOpen}`
    ? ExtractDelimitedAtLevel<
        AfterOpen,
        Level,
        Open,
        Close,
        [...Stack, ''],
        Result
    >

    // 2) Else if S starts with a closing delimiter, pop one level:
    : S extends `${Close}${infer AfterClose}`
    ? Stack extends [...infer Prev extends string[], infer Curr extends string]
    ? ExtractDelimitedAtLevel<
        AfterClose,
        Level,
        Open,
        Close,
        // Pop the stack, then re-append the just-closed substring back into its parent buffer
        Prev extends [...infer P2 extends string[], infer Parent extends string]
        ? [...P2, `${Parent}${Open}${Curr}${Close}`]
        : [],
        // If that closed level === Level, add it to Result
        Stack['length'] extends Level
        ? Result | `${Open}${Curr}${Close}`
        : Result
    >
    : Result

    // 3) Otherwise, consume one character: append it to the current innermost buffer (if any)
    : S extends `${infer Char}${infer Rest}`
    ? Stack extends [...infer Prev2 extends string[], infer Curr2 extends string]
    ? ExtractDelimitedAtLevel<
        Rest,
        Level,
        Open,
        Close,
        [...Prev2, `${Curr2}${Char}`],
        Result
    >
    : ExtractDelimitedAtLevel<Rest, Level, Open, Close, Stack, Result>

    // 4) When the input is exhausted, emit the accumulated Result union
    : Result;

/**
 * Extract all balanced `{…}` substrings (including nested ones)
 * from the string literal `S`, returning a union of each `{…}`.
 *
 * @template S         The input string to scan.
 * @template CurrStack Internally, a stack of the “current text so far” at each nesting level.
 * @template Acc       Internally, the union of all completed `{…}` we’ve seen so far.
 */
export type ExtractBraces<
    S extends string,
    CurrStack extends string[] = [],
    Acc extends string = never
> =
    // If there's still input left, peel off the first character:
    S extends `${infer First}${infer Rest}`
    ? First extends '{'
    // When we see `{`, start a new nesting level with an empty accumulator:
    ? ExtractBraces<Rest, [...CurrStack, ''], Acc>
    : First extends '}'
    // When we see `}`, pop one level, form `{…}` and add it to both
    // 1) the Acc union, and 
    // 2) append that `{…}` back into the previous level so outer braces include inner text.
    ? CurrStack extends [...infer PrevStack extends string[], infer CurrContent extends string]
    ? ExtractBraces<
        Rest,
        // Pop off CurrContent; if there is still a Prev level, append `{CurrContent}` into it
        PrevStack extends [...infer P2 extends string[], infer P2Last extends string]
        ? [...P2, `${P2Last}{${CurrContent}}`]
        : [],
        // Accumulate this just‐closed `{CurrContent}`
        Acc | `{${CurrContent}}`
    >
    : never
    // For any other character, just append it onto the “current” top‐of‐stack accumulator:
    : CurrStack extends [...infer PrevStack2 extends string[], infer Curr2 extends string]
    ? ExtractBraces<
        Rest,
        [...PrevStack2, `${Curr2}${First}`],
        Acc
    >
    // If we're not inside any braces, drop it on the floor:
    : ExtractBraces<Rest, CurrStack, Acc>
    // When you're out of characters, emit the union of everything you collected
    : Acc;

/**
 * Extracts all balanced `{…}` substrings from `S` at the specified nesting `Level`.
 *
 * - Level `1` yields only the outermost `{…}` blocks.
 * - Level `2` yields the first layer of nested `{…}` inside those, and so on.
 *
 * @template S         The input string literal to scan.
 * @template Level     The nesting depth to extract (1 = outermost, 2 = one level in, etc).
 * @template CurrStack
 *   Internal accumulator: a tuple of strings, one per open brace,
 *   building up the “current” content at each nesting level.
 * @template Acc       Internal accumulator: the union of completed `{…}` at the target Level.
 */
export type ExtractBracesAtLevel<
    S extends string,
    Level extends number,
> = ExtractDelimitedAtLevel<S, Level, "{", "}">;