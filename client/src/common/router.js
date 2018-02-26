import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  // eslint-disable-next-line no-underscore-dangle
  models: () => models.filter(m => !app._models.some(({ namespace }) => namespace === m)).map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const routerData = getRouterData(app);
    return component().then((raw) => {
      const Component = raw.default || raw;
      return props => <Component {...props} routerData={routerData} />;
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const mainRouterData = {
    '/': {
      component: dynamicWrapper(app, ['demo/user', 'demo/login'], () => import('../layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper(app, ['demo/user', 'demo/login'], () => import('../routes/home/Index')),
    },
    '/auth/users': {
      component: dynamicWrapper(app, ['auth/users'], () => import('../routes/auth/Users')),
    },
  };

  const demoRouterData = {
    '/demo/dashboard/analysis': {
      component: dynamicWrapper(app, ['demo/chart'], () => import('../routes/demo/Dashboard/Analysis')),
    },
    '/demo/dashboard/monitor': {
      component: dynamicWrapper(app, ['demo/monitor'], () => import('../routes/demo/Dashboard/Monitor')),
    },
    '/demo/dashboard/workplace': {
      component: dynamicWrapper(app, ['demo/project', 'demo/activities', 'demo/chart'], () => import('../routes/demo/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
    },
    '/demo/form/basic-form': {
      component: dynamicWrapper(app, ['demo/form'], () => import('../routes/demo/Forms/BasicForm')),
    },
    '/demo/form/step-form': {
      component: dynamicWrapper(app, ['demo/form'], () => import('../routes/demo/Forms/StepForm')),
    },
    '/demo/form/step-form/info': {
      component: dynamicWrapper(app, ['demo/form'], () => import('../routes/demo/Forms/StepForm/Step1')),
    },
    '/demo/form/step-form/confirm': {
      component: dynamicWrapper(app, ['demo/form'], () => import('../routes/demo/Forms/StepForm/Step2')),
    },
    '/demo/form/step-form/result': {
      component: dynamicWrapper(app, ['demo/form'], () => import('../routes/demo/Forms/StepForm/Step3')),
    },
    '/demo/form/advanced-form': {
      component: dynamicWrapper(app, ['demo/form'], () => import('../routes/demo/Forms/AdvancedForm')),
    },
    '/demo/list/table-list': {
      component: dynamicWrapper(app, ['demo/rule'], () => import('../routes/demo/List/TableList')),
    },
    '/demo/list/basic-list': {
      component: dynamicWrapper(app, ['demo/list'], () => import('../routes/demo/List/BasicList')),
    },
    '/demo/list/card-list': {
      component: dynamicWrapper(app, ['demo/list'], () => import('../routes/demo/List/CardList')),
    },
    '/demo/list/search': {
      component: dynamicWrapper(app, ['demo/list'], () => import('../routes/demo/List/List')),
    },
    '/demo/list/search/projects': {
      component: dynamicWrapper(app, ['demo/list'], () => import('../routes/demo/List/Projects')),
    },
    '/demo/list/search/applications': {
      component: dynamicWrapper(app, ['demo/list'], () => import('../routes/demo/List/Applications')),
    },
    '/demo/list/search/articles': {
      component: dynamicWrapper(app, ['demo/list'], () => import('../routes/demo/List/Articles')),
    },
    '/demo/profile/basic': {
      component: dynamicWrapper(app, ['demo/profile'], () => import('../routes/demo/Profile/BasicProfile')),
    },
    '/demo/profile/advanced': {
      component: dynamicWrapper(app, ['demo/profile'], () => import('../routes/demo/Profile/AdvancedProfile')),
    },
    '/demo/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/demo/Result/Success')),
    },
    '/demo/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/demo/Result/Error')),
    },
    '/demo/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/demo/Exception/403')),
    },
    '/demo/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/demo/Exception/404')),
    },
    '/demo/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/demo/Exception/500')),
    },
    '/demo/exception/trigger': {
      component: dynamicWrapper(app, ['demo/error'], () => import('../routes/demo/Exception/triggerException')),
    },
    '/demo/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/demo/user/login': {
      component: dynamicWrapper(app, ['demo/login'], () => import('../routes/demo/User/Login')),
    },
    '/demo/user/register': {
      component: dynamicWrapper(app, ['demo/register'], () => import('../routes/demo/User/Register')),
    },
    '/demo/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/demo/User/RegisterResult')),
    },
    // '/demo/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/demo/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const routerData = Object.assign(mainRouterData, demoRouterData);
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
