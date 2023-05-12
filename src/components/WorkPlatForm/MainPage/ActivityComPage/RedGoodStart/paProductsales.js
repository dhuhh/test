import React, { useState, useEffect } from "react";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryFinancialProSale, GetMarketDay } from "$services/activityComPage";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportFinancialProSale },
} = ftq;

export default function PaProductsales(props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("cpxsZs_DESC");
  const [queryDate, setQueryDate] = useState("");

  useEffect(() => {
    GetMarketDay({ dayBeforeCount: "2" }).then(res => {
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
  let pa_cpxsZs =
    "活动口径销售规模-合计=(活动口径销售规模-系统内）+（活动口径定制规模-系统外）+（安信国际基金销售量）+（基金投顾组合购买量）";

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
      fixed: "left",
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 190,
      render: (text, record) =>
        !text.indexOf("本人所在营业部-")
          ? text.slice(text.indexOf("-") + 1, text.length)
          : text,
    },
    {
      title: "所属分支机构",
      dataIndex: "nameWd",
      key: "所属分支机构",
      width: 180,
    },
    {
      title: (
        <div>
          理财产品销
          <br />
          售争先奖
        </div>
      ),
      dataIndex: "pmCpxs",
      key: "理财产品销售争先奖",
      width: 120,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true,
    },
    {
      title: "获奖日期",
      dataIndex: "jg",
      key: "获奖日期",
      width: 100,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            活动口径销售规
            <br />
            模-合计(万元)
          </div>
          <Tooltip title={pa_cpxsZs} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "cpxsZs",
      width: 160,
      key: "活动口径销售规模-合计(万元)",
      sorter: true,
    },
    {
      title: (
        <div>
          活动口径销售规
          <br />
          模-系统内(万元)
        </div>
      ),
      dataIndex: "xsgmXtn",
      key: "活动口径销售规模-系统内(万元)",
      width: 150,
      sorter: true,
    },
    {
      title: (
        <div>
          活动口径定制规
          <br />
          模-系统外(万元)
        </div>
      ),
      dataIndex: "xsgmXtw",
      key: "活动口径定制规模-系统外(万元)",
      width: 120,
    },
    {
      title: (
        <div>
          安信国际基金
          <br />
          销售量(万元)
        </div>
      ),
      dataIndex: "xsgmAxgj",
      key: "安信国际基金销售量(万元)",
      width: 100,
    },
    {
      title: (
        <div>
          基金投顾组合
          <br />
          购买量(万元)
        </div>
      ),
      dataIndex: "xsgmJjtg",
      key: "基金投顾组合购买量(万元)",
      width: 100,
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
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: "5",
    };
    QueryFinancialProSale(prams)
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
            item.name.trim() !== "合计" &&
            !item.name.trim().includes("本人所在")
          ) {
            item.xhno = (prams.current - 1) * prams.pageSize + index - showNum;
          }
        });
        setDataSource(records);
        setTotal(total);
      })
      .catch(err => message.error(err.note || err.message));
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
    scroll: { x: 1410, y: 630 },
    // rowKey:e=>e.name,
    rowClassName: e =>
      e.name.trim().includes("本人所在")
        ? styles.myBranch
        : e.name.trim().includes("合计")
          ? styles.fixTab
          : "",
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
          keys={{ keys: "paProductsales" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportFinancialProSale}
        />
        <Table {...tableProps} columns={columns} key={"paProductsales"}></Table>
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
