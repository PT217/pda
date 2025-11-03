import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  login: '/zzjg/login',
  queryZzdy: '/zzjg/queryZzdy',
  saveCrcjlmx: '/crcgl/saveCrcjlmx',// 保存出入厂记录明细
  getCcjl: '/crcgl/getCcjl',
  deleteCrcjlmx: '/crcgl/deleteCrcjlmx',
  deleteCrcjl: '/crcgl/deleteCrcjl'
};

// 登录
export function login<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.login,
    method: 'POST',
    data: params,
  }) as any;
}

// 保存出入厂记录明细
export function saveCrcjlmx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.saveCrcjlmx,
    method: 'POST',
    data: params,
  }) as any;
}

// 删除出入厂记录明细
export function deleteCrcjlmx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.deleteCrcjlmx,
    method: 'POST',
    data: params,
  }) as any;
}

// 删除出入厂记录
export function deleteCrcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.deleteCrcjl,
    method: 'POST',
    data: params,
  }) as any;
}


// 查询所有机构
export function queryZzdy<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryZzdy,
    method: 'POST',
    data: params,
  }) as any;
}
