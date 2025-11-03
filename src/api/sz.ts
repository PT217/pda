import { _request } from '@/utils/httpRequest';

export const apiUrl = {
  exportData: '/sjgl/exportData',
  importData: '/sjgl/importData',
  queryPcdrjl: '/sjgl/queryPcdrjl',
  deletePcdrjl: '/sjgl/deletePcdrjl',
};

// 导出数据
export function exportData<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.exportData,
    method: 'POST',
    data: params,
  }) as any;
}

// 导入数据
export function importData<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.importData,
    method: 'POST',
    data: params,
  }) as any;
}
// 查询PC导入记录
export function queryPcdrjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.queryPcdrjl,
    method: 'POST',
    data: params,
  }) as any;
}

// 删除PC导入记录
export function deletePcdrjl<T>(params: any): Promise<T> {
  return _request({
    url: apiUrl.deletePcdrjl,
    method: 'POST',
    data: params,
  }) as any;
}




