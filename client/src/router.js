import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';

import styles from './index.less';

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/demo/user'].component;
  const BasicLayout = routerData['/demo'].component;
  const MainLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/demo/user" render={props => <UserLayout {...props} />} />
          <Route path="/demo" render={props => <BasicLayout {...props} />} />
          <Route path="/" render={props => <MainLayout {...props} />} />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
