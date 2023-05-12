import { Button, Col, DatePicker, message, Pagination, Row, Table } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { QueryCustPointsDetails } from '$services/customerPanorama';
import styles from './index.less';

class ScoreDetail extends Component {
  state = {
    date: [moment().startOf('month'), moment()],
    loading: false,
    dataSource: [],
    current: 1,
    pageSize: 10,
    total: 0,
  };

  columns = [
    { title: '用户名', dataIndex: 'UserName' },
    { title: '操作日期', dataIndex: 'CreateDate' },
    { title: '操作类型', dataIndex: 'OperType' },
    { title: '积分值', dataIndex: 'CreatePoint' },
    { title: '交易状态', dataIndex: 'TranStateName' },
    { title: '活动编号', dataIndex: 'CampaignId' },
    { title: '积分类型', dataIndex: 'MerchantID' },
    { title: '活动名称', dataIndex: 'CampName' },
    { title: '操作描述', dataIndex: 'OperDesc' },
  ];

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (payload = {}) => {
    this.setState({ loading: true });
    const { customerCode = '' } = this.props;
    const { date, current, pageSize } = this.state;
    QueryCustPointsDetails({
      custNo: customerCode,
      beginDate: payload.beginDate || date[0].format('YYYYMMDD'),
      endDate: payload.endDate || date[1].format('YYYYMMDD'),
      paging: 1,
      current: payload.current || current,
      pageSize: payload.pageSize || pageSize,
    }).then(res => {
      const { records = [], total = 0 } = res;
      this.setState({ dataSource: records.map((item, index) => ({ ...item, key: index })), total, loading: false });
    }).catch(err => message.error(err.note || err.message));
  }

  reset = () => {
    this.setState({ date: [moment().startOf('month'), moment()], current: 1 }, () => this.fetchData());
  }

  handlePageChange = (current, pageSize) => {
    this.setState({ current, pageSize }, () => this.fetchData());
  }

  render() {
    const { current, pageSize, total } = this.state;
    return (
      <div style={{ padding: 24, color: '#1A2243', fontSize: 14 }}>
        <Row type='flex' style={{ marginBottom: 24 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8 }}>选择时间：</span>
            <DatePicker.RangePicker
              allowClear={false}
              value={this.state.date}
              className={styles.rangePicker}
              dropdownClassName={`${styles.calendar} m-bss-range-picker`}
              style={{ width: '264px' }}
              placeholder={['开始日期', '结束日期']}
              format="YYYY-MM-DD"
              separator='至'
              disabledDate={(current) => current && current > moment().endOf('day')}
              onChange={date => this.setState({ date })}
            />
          </Col>
          <Col style={{ margin: '0 12px 0 24px' }}>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' type="button" onClick={this.reset} >重置</Button>
          </Col>
          <Col>
            <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={this.fetchData}>查询</Button>
          </Col>
        </Row>
        <Table
          rowKey='key'
          loading={this.state.loading}
          columns={this.columns}
          dataSource={this.state.dataSource}
          className={`m-table-customer ${styles.table}`}
          pagination={false}
          scroll={{ x: true }}
        />
        <div style={{ textAlign: 'right' }}>
          <Pagination
            style={{ margin: '20px 0 0' }}
            size='small'
            showLessItems
            showQuickJumper
            showSizeChanger
            className={`${styles.pagination}`}
            pageSizeOptions={['10', '20', '40']}
            showTotal={(total) => <div style={{ fontSize: 12 }}>{`总共${total}条`}</div>}
            pageSize={pageSize}
            current={current}
            total={total}
            onChange={this.handlePageChange}
            onShowSizeChange={(current,pageSize) => this.handlePageChange(1, pageSize)}
          />
        </div>
      </div>
    );
  }
}

export default ScoreDetail;