export function omit<T, K extends keyof T>(
  object: T,
  keys: Array<K>
): Pick<T, Exclude<keyof T, K>> {
  const obj = {
    ...object,
  };
  keys.forEach((k) => {
    delete obj[k];
  });
  return obj;
}

export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: Array<K>
): Pick<T, K> {
  const obj: any = {};
  keys.forEach((k) => {
    if (object[k]) {
      obj[k] = object[k];
    }
  });

  return obj;
}

export const getValueByPath = function (object: any, prop: string) {
  prop = prop || "";
  const paths = prop.split(".");
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};
export const setValueByPath = function (object: any, prop: string, v: any) {
  prop = prop || "";
  const paths = prop.split(".");
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;
    if (i === j - 1) {
      current[path] = v;
      break;
    }
    current = current[path];
  }
  return result;
};
