import React, { PureComponent } from 'react';
import { Table, Divider } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps (nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render () {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'no',
      },
      {
        title: '用户名',
        dataIndex: 'description',
      },
      // {
      //   title: '真实姓名',
      //   dataIndex: 'description',
      // },
      // {
      //   title: '手机号',
      //   dataIndex: 'description',
      // },
      {
        title: '操作',
        render: () => (
          <div>
            <a href="javascript:;" onClick={() => {
              this.props.onResetPwdVisible(true);
            }}>重置密码</a>
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
          rowKey={record => record.key}
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
