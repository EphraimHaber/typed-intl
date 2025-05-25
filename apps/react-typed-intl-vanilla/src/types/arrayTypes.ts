export type Concat<L1 extends unknown[], L2 extends unknown[]> = [
    ...L1,
    ...L2,
];

export type FilterOut<
    List extends any[],
    ExclusionList extends any[]
> = List extends [infer Head, ...infer Tail]
    ? Head extends ExclusionList[number]
    ? FilterOut<Tail, ExclusionList>
    : [Head, ...FilterOut<Tail, ExclusionList>]
    : [];