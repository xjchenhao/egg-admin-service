import { Component } from 'react';
import { connect } from 'dva';
import { Layout, Icon, message } from 'antd';
import 'ant-design-pro/dist/ant-design-pro.css';
// import { enquireScreen } from 'enquire-js';
import SiderMenu from "../components/SiderMenu/SiderMenu";
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import GlobalHeader from "../components/GlobalHeader";

const { Content, Header, Footer } = Layout;


// let isMobile;
// enquireScreen((b) => {
//   isMobile = b;
// });

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  componentDidMount() {
    // enquireScreen((mobile) => {
    //   this.setState({
    //     isMobile: mobile,
    //   });
    // });
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children, location, currentUser } = this.props;
    const { collapsed } = this.state;
    return (
      <Layout>
        <SiderMenu
          logo={logo}
          collapsed={collapsed}
          menuData={getMenuData()}
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
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            { children }
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(BasicLayout);