import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryMidAffluentCustomer ,GetMarketDay } from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportMidAffluentCustomer },
} = ftq;

export default function PeCustomers(props) {

  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("zdfyZs_DESC");
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

  let cu_khsZdfy =
    "新开中端富裕客户指活动期间在我司首次开立A股账户且资产净流入≥30万元，同一个客户在公司已有一个以上客户号，再新开的第二个客户号，不纳入统计（产品户除外）。2023年1月1日后销户再开户也不纳入统计"; 
  let cu_zdfyIb =
    "活动期间新开期货户，资产净流入≥30万元。该数据每周一更新截至上周五的数据。";
  let cu_zdfyAxgj =
        "活动期间新开户且活动结束日汇率结算时点资产大于或等于30万元人民币。该数据每周一更新截至上周五的数据";


  let columns = [
    // {
    //   title: "序号",
    //   dataIndex: "xhno",
    //   key: "序号",
    //   width: 66,
    //   fixed: "left"
    // },
    {
      title: (
        <div>
          新开中端富裕客户
          <br />
          TOP50精英奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "新开中端富裕客户TOP50精英奖-排名",
      fixed: "left",
      width: 170,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      width: 100,
      key: "OA账号",
      sorter: true,
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      sorter: true,
      width: 110,
      key: "员工姓名",
      render: (text, record) => {
        let tabName = !record.ryxm.indexOf("本人")
          ? record.ryxm.slice(record.ryxm.indexOf("-") + 1, record.ryxm.length)
          : record.ryxm;
        const params = {
          pageTitle: `员工个人奖-新开中端富裕客户-${tabName}`,
          tableType: "peCustomers_partment",
          orgId: "",
          staffId: record.ryid,
          showCheckBox: true,
          showExport: false,
          queryDate: queryDate && queryDate.format("YYYYMMDD"),
        };
        const paramsStr = JSON.stringify(params);
        return (
          <Link
            to={`${prefix}/single/PartmentDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {tabName}
          </Link>
        );
      },
    },
    {
      title: "所属分支机构",
      dataIndex: "nameKhwd",
      key: "所属分支机构",
      width: 180,
    },
    {
      title: (
        <div>
          新开中端富裕
          <br />
          客户总数(户)
        </div>
      ),
      dataIndex: "zdfyZs",
      sorter: true,
      key: "新开中端富裕客户总数(户)",
      width: 125,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            证券端-新开
            <br />
            中端富裕户数
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
      key: "证券端-新开中端富裕户数",
      width: 150,
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            IB端-新开中端
            <br />
            富裕客户数
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
      key: "IB端-新开中端富裕客户数",
      width: 150,
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            安信国际端-新开
            <br />
            中端富裕客户数
          </div>
          <Tooltip title={cu_zdfyAxgj} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "zdfyAxgj",
      key: "安信国际端-新开中端富裕客户数",
      width: 150,
    },
    {
      title: (
        <div>
          证券端-新开中端富裕
          <br />
          客户日均资产(万元)
        </div>
      ),
      dataIndex: "zdfyRjzc",
      key: "证券端-新开中端富裕客户日均资产(万元)",
      width: 160,
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
      current,
      orgId: "",
      pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: "5",
    };
    QueryMidAffluentCustomer(prams)
      .then(res => {
        setLoading(false);
        const { records = [], total = 0 } = res;
        records.forEach((item, index) => {
          item.xhno = (prams.current - 1) * prams.pageSize + index + 1 + "";
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
    // rowKey: e => e.ryxm,
    scroll: { x: 1260, y: 630 },
    rowClassName: e => (e.ryxm.trim().includes("本人") ? styles.myBranch : ""),
    onChange: onTableChange,
    pagination: false,
  };
  const newGetColums = columns.filter(t => t.dataIndex !== "xhno");
  const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
  const tableHeaderNames = newGetColums.map(item => item.key).join(",");
  const queryModel = {
    orgId: "",
    queryDate: queryDate && queryDate.format("YYYYMMDD"),
    sort,
    staffId: "",
    summaryType: "5",
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
          keys={{ keys: "peCustomers" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportMidAffluentCustomer}
        />
        <Table {...tableProps} columns={columns} key={"peCustomers"}></Table>
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
