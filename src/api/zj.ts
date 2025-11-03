import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  queryJcrwData: '/zlgl/queryJcrwData',
  queryJcrwqdData: '/zlgl/queryJcrwqdData',
  queryJcbxx: '/zlgl/queryJcbxx',
  plsaveJcbxx: '/zlgl/plsaveJcbxx',
};

// PDA质检任务列表
export function queryJcrwData<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryJcrwData,
    method: 'POST',
    data: params,
  }) as any;
}

// PDA质检任务清单列表
export function queryJcrwqdData<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryJcrwqdData,
    method: 'POST',
    data: params,
  }) as any;
}
// 查询检查表信息
export function queryJcbxx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryJcbxx,
    method: 'POST',
    data: params,
  }) as any;
}
// 批量保存检查表信息
export function plsaveJcbxx<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.plsaveJcbxx,
    method: 'POST',
    data: params,
  }) as any;
}




