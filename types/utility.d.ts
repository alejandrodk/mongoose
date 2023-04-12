declare module 'mongoose' {
  type IfAny<IFTYPE, THENTYPE, ELSETYPE = IFTYPE> = 0 extends (1 & IFTYPE) ? THENTYPE : ELSETYPE;
  type IfUnknown<IFTYPE, THENTYPE> = unknown extends IFTYPE ? THENTYPE : IFTYPE;

  type Unpacked<T> = T extends (infer U)[] ?
    U :
    T extends ReadonlyArray<infer U> ? U : T;

  type UnpackedIntersection<T, U> = T extends null ? null : T extends (infer A)[]
    ? (Omit<A, keyof U> & U)[]
    : keyof U extends never
      ? T
      : Omit<T, keyof U> & U;

  type MergeType<A, B> = Omit<A, keyof B> & B;

  /**
   * @summary Converts Unions to one record "object".
   * @description It makes intellisense dialog box easier to read as a single object instead of showing that in multiple object unions.
   * @param {T} T The type to be converted.
   */
   type FlatRecord<T> = { [K in keyof T]: T[K] };

   /**
 * @summary Checks if a type is "Record" or "any".
 * @description It Helps to check if user has provided schema type "EnforcedDocType"
 * @param {T} T A generic type to be checked.
 * @returns true if {@link T} is Record OR false if {@link T} is of any type.
 */
type IsItRecordAndNotAny<T> = IfEquals<T, any, false, T extends Record<any, any> ? true : false>;

/**
 * @summary Checks if two types are identical.
 * @param {T} T The first type to be compared with {@link U}.
 * @param {U} U The seconde type to be compared with {@link T}.
 * @param {Y} Y A type to be returned if {@link T} &  {@link U} are identical.
 * @param {N} N A type to be returned if {@link T} &  {@link U} are not identical.
 */
type IfEquals<T, U, Y = true, N = false> =
    (<G>() => G extends T ? 1 : 0) extends
    (<G>() => G extends U ? 1 : 0) ? Y : N;


/**
 * This type is used to extract all the nested properties
 * of a given object. It takes an object type T as input and returns
 * a union of all possible nested property paths in the form of a
 * string type.
 * For example, given the input type { a: { b: { c: string } } },
 * the type NestedProps<T> will return "a.b.c".
 */
type NestedPropsDot<T> = T extends object
  ? { [K in keyof T]-?: Extract<K, string> extends never
      ? never
      : `${Extract<K, string>}${NestedPropsDot<T[K]> extends '' ? '' : '.'}${NestedPropsDot<T[K]>}` }[keyof T]
  : '';

/**
 * Elimina el punto al final de una cadena, si está presente.
 * @example
 * type Trimmed = TrimDot<'prop3.propB.propA1.'>; // 'prop3.propB.propA1'
 */
type TrimDot<S extends string> = S extends `${infer R}.` ? R : S;

/**
 * This type is used to extract all the nested properties
 * of a given object. It takes an object type T as input and returns
 * a union of all possible nested property paths in the form of a
 * string type.
 * For example, given the input type { a: { b: { c: string } } },
 * the type NestedProps<T> will return "a.b.c".
 */
type NestedProps<T> = TrimDot<NestedPropsDot<T>>;

/**
 * This type is used to create a new object type that replaces all
 * the nested properties in a given object with a flattened version
 * of their keys, while preserving all the other properties in T.
 * It takes an object type T as input and returns a new object type
 * with all the nested properties flattened.
 *
 * The new object type has the following properties:
 * - For each nested property in T, it creates a new property in
 * the new object type with a flattened key that includes the keys
 * of all the nested properties.
 * - The values of these new properties are set to string type.
 * - All the other properties in T are preserved in the new object type,
 * with their original types.
 */
  type NestedObject<TObj> = {
    [K in keyof TObj]?: K extends string
      ? TObj[K] extends object
        ? NestedObject<TObj[K]> // NestObjed type
        : /**
           * Its necessary to use "Condition" type to allow
           * create queries using conditions and not just values.
           * how it can be improved?
           */
          TObj[K] | Condition<TObj[K]>
      : never;
  } & {
    [P in NestedProps<TObj>]?:
      | string
      | number
      | boolean
      | null
      | undefined
      | Condition<string | number | boolean | null | undefined>;
  };
}
