import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import {
  QueryMidAffluentCustomer,
  GetMarketDay,
  QueryNewValidCust
} from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportMidAffluentCustomer, exportNewValidCust }
} = ftq;

export default function PeNewaccount(props) {

  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("khsYxh_DESC");
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


  let columns = [
    {
      title: (
        <div>
          新开有效户TOP50
          <br />
          精英奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "新开有效户TOP50精英奖-排名",
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      key: "OA账号"
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      key: "员工姓名",
      render: (text, record) => {
        let tabName = !record.ryxm.indexOf("本人")
          ? record.ryxm.slice(record.ryxm.indexOf("-") + 1, record.ryxm.length)
          : record.ryxm;
        const params = {
          pageTitle: `员工个人奖-新开有效户-${tabName}`,
          tableType: "peNewaccount_person",
          orgId: "",
          staffId: record.ryid,
          showCheckBox: true,
          showExport: false,
          queryDate: queryDate && queryDate.format("YYYYMMDD")
        };
        const paramsStr = JSON.stringify(params);
        return (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {tabName}
          </Link>
        );
      }
    },
    {
      title: "员工所属分支机构",
      dataIndex: "jg",
      key: "员工所属分支机构"
    },
    {
      title: "新开有效户数(户)",
      dataIndex: "khsYxh",
      sorter: true,
      key: "新开有效户数(户)"
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
      pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: "5",
    };
    QueryNewValidCust(prams)
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
          keys={{ keys: "peNewaccount" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportNewValidCust}
        />
        <Table {...tableProps} columns={columns} key={"peNewaccount"}></Table>
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
