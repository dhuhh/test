import React from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Link } from 'dva/router';
import { Row, Col, Card, Calendar, message, Collapse, Badge, DatePicker } from 'antd';
import { FetchCalendarDetails, FetchProdHomepageCalendar } from '@/services/home/home';
import NoData from '@/components/common/NoData';
import Links from '@/components/Common/Links';
import styles from './index.less';

const { MonthPicker } = DatePicker;
const { Panel } = Collapse;

class SchCalendar extends React.Component {
  state = {
    currentDate: moment(),
    canlenderProdCount: [],
    currentDateProdLoading: true,
    currentDateProdData: [],
  }

  componentDidMount() {
    this._isMounted = true;
    const { currentDate = moment() } = this.state;
    const yf = currentDate.format('YYYYMM');
    this.getCanlenderProdCount(yf);
    this.getCurrentDateProdData(currentDate);
  }

  // 查询日历上的产品数量
  getCanlenderProdCount = (yf) => {
    FetchProdHomepageCalendar({
      queryMonth: yf,
    }).then(({ records = [] }) => {
      if (this._isMounted) {
        this.setState({ canlenderProdCount: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.errorMsg);
    });
  }

  // 查询指定日期的产品信息
  getCurrentDateProdData(currentDate = this.state.currentDate) {
    const rq = currentDate.format('YYYYMMDD');
    FetchCalendarDetails({
      queryDate: rq,
      calendarType: 2, // 日历类型：1|销售日历;2|运营日历;3|产品中心登入
      prodClass: '',
      userId: '',
    }).then((response) => {
      const { records = [] } = response || {};
      // listDatas去重后的标题
      const listDatas = [...new Set(records.map(item => item.eventTypeName))];
      const currentDateProdData = [];
      if (listDatas.length > 0) {
        listDatas.forEach((listDatasItem, index) => {
          const obj = {};
          let currentDateProdArr = [];
          currentDateProdArr = records.filter(item => item.eventTypeName === listDatasItem);
          obj.id = index + 1;
          obj.name = listDatasItem;
          obj.arr = currentDateProdArr;
          currentDateProdData.push(obj);
        });
      }
      if (this._isMounted) {
        this.setState({
          currentDateProdLoading: false,
          currentDateProdData,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 点选日期
  handleDateSelect = (date) => {
    this.setState({ currentDate: date });
    const { currentDate } = this.state;
    // 如果点选了不同的日期,那么就查询改日期下的产品信息
    if (!date.isSame(currentDate, 'day')) {
      this.setState({ currentDateProdLoading: true });
      this.getCurrentDateProdData(date);
    }
    // 如果跨月了,那么需要查询改月的产品数量
    if (!date.isSame(currentDate, 'month')) {
      const yf = date.format('YYYYMM');
      this.getCanlenderProdCount(yf);
    }
  }

  // 点选年月
  handlePanelChange = (date) => {
    this.setState({ currentDate: date, currentDateProdLoading: true });
    this.getCurrentDateProdData(date);
    const yf = date.format('YYYYMM');
    this.getCanlenderProdCount(yf);
  }

  dateCellRender = (dates) => {
    const { canlenderProdCount = [] } = this.state;
    let number = 0;
    canlenderProdCount.every((item) => {
      const { date = '', cnt = 0 } = item;
      const sjVal = moment(date, 'YYYYMMDD');
      if (sjVal.isValid() && dates.isSame(sjVal, 'day')) {
        number = cnt;
        return false;
      }
      return true;
    });
    if (number > 0) {
      return <div className='m-even-num m-even-samll' />;
    }
  }

  handleStyle = (index) => {
    let listStyle;
    if (index === '高风险') {
      listStyle = 'm-btn-tag m-btn-radius-small ant-btn m-btn-tag-red';
    } else if (index === '中高风险') {
      listStyle = 'm-btn-tag m-btn-radius-small ant-btn m-btn-tag-orange';
    } else if (index === '中风险') {
      listStyle = 'm-btn-tag m-btn-radius-small ant-btn m-btn-tag-yellow';
    } else if (index === '中低风险') {
      listStyle = 'm-btn-tag m-btn-radius-small ant-btn m-btn-tag-blue';
    } else if (index === '低风险') {
      listStyle = 'm-btn-tag m-btn-radius-small ant-btn m-btn-tag-violet';
    } else {
      listStyle = 'm-btn-tag m-btn-radius-small ant-btn';
    }
    return listStyle;
  }

  // 月份加一
  onNextMonth = () => this.addMonth(1);

  // 月份减一
  onPrevMonth = () => this.addMonth(-1);

  // 月份改变
  addMonth = (number) => {
    this.setState({
      currentDate: moment(this.state.currentDate).add(number, 'month'),
    }, () => {
      const yf = this.state.currentDate.format('YYYYMM');
      this.getCanlenderProdCount(yf);
      this.getCurrentDateProdData(this.state.currentDate);
    });
  }

  // 年份加一
  onNextYear = () => this.addYear(1);

  // 年份减一
  onPrevYear = () => this.addYear(-1);

  // 年份改变
  addYear = (number) => {
    this.setState({
      currentDate: moment(this.state.currentDate).add(number, 'year'),
    }, () => {
      const yf = this.state.currentDate.format('YYYYMM');
      this.getCanlenderProdCount(yf);
      this.getCurrentDateProdData(this.state.currentDate);
    });
  }

  handleTitle = () => (
    <React.Fragment>
      <div className='card-title-name'>
        <span>运营日历</span>
      </div>
      <div className='btn-list-header'>
        <Link to='/operation/perateManagement' className='m-color' style={{ fontSize: '1.166rem', fontWeight: 'normal' }}>查看日历 <i className='iconfont icon-calendarLine' style={{ fontSize: '1.166rem' }} /></Link>
      </div>
    </React.Fragment>
  );

  render() {
    const { currentDate = '', currentDateProdData = [] } = this.state;
    const yearM = currentDate.format('YYYY');
    const Months = currentDate.format('MM');
    const day = currentDate.format('DD');
    const week = currentDate.format('d');
    let weekday;
    if (week === '0') {
      weekday = '星期日';
    } else if (week === '1') {
      weekday = '星期一';
    } else if (week === '2') {
      weekday = '星期二';
    } else if (week === '3') {
      weekday = '星期三';
    } else if (week === '4') {
      weekday = '星期四';
    } else if (week === '5') {
      weekday = '星期五';
    } else if (week === '6') {
      weekday = '星期六';
    }

    const monthFormat = 'YYYY年MM月';

    return (
      <Card
        className={`${styles.mycards} m-card m-card-shadow`}
        style={{ height: '480px' }}
        title={this.handleTitle()}
      >
        <Row className=''>
          <Col xs={24} sm={24} md={12} lg={13} xl={13} xxl={13}>
            <Card className={`m-card ${styles.mycard}`} style={{ marginLeft: '12px' }}>
              <Calendar
                className='m-monthDate'
                fullscreen={false}
                value={currentDate}
                dateCellRender={this.dateCellRender}
                onSelect={this.handleDateSelect}
                onPanelChange={this.handlePanelChange}
                headerRender={({ value, type, onChange, onTypeChange }) => (
                  <div className='dis-fx alc m-head-calendar'>
                    <div className='m-head-calendar-icon' onClick={this.onPrevYear} title='上一年'>
                      <i className='iconfont icon-icon-arrow-left02' />
                    </div>
                    <div className='m-head-calendar-icon' onClick={this.onPrevMonth} title='上一月'>
                      <i className='iconfont icon-right-line-arrow' />
                    </div>
                    <div className='flex alc tc'>
                      <MonthPicker
                        onChange={onChange}
                        defaultValue={moment(currentDate, monthFormat)}
                        value={moment(currentDate, monthFormat)}
                        format={monthFormat}
                        placeholder='Select month'
                        allowClear={false}
                        dropdownClassName='dropdownPicker'
                      />
                    </div>
                    <div className='m-head-calendar-icon' onClick={this.onNextMonth} title='下一月'>
                      <i className='iconfont icon-left-line-arrow' />
                    </div>
                    <div className='m-head-calendar-icon' onClick={this.onNextYear} title='下一年'>
                      <i className='iconfont icon-icon-d-arrow-right' />
                    </div>
                  </div>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={11} xl={11} xxl={11}>
            <div style={{ padding: '0rem 20px 10px 20px' }}>
              <div style={{ fontSize: '18px' }} className='font-color'>{`${yearM}年${Months}月${day}日`}
                <span style={{ fontSize: '12px', color: '#999', paddingLeft: '10px' }}>{weekday}</span>
              </div>
            </div>
            <div style={{ padding: '0 20px 0 20px', overflowY: 'auto', height: '28.666rem' }} >
              <Collapse accordion className='m-collapse' defaultActiveKey={['1']}>
                {
                  currentDateProdData.map((item, index) => {
                    const listData = lodash.get(item, 'arr', []);
                    return (
                      <Panel
                        key={item.id}
                        header={
                          <div className='dis-fx' >
                            <div className='' style={{ paddingRight: '1rem' }}>{item.name}</div>
                            <div><Badge className='m-badge m-badge-red' />
                            </div>
                          </div>}
                      >
                        <ul className='m-product-list-info'>
                          {
                            listData.map((keys, i) => (
                              <li key={i}>
                                <div className='m-product-list-title'>
                                <Links id={keys.prodId} name={keys.prodCode + keys.prodName} />
                                </div>
                                <div className='dis-fx m-product-info-box ant-row-flex-middle'>

                                  <div className='flex m-info-time'>
                                    <p className='m-info-data red fwb' style={{ fontSize: '1.666rem' }}>{keys.expectedYieldRate || '--'}<span style={{ fontSize: '1rem' }}>%</span></p>
                                    <p className='m-info-name'>预期年化收益率</p>
                                  </div>
                                  <div className='tr' style={{ flex: 1.5 }}>
                                    <button className={this.handleStyle(keys.prodRiskLevel)}>{keys.prodRiskLevel || '--'}</button>
                                  </div>
                                </div>
                              </li>
                            ))}

                        </ul>
                      </Panel>
                    );
                  })
                }
                {
                  currentDateProdData.length === 0 && (
                    <NoData height='26.166rem' />
                  )
                }
              </Collapse>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default SchCalendar;
