import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  queryKjtzjl: '/ckgl/queryKjtzjl',
  getKjtzjl: '/ckgl/getKjtzjl',
  saveKjtzjl: '/ckgl/saveKjtzjl',
  saveKjtzjlmx: '/ckgl/saveKjtzjlmx',
  deleteKjtzjl: '/ckgl/deleteKjtzjl',
  deleteKjtzmxjl: '/ckgl/deleteKjtzmxjl',
};

// 查询库间调整记录列表
export function queryKjtzjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryKjtzjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 获取库间调整记录详情
export function getKjtzjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.getKjtzjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 新增库间调整记录
export function saveKjtzjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.saveKjtzjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 新增库间调整记录明细
export function saveKjtzjlmx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.saveKjtzjlmx,
    method: 'POST',
    data: params,
  }) as any;
}
// 删除库间调整记录
export function deleteKjtzjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.deleteKjtzjl,
    method: 'POST',
    data: params,
  }) as any;
}
// 删除库间调整明细记录
export function deleteKjtzmxjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.deleteKjtzmxjl,
    method: 'POST',
    data: params,
  }) as any;
}

