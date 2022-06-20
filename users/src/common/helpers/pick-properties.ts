export function pickProperties<T>(object: Partial<T>, ...keys: (keyof T)[]): Partial<T> {
  if (!object || !keys?.length) {
    return {};
  }

  return keys.reduce((acc: Partial<T>, key: keyof T) => ({
    ...acc,
    ...pickPropertyFn(object, key),
  }), {});
}

function pickPropertyFn<T>(object: Partial<T>, key: keyof T): Partial<T> | {} {
  return object[key] ? { [key]: object[key] } : {};
}
