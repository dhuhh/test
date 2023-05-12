import React from 'react';
import { Divider, Card } from 'antd';
import SearchForm from './SearchForm';
import OperateBar from './OperateBar';
import TableContent from './TableContent';
import styles from './index.less';
class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    //const params = this.props.params;
    const pdId = this.props.pdId;
    const customerType = this.props.customerType;
    const queryType = this.props.queryType || '1';
    this.state = {
      //srchTp: 1, //查询类型
      current: 1,  //分页信息
      pageSize: 20,
      total: 0,
      sort: '',
      statcData: [],
      dataSource: [],
      loading: false, //表格加载状态
      checkDatas: [], //筛选框数据
      cusNo: '',
      pdId,
      customerType,
      queryType,
      filters: [], //筛选条件
      tmPrd: '2',
      searchTotal: 0,
      tableHeaderCodes: [],
      headerInfo: [],
      cusInfo: '',
    };
  }

  componentDidMount() {
  }

  handleFormChange = (payload, callback) => {
    this.setState(payload, () => {
      if (callback) {
        callback();
      }
    });
  }

  //分页、排序、筛选发生改变
  handlePagerChange = (pagination, filters, sorter) => {
    const { pageSize: page, cusNo } = this.state;
    let { current, pageSize } = pagination;
    if (pageSize !== page) {
      current = 1;           //pageSize发生变化则页码置为1
    }
    const { columnKey = '', order = '' } = sorter;
    const key = columnKey;
    const val = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    let sort = '';
    if (key !== '' && val !== '') {
      sort = key + ' ' + val;
    }
    this.childrenSearchFormThis.fetchData({ current, pageSize, sort, cusNo, isSubmit: 1 });
    this.setState({ current, pageSize, sort });
  }

  getData = (payload) => {
    this.childrenSearchFormThis.fetchData(payload);
  }



  render() {
    // console.log('window.screen.height', window.screen.height);
    const { cusInfo, tableHeaderCodes = [], headerInfo = [], searchTotal, filters = [], cusNo = '', sort = '', checkDatas = [], dataSource = [], current = 1, pageSize = 20, total = 0, statcData = [], loading = false, customerType = '', queryType = '1', pdId = '', tmPrd } = this.state;
    const maxCount = total > 10000 ? 10000 : total;
    const productCusListModel = { current, cusRng: queryType, cusType: customerType, pageSize, paging: 1, pdId, srchTp: 1, tmPrd, total: maxCount, sort, cusNo, cusInfo };
    const { authorities = {}, teamPmsn = '0' } = this.props;
    const tableProps = {
      className: styles.m_table,
      scroll: { y: window.screen.availHeight - 450 },
      loading,
      dataSource,
      bordered: true,
      onChange: this.handlePagerChange,
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
    return (
      <React.Fragment>
        <Card className="m-card default" style={{ padding: '0 2rem 2rem', border: '1px solid #eaecf2' }}>
          <SearchForm searchTotal={searchTotal} filters={filters} cusNo={cusNo} teamPmsn={teamPmsn} authorities={authorities} pdId={pdId} customerType={customerType} queryType={queryType} getInstence={(childrenSearchFormThis) => { this.childrenSearchFormThis = childrenSearchFormThis; }} handleFormChange={this.handleFormChange} current={current} pageSize={pageSize} sort={sort} />
          <Divider style={{ marginTop: 0 }} />
          <OperateBar tableHeaderCodes={tableHeaderCodes} headerInfo={headerInfo} selectedCount={maxCount} productCusListModel={productCusListModel} customerType={customerType} statcData={statcData} />
          <TableContent sort={sort} filters={filters} customerType={customerType} checkDatas={checkDatas} getData={this.getData} getInstance={(searchFormThis) => { this.searchFormThis = searchFormThis; }} tableProps={tableProps} handleFormChange={this.handleFormChange} />
        </Card>
        {/* <Row className="m-row-nomg" style={{ padding: '0 12px', marginTop: '10px', height: `${window.screen.height - 237}px` }}>
          <Card
            title={this.getStatisticData()}
          >
            <Table
              {...tableProps}
            />
          </Card>
        </Row> */}
      </React.Fragment>
    );
  }
}
export default CustomerList;
