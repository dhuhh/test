import { Col, Row, Select, Spin } from 'antd';
import React, { useState, useReducer, useEffect, useRef } from 'react';
import lodash from 'lodash';
import { connect } from 'dva';
import getIframeSrc from '$utils/getIframeSrc';
import BacklogList from './BacklogList';
// import Detail from './Detail';
import DataTable from './DataTable';
import styles from '../index.less';
import Iframe from 'react-iframe';
import filter_1 from '$assets/newProduct/filter_1.png';
import filter_2 from '$assets/newProduct/filter_2.png';
import filter_3 from '$assets/newProduct/filter_3.png';



function DataList(props) {
  const [value, setValue] = useState(undefined);
  const [src, setSrc] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [height, setHeight] = useState(800); // scrollbar高度
  const ref = useRef(null);
  const [width, setWidth] = useState(374);
  const [zIndex, setZIndex] = useState(-1);

  const { state, func: dispatch } = props;
  const ecifEventType = props.ecifEventType ;


  const onChange = (refresh) => {
    const { onChange } = props;
    if (onChange && typeof onChange === 'function') onChange(refresh);
  };

  const handleChange = (value, option) => {
    setValue(value);
    if (typeof value === 'undefined') setData([]);
    props.setKeyWord(data.find(item => item.id === value)?.sbj || '');
    props.queryBackLogList({ pagination: { current: 1, pageSize: 20, total: -1, paging: 1 }, keyWord: data.find(item => item.id === value)?.sbj || '' }).then((response) => {
      const listData = response?.records || [];
      if (listData.length) {
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
      props.setCurrent(1);
      props.setListData(listData);
    });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setLoading(true);
    props.queryBackLogList({ pagination: { current: 1, pageSize: 8, total: -1, paging: 1 }, keyWord: value }, 1).then((response) => {
      const data = response?.records || [];
      setData(data);
      setLoading(false);
    });
  };

  const debounceHandleSearch = lodash.debounce(handleSearch, 300);

  const renderOption = (value) => {
    if (typeof value === 'string') {
      const startIndex = value.indexOf(searchValue);
      const endIndex = startIndex + searchValue.length - 1;
      const str1 = value.substring(0, startIndex);
      const str2 = value.substring(startIndex, endIndex + 1);
      const str3 = value.substring(endIndex + 1, value.length);
      return (
        <div style={{ color: '#1A2243' }}>
          <span>{str1}</span>
          <span style={{ color: '#FF6E30' }}>{str2}</span>
          <span>{str3}</span>
        </div>
      );
    } else {
      return '';
    }
  };

  const listener = (e) => {
    setWidth(e.clientX);
  };

  const handleMouseDown = (e) => {
    setZIndex(1);
    document.body.addEventListener('mousemove', listener, { capture: true, passive: true });
    document.body.addEventListener('mouseup', () => {
      document.body.removeEventListener('mousemove', listener, { capture: true, passive: true });
      setZIndex(-1);
    }, { once: true });
  };

  const handleMouseUp = (e) => {
    document.body.removeEventListener('mousemove', listener, { capture: true,passive: true });
    setZIndex(-1);
  };

  const handleSelectTag1 = (e) => {
    dispatch({ type: 'open1', value: true });
    dispatch({ type: 'open2', value: false });
    dispatch({ type: 'open3', value: false });
    e.stopPropagation();

  };
  const handleSelectTag2 = (e) => {
    dispatch({ type: 'open1', value: false });
    dispatch({ type: 'open2', value: true });
    dispatch({ type: 'open3', value: false });
    e.stopPropagation();
  };
  const handleSelectTag3 = (e) => {
    dispatch({ type: 'open1', value: false });
    dispatch({ type: 'open2', value: false });
    dispatch({ type: 'open3', value: true });
    e.stopPropagation();
  };

  return (
    <Spin spinning={props.loading}>
      <Row type='flex' style={{ color: '#1A2243', width: '100%', margin: '0' }}>
        <Col style={{ width: width, overflow: 'hidden' }}>
          <div ref={ref} style={{ marginBottom: 6, width: '100%', height: 40, background: '#F7F8FA', display: 'flex', alignItems: 'center', padding: '0 10px 0 14px', position: 'relative' }}>
            <div id='selectTag1' onClick={handleSelectTag1} className={`${props.type === '0' ? styles.filterTag : styles.filterTagActive}`} style={{ width: 28, height: 22, borderRadius: '2px', marginRight: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <div style={{ width: 14, height: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img style={{ width: '100%', height: '100%' }} src={filter_1} alt='' />
              </div>
              <div style={{ width: 0, height: 0, borderTop: '5px solid #61698C', borderLeft: '3px solid transparent', borderRight: '3px solid transparent' }}></div>
              <Select
                style={{ position: 'absolute' }}
                value={props.type}
                onChange={(value) => { props.setType(value); }}
                dropdownMatchSelectWidth={false}
                className={styles.selectTag}
                getPopupContainer={(triggerNode) => triggerNode.parentNode} // 菜单渲染父节点
                dropdownClassName={`${styles.selectTag1} ${props.calendar ? styles.selectTagTopCalendar1 : styles.selectTagTop1}`}
                open={state.open1}
              >
                <Select.Option key='0' value='0'>全部</Select.Option>
                <Select.Option key='1' value='1'>事件</Select.Option>
                <Select.Option key='2' value='2'>任务</Select.Option>
                <Select.Option key='3' value='3'>流程</Select.Option>
              </Select>
            </div>
            <div id='selectTag2' onClick={handleSelectTag2} className={`${props.custRank === '0' ? styles.filterTag : styles.filterTagActive}`} style={{ width: 28, height: 22, borderRadius: '2px', marginRight: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img style={{ width: '100%', height: '100%' }} src={filter_2} alt='' />
              </div>
              <div style={{ width: 0, height: 0, borderTop: '5px solid #61698C', borderLeft: '3px solid transparent', borderRight: '3px solid transparent' }}></div>
              <Select
                style={{ position: 'absolute' }}
                value={props.custRank}
                onChange={(value) => { props.setCustRank(value); }}
                dropdownMatchSelectWidth={false}
                className={styles.selectTag}
                getPopupContainer={(triggerNode) => triggerNode.parentNode} // 菜单渲染父节点
                dropdownClassName={`${styles.selectTag2} ${props.calendar ? styles.selectTagTopCalendar2 : styles.selectTagTop2}`}
                open={state.open2}
              >
                <Select.Option key='0' value='0'>全部</Select.Option>
                <Select.Option key='1' value='1'>V1-V4</Select.Option>
                <Select.Option key='2' value='2'>V4</Select.Option>
                <Select.Option key='3' value='3'>V5-V7(金桂卡)</Select.Option>
              </Select>
            </div>
            <div id='selectTag3' onClick={handleSelectTag3} className={`${props.calendar ? styles.disabled : props.sort === '1' ? styles.filterTag : styles.filterTagActive}`} style={{ width: 28, height: 22, borderRadius: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img style={{ width: '100%', height: '100%' }} src={filter_3} alt='' />
              </div>
              <div style={{ width: 0, height: 0, borderTop: '5px solid #61698C', borderLeft: '3px solid transparent', borderRight: '3px solid transparent' }}></div>
              <Select
                style={{ position: 'absolute' }}
                value={props.sort}
                onChange={(value) => { props.setSort(value); }}
                dropdownMatchSelectWidth={false}
                className={styles.selectTag}
                getPopupContainer={(triggerNode) => triggerNode.parentNode} // 菜单渲染父节点
                dropdownClassName={`${styles.selectTag3} ${props.calendar ? styles.selectTagTopCalendar3 : styles.selectTagTop3}`}
                open={props.calendar ? false : state.open3}
              >
                <Select.Option key='1' value='1'>最近更新</Select.Option>
                <Select.Option key='2' value='2'>即将过期</Select.Option>
              </Select>
            </div>
            <Select
              style={{ width: '197px', height: '28px', position: 'absolute', right: '10px', color: '#1A2243' }}
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
              dropdownClassName={styles.selectDropdown}
              notFoundContent={<div style={{ color: '#959CBA', textAlign: 'center', padding: '5px 0' }}>未找到符合相关搜索的结果</div>}
              // onFocus={this.handleFocus}
            >
              { data.map(item => <Select.Option key={item.id} value={item.id}>{renderOption(item.sbj)}</Select.Option>) }
            </Select>
          </div>
          <BacklogList
            activeList={props.activeList}
            setActiveList={props.setActiveList}
            listData={props.listData}
            setListData={props.setListData}
            pageSize={props.pageSize}
            setPageSize={props.setPageSize}
            current={props.current}
            setCurrent={props.setCurrent}
            total={props.total}
            queryBackLogList={props.queryBackLogList}
            calendar={props.calendar}
            height={height}
            setHeight={setHeight}
            width={width}
            eventType={props.eventType}
            setEventType={props.setEventType}
            ecifEventType={ecifEventType}
          />
        </Col>
        <Col onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onClick={handleMouseUp} style={{ width: 1, background: '#e8e8e8', cursor: 'e-resize' }}></Col>
        <Col style={{ width: `calc(100% - ${width}px - 1px)`, position: 'relative', overflow: 'hidden' ,background:'#EAECF2'}}>
          { props.listData.length ? (
          <>
          { props.activeList && props.activeList.replace(/[0-9]/g, '') !== 'flow' ? (
            <div style={{ width: '100%' }} key={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.id}>
              {/* 点击左侧列表初始化右侧框内所有组件 */}
              {/* <Detail
                activeList={props.activeList}
                listData={props.listData}
              /> */}
              <DataTable
                activeList={props.activeList}
                setActiveList={props.setActiveList}
                listData={props.listData}
                setListData={props.setListData}
                pageSize={props.pageSize}
                current={props.current}
                queryBackLogList={props.queryBackLogList}
                queryCalContent={props.queryCalContent}
                onChange={onChange}
                calendar={props.calendar}
                time={props.time}
                height={height}
                setHeight={setHeight}
                width={width}
                eventType={props.eventType}
                setEventType={props.setEventType}
                ecifEventType={ecifEventType}
              />
            </div>
          ) : (
          <>
            <Iframe className={styles.backlogIframe} height='100%' width='100%' src={getIframeSrc(props.tokenAESEncode, `${props.sysParam?.find(i => i.csmc === 'system.c4ym.url')?.csz || ''}/ShowWorkflow?NewWindow=true&HideCancelBtn=true&PopupWin=false&wfid=${props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.attac}&stepId=${props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.strategy}`, props.sysParam?.find(i => i.csmc === 'system.c4ym.url')?.csz || '')} />
            <div style={{ width: '100%', height: '100%', background: 'transparent', position: 'absolute', top: 0, left: 0, zIndex: zIndex }} />
          </>
          )}
          </>
          ) : ''}
        </Col>
      </Row>
    </Spin>
  );
}

export default connect(({ global }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
  sysParam: global.sysParam,
  tokenAESEncode: global.tokenAESEncode,
}))(DataList);
