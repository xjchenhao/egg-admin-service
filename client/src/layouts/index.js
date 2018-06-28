import React, { Fragment,Component } from 'react';
import { connect } from 'dva';
import { Layout, LocaleProvider, Icon } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
import { enquireScreen } from 'enquire-js';
import SiderMenu from "../components/SiderMenu/SiderMenu";
import { getMenuData } from '../common/menu';
import GlobalHeader from "../components/GlobalHeader";
import GlobalFooter from 'ant-design-pro/lib/GlobalFooter';
import SimpleLayout from "./userLayout"
import router from 'umi/router';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {company,version,logo} from './../utils/config';

const { Content, Header, Footer } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  componentDidMount () {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });

    if (this.props.location.pathname === '/sys/user/login') {
      return;
    }

    this.props.dispatch({
      type: 'global/fetchSidebar',
    });

    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }


  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  handleMenuClick = ({ key }) => {

    if (key === 'triggerError') {
      // this.props.dispatch(routerRedux.push('/sys/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
    if (key === 'setting') {
      router.push('/sys/other/editProfile');
      // this.props.dispatch(routerRedux.push('/editProfile'));
    }
  };

  render () {
    const { children, location, currentUser, sidebar } = this.props;
    const { collapsed } = this.state;

    if (this.props.location.pathname === '/sys/user/login') {
      return <SimpleLayout>{this.props.children}</SimpleLayout>
    }

    return (
      <LocaleProvider locale={zhCN}>
        <Layout>
          <SiderMenu
            logo={logo}
            collapsed={collapsed}
            menuData={getMenuData(sidebar)}
            location={location}
            onCollapse={this.handleMenuCollapse}
          />
          <Layout>
            <Header style={{ padding: 0 }}>
              <GlobalHeader
                logo={logo}
                collapsed={collapsed}
                currentUser={currentUser}
                // currentUser={{
                //   name: 'Serati Ma',
                //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                //   userid: '00000001',
                //   notifyCount: 12,
                // }}
                onCollapse={this.handleMenuCollapse}
                onMenuClick={this.handleMenuClick}
              />
            </Header>
            <Content style={{ margin: '24px 24px 0', height: '100%' }}>
              {children}
            </Content>
            <Footer style={{ padding: 0 }}>
              <GlobalFooter
                copyright={
                  <Fragment>
                    Copyright <Icon type="copyright" /> {version} {company}
                </Fragment>
                }
              />
            </Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  sidebar: global.sidebar,
}))(BasicLayout);