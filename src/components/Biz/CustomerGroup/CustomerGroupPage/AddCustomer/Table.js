import React from 'react';
import { Table as AntdTable, Card } from 'antd';
// import ScrollToNormalTable from '../../../../Common/ScrollToNormalTable';
// import styles from './index.less';

const columns = [{
  title: '客户号',
  dataIndex: 'khh',
  key: 'khh',
  width: 150,
}, {
  title: '客户名称',
  dataIndex: 'khxm',
  key: 'khxm',
  width: 150,
}, {
  title: '客户级别',
  dataIndex: 'khjb',
  key: 'khjb',
  width: 110,
},
// {
//   title: '昨日余额(元)',
//   dataIndex: 'zrje',
//   key: 'zrje',
//   width: 150,
// },
{
  title: '市值(元)',
  dataIndex: 'sz',
  key: 'sz',
  width: 110,
}, {
  title: '资产(元)',
  dataIndex: 'zc',
  key: 'zc',
  width: 110,
}, {
  title: '仓位(%)',
  dataIndex: 'cw',
  key: 'cw',
  width: 110,
}, {
  title: '导入前验证',
  dataIndex: 'msg',
  key: 'msg',
  width: 150,
}, {
  title: '导入结果',
  dataIndex: 'impmsg',
  key: 'impmsg',
  width: 150,
}];
class Table extends React.Component {
  state = {
    tableDatas: {
      selectAll: false,
      selectedRowKeys: [],
      dataSource: [],
    },
    scrollElement: null,
  }
  // 选择状态改变时的操作
  onSelectChange = (currentSelectedRowKeys = []) => {
    const { tableDatas } = this.state;
    this.setState({
      tableDatas: {
        ...tableDatas,
        // selectAll: currentSelectAll,
        selectedRowKeys: currentSelectedRowKeys,
      },
    });
    // const { tableDataSource = [] } = this.props;
    // let choosenData = [];
    // if (currentSelectAll) {
    //   tableDataSource.forEach((item) => {
    //     const contain = currentSelectedRowKeys.filter((chiItem) => {
    //       if (chiItem === item.khh) {
    //         return chiItem;
    //       }
    //       return null;
    //     }) || [];
    //     if (item.msg === '正常' && contain.length === 0) {
    //       choosenData.push(item.khh);
    //     }
    //   });
    // } else {
    //   choosenData = currentSelectedRowKeys;
    // }
    // if (this.props.upState) {
    //   this.props.upState(currentSelectedRowKeys.join(',')); // 选中的导入客户号字符串
    // }
  }
  getCheckboxProps = (record) => {
    if (record.msg) {
      return { disabled: record.msg !== '正常' };
    }
  };
  _setScrollElement = (scrollElement) => {
    if (scrollElement) {
      this.setState({
        scrollElement,
      });
    }
  }
  render() {
    const { tableDataSource = [], pagination = {}, handlePageChange, loading } = this.props;
    // const { tableDatas: { selectAll = false, selectedRowKeys = [] } } = this.state;
    pagination.onChange = handlePageChange;
    // const rowSelection = {
    //   type: 'checkbox',
    //   // crossPageSelect: true, // checkbox开启跨页全选  支持跨页全选时 在置灰的选择时会有bug
    //   selectAll, // 是否全选
    //   selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
    //   onChange: this.onSelectChange, // 选择状态改变时的操作
    //   getCheckboxProps: this.getCheckboxProps, // 不合规数据不可选
    // };
    const tableDatas = {
      loading,
      rowKey: 'khh',
      pagination,
      // rowSelection,
      dataSource: tableDataSource,
      scrollElement: this.state.scrollElement,
      fixedHeaderEnabled: true,
      fixedColumnCount: 1,
      isCheckboxFrz: 1, // checkbox是否需要冻结
    };
    return (
      <Card className="m-card myCard theme-padding">
        <AntdTable style={{ marginTop: '1rem' }} {...tableDatas} columns={columns} />
      </Card>
    );
  }
}

export default Table;
