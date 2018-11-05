import { message } from 'antd';
// const dispatch=window.g_app._store.dispatch;

// const 

export function config() {
  return {
    onError(err: { preventDefault: Function, message: Function }) {
      err.preventDefault();
      message.error(err.message);
    },
    initialState: {
      // user: {
      //   currentUser:{
      //     name: 'chenhao',
      //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      //     userid: '00000001',
      //     notifyCount: 12,
      //   }
      // },
    },
  };
}