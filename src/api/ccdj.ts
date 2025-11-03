import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  queryCcjl: '/crcgl/queryCcjl',
  saveCrcjl: '/crcgl/saveCrcjl',
  getCcjl: '/crcgl/getCcjl',
};


// 查询出厂记录
export function queryCcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryCcjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 保存出厂记录编号
export function saveCrcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.saveCrcjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 查询出厂记录详情
export function getCcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.getCcjl,
    method: 'POST',
    data: params,
  }) as any;
}





