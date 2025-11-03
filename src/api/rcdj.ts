import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  queryRcjl: '/crcgl/queryRcjl',
  saveRrcjl: '/crcgl/saveRrcjl',
  getRcjl: '/crcgl/getRcjl',
};

// 查询入厂记录
export function queryRcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryRcjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 保存入厂记录
export function saveRrcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.saveRrcjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 查询入厂记录详情
export function getRcjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.getRcjl,
    method: 'POST',
    data: params,
  }) as any;
}
