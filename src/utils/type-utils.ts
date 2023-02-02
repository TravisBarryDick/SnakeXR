// Object type containing all properties of `T` assignable to interface `I`.
export type PropsMatching<T, I> = {
  [P in keyof T as T[P] extends I ? P : never]: I & T[P];
};

// Methods of interface I that start with an argument prefix
export type MethodsOf<I, ArgPrefix extends any[] = []> = PropsMatching<
  I,
  (..._: [...ArgPrefix, ...any[]]) => any
>;

// Keys of I and MethodsOf<I, ArgPrefix>
export type MethodKeys<I, ArgPrefix extends any[] = []> = keyof I &
  keyof MethodsOf<I, ArgPrefix>;

// Converts a type union into a type intersection
export type UnionToIntersection<T> = (T extends T ? (_: T) => 1 : 0) extends (
  _: infer U
) => 1
  ? Extract<U, T>
  : never;

// A tuple type matching the arguments of function F following the given
// ArgPrefix.
export type RestOfArgs<F, ArgPrefix extends any[] = []> = UnionToIntersection<
  F extends (..._: [...ArgPrefix, ...infer Args]) => any ? Args : never
>;
