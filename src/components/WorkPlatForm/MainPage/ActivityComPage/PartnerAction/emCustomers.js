import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import {
  QueryMidAffluentCustomer,
  GetMarketDay,
  QueryMidAffluentCust,
} from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportMidAffluentCustomer, exportMidAffluentCust },
} = ftq;
export default function EmCustomers(props) {

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
      if (data > "20230630") {
        setQueryDate(moment("20230630"));
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


  let cu_zdfyZs =
    "新增中端富裕客户总数=证券端新开中端富裕客户+无效户激活转中端+(新开私募产品客户*3)+IB端新开中端富裕客户";
  let cu_khsZdfy =
    "新开中端富裕客户指活动期间在我司首次开立A股账户且活动期内在CRM打上“中端富裕客户”标签的客户（当日时点资产≥30万元），同一个客户在公司已有一个以上客户号，再新开的第二个客户号，不纳入统计（机构户和产品户除外）。销户再开户也不纳入统计";
  let cu_khsWxhjhZdfy =
    "无效户激活指活动期间在CRM打上“无效户激活”客户标签，且同时满足“中端富裕客户”标签的客户（当日时点资产≥30万元）。";
  let cu_zdfyIb = "活动期间新开期货户，资产净流入≥30万元。";
  let cu_zdfySmcp = "仅限私募基金（单一客户私募基金）、私募基金（多客户私募基金）、私募投资基金三类"; 

  let columns = [
    {
      title: "序号",
      dataIndex: "xh",
      key: "序号",
      width: 66,
      fixed: "left"
    },
    {
      title: "组别",
      dataIndex: "fz",
      key: "组别",
      width: 110,
      fixed: "left"
    },
    {
      title: "分支机构",
      dataIndex: "jg",
      key: "分支机构",
      width: 180,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-新增中端富裕客户-${record.jg}`,
          tableType: "emCustomers_partment",
          orgId: record.jgId,
          staffId: "",
          showCheckBox: false,
          showExport: true,
          queryDate: queryDate && queryDate.format("YYYYMMDD")
        };
        const paramsStr = JSON.stringify(params);
        return (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        );
      }
    },
    {
      title: "目标值(户)",
      dataIndex: "mbZdfy",
      width: 100,
      key: "目标值(户)",
      sorter: true
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
      width: 100,
      key: "目标完成率(%)",
      sorter: true
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新增中端富
            <br />
            裕客户总数
          </div>
          <Tooltip title={cu_zdfyZs} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "zdfyZs",
      key: "新增中端富裕客户总数",
      width: 120,
      sorter: true
    },
    {
      title: (
        <div>
          新增中端富裕
          <br />
          客户数奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "新增中端富裕客户数奖-排名",
      width: 120,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true
    },
    {
      title: (
        <div>
          新增中端富裕客
          <br />
          户完成率奖-排名
        </div>
      ),
      dataIndex: "pmWcl",
      key: "新增中端富裕客户完成率奖-排名",
      width: 130,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            证券端-新开
            <br />
            中端富裕客户
          </div>
          <Tooltip title={cu_khsZdfy} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "khsZdfy",
      key: "证券端-新开中端富裕客户",
      width: 130,
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            无效户激
            <br />
            活转中端
          </div>
          <Tooltip title={cu_khsWxhjhZdfy} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "khsWxhjhZdfy",
      key: "无效户激活转中端",
      width: 120
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新开私募
            <br />
            产品客户
          </div>
          <Tooltip title={cu_zdfySmcp} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "zdfySmcp",
      key: "新开私募产品客户",
      width: 120
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            IB端-新开中
            <br />
            端富裕客户
          </div>
          <Tooltip title={cu_zdfyIb} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "zdfyIb",
      key: "IB端-新开中端富裕客户",
      width: 120
    }
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
      current,
      orgId: "",
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: 1,
    };
    QueryMidAffluentCust(prams)
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
    rowClassName: e => (e.fz.trim() === "本人所在分支" ? styles.myBranch : e.fz.trim() === '合计' ? styles.fixTab : ""),
    scroll: { x: 1570, y: 630 },
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
          keys={{ keys: "emCustomers" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportMidAffluentCust}
        />
        <Table {...tableProps} columns={columns} key={"emCustomers"}></Table>
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
