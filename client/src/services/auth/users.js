import { stringify } from 'qs';
import request from '../../utils/request';

// app.get('/nodeApi/auth/users', 'auth.user.index');                      // 用户列表
// app.post('/nodeApi/auth/users', 'auth.user.create');                   // 新建用户
// app.delete('/nodeApi/auth/users/:id', 'auth.user.destroy');           // 删除用户
// app.get('/nodeApi/auth/users/:id/edit', 'auth.user.edit');               // 用户详情
// app.put('/nodeApi/auth/users/:id', 'auth.user.update');                // 修改用户详情
// app.put('/nodeApi/auth/usersPwd/:id', 'auth.user.setPassword');   // 重置密码

// 获取用户列表
export async function getList(params) {
  return request(`/nodeApi/auth/users?${stringify(params)}`);
}

// 重置密码
export async function resetPwd(params) {
  return request(`/nodeApi/auth/usersPwd/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 获取用户信息
export async function getUserInfo({ id }) {
  return request(`/nodeApi/auth/users/${id}/edit`);
}

// 编辑用户信息
export async function editUserInfo(params) {
  return request(`/nodeApi/auth/users/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 添加用户
export async function addUserInfo(params) {
  return request('/nodeApi/auth/users', {
    method: 'POST',
    body: params,
  });
}

// 删除单个用户
export async function removeUser(params) {
  return request(`/nodeApi/auth/users/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 删除多个用户
export async function removeUsers(params) {
  return request('/nodeApi/auth/users', {
    method: 'DELETE',
    body: params,
  });
}
