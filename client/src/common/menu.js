/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

const authority = (groupName) => {
    return function (currentAuthority) {
      let groupArr = groupName;
      if (groupName.constructor.name === 'String') {
        groupArr = groupName.split(',');
      }
  
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
    path: '',
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
  }, {
    name: '修改个人资料',
    icon: 'user',
    path: 'editProfile',
    hideInMenu: true,
  },
  ];
  
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
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

export const getMenuData = (item) => {
  // console.log(item);
  return formatter(item);
};