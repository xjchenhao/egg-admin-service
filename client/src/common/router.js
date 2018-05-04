import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const mainRouterData = {
    '/': {
      component: dynamicWrapper(app, ['sys/user', 'sys/login'], () => import('../layouts/BasicLayout')),
      // authority: 'admin',
    },
    '/home': {
      component: dynamicWrapper(app, ['sys/user', 'sys/login'], () => import('../routes/home/Index')),
      // authority: 'admin',
    },
    '/auth/users': {
      component: dynamicWrapper(app, ['auth/users'], () => import('../routes/auth/Users')),
      // authority: 'admin',
    },
    '/auth/group': {
      component: dynamicWrapper(app, ['auth/group'], () => import('../routes/auth/Group')),
      // authority: 'admin',
    },
    '/auth/modules': {
      component: dynamicWrapper(app, ['auth/modules'], () => import('../routes/auth/Modules')),
      // authority: 'admin',
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
      // authority: 'admin',
    },
    '/user/login': {
      component: dynamicWrapper(app, ['sys/login'], () => import('../routes/sys/User/Login')),
      // authority: 'admin',
    },
    '/user/register': {
      component: dynamicWrapper(app, ['sys/register'], () => import('../routes/sys/User/Register')),
      // authority: 'admin',
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/sys/User/RegisterResult')),
      // authority: 'admin',
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/sys/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/sys/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/sys/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['demo/error'], () => import('../routes/sys/Exception/triggerException')),
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
      authority: 'admin',
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
  };
  // Get name from ./menu.js or just set it in the router data.
  const routerConfig = Object.assign(mainRouterData, demoRouterData);
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
