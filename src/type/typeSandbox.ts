
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

const obj: Union.Merge<QueryParams> = {
  a: "wow",
  b: "woah",
}
