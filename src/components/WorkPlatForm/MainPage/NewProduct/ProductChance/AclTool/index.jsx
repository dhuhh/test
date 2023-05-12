import React, { useEffect, useState } from "react";
import { Card, Tooltip, InputNumber, message } from "antd";
import EselectCheck from "../Common/EselectCheck";
import ErangePicker from "../Common/ErangePicker";
import { EncryptBase64 } from "../../../../../Common/Encrypt";
import { connect } from "dva";
import { Link } from "dva/router";
import { history as router } from "umi";
import { formatColor, filterFunction,newClickSensors, newViewSensors } from "../util";
import { QueryTag,QueryCustomerGroup,QueryToolInfo ,QueryStockInfo } from '$services/newProduct';
import Iframe from "react-iframe";
import Einput from "../Common/Einput";
import Emodal from "../Common/Emodal";
import EtableCheck from "../Common/EtableCheck";
import TableLocale from "./tableLocale";
import Ebutton32 from "../Common/Ebutton32";
import Epagination from "../Common/Epagination";
import Calimg from "$assets/activityComPage/aclquestion.png";
import RadioSuper from "./RadioSuper";
import ExportBtn from "./ExportBtn";
import styles from "./index.less";
import moment from "moment";
import config from "$utils/config";
const { ftq } = config;
const {
  newProduct: { queryStrategyToolInfoExport },
} = ftq;


const AclTool = (props)=> {
  const [timer, setTimer] = useState("7"); // 信号日期
  const [rjDate, setRjDate] = useState([moment().subtract(1, "weeks"), moment().add(-1,'d')]); // 信号日期 -- 自定义
  const [increase, setIncrease] = useState(""); // 5日累计涨幅
  const [increaseMin, setIncreaseMin] = useState(""); // 5日累记--最低
  const [increaseMax, setIncreaseMax] = useState(""); // 5日累记--最高
  const [leavels, setLeavels] = useState([]); // 客户等级
  const [tagParams, setTagParams] = useState([]); // 客户标签
  const [range, setRange] = useState("1"); // 客户范围
  const [customer, setCustomer] = useState(""); // 客户
  const [aclTool, setAclTool] = useState([]); // 策略工具
  const [aclType, setAclType] = useState([]); // 信号类型
  const [stockValue , setStockValue] = useState([]);// 信号股票
  const [cusRelation, setRelation] = useState("1"); // 客户相关
  const [cusValue, setCusValue] = useState([]); //客户群组
  const [showModal , setshowModal] = useState(false);
  const [sort , setSort] = useState('');

  const [tagDate, setTagDate] = useState([]); // 客户标签--list
  const [cusGroup, setCusGroup] = useState([]); //客户群组--list
  const [stockList , setStockList] = useState([]);//股票信号--list

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total , setTotal] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [src, setSrc] = useState('');

  const [state, setState] = useState({
    range: [
      { id: "1", name: "直属" },
      { id: "2", name: "所辖" },
      { id: "3", name: "所有" },
    ],
    increase: [
      { id: "1", name: "小于0%" },
      { id: "2", name: "大于0%" },
      { id: "3", name: "自定义" },
    ],
    timer: [
      { id: "7", name: "近一周" },
      { id: "30", name: "近一月" },
      { id: "999", name: "自定义" },
    ],
    aclTool: [
      { id: "sqjz", name: "神奇九转" },
      { id: "dkbd", name: "DK波段" },
      { id: "zxzj", name: "中线追击" },
      { id: "aing", name: "AI牛股" },
      { id: "dxns", name: "低吸能手" },
    ],
    aclType: [
      { id: "0", name: "买入" },
      { id: "1", name: "卖出" },
    ],
    leavels: [
      { name: "V1", id: "1", key: "V1" },
      { name: "V2", id: "2", key: "V2" },
      { name: "V3", id: "3", key: "V3" },
      { name: "V4", id: "4", key: "V4" },
      { name: "V5", id: "5", key: "V5" },
      { name: "V6", id: "6", key: "V6" },
      { name: "V7", id: "7", key: "V7" },
    ],
    cusRelation: [
      { id: "1", name: "有客户持仓" },
      // { id: "2", name: "有客户自选" },
      // { id: "3", name: "有客户持仓或自选" },
      { id: "0", name: "不限制" },
    ],
  });

  const incTitle = "（信号发出后T+5日收盘价）/（信号发出当天T日收盘价），不足5日按实际入选天数计算";

  const finaTitle = "最终累计涨幅的统计时长:神奇九转/DK波段/AI牛股:5日;中线追击:20日;低吸能手:10日";
  const relaTitle = "该部分数据为T-1日持仓中有该个股的客户号数";

  const hlandAction = record => {
    const { sysParam } = props;
    const serverName = sysParam.find(i => i.csmc === "system.c4ym.url")?.csz.replace('8081', '8084') || "";
    console.log('服务地址',serverName);
    let name = `${serverName}/hqgjs/hqgj?code=${record.stockCode}&stockName=${record.stockName}&isCRM=1`;
    console.log("地址", name);
    setSrc(name);
    newViewSensors({
      ax_page_name: "个股决策信号列表",
    }); 
    // https://crm.axzq.com.cn:8084/hqgj/hqgj?code=600061&stockName=国投资本&isCRM=1
    setshowModal(true);
  };

  const columns = [
    {
      title: "序号",
      dataIndex: "xh",
      key: "序号",
      width: 70,
      align: "center",
    },
    {
      title: "信号日期",
      dataIndex: "tradeDate",
      key: "信号日期",
      sorter: true,
      width: 110,
    },
    {
      title: "股票名称",
      dataIndex: "stockName",
      key: "股票名称",
      width: 110,
    },
    {
      title: "股票代码",
      dataIndex: "stockCode",
      key: "股票代码",
      width: 110,
    },
    {
      title: "工具名称",
      dataIndex: "productName",
      key: "工具名称",
      width: 240,
    },
    {
      title: "信号类型",
      dataIndex: "signal",
      key: "信号类型",
      width: 170,
    },
    {
      title: (
        <div className={styles.titletip}>
          <div>
            入选后5日
            <br />
            累计涨幅
          </div>
          <Tooltip
            title={incTitle}
            getPopupContainer={() => document.getElementById("acltip")}
          >
            <img
              src={Calimg}
              alt=""
              style={{ width: 16, height: 16, marginLeft: 5 }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "fiveDaysIncrease",
      key: "入选后5日累计涨幅",
      sorter: true,
      width: 170,
      render: text => (
        <div style={{ color: computed("color", text) }}>{text}</div>
      ),
    },
    {
      title: (
        <div className={styles.titletip}>
          <div>最终累计涨幅</div>
          <Tooltip
            title={finaTitle}
            getPopupContainer={() => document.getElementById("acltip")}
          >
            <img
              src={Calimg}
              alt=""
              style={{ width: 16, height: 16, marginLeft: 5 }}
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "finalIncrease",
      key: "最终累计涨幅",
      sorter: true,
      width: 170,
      render: text => (
        <div style={{ color: computed("color", text) }}>{text}</div>
      ),
    },
    {
      title: "持仓客户数",
      dataIndex: "positionNum",
      key: "持仓客户数",
      sorter: true,
      render: (text, record) => {
        return text !== "0" ? (
          <div
            onClick={() => goDetail(record)}
            style={{ color: "#244fff", cursor: "pointer" }}
          >
            {text}
          </div>
        ) : (
          text
        );
      },
      width: 130,
    },
    // {
    //   title: "自选客户数",
    //   dataIndex: "optionalNum",
    //   key: "自选客户数",
    //   render: (text, record) => {
    //     return text !== "0" ? (
    //       <div
    //         onClick={() => goDetail(record)}
    //         style={{ color: "#244fff", cursor: "pointer" }}
    //       >
    //         {text}
    //       </div>
    //     ) : (
    //       text
    //     );
    //   },
    // },
    {
      title: "操作",
      dataIndex: "action",
      key: "操作",
      width: 130,
      render: (_, record) => (
        <div
          style={{ color: "#244fff", cursor: "pointer" }}
          onClick={() => hlandAction(record)}
        >
          更多近期信号
        </div>
      ),
    },
  ];

  const computed = (type, ...rest) => {
    if (type === "color") {
      const [val = ""] = rest;
      return formatColor(val);
    }
  };

  const goDetail = record => {
    newViewSensors({
      ax_page_name: "持仓客户",
    }); 
    getParams(record);
    router.replace({
      pathname: `/newProduct/optionDetail`,
      change: Date.now().toString(36),
    });


  };

  //跳转到下钻的参数
  const getParams = (record) => {
    let queryParams = {};
    if (record) {
      queryParams = {
        activityTagListList: tagParams
          .filter(item => item.split("/")[1] === "1")
          .map(item => item.split("/")[0])
          .join(","), // 活动标签,
        companyTagListList: tagParams
          .filter(item => item.split("/")[1] === "2")
          .map(item => item.split("/")[0])
          .join(","), // 公司标签,
        staffTagListList: tagParams
          .filter(item => item.split("/")[1] === "3")
          .map(item => item.split("/")[0])
          .join(","), // 客户标签,
        custCode: customer, // 客户号
        custGroup: cusValue.join(","), // 客户群
        // custLevel: leavels.join(","), // 客户等级
        custLevel: leavels !== [] ? leavels.map(item=>item = `V${item}`).join(",") : leavels.join(","), // 客户等级
        custRange: range, // 客户范围
        sort: sort,
        stockCode: record.stockCode,
        stockName: record.stockName,
        productName: record.productName,
        signal: record.signal,
        tradeDate: record.tradeDate,
      };
      const paramsStr = JSON.stringify(queryParams);
      // 将参数base64加密
      queryParams = EncryptBase64(paramsStr);
      sessionStorage.setItem("acltools", queryParams);
    }
    return queryParams;
  };

  useEffect(() => {
    queryTag();
    queryCustomerGroup();
  }, []);

  const queryTag = () => {
    QueryTag().then(res => {
      let data = res.records[0];
      let tagsData = [];
      Object.keys(data).forEach(item => {
        if (item === "activityTag") {
          let arr = data[item].map(item1 => {
            return { ...item1, type: 1 };
          });
          tagsData = [...tagsData, ...arr];
        } else if (item === "companyTag") {
          let arr = data[item].map(item1 => {
            return { ...item1, type: 2 };
          });
          tagsData = [...tagsData, ...arr];
        } else if (item === "staffTag") {
          let arr = data[item].map(item1 => {
            return { ...item1, type: 3 };
          });
          tagsData = [...tagsData, ...arr];
        }
      });
      setTagDate(tagsData);
    });
  };

  const queryCustomerGroup = keyword => {
    QueryCustomerGroup({
      pageNo: 1,
      pageSize: 100,
      keyword,
    }).then(res => {
      setCusGroup(res.records);
    });
  };
  const deQueryDictionary = (e) =>{
    queryDictionary(e);
  };

  const queryDictionary = keyword => {
    let params = {
      keyword,
      pageCount: 500,
      pageNumber: 1,
    };
    QueryStockInfo(params).then(res => {
      const { records = [] } = res;
      records.map(item => {
        item.id = item.stockCode;
        item.name = item.stockName;
      });
      let aa = filterFunction(records, "id");
      setStockList(aa);
    });
  };



  useEffect(() => {
    queryToolInfo();
  }, [current, pageSize, sort]);


  const queryToolInfo = () => {

    if (increase === '3') {
      if (increaseMin === '' || increaseMax === '') {
        message.warn("入选后5日累计涨幅请输入区间值");
        return false;
      } 
    }
    const params = {
      activityTagListList: tagParams
        .filter(item => item.split("/")[1] === "1")
        .map(item => item.split("/")[0])
        .join(","), // 活动标签
      companyTagListList: tagParams
        .filter(item => item.split("/")[1] === "2")
        .map(item => item.split("/")[0])
        .join(","), // 公司标签
      staffTagListList: tagParams
        .filter(item => item.split("/")[1] === "3")
        .map(item => item.split("/")[0])
        .join(","), // 客户标签
      custCode: customer, // 客户号
      custGroup: cusValue.join(","), // 客户群
      custLevel: leavels.join(","), // 客户等级
      custRange: range, // 客户范围
      custType: cusRelation, // 客户相关
      endDate: rjDate[1] ? rjDate[1].format("YYYYMMDD") : "", // 信号结束日期
      startDate: rjDate[0] ? rjDate[0].format("YYYYMMDD") : "", // 信号开始日期
      fiveDaysIncrease: increase, //入选后5日涨幅  1 小于0 2 大于0 3 自定义
      increaseEnd: increaseMax, //入选后5日涨幅 结束区间
      increaseStart: increaseMin, //入选后5日涨幅 开始区间
      pageCount: pageSize, // 每页行数
      pageNumber: current, // 页码
      productCode: aclTool.join(","), // 策略工具编号
      signalType: aclType.join(","), // 信号类型
      sort: sort, // 排序
      stockCode: stockValue.join(","), // 股票代码
    };
    setLoading(true);
    QueryToolInfo(params)
      .then(res => {
        const { records, count } = res;
        records.forEach((item, index) => {
          item.xh = (current - 1) * pageSize + (index + 1);
        });
        setDataSource(records);
        setTotal(count);
        setLoading(false);
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };;
  const handleClick = (id, type) => {
    if (type === "timer") {
      if(id === '7'){
        setRjDate([moment().subtract(1, "weeks"), moment().add(-1,'d')]);
      }else if(id === '30'){
        setRjDate([moment().subtract(1, "months"), moment().add(-1, "d")]);
      }
      setTimer(id);
    } else if (type === "increase") {
      if (id === increase){
        setIncrease('');
      }else{
        setIncrease(id);
      } 
    }
  };

  const timerChange = e => {
    if(e.length === 0){
      setRjDate([moment().subtract(1, "weeks"), moment().add(-1, "d")]);
    }else{
      setRjDate(e);
    }
  };
  const leavelsChange = e => {
    setLeavels(e);
  };
  const tagChange = e => {
    setTagParams(e);
  };

  const rangeChange = e => {
    if (e) {
      setRange(e);
    } else {
      setRange("1");
    }
  };
  const customerChange = e => {
    setCustomer(e);
  };
  const aclToolChange = e => {
    setAclTool(e);
  };
  const aclTypeChange = e => {
    setAclType(e);
  };
  const relationChange = e => {
    if (e) {
      setRelation(e);
    } else {
      setRelation("1");
    }
  };
  const cusChange = e => {
    setCusValue(e);
  };
  const stockChange = e =>{
    if(e.length > 5){
      message.warn("最多同时可选5只信号股票");
    }else{
      setStockValue(e);
    }
    
  };
  const minChange = e => {
    if(e === null){
      setIncreaseMin('');
    }else{
      setIncreaseMin(e);
    }
    
  };
  const maxChange = (e)=>{
    if (e === null) {
      setIncreaseMax('');
    } else {
      setIncreaseMax(e);
    }
    
  };

  const reSet = () => {
    setTimer('7');
    setRjDate([moment().subtract(1, "weeks"), moment().add(-1,'d')]);
    setIncrease('');
    setIncreaseMin('');
    setIncreaseMax('');
    setLeavels([]);
    setTagParams([]);
    setRange('1');
    setCustomer('');
    setAclTool([]);
    setAclType([]);
    setRelation('1');
    setCusValue([]);
    setStockValue([]);
  };

  const confirm = () => {
    if(current == 1){
      queryToolInfo();
    } else{
      setCurrent(1);
    }
    
  };
  const timerOptions = {
    disabledDate: current =>
      current < moment().subtract(1, "year") || current > moment().add(-1,'d'),
    value: rjDate,
  };

  // 分页
  const tableChange = (pageSize, current) => {
    setCurrent(pageSize);
    setPageSize(current);
  };

  // 列表排序
  const onTableChange = (a, b, c) => {
    switch (c.field) {
      case "tradeDate":
        c.order === "ascend" ? setSort('2') : c.order === "descend" ? setSort('1') : setSort('');
        break;
      case "fiveDaysIncrease":
        c.order === "ascend" ? setSort('4') : c.order === "descend" ? setSort('3') : setSort('');
        break;
      case "finalIncrease":
        c.order === "ascend" ? setSort('6') : c.order === "descend" ? setSort('5') : setSort('');
        break;
      case "positionNum":
        c.order === "ascend" ? setSort('8') : c.order === "descend" ? setSort('7') : setSort('');
        break;
      default:
        setSort("");
        break;
    }
  };

  const newGetColums = columns.filter(t => t.dataIndex !== "xh" && t.dataIndex !== "action");
  const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
  const tableHeaderNames = newGetColums.map(item => item.key).join(",");
  const strategyToolInfoModel = {
    activityTagListList: tagParams
      .filter(item => item.split("/")[1] === "1")
      .map(item => item.split("/")[0])
      .join(","), // 活动标签
    companyTagListList: tagParams
      .filter(item => item.split("/")[1] === "2")
      .map(item => item.split("/")[0])
      .join(","), // 公司标签
    staffTagListList: tagParams
      .filter(item => item.split("/")[1] === "3")
      .map(item => item.split("/")[0])
      .join(","), // 客户标签
    custCode: customer, // 客户号
    custGroup: cusValue.join(","), // 客户群
    custLevel: leavels.join(","), // 客户等级
    custRange: range, // 客户范围
    custType: cusRelation, // 客户相关
    endDate: rjDate[1] ? rjDate[1].format("YYYYMMDD") : "", // 信号结束日期
    startDate: rjDate[0] ? rjDate[0].format("YYYYMMDD") : "", // 信号开始日期
    fiveDaysIncrease: increase, //入选后5日涨幅  1 小于0 2 大于0 3 自定义
    increaseEnd: increaseMax, //入选后5日涨幅 结束区间
    increaseStart: increaseMin, //入选后5日涨幅 开始区间
    pageCount: pageSize, // 每页行数
    pageNumber: current, // 页码
    productCode: aclTool.join(","), // 策略工具编号
    signalType: aclType.join(","), // 信号类型
    sort: sort, // 排序
    stockCode: stockValue.join(","), // 股票代码
  };

  const exportPayload = JSON.stringify({
    strategyToolInfoModel,
    tableHeaderNames,
    tableHeaderCodes,
  });
  const content = ()=>{
    return (
      <Iframe
        height="600"
        width="100%"
        frameBorder="0"
        src={src}
      />
    );
  };

  const locale = { emptyText: <TableLocale emptyText="抱歉，没有信息" /> };

  return (
    <div className={styles.aclTool}>
      <Card bordered={false} bodyStyle={{ padding: "16px 24px 16px 10px" }}>
        <div className={styles.boxselect}>
          <div className={styles.layout}>
            <div className={styles.label}>策略工具</div>
            <EselectCheck
              dataList={state.aclTool}
              options={{ mode: "multiple", value: aclTool }}
              onChange={aclToolChange}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>信号类型</div>
            <EselectCheck
              dataList={state.aclType}
              options={{ mode: "multiple", value: aclType }}
              onChange={aclTypeChange}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>信号日期</div>
            <RadioSuper
              type="timer"
              handleClick={handleClick}
              select={timer}
              valueInName={state.timer}
            />
            {timer === "999" && (
              <ErangePicker options={timerOptions} onChange={timerChange} />
            )}
          </div>
        </div>
        <div className={styles.boxselect}>
          <div className={styles.layout}>
            <div className={styles.label}>信号股票</div>
            <EselectCheck
              dataList={stockList}
              onChange={stockChange}
              options={{
                mode: "multiple",
                value: stockValue,
                onSearch: deQueryDictionary,
                onFocus: queryDictionary,
              }}
            />
          </div>
          <div className={styles.layout}>
            <div
              className={styles.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div>客户相关</div>
              <Tooltip
                title={relaTitle}
                getPopupContainer={() => document.getElementById("acltip")}
              >
                <img
                  src={Calimg}
                  alt=""
                  style={{ width: 16, height: 16, marginLeft: 5 }}
                />
              </Tooltip>
            </div>
            <EselectCheck
              dataList={state.cusRelation}
              onChange={relationChange}
              options={{ value: cusRelation }}
            />
          </div>
          <div className={styles.layout}>
            <div
              className={styles.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div>
                入选后5日
                <br />
                累计涨幅
              </div>
              <Tooltip
                title={incTitle}
                getPopupContainer={() => document.getElementById("acltip")}
              >
                <img
                  src={Calimg}
                  alt=""
                  style={{ width: 16, height: 16, marginLeft: 5 }}
                />
              </Tooltip>
            </div>
            <RadioSuper
              type="increase"
              handleClick={handleClick}
              select={increase}
              valueInName={state.increase}
            />
            {increase === "3" && (
              <div>
                <InputNumber
                  className={styles.rangeInput}
                  placeholder="最低(含)"
                  value={increaseMin}
                  onChange={minChange}
                  // min={0}
                  precision={2}
                />
                <span
                  style={{
                    color: "#D1D5E6",
                    margin: "0 6px",
                    width: 12,
                    overflow: "hidden",
                  }}
                >
                  —
                </span>
                <InputNumber
                  className={styles.rangeInput}
                  placeholder="最高(含)"
                  value={increaseMax}
                  onChange={maxChange}
                  min={increaseMin}
                  precision={2}
                />
                <span style={{ color: "#959CBA", marginLeft: 8 }}>(%)</span>
              </div>
            )}
          </div>

          <div className={styles.layout}>
            <div className={styles.label}>客户范围</div>
            <EselectCheck
              dataList={state.range}
              onChange={rangeChange}
              options={{ value: range }}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>客户</div>
            <Einput
              options={{
                placeholder: "客户号/客户姓名/手机号",
                value: customer,
              }}
              onChange={customerChange}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>客户等级</div>
            <EselectCheck
              dataList={state.leavels}
              options={{ mode: "multiple", value: leavels }}
              onChange={leavelsChange}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>客户标签</div>
            <EselectCheck
              dataList={tagDate}
              options={{ mode: "multiple", value: tagParams }}
              api="tag"
              onChange={tagChange}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}>客户群</div>
            <EselectCheck
              dataList={cusGroup}
              options={{ mode: "multiple", value: cusValue }}
              onChange={cusChange}
            />
          </div>
          <div className={styles.layout}>
            <div className={styles.label}></div>
            <Ebutton32 text="重置" types="main" onClick={reSet} />
            <Ebutton32
              text="查询"
              style={{ marginLeft: 16 }}
              onClick={confirm}
            />
          </div>
        </div>
      </Card>
      <div className={styles.sinp}></div>
      <Card bordered={false}>
        <div id="acltip">
          <ExportBtn
            exportPayload={exportPayload}
            total={total}
            action={queryStrategyToolInfoExport}
          />
          <EtableCheck
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey=""
            options={{ locale: locale, onChange: onTableChange, scroll: { x: 1400 } }}
          />
        </div>
        <div style={{ float: "right", paddingTop: "16px" }}>
          <Epagination
            onChange={tableChange}
            options={{ total: total, pageSize: pageSize, current: current }}
          />
        </div>
      </Card>
      <Emodal
        visible={showModal}
        setVisible={setshowModal}
        options={{ title: "个股决策信号列表", footer: false, width: "50%" }}
        content={content}
      />
    </div>
  );
};

export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(AclTool);