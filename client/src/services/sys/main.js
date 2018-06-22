import { stringify } from 'qs';
import request from '../../utils/request';

export async function sidebar(params) {
  return request(`/nodeApi/sys/sidebar?${stringify(params)}`);
}
