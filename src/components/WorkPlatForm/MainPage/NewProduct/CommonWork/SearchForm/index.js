import { Button, Icon, Modal, Popover } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import lodash from 'lodash';
import CalendarPopover from './CalendarPopover';
// import { usePrevious } from '../util';
import ARROW_UP from '$assets/newProduct/arrow_up.svg';
import ARROW_DOWN from '$assets/newProduct/arrow_down.svg';
// import ARROW_LEFT from '$assets/newProduct/arrow_left.svg';
// import ARROW_RIGHT from '$assets/newProduct/arrow_right.svg';
import styles from '../index.less';

let isModalShow = false;

function SearchForm(props) {
  const [visible, setVisible] = useState(false); // 展开日历
  const [data, setData] = useState(['1', '2', '3', '4', '5', '6', '7']); // 当前分页器显示日期"天"数据
  const [activeItem, setActiveItem] = useState('1'); // 当前分页器选中日期"天"数据
  const ecifEventType = props.ecifEventType ;
  // const prevProps = usePrevious(props); // prevProps

  // 组件挂载后查询事件数
  useEffect(() => {
    props.queryCalContent();

    // ...
    // let signDateTemp = lodash.cloneDeep(signDate);
    // let time = lodash.cloneDeep(props.time);
    // time = time.add(1, 'months');
    // let finished = 0;
    // for (let i of new Array(12).keys()) {
    //   QueryCalContent({ month: time.subtract(1, 'months').format('YYYYMM') }).then((response) => {
    //     const { records = [] } = response;
    //     const newSignDate = records.filter(item => item.eventNum || item.taskNum || item.processNum);
    //     signDateTemp = [...signDateTemp, ...newSignDate];
    //     finished ++;
    //     if (finished >= 12) setSignDate(signDateTemp);
    //   }).catch((error) => {
    //     // message.error(error.success ? error.note : error.message);
    //   });
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // props.type, props.custRank, props.sort

  // 暴露给父组件展开收起日历的方法
  useEffect(() => {
    setVisible(props.searchFormSetVisible);
  }, [props, props.searchFormSetVisible]);

  // 查询
  const handleSubmit = useCallback((flag = 0) => {
    if (!flag) window.parent.postMessage({ action: 'queryBacklog' }, '*');
    props.queryBackLogList({ pagination: { current: 1, pageSize: 20, total: -1, paging: 1 } }).then((response) => {
      const listData = response?.records || [];
      if (listData.length) {
        if (props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.id === listData[0].id) {
          // const { refresh } = props;
          // if (refresh && typeof refresh === 'function') refresh();
        } else {
          if (listData[0].typeId === '2') {
            props.setActiveList('task0');
          } else if (listData[0].typeId === '1') {
            props.setActiveList('event0');
            if(listData[0].id === ecifEventType){
              props.setEventType('ecifEvent');
            }
          } else if (listData[0].typeId === '3') {
            props.setActiveList('flow0');
          }
        }
      } else {
        if (flag === 1 && props.calendar && !isModalShow) {
          isModalShow = true;
          Modal.info({
            title: '该日期没有待办，请选择其他日期',
            onOk() {
              isModalShow = false;
            },
          });
        }
      }
      props.setCurrent(1);
      props.setListData(listData);
    });
    props.queryCalContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  // 时间变化时计算数据重新渲染时间选择器
  useEffect(() => {
    const timeTemp = lodash.cloneDeep(props.time);
    const m = props.time.format('M');
    const d = props.time.format('D');
    let dataTemp = [];
    if (Number(d) < 4) {
      dataTemp = ['1', '2', '3', '4', '5', '6', '7'];
    } else if (timeTemp.add(3, 'days').format('M') !== m) {
      const lastDay = props.time.daysInMonth();
      dataTemp = [`${lastDay - 6}`, `${lastDay - 5}`, `${lastDay - 4}`, `${lastDay - 3}`, `${lastDay - 2}`, `${lastDay - 1}`, `${lastDay}`];
    } else {
      dataTemp = [`${Number(d) - 3}`, `${Number(d) - 2}`, `${Number(d) - 1}`, d, `${Number(d) + 1}`, `${Number(d) + 2}`, `${Number(d) + 3}`];
    }
    setActiveItem(d);
    setData(dataTemp);
    handleSubmit(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.time]);

  // 日期跨月查询事件数
  // useEffect(() => {
  //   const month = props.time.format('YYYYMM');
  //   const prevTime = lodash.get(prevProps, 'time', props.time);
  //   const prevMonth = prevTime.format('YYYYMM');
  //   if (month !== prevMonth) {
  //     let signDateTemp = lodash.cloneDeep(signDate);
  //     QueryCalContent({ month }).then((response) => {
  //       const { records = [] } = response;
  //       const newSignDate = records.filter(item => item.eventNum || item.taskNum || item.processNum);
  //       signDateTemp = [...signDateTemp, ...newSignDate];
  //       setSignDate(signDateTemp);
  //     }).catch((error) => {
  //       message.error(error.success ? error.note : error.message);
  //     });
  //   }
  // }, [prevProps, props.time, signDate]);

  // // 点击四个左右箭头计算时间
  // const computed = (way, count, unit) => {
  //   if (way === 'add') {
  //     const time = lodash.cloneDeep(props.time);
  //     props.setTime(time.add(count, unit));
  //   }
  //   if (way === 'subtract') {
  //     const time = lodash.cloneDeep(props.time);
  //     props.setTime(time.subtract(count, unit));
  //   }
  // };

  // 点击日期计算时间
  const handleTime = (day) => {
    const dateStringArray = props.time.format('YYYY-MM-D').split('-');
    dateStringArray[2] = day;
    const time = moment(dateStringArray.join('-'));
    props.setTime(time);
  };

  // // 重置
  // const reset = () => {
  //   props.setTime(moment());
  //   props.setType('0');
  //   props.setCustRank('0');
  //   props.setSort('1');
  // };
  
  // 开关日历
  const handSelectCan = (e) => {
    setVisible(!visible);
    props.setSearchFormSetVisible(!visible);
  };

  const computedstyle = (item, params = '') => {
    if (params) {
      let result = '';
      try {
        result = Number(props.signDate.find(dateItem => dateItem.date.substr(0, 6) === props.time.format('YYYYMM') && Number(dateItem.date.substr(6, 2)) === Number(item))[params]) ? 'block' : 'none';
      } catch (err) {
        result = 'none';
      }
      return result;
    } else {
      return props.signDate.find(dateItem => Number(dateItem.date.substr(6, 2)) === Number(item)) ? 'visible' : 'hidden';
    }
  };

  return (
    <div>
      {/* <Form style={{ margin: '24px 0 0', padding: '0 12px' }} className='m-form-default ant-advanced-search-form'>
        <Row className={`${styles.label} ${props.calendar ? '' : styles.formHeight}`}>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='待办类型'>
              <Select value={props.type} onChange={(value) => { props.setType(value); }}>
                <Select.Option key='0' value='0'>全部</Select.Option>
                <Select.Option key='1' value='1'>事件</Select.Option>
                <Select.Option key='2' value='2'>任务</Select.Option>
                <Select.Option key='3' value='3'>流程</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='客户级别'>
              <Select value={props.custRank} onChange={(value) => { props.setCustRank(value); }}>
                <Select.Option key='0' value='0'>全部</Select.Option>
                <Select.Option key='1' value='1'>V1-V4</Select.Option>
                <Select.Option key='2' value='2'>V4</Select.Option>
                <Select.Option key='3' value='3'>V5-V7(金桂卡)</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item`} label='排序规则'>
              <Select disabled={props.calendar} value={props.sort} onChange={(value) => { props.setSort(value); }}>
                <Select.Option key='1' value='1'>最近更新</Select.Option>
                <Select.Option key='2' value='2'>即将过期</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Form.Item style={{ cssFloat: 'right' }}>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={handleSubmit}>查询</Button>
            <Button className="m-btn-radius ax-btn-small" onClick={reset}>重置</Button>
          </Form.Item>
        </Row>
      </Form> */}
      {
        props.calendar && (
          <div style={{ display: 'flex', alignItems: 'center', color: '#1A2243', padding: '0 20px', height: 60, borderBottom: '1px solid #e8e8e8', position: 'relative' }}>
            {/* <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center' }} className={styles.hover} onClick={() => computed('subtract', 1, 'months')}>
              <img style={{ width: '100%', height: '100%' }} src={ARROW_LEFT} alt='' />
            </div> */}
            <div style={{ fontWeight: 600, padding: '0 6px' }}>{props.time.format('YYYY年MM月')}</div>
            {/* <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center' }} className={styles.hover} onClick={() => computed('add', 1, 'months')}>
              <img style={{ width: '100%', height: '100%' }} src={ARROW_RIGHT} alt='' />
            </div> */}

            {/* <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center', marginLeft: 32 }} className={styles.hover} onClick={() => computed('subtract', 1, 'days')}>
              <img style={{ width: '100%', height: '100%' }} src={ARROW_LEFT} alt='' />
            </div> */}
            {
              data.map(item => (
                <div key={`${props.time.format('YYYYMM') + item}`} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: 10, width: 18, visibility: 'hidden' }}>
                    {/* <div style={{ color: '#0079FF' }}>任务2</div>
                    <div style={{ color: '#F68A00' }}>事件3</div>
                    <div style={{ color: '#17A2FF' }}>流程4</div> */}
                  </div>
                  <div onClick={() => handleTime(item)} className={activeItem === item ? styles.activeDay : styles.day} style={{ margin: '0 5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{item}</div>
                  <div style={{ fontSize: 10, minWidth: '31.05px', visibility: computedstyle(item) }}>
                    <div style={{ color: '#0079FF', display: computedstyle(item, 'taskNum') }}>任务{props.signDate.find(dateItem => dateItem.date.substr(0, 6) === props.time.format('YYYYMM') && Number(dateItem.date.substr(6, 2)) === Number(item))?.taskNum}</div>
                    <div style={{ color: '#F68A00', display: computedstyle(item, 'eventNum') }}>事件{props.signDate.find(dateItem => dateItem.date.substr(0, 6) === props.time.format('YYYYMM') && Number(dateItem.date.substr(6, 2)) === Number(item))?.eventNum}</div>
                    <div style={{ color: '#17A2FF', display: computedstyle(item, 'processNum') }}>流程{props.signDate.find(dateItem => dateItem.date.substr(0, 6) === props.time.format('YYYYMM') && Number(dateItem.date.substr(6, 2)) === Number(item))?.processNum}</div>
                  </div>
                </div>
              ))
            }
            {/* <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center' }} className={styles.hover} onClick={() => computed('add', 1, 'days')}>
              <img style={{ width: '100%', height: '100%' }} src={ARROW_RIGHT} alt='' />
            </div> */}

            <div style={{ marginLeft: 5 }}>
              <Popover
                placement='bottom'
                visible={visible}
                arrowPointAtCenter={true}
                overlayClassName={styles.popover}
                overlayStyle={visible ? { padding: 0 } : { padding: 0, opacity: 0 }}
                content={<CalendarPopover
                  visible={visible}
                  time={props.time}
                  setTime={props.setTime}
                  setSearchFormSetVisible={props.setSearchFormSetVisible}
                  signDate={props.signDate}
                />}
              >
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handSelectCan}>
                  <div style={{ marginRight: 5 }}>{ visible ? '收起日历' : '展开日历' }</div>
                  <div style={{ width: 16, height: 16, display: 'flex', alignItems: 'center' }}>
                    <img style={{ width: '100%', height: '100%' }} src={visible ? ARROW_UP : ARROW_DOWN} alt='' />
                  </div>
                </div>
              </Popover>
            </div>
            { document.body.clientWidth > 950 && <div style={{ width: 83 }}></div> }
            <Button style={{ height: 34, color: '#61698C', paddingLeft: 9, paddingRight: 12, borderRadius: '1px', position: document.body.clientWidth > 950 ? 'static' : 'absolute', right: 20 }} onClick={() => { props.setCalendar(false); }}>关闭日历模式<Icon style={{ marginLeft: 3 }} type="close" /></Button>
          </div>
        )}
    </div>
  );
}

export default SearchForm;
