import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryFundAdviseSign, GetMarketDay } from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { message, Table, Pagination } from "antd";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
import moment from "moment";
const { ftq } = config;
const {
  activityComPage: { exportFundAdviseSign },
} = ftq;

export default function PaHeadband(props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("zzcJzJjtg_DESC");
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
      dataIndex: "yyb",
      key: "分支号",
      width: 100,
      fixed: "left",
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 190,
      render: (text, record) => {
        let tabName = !record.name.indexOf("本人所在营业部-")
          ? record.name.slice(record.name.indexOf("-") + 1, record.name.length)
          : record.name;
        const params = {
          pageTitle: `营业部组织奖-基金投顾-${tabName}`,
          tableType: "paHeadband_person",
          orgId: record.yyb,
          staffId: "",
          showCheckBox: false,
          showExport: false,
          queryDate: queryDate && queryDate.format("YYYYMMDD"),
        };
        const paramsStr = JSON.stringify(params);
        return record.name === "合计" ? (
          text
        ) : (
          <Link
            to={`${prefix}/single/PartmentDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {!text.indexOf("本人所在营业部-")
              ? text.slice(text.indexOf("-") + 1, text.length)
              : text}
          </Link>
        );
      },
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
          基金投顾净增
          <br />
          保有资产奖
        </div>
      ),
      dataIndex: "pmZzcJz",
      width: 120,
      key: "基金投顾净增保有资产奖",
      sorter: true,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          净增保有
          <br />
          资产(万元)
        </div>
      ),
      dataIndex: "zzcJzJjtg",
      sorter: true,
      width: 110,
      key: "净增保有资产(万元)",
    },
    {
      title: (
        <div>
          期末保有
          <br />
          资产(万元)
        </div>
      ),
      dataIndex: "zzcJjtg",
      sorter: true,
      key: "期末保有资产(万元)",
      width: 110,
    },
    {
      title: (
        <div>
          活动期初保有
          <br />
          资产(万元)
        </div>
      ),
      dataIndex: "qcZzcJjtg",
      sorter: true,
      key: "活动期初保有资产(万元)",
      width: 120,
    },
    {
      title: (
        <div>
          净增签约有
          <br />
          效户数(户)
        </div>
      ),
      dataIndex: "khsJz",
      key: "净增签约有效户数(户)",
      width: 90,
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
      key: "期末签约总户数(户)",
      width: 90,
    },

    {
      title: (
        <div>
          活动期初签约
          <br />
          有效户数(户)
        </div>
      ),
      dataIndex: "khsQc",
      key: "活动期初签约有效户数(户)",
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
    QueryFundAdviseSign(prams)
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
    // rowKey:e=>e.name,
    scroll: { x: 1300, y: 630 },
    rowClassName: e => (e.name.trim().includes("本人所在") ? styles.myBranch : e.name.trim().includes("合计") ? styles.fixTab : ""),
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
          keys={{ keys: "paHeadband" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportFundAdviseSign}
        />
        <Table {...tableProps} columns={columns} key={"paHeadband"}></Table>
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
