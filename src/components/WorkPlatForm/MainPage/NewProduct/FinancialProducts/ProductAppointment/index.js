import React, { Component } from 'react';
import { Divider, message } from 'antd';
import Statistics from './Statistics';
import SearchForm from './SearchForm';
import SearchTable from './SearchTable';
import moment from 'moment';
import { FetchQueryProductAppointment } from '$services/newProduct';
import styles from './index.less';

class ProductAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      current: 1,
      total: 0,
      loading: true, // 列表是否加载中
      dataSource: [], // 列表数据
      cycleValue: [moment().startOf('day').subtract(7,'d'),moment().endOf('day')], // 统计周期值
      prodCode: '', // 产品代码
      custCode: '', // 客户代码
    };
  }

  componentDidMount = () => {
    this.fetchData();
  }

  setData = (obj) => {
    this.setState(obj);
  }

  // 查询数据
  fetchData = (p = {}) => {
    const { userBasicInfo } = this.props ;

    this.setState({ loading: true });
    const { prodCode , custCode , cycleValue } = this.state;

    let payload = {
      // yyb: '105',
      // beginDate: "2022-03-01",
      // endDate: "2022-03-01",
      yyb: userBasicInfo.orgid,
      beginDate: cycleValue[0].format("YYYY-MM-DD") ,
      endDate: cycleValue[1].format("YYYY-MM-DD"),
      prodCode,
      custCode,
    };
    FetchQueryProductAppointment(payload).then((response) => {
      const { records = [], total } = response;
      this.setState({ dataSource: records,total, loading: false });
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  }

  // 翻页
  pageChange = (e) => { 
    let { current } = e;
    this.setState({ current }, () => {
      this.fetchData(current);
    });
  }
  // 改变每页展示条数
  handlePageSizeChange = (e) => {
    const { pageSize } = e ;
    this.setState({ current: 1, pageSize }, () => {
      this.fetchData();
    });
  }

  render() {

    const { loading = true, dataSource = [],custCode,prodCode,
      current, pageSize, total = 0 , cycleValue } = this.state;
    const { userBasicInfo } = this.props ;
    const yyb = userBasicInfo.orgid ;

    const maxCount = total > 10000 ? 10000 : total;
    let curPage = current > 1 ? current - 2 : current - 1;
    dataSource.forEach((item,index)=>{
      item.no = ((curPage * pageSize) + index + 1) + '';
    });
    const tableProps = {
      className: `${styles.m_table} m-table-customer`,
      scroll: { x: 1600 },
      loading,
      dataSource: dataSource ,
      bordered: true,
      onChange: this.pageChange,
      onShowSizeChange: this.handlePageSizeChange,
      sortDirections: ['descend', 'ascend'],
      pagination: {
        className: `${styles.pagination} m-paging`,
        showTotal: () => `总共${total}条`,
        defaultCurrent: 1,
        showLessItems: true,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '50', '100'],
        total: maxCount,
        current,
        pagesize: pageSize,
      },
    };
    const exportModel = { prodCode , custCode , yyb , beginDate: cycleValue[0].format("YYYY-MM-DD") ,
      endDate: cycleValue[1].format("YYYY-MM-DD") };
    return (
      <React.Fragment>
        <SearchForm setData={this.setData} fetchData={this.fetchData} />
        <Divider style={{ marginTop: 0 }} />
        <Statistics productAppointmentModel={exportModel} total={total}/>
        <SearchTable setData={this.setData} tableProps={tableProps} fetchData={this.fetchData} />
      </React.Fragment>
    );
  }
}
export default ProductAppointment;
