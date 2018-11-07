import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Modal, Divider, Transfer, Table, Tree,Popconfirm } from 'antd';
import PageHeaderLayout from './../../layouts/pageHeaderLayout';

import styles from './../../utils/utils.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const { TreeNode } = Tree;

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
          {form.getFieldDecorator('name', {
            initialValue: data.name,
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
          {form.getFieldDecorator('describe', {
            initialValue: data.describe,
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

// 成员管理弹框
const MemberModal = connect(state => ({
  pageModel: state.group,
}))((props) => {
  const { visible, onOk, onCancel, pageModel: { member: data }, dispatch } = props;

  const handleChange = (targetKeys, direction, moveKeys) => {
    if (direction === 'right') {
      dispatch({
        type: 'group/changeMember',
        payload: {
          ...data,
          addList: data.addList.concat(moveKeys),
        },
      });
    }
    if (direction === 'left') {
      dispatch({
        type: 'group/changeMember',
        payload: {
          ...data,
          addList: data.addList.filter(item => moveKeys.indexOf(item) < 0),
        },
      });
    }
  };

  return (
    <Modal
      title="成员管理"
      visible={visible}
      onOk={(e) => {
        e.preventDefault();
        onOk(data.addList);
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Transfer
        dataSource={data.allList}
        titles={['未添加', '已添加']}
        targetKeys={data.addList}
        onChange={handleChange}
        render={item => item.label}
      />
    </Modal>
  );
});

// 权限管理弹框
const AuthModal = connect(state => ({
  pageModel: state.group,
}))((props) => {
  const { visible, onOk, onCancel, pageModel: { authority: data }, dispatch } = props;

  const handleChange = (selectedKeys) => {
    dispatch({
      type: 'group/changeAuth',
      payload: {
        ...data,
        addList: selectedKeys,
      },
    });
  };

  const loop = (allList) => {
    return allList.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  };

  return (
    <Modal
      title="权限管理"
      visible={visible}
      onOk={(e) => {
        e.preventDefault();
        onOk(data.addList);
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <div style={{ height: '300px', overflowY: 'auto' }}>
        {
          data.allList ? (
            <Tree
              checkable
              defaultExpandedKeys={data.addList.map(item => String(item))}
              defaultSelectedKeys={data.addList.map(item => String(item))}
              defaultCheckedKeys={data.addList.map(item => String(item))}
              onCheck={handleChange}
            >
              {loop(data.allList)}
            </Tree>
          ) : ''
        }
      </div>
    </Modal>
  );
});

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
    memberModal: {
      id: '',
      isVisible: false,
    },
    authModal: {
      id: '',
      isVisible: false,
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

  // 显示or隐藏成员管理弹框
  handleMemberVisible = (flag, id = ' ') => {
    const { dispatch } = this.props;

    if (flag) {
      dispatch({
        type: 'group/getMember',
        payload: {
          id,
        },
      });
      this.setState(Object.assign(this.state.memberModal, {
        id,
        isVisible: true,
      }));
    } else {
      this.setState(Object.assign(this.state.memberModal, {
        id: '',
        isVisible: false,
      }));
      dispatch({
        type: 'group/resetMember',
      });
    }
  }

  // 修改成员管理
  handleMemberSubmit = async (addIdList) => {
    const { memberModal: { id } } = this.state;
    const { dispatch } = this.props;

    await dispatch({
      type: 'group/setMember',
      payload: {
        id,
        idList: addIdList,
      },
    });
    await dispatch({
      type: 'group/resetMember',
    });

    this.handleMemberVisible(false);
  }

  // 显示or隐藏权限管理弹框
  handleAuthVisible = (flag, id = ' ') => {
    const { dispatch } = this.props;

    if (flag) {
      dispatch({
        type: 'group/getAuth',
        payload: {
          id,
        },
      });
      this.setState(Object.assign(this.state.authModal, {
        id,
        isVisible: true,
      }));
    } else {
      this.setState(Object.assign(this.state.authModal, {
        id: '',
        isVisible: false,
      }));
      dispatch({
        type: 'group/resetAuth',
      });
    }
  }

  // 修改权限管理
  handleAuthSubmit = async (addIdList) => {
    const { authModal: { id } } = this.state;
    const { dispatch } = this.props;

    await dispatch({
      type: 'group/setAuth',
      payload: {
        id,
        idList: addIdList,
      },
    });
    await dispatch({
      type: 'group/resetAuth',
    });

    this.handleAuthVisible(false);
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
      payload: {
        currentPage:1
      },
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
              {getFieldDecorator('name')(
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
    const { editModal, memberModal, authModal } = this.state;

    const pagination={
      current: data.pagination.currentPage,
      pageSize: data.pagination.pages,
      total: data.pagination.total,
    };

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
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '描述',
        key: 'describe',
        dataIndex: 'describe',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <a
              onClick={() => {
                this.handleAuthVisible(true, record.key);
              }}
            >权限管理
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleMemberVisible(true, record.key);
              }}
            >成员管理
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                this.handleEditVisible(true, record.key);
              }}
            >修改
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                this.handleRemove(record.key);
              }}>
              <a
              >删除
            </a>
            </Popconfirm>
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
            <Divider />
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
                ...pagination,
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
        <MemberModal
          visible={memberModal.isVisible}
          onOk={this.handleMemberSubmit}
          onCancel={() => this.handleMemberVisible()}
        />
        <AuthModal
          visible={authModal.isVisible}
          onOk={this.handleAuthSubmit}
          onCancel={() => this.handleAuthVisible()}
        />
      </PageHeaderLayout>
    );
  }
}
