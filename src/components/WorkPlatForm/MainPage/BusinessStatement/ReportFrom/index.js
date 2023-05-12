import React, { Component } from 'react';
import SearchTable from "./SearchTable";
import SearchForm from "./SearchForm";
import ExportTab from './ExportTab';
import lodash from 'lodash';
import styles from '../index.less';
class ReportFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1, // 当前页数
      pageSize: 10,
      total: 0, // 列表条数
      loading: false,  // 列表加载状态
      dataSource: [],  // 列表数据
      headerName: [], //导出报表头部名称
      departTabel: '单点营业部',
      tableHeaderCodes: [], //导出报表头部名称code
      payload: {},
    };
  }


  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.childrenSearchFormThis.fetchData({ current, pageSize });
    this.setState({ current, pageSize });
  }



  render (){
    const { loading = true,current = 1,  pageSize = 10, total = 0, dataSource = [] , headerName,tableHeaderCodes,payload = {} ,departTabel } = this.state;
    const { departments = [], allYyb = [] } = this.props;
    const maxCount = total > 10000 ? 10000 : total;
    const tableProps = {
      className: 'm-Card-Table-g',
      scroll: { x: 1980 },
      loading,
      dataSource,
      bordered: true,
      onChange: this.handleTableChange,
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '50', '100'],
        total: maxCount,
        current,
        pageSize,
      },
    };
    return(
      <React.Fragment>
        <SearchForm parentThis={this} departments={departments}  allYyb={allYyb}  getInstence={(childrenSearchFormThis) => { this.childrenSearchFormThis = childrenSearchFormThis; }}/>
        <ExportTab headerName={headerName} tableHeaderCodes={tableHeaderCodes} total={total} payload={payload}/>
        <SearchTable parentThis={this} departTabel={departTabel} tableProps={tableProps} searchForm={lodash.get(this, 'childrenSearchFormThis', {})}/>
      </React.Fragment>
    );
  }
}
export default ReportFrom;