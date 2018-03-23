import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Divider, Table } from 'antd';
import PageHeaderLayout from './../../layouts/PageHeaderLayout';

import styles from './Users.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// 添加or编辑弹框
const EditModal = connect(state => ({
  pageModel: state.group,
}))(Form.create()((props) => {
  const { visible, onOk, onCancel, form, isEdit, pageModel: { details: data } } = props;

  return (
    <Modal
      title={isEdit ? '编辑用户组' : '添加用户组'}
      visible={visible}
      onOk={(e) => {
        e.preventDefault();

        form.validateFields((err, fieldsValue) => {
          if (err) return;
          if (isEdit) {
            onOk({
              id: data.id,
              ...fieldsValue,
            }, form.resetFields);
          } else {
            onOk(fieldsValue, form.resetFields);
          }
        });
      }}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
    >
      <Form>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="用户组"
        >
          {form.getFieldDecorator('role_name', {
            initialValue: data.role_name,
            rules: [
              { required: true, message: '该项为必填项' },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
        >
          {form.getFieldDecorator('role_summary', {
            initialValue: data.role_summary,
            rules: [
              { required: true, message: '该项为必填项' },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}));

@connect(state => ({
  pageModel: state.group,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    formQuery: {},
    editModal: {
      isVisible: false,
      isEdit: false,
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;

    // 获取列表数据
    dispatch({
      type: 'group/fetch',
    });
  }

  // 分页、排序、筛选变化时触发
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
      type: 'group/fetch',
      payload: params,
    });
  }

  // 根据查询条件搜索
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        formQuery: fieldsValue,
      });

      dispatch({
        type: 'group/fetch',
        payload: fieldsValue,
      });
    });
  }

  // 显示or隐藏编辑弹框
  handleEditVisible = (flag, id = '') => {
    const { dispatch } = this.props;

    if (flag) {
      // 根据有没有传id判断是否是编辑弹窗
      if (id) {
        dispatch({
          type: 'group/details',
          payload: {
            id,
          },
        });
        this.setState(Object.assign(this.state.editModal, {
          isEdit: true,
          isVisible: true,
        }));
      } else {
        this.setState(Object.assign(this.state.editModal, {
          isEdit: false,
          isVisible: true,
        }));
      }
      this.setState(Object.assign(this.state.editModal, {
        isVisible: true,
      }));
    } else {
      this.setState(Object.assign(this.state.editModal, {
        isEdit: false,
        isVisible: false,
      }));
      dispatch({
        type: 'group/reset',
      });
    }
  }

  // 添加or编辑
  handleEditSubmit = (fieldsValue, resetFormCallBack) => {
    const { editModal: { isEdit } } = this.state;
    const { dispatch } = this.props;
    if (isEdit) {
      dispatch({
        type: 'group/edit',
        payload: fieldsValue,
        callback: resetFormCallBack,
      });

      this.setState(Object.assign(this.state.editModal, {
        isVisible: false,
      }));
    } else {
      dispatch({
        type: 'group/add',
        payload: fieldsValue,
        callback: resetFormCallBack,
      });

      this.setState(Object.assign(this.state.editModal, {
        isVisible: false,
      }));
    }
  }

  // 删除项目
  handleRemove = (id) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'group/remove',
      payload: {
        id,
      },
    });
  }

  // 重置查询条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formQuery: {},
    });
    dispatch({
      type: 'group/fetch',
      payload: {},
    });
  }

  // 选择搜索条件的展示方式
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="组名称">
              {getFieldDecorator('role_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { pageModel: { loading: ruleLoading, data } } = this.props;
    const { editModal } = this.state;

    const columns = [
      {
        title: '序号',
        key: 'index',
        render(text, record, index) {
          return index + 1;
        },
      },
      {
        title: '组名称',
        key: 'role_name',
        dataIndex: 'role_name',
      },
      {
        title: '描述',
        key: 'role_summary',
        dataIndex: 'role_summary',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <a
              onClick={() => {
                // this.handleEditVisible(true, record.id);
              }}
            >权限管理
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                // this.handleEditVisible(true, record.id);
              }}
            >成员管理
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleEditVisible(true, record.id);
              }}
            >修改
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleRemove(record.id);
              }}
            >删除
            </a>
          </div>
        ),
      },
    ];

    return (
      <PageHeaderLayout title="用户组管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleEditVisible(true)}>
                添加
              </Button>
            </div>
            <Table
              loading={ruleLoading}
              dataSource={data.list}
              rowKey={record => record.id}
              columns={columns}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                ...data.pagination,
              }}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <EditModal
          visible={editModal.isVisible}
          isEdit={editModal.isEdit}
          onOk={this.handleEditSubmit}
          onCancel={() => this.handleEditVisible()}
        />
      </PageHeaderLayout>
    );
  }
}
