import React from 'react';
import FetchDataTable from '../../../../../../../Common/FetchDataTable'; // 引入公共表格处理组件
import { FetchSeniorMenuQueryObject } from '../../../../../../../../services/customersenior';
import styles from './index.less';

class FetchMultiContent extends React.Component {
  constructor(props) {
    super(props);
    const { selectedRowKeys = [], selectedRows = [] } = props;
    this.state = {
      total: 0,
      selectAll: false,
      selectedRowKeys: selectedRowKeys || [],
      selectedRows: selectedRows || [],
      keyword: '',
    };
  }
  getValues = () => {
    const { selectAll, selectedRowKeys, selectedRows } = this.state;
    return {
      selectAll: selectAll,
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
    };
  }
  handleSelectChange = (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
    this.setState({
      selectAll: currentSelectAll,
      selectedRowKeys: currentSelectedRowKeys,
      selectedRows: selectedRows,
    });
  }
  handleSearch = (value) => {
    this.setState({
      keyword: value,
    });
  }
  render() {
    // 获取客户id和查询类型
    const { type = '', tableName, tableDispCol, tableValueCol, tableType = 1 } = this.props;
    const { keyword = '' } = this.state;
    // 页面表格定义
    const columns = [{
      title: '编码',
      dataIndex: tableValueCol,
      // dataIndex: "ID",
      render: text => text || '--',
    }, {
      title: '名称',
      dataIndex: tableDispCol,
      // dataIndex: "RYXM",
      render: text => text || '--',
    }];

    // fetchDataTable组件所需参数
    const tableParams = {
      rowKey: tableValueCol,
      columns,
      fetch: {
        service: FetchSeniorMenuQueryObject,
        params: {
          // 端口输入参数
          objectName: tableName,
          nameColumn: tableDispCol,
          idColumn: tableValueCol,
          keyWord: keyword,
          // idColumn: "ID",
          // nameColumn: "RYXM",
          // objectName: "TRYXX",
        },
      },
      rowSelection: {
        type: 'checkbox',
        crossPageSelect: true, // checkbox开启跨页全选
        selectAll: this.state.selectAll, // 是否全选
        selectedRowKeys: this.state.selectedRowKeys, // 选中(未全选)/取消选中(全选)的rowkey值
        onChange: this.handleSelectChange, // 选择状态改变时的操作
      },
      pagerDefaultClassName: 1, // pagerDefaultClassName 分页默认样式 0: 使用m-paging样式|1：使用蚂蚁默认样式
      // 分页参数
      pagination: {
        // className: 'm-paging m-paging-szyx',
        showQuickJumper: false,
        showSizeChanger: false,
        showTotal: null,
        defaultCurrent: 1,
        pageSize: 5,
        paging: 1,
      },
    };
    return (
      <div>
        <FetchDataTable
          className={styles.tableAllSelectedHidden}
          {...tableParams}
        />
      </div>
        );
  }
}
export default FetchMultiContent;
