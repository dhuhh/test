import React from 'react';
import { Table, message } from 'antd';
import { fetchModalService } from '../../../../../../../../services/customersenior';

class Content extends React.Component {
  constructor(props) {
    super(props);
    const { data = [], selectedRowKeys = [], selectedTitles = [] } = props;
    this.selectedTitles = selectedTitles;
    this.state = {
      data,
      selectedRowKeys,
      keyword: '',
      pagination: {
        pageSize: 5,
        current: 1,
        total: 0,
      },
      loading: true,
    };
  }
  componentDidMount() {
    const { url = '', limitValue = '', limitKey = '' } = this.props;
    let payload = {
      current: this.state.pagination.current,
      keyword: '',
      [limitKey]: limitValue,
      pageSize: this.state.pagination.pageSize,
      paging: 1,
      sort: '',
      total: -1,
    };
    if (limitKey === '') {
      payload = {
        current: this.state.pagination.current,
        keyword: '',
        pageSize: this.state.pagination.pageSize,
        paging: 1,
        sort: '',
        total: -1,
      };
    }
    if (url) {
      this.fetchData(url, payload);
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   const { selectedRowKeys = [], selectedTitles = [] } = nextProps;
  //   this.selectedTitles = selectedTitles;
  //   this.state = {
  //     selectedRowKeys,
  //   };
  // }
  getValues = () => {
    return {
      selectedTitles: this.selectedTitles,
      selectedRowKeys: this.state.selectedRowKeys,
    };
  }
  fetchData = (url = '', params = {}) => {
    const { params: extendsParams = {} } = this.props;
    fetchModalService(url, { ...params, ...extendsParams }).then((response) => {
      const { records = [], total = 0 } = response;
      if (Array.isArray(records)) {
        this.setState({
          data: records,
          pagination: { ...this.state.pagination, total },
          loading: false,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        loading: false,
        pagination: { ...this.state.pagination, total: 0 },
      });
    });
  }
  handleTableChange = (pagination) => {
    this.state.pagination.current = pagination.current;
    const { url = '', limitKey = '', limitValue = '' } = this.props;
    this.fetchData(url, {
      current: this.state.pagination.current,
      keyword: this.state.keyword,
      [limitKey]: limitValue,
      pageSize: this.state.pagination.pageSize,
      paging: 1,
      sort: '',
      total: -1,
    });
  }

  handleSearch = (value, limitValue = '') => {
    this.setState({
      keyword: value,
      loading: true,
    });
    this.state.keyword = value;
    const { url = '', limitKey = '' } = this.props;
    this.fetchData(url, {
      current: this.state.pagination.current,
      keyword: value,
      [limitKey]: limitValue,
      pageSize: this.state.pagination.pageSize,
      paging: 1,
      sort: '',
      total: -1,
    });
  }
  render() {
    const { columns = [], valueKey = '', nameKey = '' } = this.props;
    const { data, loading, pagination } = this.state;
    const tableDatas = {
      dataSource: data,
      columns,
      rowSelection: {
        // type: type === 'Single' ? 'radio' : 'checkbox',
        type: 'radio',
        hideDefaultSelections: true,
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.state.selectedRowKeys = selectedRowKeys;
          const selectedTitles = [];
          const tempSelectedRowKeys = [];
          selectedRows.forEach((element) => {
            if (element[nameKey] && element[valueKey]) {
              selectedTitles.push(element[nameKey]);
              tempSelectedRowKeys.push(element[valueKey]);
            }
          });
          this.selectedTitles = selectedTitles;
          this.setState({
            selectedRowKeys: tempSelectedRowKeys,
          });
        },
      },
      pagination,
      onChange: this.handleTableChange,
    };
    return (
      <Table rowKey={valueKey} hideDefaultSelections loading={loading} {...tableDatas} />
    );
  }
}
export default Content;
