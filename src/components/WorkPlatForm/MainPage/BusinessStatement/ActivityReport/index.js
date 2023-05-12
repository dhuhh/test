import React, { Component } from 'react';
import lodash from 'lodash';
import SearchTable from "./SearchTable";
import BasicModal from '$components/Common/BasicModal';
import DataTable from "./DataTable";
import SearchForm from "./SearchForm";
import Describe from "./Describe";
import ExportTab from './ExportTab';
import styles from '../index.less';
class ActivityReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1, // 当前页数
      pageSize: 10,
      total: 0, // 列表条数
      loading: false,  // 列表加载状态
      dataSource: [],  // 列表数据
      headerName: [], //导出报表头部名称
      tableHeaderCodes: [], //导出报表头部名称code
      visible: false, // 列表弹窗
      departTabel: '单点营业部',
      payload: {}, // 导出报表预存信息
      protocol: null, // 弹窗列表预存信息
    };
  }

  componentDidMount() {
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.childrenSearchFormThis.fetchData({ current, pageSize });
    this.setState({ current, pageSize });
  }

  render (){
    const { loading = true, current = 1, pageSize = 10, total = 0, dataSource = [] , headerName,tableHeaderCodes,protocol,visible ,departTabel = '' ,payload = {} } = this.state;
    const { departments = [], allYyb = [] } = this.props;
    const maxCount = total > 10000 ? 10000 : total;
    const tableProps = {
      className: 'm-Card-Table-g',
      scroll: { x: dataSource.length > 0 ? 1980 : 0 },
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
    const modalProps = {
      width: document.body.clientWidth - 100,
      height: document.body.clientHeight - 100,
      isAllWindow: 2,
      title: '客户明细',
      style: { top: '5rem', borderRadius: '2px' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
      // defaultFullScreen: true,
      className: styles.modal,
      // allowFullScreen: true,
    };
    return(
      <React.Fragment>
        <Describe />
        <SearchForm parentThis={this} departments={departments}  allYyb={allYyb}  getInstence={(childrenSearchFormThis) => { this.childrenSearchFormThis = childrenSearchFormThis; }}/>
        <ExportTab headerName={headerName} tableHeaderCodes={tableHeaderCodes} total={total} payload={payload}/>
        <SearchTable parentThis={this} tableProps={tableProps} departTabel={departTabel} searchForm={lodash.get(this, 'childrenSearchFormThis', {})}/>
        <BasicModal {...modalProps}>
          <DataTable protocol={protocol}  payloadDate={payload} />
        </BasicModal>
      </React.Fragment>
    );
  }
}
export default ActivityReport;