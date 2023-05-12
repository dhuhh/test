import React from 'react';
import { Table } from 'antd';
import styles from './index.less';

class Content extends React.Component {
  constructor(props) {
    super(props);
    const { data = [], selectedRowKeys = [], selectedRows = [], loading } = props;
    this.state = {
      data,
      selectedRowKeys,
      selectedRows,
      loading,
    };
  }
  // componentWillReceiveProps() {
  //   const { data = [], selectedRowKeys = [] } = this.props;
  //   this.state = {
  //     selectedRowKeys,
  //     data,
  //   };
  // }
  getValues = () => {
    return {
      selectedRowKeys: this.state.selectedRowKeys,
      selectedRows: this.state.selectedRows,
    };
  }
  handleSearch = (value) => {
    this.setState({
      loading: true,
    });
    const filterData = this.props.data.filter((item) => { return (item.note.indexOf(value) >= 0 || item.ibm.indexOf(value) >= 0); });
    this.setState({
      data: filterData,
      loading: false,
    });
  }
  changeDataForm = (data) => {
    const dataSource = [];
    data.forEach((item) => {
      const { ibm, note } = item;
      dataSource.push({
        key: ibm,
        ibm,
        note,
      });
    });
    return dataSource;
  }
  render() {
    const { data, loading } = this.state;
    const { type = '' } = this.props;
    const dataSource = this.changeDataForm(data);
    const tableDatas = {
      dataSource,
      columns: [
        {
          title: '编码',
          dataIndex: 'ibm',
          key: 'ibm',
        },
        {
          title: '名称',
          dataIndex: 'note',
          key: 'note',
        },
      ],
      rowSelection: {
        hideDefaultSelections: true,
        selectedRowKeys: this.state.selectedRowKeys,
        type: type === 'Single' ? 'radio' : 'checkbox',
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
        defaultPageSize: 5,
      },
    };
    return (
      <Table className={styles.tableAllSelectedHidden} hideDefaultSelections loading={loading} {...tableDatas} />
    );
  }
}
export default Content;
