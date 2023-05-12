import React, { Component } from 'react';
import { Divider, message } from 'antd';
import lodash from 'lodash';
import Statistics from './Statistics';
import SearchForm from './SearchForm';
import BasicModal from '../../../../../../Common/BasicModal';
import DataTable from './DataTable';
import SearchTable from './SearchTable';
import CustomerWealth from './CustomerWealth';
import styles from '../index.less';

class WealthCusList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      pageSize: 20,
      total: 0,
      sort: [],
      filter: [],
      statistics: {
        market_value: '', // 上日市值
        transaction_amount: '', // 销售金额
        average_market_value: '', // 日均保有
      }, // 统计数据
      loading: true,  // 列表加载状态
      dataSource: [],  // 列表数据
      visible: false, // 查看明细弹窗
      product_id: null, // 产品id
      cusId: null, // 客户id
      cusName: '', //客户姓名
      customerType: null, //客户类型
      tableHeaderNames: [], // 导出头名称
      pageNo: null, // 当前页数
      queryType: null,
      timePeriod: '',
      tmPrd: [], // 时间周期
      tmNm: [], // 时间周期名称
      attrConditionModels: [],
      keyword: '',
      searchTotal: 0, //模糊搜索显示总条数
      activeTab: 1,
    };
  }

  componentDidMount = () => {
    this.childrenSearchFormThis.handleSubmit();
  }

  handleCheck = (record) => {
    this.setState({
      cusId: record.customer_id,
      cusName: record.customer_name,
      visible: true,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleHeaderName = (tableHeaderNames) => {
    this.setState({
      tableHeaderNames,
    });
  }

  handleFilter = (attrConditionModels) => {
    this.setState({
      attrConditionModels,
    });
  }

  // handleFormChange = (payload) => {
  //   this.setState(payload);
  // }

  // 分页、筛选、排序发生变化
  handleTableChange = (pagination, filters, sorter) => {
    if (this.childrenSearchFormThis) {
      if (!this.childrenSearchFormThis.props.form.getFieldsValue().khlx.join()) {
        message.warning('请选择客户类型');
        return;
      }
    }
    const { current, pageSize } = pagination;
    const { columnKey = '', order = '' } = sorter;
    const { filter = [] } = this.state;
    let key = columnKey;
    if (columnKey === 'transaction_amount' || columnKey === 'average_market_value') {
      key = `sale_relation.${columnKey}.${this.childrenSearchFormThis.props.form.getFieldsValue().tjsj}`;
    } else if (columnKey === 'market_value.merge') {
      key = 'market_value_merge';
    } else if (columnKey === 'final_market_value') {
      key = `final_market_value.${this.childrenSearchFormThis.props.form.getFieldsValue().tjsj}`;
    }
    const val = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    const sort = [{}];
    if (key && val) {
      sort[0][key] = val;
    }
    // let filter = [];
    // ['customer_no', 'customer_name', 'product_name'].forEach((item) => {
    //   if (lodash.get(filters, `${item}[0]`, '')) {
    //     filter.push({ esCode: `automatic_investment_plan.${item}`, esValue: lodash.get(filters, `${item}[0]`, ''), type: 3 });
    //   }
    // });
    this.childrenSearchFormThis.fetchData({ current, pageSize, sort, filter, isSubmit: 1 });
    this.setState({ current, pageSize, sort, filter });
  }

  renderTitle = (customerType) => {
    if (customerType === '12') {
      return <span><span>{`${this.state.cusName}(${this.state.cusId})`}</span><span style={{ marginLeft: '0.666rem', fontSize: '14px', lineHeight: '20px', color: '#61698C' }}>仅展示有销售关系且销售金额&gt;0元的产品明细，保有及市值按客户进行统计</span></span>;
    }
    else {
      return <span>{`${this.state.cusName}(${this.state.cusId})`}</span>;
    }

  }

  render() {
    const { searchTotal = 0, keyword = '', loading = true, current = 1, pageSize = 20, total = 0, dataSource = [], visible, customerType, tableHeaderNames, queryType, sort, tmPrd, tmNm, statistics = {}, timePeriod, cusId, cusName, filter, activeTab } = this.state;
    const { authorities = {}, teamPmsn = '0' } = this.props;
    const maxCount = total > 10000 ? 10000 : total;
    const tableProps = {
      className: styles.m_table,
      scroll: { x: 1104, y: dataSource.length > 0 ? window.screen.availHeight - 450 : 0 },
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
        current,
        pageSize,
      },
    };
    const modalProps = {
      width: '90rem',
      title: this.renderTitle(customerType),
      style: { top: '5rem', borderRadius: '2px' },
      visible,
      onCancel: this.handleCancel,
      footer: null,
      // isAllWindow: 1,
      // defaultFullScreen: true,
      className: styles.modal,
      // allowFullScreen: true,
    };
    return (
      <React.Fragment>
        <div className={styles.tabValue}>
          <div className={activeTab==1?styles.active:''} onClick={()=>{this.setState({activeTab:1})}}>持仓统计</div>
          <div className={activeTab==2?styles.active:''} onClick={()=>{this.setState({activeTab:2})}}>持仓明细</div>
        </div>
        {
          <>
            <div style={{display:`${activeTab==1?'':'none'}`}}>
              <SearchForm searchTotal={searchTotal} filterCustomerThis={this.filterCustomerThis} teamPmsn={teamPmsn} authorities={authorities} parentThis={this} getInstence={(childrenSearchFormThis) => { this.childrenSearchFormThis = childrenSearchFormThis; }} getData={() => this.getData} scene={this.props.scene} searchForm={lodash.get(this, 'childrenSearchFormThis', {})} />
              <Divider style={{ marginTop: 0 }} />
              <Statistics keyword={keyword} filter={filter} timePeriod={timePeriod} customerType={customerType} tableHeaderNames={tableHeaderNames} total={total} queryType={queryType} sort={sort} statistics={statistics} searchForm={lodash.get(this, 'childrenSearchFormThis', {})} />
              <SearchTable getInstence={(_this) => { this.filterCustomerThis = _this; }} handleFormChange={this.handleFormChange} handleFilter={this.handleFilter} tableProps={tableProps} handleCheck={this.handleCheck} handleHeaderName={this.handleHeaderName} wealthCusList={this} searchForm={lodash.get(this, 'childrenSearchFormThis', {})} />
              <BasicModal {...modalProps}>
                <DataTable tmNm={tmNm} tmPrd={tmPrd} cusId={cusId} cusName={this.state.cusName} cusType={customerType} cusRng={queryType} sort={sort} timePeriod={timePeriod} handleTableChange={this.handleTableChange} total={total} current={current} pageSize={pageSize} />
              </BasicModal>
            </div>
            <div style={{display:`${activeTab==1?'none':''}`}}>
              <CustomerWealth teamPmsn={teamPmsn} authorities={authorities} scene={this.props.scene}/>
            </div>
          </>
        }
      </React.Fragment>
    );
  }
}
export default WealthCusList;
