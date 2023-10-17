export interface ResponseData<T> {
  code: Code;
  message?: string;
  data: T;
  [key: string]: any;
}
export type Code = 200 | 300 | 404 | 500;

type Mock = ResponseData<any> | MockFn;

export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

export type ApiType = {
  method: string;
  url: string;
  // Mock?: Mock;
  // _Mock_?: boolean;
};

export type ApiArgs = {
  method: string;
  url: string;
  Mock?: Mock;
  _Mock_?: boolean;
};

type MockFn = (args: { data: any; urlParams: any }) => ResponseData<any>;

export type ApiResult = {
  method: "get" | "post" | "put" | "delete";
  url: string;
  Mock?: Mock;
  _Mock_?: boolean;
};

type TupleAddStrPath<
  S,
  K extends unknown[] = [],
  R extends unknown[] = []
> = K extends [infer F, ...infer Rest]
  ? S extends string
    ? F extends string
      ? TupleAddStrPath<S, Rest, [...R, `${S}.${F}`]>
      : never
    : R
  : R;

export type ApiTuplePath<
  T extends object,
  R extends string[] = [],
  Ag = UnionToTuple<keyof T>
> = Ag extends [infer F, ...infer Rest]
  ? F extends string
    ? F extends keyof T
      ? T[F] extends ApiType
        ? ApiTuplePath<T, [...R, F], Rest>
        : ApiTuplePath<
            T,
            [...R, ...TupleAddStrPath<F, UnionToTuple<keyof T[F]>>],
            Rest
          >
      : R
    : R
  : R;

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

export type ApiSettings = {
  [prop: string]:
    | {
        [prop: string]: ApiType;
      }
    | ApiType;
};

export type ApiModule = {
  [prop: string]: ApiArgs;
};

export type SplitType<
  T,
  str extends string = "",
  R extends string[] = []
> = T extends string
  ? T extends `${infer A}${infer B}`
    ? A extends "."
      ? SplitType<B, "", [...R, `${str}`]>
      : B extends `${infer C}${infer D}`
      ? SplitType<B, `${str}${A}`, R>
      : [...R, `${str}${A}`]
    : R
  : never;
