import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryFundAdviseSign, GetMarketDay } from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportFundAdviseSign },
} = ftq;

export default function EmHeadband(props) {
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

  let he_khsJz = "净增签约有效户数=期末签约有效户数-活动期初签约有效户数";
  let columns = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
      fixed: "left",
    },
    {
      title: "分支机构",
      dataIndex: "jg",
      key: "分支机构",
      fixed: "left",
      width: 180,
      render: (text, record) => {
        let tabName = !record.jg.indexOf("本人所在分支-")
          ? record.jg.slice(record.jg.indexOf("-") + 1, record.jg.length)
          : record.jg;
        const params = {
          pageTitle: `分支机构奖项-基金投顾-${tabName}`,
          tableType: "emHeadband_partment",
          orgId: record.jgId,
          staffId: "",
          showCheckBox: false,
          showExport: true,
          queryDate: queryDate && queryDate.format("YYYYMMDD"),
        };
        const paramsStr = JSON.stringify(params);
        return record.jg === "合计" ? (
          text
        ) : (
          <Link
            to={`${prefix}/single/PartmentDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {!text.indexOf("本人所在分支-")
              ? text.slice(text.indexOf("-") + 1, text.length)
              : text}
          </Link>
        );
      },
    },
    {
      title: (
        <div>
          签约数目
          <br />
          标值(户)
        </div>
      ),
      dataIndex: "mbQy",
      width: 100,
      key: "签约数目标值(户)",
      sorter: true,
    },
    {
      title: (
        <div>
          签约数目标
          <br />
          完成率(%)
        </div>
      ),
      dataIndex: "wclMb",
      width: 110,
      key: "签约数目标完成率(%)",
      sorter: true,
    },
    {
      title: (
        <div>
          基金投顾签约
          <br />
          户数奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "基金投顾签约户数奖-排名",
      width: 130,
      sorter: true,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          基金投顾完
          <br />
          成率奖-排名
        </div>
      ),
      dataIndex: "pmWcl",
      key: "基金投顾完成率奖-排名",
      width: 120,
      sorter: true,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          期末签约
          <br />
          总户数(户)
        </div>
      ),
      dataIndex: "khsQm",
      sorter: true,
      key: "期末签约总户数(户)",
      width: 110,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            净增签约有
            <br />
            效户数(户)
          </div>
          <Tooltip title={he_khsJz} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "khsJz",
      key: "净增签约有效户数(户)",
      width: 110,
      sorter: true,
    },
    {
      title: (
        <div>
          活动期初签
          <br />
          约有效户数
        </div>
      ),
      dataIndex: "khsQyq",
      key: "活动期初签约有效户数",
      width: 100,
    },
    {
      title: (
        <div>
          保有资产目
          <br />
          标完成率(%)
        </div>
      ),
      dataIndex: "wclRjzc",
      key: "保有资产目标完成率(%)",
      width: 100,
    },
    {
      title: (
        <div>
          月日均保有
          <br />
          资产(万元)
        </div>
      ),
      dataIndex: "zzcJjtg",
      key: "月日均保有资产(万元)",
      width: 90,
    },
    {
      title: (
        <div>
          日均保有资产
          <br />
          目标(万元)
        </div>
      ),
      dataIndex: "mbRjzc",
      key: "日均保有资产目标(万元)",
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
      summaryType: 1,
    };
    QueryFundAdviseSign(prams)
      .then(res => {
        setLoading(false);
        const { records = [], total = 0 } = res;
        let showNum = 0;
        records.forEach(item => {
          if (item.jg.trim().includes("本人所在")) {
            showNum = 1;
          }
        });

        records.forEach((item, index) => {
          if (
            item.jg.trim() !== "合计" &&
            !item.jg.trim().includes("本人所在")
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
    scroll: { x: 1330, y: 630 },
    // rowKey:e=>e.jg,
    rowClassName: e =>
      e.jg.trim().includes("本人所在")
        ? styles.myBranch
        : e.jg.trim().includes("合计")
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
          keys={{ keys: "emHeadband" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportFundAdviseSign}
        />
        <Table {...tableProps} columns={columns} key={"emHeadband"}></Table>
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
