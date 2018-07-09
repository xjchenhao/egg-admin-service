// import {PageHeader as PageHeaderLayout} from 'ant-design-pro/lib';
import PageHeaderLayout from '../../../layouts/pageHeaderLayout';
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Modal,
} from 'antd';

const FormItem = Form.Item;

// 重置密码弹框
const ResetPwdModal = Form.create()((props) => {
  const { visible, form, onCancel, onOk } = props;

  return (
    <Modal
      title="重置密码"
      visible={visible}
      onOk={(e) => {
        e.preventDefault();

        form.validateFields((err, fieldsValue) => {
          if (err) return;
          onOk(fieldsValue);
        });
        form.resetFields();
      }}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="密码"
        extra="密码重置后讲立即生效，需要重新登录"
      >
        {form.getFieldDecorator('password', {
          rules: [
            { required: true, message: '请输入密码' },
            { min: 6, message: '请输入6-18位密码' },
            { max: 18, message: '请输入6-18位密码' },
          ],
        })(
          <Input type="password" placeholder="请输入" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(state => ({
  pageModel: state.user,
  submitting: state.loading.effects['user/setProfile'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    resetPwdModal: {
      isVisible: false,
      data: {
        id: '',
        password: '',
      },
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;

    // 获取列表数据
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  // 显示or隐藏重置密码弹框
  handleResetPwdVisible = (flag) => {
    const { pageModel: { currentUser: data } } = this.props;
    const { id } = data;

    this.setState(Object.assign(this.state.resetPwdModal, {
      isVisible: flag,
    }));
    this.setState(Object.assign(this.state.resetPwdModal.data, {
      id,
    }));
  }

  // 重置密码
  handleResetPwdSubmit = (fieldsValue) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/resetPwd',
      payload: {
        id: this.state.resetPwdModal.data.id,
        ...fieldsValue,
      },
    });

    this.setState(Object.assign(this.state.resetPwdModal, {
      isVisible: false,
    }));


    dispatch(routerRedux.push('/sys/user/login'));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/setProfile',
          payload: values,
        });
      }
    });
  };
  render() {
    const { pageModel: { currentUser: data }, submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { resetPwdModal } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout
        title="修改个人资料"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('account', {
                initialValue: data.account,
                rules: [
                  {
                    required: true,
                    message: '请输入账号',
                  },
                ],
              })(<Input placeholder="请设置用于登录的登录名" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="真实姓名">
              {getFieldDecorator('name', {
                initialValue: data.name,
                rules: [
                  {
                    required: true,
                    message: '请输入真实姓名',
                  },
                ],
              })(<Input placeholder="请设置真实姓名" disabled />)}
            </FormItem>
            <FormItem {...formItemLayout} label="手机号">
              {getFieldDecorator('mobile', {
                initialValue: data.mobile,
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                ],
              })(<Input placeholder="请输入手机号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="邮箱">
              {getFieldDecorator('email', {
                initialValue: data.email,
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱',
                  },
                ],
              })(<Input placeholder="请输入邮箱" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              <a
                onClick={() => {
                  this.handleResetPwdVisible(true);
                }}
              >重置密码
              </a>
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
        <ResetPwdModal
          visible={resetPwdModal.isVisible}
          onOk={this.handleResetPwdSubmit}
          onCancel={() => this.handleResetPwdVisible()}
        />
      </PageHeaderLayout>
    );
  }
}
