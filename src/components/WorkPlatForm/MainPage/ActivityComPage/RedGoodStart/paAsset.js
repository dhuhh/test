import React, { useEffect, useState } from "react";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryAssetIntroduce, GetMarketDay } from "$services/activityComPage";
import { message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportAssetIntroduce },
} = ftq;

export default function PaAsset(props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("tzhjlr_DESC");
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

  let columns = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
      fixed: "left",
    },
    {
      title: "分支号",
      dataIndex: "id",
      key: "分支号",
      width: 100,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 190,
      render: text => (
        <div>
          {!text.indexOf("本人所在营业部-")
            ? text.slice(text.indexOf("-") + 1, text.length)
            : text}
        </div>
      ),
    },
    {
      title: "所属分支机构",
      dataIndex: "khwd",
      key: "所属分支机构",
      width: 190,
    },
    {
      title: "资产引入奖-排名",
      dataIndex: "pm",
      width: 140,
      key: "资产引入奖-排名",
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true,
    },
    {
      title: (
        <div>
          常规资产净流入
          <br />
          (不含限售解禁)(万元)
        </div>
      ),
      dataIndex: "jlr",
      key: "常规资产净流入(不含限售解禁)(万元)",
      width: 150,
      sorter: true,
    },
    {
      title: "资产调整项",
      dataIndex: "tzx",
      key: "资产调整项",
      width: 150,
    },
    {
      title: (
        <div>
          调整后常规资产净流入
          <br />
          (不含限售解禁)(万元)
        </div>
      ),
      dataIndex: "tzhjlr",
      key: "调整后常规资产净流入(不含限售解禁)(万元)",
      width: 160,
      sorter: true,
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
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort:
        sort === "pm_DESC"
          ? "tzhjlr_DESC"
          : sort === "pm_ASC"
            ? "tzhjlr_ASC"
            : sort,
    };
    QueryAssetIntroduce(prams)
      .then(res => {
        setLoading(false);
        const { records = [], total = 0 } = res;

        let showNum = 0;
        records.forEach(item => {
          if (item.name.trim().includes("本人所在")) {
            showNum = 1;
          }
        });

        records.forEach((item, index) => {
          if (
            item.khwd.trim() !== "合计" &&
            !item.name.trim().includes("本人所在")
          ) {
            item.xhno = (prams.current - 1) * prams.pageSize + index - showNum;
          }
        });
        setDataSource(records);
        setTotal(total);
      })
      .catch(err => {
        setLoading(false);
        return message.error(err.note || err.message);
      });
  };

  // 分页
  const handleTableChange = (p, c) => {
    setCurrent(p);
    setPageSize(c);
  };
  // 列表排序
  const onTableChange = (a, b, c) => {
    if (c.field) {
      c.order
        ? setSort(c.field + "_" + c.order.slice(0, -3).toUpperCase())
        : setSort("");
    }
  };

  const tableProps = {
    dataSource,
    columns,
    loading,
    className: `${styles.tabs}`,
    scroll: { x: 1200, y: 630 },
    rowClassName: e =>
      e.name.trim().includes("本人所在")
        ? styles.myBranch
        : e.khwd.trim().includes("合计")
          ? styles.fixTab
          : "",
    onChange: onTableChange,
    pagination: false,
  };
  const newGetColums = columns.filter(t => t.dataIndex !== "xhno");
  const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
  const tableHeaderNames = newGetColums.map(item => item.key).join(",");
  const queryModel = {
    queryDate: queryDate && queryDate.format("YYYYMMDD"),
    sort:
      sort === "pm_DESC"
        ? "tzhjlr_DESC"
        : sort === "pm_ASC"
          ? "tzhjlr_ASC"
          : sort,
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
          keys={{ keys: "paAsset" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportAssetIntroduce}
        />
        <Table {...tableProps} columns={columns} key={"paAsset"}></Table>
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
