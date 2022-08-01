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







export {}
