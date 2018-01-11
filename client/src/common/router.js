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
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/home': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../routes/Home/home')),
    },
  };

  const demoRouterData = {
    '/demo': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/demo/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Demo/Dashboard/Analysis')),
    },
    '/demo/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Demo/Dashboard/Monitor')),
    },
    '/demo/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Demo/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
    },
    '/demo/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Demo/Forms/BasicForm')),
    },
    '/demo/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Demo/Forms/StepForm')),
    },
    '/demo/form/step-form/info': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Demo/Forms/StepForm/Step1')),
    },
    '/demo/form/step-form/confirm': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Demo/Forms/StepForm/Step2')),
    },
    '/demo/form/step-form/result': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Demo/Forms/StepForm/Step3')),
    },
    '/demo/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Demo/Forms/AdvancedForm')),
    },
    '/demo/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Demo/List/TableList')),
    },
    '/demo/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Demo/List/BasicList')),
    },
    '/demo/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Demo/List/CardList')),
    },
    '/demo/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Demo/List/List')),
    },
    '/demo/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Demo/List/Projects')),
    },
    '/demo/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Demo/List/Applications')),
    },
    '/demo/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Demo/List/Articles')),
    },
    '/demo/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Demo/Profile/BasicProfile')),
    },
    '/demo/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Demo/Profile/AdvancedProfile')),
    },
    '/demo/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/Result/Success')),
    },
    '/demo/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/Result/Error')),
    },
    '/demo/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/Exception/403')),
    },
    '/demo/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/Exception/404')),
    },
    '/demo/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/Exception/500')),
    },
    '/demo/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Demo/Exception/triggerException')),
    },
    '/demo/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/demo/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/Demo/User/Login')),
    },
    '/demo/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/Demo/User/Register')),
    },
    '/demo/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/Demo/User/RegisterResult')),
    },
    // '/demo/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Demo/User/SomeComponent')),
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
