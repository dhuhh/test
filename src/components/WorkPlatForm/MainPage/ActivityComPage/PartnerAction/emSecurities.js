import React, { useState, useEffect } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import {
  QueryNewCreditCustomer,
  GetMarketDay,
  QueryMarginBalance,
} from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { message, Table, Pagination } from "antd";
import moment from "moment";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
const { ftq } = config;
const { activityComPage: { exportNewCreditCustomerQ2 } } = ftq;

export default function EmSecurities(props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("zzgmLrye_DESC");
  const [queryDate, setQueryDate] = useState("");

  useEffect(() => {
    GetMarketDay({ dayBeforeCount: "1" }).then(res => {
      const { data } = res;
      if (data > "20230731") {
        setQueryDate(moment("20230731"));
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
      dataIndex: "xh",
      key: "序号",
      width: 66,
      fixed: "left"
    },
    {
      title: "组别",
      dataIndex: "fz",
      key: "组别",
      fixed: "left"
    },
    {
      title: "分支机构",
      dataIndex: "jg",
      key: "分支机构",
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-融资融券-${record.jg}`,
          tableType: "emSecurities_partment",
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
      title: <div>目标值(亿元)</div>,
      dataIndex: "mbRzrq",
      key: "目标值(亿元)",
      sorter: true
    },
    {
      title: (
        <div>
          两融日均余额增
          <br />
          长规模(亿元)
        </div>
      ),
      dataIndex: "zzgmLrye",
      key: "两融日均余额增长规模(亿元)",
      sorter: true
    },
    {
      title: (
        <div>
          两融日均余额增长
          <br />
          优胜奖-排名
        </div>
      ),
      dataIndex: "pmLrzz",
      key: "两融日均余额增长优胜奖-排名",
      sorter: true,
      render: (text, record) => <div>{reWriteRank(text)}</div>
    },
    {
      title: (
        <div>
          当前两融日均
          <br />
          余额(亿元)
        </div>
      ),
      dataIndex: "rjyeDq",
      key: "当前两融日均余额(亿元)",
      sorter: true
    },
    {
      title: (
        <div>
          2022日均两融
          <br />
          余额(亿元)
        </div>
      ),
      dataIndex: "rjye2022",
      key: "2022日均两融余额(亿元)"
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
    QueryMarginBalance(prams)
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
    scroll: { x: 1100, y: 630 },
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
          action={exportNewCreditCustomerQ2}
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
