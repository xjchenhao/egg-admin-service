import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  ...((require('/Users/chenhao/工程/我的项目/egg-admin-server/client/src/dva.js').config || (() => ({})))()),
});

window.g_app = app;
app.use(createLoading());
app.use(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/node_modules/dva-immer/lib/index.js').default());
app.model({ namespace: 'error', ...(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/src/models/sys/error.js').default) });
app.model({ namespace: 'global', ...(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/src/models/sys/global.js').default) });
app.model({ namespace: 'login', ...(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/src/models/sys/login.js').default) });
app.model({ namespace: 'register', ...(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/src/models/sys/register.js').default) });
app.model({ namespace: 'user', ...(require('/Users/chenhao/工程/我的项目/egg-admin-server/client/src/models/sys/user.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
