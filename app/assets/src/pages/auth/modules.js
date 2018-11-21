import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, InputNumber, Button,Switch, Modal, Divider, Table, Breadcrumb, TreeSelect, Icon, Select,Popconfirm } from 'antd';
import PageHeaderLayout from './../../layouts/pageHeaderLayout';

import styles from './../../assets/style/global.less';


const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// 添加or编辑弹框
const EditModal = connect(state => ({
  pageModel: state.modules,
}))(Form.create()((props) => {
  const { visible, onOk, onCancel, form, isEdit, dispatch,
    pageModel: { details: data, breadcrumb: breadcrumbData, systemTree } } = props;
  const moduleParent = breadcrumbData[breadcrumbData.length - 1];

  const transform = (list) => {
    if (!list || !list.length) {
      return [];
    }

    return list.map((obj) => {
      return {
        label: obj.name,
        value: String(obj.id),
        key: obj.id,
        children: transform(obj.children),
      };
    });
  };

  const treeData = transform(systemTree.data);

  const onChange = (value) => {
    dispatch({
      type: 'modules/changeSystemTreeCheckedId',
      payload: {
        id: value,
      },
    });
  };

  const renderModuleParentItem = (parentId) => {
    const moduleParentName = moduleParent.name;

    if (isEdit) {
      if (parentId !== '') {
        return (form.getFieldDecorator('parent_id', {
          initialValue: String(parentId),
        })(
          <TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            onChange={onChange}
          />
        ));
      } else {
        return (form.getFieldDecorator('parent_id', {
          initialValue: '',
        })(
          <div>{breadcrumbData[0].name}</div>
        ));
      }
    } else {
      return moduleParentName;
    }
  };

  return (
    <Modal
      title={isEdit ? '修改模块' : '添加同级模块'}
      visible={visible}
      onOk={(e) => {
        e.preventDefault();

        form.validateFields((err, fieldsValue) => {
          if (err) return;
          if (isEdit) {
            onOk({
              ...fieldsValue,
              id: data.id,
              parent_id: String(fieldsValue.parent_id),
            }, form.resetFields);
          } else {
            onOk({
              ...fieldsValue,
              parent_id: moduleParent.id,
            }, form.resetFields);
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
          label="父模块"
        >
          {renderModuleParentItem(data.parent_id)}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="模块名称"
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
          label="权限标识"
        >
          {form.getFieldDecorator('uri', {
            initialValue: data.uri,
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
          label="是否是菜单"
        >
          {form.getFieldDecorator('isMenu', { valuePropName: 'checked',initialValue: data.isMenu })(
            <Switch />
          )}
        </FormItem>
        {form.getFieldValue('isMenu')?(<FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="菜单地址"
        >
          {form.getFieldDecorator('url', {
            initialValue: data.url,
            rules: [
              // { required: true, message: '该项为必填项' },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>):''}
        {form.getFieldValue('isMenu')?(<FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="iconfont"
        >
          {form.getFieldDecorator('iconfont', {
            initialValue: data.iconfont,
            rules: [
              // { required: true, message: '该项为必填项' },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>):''}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="描述"
        >
          {form.getFieldDecorator('describe', {
            initialValue: data.describe,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="排序"
        >
          {form.getFieldDecorator('sort', {
            initialValue: data.sort,
            rules: [{
              type: 'number', message: '请输入数字',
            },
            ],
          })(
            <InputNumber placeholder="请输入" />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}));

@connect(state => ({
  pageModel: state.modules,
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

    // 获取系统树，用来编辑模块的时候用
    dispatch({
      type: 'modules/getSystemTree',
      payload: {},
    });

    // 获取列表数据
    dispatch({
      type: 'modules/fetch',
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
      type: 'modules/fetch',
      payload: {
        ...params,
      },
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
        type: 'modules/fetch',
        payload: {
          ...fieldsValue,
        },
      });

      dispatch({
        type: 'modules/initBreadcrumb',
        payload: {},
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
          type: 'modules/details',
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
        type: 'modules/reset',
      });
    }
  }

  // 添加or编辑
  handleEditSubmit = (fieldsValue, resetFormCallBack) => {
    const { editModal: { isEdit } } = this.state;
    const { dispatch } = this.props;
    if (isEdit) {
      console.log(fieldsValue);
      dispatch({
        type: 'modules/edit',
        payload: {
          ...fieldsValue,
          parent_id:fieldsValue.parent_id,
        },
        callback: resetFormCallBack,
      });

      this.setState(Object.assign(this.state.editModal, {
        isVisible: false,
      }));
    } else {
      dispatch({
        type: 'modules/add',
        payload: {
          ...fieldsValue,
          parent_id:fieldsValue.parent_id,
        },
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
      type: 'modules/remove',
      payload: {
        id,
      },
    });
    dispatch({
      type: 'modules/getSystemTree',
      payload: {},
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
      type: 'modules/fetch',
      payload: {
        currentPage:1
      },
    });

    dispatch({
      type: 'modules/initBreadcrumb',
      payload: {},
    });
  }

  // 进入模块
  handleIntoModule = (id, name) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'modules/intoModule',
      payload: {
        id,
        name,
      },
    });
  }

  // 退出模块
  handleOutModule = (id) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'modules/outModule',
      payload: {
        id,
      },
    });
  }

  // 切换搜索条件的展示方式
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  // 功能模块查询选项
  renderQueryModuleOption = () => {
    const { pageModel: { systemTree } } = this.props;

    return (
      <Select>
        <Option value="">全部</Option>
        {
          systemTree.data.map((item) => {
            return <Option value={item.id} key={item.id}>{item.name}</Option>;
          })
        }
      </Select>
    );
  }

  // 搜索条件的展示方式———收起
  renderSimpleForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="功能模块">
              {getFieldDecorator('parent_id', {
                initialValue: '',
              })(
                this.renderQueryModuleOption()
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="模块名称">
              {getFieldDecorator('name')(
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

  // 搜索条件的展示方式———展开
  renderAdvancedForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="功能模块">
              {getFieldDecorator('parent_id', {
                initialValue: '',
              })(
                this.renderQueryModuleOption()
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="模块名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="模块Url">
              {getFieldDecorator('url')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden',marginTop:10 }}>
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

  // 选择搜索条件的展示方式
  renderForm = () => {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  // 模块管理面包屑
  renderBreadcrumb = () => {
    const { pageModel: { breadcrumb } } = this.props;
    const { length } = breadcrumb;

    return (
      <Breadcrumb>
        {
          breadcrumb.map((item, i) => {
            if (i !== length - 1) {
              return (
                <Breadcrumb.Item key={item.id}>
                  <a onClick={() => {
                    this.handleOutModule(item.id);
                  }}
                  >{item.name}
                  </a>
                </Breadcrumb.Item>
              );
            } else {
              return (<Breadcrumb.Item key={item.id}>{item.name}</Breadcrumb.Item>);
            }
          })
        }
      </Breadcrumb>
    );
  }

  render() {
    const { pageModel: { loading: ruleLoading, data } } = this.props;
    const { editModal } = this.state;

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
        title: '模块名称',
        key: 'name',
        dataIndex: 'name',
        render: (text, record) => (
          <a
            onClick={() => {
              this.handleIntoModule(record.id, text);
            }}
          >{text}
          </a>),
      },
      {
        title: '权限标识',
        key: 'uri',
        dataIndex: 'uri',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '描述',
        key: 'describe',
        dataIndex: 'describe',
        render: (text) => {
          return text || '--';
        },
      },
      {
        title: '排序',
        key: 'sort',
        dataIndex: 'sort',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <div>
            <a
              onClick={() => {
                this.handleEditVisible(true, record.id);
              }}
            >修改
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除？"
              onConfirm={() => {
                this.handleRemove(record.id);
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
      <PageHeaderLayout title="功能模块管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <Divider />
            <div className={styles.tableListOperator}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={12} sm={24}>
                  {this.renderBreadcrumb()}
                </Col>
                <Col md={12} sm={24}>
                  <div style={{ textAlign: 'right' }}><Button icon="plus" type="primary" onClick={() => this.handleEditVisible(true)}>添加同级模块</Button></div>
                </Col>
              </Row>
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
      </PageHeaderLayout>
    );
  }
}
