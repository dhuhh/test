import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Button, Card, Col, ConfigProvider, DatePicker, Icon, message, Modal, Progress, Row, Spin,Tooltip , Table , Pagination , Switch } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import { connect } from "dva";
import XLSX from 'xlsx';
import { usePrevious, viewSensors, clickSensors } from './util';
import { formatColor } from '../Earning/util';
import questionMark from '$assets/newProduct/customerPortrait/question-mark.png';
import { formatThousands } from '../Earning/util';
import StaticData from './StaticData';
import StaticChart from './StaticChart';
import PositionTable from './PositionTable';
import { Jyhgupdateday, FindPostion, FindPositionSummary, FindAvailableAccount } from '$services/newProduct/customerPortrait';
import { GetProfitDate , JoinQuant , GetRecommendCapital } from '$services/customerPanorama';
import { HisstockslistService as Hisstockslist, HisfundslistService as Hisfundslist } from './services';
import config from '$utils/config';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
//import emptyImg from '$assets/newProduct/customerPortrait/缺省图.png';
import emptyImg from '$assets/newProduct/customerPortrait/defaultGraph.png';
import date_icon from '$assets/newProduct/earing/date_icon@2x.png';
import styles from './index.less';

const { api } = config;
const {
  newProduct: {
    findPostionExport,
  } } = api;

const computedPositionDate = async (positionDate) => {
  let defaultDate = moment();
  if (positionDate.format('d') === '0') {
    defaultDate = positionDate.clone().subtract(2, 'days');
  } else if (positionDate.format('d') === '1') {
    defaultDate = positionDate.clone().subtract(3, 'days');
  } else {
    defaultDate = positionDate.clone().subtract(1, 'days');
  }
  defaultDate = defaultDate.format('YYYYMMDD');
  const res = await GetProfitDate().catch(() => ({}));
  const date = lodash.get(res, 'records.date', '') || lodash.get(res, 'record.date', defaultDate);
  return moment(date);
};

const filterDataSource = (dataSource = [], merge = false) => {
  let filterResult = [];
  if (merge) {
    dataSource.forEach(item => {
      if (item.opens) {
        let opens = [];
        item.opens.forEach(subItem => {
          if (subItem.is_hold !== 1) {
            opens.push(subItem);
          }
        });
        item.opens = opens;
        if (opens.length) {
          filterResult.push(item);
        }
      }
    });
  } else {
    dataSource.forEach(item => {
      if (item.is_hold !== 1) {
        filterResult.push(item);
      }
    });
  }
  return filterResult;
};

const Position = (props)=> {
  const [activeAccount, setActiveAccount] = useState('2'); // 账户类型
  const [dateType, setDateType] = useState('1'); // 时间类型
  const [date, setDate] = useState([undefined, undefined]); // 时间周期
  const [merge, setMerge] = useState(false); // 是否合并 股票|基金
  const [isUnfolded, setIsUnfolded] = useState(false); // 功能说明展开状态
  const [homeData, setHomeData] = useState({}); // 接口获取的页面数据
  const [current, setCurrent] = useState(1); // 分页器
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]); // 从接口获取的表格数据
  const [latestDate, setLatestDate] = useState(moment().format('YYYY-MM-DD')); // 最新日期
  const [accounts, setAccounts] = useState([]);
  let [timers, setTimers] = useState(undefined);
  let [eventSources, setEventSources] = useState(undefined);
  const ifile = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [percent, setPercent] = useState('0');
  const [loading, setLoading] = useState(false);
  const [activePositionType, setActivePositionType] = useState('1'); // 持仓类型
  const [positionDate, setPositionDate] = useState(moment());
  const [alphaTVisible , setAlphaTVisible] = useState(false);
  const [halfVisible , setHalfVisible] = useState(false); // 近半年收益tiptool
  const [comVisible , setComVisible] = useState(false); // 组合年化收益tiptool
  const [firVisible , setFirVisible] = useState(false); // 实盘所需现金收益tiptool
  const [switchKey , setSwitchKey] = useState(false);

  const tableRef = useRef(null);
  const chartRef = useRef(null);

  const prevDate = usePrevious(date);
  const prevActiveAccount = usePrevious(activeAccount);
  const prevMerge = usePrevious(merge);
  const prevCurrent = usePrevious(current);
  const prevPageSize = usePrevious(pageSize);
  const [alphatDateList , setAlphatDateList] = useState([]); // 持仓回测列表
  const [ securityAvgGainsRate , setSecurityAvgGainsRate ] = useState('');
  const [ securitySumGainsRate , setSecuritySumGainsRate ] = useState('');

  const [alphatDateListOld , setAlphatDateListOld] = useState([]); // 持仓回测列表
  const [ securityAvgGainsRateOld , setSecurityAvgGainsRateOld ] = useState('');
  const [ securitySumGainsRateOld , setSecuritySumGainsRateOld ] = useState('');
  const [alphatLoading , setAlphatLoading] = useState(false);
  const [oldShow , setOldShow] = useState(false);
  const [capitalLimit , setCapitalLimit] = useState('');
  const [capitalLimitOld , setCapitalLimitOld] = useState('');
  const [supportFlag , setSupportFlag] = useState(false);
  const [supportList , setSupportList] = useState([]);
  const [joinDate ,setJoinDate] = useState({});


  const { customerCode = '' } = props; // 客户号

  useLayoutEffect(() => {
    viewSensors();
    computedPositionDate(moment()).then(result => setPositionDate(result));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      // 清空定时器,避免内存泄漏
      if (timers && timers.length > 0) {
        timers.forEach((timer) => {
          clearTimeout(timer);
        });
        setTimers(null);
      }
      // 关闭EventSource,避免内存泄漏
      if (eventSources && eventSources.length > 0) {
        eventSources.forEach((eventSource) => {
          if (eventSource && eventSource.close) {
            eventSource.close();
          }
        });
        setEventSources(null);
      }
    };
  }, [eventSources, timers]);

  useEffect(() => {
    Jyhgupdateday().then(res => {
      const { records = moment().format('YYYY-MM-DD') } = res;
      setLatestDate(records);
    }).catch(err => GetProfitDate().then(res=>{
      const { record } = res;
      setLatestDate(moment(record.date).format('YYYY-MM-DD'));
    }));
    FindAvailableAccount({ loginAccount: customerCode }).then(res => {
      const { records = [] } = res;
      let result = records.length ? [{ ibm: '1', note: '全部' }] : [];
      const map = {
        普通: '2',
        信用: '3',
        理财: '4',
        基金投顾: '5',
        期权: '6',
      };
      records.forEach(item => {
        const name = item.Name.indexOf('账户') > -1 ? item.Name.replace(/账户/g, '') : item.Name;
        result.push({ ibm: map[name], note: name });
      });
      setAccounts(result);
    }).catch(err => message.error(err.note || err.message));
  }, [customerCode]);

  useEffect(() => {
    tableRef.current?.reset();
  }, [date, activeAccount, dateType, merge, activePositionType, positionDate]);

  // 生成uuid
  const guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  };
  // useLayoutEffect(() => {
  //   getJoinDate();
  // }, [
  //   activeAccount,
  //   customerCode,
  //   dateType,
  //   positionDate,
  // ]);

  const getJoinDate = () =>{
    if (dateType === "1" && activeAccount === "2") {
      const accountTypeMap = {
        1: "0",
        2: "1",
        3: "2",
        4: "3",
        5: "5", // 基金投顾
        6: "4",
      };
      const aphlatParam = {
        accountType: accountTypeMap[activeAccount],
        customerNo: customerCode,
        timeRange: "3",
        allFlag: 1,
        date: positionDate.format("YYYYMMDD"),
      };
      JoinQuant(aphlatParam).then(res => {
        setJoinDate(res.data || []);
      });
    }

  };

  // 查询数据
  const fetchData = useCallback((payload = {}) => {

    if (prevCurrent === current && prevPageSize === pageSize ) {
      setCurrent(1);
    }
    setLoading(true);
    if (dateType === '1') {
      // 最新持仓
      const accountTypeMap = {
        1: '0',
        2: '1',
        3: '2',
        4: '3',
        5: '5', // 基金投顾
        6: '4',
      };
      const params = {
        loginAccount: customerCode,
        accountType: accountTypeMap[activeAccount],
        productCode: prevActiveAccount === activeAccount && prevDate === date && prevMerge === merge ? (tableRef.current?.selectRowKeys || []).join(',') : '',
        paging: 1,
        current: Object.keys(payload).length > 0 ? 1 : current,
        pageSize,
        beginDate: positionDate.format('YYYYMMDD'),
        sort: '1',
        ...payload,
      };
      const aphlatParam = {
        accountType: accountTypeMap[activeAccount],
        customerNo: customerCode,
        timeRange: "3",
        allFlag: 1,
        date: positionDate.format('YYYYMMDD') ,
      };
      // 表格接口，图表接口，持仓回测接口 （持仓且是普通账号） JoinQuant(aphlatParam)
      if(activeAccount === '2'){
        return Promise.all([FindPostion(params), FindPositionSummary({ loginAccount: customerCode, accountType: accountTypeMap[activeAccount], beginDate: positionDate.format('YYYYMMDD') }),JoinQuant(aphlatParam)]).then(res => { setLoading(false); return res; });
      }else{
        return Promise.all([FindPostion(params), FindPositionSummary({ loginAccount: customerCode, accountType: accountTypeMap[activeAccount], beginDate: positionDate.format('YYYYMMDD') })]).then(res => { setLoading(false); return res; });
      }

      // 表格接口，图表接口
      // return Promise.all([FindPostion(params), FindPositionSummary({ loginAccount: customerCode, accountType: accountTypeMap[activeAccount], beginDate: positionDate.format('YYYYMMDD') }),getJoinQuant()]).then(res => { setLoading(false); return res; });

    } else {
      // 历史持仓
      const accountTypeMap = {
        2: '0',
        3: '1',
        4: '0',
      };
      const params = {
        loginAccount: customerCode,
        begindate: date[0].format('YYYY-MM-DD'),
        enddate: date[1].format('YYYY-MM-DD'),
        queryType: merge ? '1' : '0',
        accountType: accountTypeMap[activeAccount],
        paging: 1,
        current,
        pageSize,
        filterCodes: prevActiveAccount === activeAccount && prevDate === date && prevMerge === merge ? tableRef.current?.selectRowKeys || [] : [],
        activePositionType,
        ...payload,
      };
      if (moment(params.begindate) > moment(latestDate)) params.begindate = latestDate;
      if (moment(params.enddate) > moment(latestDate)) params.enddate = latestDate;
      if (activeAccount === '4') {
        return Hisfundslist(params).then(res => { setLoading(false); return res; }).catch(error=>{setLoading(false);});
      } else {
        return Hisstockslist(params).then(res => { setLoading(false); return res; }).catch(error=>{setLoading(false);});
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount, current, customerCode, date, dateType, merge, pageSize, positionDate]);

  const changeSwitch = (e) => {
    setSwitchKey(!switchKey);
    if(e){
      getJoinQuant();
    }else{
      setOldShow(false);
    }
  };

  const getJoinQuant = ()=>{

    let codeLists = [];
    let supportList = [];
    alphatDateList.map(item=>{
      if(item.level === 'good' || item.level === 'excellent'){
        codeLists.push(item.jqStockCode);
        let obj = '';
        obj = `${item.jqStockCode},${item.positionNum}`;
        supportList.push(obj);
      }
    });

    if(codeLists.length === 0) {
      message.warning('近期暂无表现优秀、良好的持仓');
      return ;
    }

    const aphlatParam = {
      accountType: '1',
      customerNo: customerCode,
      timeRange: "3",
      allFlag: 0,
      date: positionDate.format('YYYYMMDD'),
      codeListStr: codeLists.join(','),
    };
    setAlphatLoading(true);
    getRecommendCapital(supportList,'old');
    JoinQuant(aphlatParam).then(res=>{
      let { positionList , securityAvgGainsRate , securitySumGainsRate } = res.data ;
      setOldShow(true);
      setAlphatLoading(false);
      setSecurityAvgGainsRateOld(securityAvgGainsRate);
      setSecuritySumGainsRateOld(securitySumGainsRate);
      setAlphatDateListOld(positionList);
    });
  };

  const getRecommendCapital = (list , type)=>{

    if (list.length == 0) return;
    const accountTypeMap = {
      1: '0',
      2: '1',
      3: '2',
      4: '3',
      5: '5', // 基金投顾
      6: '4',
    };
    const CapitalParam = {
      customerNo: customerCode,
      tradeAccount: '',
      accountType: accountTypeMap[activeAccount],
      positions: list.join('/') ,
    };

    GetRecommendCapital(CapitalParam).then(res=>{
      const { capitalLimit , supportFlag } = res.data;
      setSupportFlag(supportFlag);
      if(type === 'old'){
        setCapitalLimitOld(capitalLimit);
      }else{
        setCapitalLimit(capitalLimit);
      }
    }).catch(err =>
      message.error(err.note || err.message)
    );
  };
  // 持仓回测弹窗
  const showAlphaTModal = () => {
    newClickSensors({
      third_module: "持仓",
      ax_button_name: "alphaT持仓回顾点击次数",
    });
    getRecommendCapital(supportList, "new");
    setAlphaTVisible(true);
  };

  useEffect(() => {
    fetchData().then(res => {
      setDataSource([]);
      if (dateType === '1') {
        const [res1, res2 ,res3] = res; // 表格、图表、持仓回测数据
        // 普通账号 -- 持仓回测数据
        if(activeAccount === '2'){
          if (res3.data !== null) {
            let { records } = res1;
            let {
              positionList,
              securityAvgGainsRate = "",
              securitySumGainsRate = "",
            } = res3.data;
            records.map(item => {
              positionList.map(items => {
                if (item.productCode === items.stockCode) {
                  let productList = [];
                  let isSupportAIGrids = "";
                  let isSupportT0s = "";
                  isSupportAIGrids =
                    items.isSupportAIGrid == 1 ? "AI智能网格" : "";
                  isSupportT0s = items.isSupportT0 == 1 ? "AlphaT_T0" : "";
                  let hqgj = item.clgj !== "" ? item.clgj.split(',') : [];
                  productList.push(isSupportAIGrids, isSupportT0s,...hqgj);
                  item.product = productList;
                  return item;
                }
              });
            });

            let newpositionsList = positionList.filter(
              item => item.level !== "notSupport"
            );

            let supportList = [];
            newpositionsList.map(item => {
              let obj = "";
              obj = `${item.jqStockCode},${item.positionNum}`;
              supportList.push(obj);
            });
            setSupportList(supportList);
            setAlphatDateList(newpositionsList);
            setSecurityAvgGainsRate(securityAvgGainsRate);
            setSecuritySumGainsRate(securitySumGainsRate);
            setDataSource(records || []);
            setHomeData(res2.records || []);
            setTotal(res1.total || 0);
          } else {
            setSecurityAvgGainsRate("");
            setSecuritySumGainsRate("");
            setSupportList([]);
            setAlphatDateList([]);
            setDataSource(res1.records || []);
            setHomeData(res2.records || []);
            setTotal(res1.total || 0);
          }

        }else{
          setDataSource(res1.records || []);
          setHomeData(res2.records || []);
          setTotal(res1.total || 0);
        }
      } else {
        if (activeAccount === '4') {
          let { records = {}, records: { funds = [] }, total = 0 } = res;
          if (activePositionType === '3') {
            funds = filterDataSource(funds, merge);
          }
          setHomeData(records); setDataSource(funds); setTotal(total);
        } else {
          let { records = {}, records: { stocks = [] }, total = 0 } = res;
          if (activePositionType === '3') {
            stocks = filterDataSource(stocks, merge);
          }
          setHomeData(records); setDataSource(stocks); setTotal(total);
        }
      }
    });
  }, [activeAccount, dateType, activePositionType, fetchData, merge]);

  // 点击账户类别
  const handleAccountClick = (activeAccount) => {
    const m = {
      '1': "全部账户点击次数",
      '2': "普通账户点击次数",
      '3': "信用账户点击次数",
      '4': "理财账户点击次数",
      '5': "基金投顾点击次数",
      '6': "期权账户点击次数",
    };
    let name = m[activeAccount] ;
    newClickSensors({
      third_module: "持仓",
      ax_button_name: name,
    });

    if ((activeAccount === '1' || activeAccount === '6' || activeAccount === '5') && dateType !== '1') {
      setDateType('1');
      setDate([undefined, undefined]);
      setActivePositionType('1');
    }
    setActiveAccount(activeAccount);
  };


  // 重置
  const reset = () => {
    setActiveAccount('1'); setDateType('1'); setDate([undefined, undefined]);
  };

  const setModalFalse = () =>{
    if(halfVisible){
      setHalfVisible(false);
    }
    if(comVisible){
      setComVisible(false);
    }
    if(firVisible){
      setFirVisible(false);
    }
  };

  const halfShowTooltip = () =>{
    return (
      <div>
        以客户持仓股票与AlphaT标的交集为组合，回测组合最近三个月的累计收益率（计算方式：近三个月通过AlphaT-T0策略交易该组合的扣税费后累计收益/（成交金额/2）*100）
      </div>
    );
  };
  const comShowTooltip = () =>{
    return (
      <div>
        以客户持仓股票与AlphaT标的交集为组合，回测组合的年化收益情况（计算方式：通过AlphaT-T0策略交易该组合的近三个月日均收益率*本年交易天数）
      </div>
    );
  };
  const firShowTooltip = () =>{
    return (
      <div>
        以客户持仓股票与AlphaT标的交集为组合，组合如果要进行T0实盘，需要的最小资金下限。
      </div>
    );
  };


  // 点击时间周期
  const handleDateTypeClick = (dateType) => {
    clickSensors(dateType === '1' ? '最新持仓' : dateType === '2' ? '近一月清仓/持仓' : dateType === '3' ? '近一年清仓/持仓' : '今年以来清仓/持仓');
    let date = [undefined, undefined];
    if (dateType === '4') {
      date = [moment(latestDate).startOf('year'), moment(latestDate)];
    } else if (dateType === '3') {
      date = [moment(latestDate).subtract(1, 'years'), moment(latestDate)];
    } else if (dateType === '2') {
      date = [moment(latestDate).subtract(30, 'days'), moment(latestDate)];
    }
    if (dateType !== '1' && (activeAccount === '1' || activeAccount === '5' || activeAccount === '6')) {
      setActiveAccount('2');
    }
    setDate(date); setDateType(dateType);
  };

  // rangePicker 改变
  const handleDateChange = (date) => {
    // 自动更新超过一年的时间区间
    if (date && date[0] && date[1]) {
      const yearDiff = date[1].diff(date[0], 'years', true);
      if (yearDiff > 1) {
        const newDate1 = date[0].clone().add(1, 'years');
        date = [date[0], newDate1];
        message.warning('查询时间不能超过一年，已为你自动更新时间');
      }
    }

    setDate(date); setDateType('5');
    if (activeAccount === '1' || activeAccount === '6' || activeAccount === '5') {
      if (!prevDate[0] && !prevDate[1]) setActiveAccount('2');
    }
  };

  // 合并股票|基金
  const handleMergeClick = () => {
    setMerge(!merge);
  };

  const computed = (type, ...rest) => {
    if (type === 'color') {
      const [val = ''] = rest;
      return formatColor(val);
    }
  };

  // 导出
  const exportTable = () => {
    newClickSensors({
      third_module: "持仓",
      ax_button_name: "持仓导出点击次数",
    });
    if (dateType === '1') {
      // 最新持仓
      const exportPercentUtl = '/api/customerAggs/v2/exportPercent'; // 点击导出后系统处理进度信息
      const action = findPostionExport;
      const uuid = guid(); // 获取唯一识别码
      Modal.confirm({
        title: '提示：',
        content: `是否导出全部数据？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const accountTypeMap = {
            1: '0',
            2: '1',
            3: '2',
            4: '3',
            5: '5', // 基金投顾
            6: '4',
          };
          const typeInfo = [];
          accounts.forEach(item => {
            let columns = tableRef.current.getColumns(item.ibm, '1');
            let newColumns = columns.filter(item=>item.title !== '近期适用产品');
            let tableHeaderCodes = newColumns.map(item => item.dataIndex).join(',');
            let headerInfo = newColumns.map(item => typeof item.title === 'string' ? item.title : item.key).join(',');
            typeInfo.push({
              tableHeaderCodes,
              headerInfo,
              type: accountTypeMap[item.ibm],
              typeName: item.note,
            });
          });
          let request = {
            current: 1,
            loginAccount: customerCode,
            accountType: accountTypeMap[activeAccount],
            productCode: prevActiveAccount === activeAccount && prevDate === date && prevMerge === merge ? (tableRef.current?.selectRowKeys || []).join(',') : '',
            beginDate: positionDate.format('YYYYMMDD'),
          };
          const exportPayload = JSON.stringify({
            typeInfo,
            request,
          });
          const form1 = document.createElement('form');
          form1.id = 'form1';
          form1.name = 'form1';
          // 添加到 body 中
          document.getElementById('m_iframe').appendChild(form1);
          // 创建一个输入
          const input = document.createElement('input');
          // 设置相应参数
          input.type = 'text';
          input.name = 'exportPayload';
          input.value = exportPayload;

          // 将该输入框插入到 form 中
          form1.appendChild(input);

          // form 的提交方式
          form1.method = 'POST';
          // form 提交路径
          form1.action = action;

          // 对该 form 执行提交
          form1.submit();
          // 删除该 form
          document.getElementById('m_iframe').removeChild(form1);

          if (total >= 10000000 && typeof EventSource !== 'undefined') {
            // if (typeof EventSource !== 'undefined') {
            if (!timers) {
              timers = [];
            }
            // 浏览器支持 Server-Sent
            const timer1 = setTimeout(() => {
              setModalVisible(true); setPercent('0');
              const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
              let eventSourcesIndex = 0;
              // 成功与服务器发生连接时触发
              source.onopen = () => {
                if (!eventSources) {
                  eventSources = [];
                }
                eventSourcesIndex = eventSources.length;
                eventSources.push(source);
              };
              source.onmessage = (event) => {
                const { data: percent = 0 } = event;
                if (percent === '100') {
                  source.close();
                  if (eventSources && eventSources.length > 0) eventSources.splice(eventSourcesIndex, 1);
                  const timer2 = setTimeout(() => {
                    setModalVisible(false); setPercent(0);
                    if (timers && timers.length > 0) {
                      const index = timers.findIndex(timer => timer === timer2);
                      if (index >= 0) {
                        timers.splice(index, 1);
                      }
                    }
                  }, 1000);
                  timers.push(timer2);
                }
                setPercent(percent);
              };
              source.onerror = () => {
                source.close();
                if (eventSources && eventSources.length > 0) eventSources.splice(eventSourcesIndex, 1);
                const timer3 = setTimeout(() => {
                  setModalVisible(false); setPercent(0);
                  if (timers && timers.length > 0) {
                    const index = timers.findIndex(timer => timer === timer3);
                    if (index >= 0) {
                      timers.splice(index, 1);
                    }
                  }
                }, 1000);
                timers.push(timer3);
              };
            }, 500);
            timers.push(timer1);
          } else {
            // 浏览器不支持 Server-Sent..
          }
        },
      });
    } else {
      // 历史持仓
      fetchData({ paging: 0 }).then((res) => {
        let dataSource = [];
        if (activeAccount === '4') {
          const { records: { funds = [] } } = res;
          dataSource = funds;
        } else {
          const { records: { stocks = [] } } = res;
          dataSource = stocks;
        }
        Modal.confirm({
          title: '提示：',
          content: `是否导出数据（共${total}条）？`,
          onOk() {
            let table = [];
            let tableHeader = {};
            let arr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
            let columns = [{
              title: `${activeAccount === '4' ? '基金' : '股票'}名称`,
              dataIndex: 'prd_name',
            }, {
              title: `${activeAccount === '4' ? '基金' : '股票'}代码`,
              dataIndex: 'secu_code',
            }, {
              title: '清仓时间',
              dataIndex: 'close_date',
              render: (text, record) => {
                if (merge && record.open_times <= 1) {
                  return lodash.get(record, 'opens[0].is_hold', 0) === 1 ? '持仓中' : lodash.get(record, 'opens[0].close_date', '');
                } else {
                  return record.is_hold === 1 ? '持仓中' : text;
                }
              },
            },{
              title: '持有天数',
              dataIndex: 'holding_days',
              render: (text, record) => {
                if (merge && record.open_times <= 1) {
                  return lodash.get(record, 'opens[0].holding_days', '');
                } else {
                  return text;
                }
              },
            },{
              title: '买入均价',
              dataIndex: 'avg_buy_price',
              render: text => text === -1 ? '--' : formatThousands((Math.round(Number(text) * 1000) / 1000).toFixed(3), 3),
            },{
              title: '卖出均价',
              dataIndex: 'avg_sell_price',
              render: text => text === -1 ? '--' : formatThousands((Math.round(Number(text) * 1000) / 1000).toFixed(3), 3),
            },{
              title: '收益金额',
              dataIndex: 'return',
              render: text => formatThousands(text),
            }, {
              title: '收益率',
              dataIndex: 'mwrr',
              render: (text, record) => {
                if (merge && record.open_times <= 1) {
                  return lodash.get(record, 'opens[0].mwrr', '') ? `${(Math.round(Number(lodash.get(record, 'opens[0].mwrr', '0')) * 10000) / 100).toFixed(2)}%` : '';
                } else {
                  return text ? `${(Math.round(Number(text) * 10000) / 100).toFixed(2)}%` : '';
                }
              },
            }];
            columns.forEach((item, index) => {
              tableHeader[arr[index]] = item.title;
            });
            table.push(tableHeader);
            dataSource.forEach((item1, index1) => {
              let row = {};
              columns.forEach((item2, index2) => {
                if (item2.hasOwnProperty('render')) {
                  row[arr[index2]] = item2.render(item1[item2.dataIndex], item1);
                } else {
                  row[arr[index2]] = item1[item2.dataIndex];
                }
              });
              table.push(row);
            });
            let ws = XLSX.utils.json_to_sheet(table, { header: arr.slice(0, columns.length), skipHeader: true });
            let wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws);
            XLSX.writeFile(wb,`${activeAccount === '2' ? '普通' : activeAccount === '3' ? '信用' : '理财'}账户-${activePositionType === '2' ? '持仓/清仓' : '清仓' }数据-${moment().format('YYYYMMDD')}.xlsx`);
          },
        });
      });
    }
  };

  const handlePositionTypeClick = (item,positionType) => {
    let name = item.note + '点击次数' ;
    newClickSensors({
      third_module: "持仓",
      ax_button_name: name,
    });
    if (positionType === '2') {
      handleDateTypeClick('2');
    };
    if (positionType === '3') {
      setDate([moment(latestDate).subtract(30, 'days'), moment(latestDate)]); setDateType('5');
    }
    if (positionType === '1') {
      handleDateTypeClick('1');
    }
    setActivePositionType(positionType);
  };

  const handlePositionDateChange = (date) => {
    setPositionDate(date);
  };
  const alphatColumms = ()=>{
    return [
      {
        title: '股票代码',
        dataIndex: 'jqStockCode',
      },
      {
        title: '股票名称',
        dataIndex: 'name',
      },
      {
        title: '股数',
        dataIndex: 'positionNum',
      },
      {
        title: '回测结果',
        dataIndex: 'level',
        render: text => <div style={{ color: '#244FFF' }}>{changeText(text)}</div>,
      },
    ];
  };

  const changeText = (e) =>{
    switch (e) {
      case 'normal':
        return <div style={{ color: '#4B516A' }}>一般</div>;
        break;
      case 'medium':
        return <div style={{ color: '#4B516A' }}>中等</div>;
        break;
      case 'good':
        return <div style={{ color: '#FFA257' }}>良好</div>;
        break;
      case 'excellent':
        return <div style={{ color: '#EC3A48' }}>优秀</div>;
        break;
      case 'notSupport':
        return <div style={{ color: '#4B516A' }}>不支持</div>;
        break;
      default:
        return <div style={{ color: '#4B516A' }}>{e}</div>;
        break;
    }
  };

  const dateTypes = [{ ibm: '2', note: '近一月' },{ ibm: '3', note: '近一年' },{ ibm: '4', note: '今年以来' }];
  const positionTypes = [{ ibm: '1', note: '持仓' }, { ibm: '2', note: '持仓/清仓' }, { ibm: '3', note: '清仓' }];
  return (
    <div
      style={{ fontSize: 14, color: "#1A2243" }}
      onClick={() => {
        setModalFalse();
      }}
    >
      <Spin spinning={loading} className={styles.topSpin}>
        <div style={{ padding: "24px 0 0 24px", background: "#FFF" }}>
          <Row type="flex" align="middle">
            <Col style={{ fontSize: 16 }}>账户类型：</Col>
            <Col style={{ display: "flex", width: 570, height: 32 }}>
              {accounts.map((item, index) => {
                // return <Button key={index} onClick={() => handleAccountClick(item.ibm)} className={`${styles.button} ${activeAccount === item.ibm ? styles.activeButton : ''} ${(item.ibm === '1' || item.ibm === '6' || item.ibm === '5') && dateType !== '1' ? styles.disabledButton : ''}`} style={{ height: 30, padding: '0 6px', marginRight: 8 }}>{item.note}</Button>;
                return (
                  <Button
                    key={index}
                    onClick={() => handleAccountClick(item.ibm)}
                    className={`${styles.button} ${
                      activeAccount === item.ibm ? styles.activeButton : ""
                    }`}
                    style={{ height: 30, padding: "0 6px", marginRight: 8 }}
                  >
                    {item.note}
                  </Button>
                );
              })}
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{ margin: "16px 0" }}>
            <Col style={{ fontSize: 16 }}>持仓类型：</Col>
            <Col>
              {positionTypes.map((item, index) => {
                return (
                  <Button
                    key={index}
                    onClick={() =>
                      (activeAccount === "1" ||
                        activeAccount === "5" ||
                        activeAccount === "6") &&
                      item.ibm !== "1"
                        ? ""
                        : handlePositionTypeClick(item, item.ibm)
                    }
                    className={`${styles.button} ${
                      activePositionType === item.ibm ? styles.activeButton : ""
                    } ${
                      (activeAccount === "1" ||
                        activeAccount === "5" ||
                        activeAccount === "6") &&
                      item.ibm !== "1"
                        ? styles.disabledButton
                        : ""
                    }`}
                    style={{ height: 30, padding: "0 6px", marginRight: 8 }}
                  >
                    {item.note}
                  </Button>
                );
              })}
            </Col>
          </Row>
          <Row type="flex" align="middle" style={{ position: "relative" }}>
            <Col style={{ fontSize: 16 }}>持仓时间：</Col>
            {activePositionType === "1" ? (
              <DatePicker
                className={styles.datePickerInput}
                value={positionDate}
                onChange={handlePositionDateChange}
                allowClear={false}
              />
            ) : activePositionType === "2" ? (
              dateTypes.map((item, index) => {
                return (
                  <Button
                    key={index}
                    onClick={() =>
                      (activeAccount === "1" ||
                        activeAccount === "5" ||
                        activeAccount === "6") &&
                      item.ibm !== "1"
                        ? ""
                        : handleDateTypeClick(item.ibm)
                    }
                    className={`${styles.button} ${
                      dateType === item.ibm ? styles.activeButton : ""
                    } ${
                      (activeAccount === "1" ||
                        activeAccount === "5" ||
                        activeAccount === "6") &&
                      item.ibm !== "1"
                        ? styles.disabledButton
                        : ""
                    }`}
                    style={{ height: 30, padding: "0 6px", marginRight: 8 }}
                  >
                    {item.note}
                  </Button>
                );
              })
            ) : (
              <Col
                style={{ margin: "0 24px 0 0" }}
                className={styles.rangePickerCol}
              >
                <DatePicker.RangePicker
                  disabled={
                    activeAccount === "1" ||
                    activeAccount === "5" ||
                    activeAccount === "6"
                  }
                  value={date}
                  className={styles.rangePicker}
                  dropdownClassName="m-bss-range-picker"
                  style={{ width: "264px" }}
                  placeholder={["开始日期", "结束日期"]}
                  format="YYYY-MM-DD"
                  separator="至"
                  disabledDate={current =>
                    current && current > moment(latestDate).endOf("day")
                  }
                  onChange={handleDateChange}
                  allowClear={false}
                  suffixIcon={<img src={date_icon} alt="" />}
                />
              </Col>
            )}

            {/* <Col>
            <Button style={{ width: 60, height: 30 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
            <Button style={{ width: 60, height: 30 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={() => fetchData()}>查询</Button>
          </Col> */}
            {dateType === "1" && (
              <Col style={{ position: "absolute", right: 24, fontSize: 12 }}>
                <span style={{ color: "red" }}>*</span>
                <span style={{ color: "#4D536B" }}>提示：数据T+1日更新</span>
              </Col>
            )}
          </Row>
          {dateType !== "1" ? (
            <Row style={{ padding: "12px 0 6px", fontSize: 12 }}>
              <Row
                className={styles.hover}
                style={{ width: "fit-content" }}
                type="flex"
                onClick={() => setIsUnfolded(!isUnfolded)}
              >
                <Col style={{ paddingRight: 4 }}>功能说明</Col>
                <Col>
                  <Icon
                    style={{ fontSize: 10 }}
                    type={isUnfolded ? "up" : "down"}
                  />
                </Col>
              </Row>
              {isUnfolded && (
                <Row
                  style={{
                    lineHeight: "20px",
                    color: "#61698C",
                    padding: "8px 0 10px",
                  }}
                >
                  <div>
                    1.历史持仓分析的产品范围包含：沪深股票、场内ETF基金、可转债、场外基金；(不含港股通、国债逆回购等)
                  </div>
                  <div>2.历史持仓不含期权账户</div>
                  <div>
                    3.时间筛选规则：如果查询的清仓日期范围包含T-1日,则结果包含T-1日持仓和清仓的记录；如果查询的清仓日期范围不包含1日,则结果仅含已清仓的记录；
                  </div>
                  <div>
                    4.清仓的定义：收盘时持仓股票全部卖出定义为“清仓”,收盘前全部再买入在本功能中不算清仓；
                  </div>
                  <div>
                    5.持仓的定义：最近一次建仓,截止至T-1日全部卖出定义为“持仓”
                  </div>
                  <div style={{ marginTop: 6 }}>注意:</div>
                  <div>
                    如果沪深股票建仓时间早于2016年10月,则收益从2016年1月1日起开始计算；
                  </div>
                  <div>
                    如果ETF基金、可转债建仓时间早于2019年5月,则收益从2019年5月1日开始计算；如果场外基金建仓时间早于2019年5月,则收益从2019年5月1日开始计算。
                  </div>
                </Row>
              )}
            </Row>
          ) : (
            <Row style={{ height: 28 }}></Row>
          )}
        </div>
      </Spin>
      <Spin spinning={loading} className={styles.globalClass}>
        {(Array.isArray(homeData) && homeData.length === 0) ||
        dataSource.length === 0 ||
        accounts.length === 0 ? (
            <div
              style={{
                display: "flex",
                background: "#FFF",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: document.body.offsetHeight - 150,
              }}
            >
              <img src={emptyImg} alt="" />
              <div style={{ color: "#61698C" }}>暂无数据</div>
            </div>
          ) : (
            <React.Fragment>
              {dateType === "1" ? (
                <StaticChart
                  activeAccount={activeAccount}
                  dateType={dateType}
                  date={date}
                  homeData={homeData}
                  ref={chartRef}
                />
              ) : (
                <StaticData
                  activeAccount={activeAccount}
                  dateType={dateType}
                  date={date}
                  homeData={homeData}
                />
              )}
              <Card
                className={`ax-card ${styles.card}`}
                bordered={false}
                bodyStyle={{ padding: "0 24px" }}
                title={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#1A2243",
                    }}
                  >
                    <span className="ax-card-title">
                    持仓明细
                      {activeAccount === "4" && (
                        <Tooltip
                          title="统计口径不包含基金投顾持仓数据"
                          placement="bottom"
                          overlayClassName={styles.tooltip}
                        >
                          <img
                            src={questionMark}
                            alt=""
                            style={{ width: 15, marginLeft: 4 }}
                          />
                        </Tooltip>
                      )}
                    </span>
                    {dateType !== "1" && (
                      <div
                        className={styles.hover}
                        style={{ display: "flex", cursor: "pointer" }}
                        onClick={handleMergeClick}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            margin: "0 4px 0 16px",
                            userSelect: "none",
                          }}
                        >
                        合并相同{activeAccount === "4" ? "基金" : "股票"}
                        </span>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {merge ? (
                            <Icon
                              type="check-circle"
                              theme="filled"
                              style={{ fontSize: 15, color: "#244FFF" }}
                            />
                          ) : (
                            <span
                              style={{
                                width: 15,
                                height: 15,
                                border: "1px solid #74819E",
                                borderRadius: "50%",
                              }}
                            ></span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                }
                extra={
                  <div>
                    {/* 持仓类型是持仓且账户类型是普通 */}
                    {activePositionType === "1" && activeAccount === "2" ? (
                      <Button
                        style={{
                          height: 34,
                          border: "none",
                          background: "#F2F3F7 ",
                        }}
                        className="m-btn-radius ax-btn-small"
                        onClick={showAlphaTModal}
                      >
                      AlphaT 持仓回测
                      </Button>
                    ) : (
                      ""
                    )}
                    <Button
                      style={{ height: 34 }}
                      className="m-btn-radius ax-btn-small m-btn-blue"
                      onClick={exportTable}
                    >
                    导出
                    </Button>
                  </div>
                }
              >
                <PositionTable
                  ref={tableRef}
                  activeAccount={activeAccount}
                  activePositionType={activePositionType}
                  dateType={dateType}
                  merge={merge}
                  current={current}
                  setCurrent={setCurrent}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  total={total}
                  setTotal={setTotal}
                  dataSource={dataSource}
                  setDataSource={setDataSource}
                  fetchData={fetchData}
                  customerCode={customerCode}
                  date={date}
                  latestDate={latestDate}
                  positionDate={positionDate}
                  joinDate={joinDate}
                  sysParam={props.sysParam}
                  authorities={props.authorities}
                />
              </Card>
            </React.Fragment>
          )}
      </Spin>
      <iframe
        title="下载"
        id="m_iframe"
        ref={ifile}
        style={{ display: "none" }}
      />
      <Modal
        title="系统处理中,请稍候..."
        centered
        destroyOnClose
        closable={false}
        maskClosable={false}
        visible={modalVisible}
        footer={null}
      >
        <Row>
          <Col span={2}>进度:</Col>
          <Col span={22}>
            <Progress
              percent={parseInt(percent, 10)}
              status={percent === "100" ? "success" : "active"}
            />
          </Col>
        </Row>
      </Modal>
      <Modal
        title={
          <div style={{ display: "flex" }}>
            <div>AlphaT 持仓回测</div>
            <div className={`${styles.alphatActive} ${styles.alphatText}`}>
              <span>仅回测近期表现优秀的持仓</span>
              <Switch
                style={{ marginLeft: 8 }}
                onChange={e => changeSwitch(e)}
                checked={switchKey}
              ></Switch>
            </div>
          </div>
        }
        className={styles.detailModals}
        centered
        destroyOnClose
        maskClosable={false}
        visible={alphaTVisible}
        onCancel={() => {
          setAlphaTVisible(false);
        }}
        width={"70%"}
        footer={null}
      >
        <Card
          className={`ax-card ${styles.aplhaTcard}`}
          bordered={false}
          bodyStyle={{ padding: "0 0" }}
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#1A2243",
              }}
            >
              <span className="ax-card-title">组合回测收益</span>
            </div>
          }
        >
          <div className={styles.alphaBox}>
            <div
              className={styles.alphaBoxItem}
              style={{ width: supportFlag == "1" ? "33%" : "49%" }}
            >
              <div
                className={styles.alphaBoxNum}
                style={{
                  color: computed(
                    "color",
                    oldShow ? securitySumGainsRateOld : securitySumGainsRate
                  ),
                }}
              >
                {oldShow ? securitySumGainsRateOld : securitySumGainsRate}
              </div>
              <div>
                最近三个月累计收益
                <Tooltip
                  visible={halfVisible}
                  placement="bottom"
                  onClick={() => {
                    setHalfVisible(!halfVisible);
                  }}
                  title={halfShowTooltip()}
                >
                  <Icon
                    style={{ marginLeft: 5, color: "rgb(178 181 191)" }}
                    type="question-circle"
                  />
                </Tooltip>
              </div>
            </div>
            <div
              className={styles.alphaBoxItem}
              style={{ width: supportFlag == "1" ? "33%" : "49%" }}
            >
              <div
                className={styles.alphaBoxNum}
                style={{
                  color: computed(
                    "color",
                    oldShow ? securityAvgGainsRateOld : securityAvgGainsRate
                  ),
                }}
              >
                {oldShow ? securityAvgGainsRateOld : securityAvgGainsRate}
              </div>
              <div>
                组合年化收益
                <Tooltip
                  visible={comVisible}
                  placement="bottom"
                  onClick={() => {
                    setComVisible(!comVisible);
                  }}
                  title={comShowTooltip()}
                >
                  <Icon
                    style={{ marginLeft: 5, color: "rgb(178 181 191)" }}
                    type="question-circle"
                  />
                </Tooltip>
              </div>
            </div>
            {supportFlag == "1" && (
              <div className={styles.alphaBoxItem}>
                <div style={{ color: "#1A2243", fontSize: 40 }}>
                  {oldShow ? capitalLimitOld : capitalLimit}W
                </div>
                <div>
                  实盘预计所需现金
                  <Tooltip
                    visible={firVisible}
                    placement="bottom"
                    onClick={() => {
                      setFirVisible(!firVisible);
                    }}
                    title={firShowTooltip()}
                  >
                    <Icon
                      style={{ marginLeft: 5, color: "rgb(178 181 191)" }}
                      type="question-circle"
                    />
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </Card>
        <Card
          className={`ax-card ${styles.aplhaTcard}`}
          bordered={false}
          bodyStyle={{ padding: "0 0" }}
          title={
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#1A2243",
                  paddingTop: "8px",
                }}
              >
                <span className="ax-card-title">单票回测结果</span>
              </div>
              <div className={styles.aplhaTcardTip}>
                回测数据仅供参考，不预示未来表现，不构成对该算法业绩的承诺及保证
              </div>
            </div>
          }
        >
          <Table
            columns={alphatColumms()}
            className={`m-table-customer ${styles.table}`}
            pagination={false}
            scroll={{ y: 350 }}
            dataSource={oldShow ? alphatDateListOld : alphatDateList}
            loading={alphatLoading}
          />
          <div style={{ float: "right", padding: "10px 10px 0 0" }}>
            总共{oldShow ? alphatDateListOld.length : alphatDateList.length}条
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default connect(({ global }) => ({
  sysParam: global.sysParam,
  authorities: global.authorities,
}))(Position);