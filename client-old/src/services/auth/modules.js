import { stringify } from 'qs';
import request from '../../utils/request';

// 获取列表
export async function getList(params) {
  return request(`/nodeApi/auth/modules?${stringify(params)}`);
}

// 获取详情
export async function getDetails({ id }) {
  return request(`/nodeApi/auth/modules/${id}/edit`);
}

// 编辑信息
export async function editDetails(params) {
  return request(`/nodeApi/auth/modules/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 添加
export async function add(params) {
  return request('/nodeApi/auth/modules', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function remove(params) {
  return request(`/nodeApi/auth/modules/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 获取系统树
export async function getSystemTree(params) {
  return request(`/nodeApi/auth/modules/system?${stringify(params)}`);
}
