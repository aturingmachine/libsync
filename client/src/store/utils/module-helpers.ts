export interface NamespacedModuleTypes<G, M, A> {
  getters: Record<keyof G, string>
  mutations: Record<keyof M, string>
  actions: Record<keyof A, string>
}

export function name<T>(
  getters: T,
  namespace: string
): Record<keyof T, string> {
  return Object.fromEntries(
    Object.keys(getters).map(key => {
      return [key as keyof T, `${namespace}/${getters[key as keyof T]}`]
    })
  ) as Record<keyof T, string>
}

export function namespaceModule<G, M, A>(
  namespace: string,
  getters: G,
  mutations: M,
  actions: A
): NamespacedModuleTypes<G, M, A> {
  return {
    getters: name(getters, namespace),
    mutations: name(mutations, namespace),
    actions: name(actions, namespace),
  }
}
