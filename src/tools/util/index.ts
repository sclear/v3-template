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

export function listToTree<T extends any[]>(arr: T, parentId: any) {
  function loop(parentId: any) {
    return arr.reduce((pre, cur) => {
      if (cur.parentId === parentId) {
        cur.children = loop(cur.id);
        pre.push(cur);
      }

      return pre;
    }, []);
  }
  return loop(parentId);
}

type DeepClone<T> = {
  [P in keyof T]: T[P] extends object ? DeepClone<T[P]> : T[P];
};

export function deepClone<T>(source: T): DeepClone<T> {
  if (typeof source !== "object" || source === null) {
    return source as DeepClone<T>;
  }

  if (Array.isArray(source)) {
    return source.map((item) => deepClone(item)) as unknown as DeepClone<T>;
  }

  const target = {} as DeepClone<T>;

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = deepClone(source[key]) as any;
    }
  }

  return target;
}
