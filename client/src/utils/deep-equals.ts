export function deepInequals<O>(obj1: O, obj2: O): boolean {
  // true inside callback is not matching
  return Object.keys(obj1).some(key => {
    const typedKey = key as keyof O
    const val1 = obj1[typedKey]
    const val2 = obj2[typedKey]

    if (typeof val1 === 'object') {
      return deepInequals(val1, val2)
    }

    return val1 !== val2
  })
}
