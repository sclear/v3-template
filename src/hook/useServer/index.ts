import { onMounted, ref, unref, UnwrapRef, Ref, isRef, watch } from "vue";
import { request } from "./lib";
import { ResponseData, Code, IfAny } from "./lib/index.type";
import serverSetting from "./../../server/index";
import { ElMessage } from "element-plus";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";

const { getApiModule } = serverSetting;

type InputApi = Parameters<typeof getApiModule>[0];

type ResponseType = "json" | "blob";

export type ApiType = InputApi;
export interface UseServerConfig<Result, T, U extends string | object> {
  api: InputApi | Ref<InputApi>;
  data?: U;
  default?: any;
  autoRun?: boolean;
  urlParams?: UnwrapRef<any> | Ref<any>;
  successMessage?: string;
  errorMessage?: string;
  headers?: any;
  depsCondition?: boolean;
  deps?: any[];
  throttleTime?: number;
  debounceTime?: number;
  onError?: (err: any) => void;
  onSuccess?: (data: Result, response: ResponseData<T>) => void;
  beforeSetData?: (data: ResponseData<T>) => Result;
  responseType?: ResponseType;
  formatRequestCondition?: (requestCondition: { data: U; urlParams: any }) => {
    responseType?: ResponseType;
    data?: any;
    urlParams?: string;
  };
  end?: () => void;
  downloadOption?: {
    fileName: string;
    isDownload?: 0 | 1;
  };
}

function isObject(t: any): t is object {
  return typeof t === "object";
}

type RunOption = {
  data?: any;
  urlParams?: any;
};

interface UseServerReturn<Result, U> {
  /**
   * @Description 应用数据Data
   * @param {unknown}
   */
  data: Ref<Result>;
  loading: Ref<boolean>;
  code: Ref<Code>;
  run: (runData?: RunOption) => void;
  config: {
    data: Ref<U extends object ? U : any>;
    api: Ref<InputApi>;
    urlParams: Ref<any>;
  };
}

type ResultData<T, K> = IfAny<K, T, K>;

export function useServer<T = any, K = any, U extends object | string = any>(
  config: UseServerConfig<ResultData<T, K>, T, U>
): UseServerReturn<ResultData<T, K>, U> {
  const data = ref(config?.default || []);
  const loading = ref(false);
  const code = ref<Code>(0);

  /**
   * @description config api
   * @param {Ref<ApiType>}
   */
  const configApi = isRef(config.api) ? config.api : ref(config.api);

  const dataSource = isObject(config.data) ? config.data : (config.data as any);
  const configData = isRef(dataSource) ? dataSource : ref(dataSource);

  /**
   * @description config urlParams
   * @param {Ref<string>}
   */
  const configUrlParams = isRef(config.urlParams)
    ? config.urlParams
    : ref(config.urlParams);

  function run(runData?: RunOption) {
    if (runData && runData.data) {
      configData.value = unref(runData.data);
    }
    if (runData && runData.urlParams) {
      configUrlParams.value = unref(runData.urlParams);
    }

    loading.value = true;
    const method = unref(configApi);
    const httpModule = getApiModule(method);
    // Mock
    if (
      httpModule._Mock_ !== false &&
      httpModule.Mock &&
      import.meta.env.VITE_API_Mock_ === "1"
    ) {
      const response =
        typeof httpModule.Mock === "function"
          ? httpModule.Mock({
              data: unref(config.data || null),
              urlParams: unref(config.urlParams || null),
            })
          : httpModule.Mock;
      data.value = config.beforeSetData
        ? config.beforeSetData(response)
        : response;
      setTimeout(() => {
        config.onSuccess && config.onSuccess(data.value, response);
        config.successMessage &&
          ElMessage({ message: config.successMessage, type: "success" });
        loading.value = false;
        config.end && config.end();
      }, 700);
    } else {
      const formatCondition = {
        data: unref(configData),
        urlParams: unref(configUrlParams || undefined) || "",
      };

      // format request condition
      if (config.formatRequestCondition) {
        const { data, urlParams } = config.formatRequestCondition({
          data: unref(configData),
          urlParams: unref(configUrlParams || undefined) || "",
        });
        console.log(data, urlParams);
        formatCondition.data && (formatCondition.data = data);
        formatCondition.urlParams && (formatCondition.urlParams = urlParams);
        console.log(data, urlParams);
      }

      request[httpModule.method](
        httpModule.url + formatCondition.urlParams,
        ["get", "delete"].includes(httpModule.method)
          ? {
              params: formatCondition.data,
              responseType: config?.responseType || "json",
              headers: config.headers || {},
            }
          : formatCondition.data,
        {
          withCredentials: true,
          headers: config.headers || {},
        }
      )
        .then((res) => {
          if (res.code === 200) {
            data.value = config.beforeSetData
              ? config.beforeSetData(res)
              : res.data;
            config.onSuccess && config.onSuccess(data.value, res);
            config.successMessage &&
              ElMessage({ message: config.successMessage, type: "success" });
            console.log(config.successMessage);
          } else {
            config.onError && config.onError(res);
            config.errorMessage &&
              ElMessage({ message: config.errorMessage, type: "error" });
          }
        })
        .catch((err) => {
          config?.onError && config.onError(err);
        })
        .finally(() => {
          loading.value = false;
          config.end && config.end();
        });
    }
  }

  config?.autoRun && run();

  let computedRun = run;
  if (config.throttleTime) {
    computedRun = useThrottleFn(run, config.throttleTime);
  } else if (config.debounceTime) {
    computedRun = useDebounceFn(run, config.debounceTime);
  }

  // deps
  if (config.depsCondition || config.deps) {
    const deps = [
      ...(config.depsCondition ? [configData.value, configUrlParams] : []),
      ...(config.deps || []),
    ];
    watch(deps, () => computedRun(), {
      deep: true,
    });
  }

  return {
    /**
     * @Description 应用数据Data
     * @param {Ref<unknown>}
     */
    data,
    /**
     * @Description Loading
     * @param {Ref<Boolean>}
     */
    loading,
    /**
     * @Description 响应code
     * @param {Ref<Number>}
     */
    code,
    /**
     * @Description 触发器
     * @param {Function}
     */
    run: computedRun,
    /**
     * @Description config
     * @param {Object}
     */
    config: {
      data: configData,
      api: configApi,
      urlParams: configUrlParams,
    },
  };
}
