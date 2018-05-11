import { isUrl } from '../utils/utils';

const authority = (groupName) => {
  return function (currentAuthority) {
    let groupArr = groupName;
    if (groupName.constructor.name === 'String') {
      groupArr = groupName.split(',');
    }

    console.log(currentAuthority);
    for (let i = 0, l = groupArr.length; i < l; i += 1) {
      if (currentAuthority.split(',').indexOf(groupArr[i]) > -1) {
        return true;
      }
    }
  };
};
const menuData = [{
  name: 'home',
  icon: 'home',
  path: 'home',
}, {
  name: '权限管理',
  icon: 'solution',
  path: 'auth',
  authority: authority('admin'),
  children: [{
    name: '用户管理',
    icon: 'user',
    path: 'users',
  }, {
    name: '用户组管理',
    icon: 'team',
    path: 'group',
  }, {
    name: '功能模块管理',
    icon: 'solution',
    path: 'modules',
  }],
},
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
