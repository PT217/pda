// 引入配置文件
// import '@/static/config.js'
import { getTokenFromStorage } from './auth';

// declare global {
//   interface Window {
//     BASEURL?: any
//   }
// }



// http请求方法枚举
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}



// http请求配置
interface RequestConfig {
  /**api路径 */
  url?: string;
  /**method类型 */
  method?: any;
  /**请求参数 */
  data?: any;
  /** 无TOKEN触发异常捕获时，是否执行异常逻辑 */
  needToken?: boolean;
  /** Header头部 */
  header?: object;
}
export class HttpRequest {

  private static instance: HttpRequest;

  private constructor() { }

  public static getInstance(): HttpRequest {
    if (!this.instance) {
      this.instance = new HttpRequest();
    }
    return this.instance;
  }

  public request<T>(requestConfig: RequestConfig) {
    return new Promise((resolve, reject) => {
      uni.request({
        method: requestConfig.method,
        url: `${import.meta.env.VITE_API_URL + requestConfig.url}`,
        data: requestConfig.data,
        header: {
          'tf_token': getTokenFromStorage()
        },
        success: function (res: UniApp.RequestSuccessCallbackResult | any) {
          if (res.data.code === 10000) {
            uni.showToast({
              title: '登录已过期,请重新登陆',
              icon: 'none',
              success() {
                setTimeout(() => {
                  uni.reLaunch({
                    url: '/pages/login/index',
                  });
                }, 1000);
              },
            });
          }
          if ([400, 401, 402, 403, 404, 405, 407, 408, 500, 502, 503].indexOf(res.statusCode) > -1) {
            console.error(res.message);
            reject(res);
          }
          resolve(res?.data);
        },
        fail: (err: any) => {
          uni.showToast({
            title: err.errMsg,
            icon: 'none'
          })
          // uni.reLaunch({
          //   url: '/pages/login/index',
          // });
        },
      });
    });
  }
}

export const _request = HttpRequest.getInstance().request;
