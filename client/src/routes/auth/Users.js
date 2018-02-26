import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, Dropdown, Menu, Modal, Divider } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from './../../layouts/PageHeaderLayout';

import styles from './Users.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  users: state.users,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formQuery: {},
    resetPwdModal: {
      visible: false,
      form: {
        user_password: '',
      },
    },
    editModal: {
      visible: false,
      form: {
        id: '',
        user_account: '',
        user_name: '',
        user_email: '',
        user_mobile: '',
        user_password: '',
      },
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formQuery } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formQuery,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'users/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formQuery: {},
    });
    dispatch({
      type: 'users/fetch',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'users/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formQuery: values,
      });

      dispatch({
        type: 'users/fetch',
        payload: values,
      });
    });
  }

  handleEditVisible = (flag, id) => {
    this.setState(Object.assign(this.state.editModal, {
      visible: !!flag,
    }));
    this.setState(Object.assign(this.state.editModal.form, {
      id,
    }));
  }

  handleResetPwdVisible = (flag, id) => {
    if (!flag) {
      this.props.form.resetFields();
      this.setState(Object.assign(this.state.resetPwdModal, {
        visible: false,
      }));
    } else {
      this.setState(Object.assign(this.state.resetPwdModal, {
        visible: true,
      }));
      this.setState(Object.assign(this.state.resetPwdModal.form, {
        id,
      }));
    }
  }

  // resetPwdModal

  handleEditInput = (e, key) => {
    this.setState(Object.assign(this.state.editModal.form, {
      [key]: e.target.value,
    }));
  }

  handleEditSubmit = () => {
    console.log(this.state.editModal.form);
  }

  handleResetPwdSubmit = (e) => {
    e.preventDefault();

    const { dispatch } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'users/resetPwd',
        payload: {
          id: this.state.resetPwdModal.form.id,
          ...fieldsValue,
        },
      });

      this.setState(Object.assign(this.state.resetPwdModal, {
        visible: false,
      }));
      this.props.form.resetFields();
    });
  }

  // handleAdd = () => {
  //   this.props.dispatch({
  //     type: 'rule/add',
  //     payload: {
  //       description: this.state.addInputValue,
  //     },
  //   });

  //   message.success('添加成功');
  //   this.setState({
  //     modalVisible: false,
  //   });
  // }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登录名">
              {getFieldDecorator('user_account')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('user_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登录名">
              {getFieldDecorator('user_account')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('user_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="邮箱">
              {getFieldDecorator('user_email')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('user_mobile')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { users: { loading: ruleLoading, data } } = this.props;
    const { selectedRows, editModal, resetPwdModal } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );
    const columns = [
      {
        title: '序号',
        // dataIndex: 'no',
        render(text, record, index) {
          return index + 1;
        },
      },
      {
        title: '用户名',
        dataIndex: 'user_account',
      },
      {
        title: '真实姓名',
        dataIndex: 'user_name',
      },
      {
        title: '手机号',
        dataIndex: 'user_mobile',
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            <a
              onClick={() => {
                this.handleResetPwdVisible(true, record.id);
              }}
            >重置密码
            </a>
            <Divider type="vertical" />
            <a href="">修改</a>
            <Divider type="vertical" />
            <a href="">删除</a>
          </div>
        ),
      },
    ];

    const formEdit = editModal.form;

    return (
      <PageHeaderLayout title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleEditVisible(true)}>
                添加
              </Button>
              {
                selectedRows.length > 0 && (
                  <span>
                    {/* <Button>删除</Button> */}
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Modal
          title="添加用户"
          visible={editModal.visible}
          onOk={this.handleEditSubmit}
          onCancel={() => this.handleEditVisible()}
        >
          <Form>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="登录名"
            >
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.handleEditInput(e, 'user_account');
                }}
                value={formEdit.user_account}
              />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="真实姓名"
            >
              <Input
                placeholder="请输入"
                onChange={(e) => {
                  this.handleEditInput(e, 'user_name');
                }}
                value={formEdit.user_name}
              />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="邮箱"
            >
              <Input
                type="email"
                placeholder="请输入"
                onChange={(e) => {
                  this.handleEditInput(e, 'user_email');
                }}
                value={formEdit.user_email}
              />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="手机号"
            >
              <Input
                type="tel"
                placeholder="请输入"
                onChange={(e) => {
                  this.handleEditInput(e, 'user_mobile');
                }}
                value={formEdit.user_mobile}
              />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="密码"
            >
              <Input
                type="password"
                placeholder="请输入"
                onChange={(e) => {
                  this.handleEditInput(e, 'user_password');
                }}
                value={formEdit.user_password}
              />
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="重置密码"
          visible={resetPwdModal.visible}
          onOk={this.handleResetPwdSubmit}
          onCancel={() => this.handleResetPwdVisible()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="密码"
          >
            {this.props.form.getFieldDecorator('user_password', {
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
      </PageHeaderLayout>
    );
  }
}
