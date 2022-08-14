
// Tip #1: create record type from object literal
export const fruitCounts = {
  apple: 3,
  orange: 5,
  pear: 2,
}

type SingleFruitCount = 
| { apple: number }
| { pear: number }
| { orange: number }

type FruitCounts = typeof fruitCounts

type NewSingleFruitCount = {
  [K in keyof FruitCounts]: {
    [K2 in K]: number
  }
}[keyof FruitCounts]

const SingelFruitCount: NewSingleFruitCount = {
  apple: 3,
  pear: 2,
  orange: 1,
}

// Tip #2: convert union type to another union type with in keyword

export type Entity = 
| { type: "user" }
| { type: "post" }
| { type: "comment" }

// type EntityWithId = 
// | { userId: string, type: "user" }
// | { postId: string, type: "post" }
// | { commentId: string, type: "comment" }

type EntityWithId = {
  [EntityType in Entity["type"]]: {
    type: EntityType
  } & Record<`${EntityType}Id`, string>
}[Entity["type"]]

const result: EntityWithId = {
  type: "comment",
  commentId: "123",
}

import { JSX } from 'solid-js/web/types/jsx'
// Tip #3: Union merge query params at the type level
import { String, Union } from 'ts-toolbelt'

const query = `/home?a=wow&b=woah`

type Query = typeof query

type SecondQueryPart = String.Split<Query, "?">[1]

type QueryElements = String.Split<SecondQueryPart, "&">

type QueryParams = {
  [QueryElement in QueryElements[number]]: {
    [Key in String.Split<QueryElement, '='>[0]]: String.Split<QueryElement, '='>[1];
  }
}[QueryElements[number]]

export const obj: Union.Merge<QueryParams> = {
  a: "wow",
  b: "woah",
}


// Tip #4: function overloads to compose functions
export function compose<Input, FirstArg>(
  func: (Input: Input) => FirstArg
): (Input: Input) => FirstArg

export function compose<Input, FirstArg, SecondArg>(
  func: (Input: Input) => FirstArg,
  func1: (Input: FirstArg) => SecondArg
): (Input: Input) => SecondArg

export function compose<Input, FirstArg, SecondArg, ThirdArg>(
  func: (Input: Input) => FirstArg,
  func1: (Input: FirstArg) => SecondArg,
  func2: (Input: SecondArg) => ThirdArg
): (Input: Input) => ThirdArg

export function compose(...args: any[]) {
  return {} as any
}

const addOne = (a: number): number => a + 1
const numToString = (a:number) => a.toString()
const stringToNum = (a: string) => parseInt(a)
const addOneToString = compose(addOne, numToString, stringToNum) // Will error if you pass in args in wrong order
// kind of like elixir multivariadic functions

//Tip #5: extends keywrod for narrowing value of a generic type

export const getDeepValue = <
  Obj, 
  FirstKey extends keyof Obj, 
  SecondKey extends keyof Obj[FirstKey]
> (obj: Obj, firstKey: FirstKey, secondKey: SecondKey): Obj[FirstKey][SecondKey]  => {
  return {} as any
}

const myObj = {
  foo: {
    a: true,
    b: 'wow'
  },
  bar: {
    c: 'cool',
    d: 3
  }
}

const objResult = getDeepValue(myObj, 'foo', 'b')


// Tip #6: it's in vizbin because of React dependency


// Tip #7 Generics

export const myObject = {
  a: 1,
  b: 2,
  c: 3
}

const objectKeys = <Obj>(obj: Obj): (keyof Obj)[] => {
  return Object.keys(obj) as (keyof Obj)[]
}

// Object.keys(myObject).forEach((key) => {
objectKeys(myObject).forEach((key) => {
  console.log(myObject[key])
})

// Tip #7.5: type parameters for passing into string literals

type Carb = 'rice' | 'bread' | 'pasta'
type Protein = 'beans' | 'chicken' | 'beef'

type Meal = `${Carb} and ${Protein}`

const meal: Meal = 'rice and beans'


// Tip #8: Use generics with functions (or JSX components)
interface TableProps<TItem> {
  items: TItem[];
  renderItem: (item: TItem) => JSX.Element;
}

export function Table<TItem>(props: TableProps<TItem>) {
  return null
}

const Component = () => {
  return Table( 
  // return Table<{id: string, name: string, age: number}>( // <- optionally can pass in type parameters to specify the generic type
   {
      items: [
        { 
          id: '1',
          name: 'John',
          age: 32
        },
      ],
      renderItem: (item) => item.age
   }
  )
}


// Tip #9: Currying with Generic types

export const makeKeyRemover = 
  <Key extends string>(keys: Key[]) => 
  <Obj>(obj: Obj): Omit<Obj, Key> => ({} as any)

const keyRemover = makeKeyRemover(['a', 'b'])

const newObject = keyRemover({a: 1, b: 2, c: 3})

// newObject.a // Error: a not available (same for b)
newObject.c


// Tip #10: throw custom type error messages

type CheckForBadArgs<Arg> = Arg extends any[] ? 'You cannot compare two arrays using deepEqualCompare' : Arg

export const deepEqualCompare = <Arg>(a: CheckForBadArgs<Arg>, b: CheckForBadArgs<Arg>): boolean => {
  if(Array.isArray(a) || Array.isArray(b)) {
    throw new Error('You cannot compare two arrays using deepEqualCompare')
  }
  return a === b
}

deepEqualCompare(1, 1)
// Error: You cannot compare two arrays using deepEqualCompare
// @ts-expect-error
deepEqualCompare([], []) 


// Tip #11: deep partials

export type DeepPartial<Thing> = Thing extends Function
  ? Thing: Thing extends Array<infer InferredArrayMember>
  ? DeepPartialArray<InferredArrayMember> 
  : Thing extends object
  ? DeepPartialObject<Thing>
  : Thing | undefined

  interface DeepPartialArray<Thing> extends Array<DeepPartial<Thing>> {}

  type DeepPartialObject<Thing> = {
    [Key in keyof Thing]?: DeepPartial<Thing[Key]>;
  }

  interface Post {
    id: string;
    comments: { value: string }[];
    meta: {
      name: string;
      description: string;
    };
  }

  // DeepPartial provides a resursively typed partial object
  const post: DeepPartial<Post> = {
    id: '1'
  }

  // the TS provided type: <Partial>, provides a shallow partial of an object
  const post1: Partial<Post> = {
    id: '1'
  }


  // Tip #12 - "& {}"" prevents 'type literal widening' via 'Apparent Type' trick
  // https://github.com/microsoft/TypeScript-New-Handbook/blob/master/reference/Widening-and-Narrowing.md

  export type LooseIconSize = 'sm' | 'xs' | Omit<string, 'sm' | 'xs'>; // <- mistaken use of <Omit>
  export type IconSize = 'sm' | 'xs' | (string & {});
  // export type IconSize = 'sm' | 'xs' | (String); // String also works becuase it's the String Apparent Type
  export type ContainsIconSize = 'sm' | 'xs' | (`xs${string}` & Record<never, never>); // Record same as {}

  type Obj = {
    a: number;
    b: number;
  }

  type NewObj = Omit<Obj, 'a'> // usually Omit is for objects & keys
  const _obj: NewObj = {
    b: 1 // don't have 'a' key
  }

  const iconSize0: IconSize = 'sm'
  const iconSize1: IconSize = 'xs'


  const iconSize2: ContainsIconSize = 'xs-secondary'
  // @ts-expect-error
  const iconSize3: ContainsIconSize = 'sm-secondary'

// Tip #13 - Turn a module into a type
export type ActionModule = typeof import('./constants')
const actionModule: ActionModule = {
  ADD_TODO: 'ADD_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
  EDIT_TODO: 'EDIT_TODO',
  // COMPLETE_TODO: 'COMPLETE_TODO', // type error, but adding it to './constants.ts' would fix it
}
// export type Action = "ADD_TODO" | "REMOVE_TODO" | "EDIT_TODO";
// recreate the above Action type in a DRY way below:
export type Action = ActionModule[keyof ActionModule]


// more tips: 'as' clause in mapped types

const sym = Symbol();
type Test = {
  [name: string]: any
  [name: number]: any
  [name: symbol]: any
  value: string
  member: string
  0: boolean
  [sym]: Date
}

type KnownKeys<T> = {
  [P in keyof T as
    string extends P ? never :
    number extends P ? never :
    symbol extends P ? never :
    P
  ] : T[P]
}

type _X = KnownKeys<Test>


// more tips: get property from object

function getFromObject<TObj, TKey extends keyof TObj>(
  myObject: TObj, 
  myKey: TKey
  ): TObj[TKey] {
  return {} as any
}

const obj3 = {
  a: 1,
  b: 'string',
}

const _results = getFromObject(obj3, 'b') // results takes on type of obj3 property
