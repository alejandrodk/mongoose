import { WithId } from "mongodb";
import { MergeType, NestedObject, NestedProps } from "mongoose";
import { expectAssignable, expectType } from "tsd";

type A = { a: string; c: number };
type B = { a: number; b: string };

expectType<string>({} as MergeType<B, A>["a"]);
expectType<string>({} as MergeType<B, A>["b"]);
expectType<number>({} as MergeType<B, A>["c"]);

expectType<number>({} as MergeType<A, B>["a"]);
expectType<string>({} as MergeType<A, B>["b"]);
expectType<number>({} as MergeType<A, B>["c"]);

type Object = WithId<{
  prop1?: string;
  prop2?: string;
  prop3?: {
    propA: string;
    propB: {
      propA1: string;
    };
  };
  func?: () => void;
}>;

expectAssignable<NestedProps<Object>>("prop3.propB.propA1");
expectAssignable<NestedProps<Object>>("prop1");

expectAssignable<NestedObject<Object>>({
  prop1: "foo",
  "prop3.propB.propA1": "bar",
});
