import { stringify } from 'qs';
import request from '../../utils/request';

// 获取用户组列表
export async function getList(params) {
  return request(`/nodeApi/auth/modules?${stringify(params)}`);
}

// 获取用户组详情
export async function getDetails({ id }) {
  return request(`/nodeApi/auth/modules/${id}/edit`);
}

// 编辑用户组信息
export async function editDetails(params) {
  return request(`/nodeApi/auth/modules/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 添加用户组
export async function add(params) {
  return request('/nodeApi/auth/modules', {
    method: 'POST',
    body: params,
  });
}

// 删除用户组
export async function remove(params) {
  return request(`/nodeApi/auth/modules/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}
