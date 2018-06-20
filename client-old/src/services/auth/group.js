import { stringify } from 'qs';
import request from '../../utils/request';

// app.get('/nodeApi/auth/groups', 'auth.group.index');                         // 用户组列表
// app.post('/nodeApi/auth/groups', 'auth.group.create');                      // 添加用户组
// app.delete('/nodeApi/auth/groups/:id', 'auth.group.destroy');              // 删除用户组
// app.get('/nodeApi/auth/groups/:id/edit', 'auth.group.edit');                  // 用户组详情
// app.put('/nodeApi/auth/groups/:id', 'auth.group.update');                   // 修改用户组详情
// app.get('/nodeApi/auth/groupUsers/:id', 'auth.group.getUser');             // 成员查看
// app.put('/nodeApi/auth/groupUsers/:id', 'auth.group.setUser');             // 成员设置
// app.get('/nodeApi/auth/groupModules/:id', 'auth.group.getModule');       // 权限查看
// app.put('/nodeApi/auth/groupModules/:id', 'auth.group.setModule');       // 权限设置

// 获取用户组列表
export async function getList(params) {
  return request(`/nodeApi/auth/groups?${stringify(params)}`);
}

// 获取用户组详情
export async function getGroupsInfo({ id }) {
  return request(`/nodeApi/auth/groups/${id}/edit`);
}

// 编辑用户组信息
export async function editGroupInfo(params) {
  return request(`/nodeApi/auth/groups/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 添加用户组
export async function addGroup(params) {
  return request('/nodeApi/auth/groups', {
    method: 'POST',
    body: params,
  });
}

// 删除用户组
export async function removeGroup(params) {
  return request(`/nodeApi/auth/groups/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 查看用户组权限
export async function getAuth(params) {
  return request(`/nodeApi/auth/groupModules/${params.id}`);
}

// 设置用户组权限
export async function setAuth(params) {
  return request(`/nodeApi/auth/groupModules/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

// 查看用户组成员
export async function getUsers(params) {
  return request(`/nodeApi/auth/groupUsers/${params.id}`);
}

// 设置用户组成员
export async function setUsers(params) {
  return request(`/nodeApi/auth/groupUsers/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}
