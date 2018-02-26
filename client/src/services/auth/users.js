import { stringify } from 'qs';
import request from '../../utils/request';

// users: '/nodeApi/auth/users',                   // 用户管理
// usersPwd: '/nodeApi/auth/usersPwd',             // 用户管理-重置密码
// groups: '/nodeApi/auth/groups',                 // 用户组管理
// modules: '/nodeApi/auth/modules',               // 功能模块管理
// groupUsers: '/nodeApi/auth/groupUsers',         // 用户组管理-成员设置
// groupModules: '/nodeApi/auth/groupModules',     // 用户组管理-权限查看

export async function getList(params) {
  return request(`/nodeApi/auth/users?${stringify(params)}`);
}

export async function resetPwd(params) {
  return request(`/nodeApi/auth/usersPwd/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
