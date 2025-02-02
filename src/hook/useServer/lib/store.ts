import type {
  ApiTuplePath,
  ApiResult,
  ApiSettings,
  SplitType,
  ApiModule,
} from "./index.type";
export * from "./index.type";

let store = {};

function splitPath<T extends string>(str: T): SplitType<T> {
  return (str as string).split(".") as any;
}

export function createApi<T extends ApiSettings>(api: T) {
  store = api;
  return {
    store: api,
    getApiModule<U extends ApiTuplePath<T>[number]>(apiPath: U) {
      const keys = splitPath(apiPath);
      let A: any = api;
      for (let i = 0; i < keys.length; i++) {
        A = A[keys[i]];
      }
      return A as unknown as ApiResult;
    },
  };
}

/**
 *
 * @param {Mock} mock数据
 * @params {_Mock_} 是否开启Mock
 * @return {ApiModule}
 */
export function createApiModule<T extends ApiModule>(api: T) {
  return api;
}
