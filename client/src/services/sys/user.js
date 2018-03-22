import { stringify } from 'qs';
import request from '../../utils/request';

export async function login(params) {
  return request(`/nodeApi/sys/login?${stringify(params)}`);
}

export async function info(params) {
  return request(`/nodeApi/sys/userInfo${stringify(params)}`);
}
