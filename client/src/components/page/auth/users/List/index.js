import React, { PureComponent } from 'react';
import { Table, Divider } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { result }, loading } = this.props;

    if (!result) {
      return false;
    }
    const { list, currentPage, pages, total } = result;
    const pagination = {
      total,
      pageSize: pages,
      current: currentPage,
    };


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
                this.props.onResetPwdVisible(true, record.id);
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

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
