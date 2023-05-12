import React, { Component } from 'react';
import { Divider, Icon, message, Select } from 'antd';
import lodash from 'lodash';
import Statistics from './Statistics';
import SearchForm from './SearchForm';
import SearchTable from './SearchTable';
import TreeUtils from '$utils/treeUtils';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { FetchSaleAndIncomeList, QueryStatisticalCycle } from '$services/newProduct';
import styles from './index.less';

class SalesRevenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {  // 分页
        pageNo: 1,
        pageSize: 20,
        total: 0,
        sort: '',
      },
      statistics: {},  // 统计数据
      loading: true,  // 列表是否加载中
      dataSource: [],  // 列表数据
      cycles: [],  // 统计周期数据
      cycleValue: '本月',  // 统计周期值
      departments: [],  // 营业部数据
      departmentValue: '',  // 营业部值
      productCode: '',  // 产品代码
      customerName: '',  // 客户姓名
      productMajorType: '', // 产品大类
      productSubType: '', // 产品子类
      allYyb: [],
    };
  }

  componentDidMount = () => {
    // this.getDepartments();
    this.queryStatisticalCycle();
  }

  setData = (obj) => {
    this.setState(obj);
  }

  // 查询统计周期
  queryStatisticalCycle = () => {
    QueryStatisticalCycle().then((response) => {
      const { records = [] } = response;
      this.setState({ cycles: records });
      this.fetchData(); // 统计周期查询完成后调用查询列表接口
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 获取管辖营业部的数据
  getDepartments = () => {
    fetchUserAuthorityDepartment({}).then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
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

  // 查询数据
  fetchData = (p = {}) => {
    this.setState({ loading: true });
    const temp = this.state.cycles.find((item) => item.dispDate === this.state.cycleValue);
    const payload = {
      department: p.hasOwnProperty('department') ? p.department : this.state.departmentValue,
      staticalPeriodStartTime: p.hasOwnProperty('staticalPeriodStartTime') ? p.staticalPeriodStartTime : temp?.strtDate,
      staticalPeriodEndTime: p.hasOwnProperty('staticalPeriodEndTime') ? p.staticalPeriodEndTime : temp?.endDate,
      productCode: p.hasOwnProperty('productCode') ? p.productCode : this.state.productCode,
      customerName: p.hasOwnProperty('customerName') ? p.customerName : this.state.customerName,
      productMajorType: p.hasOwnProperty('productMajorType') ? p.productMajorType : this.state.productMajorType,
      productSubType: p.hasOwnProperty('productSubType') ? p.productSubType : this.state.productSubType,
      pagerModel: p.hasOwnProperty('pagerModel') ? p.pagerModel : {
        pageNo: this.state.pagination.pageNo,
        pageSize: this.state.pagination.pageSize,
        builder: {},
      },
    };
    FetchSaleAndIncomeList(payload).then((response) => {
      const { data = [], summary = [], count = 0 } = response;
      let { pagination } = this.state;
      if (p.pagerModel) {
        pagination = { ...pagination, pageNo: p.pagerModel.pageNo, pageSize: p.pagerModel.pageSize };
      }
      const { pageNo, pageSize } = pagination;
      data.forEach((item, index) => {
        item['no'] = ((pageNo - 1) * pageSize) + index + 1;
      });
      const statistics = {};
      summary.forEach(item => {
        statistics[item.showName] = item.value;
      });
      this.setState({ dataSource: data, statistics, loading: false, pagination: { ...pagination, total: count } });
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  }

  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.fetchData({ pagerModel: { pageNo: current, pageSize, builder: {} } });
  }

  render() {
    const { loading = true, dataSource = [], pagination = {}, statistics = {}, cycles = [], cycleValue = '本月', departments = [],
      departmentValue = '1', scene = '1', productCode = '', customerName = '', productMajorType = '', productSubType = '' } = this.state;
    const { pageNo = 1, pageSize = 20, total = 0, sort = '' } = pagination;
    // const { authorities = {}, teamPmsn = '0' } = this.props;
    const maxCount = total > 10000 ? 10000 : total;
    const tableProps = {
      className: `${styles.m_table} m-table-customer`,
      scroll: { x: 1797, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
      loading,
      dataSource,
      bordered: true,
      onChange: this.handleTableChange,
      sortDirections: ['descend', 'ascend'],
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${total}条`,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100'],
        total: maxCount,
        pageNo,
        pageSize,
      },
    };
    let saleAndIncomeListModel = {};
    if (cycles.length) {
      const temp = cycles.find(item => item.dispDate === cycleValue);
      saleAndIncomeListModel = {
        department: departmentValue,
        staticalPeriodStartTime: temp?.strtDate,
        staticalPeriodEndTime: temp?.endDate,
        productCode: productCode,
        customerName: customerName,
        productMajorType: productMajorType,
        productSubType: productSubType,
      };
    }
    return (
      <React.Fragment>
        <SearchForm setData={this.setData} cycles={cycles} departments={departments} scene={scene} fetchData={this.fetchData} cycleValue={cycleValue} departmentValue={departmentValue} productCode={productCode} customerName={customerName} productMajorType={productMajorType} productSubType={productSubType} allYyb={this.state.allYyb} />
        <Divider style={{ marginTop: 0 }} />
        <Statistics statistics={statistics} staticalPeriod={cycleValue} total={total} saleAndIncomeListModel={saleAndIncomeListModel} />
        <SearchTable setData={this.setData} tableProps={tableProps} saleAndIncomeListModel={saleAndIncomeListModel} fetchData={this.fetchData} />
      </React.Fragment>
    );
  }
}
export default SalesRevenue;
