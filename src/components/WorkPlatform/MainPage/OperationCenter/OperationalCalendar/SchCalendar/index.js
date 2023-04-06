import React, { useEffect, useState } from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Row, Col, Card, Calendar, message, Tabs, DatePicker } from 'antd';
import { FetchCalendarDetails } from '@/services/home/home';
import { FetchProdOperateCalendar } from '@/services/operational/operational';
import NoData from '@/components/Common/NoData';
import { FetchSysCommonTable } from '@services/commonbase/sysCommon';
import CardItem from './CardItem';
import styles from './index.less';

const { MonthPicker } = DatePicker;

function SchCalendar(props) {
  const [currentDate, setCurrentDate] = useState(moment());
  const [canlenderProdCount, setCanlenderProdCount] = useState([]);
  const [currentDateProdData, setCurrentDateProdData] = useState([]);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (currentDate) {
      const yf = currentDate.format('YYYYMM');
      getCanlenderProdCount(yf);
      getCurrentDateProdData(currentDate);
      fetchQueryInnerObject();
    }
  }, []);


  // 查询日历上的产品数量
  const getCanlenderProdCount = (yf) => {
    FetchProdOperateCalendar({
      queryMonth: yf,
      calendarType: 2,
      prodClass: '',
    }).then(({ records = [] }) => {
      setCanlenderProdCount(records);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.errorMsg);
    });
  };
  // 查询指定日期的产品信息
  const getCurrentDateProdData = (date = currentDate) => {
    const rq = date.format('YYYYMMDD');
    FetchCalendarDetails({
      queryDate: rq,
      calendarType: 2, // 日历类型：1|销售日历;2|运营日历;3|产品中心登入
      prodClass: '',
      userId: '',
    }).then((response) => {
      const { records = [] } = response || {};
      // listDatas去重后的标题
      const listDatas = [...new Set(records.map(item => item.eventTypeName))];
      const newCurrentDateProdData = [];
      if (listDatas.length > 0) {
        listDatas.forEach((listDatasItem, index) => {
          const obj = {};
          let currentDateProdArr = [];
          currentDateProdArr = records.filter(item => item.eventTypeName === listDatasItem);
          obj.id = index + 1;
          obj.name = listDatasItem;
          obj.arr = currentDateProdArr;
          newCurrentDateProdData.push(obj);
        });
      }
      setCurrentDateProdData(newCurrentDateProdData);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // 点选日期
  const handleDateSelect = (date) => {
    setCurrentDate(date);
    // 如果点选了不同的日期,那么就查询改日期下的产品信息
    if (!date.isSame(currentDate, 'day')) {
      getCurrentDateProdData(date);
    }
    // 如果跨月了,那么需要查询改月的产品数量
    if (!date.isSame(currentDate, 'month')) {
      const yf = date.format('YYYYMM');
      getCanlenderProdCount(yf);
    }
  };

  // 点选年月
  const handlePanelChange = (date) => {
    getCurrentDateProdData(date);
    const yf = date.format('YYYYMM');
    getCanlenderProdCount(yf);
  };

  const dateCellRender = (date) => {
    const numData = [];
    canlenderProdCount.forEach((item) => {
      const sjVal = moment(item.eventDate, 'YYYYMMDD');
      if (sjVal.isValid() && date.isSame(sjVal, 'day')) {
        numData.push({
          unm: item.cnt,
          name: item.eventTypeName,
          color: item.displayStyle,
        });
      }
    });
    return (
      numData.map((keys, index) => (<div className="m-even-num" style={{ background: `${keys.color}` }} key={index}>{keys.unm}</div>))
    );
  };

  // 产品类型
  const fetchQueryInnerObject = () => {
    FetchSysCommonTable({
      id: '',
      keyword: '',
      objectName: 'PIF.TPIF_CPSJLX',
    }).then((response) => {
      const { records = [] } = response || {};
      setProductList(records);
    });
  };

  // 月份加一
  const onNextMonth = () => addMonth(1);

  // 月份减一
  const onPrevMonth = () => addMonth(-1);

  // 月份改变
  const addMonth = (number) => {
    setCurrentDate(moment(currentDate).add(number, 'month'));
    getCurrentDateProdData(moment(currentDate).add(number, 'month'));
    const yf = moment(currentDate).add(number, 'month').format('YYYYMM');
    getCanlenderProdCount(yf);
  };

  // 年份加一
  const onNextYear = () => addYear(1);

  // 年份减一
  const onPrevYear = () => addYear(-1);

  // 年份改变
  const addYear = (number) => {
    setCurrentDate(moment(currentDate).add(number, 'year'));
    getCurrentDateProdData(moment(currentDate).add(number, 'year'));
    const yf = moment(currentDate).add(number, 'year').format('YYYYMM');
    getCanlenderProdCount(yf);
  };

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
    <Card className="m-card m-card-shadow " style={{ padding: '20px', overflow: 'auto', height: 'calc(100vh - 100px)' }}>
      <Row className="">
        <Col xs={17} sm={18} md={19} lg={19} xl={20} xxl={21}>
          <Card className={`m-card ${styles.mycard}`}>
            <div className="m-gjz-calendar-bg">{currentDate.format('YYYY')}</div>
            <Calendar
              className="m-monthDate m-monthDate-full"
              value={currentDate}
              dateCellRender={dateCellRender}
              onSelect={handleDateSelect}
              onPanelChange={handlePanelChange}
              headerRender={({ value, type, onChange, onTypeChange }) => (
                <div className="dis-fx alc m-head-calendar">
                  <div className="m-head-calendar-icon" onClick={onPrevYear} title="上一年">
                    <i className="iconfont icon-icon-arrow-left02" />
                  </div>
                  <div className="m-head-calendar-icon" onClick={onPrevMonth} title="上一月">
                    <i className="iconfont icon-right-line-arrow" />
                  </div>
                  <div className="flex alc tc">
                    <MonthPicker
                      onChange={onChange}
                      defaultValue={moment(currentDate, monthFormat)}
                      value={moment(currentDate, monthFormat)}
                      format={monthFormat}
                      placeholder="Select month"
                      allowClear={false}
                      dropdownClassName="dropdownPicker"
                    />
                  </div>
                  <div className="m-head-calendar-icon" onClick={onNextMonth} title="下一月">
                    <i className="iconfont icon-left-line-arrow" />
                  </div>
                  <div className="m-head-calendar-icon" onClick={onNextYear} title="下一年">
                    <i className="iconfont icon-icon-d-arrow-right" />
                  </div>
                </div>
              )}
            />
          </Card>
        </Col>
        <Col xs={7} sm={6} md={5} lg={5} xl={4} xxl={3} style={{ textAlign: 'right' }}>
          <ul className="m-product-type" style={{ marginTop: '1.666rem' }}>
            {
              productList.map((item, index) => (
                <li key={item.id}><span className="spot" style={{ background: `${item.simplicity}` }} />{item.name}</li>
              ))
            }

          </ul>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <div style={{ padding: '0' }}>
            <div className="font-color" style={{ fontSize: '1.5rem', paddingLeft: '20px', paddingTop: '10px' }}>{`${yearM}年${Months}月${day}日`}
              <span style={{ fontSize: '1.166rem', color: '#aaa', paddingLeft: '0.833rem' }}>{weekday}</span>
            </div>
          </div>
          <div style={{ padding: '0.833rem 0 0 0' }}>
            {
              currentDateProdData.length > 0 && currentDateProdData ? (
                <Tabs
                  className="m-tabs-underline m-tabs-underline-small"
                  style={{ borderBottom: 0 }}
                  defaultActiveKey="0"
                >
                  {
                    currentDateProdData.map((item, index) => {
                      const listData = lodash.get(item, 'arr', []);
                      return (
                        <Tabs.TabPane tab={item.name} key={index}>
                          <Row className="m-row ant-row" style={{ padding: '20px 0', margin: '0' }} key={index}>
                            {
                              listData.length > 0 && listData.map((keys, i) => (
                                <CardItem data={keys} key={i} />
                              ))
                            }
                          </Row>
                        </Tabs.TabPane>
                      );
                    })
                  }
                </Tabs>
              ) :
                currentDateProdData.length === 0 && (
                  <Col xs={24} sm={24} md={24} xl={24}>
                    <Card className="m-card" style={{ width: '100%', paddingTop: '1rem' }}>
                      <NoData height="200px" />
                    </Card>
                  </Col>
                )
            }
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default SchCalendar;
