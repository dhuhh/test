import React, { Component } from 'react';
import { Row, Card ,message } from 'antd';
import lodash from 'lodash';
import { connect } from 'dva';
import SearchForm from "./SearchForm";
import SearchTable from './SearchTable';
import styles from './index.less';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
class SearchProcess extends Component {
  constructor(props){
    super(props);
    this.state = {
      current: 1, // 当前页数
      pageSize: 10,
      total: 0, // 列表条数
      loading: false, // 列表加载状态
      dataSource: [], // 列表数据
      departments: [], // 营业部数据
      allYyb: [],
    };
   
  }
  componentDidMount(){
    this.getDepartments();
    
  }
  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.childrenSearchFormThis.fetchData({ current, pageSize });
    this.setState({ current, pageSize });
  }
  // 获取管辖营业部的数据
  getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      this.setState({ departments, allYyb: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render(){
    const { dataSource = [] ,total,pageSize,current,loading,departments = [],allYyb = [] } = this.state;
    const tableProps = {
      className: 'm-Card-Table-g',
      scroll: { x: 1980 },
      loading,
      dataSource,
      onChange: this.handleTableChange,
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '50', '100'],
        total,
        current,
        pageSize,
      },
    };
    return (
      <React.Fragment>
        <Card className="ax-card" bodyStyle={{ paddingBottom: 0, paddingTop: 0, minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}>
          <SearchForm parentThis={this} departments={departments} allYyb={allYyb} getInstence={(childrenSearchFormThis) => { this.childrenSearchFormThis = childrenSearchFormThis; }} searchTable={lodash.get(this, 'searchTabelThis', {})}/>
          <SearchTable parentThis={this} tableProps={tableProps} getInstence={(searchTabelThis) => { this.searchTabelThis = searchTabelThis; }} searchForm={lodash.get(this, 'childrenSearchFormThis', {})}/>
        </Card>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(SearchProcess) ;