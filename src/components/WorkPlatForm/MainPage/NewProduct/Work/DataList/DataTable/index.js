import {
  Button,
  Form,
  message,
  Modal,
  Pagination,
  Spin,
  Input,
  Select,
  Checkbox,
  Table,
  Switch,
  DatePicker,
  Card,
  Progress,
  Tag,
  Divider,
  Empty,
  Skeleton,
  Popover
} from "antd";
import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef
} from "react";
import Scrollbars from "react-custom-scrollbars";
import moment from "moment";
import { connect } from "dva";
import lodash from "lodash";
import { uniqBy } from "lodash";
import { usePrevious, addSensors } from "../../util";
import FollowLog from "../../Common/Dialog/FollowLog";
import CustomerRelatedEvents from "../../Common/Dialog/CustomerRelatedEvents";
import EcifRelatedEvents from "../../Common/Dialog/EcifRelatedEvents";
import C4Iframe from "../../Common/Dialog/C4Iframe";
import Filter from "../../Common/Filter";
import BasicDataTable from "$common/BasicDataTable";
import { FetchStaffMessageQuotal } from "$services/incidentialServices";
import {
  QueryUserTaskCust,
  SaveOverLookUserTaskCust,
  QueryEventDetailCusList,
  IgnoreEvent,
  RecorderEventContext,
  WriterEventContext,
  EarnEventLink,
  SendMessage,
  EarnMessageStaff,
  QueryServiceRecorder,
  InvstmentAdviserSaver,
  QueryCueTaskDetails, //线索流素材和营销类型查询
  QueryUserTaskCustNew, //代办线索流任务表格查询
  SaveCompleteUserTaskCust //潜客处理
} from "$services/newProduct";
import {
  QueryEcifEventDetailCusList,
  QueryEventCustomerInfoList
} from "$services/ecifEvent";
import CryptoJS from "crypto-js";
import { getQueryDictionary } from "$services/searchProcess";
import arrow_right from "$assets/newProduct/arrow_right.svg";
import noticeIconEnclosure from "$assets/newProduct/notice_icon_enclosure.png";
import tipsImg from "$assets/newProduct/icon／tishi／_tishi1@2x.png";
import filter from "$assets/newProduct/filter.svg";
import filter_finished from "$assets/newProduct/filter_finished.svg";
import styles from "../../index.less";
import { history as router, Link } from "umi";
import FilterColumn from "./FilterColumn";
import FilterDegree from "./FilterDegree";
import FilterLevel from "./FilterLevel";
import TextArea from "antd/lib/input/TextArea";
import MyStyles from "./index.less";
import log from "echarts/src/scale/Log";

function reducer(state, action) {
  const newState = { ...state };
  newState[action.type] = action.value;
  return newState;
}

function DataTable(props) {
  const [custRank, setCustRank] = useState("0");
  const [status, setStatus] = useState("0");
  const [summary, setSummary] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [allData, setAllData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false); // 弹框显隐
  const [custNo, setCustNo] = useState(""); // 查看弹框客户号
  const [custId, setCustId] = useState(""); // 查看弹框客户id
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [ignoreModal, setIgnoreModal] = useState(false); // 确认忽略
  const [loading, setLoading] = useState(false); // loading
  const [eventVisible, setEventVisible] = useState(false); // 事件弹框
  const [ecifEventVisible, setEcifEventVisible] = useState(false); // Ecif事件弹框
  const [eventRecord, setEventRecord] = useState({}); // 事件弹框信息
  const [handleEventVisible, setHandleEventVisible] = useState({}); // 事件表单弹框信息
  const [handleWidthTaskVisible, setHandleWidthTaskVisible] = useState(false); // 任务处理弹框
  const [c4Url, setC4Url] = useState(""); // c4操作页url
  const [tableLoading, setTableLoading] = useState(false); // 表格loading
  const [eventStatus, setEventStatus] = useState("1"); // 事件状态
  // const [initKey, setInitKey] = useState(''); // 表格key
  const prevCurrent = usePrevious(current); // prevProps
  const [filterVisible, dispatch] = useReducer(reducer, {
    visible1: false,
    visible2: false,
    visible3: false
  });
  const detailType = props.activeList.replace(/[0-9]/g, "");
  const eventType = props.eventType; // 事件类型
  const ecifEventType = props.ecifEventType; // ECIF事件跟其他事件
  const [levelDateLength, setLeveLength] = useState(0);
  const [sortRules, setSortRules] = useState(""); // 分配日期 1 降序  2  升序
  const [sort, setSort] = useState(""); // 距离日期 1 降序  2  升序
  const [levelDate, setLevelDate] = useState(""); //客户级别列表-字典
  const [custTypeData, setCustTypeData] = useState([]); // 客户类型字典
  const [disorderlyData, setDisorderlyData] = useState([]); // 不规范情形字典
  const [treatmentData, setTreatment] = useState([]); // 处理方式字典
  const [cusCode, setCusCode] = useState(""); //客户级别-查询条件
  const [custType, setCustType] = useState(""); // 客户类型--查询条件
  const [disorderly, setDisorderly] = useState(""); //不规范情景-查询条件
  const [treatmentWay, setTreatmentWay] = useState(""); // 处理方式--查询条件
  const [standardWay, setStandardWay] = useState(""); // 账户规范方式----查询条件
  const [importance, setImportance] = useState(""); //重要程度-查询条件
  const [eventList, setEventList] = useState({}); //获取事件表单数据
  const [listValue, setListValue] = useState({}); //填写表单值
  const [listVisible, setListVisible] = useState(false); //表单modal
  const [sendMsgVisible, setSendMsgVisible] = useState(false); //发送短信modal
  const [messageQuota, setMessageQuota] = useState({}); //短信参数
  const [switchKey, setSwitchKey] = useState(false); //switch开关
  const [msgContent, setMsgContent] = useState(""); //短信内容
  const [dateOpen, setDateOpen] = useState(false); //日历开关
  const [msgDate, setMsgDate] = useState(moment());
  const [timeHValue, setTimeHValue] = useState(moment().format("HH"));
  const [timeMValue, setTimeMValue] = useState(moment().format("mm"));
  const [timing, setTiming] = useState(false);
  const [msgLink, setMsgLink] = useState("");
  const [msgCnt, setMsgCnt] = useState("");
  const [msgStaff, setMsgStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [staffListCurrent, setStaffListCurrent] = useState(1);
  const [staffListTotal, setStaffListTotal] = useState(0);
  const [staffListLoading, setStaffListLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [cusNot, setCusNot] = useState("");
  const [mds, setMds] = useState("");
  const [singeDeal, setSingeDeal] = useState(false); // 单条处理 默认selectAll全选为false
  const [JINDUTEXTNUM, setJINDUTEXTNUM] = useState(0);
  const [JINDUTEXTNUM2, setJINDUTEXTNUM2] = useState(0);
  const myRef = useRef(null);
  const myRef2 = useRef(null);
  const [QYState, setQYState] = useState("1"); //控制表格的签约状态
  const [QYColumns, setQYColumns] = useState([]); //控制线索流表格的表头
  const [QYData, setQYData] = useState([]); //控制线索流表格的数据
  const [QYLoading, setQYLoading] = useState(false); //控制线索流表格的数据
  const [QYcurrent, setQYcurrent] = useState(1); //当前线索流表格页码
  const [QYpageSize, setQYpageSize] = useState(10); //当前线索流表格页长
  const [QYTotal, setQYTotal] = useState(0); //当前线索流表格总数（已签约）
  const [QYTotal2, setQYTotal2] = useState(0); //当前线索流表格总数（未签约）
  const [XSLData, setXSLData] = useState({}); //线索流专用数据存放
  const [XSLBigCardLoading, setXSLBigCardLoading] = useState(false); //控制线索流上方两个大卡片的loading
  //用来判断当前选中卡片的状态
  const nowCardState =
    props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))];
  const [test1111, setTest1111] = useState(false); //用来控制标题是否需要鼠标移入提示
  const [test2222, setTest2222] = useState(false); //用来控制主题是否需要鼠标移入提示
  const [JinduShow, setJinduShow] = useState(false); //用来控制进度条相关显隐
  const [MyNewC, setJMyNewC] = useState([]);
  const [IsQianKe, setIsQianKe] = useState(false); //判断是否为潜客
  const [potentialCustModal, setPotentialCustModal] = useState(false); //控制潜客弹窗
  const [potentialCustModalAll, setPotentialCustModalAll] = useState(false); //控制潜客弹窗（批量）
  const [potentialCustModalID, setPotentialCustModalID] = useState({}); //控制潜客弹窗id

  useEffect(() => {
    const nodes = document.getElementsByClassName("ant-table-filter-dropdown");
    if (nodes && [...nodes].length && nodes[0].style.boxShadow !== "none") {
      [...nodes].forEach(item => {
        // 区分下拉弹窗某些不需要多余的背景
        if (!item.firstChild.className.includes("pDropDownInput")) {
          item.style.background = "transparent";
          item.style.boxShadow = "none";
        }
      });
    }
    return () => {
      [...nodes].forEach(item => {
        if (!item.firstChild.className.includes("pDropDownInput")) {
          item.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
          item.style.background = "#FFF";
        }
      });
    };
  });
  useEffect(() => {
    if (nowCardState?.server === "营销线索") {
      window.addEventListener("resize", throttle(setPageHeight, 1000));
      setJINDUTEXTNUM(myRef.current.offsetWidth);
      setJINDUTEXTNUM2(myRef2.current.offsetWidth);
      setTimeout(() => {
        setJINDUTEXTNUM(myRef.current.offsetWidth);
        setJINDUTEXTNUM2(myRef2.current.offsetWidth);
        setJinduShow(true);
        if (
          document.getElementById("test2").offsetWidth <
          getTextWith(
            nowCardState?.cntnt,
            "14px PingFangSC-Regular, PingFang SC"
          )
        ) {
          setTest1111(true);
        } else {
          setTest1111(false);
        }
        if (
          document.getElementById("test1").offsetWidth <
          getTextWith(nowCardState?.sbj, "20px PingFangSC-Regular, PingFang SC")
        ) {
          setTest2222(true);
        } else {
          setTest2222(false);
        }
      }, 1000);
    }
  }, []);
  useEffect(() => {
    if (nowCardState?.server === "营销线索") {
      setXSLBigCardLoading(true);
      QueryCueTaskDetails({ taskId: nowCardState.id })
        .then(res => {
          setTimeout(() => {
            setXSLBigCardLoading(false);
          }, 1000);
          setXSLData(res.records[0]);
        })
        .catch(error => {
          setTimeout(() => {
            setXSLBigCardLoading(false);
          }, 1000);
          message.error(!error.success ? error.message : error.note);
        });
    }
  }, []);
  function getTextWith(text, fontStyle) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = fontStyle || "14px"; // 设置字体样式，当然，也可以在这里给一个默认值
    var dimension = context.measureText(text);
    return dimension.width;
  }

  const setPageHeight = () => {
    setJINDUTEXTNUM(myRef.current.offsetWidth);
    setJINDUTEXTNUM2(myRef2.current.offsetWidth);
    setJinduShow(true);
    //getTextWith(nowCardState?.cntnt,'14px PingFangSC-Regular, PingFang SC')
    if (
      document.getElementById("test2").offsetWidth <
      getTextWith(nowCardState?.cntnt, "14px PingFangSC-Regular, PingFang SC")
    ) {
      setTest1111(true);
    } else {
      setTest1111(false);
    }
    if (
      document.getElementById("test1").offsetWidth <
      getTextWith(nowCardState?.sbj, "20px PingFangSC-Regular, PingFang SC")
    ) {
      setTest2222(true);
    } else {
      setTest2222(false);
    }
  };
  const colculateProgress = num => {
    if (num < 30) {
      return num - 30;
    } else if (num > 300) {
      if (XSLData.custRate.length + XSLData.custAccom.length < 5) {
        return num - 125;
      } else {
        return (
          num -
          (115 +
            (XSLData.custRate.length + XSLData.custAccom.length) * 5 +
            (537 - JINDUTEXTNUM) / 8)
        );
      }
    } else {
      return num - 75;
    }
  };
  //节流函数
  const throttle = (func, wait) => {//接受要执行的函数，决定执行的间隔时间
    let timer = null;//创建timer作为定时器
    let startTime = Date.now();//记录此次方法执行的时间
    return function() {//会返回一个匿名函数作为节流函数的执行结果
      let curTime = Date.now();//记录函数执行的时间
      let remaining = wait - (curTime - startTime);//记录两次执行间隔的时间
      let context = this;//获取当前的执行上下文this来代替func里this对象
      let args = arguments;//获取函数实参拟数组，作为参数传递给func
      clearTimeout(timer);//将上一次执行的定时器清空
      if (remaining <= 0) {//如果两次执行的间隔时间大于设定好的时间
        func.apply(context, args);//就执行传入的函数
        startTime = Date.now();//同时将执行时刻作为此次方法执行时间
      } else {
        // 如果小于wait 保证在差值时间后执行，包进异步函数放到异步队列等待预定时间之后执行
        timer = setTimeout(func, remaining);
      }
    };
  };
  // Ecif排序
  const onTableChange = (a, b, c) => {
    if (c.field === "distributionTime") {
      setSort("");
      if (c.order === "ascend") {
        setSortRules("2");
      } else {
        setSortRules("1");
      }
    } else {
      setSortRules("");
      if (c.order === "ascend") {
        setSort("2");
      } else {
        setSort("1");
      }
    }
  };
  // 定列表滚动条宽度
  const tableProps =
    detailType === "task"
      ? IsQianKe
        ? { scroll: { x: "max-content" } }
        : {}
      : eventType === "ecifEvent"
      ? {
          scroll: { x: 2080 },
          onChange: onTableChange
        }
      : {
          scroll: { x: 1200 }
        };
  //全选框功能
  const rowSelection = {
    type: "checkbox",
    crossPageSelect: eventType === "ecifEvent" ? false : true, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      if (eventType === "ecifEvent") {
        let arr = uniqBy(allData.concat(selectedRows), "eventId");
        setAllData(arr);
      }
      setSelectAll(currentSelectAll);
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
    },
    fixed: true
  };
  const custRankData = [
    { key: "0", value: "全部客户" },
    { key: "1", value: "V1-V4" },
    { key: "2", value: "V4" },
    { key: "3", value: "V5-V7(金桂卡)" }
  ];
  const statusData =
    detailType === "task"
      ? [
          { key: "0", value: "待服务" },
          { key: "1", value: "已服务" },
          { key: "2", value: "已忽略" }
        ]
      : [
          { key: "0", value: "最近更新" },
          { key: "1", value: "即将过期" }
        ];
  const eventStatusData = [
    { key: "1", value: "待服务" },
    { key: "2", value: "已忽略" },
    { key: "3", value: "已服务" }
  ];

  //重要程度字典
  const importanceData = [
    { id: "A", name: "高" },
    { id: "B", name: "中" },
    { id: "C", name: "低" }
  ];
  // 账户规范方式字典
  const disAutorData = [
    { id: "临柜", name: "临柜" },
    { id: "自助", name: "自助" }
  ];

  // 任务列表表头
  const taskColumnData = [
    {
      title: "级别",
      dataIndex: "custRank",
      className: "columnLine",
      key: "custRank",
      render: text => (
        <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
          {text || "--"}
        </div>
      ),
      filterIcon: () => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={custRank !== "0" ? filter_finished : filter}
            alt=""
            style={{ width: 10, height: 10 }}
          />
        </div>
      ),
      filterDropdown: ({ confirm }) => (
        <Filter
          visible={filterVisible.visible1}
          value={custRank}
          onChange={value => {
            setCustRank(value);
            setCurrent(1);
            dispatch({ type: "visible1", value: false });
            confirm();
          }}
          data={custRankData}
        />
      ),
      onFilterDropdownVisibleChange: visible =>
        dispatch({ type: "visible1", value: visible })
    },
    {
      title: "客户",
      dataIndex: "custName",
      key: "custName",
      className: "columnLine",
      render: (_, record) =>
        record.potentialCust ? (
          <div
            style={{ wordBreak: "break-all", whiteSpace: "normal" }}
            className={styles.hover}
          >
            {record.extInfo1}
          </div>
        ) : (
          <Link
            to={`/customerPanorama/customerInfo?customerCode=${record.custNo}`}
            target="_blank"
          >
            <div
              style={{ wordBreak: "break-all", whiteSpace: "normal" }}
              className={styles.hover}
            >
              {record.custName || "--"}({record.custNo})
            </div>
          </Link>
        ),
      filterIcon: () => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={status !== "0" ? filter_finished : filter}
            alt=""
            style={{ width: 10, height: 10 }}
          />
        </div>
      ),
      filterDropdown: ({ confirm }) => (
        <Filter
          visible={filterVisible.visible2}
          value={status}
          onChange={value => {
            setStatus(value);
            setCurrent(1);
            dispatch({ type: "visible2", value: false });
            confirm();
          }}
          data={statusData}
        />
      ),
      onFilterDropdownVisibleChange: visible =>
        dispatch({ type: "visible2", value: visible })
    },
    {
      title: "营业部",
      dataIndex: "custOrg",
      key: "custOrg",
      className: "columnLine",
      render: text => (
        <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
          {text || "--"}
        </div>
      )
    },
    {
      title: "手机号",
      dataIndex: "custPhone",
      key: "custPhone",
      className: "columnLine",
      render: text => (
        <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
          {text}
        </div>
      )
    }
    // {
    //   title: "操作",
    //   dataIndex: "address",
    //   align: "center",
    //   className: "columnLine",
    //   fixed: "right",
    //   width: 70,
    //   render: (_, record) => (
    //     <span
    //       style={{
    //         color: "#244FFF",
    //         cursor: "pointer",
    //         wordBreak: "break-all",
    //         whiteSpace: "normal"
    //       }}
    //       onClick={() => {
    //         handleWith(record);
    //       }}
    //     >
    //       {status === "1" ? "查看" : "处理"}
    //     </span>
    //   )
    // }
  ];
  // 其他事件列表表头
  const eventColumnData = [
    {
      title: "级别",
      dataIndex: "cusLvl",
      key: "cusLvl",
      className: "columnLine",
      width: 70,
      render: text => (
        <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
          {text}
        </div>
      ),
      filterIcon: () => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={custRank !== "0" ? filter_finished : filter}
            alt=""
            style={{ width: 10, height: 10 }}
          />
        </div>
      ),
      filterDropdown: ({ confirm }) => (
        <Filter
          visible={filterVisible.visible1}
          value={custRank}
          onChange={value => {
            setCustRank(value);
            setCurrent(1);
            dispatch({ type: "visible1", value: false });
            confirm();
          }}
          data={custRankData}
        />
      ),
      onFilterDropdownVisibleChange: visible =>
        dispatch({ type: "visible1", value: visible })
    },
    props.calendar && detailType === "event"
      ? {
          title: "客户",
          dataIndex: "custName",
          key: "custName",
          className: "columnLine",
          // width: 160,
          render: (_, record) => (
            <Link
              to={`/customerPanorama/customerInfo?customerCode=${record.cusNo}`}
              target="_blank"
            >
              <div
                style={{ wordBreak: "break-all", whiteSpace: "normal" }}
                className={styles.hover}
              >
                {record.cusNum}({record.cusNo})
              </div>
            </Link>
          ),
          filterIcon: () => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img
                src={eventStatus !== "1" ? filter_finished : filter}
                alt=""
                style={{ width: 10, height: 10 }}
              />
            </div>
          ),
          filterDropdown: ({ confirm }) => (
            <Filter
              visible={filterVisible.visible3}
              value={eventStatus}
              onChange={value => {
                setEventStatus(value);
                setCurrent(1);
                dispatch({ type: "visible3", value: false });
                confirm();
              }}
              data={eventStatusData}
            />
          ),
          onFilterDropdownVisibleChange: visible =>
            dispatch({ type: "visible3", value: visible })
        }
      : {
          title: "客户",
          dataIndex: "custName",
          className: "columnLine",
          key: "custName",
          // width: 160,
          render: (_, record) => (
            <Link
              to={`/customerPanorama/customerInfo?customerCode=${record.cusNo}`}
              target="_blank"
            >
              <div
                style={{ wordBreak: "break-all", whiteSpace: "normal" }}
                className={styles.hover}
              >
                {record.cusNum}({record.cusNo})
              </div>
            </Link>
          )
        },
    {
      title: "事件描述",
      dataIndex: "describe",
      className: "columnLine",
      key: "describe",
      width: 259,
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text}
        </div>
      )
    },
    props.calendar && detailType === "event"
      ? {
          title: props.calendar ? "处理时间" : "更新日期",
          dataIndex: "updateTime",
          className: "columnLine",
          key: "updateTime",
          render: text => (
            <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
              {moment(text).format("YYYY-MM-DD")}
            </div>
          )
        }
      : {
          title: props.calendar ? "处理时间" : "更新日期",
          dataIndex: "updateTime",
          key: "updateTime",
          className: "columnLine",
          render: text => (
            <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
              {moment(text).format("YYYY-MM-DD")}
            </div>
          ),
          filterIcon: () => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <img
                src={status !== "0" ? filter_finished : filter}
                alt=""
                style={{ width: 10, height: 10 }}
              />
            </div>
          ),
          filterDropdown: ({ confirm }) => (
            <Filter
              visible={filterVisible.visible2}
              value={status}
              onChange={value => {
                setStatus(value);
                setCurrent(1);
                dispatch({ type: "visible2", value: false });
                confirm();
              }}
              data={statusData}
            />
          ),
          onFilterDropdownVisibleChange: visible =>
            dispatch({ type: "visible2", value: visible })
        },
    // {
    //   title: '距离到期',
    //   dataIndex: 'deadline',
    //   className: 'columnLine',
    //   key: 'deadline',
    //   render: text => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{Number(text) > 0 ? text + '天' : moment().subtract(Math.abs(Number(text)), 'days').format('YYYY-MM-DD')}</div>,
    // },
    {
      title: "关联事件",
      dataIndex: "eventNum",
      className: "columnLine",
      key: "eventNum",
      render: (text, record) => (
        <div
          style={{
            cursor: "pointer",
            wordBreak: "break-all",
            whiteSpace: "normal"
          }}
          onClick={() => {
            handleWith(record);
          }}
        >
          关联事件<span style={{ color: "#244FFF" }}>({text})</span>
        </div>
      )
    },
    {
      title: "操作",
      dataIndex: "address",
      align: "center",
      className: "columnLine",
      fixed: "right",
      width: 70,
      render: (_, record) => (
        <span
          style={{
            color:
              props.calendar && eventStatus === "3" ? "#61698C" : "#244FFF",
            cursor: "pointer",
            wordBreak: "break-all",
            whiteSpace: "normal"
          }}
          onClick={() => {
            handleWith(record, 1, eventType);
          }}
        >
          处理
        </span>
      )
    }
  ];
  // 客户不规范（ECIF）列表表头
  const ecifColumnData = [
    {
      title: "级别",
      dataIndex: "cusLvl",
      key: "cusLvl",
      className: "columnLine",
      width: 70,
      render: text => <div>{text}</div>,
      filterDropdown: ({ confirm }) => (
        <FilterLevel
          levelDateLength={levelDateLength}
          confirm={confirm}
          treeData={levelDate}
          setCusCode={setCusCode}
        />
      )
    },
    {
      title: "客户",
      dataIndex: "cusName",
      key: "cusName",
      className: "columnLine",
      width: 100,
      render: (_, record) => (
        <Link
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
          to={`/customerPanorama/customerInfo?customerCode=${record.cusCode}`}
          target="_blank"
        >
          <div style={{ color: "#244FFF", cursor: "pointer" }}>
            {record.cusName}
          </div>
        </Link>
      )
    },
    {
      title: "客户号",
      dataIndex: "cusCode",
      key: "cusCode",
      className: "columnLine",
      width: 124,
      render: (_, record) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {record.cusCode}
        </div>
      )
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      className: "columnLine",
      width: 124,
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: "客户类型",
      dataIndex: "custType",
      key: "custType",
      className: "columnLine",
      // width: 124,
      filterDropdown: ({ confirm }) => (
        <FilterDegree
          setStateData={setCustType}
          TATA_ZTList={custTypeData}
          confirm={confirm}
        />
      ),
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: "客户账号不规范情形",
      dataIndex: "disorderlyName",
      key: "disorderlyName",
      className: "columnLine",
      width: 230,
      filterDropdown: ({ confirm }) => (
        <FilterColumn
          DIS_ZTList={disorderlyData}
          setDisorderly={setDisorderly}
          confirm={confirm}
        />
      ),
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: "事件描述",
      dataIndex: "describe",
      key: "describe",
      className: "columnLine",
      width: 300,
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: "处理方式",
      dataIndex: "treatmentWay",
      key: "treatmentWay",
      className: "columnLine",
      // width: 124,
      filterDropdown: ({ confirm }) => (
        <FilterDegree
          setStateData={setTreatmentWay}
          TATA_ZTList={treatmentData}
          confirm={confirm}
        />
      ),
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text === "1" ? "尽职调查" : text === "2" ? "通知" : "账户核查"}
        </div>
      )
    },
    {
      title: "账户规范方式",
      dataIndex: "StandardWay",
      key: "StandardWay",
      className: "columnLine",
      width: 124,
      filterDropdown: ({ confirm }) => (
        <FilterDegree
          setStateData={setStandardWay}
          TATA_ZTList={disAutorData}
          confirm={confirm}
        />
      ),
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text === "1" ? "临柜" : text === "2" ? "自助" : text}
        </div>
      )
    },
    {
      title: "联系地址",
      dataIndex: "address",
      key: "address",
      className: "columnLine",
      width: 200,
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            textAlign: "left",
            lineHeight: "20px",
            letterSpacing: "1px"
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: "重要程度",
      dataIndex: "importance",
      key: "importance",
      className: "columnLine",
      // width: 130,
      filterDropdown: ({ confirm }) => (
        <FilterDegree
          setStateData={setImportance}
          TATA_ZTList={importanceData}
          confirm={confirm}
        />
      ),
      render: text => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-all",
            lineHeight: "20px"
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: "分配日期",
      dataIndex: "distributionTime",
      key: "distributionTime",
      className: "columnLine",
      width: 124,
      sorter: true,
      render: text => <div>{moment(text).format("YYYY-MM-DD")}</div>
    },
    {
      title: "距离到期",
      dataIndex: "deadlineTime",
      key: "deadlineTime",
      className: "columnLine",
      width: 124,
      sorter: true,
      render: text => <div>{moment(text).format("YYYY-MM-DD")}</div>
    },
    {
      title: "关联事件",
      dataIndex: "eventNum",
      key: "eventNum",
      className: "columnLine",
      width: 100,
      render: (text, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleEcifWith(record);
          }}
        >
          关联事件<span style={{ color: "#244FFF" }}>({text})</span>
        </div>
      )
    },
    {
      title: "操作",
      dataIndex: "nie",
      align: "center",
      className: "columnLine",
      fixed: "right",
      width: 70,
      render: (_, record) => (
        <span
          style={{ color: "#244FFF", cursor: "pointer" }}
          onClick={() => {
            handleWith(record, 1, eventType);
          }}
        >
          处理
        </span>
      )
    }
  ];
  const columns =
    detailType === "task"
      ? IsQianKe
        ? [
            ...MyNewC,
            ...[
              {
                title: "操作",
                dataIndex: "address",
                align: "center",
                className: "columnLine",
                fixed: "right",
                width: 70,
                render: (_, record) => (
                  <span
                    style={{
                      color: "#244FFF",
                      cursor: "pointer",
                      wordBreak: "break-all",
                      whiteSpace: "normal"
                    }}
                    onClick={() => {
                      handleWith(record);
                    }}
                  >
                    {status === "1" ? "查看" : "处理"}
                  </span>
                )
              }
            ]
          ]
        : [
            ...taskColumnData,
            ...[
              {
                title: "操作",
                dataIndex: "address",
                align: "center",
                className: "columnLine",
                fixed: "right",
                width: 70,
                render: (_, record) => (
                  <span
                    style={{
                      color: "#244FFF",
                      cursor: "pointer",
                      wordBreak: "break-all",
                      whiteSpace: "normal"
                    }}
                    onClick={() => {
                      handleWith(record);
                    }}
                  >
                    {status === "1" ? "查看" : "处理"}
                  </span>
                )
              }
            ]
          ]
      : eventType === "ecifEvent"
      ? ecifColumnData
      : eventColumnData;

  const getData = useCallback(
    () => {
      //   props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
      //     ?.id
      // ),'detailType');
      setTableLoading(true);
      const params =
        detailType === "task"
          ? {
              paging: 1,
              current,
              pageSize,
              total: -1,
              custRank: Number(custRank),
              status: Number(status),
              taskId: Number(
                props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                  ?.id
              )
              // taskId: 53,
            }
          : {
              paging: 1,
              current,
              pageSize,
              total: -1,
              cusLvl: Number(custRank),
              sortRules: Number(status) + 1,
              eventId: Number(
                props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                  ?.id
              )
            };
      if (detailType === "event" && props.calendar) {
        params["date"] = props.time.format("YYYYMMDD");
        params["status"] = Number(eventStatus);
        params["sortRules"] = 3;
      }
      if (detailType === "task" && nowCardState?.server !== "营销线索") {
        QueryUserTaskCust(params)
          .then(response => {
            setTableLoading(false);
            const summary = {
              custCount: response.custCount,
              custAccom: response.custAccom,
              rate: response.custRate,
              custOver: response.custOver,
              oprUser: response.oprUser
            };
            const { records = [], total = 0, headers = [] } = response;
            if(records.length){
              setIsQianKe(records[0].potentialCust);
            }
            setDataSource(records);
            //在这里进行动态表头的生成
            let MyTabelHeader = headers.map(({ header, key }) => ({
              title: header,
              dataIndex: key,
              key: key,
              width: headers.length > 7 ? 150 : null,
              className: "columnLine",
              render: text => (
                <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
                  {text}
                </div>
              )
            }));
            setJMyNewC(MyTabelHeader);
            setSummary(summary);
            setTotal(total);
            if (prevCurrent === current) {
              setSelectAll(false);
              setSelectedRowKeys([]);
              setSelectedRows([]);
            }
          })
          .catch(error => {
            // message.error(error.note || error.message);
          });
      } else {
        if (eventType === "ecifEvent") {
          const params = {
            current,
            cusCode,
            disorderly,
            eventId: Number(
              props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                ?.id
            ),
            importance,
            pageLength: 0,
            treatmentWay,
            custType,
            standardWay,
            pageNo: 0,
            pageSize,
            paging: 1,
            sort,
            total: -1,
            totalRows: 0,
            sortRules
          };
          if (props.calendar) {
            params["date"] = props.time.format("YYYYMMDD");
          }
          const data = {
            // cusCode: params.cusCode,
            eventId: params.eventId,
            date: params.date,
            disorderly: params.disorderly,
            importance: params.importance,
            sortRules: params.sortRules
          };
          // 获取客户级别
          getQueryEventCustomerInfoList(data);
          // 事件列表
          QueryEcifEventDetailCusList(params)
            .then(res => {
              setTableLoading(false);
              const { records = [], total = 0 } = res;
              setDataSource(records);
              setTotal(total);
              const summary = {
                newCusNum: res.newCusNum,
                custCount: res.custCount,
                custAccom: res.custAccom,
                oprUser: res.oprUser,
                custExpire: res.custExpire
              };
              setSummary(summary);
              if (prevCurrent === current) {
                setSelectAll(false);
                setSelectedRowKeys([]);
                setSelectedRows([]);
              }
            })
            .catch(error => {
              // message.error(error.note || error.message);
            });
        } else {
          QueryEventDetailCusList(params)
            .then(response1 => {
              setTableLoading(false);
              const { records = [], total = 0, note = "" } = response1;
              setDataSource(records);
              setTotal(total);
              setMds(note);
              const summary = {
                newCusNum: response1.newCusNum,
                custCount: response1.custCount,
                custAccom: response1.custAccom,
                oprUser: response1.oprUser,
                custExpire: response1.custExpire
              };
              setSummary(summary);
              if (prevCurrent === current) {
                setSelectAll(false);
                setSingeDeal(false);
                setSelectedRowKeys([]);
                setSelectedRows([]);
              }
              // changeKey();
            })
            .catch(error => {
              // message.error(error.note || error.message);
            });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      current,
      pageSize,
      custRank,
      status,
      eventStatus,
      importance,
      disorderly,
      cusCode,
      sortRules,
      sort,
      props.time,
      props.calendar,
      props.activeList,
      treatmentWay,
      custType,
      standardWay
    ]
  );
  // ECIF 事件列表客户等级树形数据
  const getQueryEventCustomerInfoList = params => {
    QueryEventCustomerInfoList(params).then(res => {
      let list = res.records;
      setLeveLength(list.length);
      let data = [];
      let treeData = [];
      for (var i = 0, length = list.length; i < length; i++) {
        //  组装树形数据结构
        //  1.先分大类data
        //  2.根据data细分treeData树形数据结构
        if (!data[list[i].custLvl]) {
          var arr = [];
          var arrObj = {};
          var treesObj = {};
          arrObj.title = `${list[i].custName}(${list[i].custCode})`;
          arrObj.key = list[i].custCode;
          arr.push(arrObj);
          data[list[i].custLvl] = arr;

          treesObj.title = list[i].custLvl;
          treesObj.key = list[i].custLvl;
          treesObj.children = arr;
          treeData.push(treesObj);
        } else {
          var arrObjs = {};
          arrObjs.title = `${list[i].custName}(${list[i].custCode})`;
          arrObjs.key = list[i].custCode;
          data[list[i].custLvl].push(arrObjs);
        }
      }
      // 树形数据排序
      treeData.sort(function(a, b) {
        return a.title.replace(/[^0-9]/g, "") - b.title.replace(/[^0-9]/g, "");
      });
      // 树形数据组装小类长度
      treeData.forEach((i, d) => {
        i.title = `${i.title} (${i.children.length}个)`;
      });

      setLevelDate(treeData);
    });
  };

  // 获取字典
  const getAllQueryDictionary = () => {
    let payload = { dictionaryType: "KHBGFQX" }; // 不规范情景
    let param = { dictionaryType: "BGFXX_KHLX" }; //客户类型
    let param2 = { dictionaryType: "BGFXX_CLFS" }; // 处理方式

    Promise.all([
      getQueryDictionary(payload),
      getQueryDictionary(param),
      getQueryDictionary(param2)
    ]).then(res => {
      const [res1, res2, res3] = res;

      const { records: records1 = [] } = res1;
      setDisorderlyData(records1);
      const { records: records2 = [] } = res2;
      setCustTypeData(records2);
      const { records: records3 = [] } = res3;
      setTreatment(records3);
    });
  };

  useEffect(() => {
    getData();
    return () => {};
  }, [getData]);

  useEffect(() => {
    if (eventType === "ecifEvent") {
      // 获取不规范列表
      getAllQueryDictionary();
    }
    return () => {};
  }, []);

  const { onChange } = props;
  if (onChange && typeof onChange === "function") onChange(getData);

  const listener = useCallback(
    e => {
      const { page, action, success } = e.data;
      if (page === "cusTaskMission") {
        if (action === "closeModal") {
          setHandleWidthTaskVisible(false);
        }
        if (success) {
          window.parent.postMessage({ action: "queryBacklog" }, "*");
          getData();
          props.queryCalContent();
          setSelectAll(false);
          setSingeDeal(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setCurrent(1);
          // 测试要求刷新左边列表
          props
            .queryBackLogList({
              pagination: {
                current: 1,
                pageSize: props.pageSize,
                total: -1,
                paging: 1
              }
            })
            .then(response => {
              const listData = response.records || [];
              if (
                listData.find(
                  item =>
                    item.id ===
                    props.listData[
                      Number(props.activeList?.replace(/[^0-9]/g, ""))
                    ]?.id
                ) === undefined
              ) {
                if (listData.length) {
                  if (listData[0].typeId === "2") {
                    props.setActiveList("task0");
                  } else if (listData[0].typeId === "1") {
                    props.setActiveList("event0");
                    if (listData[0].id === ecifEventType) {
                      props.setEventType("ecifEvent");
                    } else {
                      props.setEventType("otherEvent");
                    }
                  } else if (listData[0].typeId === "3") {
                    props.setActiveList("flow0");
                  }
                }
              } else {
                //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型
                if (
                  listData[0].typeId === "1" &&
                  props.listData[
                    Number(props.activeList?.replace(/[^0-9]/g, ""))
                  ]?.id == ecifEventType
                ) {
                  props.setEventType("ecifEvent");
                } else {
                  props.setEventType("otherEvent");
                }
              }
              props.setListData(listData);
            });
        }
      } else if (page === "newMission") {
        if (action === "closeModal") {
          setHandleWidthTaskVisible(false);
        }
        if (success) {
          window.parent.postMessage({ action: "queryBacklog" }, "*");
          getData();
          props.queryCalContent();
          setSelectAll(false);
          setSingeDeal(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setCurrent(1);
          // 测试要求刷新左边列表
          props
            .queryBackLogList({
              pagination: {
                current: 1,
                pageSize: props.pageSize,
                total: -1,
                paging: 1
              }
            })
            .then(response => {
              const listData = response.records || [];

              if (
                listData.find(
                  item =>
                    item.id ===
                    props.listData[
                      Number(props.activeList?.replace(/[^0-9]/g, ""))
                    ]?.id
                ) === undefined
              ) {
                if (listData.length) {
                  if (listData[0].typeId === "2") {
                    props.setActiveList("task0");
                  } else if (listData[0].typeId === "1") {
                    props.setActiveList("event0");
                    if (listData[0].id === ecifEventType) {
                      props.setEventType("ecifEvent");
                    } else {
                      props.setEventType("otherEvent");
                    }
                  } else if (listData[0].typeId === "3") {
                    props.setActiveList("flow0");
                  }
                }
              } else {
                //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型
                if (
                  listData[0].typeId === "1" &&
                  props.listData[
                    Number(props.activeList?.replace(/[^0-9]/g, ""))
                  ]?.id == ecifEventType
                ) {
                  props.setEventType("ecifEvent");
                } else {
                  props.setEventType("otherEvent");
                }
              }
              props.setListData(listData);
            });
        }
      }
    },
    [getData, props]
  );

  useEffect(() => {
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [listener]);

  // 处理
  const handleWith = (record, falg = 0, eventType = "otherEvent") => {
    if (record.potentialCust) {
      setPotentialCustModalID(record);
      setPotentialCustModal(true);
    } else {
      if (detailType === "task") {
        if (status === "1") {
          setCustNo(record.custNo);
          setCustId(record.id);
          setVisible(true);
        } else {
          addSensors("任务处理");
          const { sysParam } = props;
          const serverName =
            sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || "";
          const url = `${serverName}/bss/ncrm/work/page/cusTaskMission.sdo?taskId=${record.taskId}&allSel=0&subTaskIds=${record.id}&customerCodes=${record.custNo}&token=318672AC1B2D2AFA06CF8D3014225A56&customerLevel=${custRank}&finishFlag=${status}`;
          setC4Url(url);
          setHandleWidthTaskVisible(true);
        }
      } else {
        if (falg === 1) {
          addSensors("事件处理");
          if (props.calendar && eventStatus === "3") return;
          if (eventType === "ecifEvent") {
            const param = {
              custCode: record.cusCode,
              motId: record.eventId,
              importance,
              disorderlyCode: disorderly,
              custCodeList: cusCode,
              crm: "1"
            };
            if (props.calendar) {
              param["calendarModel"] = props.time.format("YYYYMMDD");
            }
            let params = JSON.stringify(param);
            sessionStorage.setItem("ecifParam", params);
            router.push({
              pathname: `/newProduct/works/dealListDetail/${ecifEventType}`
            });
          } else {
            if (
              props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
                ?.kind === "1" ||
              props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
                ?.kind === ""
            ) {
              const { sysParam } = props;
              const serverName =
                sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || "";
              const url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${
                props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                  ?.id
              }&khhs=${record.cusNo}&allSel=0&token=${mds}&khIDs=${
                record.eventId
              }&customerLevel=${custRank}&rlms=${
                props.calendar ? props.time.format("YYYYMMDD") : ""
              }&cxlx=${props.calendar ? eventStatus : "0"}`;
              setC4Url(url);
              setHandleWidthTaskVisible(true);
            } else if (
              props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
                ?.kind === "2"
            ) {
              setListVisible(true);
              setSingeDeal(true);
              setListValue({});
              setMsgStaff(record.eventId);
              setCusNot(record.cusNo);
            } else if (
              props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
                ?.kind === "3"
            ) {
              setSendMsgVisible(true);
              setSingeDeal(true);
              setMsgStaff(record.eventId);
              setCusNot(record.cusNo);
              setMsgContent("");
              setSwitchKey(false);
              setTiming(false);
              setMsgDate(moment());
              setTimeHValue(moment().format("HH"));
              setTimeMValue(moment().format("mm"));
            }
          }
        } else {
          setEventRecord({
            cusNo: record.cusNo,
            cusLvl: record.cusLvl,
            cusNum: record.cusNum,
            eventId: record.eventId
          });
          setEventVisible(true);
        }
      }
    }
  };
  // Ecif事件关联
  const handleEcifWith = record => {
    setEventRecord({
      custCode: record.cusCode,
      motId: record.eventId,
      cusLvl: record.cusLvl
    });
    setEcifEventVisible(true);
  };
  const updateSide = () => {
    props
      .queryBackLogList({
        pagination: {
          current: 1,
          pageSize: props.pageSize,
          total: -1,
          paging: 1
        }
      })
      .then(response => {
        const listData = response.records || [];

        if (
          listData.find(
            item =>
              item.id ===
              props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                ?.id
          ) === undefined
        ) {
          if (listData.length) {
            if (listData[0].typeId === "2") {
              props.setActiveList("task0");
            } else if (listData[0].typeId === "1") {
              props.setActiveList("event0");
              if (listData[0].id == ecifEventType) {
                props.setEventType("ecifEvent");
              } else {
                props.setEventType("otherEvent");
              }
            } else if (listData[0].typeId === "3") {
              props.setActiveList("flow0");
            }
          }
        } else {
          //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型
          if (
            listData[0].typeId === "1" &&
            props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
              ?.id == ecifEventType
          ) {
            props.setEventType("ecifEvent");
          } else {
            props.setEventType("otherEvent");
          }
        }
        props.setListData(listData);
      });
  };
  // 批量处理
  const handleMuchWidth = () => {
    if (IsQianKe) {
      setPotentialCustModalAll(true);
    } else {
      if (detailType === "task") {
        addSensors("任务处理");
        const { sysParam } = props;
        const serverName =
          sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || "";
        const url = `${serverName}/bss/ncrm/work/page/cusTaskMission.sdo?taskId=${
          props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
        }&allSel=${selectAll ? "1" : "0"}&subTaskIds=${selectedRows
          .map(item => item.id)
          .join(",")}&customerCodes=${selectedRows
          .map(item => item.custNo)
          .join(
            ","
          )}&token=318672AC1B2D2AFA06CF8D3014225A56&customerLevel=${custRank}&finishFlag=${status}`;
        setC4Url(url);
        setHandleWidthTaskVisible(true);
      } else {
        addSensors("事件处理");
        if (eventType === "ecifEvent") {
          const custCodes = [];
          const motId = [];
          const way = [];
          //treatmentWay 1|尽职调查2|通知3|账户核查
          allData.forEach((item, index) => {
            selectedRowKeys.forEach(key => {
              if (item.eventId === key) {
                // 尽职调查跟账户核查 走单条处理方式
                if (item.treatmentWay === "1" || item.treatmentWay === "3") {
                  way.push(item.eventId);
                }
                motId.push(item.eventId);
                custCodes.push(item.cusCode);
              }
            });
          });

          // 避免数据是多条尽调或者通知跟尽调混合
          if (way.length > 1 || (custCodes.length > 1 && way.length >= 1)) {
            message.error(
              "选择事件中包含需尽职调查、账户核查的事件，请进行单条处理！"
            );
            return;
          }
          const param = {
            custCode: custCodes.join(","),
            motId: motId.join(","),
            importance,
            disorderlyCode: disorderly,
            custCodeList: cusCode,
            crm: "1"
          };
          if (props.calendar) {
            param["calendarModel"] = props.time.format("YYYYMMDD");
          }
          let params = JSON.stringify(param);
          sessionStorage.setItem("ecifParam", params);
          router.push({
            pathname: `/newProduct/works/dealListDetail/${ecifEventType}`
          });
        } else {
          if (
            props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
              ?.kind === "1" ||
            props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
              ?.kind === ""
          ) {
            const { sysParam } = props;
            const serverName =
              sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || "";
            const url = `${serverName}/bss/ncrm/work/event/page/newMission.sdo?sjid=${
              props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                ?.id
            }&khhs=${selectedRows.map(item => item.cusNo).join(",")}&allSel=${
              selectAll ? "1" : "0"
            }&token=${mds}&khIDs=${selectedRows
              .map(item => item.eventId)
              .join(",")}&customerLevel=${custRank}&rlms=${
              props.calendar ? props.time.format("YYYYMMDD") : ""
            }&cxlx=${props.calendar ? eventStatus : "0"}`;
            setC4Url(url);
            setHandleWidthTaskVisible(true);
          } else if (
            props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
              ?.kind === "2"
          ) {
            setListVisible(true);
            setListValue({});
            setMsgStaff(selectedRows.map(item => item.eventId).join(","));
            setCusNot(selectedRows.map(item => item.cusNo).join(","));
          } else if (
            props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
              ?.kind === "3"
          ) {
            setSendMsgVisible(true);
            setMsgContent("");
            setSwitchKey(false);
            setMsgStaff(selectedRows.map(item => item.eventId).join(","));
            setCusNot(selectedRows.map(item => item.cusNo).join(","));
            setTiming(false);
            setMsgDate(moment());
            setTimeHValue(moment().format("HH"));
            setTimeMValue(moment().format("mm"));
          }
        }
      }
    }
  };

  const handleIgnoreModal = () => {
    if (!selectAll && !selectedRowKeys.length) {
      message.warning("未选中任何记录！");
    } else {
      if (detailType === "task") {
        setIgnoreModal(true);
      } else {
        handleIgnore();
      }
    }
  };
  // 忽略任务/事件
  const handleIgnore = () => {
    if (detailType === "task") {
      addSensors("任务忽略");
      setLoading(true);
      const taskId = Number(
        props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
      );
      const params = {
        taskId,
        st: selectAll ? 1 : 0,
        custId: selectedRows.map(item => item.id).join(","),
        custRank: Number(custRank)
      };
      SaveOverLookUserTaskCust(params)
        .then(response => {
          window.parent.postMessage({ action: "queryBacklog" }, "*");
          message.success(response.note || "操作成功");
        })
        .catch(error => {
          message.error(error.note || error.success);
        })
        .finally(() => {
          setLoading(false);
          setIgnoreModal(false);
          getData();
          props.queryCalContent();
          setSelectAll(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setCurrent(1);
          // 测试要求刷新左边列表
          props
            .queryBackLogList({
              pagination: {
                current: 1,
                pageSize: props.pageSize,
                total: -1,
                paging: 1
              }
            })
            .then(response => {
              const listData = response.records || [];

              if (
                listData.find(
                  item =>
                    item.id ===
                    props.listData[
                      Number(props.activeList?.replace(/[^0-9]/g, ""))
                    ]?.id
                ) === undefined
              ) {
                if (listData.length) {
                  if (listData[0].typeId === "2") {
                    props.setActiveList("task0");
                  } else if (listData[0].typeId === "1") {
                    props.setActiveList("event0");
                    if (listData[0].id === ecifEventType) {
                      props.setEventType("ecifEvent");
                    } else {
                      props.setEventType("otherEvent");
                    }
                  } else if (listData[0].typeId === "3") {
                    props.setActiveList("flow0");
                  }
                }
              } else {
                //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型
                if (
                  listData[0].typeId === "1" &&
                  props.listData[
                    Number(props.activeList?.replace(/[^0-9]/g, ""))
                  ]?.id == ecifEventType
                ) {
                  props.setEventType("ecifEvent");
                } else {
                  props.setEventType("otherEvent");
                }
              }
              props.setListData(listData);
            });
        });
    } else if (detailType === "event") {
      addSensors("事件忽略");
      setLoading(true);
      setTableLoading(true);
      // const eventType = Number(props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id);
      // const eventId = selectedRows.map(item => item.eventId).join(',');
      // const params = {
      //   eventType,
      //   eventId,
      //   isAll: selectAll ? '1' : '0',
      //   isRelation: 0,
      // };
      // if (props.calendar) params['date'] = props.time.format('YYYYMMDD');
      // IgnoreEvent(params).then((response) => {
      //   message.success(response.note || '操作成功');
      //   window.parent.postMessage({ action: 'queryBacklog' }, '*');
      const params = {
        custCode: selectedRows.map(item => item.eventId).join(","),
        title:
          props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.sbj,
        content:
          props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
            ?.cntnt,
        eventId: Number(
          props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
        ),
        serviceWay: 1,
        handleContent: 1,
        isAll: selectAll ? 1 : 0
      };
      if (props.calendar) {
        params.dateWay = props.time.format("YYYYMMDD");
      }
      QueryServiceRecorder(params)
        .then(res => {
          message.info("待办已完成");
          window.parent.postMessage({ action: "queryBacklog" }, "*");
        })
        .catch(error => {
          message.error(error.note || error.success);
        })
        .finally(() => {
          setLoading(false);
          setIgnoreModal(false);
          getData();
          props.queryCalContent();
          setSelectAll(false);
          setSelectedRowKeys([]);
          setSelectedRows([]);
          setCurrent(1);
          // 测试要求刷新左边列表
          props
            .queryBackLogList({
              pagination: {
                current: 1,
                pageSize: props.pageSize,
                total: -1,
                paging: 1
              }
            })
            .then(response => {
              const listData = response.records || [];
              if (
                listData.find(
                  item =>
                    item.id ===
                    props.listData[
                      Number(props.activeList?.replace(/[^0-9]/g, ""))
                    ]?.id
                ) === undefined
              ) {
                if (listData.length) {
                  if (listData[0].typeId === "2") {
                    props.setActiveList("task0");
                  } else if (listData[0].typeId === "1") {
                    props.setActiveList("event0");
                    if (listData[0].id == ecifEventType) {
                      props.setEventType("ecifEvent");
                    } else {
                      props.setEventType("otherEvent");
                    }
                  } else if (listData[0].typeId === "3") {
                    props.setActiveList("flow0");
                  }
                }
              } else {
                //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型
                if (
                  listData[0].typeId === "1" &&
                  props.listData[
                    Number(props.activeList?.replace(/[^0-9]/g, ""))
                  ]?.id == ecifEventType
                ) {
                  props.setEventType("ecifEvent");
                } else {
                  props.setEventType("otherEvent");
                }
              }
              props.setListData(listData);
            });
        });
    }
  };
  const renderCount = () => {
    let count = 0;
    if (selectAll) {
      count = total - selectedRowKeys.length;
    } else {
      count = selectedRowKeys.length;
    }
    if (count) return `(${count})`;
    return "";
  };
  const handlePageChange = (current, pageSize) => {
    setCurrent(current);
    setPageSize(pageSize);
  };
  const computed = type => {
    if (type === "lookAttac") {
      return props.activeList.replace(/[0-9]/g, "") === "task" &&
        props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]?.attac
        ? "visible"
        : "hidden";
    } else if (type === "taskPeriod") {
      return props.activeList.replace(/[0-9]/g, "") === "task"
        ? "visible"
        : "hidden";
    }
  };
  const download = () => {
    const { sysParam } = props;
    const serverName =
      sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || "";
    window.open(
      `${serverName}/OperateProcessor?Column=FJ&Table=TB_TASK&operate=Download&Type=Attachment&ID=${
        props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]?.id
      }`
    );
  };
  const toAllTask = () => {
    const { sysParam } = props;
    const serverName =
      sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || "";
    // window.parent.postMessage({ action: 'editTask', taskId: props.listData[Number(props.activeList?.replace(/[^0-9]/g, ''))]?.id || '0' }, '*');
    window.open(
      `${serverName}/bss/ncrm/work/page/taskDetail.sdo?sjid=${props.listData[
        Number(props.activeList?.replace(/[^0-9]/g, ""))
      ]?.id || "0"}&sftjkh=1`
    );
  };
  useEffect(() => {
    if (listVisible) {
      writerEventContext();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listVisible]);
  useEffect(() => {
    if (sendMsgVisible) {
      fetchStaffMessageQuotal();
      earnEventLink();
      getMsgStaffList();
    }
    return () => {};
  }, [sendMsgVisible]);
  useEffect(() => {
    if (sendMsgVisible) {
      getMsgStaffList();
    }
    return () => {};
  }, [staffListCurrent]);
  useEffect(() => {
    if (switchKey) {
      setMsgContent(msgCnt);
    } else {
      setMsgContent("");
    }
    return () => {};
  }, [switchKey]);
  useEffect(() => {
    showTime();
    document.onclick = function(param) {
      if (!param.target) {
        return;
      }
      if (param.target.id !== "rangePicker") {
        setDateOpen(false);
      }
    };
    return () => {};
  });
  useEffect(() => {
    if (nowCardState?.server === "营销线索") {
      setQYLoading(true);
      QueryUserTaskCustNew({
        paging: 1,
        current: QYcurrent, //当前页码
        pageSize: QYpageSize, //当前页长度
        total: -1, //总数
        custRank: 0,
        status: 0,
        taskId: nowCardState.id,
        signStatus: QYState === "1" ? 1 : 2
      })
        .then(res => {
          XSLTableHeader(res.headers);
          setQYData(res.records);
          QYState === "1" ? setQYTotal(res.total) : setQYTotal2(res.total);
          setQYLoading(false);
        })
        .finally(() => {
          setQYLoading(false);
        });
    }
  }, [QYState, QYcurrent, QYpageSize]);
  //只在第一次请求，用来获取未签约人数
  useEffect(() => {
    if (nowCardState?.server === "营销线索") {
      QueryUserTaskCustNew({
        paging: 1,
        current: QYcurrent, //当前页码
        pageSize: QYpageSize, //当前页长度
        total: -1, //总数
        custRank: 0,
        status: 0,
        taskId: nowCardState.id,
        signStatus: 2
      }).then(res => {
        setQYTotal2(res.total);
      });
    }
  }, []);
  //线索流动态生成表头函数
  const XSLTableHeader = headerList => {
    const myRes = headerList.filter(res => res.key !== "custNo");
    const result = myRes.map((item, index) => {
      if (item.key === "custName") {
        return {
          title: item.header,
          dataIndex: item.key,
          key: item.key,
          width: 200,
          align: "left",
          render: (_, record) => (
            <Link
              style={{
                whiteSpace: "normal",
                wordBreak: "break-all",
                lineHeight: "20px",
                letterSpacing: "1px"
              }}
              to={`/customerPanorama/customerInfo?customerCode=${record.custNo}`}
              target="_blank"
            >
              <div style={{ color: "#244FFF", cursor: "pointer" }}>
                {record.custName}({record.custNo})
              </div>
            </Link>
          )
        };
      } else if (item.key === "custOrg") {
        return {
          title: item.header,
          dataIndex: item.key,
          key: item.key,
          //width: headerList.length - 1 === index ? 200 : 230,
          width: 230,
          align: "left",
          render: text => (text ? text : "--")
        };
      } else if (item.key === "custRank") {
        return {
          title: item.header,
          dataIndex: item.key,
          key: item.key,
          //width: headerList.length - 1 === index ? 200 : 230,
          width: 130,
          align: "left",
          render: text => (text ? text : "--")
        };
      } else {
        return {
          title: item.header,
          dataIndex: item.key,
          key: item.key,
          //width: headerList.length - 1 === index ? 200 : 230,
          //width: headerList.length - 1 === index ? "auto" : 220,
          width: 220,
          align: "left",
          render: text => (text ? text : "--")
        };
      }
    });

    // {
    //   title: "客户号",
    //   dataIndex: "custNo",
    //   key: "custNo",
    //   className: "columnLine",
    //   render: text => (
    //     <div style={{ wordBreak: "break-all", whiteSpace: "normal" }}>
    //       {text}
    //     </div>
    //   )
    // },
    //setQYColumns([...result,...result]);
    setQYColumns(result);
  };
  const fetchStaffMessageQuotal = () => {
    FetchStaffMessageQuotal()
      .then((ret = {}) => {
        const { records = [], code = 0 } = ret || {};
        if (code > 0) {
          setMessageQuota(records[0]);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  const recorderEventContext = () => {
    let param = [];
    let tip = true;
    eventList?.formTitleList?.forEach((item, index) => {
      if (
        listValue[item.titleId] &&
        !lodash.isEmpty(lodash.trim(listValue[item.titleId]))
      ) {
        param[index] = {
          an: listValue[item.titleId],
          cywj: eventList.eventId,
          ord: item.titlePro,
          topic: item.titleId,
          type: item.type
        };
      } else if (tip) {
        message.info(
          item.type === "3"
            ? `请填写${item.titleName}`
            : `请选择${item.titleName}`
        );
        tip = false;
      }
    });
    if (param.length === Object.keys(listValue).length) {
      setModalLoading(true);
      RecorderEventContext(param)
        .then(res => {
          if (res.code > 0) {
            message.info("提交成功");
            queryServiceRecorder(1);
            setListVisible(false);
          }
          setModalLoading(false);
        })
        .catch(error => {
          setModalLoading(false);
          message.error(error.note || error.message);
        });
    }
  };
  const writerEventContext = () => {
    WriterEventContext({
      eventId: Number(
        props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
      )
      // eventId: '294',
    })
      .then(res => {
        setEventList(res?.records[0]);
        res?.records[0]?.formTitleList.forEach(item => {
          setListValue({ ...listValue, [item.titleId]: undefined });
        });
      })
      .catch(error => {
        message.error(error.note || error.message);
      });
  };
  const earnEventLink = () => {
    let eventId = Number(
      props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
    );
    EarnEventLink({
      eventId
    })
      .then(res => {
        let linkData = res.records[0];
        if (linkData) {
          setMsgLink(linkData.msgLink);
          // setMsgTitle(linkData.title)
          // setMsgDesc(linkData.descript)
          // setMsgCnt(linkData.msgContent)
          const { sysParam = [] } = props;
          const serverName = sysParam.filter(
            item => item?.csmc === "system.c4ym.url"
          )[0]?.csz;
          const SHARE_URL =
            serverName === "https://crm.axzq.com.cn:8081"
              ? "https://crm.axzq.com.cn"
              : "https://scrm.essence.com.cn";
          const ICON_URL =
            "https://essence-1253205294.cos.ap-guangzhou.myqcloud.com/mrmp/crm/sftp_file/logo.png";
          // 把分享信息保存到c端
          const shareMessage = {
            title: linkData.title,
            summary: linkData.descript,
            pic: ICON_URL,
            // 是否是主题资讯
            isTheme: 0,
            detailUrl: linkData.msgLink
          };
          const param2 = {
            proType: "15",
            id: `${eventId}_${JSON.parse(sessionStorage.getItem("user")).id}`,
            describe: JSON.stringify(shareMessage)
          };
          // iframe的url过长，微信传输的时候会被截断，所以先在b端存进数据库。在c端打开的时候，再从c端读取url
          InvstmentAdviserSaver(param2);
          const redirectId = stringToHex(
            `${eventId}_${JSON.parse(sessionStorage.getItem("user")).id}`
          );
          const shareUrl = `${SHARE_URL}/tifa/index.html#/redirect/${redirectId}`;
          // 重新生成短息内容
          setMsgCnt(generateMessage(linkData.msgContent, shareUrl));
        }
      })
      .catch(error => {
        message.error(error.note || error.message);
      });
  };
  const sendMessage = sendSelf => {
    if (msgContent === "") {
      message.info("请填写短信内容");
    } else {
      let param = {
        chnl: "8",
        rcvr: 1,
        // md: 'D2DD1E47E3197EB0FEC32F1456230A0D',
        md: mds,
        ntfyFlg: 0,
        sbj:
          props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.sbj,
        tx: msgContent,
        txHtml: "<p>正文</p>",
        senWay: singeDeal ? 1 : selectAll ? 2 : 1,
        rvwTp: 0,
        oprTp: 2,
        sendTp: 1,
        sfqx: singeDeal ? 0 : selectAll ? 1 : 0,
        khh: cusNot,
        fwlb: 7,
        presend: timing
          ? moment(msgDate).format("YYYY-MM-DD") +
            " " +
            timeHValue +
            ":" +
            timeMValue
          : undefined,
        id: Number(
          props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
        )
      };
      if (sendSelf) {
        param.rcvr = 3;
        param.khh = "0";
      }
      setModalLoading(true);
      SendMessage(param)
        .then(res => {
          if (res.code > 0) {
            queryServiceRecorder(8);
            setSendMsgVisible(false);
          }
          message.info(res.note);
          setModalLoading(false);
        })
        .catch(error => {
          setModalLoading(false);
          setSingeDeal(false);
          message.error(error.note || error.message);
        });
    }
  };
  const getMsgStaffList = () => {
    setStaffListLoading(true);
    EarnMessageStaff({
      chnl: "8",
      chnlList: "8",
      sendWay: singeDeal ? 1 : selectAll ? 2 : 1,
      rcvrTp: 1,
      sfqx: singeDeal ? 0 : selectAll ? 1 : 0,
      khh: cusNot,
      // rcvr: 'D2DD1E47E3197EB0FEC32F1456230A0D',
      rcvr: mds,
      pageNo: 0,
      pageSize: 5,
      paging: 1,
      current: staffListCurrent,
      total: -1,
      id: Number(
        props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
      )
    })
      .then(res => {
        setStaffList(res.records);
        setStaffListTotal(res.total);
        setStaffListLoading(false);
      })
      .catch(error => {
        message.error(error.note || error.message);
      });
  };
  const queryServiceRecorder = serviceWay => {
    const params = {
      custCode: msgStaff,
      title:
        props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.sbj,
      content:
        props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.cntnt,
      eventId: Number(
        props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]?.id
      ),
      serviceWay,
      handleContent: 1,
      isAll: singeDeal ? 0 : selectAll ? 1 : 0
    };
    if (props.calendar) {
      params.dateWay = props.time.format("YYYYMMDD");
    }
    QueryServiceRecorder(params).then(res => {
      if (res.code > 0) {
        getData();
        props.queryCalContent();
        setSelectAll(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setSingeDeal(false);
        setCurrent(1);
        // 测试要求刷新左边列表
        props
          .queryBackLogList({
            pagination: {
              current: props.current,
              pageSize: props.pageSize,
              total: -1,
              paging: 1
            }
          })
          .then(response => {
            const listData = response.records || [];

            if (
              listData.find(
                item =>
                  item.id ===
                  props.listData[
                    Number(props.activeList?.replace(/[^0-9]/g, ""))
                  ]?.id
              ) === undefined
            ) {
              if (listData.length) {
                if (listData[0].typeId === "2") {
                  props.setActiveList("task0");
                } else if (listData[0].typeId === "1") {
                  props.setActiveList("event0");
                  if (listData[0].id === ecifEventType) {
                    props.setEventType("ecifEvent");
                  } else {
                    props.setEventType("otherEvent");
                  }
                } else if (listData[0].typeId === "3") {
                  props.setActiveList("flow0");
                }
              }
            } else {
              //  当处理完事件，页面刷新事件大类第一条数据是ECIF事件，要保证表格能正确切换对应类型
              if (
                listData[0].typeId === "1" &&
                props.listData[Number(props.activeList?.replace(/[^0-9]/g, ""))]
                  ?.id == ecifEventType
              ) {
                props.setEventType("ecifEvent");
              } else {
                props.setEventType("otherEvent");
              }
            }
            props.setListData(listData);
          });
      }
    });
  };
  // 替换短信模板中的链接
  const generateMessage = (msg, url) => {
    if (_.isEmpty(msg)) return "";
    return msg.replace(/\${链接}/, url);
  };

  // const getShareUrl = (eventId,content) => {
  //   const SHARE_URL =  process.env.NODE_ENV === 'development' ? 'https://crm.axzq.com.cn':'https://scrm.essence.com.cn';
  //   const ICON_URL = process.env.NODE_ENV === 'https://essence-1253205294.cos.ap-guangzhou.myqcloud.com/mrmp/crm/sftp_file/logo.png';
  //   // 把分享信息保存到c端
  //   const shareMessage = {
  //     title: msgTitle,
  //     summary: msgDesc,
  //     pic: ICON_URL,
  //     // 是否是主题资讯
  //     isTheme: 0,
  //     detailUrl: msgLink,
  //   };
  //   const param2 = { proType: '15', id: `${eventId}_${JSON.parse(sessionStorage.getItem('user')).id}`, describe: JSON.stringify(shareMessage) };
  //   // iframe的url过长，微信传输的时候会被截断，所以先在b端存进数据库。在c端打开的时候，再从c端读取url
  //   InvstmentAdviserSaver(param2);
  //   const redirectId = stringToHex(`${eventId}_${JSON.parse(sessionStorage.getItem('user')).id}`);
  //   const shareUrl = `${SHARE_URL}/tifa/index.html#/redirect/${redirectId}`;
  //   // 重新生成短息内容
  //   setMsgCnt(generateMessage(content, shareUrl))
  // }

  // 加密
  const stringToHex = str => {
    const data = CryptoJS.enc.Utf8.parse(str);
    return CryptoJS.enc.Hex.stringify(data);
  };

  const msgCustCol = [
    {
      title: "客户姓名",
      dataIndex: "objectName",
      key: "objectName",
      ellipsis: true
    },
    {
      title: "柜台手机",
      dataIndex: "phone",
      key: "phone",
      ellipsis: true
    }
  ];
  const timeH = () => {
    let timearr = [];
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        timearr.push("0" + i);
      } else {
        timearr.push("" + i);
      }
    }
    return timearr;
  };
  const timeM = () => {
    let timearr = [];
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        timearr.push("0" + i);
      } else {
        timearr.push("" + i);
      }
    }
    return timearr;
  };
  const showTime = () => {
    setTimeout(() => {
      if (document.getElementById("rangePicker")) {
        document
          .getElementById("rangePicker")
          .getElementsByClassName("ant-calendar-picker-input")[0].value =
          moment(msgDate).format("YYYY-MM-DD") +
          " " +
          timeHValue +
          ":" +
          timeMValue;
      }
    });
  };
  //计算进度条长度
  const getProgressBarPercentage = (num = 1) => {
    return nowCardState.custOver;
  };

  return (
    <Spin spinning={nowCardState?.server === "营销线索" ? false : tableLoading}>
      <div
        style={{
          height: 52,
          borderBottom: "1px solid #e8e8e8",
          padding: "0 22px 0 16px",
          display: "flex",
          alignItems: "center",
          fontSize: 12,
          position: "relative",
          background: "#FFF"
        }}
      >
        <div style={{ marginRight: 32 }}>
          <div>{detailType === "task" ? "任务周期" : "事件详情"}</div>
          {detailType === "task" && (
            <div>
              {moment(
                props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
                  ?.beginTime
              ).format("YYYY.MM.DD")}
              -
              {moment(
                props.listData[Number(props.activeList.replace(/[^0-9]/g, ""))]
                  ?.endTime
              ).format("YYYY.MM.DD")}
            </div>
          )}
        </div>
        {nowCardState?.server === "营销线索" && (
          <div style={{ color: "#61698C" }}>
            <div>
              {detailType === "task" ? (
                <>
                  <span>已服务客户</span>
                  <span style={{ color: "#FF6E30" }}>{XSLData.custRate||'-'}</span>
                  <span> / 完成率</span>
                  <span style={{ color: "#FF6E30" }}>{XSLData.custOver||'-'}</span>
                </>
              ) : props.calendar ? (
                <>
                  <span>待服务客户</span>
                  <span style={{ color: "#FF6E30" }}>
                    {XSLData.custCount}/{XSLData?.custAccom}
                  </span>
                  {/* <span> / 已忽略</span>
                <span style={{ color: '#FF6E30' }}>{summary.oprUser || '-'}</span> */}
                </>
              ) : (
                <>
                  <span>待服务客户</span>
                  <span style={{ color: "#FF6E30" }}>{XSLData.custCount||'-'}</span>
                  <span> / 今日新增</span>
                  <span style={{ color: "#FF6E30" }}>{XSLData.newCusNum||'-'}</span>
                </>
              )}
            </div>
            {detailType === "task" ? (
              <div>
                <span>待服务客户</span>
                <span style={{ color: "#FF6E30" }}>
                  {XSLData?.custCount || "-"}/{XSLData?.custAccom || "-"}
                </span>
                <span> / 已忽略客户</span>
                <span style={{ color: "#FF6E30" }}>
                  {XSLData?.oprUser || "-"}
                </span>
              </div>
            ) : props.calendar ? (
              ""
            ) : (
              <div>
                <span>2天内到期</span>
                <span style={{ color: "#FF6E30" }}>
                  {XSLData?.custExpire || "-"}
                </span>
              </div>
            )}
          </div>
        )}
        {nowCardState?.server !== "营销线索" && (
          <div style={{ color: "#61698C" }}>
            <div>
              {detailType === "task" ? (
                <>
                  <span>已服务客户</span>
                  <span style={{ color: "#FF6E30" }}>{summary.rate||'-'}</span>
                  <span> / 完成率</span>
                  <span style={{ color: "#FF6E30" }}>{summary.custOver||'-'}</span>
                </>
              ) : props.calendar ? (
                <>
                  <span>待服务客户</span>
                  <span style={{ color: "#FF6E30" }}>
                    {summary.custCount||'-'}/{summary.custAccom||'-'}
                  </span>
                  {/* <span> / 已忽略</span>
                <span style={{ color: '#FF6E30' }}>{summary.oprUser || '-'}</span> */}
                </>
              ) : (
                <>
                  <span>待服务客户</span>
                  <span style={{ color: "#FF6E30" }}>{summary.custCount||'-'}</span>
                  <span> / 今日新增</span>
                  <span style={{ color: "#FF6E30" }}>{summary.newCusNum||'-'}</span>
                </>
              )}
            </div>
            {detailType === "task" ? (
              <div>
                <span>待服务客户</span>
                <span style={{ color: "#FF6E30" }}>
                  {summary?.custCount || "-"}/{summary?.custAccom || "-"}
                </span>
                <span> / 已忽略客户</span>
                <span style={{ color: "#FF6E30" }}>
                  {summary?.oprUser || "-"}
                </span>
              </div>
            ) : props.calendar ? (
              ""
            ) : (
              <div>
                <span>2天内到期</span>
                <span style={{ color: "#FF6E30" }}>
                  {summary.custExpire || "-"}
                </span>
              </div>
            )}
          </div>
        )}

        <div>
          <div
            onClick={download}
            className={styles.hover}
            style={{
              paddingLeft: "10px",
              display: "flex",
              alignItems: "start",
              color: "#61698C",
              fontSize: 12,
              visibility: computed("lookAttac"),
              marginBottom: "16px"
            }}
          >
            <div>
              <img
                style={{ width: 14, height: 14 }}
                src={noticeIconEnclosure}
                alt=""
              />
            </div>
            <span>查看附件</span>
          </div>
        </div>
        {nowCardState?.server !== "营销线索" && (
          <div style={{ position: "absolute", right: "22px" }}>
            {detailType === "task" &&
              lodash
                .get(props.authorities, "backlog", [])
                .includes("queryAllCust") && (
                <Button
                  onClick={toAllTask}
                  className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14 ml14 m-btn-radius ${styles.ignore}`}
                  style={{
                    border: "none",
                    width: 72,
                    minWidth: 72,
                    maxWidth: 72,
                    height: 32,
                    margin: 0,
                    padding: 0
                  }}
                >
                  全部客户
                </Button>
              )}

            <Button
              disabled={
                (!selectAll && !selectedRowKeys.length) ||
                (detailType === "task" && (status === "2" || status === "1")) ||
                (props.calendar &&
                  detailType === "event" &&
                  (eventStatus === "2" || eventStatus === "3"))
              }
              onClick={loading ? "" : handleIgnoreModal}
              className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14 ml14 m-btn-radius ${styles.ignore}`}
              style={{
                visibility: eventType === "otherEvent" ? "visible" : "hidden",
                border: "none",
                minWidth: 108,
                height: 32,
                marginRight: 0,
                backgroundColor: detailType === "task" ? "#F0F1F5" : "#244FFF",
                color: detailType === "task" ? "#1A2243" : "#fff"
              }}
            >
              {props.activeList.replace(/[0-9]/g, "") === "task"
                ? "忽略任务"
                : "已通知客户"}
              {renderCount()}
            </Button>

            <Button
              disabled={
                (!selectAll && !selectedRowKeys.length) ||
                (detailType === "task" && status === "1") ||
                (props.calendar &&
                  detailType === "event" &&
                  eventStatus === "3")
              }
              className={`fcbtn m-btn-border m-btn-border-blue ant-btn fs14 ml14 ${styles.handleWidth}`}
              style={{ border: "none", minWidth: 108, height: 32 }}
              onClick={handleMuchWidth}
            >
              批量处理{renderCount()}
            </Button>
          </div>
        )}
      </div>
      {nowCardState?.server === "营销线索" && (
        <Spin spinning={XSLBigCardLoading}>
          <div className={MyStyles.L_C_bigCard}>
            <div className={MyStyles.L_C_bigCardL}>
              <div
                style={{
                  //height: 92,
                  height: "24%",
                  width: "95%",
                  flexDirection: "column",
                  display: "flex"
                  //justifyContent: 'center',
                  //background: "red"
                }}
              >
                {/* <div className={MyStyles.L_C_Text1}>
                  {nowCardState?.sbj || "--"}
                </div> */}
                {test2222 ? (
                  <Popover
                    overlayClassName={MyStyles.indexDetail}
                    //arrowPointAtCenter={true}
                    title={null}
                    placement="bottomLeft"
                    trigger="hover"
                    content={
                      <div
                        style={{
                          background: "#474D64",
                          color: "#FFFFFF",
                          padding: 5,
                          width: 292,
                          boxSizing: "border-box",
                          borderRadius: 2
                        }}
                      >
                        {nowCardState?.sbj || "--"}
                      </div>
                    }
                  >
                    <div
                      className={MyStyles.L_C_Text1}
                      id="test1"
                      style={{
                        marginTop: "-5px"
                      }}
                    >
                      {nowCardState?.sbj || "--"}
                    </div>
                  </Popover>
                ) : (
                  <div
                    className={MyStyles.L_C_Text1}
                    id="test1"
                    style={{
                      marginTop: "-5px"
                    }}
                  >
                    {nowCardState?.sbj || "--"}
                  </div>
                )}
                {test1111 ? (
                  <Popover
                    overlayClassName={MyStyles.indexDetail}
                    //arrowPointAtCenter={true}
                    title={null}
                    placement="bottomLeft"
                    trigger="hover"
                    content={
                      <div
                        style={{
                          background: "#474D64",
                          color: "#FFFFFF",
                          padding: 5,
                          width: 292,
                          boxSizing: "border-box",
                          borderRadius: 2
                        }}
                      >
                        {nowCardState?.cntnt || "--"}
                      </div>
                    }
                  >
                    <div className={MyStyles.L_C_Text2} id="test2">
                      {nowCardState?.cntnt || "--"}
                    </div>
                  </Popover>
                ) : (
                  <div className={MyStyles.L_C_Text2} id="test2">
                    {nowCardState?.cntnt || "--"}
                  </div>
                )}
              </div>
              <div
                className={MyStyles.TJSCScroll}
                style={{
                  width: "93%",
                  minHeight: "62%",
                  background: "white",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                  borderRadius: "4px",
                  border: "1px solid #F0F1F5",
                  overflowY: "auto",
                  overflowX: "hidden"
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    minHeight: "6vh",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #F0F1F5"
                  }}
                >
                  <div className={MyStyles.fontStyle2} id="test3">
                    {XSLData?.marketingContent
                      ?.map(item => item.businessName)
                      .toString()}
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "11vh",
                    //background: "red",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div className={MyStyles.L_C_Progress} ref={myRef2}>
                    {JinduShow && (
                      <div
                        className={MyStyles.L_C_Progress_message_triangle}
                        style={{ left: `${JINDUTEXTNUM - 8}px` }}
                      ></div>
                    )}
                    <div
                      ref={myRef}
                      className={MyStyles.L_C_Progress_jinDu}
                      style={{ width: `${getProgressBarPercentage()}` }}
                    ></div>
                    {JinduShow && (
                      <div
                        className={MyStyles.L_C_Progress_message}
                        style={{ left: `${colculateProgress(JINDUTEXTNUM)}px` }}
                      >
                        {/*<div*/}
                        {/*  className={MyStyles.L_C_Progress_message_triangle}*/}
                        {/*  //style={{ left: `${JINDUTEXTNUM+20}px` }}*/}
                        {/*>*/}
                        {/*</div>*/}
                        <div
                          style={{
                            width: "100px",
                            paddingLeft: 5
                          }}
                        >
                          完成率:{`${getProgressBarPercentage()}`}
                        </div>

                        <span
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                        >
                          |
                        </span>
                        <span
                          style={{
                            paddingRight: "5px"
                          }}
                        >
                          {XSLData.custRate}/{XSLData.custAccom}
                        </span>
                      </div>
                    )}

                    <div
                      className={MyStyles.ProgressStart}
                      style={{
                        backgroundColor: `${
                          getProgressBarPercentage() == 0
                            ? "#F3F4F7"
                            : "#18A3FF"
                        }`
                      }}
                    >
                      <div className={MyStyles.ProgressStart_auto}>
                        <div
                          className={MyStyles.ProgressStart_auto_text}
                          //style={{ left: "-11px" }}
                        >
                          {XSLData.marketingObjective === "1"
                            ? "未开通"
                            : XSLData.marketingObjective === "2"
                            ? "未销售"
                            : XSLData.marketingObjective === "3"
                            ? "未签约"
                            : "未签约"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={MyStyles.ProgressEnd}
                      style={{
                        transition: 0.5,
                        left: `${JINDUTEXTNUM2 - 2}px`,
                        backgroundColor: `${
                          getProgressBarPercentage() === "100.0%"
                            ? "#18A3FF"
                            : "#F3F4F7"
                        }`
                      }}
                    >
                      <div className={MyStyles.ProgressStart_auto}>
                        <div
                          className={MyStyles.ProgressStart_auto_text}
                          //style={{ left: "-25px" }}
                        >
                          {XSLData.marketingObjective === "1"
                            ? "已开通"
                            : XSLData.marketingObjective === "2"
                            ? "已销售"
                            : XSLData.marketingObjective === "3"
                            ? "已签约"
                            : "已签约"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {XSLData.marketingMaterial &&
            XSLData.marketingMaterial.length > 0 ? (
              <div className={MyStyles.L_C_bigCardR}>
                <div
                  style={{
                    //height: 92,
                    height: "20%",
                    width: "95%",
                    flexDirection: "column",
                    display: "flex",
                    justifyContent: "center"
                    //background: "red"
                  }}
                >
                  <div
                    className={MyStyles.L_C_Text1}
                    style={{
                      marginTop: "5px"
                    }}
                  >
                    营销素材
                  </div>
                </div>
                <div
                  className={MyStyles.YXCSCListAll}
                  style={{
                    //height: 92,
                    height: "80%",
                    width: "93%",
                    //flexDirection: "column",
                    //display: "flex",
                    //justifyContent: "center",
                    alignItems: "center",
                    overflow: "auto"
                    //background: "blue"
                  }}
                >
                  {XSLData.marketingMaterial &&
                  XSLData.marketingMaterial.length > 0 ? (
                    XSLData.marketingMaterial.map(item => (
                      <div className={MyStyles.YXCSCListItem} key={item.artId}>
                        <div className={MyStyles.YXCSCListItemLeft}>
                          <span
                            style={{
                              paddingTop: 5,
                              paddingBottom: 5,
                              paddingRight: 40
                            }}
                            className={MyStyles.YXCSCListItemLeftText}
                            onClick={() => {
                              window.open(`${item.artLink}`);
                            }}
                          >
                            {JSON.parse(item.artTitle).shareTitle || "--"}
                          </span>
                        </div>
                        <div className={MyStyles.YXCSCListItemRight}>
                          <span
                            style={{
                              float: "right",
                              paddingRight: 5
                            }}
                          >
                            更新时间：
                            {item.releaseTm
                              ? item.releaseTm.slice(0, 10)
                              : "--"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Empty
                      style={{ marginTop: 50 }}
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  )}
                </div>
              </div>
            ) : null}
            {/* <div className={MyStyles.L_C_bigCardR}>
            <div
              style={{
                //height: 92,
                height: '20%',
                width: '95%',
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                //background: "red"
              }}
            >
              <div className={MyStyles.L_C_Text1}>营销素材</div>
            </div>
            <div
              className={MyStyles.YXCSCListAll}
              style={{
                //height: 92,
                height: '80%',
                width: '93%',
                //flexDirection: "column",
                //display: "flex",
                //justifyContent: "center",
                alignItems: 'center',
                overflowY: 'auto',
                //background: "blue"
              }}
            >
              {
                XSLData.marketingMaterial && XSLData.marketingMaterial.length >
                0 ?
                  XSLData.marketingMaterial.map(item => (
                    <div
                      className={MyStyles.YXCSCListItem}
                      key={item.artId}>
                      <div
                        className={MyStyles.YXCSCListItemLeft}
                      >

                        <span
                          style={{paddingTop: 5, paddingBottom: 5,paddingRight:40}}
                          className={MyStyles.YXCSCListItemLeftText}
                          onClick={()=>{
                            window.open(`${item.artLink}`)
                          }}
                        >
                           {JSON.parse(item.artTitle).shareTitle || '--'}
                        </span>

                      </div>
                      <div
                        className={MyStyles.YXCSCListItemRight}
                      >
                        更新时间：{item.releaseTm
                        ? item.releaseTm.slice(0, 10)
                        : '--'}
                      </div>
                    </div>
                  ))
                  : <Empty
                    style={{marginTop: 50}}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
              }
            </div>
          </div> */}
          </div>
        </Spin>
      )}

      <Scrollbars
        autoHide
        className={styles.showCroll}
        style={{
          height: props.calendar
            ? props.height - 40 - 52 - 60 - 98
            : props.height - 40 - 52 - 98,
          marginBottom: 40
        }}
      >
        <div
          style={{ margin: "8px 8px", background: "#FFF", marginTop: "8px" }}
        >
          {/*老任务代办详情头部开始*/}
          <div
            style={{
              padding: nowCardState?.server === "营销线索" ? "" : "10px 8px",
              borderBottom: "1px solid #EAECF2",
              //height: "54px",
              //display: "flex",
              alignItems: "center"
            }}
          >
            {nowCardState?.server === "营销线索" && (
              <div className={MyStyles.XSCTableCheck}>
                <div
                  className={MyStyles.XSCTableCheck_L}
                  onClick={() => {
                    setQYState("1");
                  }}
                  style={{
                    fontWeight: QYState === "1" ? 500 : 400,
                    color: QYState === "1" ? "#244FFF" : "#61698C"
                  }}
                >
                  <span>
                    {XSLData.marketingObjective === "1"
                      ? "未开通"
                      : XSLData.marketingObjective === "2"
                      ? "未销售"
                      : XSLData.marketingObjective === "3"
                      ? "未签约"
                      : "未签约"}
                    ({QYTotal})
                  </span>

                  {QYState === "1" && (
                    <div className={MyStyles.XSCTableCheck_L_choise} />
                  )}
                </div>
                <div
                  className={MyStyles.XSCTableCheck_R}
                  onClick={() => {
                    setQYState("2");
                  }}
                  style={{
                    fontWeight: QYState === "2" ? 500 : 400,
                    color: QYState === "2" ? "#244FFF" : "#61698C"
                  }}
                >
                  <span>
                    {XSLData.marketingObjective === "1"
                      ? "已开通"
                      : XSLData.marketingObjective === "2"
                      ? "已销售"
                      : XSLData.marketingObjective === "3"
                      ? "已签约"
                      : "已签约"}
                    ({QYTotal2})
                  </span>

                  {QYState === "2" && (
                    <div className={MyStyles.XSCTableCheck_R_choise} />
                  )}
                </div>
              </div>
            )}

            {/* 这里暂时屏蔽，完成代码时恢复 */}
            {nowCardState?.server !== "营销线索" && (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      props.listData[
                        Number(props.activeList.replace(/[^0-9]/g, ""))
                      ]?.sbj || "-"
                  }}
                  title={
                    props.listData[
                      Number(props.activeList.replace(/[^0-9]/g, ""))
                    ]?.sbj || "-"
                  }
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    wordBreak: "break-all"
                  }}
                />
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      props.listData[
                        Number(props.activeList.replace(/[^0-9]/g, ""))
                      ]?.cntnt || "-"
                  }}
                  style={{ color: "#4B516A", wordBreak: "break-all" }}
                />
                {props.activeList.replace(/[0-9]/g, "") === "task" &&
                  props.listData[
                    Number(props.activeList.replace(/[^0-9]/g, ""))
                  ]?.strategy && (
                    <div>
                      策略：
                      {props.listData[
                        Number(props.activeList.replace(/[^0-9]/g, ""))
                      ]?.strategy || "-"}
                    </div>
                  )}
              </>
            )}
          </div>
          {/*老任务代办详情头部结束*/}

          {/*表格开始*/}
          {nowCardState?.server !== "营销线索" && (
            <div style={{ padding: "10px" }}>
              <div style={{ border: "1px solid #EAECF2" }}>
                <BasicDataTable
                  {...tableProps}
                  //bordered
                  specialTotal={eventType === "ecifEvent" ? "" : total}
                  specialPageSize={5}
                  rowKey={detailType === "task" ? "id" : "eventId"}
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  className={`${styles.table}`}
                  pagination={false}
                />
              </div>
            </div>
          )}
          {nowCardState?.server === "营销线索" && (
            <div
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 20,
                //height: "40vh",
                //overflowY: 'auto',
                paddingBottom: 40
              }}
            >
              <div
                style={{ border: "1px solid #EAECF2" }}
                className={MyStyles.modalTable}
              >
                <Table
                  //rowClassName={(_, index) => (index % 2 == 0 ? "even" :
                  // "odd")} //动态决定类名
                  scroll={{ x: "max-content", y: "20vh" }}
                  columns={QYColumns}
                  dataSource={QYData}
                  pagination={false}
                  loading={QYLoading}
                />
              </div>
              {nowCardState?.server === "营销线索" && (
                <div
                  style={{
                    //background:'red',
                    display: "flex",
                    height: 60,
                    alignItems: "center",
                    //flexDirection:'column-reverse',
                    justifyContent: "space-between"
                  }}
                >
                  <div></div>
                  <Pagination
                    size="small"
                    showLessItems
                    showQuickJumper
                    showSizeChanger
                    className={`${styles.pagination}`}
                    pageSizeOptions={["5", "10"]}
                    pageSize={QYpageSize}
                    current={QYcurrent}
                    total={QYState === "1" ? QYTotal : QYTotal2}
                    showTotal={() =>
                      `总共${QYState === "1" ? QYTotal : QYTotal2}条`
                    }
                    onChange={(current, pageSize) => {
                      setQYcurrent(current);
                      setQYpageSize(pageSize);
                    }}
                    onShowSizeChange={
                      (current, pageSize) => {
                        setQYcurrent(current);
                        setQYpageSize(pageSize);
                      }
                      //handlePageChange(1, pageSize)
                    }
                  />
                </div>
              )}
            </div>
          )}

          {/*表格结束*/}
        </div>
      </Scrollbars>
      {nowCardState?.server !== "营销线索" && (
        <div
          style={{
            width: `calc(100% - ${props.width}px - 1px)`,
            height: 40,
            background: "#FFF",
            borderTop: "1px solid #e8e8e8",
            position: "fixed",
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            zIndex: 99
          }}
        >
          <div
            onClick={download}
            className={styles.hover}
            style={{
              display: "flex",
              alignItems: "center",
              color: "#61698C",
              fontSize: 12,
              visibility: computed("lookAttac")
            }}
          >
            {/* <div>
              <img
                style={{ width: 14, height: 14 }}
                src={noticeIconEnclosure}
                alt=""
              />
            </div>
            <span>查看附件</span> */}
          </div>
          <Pagination
            size="small"
            showLessItems
            showQuickJumper
            showSizeChanger
            className={`${styles.pagination} ${styles.smallPagination} ${styles.paginationMr}`}
            pageSizeOptions={["20", "50", "100"]}
            pageSize={pageSize}
            current={current}
            total={total}
            showTotal={() => `总共${total}条`}
            onChange={handlePageChange}
            onShowSizeChange={(current, pageSize) =>
              handlePageChange(1, pageSize)
            }
          />
        </div>
      )}

      {/* <div style={{ paddingBottom: 22 }}>
        <span style={{ paddingRight: 10 }}>客户级别</span>
        <Select
          style={{ width: '20%', color: '#1A2243' }}
          value={custRank}
          onChange={(value) => { setCustRank(value); setCurrent(1); }}
        >
          <Select.Option key='0' value='0'>全部客户</Select.Option>
          <Select.Option key='1' value='1'>V1-V4</Select.Option>
          <Select.Option key='2' value='2'>V4</Select.Option>
          <Select.Option key='3' value='3'>V5-V7(金桂卡)</Select.Option>
        </Select>
        <span style={{ padding: '0 10px 0 20px' }}>{props.activeList.replace(/[0-9]/g, '') === 'task' ? '任务状态' : '排序规则'}</span>
        <Select
          style={{ width: '20%', color: '#1A2243' }}
          value={status}
          onChange={(value) => { setStatus(value); setCurrent(1); }}
        >
          <Select.Option key='0' value='0'>{detailType === 'task' ? '待服务' : '最近更新'}</Select.Option>
          <Select.Option key='1' value='1'>{detailType === 'task' ? '已服务' : '即将过期'}</Select.Option>
          { detailType === 'task' && <Select.Option key='2' value='2'>已忽略</Select.Option> }
        </Select>
        {
          props.calendar && detailType === 'event' ? (
          <>
            <span style={{ padding: '0 10px 0 20px' }}>事件状态</span>
            <Select
              style={{ width: '20%', color: '#1A2243' }}
              value={eventStatus}
              onChange={(value) => { setEventStatus(value); setCurrent(1); }}
            >
              <Select.Option key='1' value='1'>待服务</Select.Option>
              <Select.Option key='2' value='2'>已忽略</Select.Option>
              <Select.Option key='3' value='3'>已服务</Select.Option>
            </Select>
          </>
          ) : ''
        }
      </div> */}
      <Modal
        key={`log${custNo}`}
        visible={visible}
        title="跟进日志"
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
        className={styles.followLogModal}
      >
        <FollowLog
          handleOk={() => {
            setVisible(false);
          }}
          custNo={custNo}
          custId={custId}
        />
      </Modal>
      <Modal
        key={`relevanceEvent${eventRecord.eventId}`}
        visible={eventVisible}
        title={
          <div
            style={{
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              color: "#1A2243"
            }}
          >
            <span style={{ fontSize: 18, marginRight: 13 }}>客户关联事件</span>
            <span>{eventRecord.cusLvl}&nbsp; </span>
            <span
              className={styles.hover}
              onClick={() =>
                window.open(
                  `${window.location.href.substring(
                    0,
                    window.location.href.indexOf("#") + 1
                  )}/customerPanorama/customerInfo?customerCode=${
                    eventRecord.cusNo
                  }`
                )
              }
            >
              {eventRecord.cusNum}({eventRecord.cusNo})
            </span>
            <span
              style={{ display: "flex", alignItems: "center", marginLeft: 5 }}
            >
              <img src={arrow_right} alt="" />
            </span>
          </div>
        }
        footer={null}
        onCancel={() => {
          setEventVisible(false);
        }}
        width={
          document.body.clientWidth > 1300
            ? 1200
            : document.body.clientWidth - 100
        }
        bodyStyle={{ padding: 0 }}
        centered
      >
        <CustomerRelatedEvents
          handleOk={() => {
            setEventVisible(false);
          }}
          cusNo={eventRecord.cusNo}
        />
      </Modal>
      <Modal
        key={`ecfiEvent${eventRecord.motId}`}
        visible={ecifEventVisible}
        title={
          <div
            style={{
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              color: "#1A2243"
            }}
          >
            <span style={{ fontSize: 18, marginRight: 13 }}>客户关联事件</span>
            <span>{eventRecord.cusLvl}&nbsp; </span>
            <span
              className={styles.hover}
              onClick={() =>
                window.open(
                  `${window.location.href.substring(
                    0,
                    window.location.href.indexOf("#") + 1
                  )}/customerPanorama/customerInfo?customerCode=${
                    eventRecord.custCode
                  }`
                )
              }
            >
              {eventRecord.eventNum}({eventRecord.custCode})
            </span>
            <span
              style={{ display: "flex", alignItems: "center", marginLeft: 5 }}
            >
              <img src={arrow_right} alt="" />
            </span>
          </div>
        }
        footer={null}
        onCancel={() => {
          setEcifEventVisible(false);
        }}
        width={
          document.body.clientWidth > 1300
            ? 1200
            : document.body.clientWidth - 100
        }
        bodyStyle={{ padding: 0 }}
        centered
      >
        <EcifRelatedEvents
          ecifEventType={ecifEventType}
          custCode={eventRecord.custCode}
          motId={eventRecord.motId}
        />
      </Modal>

      <Modal
        visible={ignoreModal}
        title="温馨提示"
        footer={null}
        onCancel={() => {
          setIgnoreModal(false);
        }}
      >
        <p style={{ marginBottom: 24 }}>
          忽略之后，将不再在待办中提示，可以在【工作】-【日历模式】查询历史，确定忽略选中的客户吗？
        </p>
        <div style={{ textAlign: "right" }}>
          <Spin spinning={loading}>
            <Button
              className="m-btn-radius ax-btn-small"
              onClick={() => {
                setIgnoreModal(false);
              }}
            >
              取消
            </Button>
            <Button
              className="m-btn-radius ax-btn-small m-btn-blue"
              onClick={handleIgnore}
            >
              确定
            </Button>
          </Spin>
        </div>
      </Modal>
      <Modal
        visible={potentialCustModal}
        title="温馨提示"
        footer={null}
        onCancel={() => {
          setPotentialCustModal(false);
          setPotentialCustModalID({});
        }}
      >
        <p style={{ marginBottom: 24 }}>确定处理选中的客户吗？</p>
        <div style={{ textAlign: "right" }}>
          <Spin spinning={loading}>
            <Button
              className="m-btn-radius ax-btn-small"
              onClick={() => {
                setPotentialCustModal(false);
                setPotentialCustModalID({});
              }}
            >
              取消
            </Button>
            <Button
              className="m-btn-radius ax-btn-small m-btn-blue"
              onClick={() => {
                SaveCompleteUserTaskCust({
                  custId: potentialCustModalID.id.toString(),
                  custRank: 0,
                  st: 0,
                  taskId: potentialCustModalID.taskId
                })
                  .then(res => {})
                  .catch(error => {
                    message.error(error.note || error.success);
                  })
                  .finally(() => {
                    getData();
                    setPotentialCustModal(false);
                    setPotentialCustModalID({});
                    updateSide();
                  });
              }}
            >
              确定
            </Button>
          </Spin>
        </div>
      </Modal>

      <Modal
        visible={potentialCustModalAll}
        title="温馨提示"
        footer={null}
        onCancel={() => {
          setPotentialCustModalAll(false);
          //setPotentialCustModalID({})
        }}
      >
        <p style={{ marginBottom: 24 }}>确定处理选中的客户吗？</p>
        <div style={{ textAlign: "right" }}>
          <Spin spinning={loading}>
            <Button
              className="m-btn-radius ax-btn-small"
              onClick={() => {
                setPotentialCustModalAll(false);
                //setPotentialCustModalID({})
              }}
            >
              取消
            </Button>
            <Button
              className="m-btn-radius ax-btn-small m-btn-blue"
              onClick={() => {
                const taskId = Number(
                  props.listData[
                    Number(props.activeList?.replace(/[^0-9]/g, ""))
                  ]?.id
                );
                const params = {
                  taskId,
                  st: selectAll ? 1 : 0,
                  custId: selectedRows.map(item => item.id).join(","),
                  custRank: Number(custRank)
                };
                SaveCompleteUserTaskCust(params)
                  .then(res => {
                    window.parent.postMessage({ action: "queryBacklog" }, "*");
                    message.success(response.note || "操作成功");
                  })
                  .finally(() => {
                    getData();
                    setPotentialCustModalAll(false);
                    props.queryCalContent();
                    setSelectAll(false);
                    setSelectedRowKeys([]);
                    setSelectedRows([]);
                    setCurrent(1);
                    updateSide();
                  });
              }}
            >
              确定
            </Button>
          </Spin>
        </div>
      </Modal>
      <Modal
        className={styles.modal}
        visible={handleWidthTaskVisible}
        footer={null}
        onCancel={() => {
          setHandleWidthTaskVisible(false);
        }}
        width="80%"
      >
        <C4Iframe src={c4Url} />
        {/* <iframe id='c4Iframe' src={c4Url} title='c4' width='100%' height='700px' /> */}
      </Modal>
      <Modal
        className={styles.eventModal}
        visible={listVisible}
        footer={null}
        title="批量处理"
        onCancel={() => {
          setListVisible(false);
          setSingeDeal(false);
        }}
        width="614px"
        destroyOnClose
        maskClosable={false}
      >
        <div className={styles.form}>
          {eventList?.formTitleList?.map(item => {
            if (item.type === "1") {
              if (item?.radioList?.length === 2) {
                return (
                  <div className={styles.formItem} key={item.titleId}>
                    <div className={styles.label}>{item.titleName}</div>
                    <div className={styles.item}>
                      {item?.radioList?.map(item1 => (
                        <Checkbox
                          style={{ marginRight: 16 }}
                          value={item1.radioId}
                          checked={item1.radioId === listValue[item.titleId]}
                          onClick={() => {
                            setListValue({
                              ...listValue,
                              [item.titleId]: item1.radioId
                            });
                          }}
                        >
                          {item1.radioName}
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className={styles.formItem} key={item.titleId}>
                    <div className={styles.label}>{item.titleName}</div>
                    <div className={styles.item}>
                      <Select
                        style={{ width: 320 }}
                        value={listValue[item.titleId]}
                        onChange={value => {
                          setListValue({ ...listValue, [item.titleId]: value });
                        }}
                      >
                        {item?.radioList?.map(item1 => {
                          return (
                            <Select.Option
                              key={item1.radioId}
                              title={item1.raiodName}
                              value={item1.radioId}
                            >
                              {item1.radioName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                );
              }
            }
            // else if(item.type === '2'){
            //   return (
            //     <div className={styles.formItem} key={item.titleId}>
            //       <div className={styles.label}>{item.titleName}</div>
            //       <div className={styles.item}><Select style={{ width: 320 }}>
            //         {/* <Select.Option key='1'>1</Select.Option>
            //         <Select.Option key='2'>2</Select.Option>
            //         <Select.Option key='3'>3</Select.Option> */}
            //       </Select></div>
            //     </div>
            //   );
            // }
            else if (item.type === "3") {
              return (
                <div className={styles.TextArea} key={item.titleId}>
                  <div className={styles.label}>{item.titleName}</div>
                  <div className={styles.item}>
                    <TextArea
                      style={{ width: 350, resize: "vertical" }}
                      maxLength={150}
                      autoSize={{ minRows: 3, maxRows: 10 }}
                      value={listValue[item.titleId]}
                      onChange={e => {
                        setListValue({
                          ...listValue,
                          [item.titleId]: e.target.value
                        });
                      }}
                    />
                  </div>
                </div>
              );
            } else if (item.type === "4") {
              return (
                <div className={styles.formItem} key={item.titleId}>
                  <div className={styles.label}>{item.titleName}</div>
                  <div className={styles.item}>
                    <TextArea
                      style={{ width: 350 }}
                      maxLength={150}
                      autoSize={{ minRows: 1, maxRows: 1 }}
                      value={listValue[item.titleId]}
                      onChange={e => {
                        setListValue({
                          ...listValue,
                          [item.titleId]: e.target.value
                        });
                      }}
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className={styles.submit}>
          <Button
            className="m-btn ant-btn mr20"
            style={{
              width: 70,
              height: "42px",
              borderRadius: "1px",
              fontSize: 14
            }}
            onClick={() => {
              setListVisible(false);
              setSingeDeal(false);
            }}
          >
            取消
          </Button>
          <Button
            htmlType="submit"
            className="m-btn ant-btn m-btn-blue"
            style={{
              width: 70,
              height: "42px",
              borderRadius: "1px",
              fontSize: 14
            }}
            onClick={() => {
              if (!modalLoading) recorderEventContext();
            }}
          >
            确定
          </Button>
        </div>
      </Modal>
      <Modal
        className={styles.msgModal}
        visible={sendMsgVisible}
        destroyOnClose
        maskClosable={false}
        footer={
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}></div>
            <div className={styles.msgCheck}>
              <Checkbox
                checked={timing}
                onChange={e => setTiming(e.target.checked)}
              >
                定时发送
              </Checkbox>
            </div>
            {timing && (
              <div
                onClick={e => {
                  if (!dateOpen) {
                    setDateOpen(!dateOpen);
                  }
                  e.stopPropagation();
                }}
                id="rangePicker"
                style={{ position: "relative" }}
              >
                {/* <div className={styles.timeInput} style={{ borderColor: dateOpen ? '#244FFF' : '#D1D5E6' }}>{moment(msgDate).format('YYYY-MM-DD')}</div> */}
                <DatePicker
                  allowClear={false}
                  open={true}
                  style={{ width: "250px" }}
                  popupStyle={{
                    display: dateOpen ? "block" : "none",
                    zIndex: dateOpen ? 9 : -1
                  }}
                  className={styles.rangePicker}
                  dropdownClassName={`${styles.calendar} m-bss-range-picker`}
                  placeholder="请选择"
                  format="YYYY-MM-DD"
                  getCalendarContainer={trigger => trigger.parentNode}
                  onChange={msgDate => {
                    setMsgDate(msgDate);
                  }}
                  showToday={false}
                />
                {dateOpen && (
                  <div className={styles.calendarBox}>
                    <div
                      style={{
                        height: 41,
                        borderBottom: "1px solid #EAEEF2",
                        borderLeft: "1px solid #EAEEF2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >{`${moment(msgDate).format(
                      "YYYY-MM-DD"
                    )} ${timeHValue}:${timeMValue}`}</div>
                    <div style={{ display: "flex", height: 256 }}>
                      <div
                        style={{
                          overflow: "auto",
                          flex: 1,
                          borderLeft: "1px solid #EAEEF2"
                        }}
                      >
                        <Scrollbars autoHide height="256">
                          {timeH().map(item => (
                            <div
                              className={styles.timeItem}
                              key={item}
                              onClick={() => {
                                setTimeHValue(item);
                              }}
                              style={{
                                background: timeHValue === item ? "#F0F1F5" : ""
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </Scrollbars>
                      </div>
                      <div
                        style={{
                          overflow: "auto",
                          flex: 1,
                          borderLeft: "1px solid #EAEEF2"
                        }}
                      >
                        <Scrollbars autoHide height="256">
                          {timeM().map(item => (
                            <div
                              className={styles.timeItem}
                              key={item}
                              onClick={() => {
                                setTimeMValue(item);
                              }}
                              style={{
                                background: timeMValue === item ? "#F0F1F5" : ""
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </Scrollbars>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              className={styles.sendBtn}
              style={{
                border: "1px solid #D1D5E6",
                padding: "5px 16px",
                marginRight: 8,
                cursor: "pointer",
                color: "#61698C",
                marginLeft: 8
              }}
              onClick={() => {
                setSendMsgVisible(false);
                setSingeDeal(false);
              }}
            >
              关闭
            </div>
            <div
              className={styles.sendBtn}
              style={{
                border: "1px solid #D1D5E6",
                padding: "5px 16px",
                marginRight: 8,
                cursor: "pointer",
                color: "#61698C"
              }}
              onClick={() => {
                if (!modalLoading) sendMessage(true);
              }}
            >
              测试发送给自己
            </div>
            <div
              style={{
                border: "1px solid #244FFF",
                padding: "5px 16px",
                background: "#244FFF",
                color: "#FFF",
                cursor: "pointer"
              }}
              onClick={() => {
                if (!modalLoading) sendMessage();
              }}
            >
              发送
            </div>
          </div>
        }
        title="发送短信"
        onCancel={() => {
          setSendMsgVisible(false);
          setSingeDeal(false);
        }}
        width="960px"
      >
        <div style={{ display: "flex", background: "#F2F3F7", padding: 16 }}>
          <div
            style={{
              padding: 16,
              marginRight: 16,
              background: "#FFF",
              width: 305
            }}
          >
            <div style={{ color: "#1A2243", fontSize: 16, marginBottom: 13 }}>
              客户名单
            </div>
            <Table
              columns={msgCustCol}
              dataSource={staffList}
              size="middle"
              bordered
              rowKey="objectId"
              loading={staffListLoading}
              pagination={{
                pageSize: 5,
                current: staffListCurrent,
                total: staffListTotal,
                onChange: (current, pageSize) => {
                  setStaffListCurrent(current);
                }
              }}
            ></Table>
          </div>
          <div
            style={{
              padding: 16,
              marginRight: 16,
              background: "#FFF",
              flex: 1
            }}
          >
            <div style={{ color: "#1A2243", fontSize: 16, marginBottom: 13 }}>
              短信内容
            </div>
            <div className={styles.form}>
              <div className={styles.formItem} style={{ marginBottom: 17 }}>
                <div className={styles.label}>使用链接模板</div>
                <div style={{ color: "#244FFF" }}>
                  <Switch
                    onChange={() => {
                      setSwitchKey(!switchKey);
                    }}
                    checked={switchKey}
                    style={{ marginRight: 8, marginTop: -2 }}
                  />
                  {switchKey && (
                    <span
                      onClick={() => {
                        window.open(msgLink);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      预览链接
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.TextArea} style={{ marginBottom: 17 }}>
                <div className={styles.label}>正文</div>
                <div className={styles.item} style={{ position: "relative" }}>
                  <TextArea
                    style={{ width: 466, resize: "vertical" }}
                    autoSize={{ minRows: 6, maxRows: 10 }}
                    onChange={e => {
                      setMsgContent(e.target.value);
                    }}
                    value={msgContent}
                    maxLength={150}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 7,
                      fontSize: 12,
                      color: "#959CBA"
                    }}
                  >
                    {msgContent.length}/已输入
                  </div>
                </div>
              </div>
              <div
                style={{
                  border: "1px solid #99CEFF",
                  background: "#EBF5FF",
                  borderRadius: 2,
                  padding: 16,
                  color: "#1A2243",
                  marginLeft: 95
                }}
              >
                <div
                  style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}
                >
                  <img
                    src={tipsImg}
                    alt=""
                    style={{ width: 22, marginRight: 8, marginTop: -3 }}
                  ></img>
                  提示信息
                </div>
                <div style={{ marginLeft: 30 }}>
                  <p>
                    本月发送短信限制
                    <span style={{ color: "#58AFFF" }}>
                      {messageQuota.bype}
                    </span>
                    条， 还可发送
                    <span style={{ color: "#58AFFF" }}>
                      {messageQuota.bycxsype}
                    </span>
                    条
                  </p>
                  <p>
                    每次最多
                    <span style={{ color: "#58AFFF" }}>
                      {messageQuota.mcsl}
                    </span>
                    条， 最大允许字数：150字
                  </p>
                  <p>{"如使用模板，模板中的$V{KHXM}会自动替换为客户姓名"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Spin>
  );
}

export default connect(({ global }) => ({
  authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam
  // theme: global.theme,
}))(DataTable);
