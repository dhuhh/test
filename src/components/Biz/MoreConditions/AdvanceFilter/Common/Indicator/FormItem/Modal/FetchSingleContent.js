import React from 'react';
import { Table, message } from 'antd';
import { FetchSeniorMenuQueryObject } from '../../../../../../../../services/customersenior';

class FetchSingleContent extends React.Component {
  constructor(props) {
    super(props);
    const { selectedRowKeys = [], selectedRows = [] } = props;
    this.state = {
      total: 0,
      selectAll: false,
      selectedRowKeys: selectedRowKeys || [],
      selectedRows: selectedRows || [],
      keyword: '',
      dataSource: [],
      loading: false,
      current: 1,
    };
  }
  componentDidMount() {
    this.fetchDatas();
  }
  getValues = () => {
    const { selectAll, selectedRowKeys, selectedRows } = this.state;
    return {
      selectAll: selectAll,
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
    };
  }
  fetchDatas = (payload) => {
    const { tableName, tableDispCol, tableValueCol } = this.props;
    const { keyword = '' } = this.state;
    this.setState({
      loading: true,
    });
    FetchSeniorMenuQueryObject({
      objectName: tableName,
      nameColumn: tableDispCol,
      idColumn: tableValueCol,
      pageSize: 5,
      paging: 1,
      keyWord: keyword,
      ...payload,
    }).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({
        dataSource: records,
        loading: false,
        total,
      })
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
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
      current: 1,
    }, () => {
      this.fetchDatas({ current: 1, pageSize: 5 });
    });
  }
  render() {
    const { dataSource = [], loading, total, current = 1 } = this.state;
    // 获取客户id和查询类型
    const { tableName, tableDispCol, tableValueCol, tableType = 1 } = this.props;
    const tableDatas = {
      rowKey: tableValueCol,
      dataSource,
      columns: [
        {
          title: '编码',
          dataIndex: tableValueCol,
          render: text => text || '--',
        },
        {
          title: '名称',
          dataIndex: tableDispCol,
          render: text => text || '--',
        },
      ],
      rowSelection: {
        hideDefaultSelections: true,
        selectedRowKeys: Array.isArray(this.state.selectedRowKeys) ? this.state.selectedRowKeys : ( this.state.selectedRowKeys ? this.state.selectedRowKeys.split(',') : ''),
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.state.selectedRowKeys = selectedRowKeys;
          this.state.selectedRows = selectedRows;
          this.setState({
            selectedRowKeys,
            selectedRows,
          });
        },
      },
      pagination: {
        current,
        pageSize: 5,
        paging: 1,
        total,
        onChange: (page, pageSize) => {
          this.setState({ current: page }, () => {
            this.fetchDatas({ current: page, pageSize });
          })
        }
      },
    };
    return (
      <div>
        <Table hideDefaultSelections loading={loading} {...tableDatas} />
      </div>
    );
  }
}
export default FetchSingleContent;
