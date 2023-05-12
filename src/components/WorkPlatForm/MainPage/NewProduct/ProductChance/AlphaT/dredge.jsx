import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "umi";
import { Button, Popover, Input, DatePicker } from "antd";
import RadioSuper from "./RadioSuper";
import RadioSuperMul from "./RadioSuperMul";
import EselectCheck from "./EselectCheck";
import Tabletn from "./Tabletn";
import IconSure from "$assets/newProduct/staff/questionMark.png";
import BasicDataTable from "$common/BasicDataTable";
import ModalInTable from "./modal";
import styles from "./calendar.less";
import { GetQueryAlphaCusList } from "$services/productChance";
import moment from "moment";
import { useRef } from "react";

export default function UnDredge() {
  const [range, setRange] = useState("1");
  const [icClick, setIsClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adaptations, setAdaptations] = useState(["0"]);
  const [isLeave, setIsLeave] = useState([]);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0); //结果展示区域数据条数
  const [pageSize, setPageSize] = useState(10); //分页页面数量
  const [current, setCurrent] = useState(1); //分页页码
  const [selectAll, setSelectAll] = useState(false); //是否全选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //选中行的key值
  const [selectedRows, setSelectedRows] = useState([]); //选中行数据
  // const [amount, setAmount] = useState('')
  const [timer, setTimer] = useState("");
  const [rjDate, setRjDate] = useState([]);
  const [md5, setMd5] = useState("");
  const [assets, setAssets] = useState(["0"]);
  const [modalData, setModalData] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [state, setState] = useState({
    range: [
      { id: "1", name: "直属" },
      { id: "2", name: "所辖" },
      { id: "3", name: "所有" },
    ],
    adaptations: [
      { id: "0", name: "全部" },
      { id: "1", name: "0-2" },
      { id: "2", name: "3-7" },
      { id: "3", name: "8及以上" },
    ],
    // amount: [{ id: '', name: '全部' }, { id: '1', name: '正常' }, { id: '2', name: '0或负值' },],
    timer: [
      { id: "", name: "全部" },
      { id: "5", name: "7日内" },
      { id: "999", name: "自定义" },
    ],
    assets: [
      { id: "0", name: "全部" },
      { id: "1", name: "小于50万" },
      { id: "2", name: "50万（含）-100万" },
      { id: "3", name: "100万（含）-300万" },
      { id: "4", name: "300万及以上" },
    ],
    leavels: [
      { name: "V1", value: "V1", key: "V1" },
      { name: "V2", value: "V2", key: "V2" },
      { name: "V3", value: "V3", key: "V3" },
      { name: "V4", value: "V4", key: "V4" },
      { name: "V5", value: "V5", key: "V5" },
      { name: "V6", value: "V6", key: "V6" },
      { name: "V7", value: "V7", key: "V7" },
    ],
  });
  const [cusKeyWord, setCusKeyWord] = useState("");
  const modalRef = useRef();
  const handleClick = (id, type) => {
    if (type == "customerRange") {
      setRange(id);
    } else if (type == "timer") {
      setTimer(id);
    } else if (type == "adaptations") {
      let old = adaptations;
      if (id !== "0") {
        if (old.includes("0")) {
          old.splice(old.indexOf("0"), 1);
        }
        if (old.includes(id) && old.length > 1) {
          old.splice(old.indexOf(id), 1);
        } else {
          old.push(id);
        }
      } else {
        old = [];
        old.push("0");
      }
      let setData = Array.from(
        new Set(old.map(item => JSON.stringify(item)))
      ).map(i => JSON.parse(i));
      setAdaptations(setData);
    } else if (type == "assets") {
      let old = assets;
      if (id !== "0") {
        if (old.includes("0")) {
          old.splice(old.indexOf("0"), 1);
        }
        if (old.includes(id) && old.length > 1) {
          old.splice(old.indexOf(id), 1);
        } else {
          old.push(id);
        }
      } else {
        old = [];
        old.push("0");
      }
      let setData = Array.from(
        new Set(old.map(item => JSON.stringify(item)))
      ).map(i => JSON.parse(i));
      setAssets(setData);
    } // else if (type == 'amount') {
    // setAmount(id)
    // }
  };

  useEffect(() => {
    let a = listData.map((item, index) => {
      return { ...item, key: (current - 1) * pageSize + index + 1 };
    });
  }, []);

  const leaveChange = e => {
    setIsLeave(e);
  };
  //客户搜索框
  const customerValue = e => {
    setCusKeyWord(e.target.value);
  };

  //查询数据方法
  const getCloumn = (page, pageSize) => {
    setLoading(true);
    GetQueryAlphaCusList({
      option: 1,
      cusRange: range,
      cusLevel: isLeave ? isLeave.join(",") : "",
      lastTradingDate: timer === "999" ? "" : timer,
      adaptStockNum: adaptations.includes("0") ? "" : adaptations.join(""),
      asset: assets.includes("0") ? "" : assets.join(""),
      startTradeDate:
        timer === "999" ? (rjDate[0] ? rjDate[0].format("YYYYMMDD") : "") : "",
      endTradeDate:
        timer === "999" ? (rjDate[1] ? rjDate[1].format("YYYYMMDD") : "") : "",
      current: page,
      pageSize: pageSize,
      paging: 1,
      cusKeyWord: cusKeyWord,
    }).then(res => {
      setListData(res.records);
      setModalData(res.lastTradingDate);
      setLoading(false);
      setTotal(res.total);
      setMd5(res.note);
    });
  };

  const getColumns = () => {
    return [
      {
        title: "客户姓名",
        dataIndex: "cusName",
        key: "客户姓名",
        render: (text, record) => (
          <Link
            to={`/customerPanorama/customerInfo?customerCode=${record.cusNo}`}
            target="_blank"
          >
            {text}
          </Link>
        ),
      },
      {
        title: "客户号",
        dataIndex: "cusNo",
        key: "客户号",
      },
      {
        title: "客户级别",
        dataIndex: "cusLevel",
        key: "客户级别",
      },
      {
        title: "开户营业部",
        dataIndex: "department",
        key: "开户营业部",
      },
      {
        title: "手机号",
        dataIndex: "phone",
        key: "手机号",
      },
      {
        title: "当前总资产",
        dataIndex: "asset",
        key: "当前总资产",
      },
      {
        title: "资金余额",
        dataIndex: "fundBalance",
        key: "资金余额",
      },
      {
        title: "T0最近交易时间",
        dataIndex: "lastTradeDate",
        key: "T0最近交易时间",
      },
      {
        title: "近20交易日交易量",
        dataIndex: "transactionVolume",
        key: "近20交易日交易量",
      },
      {
        title: "T0本年净佣金",
        dataIndex: "commission",
        key: "T0本年净佣金",
      },
      {
        title: "T0适配股票市值",
        dataIndex: "stockValue",
        key: "T0适配股票市值",
      },
      {
        title: "T0股票适配度",
        dataIndex: "netAssets",
        key: "T0股票适配度",
        filterDropdown: <div></div>,
        //getPopupContainer={() => document.getElementById('isWantUp')}
        filterIcon: (
          <Popover
            placement="bottomLeft"
            overlayClassName="isTitlePover"
            content={
              <span style={{ whiteSpace: "pre-wrap" }}>
                说明推荐指标：优秀（近一个月回测收益超千1）；良好（近一个月回测收益在千1与万5之间）；中等（近一个月回测收益在万5与万2之间）；一般（近一个月回测收益小于万2）
              </span>
            }
            trigger="hover"
          >
            <span
              style={{
                position: "relative",
                background: "transparent",
                display: "inline-block",
                width: "16px",
                height: "16px",
                left: "-10px",
                top: "-2px",
                margin: "0 4px",
              }}
            >
              <img
                className="iconSure"
                src={IconSure}
                alt=""
                style={{
                  width: "16px",
                  height: "16px",
                  position: "absolute",
                  left: "10px",
                  top: "3px",
                }}
              />
            </span>
          </Popover>
        ),
        render: (text, record) => (
          <span
            style={{ color: "#244fff" }}
            onClick={() => {
              modalRef.current.open(record.cusNo, modalData);
            }}
          >
            详情
          </span>
        ),
      },
      {
        title: "T0本年净收益",
        dataIndex: "thisYearIncome",
        key: "T0本年净收益",
        filterDropdown: <div></div>,
        filterIcon: (
          <Popover
            placement="bottomLeft"
            overlayClassName="isTitlePover"
            content={
              <span style={{ whiteSpace: "pre-wrap" }}>
                客户使用AlphaT的扣税费后累计收益
              </span>
            }
            trigger="hover"
          >
            <span
              style={{
                position: "relative",
                background: "transparent",
                display: "inline-block",
                width: "16px",
                height: "16px",
                left: "-10px",
                top: "-2px",
                margin: "0 4px",
              }}
            >
              <img
                className="iconSure"
                src={IconSure}
                alt=""
                style={{
                  width: "16px",
                  height: "16px",
                  position: "absolute",
                  left: "10px",
                  top: "3px",
                }}
              />
            </span>
          </Popover>
        ),
      },
      {
        title: "开发关系",
        dataIndex: "devRela",
        key: "开发关系",
      },
      {
        title: "服务关系",
        dataIndex: "serviceRela",
        key: "服务关系",
      },
    ];
  };

  const tableProps = {
    bordered: true,
    scroll: { x: true },
    rowKey: "key",
    dataSource: listData.map((item, index) => {
      return { ...item, key: (current - 1) * pageSize + index + 1 };
    }),
    columns: getColumns(),
    className: "m-Card-Table",
    pagination: {
      className: "m-bss-paging",
      showTotal: totals => {
        return `总共${totals}条`;
      },
      showLessItems: true,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      total,
      current,
      pageSize,
      onChange: (current, pageSize) => {
        setCurrent(current);
        setPageSize(pageSize);
        getCloumn(current, pageSize);
      },
      onShowSizeChange: (current, pageSize) => {
        (() => {
          setCurrent(current);
          setPageSize(pageSize), getCloumn(current, pageSize);
        })();
      },
    },
    rowSelection: {
      type: "checkbox",
      crossPageSelect: true, // checkbox默认开启跨页全选
      selectAll: selectAll,
      selectedRowKeys: selectedRowKeys,
      onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
        if (currentSelectedRowKeys.length === total) {
          currentSelectAll = true;
          currentSelectedRowKeys = [];
          selectedRows = [];
        }
        setSelectAll(currentSelectAll);
        setSelectedRowKeys(currentSelectedRowKeys);
        setSelectedRows(selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.status === 0, // Column configuration not to be checked
        name: record.status,
      }),
      fixed: true,
    },
    // onChange: this.handleTableChange,
  };

  const resetInput = () => {
    setIsClick(false);
  };
  const handleSearch = () => {
    setSelectAll(false);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setIsSearch(true);
    setLoading(true);
    GetQueryAlphaCusList({
      option: 1,
      cusRange: range,
      cusLevel: isLeave ? isLeave.join(",") : "",
      lastTradingDate: timer === "999" ? "" : timer,
      // netProfit:amount,
      adaptStockNum: adaptations.includes("0") ? "" : adaptations.join(""),
      asset: assets.includes("0") ? "" : assets.join(""),
      startTradeDate:
        timer === "999" ? (rjDate[0] ? rjDate[0].format("YYYYMMDD") : "") : "",
      endTradeDate:
        timer === "999" ? (rjDate[1] ? rjDate[1].format("YYYYMMDD") : "") : "",
      current: current,
      pageSize: pageSize,
      paging: 1,
      cusKeyWord: cusKeyWord,
    }).then(res => {
      setListData(res.records);
      setModalData(res.lastTradingDate);
      setLoading(false);
      setTotal(res.total);
      setMd5(res.note);
    });
  };
  const reset = () => {
    setRange("1");
    setTimer("");
    // setAmount('')
    setAdaptations(["0"]);
    setAssets(["0"]);
    setCusKeyWord("");
    setRjDate([]);
    setIsLeave([]);
  };


  const getParam = () => {
    return {
      option: 1,
      cusRange: range,
      cusLevel: isLeave ? isLeave.join(",") : "",
      lastTradingDate: timer === "999" ? "" : timer,
      // netProfit:amount,
      adaptStockNum: adaptations.includes("0") ? "" : adaptations.join(""),
      asset: assets.includes("0") ? "" : assets.join(""),
      startTradeDate:
        timer === "999" ? (rjDate[0] ? rjDate[0].format("YYYYMMDD") : "") : "",
      endTradeDate:
        timer === "999" ? (rjDate[1] ? rjDate[1].format("YYYYMMDD") : "") : "",
      current: current,
      pageSize: pageSize,
      paging: 0,
      cusKeyWord: cusKeyWord,
    };
  };
  const btnProps = {
    type: 11,
    total,
    getColumns: getColumns,
    param: getParam(),
    selectAll: selectAll,
    selectedRows: selectedRows,
    md5: md5,
  };
  return (
    <div>
      <div className="page-center">
        <div className="selectAreaInAt">
          <span className="font-at">客户范围</span>
          <RadioSuper
            type="customerRange"
            handleClick={handleClick}
            select={range}
            valueInName={state.range}
          />
        </div>
        <div className="selectAreaInAt">
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户级别
          </span>
          <EselectCheck
            dataList={state.leavels}
            onChange={leaveChange}
            options={{ mode: "multiple", value: isLeave }}
          />
        </div>
        <div className="selectAreaInAt">
          <span
            style={{ marginRight: "8px", color: "#1A2243", fontWeight: "500" }}
          >
            客户
          </span>

          <Input
            className="anInput"
            placeholder="客户号/客户姓名/手机号"
            style={{
              width: "250px",
              height: "32px",
              lineHeight: "32px",
              borderRadius: "2px",
            }}
            value={cusKeyWord}
            onChange={customerValue}
            allowClear
          />
        </div>
        <div className="selectAreaInAt">
          <span className="font-at">T0最近交易时间</span>
          <RadioSuper
            type="timer"
            handleClick={handleClick}
            select={timer}
            valueInName={state.timer}
          />
          {timer === "999" && (
            <DatePicker.RangePicker
              allowClear={true}
              value={rjDate}
              className={styles.rangePicker}
              dropdownClassName={`${styles.calendar} m-bss-range-picker`}
              style={{ width: "264px" }}
              placeholder={["请选择", "请选择"]}
              format="YYYY-MM-DD"
              separator="至"
              disabledDate={current =>
                current && current > moment().endOf("day")
              }
              onChange={rjDate => {
                setRjDate(rjDate);
              }}
            />
          )}
        </div>
        {/* <div className='selectAreaInAt'>
                    <span className='font-at'>T0累计净收益率</span>
                    <Popover placement="bottomLeft" getPopupContainer={() => document.getElementById('isWantAtTimer')} overlayClassName='isShowPover' content={<span>客户使用T0的扣税费后累计收益除以客户授权T0的市值</span>} trigger="hover">
                        <span id='isWantAtTimer' style={{ position: 'relative', display: 'inline-block', width: '16px', left: '-12px', margin: '0 4px' }}><img className='iconSure' src={IconSure} alt='' /></span>
                    </Popover>
                    <RadioSuper type='amount' handleClick={handleClick} select={amount} valueInName={state.amount} />
                </div> */}
        <div className="selectAreaInAt">
          <span className="font-at">T0适配股票数</span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() =>
              document.getElementById("isWantAtLantNumHav")
            }
            overlayClassName="isShowPover overInBase"
            content={<span>持仓股票</span>}
            trigger="hover"
          >
            <span
              id="isWantAtLantNumHav"
              style={{
                position: "relative",
                display: "inline-block",
                width: "16px",
                left: "-12px",
                margin: "0 4px",
              }}
            >
              <img className="iconSure" src={IconSure} alt="" />
            </span>
          </Popover>
          <RadioSuperMul
            type="adaptations"
            handleClick={handleClick}
            select={adaptations}
            valueInName={state.adaptations}
          />
        </div>
        <div className="selectAreaInAt">
          <span className="font-at">当前总资产</span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("isWantAtLantup")}
            overlayClassName="isShowPover"
            content={
              <span>
                客户开通要求：T-1日总资产大于50万且适当性要求为中高风险以上
              </span>
            }
            trigger="hover"
          >
            <span
              id="isWantAtLantup"
              style={{
                position: "relative",
                display: "inline-block",
                width: "16px",
                left: "-12px",
                margin: "0 4px",
              }}
            >
              <img className="iconSure" src={IconSure} alt="" />
            </span>
          </Popover>
          <RadioSuperMul
            type="assets"
            handleClick={handleClick}
            select={assets}
            valueInName={state.assets}
          />
        </div>
        <div className="selectAreaInAt">
          <Button className="antBtn" onClick={reset}>
            重置
          </Button>
          <Button className="antBtnBlue" onClick={handleSearch}>
            查询
          </Button>
        </div>
      </div>
      {/* <div style={{height:'200px',width:'100%'}}></div> */}
      {isSearch ? (
        <>
          <div style={{ marginBottom: "24px" }}>
            <Tabletn {...btnProps} />
          </div>
          <BasicDataTable
            {...tableProps}
            style={{ padding: "0 24px" }}
            loading={loading}
          />
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "233px",
            background: "rgb(243, 244, 247)",
          }}
        ></div>
      )}
      <ModalInTable ref={modalRef} />
    </div>
  );
}
