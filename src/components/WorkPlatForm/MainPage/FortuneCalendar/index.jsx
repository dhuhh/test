import React, { useState, useRef, useEffect } from 'react'
import { Badge, Calendar, Col, Radio, Row, Select, Input, DatePicker, Button, Divider, Spin } from 'antd';
import { Link } from 'dva/router';
import moment from 'moment';
import DropSelect from './dropSelect';
import { getMonth, getNotice, getProduct,getSearch } from '$services/fortuneCalendar'
import BasicDataTable from '$common/BasicDataTable';
import rightCalendar from '$assets/newProduct/rightCalendar.png';
import leftCalendar from '$assets/newProduct/leftCalendar.png'
import TableBn from './TableBn';
import './index.css'
import { withRouter } from 'umi';

moment.updateLocale('zh-cn', {
    weekdaysMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
})
const { RangePicker } = DatePicker;
function Fortune(props) {
  const [tjDate, setTjDate] = useState([moment(), moment()]);
  const [tellType, setTellType] = useState(['allIn'])
  const [productName, setProductName] = useState(['allIn'])
  const [mode, setMode] = useState(['date', 'date']);
  const [total, setTotal] = useState(0)
  const [showList, setShowList] = useState({})
  const [showOtherList, setOtherShowList] = useState({})
  const [loading, setLoading] = useState(false)
  const [caloading, setCaloading] = useState(false)
  const [current, setCurrent] = useState(1)
  const [pageList, setPageList] = useState([])
  const [currentMonth, setCurrentMonth] = useState(moment().month() + 1)
  const [pageSize, setPageSize] = useState(10)
  const [range, setRange] = useState(['0']);
  const [canValue, setCanValue] = useState(moment())
  const [isShowTable, setIsShowTable] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [calendarList, setCalendarList] = useState(
    [moment().format('YYYYMMDD'), moment().format('YYYYMMDD')])
  const [lyqColumns, setLyqColumns] = useState([
    {
      title: '日期',
      dataIndex: 'date',
      key: '日期',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: '产品名称',
    },
    {
      title: '产品代码',
      dataIndex: 'productCode',
      key: '产品代码',
    },
    {
      title: '产品类型',
      dataIndex: 'productType',
      key: '产品类型',
    },
    {
      title: '提醒类型',
      dataIndex: 'noticeType',
      key: '提醒类型',
    },
    {
      title: '详细信息',
      dataIndex: 'detail',
      key: '详细信息',
    },
    {
      title: '持仓客户姓名',
      dataIndex: 'customerName',
      key: '持仓客户姓名',
      render: (text, record) => (
        <Link
          to={`/customerPanorama/customerInfo?customerCode=${record.customerNo}`}
          target="_blank"
        >
          {text}
        </Link>
      )
    },
    {
      title: '客户号',
      dataIndex: 'customerNo',
      key: '客户号',
    },
    {
      title: '持有市值',
      dataIndex: 'marketValue',
      key: '持有市值',
    },
  ])
  const [state, setState] = useState({
    tellType: [
      {
        title: '全部',
        value: 'allIn',
        key: 'key',
        children: [
          {title: '到期', value: '1', key: '到期'},
          {title: '可赎回', value: '2', key: '可赎回'},
          {title: '可申购', value: '3', key: '可申购'},
          {title: '可认购', value: '4', key: '可认购'},
          {title: '分红到账', value: '5', key: '分红到账'}]
      }],
    productName: [],
    range: [
      {title: '全部', key: 'allIn', value: '0',},
      {title: '开发关系', key: 'belong', value: '1'},
      {title: '服务关系', key: '服务关系', value: '2'},
      {title: '无效户激活关系', key: '无效户激活关系', value: '3'},
      {title: '期权开发关系', key: '期权开发关系', value: '4'}]
  })
  const tellRef = useRef();
  const productRef = useRef();
  const rangeRef = useRef()
  useEffect(() => {
    // cr=all(客户访问固定为all)&nt=提醒类型(客户到期产品...)&pid=产品id&date=日期
    let selectThree = props.history.location.query
    if (selectThree.cr == 'all' && selectThree.date) {
      setRange(['0']);
      setProductName(selectThree.pid.split(','));
      setTellType(selectThree.nt.split(','));
      tellRef.current.reset(selectThree.nt.split(','))
      productRef.current.reset(selectThree.pid.split(','))
      rangeRef.current.reset(['0'])
      setCalendarList([selectThree.date, selectThree.date])
      setCanValue(moment(selectThree.date, 'YYYYMMDD'))
      setTjDate([
        moment(selectThree.date, 'YYYYMMDD'),
        moment(selectThree.date, 'YYYYMMDD')])
      setCurrentMonth(moment(selectThree.date, 'YYYYMMDD').month() + 1)
      getMonthDate(selectThree.date)
    } else { 
      getMonthDate(moment().format('YYYYMM'))
    }
    getMonthDate(moment().format('YYYYMM'))
    getProduct({
      startDate: selectThree.cr == 'all' && selectThree.date ?
        selectThree.date :
        moment().format('YYYYMMDD'),
      endDate: selectThree.cr == 'all' && selectThree.date ?
        selectThree.date :
        moment().format('YYYYMMDD')
    }).then((res) => {
      let newProduct = [
        {
          title: '全部',
          value: 'allIn',
          key: 'allIn',
          children: []
        }]
      res.records.map((item) => {
        newProduct[0].children.push({
          title: item.productName,
          value: item.productId,
          key: item.productId,
          searchValue: item.productName + item.productId
        })
      })
      setState({
        ...state,
        productName: newProduct
      })
    })

  }, [])
  useEffect(() => {
    if (state.productName.length) {
      getPageList()
    }
  }, [state])
  const didMountRef = useRef(false);
  //此hook跳过首次执行
  useEffect((val) => {
    if (didMountRef.current) {
      testlyq(calendarList[0], calendarList[1])
    } else {
      didMountRef.current = true
    }
  }, [calendarList])
  const calendarTagsList = {
    '1': '申购/认购',
    '2': '到期/赎回',
    '3': '分红到账',
  }

  const getListData = (value) => {
    let myShowList = value.month() + 1 == currentMonth ?
      showList :
      showOtherList
    let listData = myShowList[value.date()]?.map(val => {
      return {
        content: calendarTagsList[val],
        key: `value.date()${val}` + value.date(),
        type: `${val}`
      }
    });
    return listData || []
  };
  const getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };
  const testlyq = (startDate, endDate) => {
    setLoading(true)
    getMonth({
      startDate: startDate,
      endDate: endDate
    }).then(res => {
      if (res.records.filter(item => item.type === '3').length > 0) {
        if (lyqColumns.filter(items => items.dataIndex === 'amount').length ===
          0) {
          setLyqColumns([
            ...lyqColumns, {
              title: '分红金额',
              dataIndex: 'amount',
              key: '分红金额',
            }])
        }
      } else {
        setLyqColumns([
          {
            title: '日期',
            dataIndex: 'date',
            key: '日期',
          },
          {
            title: '产品名称',
            dataIndex: 'productName',
            key: '产品名称',
          },
          {
            title: '产品代码',
            dataIndex: 'productCode',
            key: '产品代码',
          },
          {
            title: '产品类型',
            dataIndex: 'productType',
            key: '产品类型',
          },
          {
            title: '提醒类型',
            dataIndex: 'noticeType',
            key: '提醒类型',
          },
          {
            title: '详细信息',
            dataIndex: 'detail',
            key: '详细信息',
          },
          {
            title: '持仓客户姓名',
            dataIndex: 'customerName',
            key: '持仓客户姓名',
            render: (text, record) => (
              <Link
                to={`/customerPanorama/customerInfo?customerCode=${record.customerNo}`}
                target="_blank"
              >
                {text}
              </Link>
            )
          },
          {
            title: '客户号',
            dataIndex: 'customerNo',
            key: '客户号',
          },
          {
            title: '持有市值',
            dataIndex: 'marketValue',
            key: '持有市值',
          },
        ])
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const getMonthDate = (date) => {
    let inLine = (moment(date, 'YYYYMM').daysInMonth() == 31 &&
      (moment(date, 'YYYYMM').startOf('month').day() == 0 ||
        moment(date, 'YYYYMM').startOf('month').day() == 6) ||
      (moment(date, 'YYYYMM').daysInMonth() == 30 &&
        moment(date, 'YYYYMM').startOf('month').day() == 0)) ? 0 : 1
    let next = moment(date, 'YYYYMM').endOf('month').day() == 0 ?
      7 * inLine :
      7 * inLine + (7 - moment(date, 'YYYYMM').endOf('month').day())
    let before = moment(date, 'YYYYMM').startOf('month').day() == 0 ?
      6 :
      moment(date, 'YYYYMM').startOf('month').day() - 1;
    let start = moment(date, 'YYYYMM').startOf('month').add(-before, 'd')
    let end = moment(date, 'YYYYMM').endOf('month').add(next, 'd')
    setCaloading(true);
    setShowList({})
    setOtherShowList({})
    getMonth({
      startDate: start.format('YYYYMMDD'),
      endDate: end.format('YYYYMMDD')
    }).then((res) => {
      let obj1 = {}, obj2 = {}
      res.records.map(item => {
        if (item.date.slice(4, 6) == date.slice(4, 6)) {
          let id = item.date.slice(6, 7) == '0' ?
            item.date.slice(7) :
            item.date.slice(6)
          if (obj1[id]) {
            obj1[id].includes(item.type) ? '' : obj1[id].push(item.type)
          } else {
            obj1[id] = [item.type]
          }
        } else {
          let id = item.date.slice(6, 7) == '0' ?
            item.date.slice(7) :
            item.date.slice(6)
          if (obj2[id]) {
            obj2[id].includes(item.type) ? '' : obj2[id].push(item.type)
          } else {
            obj2[id] = [item.type]
          }
        }

      })
      setShowList(obj1);
      setOtherShowList(obj2);
      setCaloading(false)
    })
  }
  const selectDate = (e, value) => {
    // setCanValue(moment(20220908,'YYYYMMDD'))
    e.stopPropagation();
    setTjDate([value, value]);
    setCalendarList([value.format('YYYYMMDD'), value.format('YYYYMMDD')])
    //testlyq(value.format('YYYYMMDD'), value.format('YYYYMMDD'))
  }
  const selectOther = (e, value) => {
    e.stopPropagation();
    getMonthDate(value.format('YYYYMM'))
    setCurrentMonth(value.month() + 1)
    setCanValue(value)
    setTjDate([value, value]);
    setCalendarList([value.format('YYYYMMDD'), value.format('YYYYMMDD')])
  }
  const handlePanelChange = (tjDate, mode) => {
    setTjDate(
      tjDate.sort((a, b) => a.format('YYYYMMDD') - b.format('YYYYMMDD')));
    setMode([mode[0], mode[1]]);
  };
  const handleChange = (tjDate) => {
    setTjDate(tjDate);
    setCalendarList(
      [tjDate[0].format('YYYYMMDD'), tjDate[1].format('YYYYMMDD')])
    //testlyq(tjDate[0].format('YYYYMMDD'), tjDate[1].format('YYYYMMDD'))

  }

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div className={[
        calendarList[0] == calendarList[1] && value.format('YYYYMMDD') ==
        calendarList[0] && currentMonth == calendarList[0].slice(4, 6) ?
          'onlyOne' :
          '',
        disabledDate(value) ? 'notHover' : '',
        'isBorder',
        value.clone().month() + 1 == currentMonth ?
          'calendar-date' :
          'calendar-otherDate',
        value.format('YYYYMMDD') == moment().format('YYYYMMDD') ?
          'isToday' :
          ''].join(' ')}
           id={(moment(calendarList[0], 'YYYYMMDD').isBefore(value) &&
             value.isBefore(moment(calendarList[1], 'YYYYMMDD'))) ||
           value.format('YYYYMMDD') == calendarList[0] ||
           value.format('YYYYMMDD') == calendarList[1] ? 'hasSelect' : ''}
           onClick={value.clone().month() + 1 == currentMonth &&
           !disabledDate(value) ?
             (e) => selectDate(e, value) :
             (value.clone().month() + 1 != currentMonth &&
             !disabledDate(value) ? (e) => {
               selectOther(e, value)
             } : (e) => {
               e.stopPropagation()
             })} style={{
        cursor: disabledDate(value) ? 'not-allowed' : 'pointer',
        color: disabledDate(value) ? '#959CBA' : '',
        fontWeight: disabledDate(value) ? 600 : ''
      }}>
        {value.clone().month() == currentMonth - 1 ?
          <span>{value.clone().date()}{value.format('YYYYMMDD') ==
            moment().format('YYYYMMDD') && ' (今日)'}</span> :
          <span onClick={() => {
            return false
          }}>{value.clone().date()}</span>}
        <div className={listData.length === 1 ? 'events2' : 'events'}>
          {listData.length > 0 ? listData.map((item) => (
            <div key={item.content} className={item?.type == '1' ?
              'isOrangeItem' :
              item?.type == '2' ? 'isBlueItem' : 'isRedItem'}>
              <span>{item.content}</span>
            </div>
          )) : ''}
        </div>
        {/* <ul className="events">
                    {listData.length>0?listData.map((item) => (
                        <li key={item.content} className={item?.type=='2'?'isBlueItem':'isOrangeItem'}>
                            <span>{item.content}</span>
                        </li>
                    )):''}
                </ul> */}
      </div>
    );
  };
  const getColumns = () => lyqColumns
  const reset = () => {
    let selectThree = props.history.location.query
    if (selectThree.cr == 'all' && selectThree.date) {
      setRange(['0']);
      setProductName(selectThree.pid.split(','));
      setTellType(selectThree.nt.split(','));
      tellRef.current.reset(selectThree.nt.split(','))
      productRef.current.reset(selectThree.pid.split(','))
      rangeRef.current.reset(['0'])
      setCalendarList([selectThree.date, selectThree.date])
      setCanValue(moment(selectThree.date, 'YYYYMMDD'))
      setTjDate([
        moment(selectThree.date, 'YYYYMMDD'),
        moment(selectThree.date, 'YYYYMMDD')])
      setCurrentMonth(moment(selectThree.date, 'YYYYMMDD').month() + 1)
    } else {
      setTjDate([moment(), moment()]);
      tellRef.current.reset(['allIn']);
      productRef.current.reset(['allIn']);
      rangeRef.current.reset(['0']);
      setTellType(['allIn']);
      setProductName(['allIn']);
      setCanValue(moment())
      setCalendarList(
        [moment().format('YYYYMMDD'), moment().format('YYYYMMDD')])
      setRange(['0']);
      setCurrentMonth(moment().month() + 1)
    }

    setNameValue('');
  }
  const disabledDate = (current) => {
    if (current && (current >
      moment().add(7, 'd').weekday(7).subtract(1, 'd').endOf('day') || current <
      moment().subtract(6, 'month').startOf('day'))) {
      return true
    }
    return false
  }
  const getPageList = (pageNo, pageSizes, isSearch) => {
    if (isSearch) {
      setCurrent(1)
    }
    let start = tjDate[0].year().toString() + (tjDate[0].month() + 1 < 10 ?
        '0' + (tjDate[0].month() + 1) :
        (tjDate[0].month() + 1)) +
      (tjDate[0].date() < 10 ? ('0' + tjDate[0].date()) : tjDate[0].date())
    let end = tjDate[1].year().toString() + (tjDate[1].month() + 1 < 10 ?
        '0' + (tjDate[1].month() + 1) :
        (tjDate[1].month() + 1)) +
      (tjDate[1].date() < 10 ? ('0' + tjDate[1].date()) : tjDate[1].date())
    setLoading(true)
    let pageNum = pageNo ? pageNo : current;
    let pageList = pageSizes ? pageSizes : pageSize;
    getNotice({
      startTime: start,
      endTime: end,
      noticeType: tellType.includes('allIn') ? '' : tellType.join(','),
      productName: productName.includes('allIn') ? '' : productName.join(','),
      customerName: nameValue,
      customerRange: Array.isArray(range) ? range.join(',') : range,
      pageNo: isSearch ? 1 : pageNum,
      pageSize: pageList
    }).then((res) => {
      setPageList(res.records)
      setTotal(res.total)
      setLoading(false)
    })
  }

  const params = () => {
    let start = tjDate[0].year().toString() + (tjDate[0].month() + 1 < 10 ?
        '0' + (tjDate[0].month() + 1) :
        (tjDate[0].month() + 1)) +
      (tjDate[0].date() < 10 ? ('0' + tjDate[0].date()) : tjDate[0].date())
    let end = tjDate[1].year().toString() + (tjDate[1].month() + 1 < 10 ?
        '0' + (tjDate[1].month() + 1) :
        (tjDate[1].month() + 1)) +
      (tjDate[1].date() < 10 ? ('0' + tjDate[1].date()) : tjDate[1].date())
    return {
      startTime: start,
      endTime: end,
      noticeType: tellType.includes('allIn') ? '' : tellType.join(','),
      productName: productName.includes('allIn') ? '' : productName.join(','),
      customerName: nameValue,
      customerRange: Array.isArray(range) ? range.join(',') : range,
      // pageNo: current,
      // pageSize: pageSize
    }
  }

  const tableProps = {
    bordered: true,
    scroll: {x: true},
    rowKey: 'key',
    dataSource: pageList.map((item, index) => {
      return {...item, key: ((current - 1) * pageSize) + index + 1};
    }),
    columns: lyqColumns,
    className: 'm-Card-Table',
    pagination: {
      className: 'm-bss-paging',
      showTotal: totals => {
        return `总共${totals}条`;
      },
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      total,
      current,
      pageSize,
      onChange: (current, pageSize) => {
        setCurrent(current);
        setPageSize(pageSize);
        // getCloumn(current, pageSize);
        getPageList(current, pageSize)
      },
      onShowSizeChange: (current, pageSize) => {
        (() => {
          setCurrent(current);
          setPageSize(pageSize);
          //   getCloumn(current, pageSize);
          getPageList(current, pageSize)
        })();
      },
    },
  };
  const changeRangeData = (data) => {
    let res = []
    res[0] = data[0]
    res[0].children = data.filter((item, index) => index !== 0)
    return res
  }
  return (
    <div className='force-calendar'>
      <Spin spinning={caloading}>
        <Calendar dateFullCellRender={dateCellRender}
          // monthCellRender={monthCellRender}
                  value={canValue}
                  headerRender={({value, type, onChange, onTypeChange}) => {
                    const start = 0;
                    const end = 12;
                    const monthOptions = [];
                    const current = value.clone();
                    const localeData = value.localeData();
                    const months = [];
                    for (let i = 0; i < 12; i++) {
                      current.month(i);
                      months.push(localeData.monthsShort(current));
                    }
                    for (let i = start; i < end; i++) {
                      monthOptions.push(
                        <Select.Option key={i} value={i} className="month-item">
                          {months[i]}
                        </Select.Option>,
                      );
                    }
                    const year = value.year();
                    const month = value.month();
                    const options = [];
                    for (let i = year - 10; i < year + 10; i += 1) {
                      options.push(
                        <Select.Option key={i} value={i} className="year-item">
                          {i}
                        </Select.Option>,
                      );
                    }
                    return (
                      <div
                        style={{
                          padding: 8,
                          paddingTop: 24,
                          fontSize: 20,
                          fontWeight: 500,
                          color: '#1A2243',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <span onClick={() => {
                          onChange(value.clone().month(month - 1));
                          month == 0 ?
                            setCurrentMonth(12) :
                            setCurrentMonth(month);
                          month == 0 ?
                            getMonthDate((year - 1).toString() + '12') :
                            getMonthDate(year.toString() +
                              (month < 10 ? ('0' + month) : month));
                          setCanValue(
                            moment(year.toString() + (month + 1).toString(),
                              'YYYYMM').subtract(1, 'months').startOf('month'))
                        }}><img src={leftCalendar} style={{
                          width: '16px',
                          marginRight: '4px',
                          marginTop: '-4px'
                        }} className='btn-hover'/></span>
                        <span>{year + '年' + (month + 1) + '月'}</span>
                        <span onClick={() => {
                          onChange(value.clone().month(month + 1));
                          month == 11 ?
                            setCurrentMonth(1) :
                            setCurrentMonth(month + 2);
                          month == 11 ?
                            getMonthDate((year + 1).toString() + '01') :
                            getMonthDate(year.toString() + (month + 2 < 10 ?
                              ('0' + (month + 2)) :
                              month + 2));
                          setCanValue(
                            moment(year.toString() + (month + 1).toString(),
                              'YYYYMM').add(1, 'months').startOf('month'))
                        }}><img src={rightCalendar} style={{
                          width: '16px',
                          marginLeft: '4px',
                          marginTop: '-4px'
                        }} className='btn-hover'/></span>
                        {/* </Col>
                        </Row> */}
                      </div>
                    );
                  }}/>
      </Spin>
      <div className='align-select'>
        <div style={{display: 'inline-block'}}>
          <span className='select-title'>时间范围</span>
          <RangePicker
            allowClear={false}
            mode={mode}
            value={tjDate}
            //  className={styles.rangePicker}
            className='rangePicker-inbass'
            dropdownClassName={`calendar m-bss-range-picker`}
            style={{width: '250px', marginBottom: '12px'}}
            placeholder={['开始日期', '结束日期']}
            format={"YYYY-MM-DD"}
            separator='至'
            disabledDate={(current) => disabledDate(current)}
            // getCalendarContainer={(trigger) => trigger.parentNode}
            onChange={(tjDate) => handleChange(tjDate)}
            onPanelChange={handlePanelChange}
          />
        </div>
        <div style={{display: 'inline-block'}}><span
          className='select-title'>提醒类型</span><DropSelect tid='tellType'
                                                              ref={tellRef}
                                                              showValue={tellType}
                                                              getSelect={(value) => {
                                                                setTellType(
                                                                  value)
                                                              }}
                                                              isShowAll={true}
                                                              showSearch={true}
                                                              treeData={state.tellType}/>
        </div>
        <div style={{display: 'inline-block'}}><span
          className='select-title'>产品名称</span><DropSelect tid='productName'
                                                              ref={productRef}
                                                              showValue={productName}
                                                              getSelect={(value) => {
                                                                setProductName(
                                                                  value)
                                                              }}
                                                              isShowAll={true}
                                                              showSearch={true}
                                                              treeData={state.productName}/>
        </div>
        <div style={{display: 'inline-block'}}><span
          className='select-title'>所属范围</span><DropSelect tid='range'
                                                              ref={rangeRef}
                                                              showValue={range}
                                                              isRadio={true}
                                                              getSelect={(value) => {
                                                                setRange(value)
                                                              }}
                                                              isShowAll={false}
                                                              showSearch={false}
                                                              treeData={state.range}/>
        </div>
        <div style={{display: 'inline-block', marginRight: '38px'}}><span
          className='select-title'>客户</span><Input
          placeholder='客户姓名/客户号/资金账号' value={nameValue}
          style={{width: '250px', height: '32px', borderRadius: '2px'}}
          onChange={(e) => {
            setNameValue(e.target.value)
          }}/></div>
        <div style={{display: 'inline-block'}}><Button
          className='ant-btn-calendar' onClick={reset}>重置</Button><Button
          className='ant-btn-calendar ant-submit-calendar'
          onClick={() => getPageList(current, pageSize, true)}>查询</Button>
        </div>
        {/* </div> */}
        {/* <Divider /> */}
        <TableBn getColumns={getColumns} param={params} total={total}/>
        <BasicDataTable {...tableProps} loading={loading}/>
      </div>
    </div>
  )
}
export default withRouter(Fortune)
