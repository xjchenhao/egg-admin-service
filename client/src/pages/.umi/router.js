import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import { routerRedux } from 'dva/router';



let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/404",
        "exact": true,
        "component": require('../404.js').default
      },
      {
        "path": "/dashboard/analysis",
        "exact": true,
        "component": require('../dashboard/analysis.js').default
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default
      },
      {
        "path": "/sys/other/editProfile",
        "exact": true,
        "component": require('../sys/other/editProfile.js').default
      },
      {
        "component": () => React.createElement(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', routes: '[{"path":"/","component":"./src/layouts/index.js","routes":[{"path":"/404","exact":true,"component":"./src/pages/404.js"},{"path":"/dashboard/analysis","exact":true,"component":"./src/pages/dashboard/analysis.js"},{"path":"/","exact":true,"component":"./src/pages/index.js"},{"path":"/sys/other/editProfile","exact":true,"component":"./src/pages/sys/other/editProfile.js"}]}]' })
      }
    ]
  }
];


export default function() {
  return (
<Router history={window.g_history}>
  <Route render={({ location }) =>
    renderRoutes(routes, {}, { location })
  } />
</Router>
  );
}
