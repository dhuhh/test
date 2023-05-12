/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { Card, message, Tabs } from 'antd';
import { connect } from 'dva';
import getIframeSrc from '$utils/getIframeSrc';
import Iframe from 'react-iframe';
import moment from 'moment';
import sensors from 'sa-sdk-javascript';
import SearchForm from './SearchForm';
import DataList from './DataList';
import TabBarExtraContent from './TabBarExtraContent';
import { QueryBackLogList, QueryCalContent ,QueryServieBackLogList } from '$services/newProduct';
import styles from './index.less';

function reducer(state, action) {
  const newState = { ...state };
  newState[action.type] = action.value;
  return newState;
}

function Work(props) {
  // 容器组件，存放所有公共state
  const [activeKey, setActiveKey] = useState(props.activeKey || 'backlog'); // tabs栏activeKey
  const [calendar, setCalendar] = useState(false); // 日历模式是否开启
  const [time, setTime] = useState(moment()); // 当前选中时间
  const [searchFormSetVisible, setSearchFormSetVisible] = useState(false); // 日历组件展开状态
  const [activeList, setActiveList] = useState(''); // 列表激活key task|任务 event|事件 flow|流程
  const [type, setType] = useState('0'); // 待办类型 0|全部;1|事件;2|任务;3|流程
  const [eventType,setEventType] = useState ('otherEvent') ; // 不同事件类型 ecif |ecifEvent根据id  测试241|生产292    其他事件 | otherEvent
  const [ecifEventType,setEcifEventType] = useState ('292') ;// ecif事件类型  ecifEvent根据id 241
  const [custRank, setCustRank] = useState('0'); // 客户级别 0|全部;1|V1-V4;2|V4;3|V5-V7
  const [sort, setSort] = useState('1'); // 排序规则 1|最近更新;2|即将过期;3|日历模式
  const [loading, setLoading] = useState(false); // 列表加载loading
  const [listData, setListData] = useState([]); // 列表数据
  const [current, setCurrent] = useState(1); // 当前页数
  const [pageSize, setPageSize] = useState(20); // 展示数据条数
  const [total, setTotal] = useState(0); // 数据总数
  const [keyWord, setKeyWord] = useState(''); // 关键字
  const [signDate, setSignDate] = useState([]); // 有任务|事件|流程的日期
  const refresh = useRef(null);
  const [state, dispatch] = useReducer(reducer, { open1: false, open2: false, open3: false });

  // 通过默认事件消除左侧弹窗的显隐
  const handleClick = () => {

    dispatch({ type: 'open1', value: false });
    dispatch({ type: 'open2', value: false });
    dispatch({ type: 'open3', value: false });
  };

  const func = (payload) => {
    dispatch(payload);
  };

  useEffect(() => {
    queryBackLogList().then((response) => {
      const listData = response.records || [];
      let types = window.location.hostname === 'crm.axzq.com.cn' ? '241' : window.location.hostname === 'crm.essence.com.cn' ? '292' : '241' ;
      setEcifEventType(types);
      setListData(listData);
      if (listData.length) {
        const obj = listData[0];
        if (obj.typeId === '1') {
          setActiveList('event0');
          if(obj.id === types){
            setEventType('ecifEvent');
          }
        } else if (obj.typeId === '2') {
          setActiveList('task0');
        } else if (obj.typeId === '3') {
          setActiveList('flow0');
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendar, sort, custRank, type, pageSize, current]);

  useEffect(() => {
    if (activeKey === 'backlog') {
      sensors.track('page_view', {
        first_module: '员工端PC',
        second_module: '工作',
        ax_page_name: '待办',
        ax_page_url: location.href,
        staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
        source_from: '',
        card_id: '',
        card_name: '',
      });
    } else {
      sensors.track('page_view', {
        first_module: '员工端PC',
        second_module: '工作',
        ax_page_name: '消息',
        ax_page_url: location.href,
        staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
        source_from: '',
        card_id: '',
        card_name: '',
      });
    }
  }, [activeKey]);

  // 查询列表
  const queryBackLogList = (payload = {}, flag = 0) => {
    if (!flag) setLoading(true);
    const { pagination = { current, pageSize, total: -1, paging: 1 } } = payload;
    const params = {
      sort: calendar ? '3' : payload.sort || sort,
      isPC: '241', // 区分是否是pc  跟APP 
      type: Number(payload.type) || Number(type),
      custRank: Number(payload.custRank) || Number(custRank),
      ...pagination,
      isMessage: 1,
    };
    if (calendar) params['date'] = time.format('YYYYMMDD');
    if (keyWord) params['keyWord'] = keyWord;
    if (payload.hasOwnProperty('keyWord')) params['keyWord'] = payload.keyWord;
    let types = window.location.hostname === 'crm.axzq.com.cn' ? '241' : window.location.hostname === 'crm.essence.com.cn' ? '292' : '241' ;
    setEcifEventType(types);
    if(params.type === 1){
      return QueryBackLogList(params).then((response) => { 
        if (!flag) setLoading(false);
        const listData = response.records || [];
        if (listData.length) {
          const obj = listData[0];
          if (obj.typeId === '1' && obj.id === types) {
            setEventType('ecifEvent');
          }else{
            setEventType('otherEvent');
          }
        }
        setTotal(response.total);
        return response; }).catch((error) => { message.error(error.success ? error.note : error.message); });
    }else{
      return QueryBackLogList(params).then((response) => { 
        if (!flag) setLoading(false);
        const listData = response.records || [];
        if (listData.length) {
          const obj = listData[0];
          if (obj.typeId === '1' && obj.id === types) {
            setEventType('ecifEvent');
          }else{
            setEventType('otherEvent');
          }
        }
        setTotal(response.total);
        return response; }).catch((error) => { message.error(error.success ? error.note : error.message); });
    }
  };

  const queryCalContent = () => {
    QueryCalContent({ month: '0' , isPC: '241' }).then((response) => {
      const { records = [] } = response;
      setSignDate(records);
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  };

  // 渲染tab栏
  const renderTab = (tabName, tabKey) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', position: 'relative' }}>
        <div>{tabName}</div>
        <div style={{ visibility: tabKey === activeKey ? 'visible' : 'hidden' }} className={styles.tabsInkBar}></div>
      </div>
    );
  };

  const onChange = (refreshFunc) => {
    refresh.current = refreshFunc;
  }; // 刷新右侧数据方法

  return (
    <div onClick={handleClick}>
      <Card
        className="ax-card"
        bodyStyle={{ padding: '0', minHeight: `calc(${document.body.clientHeight}px - 4rem)` }}
      >
        <Tabs
          className={styles.tabs}
          activeKey={activeKey}
          onChange={setActiveKey}
          tabBarGutter={0}
          tabBarExtraContent={activeKey === 'backlog' ? (
            <TabBarExtraContent
              calendar={calendar}
              setCalendar={setCalendar}
              onChange={(bool) => { setSearchFormSetVisible(bool); }}
              queryBackLogList={queryBackLogList}
              setListData={setListData}
              setActiveList={setActiveList}
              setPageSize={setPageSize}
              keyWord={keyWord}
              setKeyWord={setKeyWord}
              setCustRank={setCustRank}
            />
          ) : ''}
        >
          <Tabs.TabPane key='backlog' tab={renderTab('待办', 'backlog')}>
            <SearchForm
              calendar={calendar}
              setCalendar={setCalendar}
              time={time}
              setTime={setTime}
              searchFormSetVisible={searchFormSetVisible}
              setSearchFormSetVisible={setSearchFormSetVisible}
              type={type}
              setType={setType}
              custRank={custRank}
              setCustRank={setCustRank}
              sort={sort}
              setSort={setSort}
              queryBackLogList={queryBackLogList}
              listData={listData}
              setListData={setListData}
              activeList={activeList}
              setActiveList={setActiveList}
              setPageSize={setPageSize}
              queryCalContent={queryCalContent}
              signDate={signDate}
              refresh={refresh.current}
              current={current}
              setCurrent={setCurrent}
              eventType={eventType}
              setEventType={setEventType}
              ecifEventType={ecifEventType}
            />
            <DataList
              activeList={activeList}
              setActiveList={setActiveList}
              type={type}
              setType={setType}
              custRank={custRank}
              setCustRank={setCustRank}
              sort={sort}
              setSort={setSort}
              loading={loading}
              setLoading={setLoading}
              listData={listData}
              setListData={setListData}
              pageSize={pageSize}
              setPageSize={setPageSize}
              queryBackLogList={queryBackLogList}
              queryCalContent={queryCalContent}
              onChange={onChange}
              calendar={calendar}
              time={time}
              keyWord={keyWord}
              setKeyWord={setKeyWord}
              current={current}
              setCurrent={setCurrent}
              eventType={eventType}
              setEventType={setEventType}
              total={total}
              state={state}
              func={func}
              ecifEventType={ecifEventType}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key='message' tab={renderTab('消息', 'message')}>
            <Iframe className={styles.iframe} src={getIframeSrc(props.tokenAESEncode, `${props?.sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || ''}/plug-in/workplatform/ncrm.jsp?title=%E6%B6%88%E6%81%AF&url=%2Fbss%2Fncrm%2Fwork%2FworkTop%2Fpage%2FmessageIndex.sdo`, props?.sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '')} width='100%' height={(window.screen.availHeight - 300) + 'px'} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export default connect(({ global }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  tokenAESEncode: global.tokenAESEncode,
}))(Work);
