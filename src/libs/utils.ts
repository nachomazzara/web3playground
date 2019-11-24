export function omit<T>(object: T, key?: string): T {
  return key ? Object.keys(object)
    .filter(k => k !== key)
    .reduce(
      (acc, k) => ({
        ...acc,
        [k]: object[k]
      }),
      {} as T
    ) : object
}

export function filter<T>(object: T, condition: (p: any) => boolean): T {
  return Object.keys(object)
    .filter(k => condition(object[k]))
    .reduce(
      (acc, k) => ({
        ...acc,
        [k]: object[k]
      }),
      {} as T
    )
}