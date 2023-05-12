import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Link } from 'dva/router';
import styles from '../index.less';
import EXTRA1 from '$assets/newProduct/extra1.png';
import EXTRA1_BLUE from '$assets/newProduct/extra1_blue.png';
import EXTRA2 from '$assets/newProduct/extra2.png';
import EXTRA3 from '$assets/newProduct/extra3.png';
import WorkSet from '../Common/Dialog/WorkSet';
import { addSensors } from '../util';

function TabBarExtraContent(props) {
  const [visible, setVisible] = useState(false);

  // 开启日历模式相关ref
  let switchCalendar;
  let switchCalendarImg;
  let switchCalendarText;

  // 动态改变日历模式开关样式
  useEffect(() => {
    const switchCalendarTemp = switchCalendar;
    const switchCalendarImgTemp = switchCalendarImg;
    const switchCalendarTextTemp = switchCalendarText;
    const listener = (src, color) => {
      if (props.calendar) {
        switchCalendarImgTemp.setAttribute('src', src);
        switchCalendarTextTemp.style.color = color;
      }
    };
    const mouseoverListener = () => listener(EXTRA1_BLUE, '#5779ff');
    const mouseoutListener = () => listener(EXTRA1, '#1A2243');
    switchCalendarTemp.addEventListener('mouseover', mouseoverListener);
    switchCalendarTemp.addEventListener('mouseout', mouseoutListener);
    switchCalendarTextTemp.addEventListener('mouseover', mouseoverListener);
    switchCalendarTextTemp.addEventListener('mouseout', mouseoutListener);
    return () => {
      switchCalendarTemp.removeEventListener('mouseover', mouseoverListener);
      switchCalendarTemp.removeEventListener('mouseout', mouseoutListener);
      switchCalendarTextTemp.removeEventListener('mouseover', mouseoverListener);
      switchCalendarTextTemp.removeEventListener('mouseout', mouseoutListener);
    };
  }, [props.calendar, switchCalendar, switchCalendarImg, switchCalendarText]);

  useEffect(() => {
    if (props.calendar) addSensors('开启日历模式');
  }, [props.calendar]);

  useEffect(() => {
    if (visible) addSensors('管理');
  }, [visible]);

  const toMyTask = () => {
    // router.push('/newProduct/myTask');
    // addSensors('我的任务');
    // window.parent.postMessage({ action: 'changeHash', hash: '/bss/c5auth.sdo?menuCode=mytask&system=newWork' }, '*');
    const url = `/newProduct/myTask`;
    return url;
  };


  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', color: '#1A2243' }}>
      <div ref={(el) => { switchCalendar = el; }} style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => { props.setCalendar(!props.calendar); props.onChange(false); }}>
        <img ref={(el) => { switchCalendarImg = el; }} style={{ width: '100%', height: '100%' }} src={props.calendar ? EXTRA1 : EXTRA1_BLUE} alt='' />
      </div>
      <div ref={(el) => { switchCalendarText = el; }} style={{ paddingLeft: 5, cursor: 'pointer', color: props.calendar ? '#1A2243' : '#244FFF' }} onClick={() => { props.setCalendar(!props.calendar); props.onChange(false); props.setCustRank('0'); }}>{ props.calendar ? '已开启日历模式' : '开启日历模式' }</div>

      <div style={{ padding: '0 32px' }}>|</div>

      <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center' }}>
        <img style={{ width: '100%', height: '100%' }} src={EXTRA2} alt='' />
      </div>
      <div style={{ padding: '0 32px 0 5px' }} className={styles.hover} onClick={() => { setVisible(true); }}>管理</div>

      <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center' }}>
        <img style={{ width: '100%', height: '100%' }} src={EXTRA3} alt='' />
      </div>
      <Link to={toMyTask}>
        <div style={{ padding: '0 20px 0 5px' }} className={styles.hover}>我的任务</div>
      </Link>
      {/* <Select
        style={{ width: '250px' }}
        className={`${styles.select}`}
        suffixIcon={<i className='iconfont icon-sousuo' style={{ fontSize: 20, position: 'relative', top: -5, right: 5 }}></i>}
        showSearch
        filterOption={false}
        onSearch={debounceHandleSearch}
        value={value}
        onChange={handleChange}
        allowClear
        placeholder='请输入关键字'
        dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
        notFoundContent={<div style={{ color: '#959CBA', textAlign: 'center', padding: '5px 0' }}>未找到符合相关搜索的结果</div>}
        // onFocus={this.handleFocus}
      >
        { data.map(item => <Select.Option key={item.id} value={item.id}>{renderOption(item.sbj)}</Select.Option>) }
      </Select> */}

      <Modal
        visible={visible}
        title='工作设置'
        footer={null}
        onCancel={() => { setVisible(false); }}
        bodyStyle={{ padding: 0 }}
        centered
        width={614}
        destroyOnClose
      >
        <WorkSet handleCancel={() => { setVisible(false); }} />
      </Modal>
    </div>
  );
}

export default TabBarExtraContent;
