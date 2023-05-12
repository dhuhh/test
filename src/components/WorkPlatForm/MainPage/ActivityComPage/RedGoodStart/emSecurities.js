import React, { useState, useEffect } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryNewCreditCustomer ,GetMarketDay } from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import moment from "moment";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
const { ftq } = config;
const { activityComPage: { exportNewCreditCustomer } } = ftq;

export default function EmSecurities(props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("wclMb_DESC");
  const [queryDate, setQueryDate] = useState("");

  useEffect(() => {
    GetMarketDay({ dayBeforeCount: "1" }).then(res => {
      const { data } = res;
      if (data > "20230331") {
        setQueryDate(moment("20230331"));
      } else {
        setQueryDate(moment(data));
      }
    });
  }, []);

  const reWriteRank = value => {
    return (
      <div>
        {value === "1" ? (
          <img src={top1} alt="" />
        ) : value === "2" ? (
          <img src={top2} alt="" />
        ) : value === "3" ? (
          <img src={top3} alt="" />
        ) : (
          <span>{value}</span>
        )}
      </div>
    );
  };

  let se_rzrqZs = "折算后总积分=（个人-存量新开信用账户）+2×（机构-存量新开信用账户）+2×（个人-新开户且开通信用账户）+4×（机构-新开户且开通信用账户）+（存量信用账户激活）+（新开信用账户且开期权账户）+（“博衍杯”全国ETF及期权交易大赛）+（新开北交所权限）"; 
  let se_clJh = "从未发生过信用交易的客户在活动期间发生第一笔信用交易的，均记1分。";

  let se_fybEtf = "活动期间两融客户参加“博衍杯”全国ETF及期权交易大赛且符合大赛排名要求（深市期权持仓天数累计应不低于 10 个交易日）的，记1分";
  let se_bjs = "活动期间新开信用账户北交所权限的，记1分，并可与新开户、存量户激活的折算叠加计算";

  let columns = [
    {
      title: "序号",
      dataIndex: "xh",
      key: "序号",
      width: 66,
      fixed: "left",
    },
    {
      title: "组别",
      dataIndex: "fz",
      key: "组别",
      width: 110,
      fixed: "left",
    },
    {
      title: "分支机构",
      dataIndex: "jg",
      key: "分支机构",
      width: 180,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-融资融券-${record.jg}`,
          tableType: "emSecurities_partment",
          orgId: record.jgId,
          staffId: "",
          showCheckBox: false,
          showExport: true,
          queryDate: queryDate && queryDate.format("YYYYMMDD"),
        };
        const paramsStr = JSON.stringify(params);
        return (
          <Link
            to={`${prefix}/single/PartmentDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: (
        <div>
          目标
          <br />
          值(户)
        </div>
      ),
      dataIndex: "mbRzrq",
      width: 82,
      key: "目标值(户)",
      sorter: true,
    },
    {
      title: (
        <div>
          目标完
          <br />
          成率(%)
        </div>
      ),
      dataIndex: "wclMb",
      width: 90,
      key: "目标完成率(%)",
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div></div>
          <div>
            折算后
            <br />
            总积分
          </div>
          <Tooltip title={se_rzrqZs} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "rzrqZs",
      key: "折算后总积分",
      width: 100,
      sorter: true,
    },
    {
      title: (
        <div>
          新开信用账
          <br />
          户奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "新开信用账户奖-排名",
      sorter: true,
      width: 110,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          个人-存量新
          <br />
          开信用账户
        </div>
      ),
      dataIndex: "grClKhs",
      key: "个人-存量新开信用账户",
      sorter: true,
      width: 115,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div>
          机构-存量新
          <br />
          开信用账户
        </div>
      ),
      dataIndex: "jgClKhs",
      key: "机构-存量新开信用账户",
      width: 95,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div>
          个人-新开户且
          <br />
          开通信用账户
        </div>
      ),
      dataIndex: "grXkKhs",
      key: "个人-新开户且开通信用账户",
      width: 110,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div>
          机构-新开户且
          <br />
          开通信用账户
        </div>
      ),
      dataIndex: "jgXkKhs",
      key: "机构-新开户且开通信用账户",
      width: 110,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            存量信用
            <br />
            账户激活
          </div>
          <Tooltip title={se_clJh} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "clJh",
      key: "存量信用账户激活",
      width: 100,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div>
          新开信用账户
          <br />
          且开期权账户
        </div>
      ),
      dataIndex: "xkRzrqQq",
      key: "新开信用账户且开期权账户",
      width: 105,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            "博衍杯"全国ETF
            <br />
            及期权交易大赛
          </div>
          <Tooltip title={se_fybEtf} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "fybEtf",
      key: "“博衍杯”全国ETF及期权交易大赛",
      width: 145,
      render: (text, record) => <div>{text || "--"}</div>,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新开北交
            <br />
            所权限
          </div>
          <Tooltip title={se_bjs} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "bjs",
      key: "新开北交所权限",
      width: 100,
      render: (text, record) => <div>{text || "--"}</div>,
    },
  ];

  useEffect(() => {
    if (queryDate !== "") {
      fetchData();
    }
  }, [current, pageSize, sort, queryDate]);

  // 列表
  const fetchData = () => {
    setLoading(true);
    const prams = {
      awardsType: 1,
      current,
      orgId: "",
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: 1,
    };
    QueryNewCreditCustomer(prams)
      .then(res => {
        setLoading(false);
        const { records = [], total = 0 } = res;
        let showNum = 0;
        records.forEach(item => {
          if (item.fz.trim() === "本人所在分支") {
            showNum = 1;
          }
        });

        records.forEach((item, index) => {
          if (item.fz.trim() !== "合计" && item.fz.trim() !== "本人所在分支") {
            item.xhno = (prams.current - 1) * prams.pageSize + index - showNum;
          }
        });
        setDataSource(records);
        setTotal(total);
      })
      .catch(err => message.error(err.note || err.message));
  };

  // 分页
  const handleTableChange = (p, c ) => {
    setCurrent(p);
    setPageSize(c);
  };
  // 列表排序
  const onTableChange = (a, b, c) => {
    if(c.field){
      c.order ? setSort(c.field + "_" + ( (c.order.slice(0,-3)).toUpperCase()) ) : setSort("");
    }
  };

  const tableProps = {
    dataSource,
    columns,
    loading,
    className: `${styles.tabs}`,
    // rowKey:e=>e.jg,
    scroll: { x: 1650, y: 630 },
    rowClassName: e => (e.fz.trim() === "本人所在分支" ? styles.myBranch : e.fz.trim() === '合计' ? styles.fixTab : ""),
    onChange: onTableChange,
    pagination: false,
  };
  const newGetColums = columns.filter(t => t.dataIndex !== "xhno");
  const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
  const tableHeaderNames = newGetColums.map(item => item.key).join(",");
  const queryModel = {
    awardsType: "1",
    orgId: "",
    queryDate: queryDate && queryDate.format("YYYYMMDD"),
    sort,
    staffId: "",
    summaryType: "1",
  };

  const exportPayload = JSON.stringify({
    queryModel,
    tableHeaderNames,
    tableHeaderCodes,
  });
  return (
    <React.Fragment>
      <div style={{ padding: "0px 16px" }}>
        <ExportTab
          keys={{ keys: "emSecurities" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportNewCreditCustomer}
        />
        <Table {...tableProps} columns={columns} key={"emSecurities"}></Table>
        <Pagination
          showLessItems
          className={`${styles.o_pagination}`}
          showQuickJumper
          showSizeChanger
          hideOnSinglePage={total > 0 ? false : true}
          pageSizeOptions={["10", "20", "50", "100"]}
          pageSize={pageSize}
          current={current}
          total={total}
          showTotal={() => `总共${total}条`}
          onShowSizeChange={(current, pageSize) =>
            handleTableChange(current, pageSize)
          }
          onChange={handleTableChange}
        />
      </div>
    </React.Fragment>
  );
}
