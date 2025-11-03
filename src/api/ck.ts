import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  queryCk: '/ckgl/queryCk',
  queryKq: '/ckgl/queryKq',
  queryWpxx: '/wpgl/queryWpxx',
  getRcWpxx: '/wpgl/getRcWpxx',
  getWpxx: '/wpgl/getWpxx',
  getZtnbqk: '/wpgl/getZtnbqk',
  doScan: '/scan/doScan',
};

// 查询所有仓库
export function queryCk<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryCk,
    method: 'POST',
    data: params,
  }) as any;
}
// 查询所有库区
export function queryKq<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryKq,
    method: 'POST',
    data: params,
  }) as any;
}


// 查询物品列表
export function queryWpxx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryWpxx,
    method: 'POST',
    data: params,
  }) as any;
}

// 查询物品详情
export function getWpxx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.getWpxx,
    method: 'POST',
    data: params,
  }) as any;
}

// 查询入厂物品详情
export function getRcWpxx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.getRcWpxx,
    method: 'POST',
    data: params,
  }) as any;
}

// 查询状态和内部情况
export function getZtnbqk<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.getZtnbqk,
    method: 'POST',
    data: params,
  }) as any;
}

// 扫描码
export function doScan<T>(): Promise<T> {
  return _request({
    url: apiUrl.doScan,
    method: 'POST',
  }) as any;
}

