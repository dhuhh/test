import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "umi";
import { Button, Popover, Input } from "antd";
import RadioSuper from "./RadioSuper";
import RadioSuperMul from "./RadioSuperMul";
import NewTreeSelect from "../Common/NewTreeSelect";
import EselectCheck from "./EselectCheck";
import Tabletn from "./Tabletn";
import IconSure from "$assets/newProduct/staff/questionMark.png";
import BasicDataTable from "$common/BasicDataTable";
import ModalInTable from "./modal";
import { GetQueryAlphaCusList } from "$services/productChance";
import { useRef } from "react";

export default function UnDredge() {
  const [range, setRange] = useState("1");
  const [icClick, setIsClick] = useState(false);
  const [isOpenT0, setIsOpenT0] = useState("");
  const [isLeave, setIsLeave] = useState([]);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0); //结果展示区域数据条数
  const [pageSize, setPageSize] = useState(10); //分页页面数量
  const [current, setCurrent] = useState(1); //分页页码
  const [latent, setLatent] = useState("");
  const [loading, setLoading] = useState(false);
  const [adaptations, setAdaptations] = useState(["0"]);
  const [assets, setAssets] = useState(["0"]);
  const [modalData, setModalData] = useState("");
  const [selectAll, setSelectAll] = useState(false); //是否全选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); //选中行的key值
  const [selectedRows, setSelectedRows] = useState([]); //选中行数据
  const [isSearch, setIsSearch] = useState(false);
  const [md5, setMd5] = useState("");
  const [state, setState] = useState({
    range: [
      { id: "1", name: "直属" },
      { id: "2", name: "所辖" },
      { id: "3", name: "所有" },
    ],
    isOpenT0: [
      { id: "", name: "全部" },
      { id: "0", name: "未开通" },
      { id: "1", name: "已开通" },
    ],
    latent: [
      { id: "", name: "全部" },
      { id: "1", name: "是" },
      { id: "0", name: "否" },
    ],
    adaptations: [
      { id: "0", name: "全部" },
      { id: "1", name: "0-2" },
      { id: "2", name: "3-7" },
      { id: "3", name: "8及以上" },
    ],
    assets: [
      { id: "0", name: "全部" },
      { id: "1", name: "小于50万" },
      { id: "2", name: "50万（含）-100万" },
      { id: "3", name: "100万（含）-300万" },
      { id: "4", name: "300万及以上" },
    ],
    leavel: [
      { name: "V1", value: "V1", key: "V1" },
      { name: "V2", value: "V2", key: "V2" },
      { name: "V3", value: "V3", key: "V3" },
      { name: "V4", value: "V4", key: "V4" },
      { name: "V5", value: "V5", key: "V5" },
      { name: "V6", value: "V6", key: "V6" },
      { name: "V7", value: "V7", key: "V7" },
    ],
  });
  const [cusKeyWord, setCusKeyWord] = useState(""); // 客户搜索
  const modalRef = useRef();
  const handleClick = (id, type) => {
    if (type == "customerRange") {
      setRange(id);
    } else if (type == "T0IsOpen") {
      setIsOpenT0(id);
    } else if (type == "latent") {
      setLatent(id);
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
    }
  };

  useEffect(() => {
    let a = listData.map((item, index) => {
      return {
        ...item,
        key: (current - 1) * pageSize + index + 1,
      };
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
      option: 0,
      cusRange: range,
      cusLevel: isLeave ? isLeave.join(",") : "",
      isOpen: isOpenT0,
      isPotentialCus: latent,
      adaptStockNum: adaptations.includes("0") ? "" : adaptations.join(""),
      asset: assets.includes("0") ? "" : assets.join(""),
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
        title: "近一年股基周转率",
        dataIndex: "stockTurnover",
        key: "近一年股基周转率",
      },
      {
        title: "近一年贡献",
        dataIndex: "contribution",
        key: "近一年贡献",
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
              <span
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
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
      return {
        ...item,
        key: (current - 1) * pageSize + index + 1,
      };
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
      option: 0,
      cusRange: range,
      cusLevel: isLeave ? isLeave.join(",") : "",
      isOpen: isOpenT0,
      isPotentialCus: latent,
      adaptStockNum: adaptations.includes("0") ? "" : adaptations.join(""),
      asset: assets.includes("0") ? "" : assets.join(""),
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
    setIsOpenT0("");
    setIsLeave([]);
    setLatent("");
    setAdaptations(["0"]);
    setAssets(["0"]);
    setCusKeyWord("");
  };
  const getParam = () => {
    return {
      option: 0,
      cusRange: range,
      cusLevel: isLeave ? isLeave.join(",") : "",
      isOpen: isOpenT0,
      isPotentialCus: latent,
      adaptStockNum: adaptations.includes("0") ? "" : adaptations.join(""),
      asset: assets.includes("0") ? "" : assets.join(""),
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
            style={{
              marginRight: "8px",
              color: "#1A2243",
              fontWeight: "500",
            }}
          >
            客户级别
          </span>
          <EselectCheck
            dataList={state.leavel}
            onChange={leaveChange}
            options={{ mode: "multiple", value: isLeave }}
          />
        </div>
        <div className="selectAreaInAt">
          <span
            style={{
              marginRight: "8px",
              color: "#1A2243",
              fontWeight: "500",
            }}
          >
            客户
          </span>
          <Input
            placeholder="客户号/客户姓名/手机号"
            className="anInput"
            style={{
              width: "250px",
              height: "32px",
              lineHeight: "32px",
              borderRadius: "2px",
            }}
            value={cusKeyWord}
            allowClear
            onChange={customerValue}
          />
        </div>
        <div className="selectAreaInAt">
          <span className="font-at">是否开通</span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("isWantAtT0")}
            overlayClassName="isShowPover"
            content={
              <span>
                客户开通要求：T-1日总资产大于50万且适当性要求为中高风险以上
              </span>
            }
            trigger="hover"
          >
            <span
              id="isWantAtT0"
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
          <RadioSuper
            type="T0IsOpen"
            handleClick={handleClick}
            select={isOpenT0}
            valueInName={state.isOpenT0}
          />
        </div>
        <div className="selectAreaInAt">
          <span className="font-at">是否为T0潜力客户</span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("isWantAtLant")}
            overlayClassName="isShowPover"
            content={
              <span>
                重点潜力客户标准：持仓T0回测收益超5%、适配优秀股票数超3只、证券市值超60万且有可用现金
              </span>
            }
            trigger="hover"
          >
            <span
              id="isWantAtLant"
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
          <RadioSuper
            type="latent"
            handleClick={handleClick}
            select={latent}
            valueInName={state.latent}
          />
        </div>
        <div className="selectAreaInAt">
          <span className="font-at">T0适配股票数</span>
          <Popover
            placement="bottomLeft"
            getPopupContainer={() => document.getElementById("isWantAtLantNum")}
            overlayClassName="isShowPover overInBase"
            content={<span>持仓股票</span>}
            trigger="hover"
          >
            <span
              id="isWantAtLantNum"
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
            getPopupContainer={() =>
              document.getElementById("isWantAtLantupInto")
            }
            overlayClassName="isShowPover"
            content={
              <span>
                客户开通要求：T-1日总资产大于50万且适当性要求为中高风险以上
              </span>
            }
            trigger="hover"
          >
            <span
              id="isWantAtLantupInto"
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
