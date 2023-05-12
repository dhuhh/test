import React, { useState, useEffect } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import {
  QueryFinancialProSale,
  GetMarketDay,
  QueryFinProSale,
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
  activityComPage: { exportFinancialProSaleQ2 },
} = ftq;

export default function EmProductsales(props) {
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("wclMb_DESC");
  const [queryDate, setQueryDate] = useState("");

  useEffect(() => {
    GetMarketDay({ dayBeforeCount: '2' }).then(res => {
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

  let em_cpxsZs =
    "活动口径销售额-合计 = (活动口径销量-系统内) + (活动口径销量-系统外) + (基金投顾组合购买量)";

  let columns = [
    {
      title: "序号",
      dataIndex: "xh",
      key: "序号",
      width: 50,
      fixed: "left",
      render: (text, record) =>
        record.fz.trim().includes("本人所在") ? "" : text,
    },
    {
      title: "组别",
      dataIndex: "fz",
      key: "组别",
      width: 100,
      fixed: "left",
    },
    {
      title: "分支机构",
      dataIndex: "jg",
      key: "分支机构",
      width: 165,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-理财产品销售-${record.jg}`,
          tableType: "emProductsales_partment",
          orgId: record.jgId,
          staffId: "",
          showCheckBox: false,
          showExport: true,
          queryDate: queryDate && queryDate.format("YYYYMMDD"),
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
      },
    },
    {
      title: (
        <div>
          目标值
          <br />
          (亿元)
        </div>
      ),
      dataIndex: "mbCpxs",
      width: 100,
      key: "目标值(亿元)",
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            活动口径销售
            <br />
            额-合计(万元)
          </div>
          <Tooltip title={em_cpxsZs} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "cpxsZs",
      key: "活动口径销售额-合计(万元)",
      sorter: true,
      width: 140,
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
      sorter: true,
    },
    {
      title: (
        <div>
          保有规模
          <br />
          增长(亿元)
        </div>
      ),
      dataIndex: "bygmZz",
      width: 110,
      key: "保有规模增长(亿元)",
      sorter: true,
    },
    {
      title: (
        <div>
          理财产品销量
          <br />
          金额奖-排名
        </div>
      ),
      dataIndex: "pmCpxs",
      key: "理财产品销量金额奖-排名",
      // sorter: true,
      width: 110,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          理财产品销量
          <br />
          完成率奖-排名
        </div>
      ),
      dataIndex: "pmWcl",
      key: "理财产品销量完成率奖-排名",
      // sorter: true,
      width: 110,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          理财保有规模
          <br />
          增长奖-排名
        </div>
      ),
      dataIndex: "pmBygmZz",
      key: "理财保有规模增长奖-排名",
      // sorter: true,
      width: 110,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          活动口径销量
          <br />
          系统内(万元)
        </div>
      ),
      dataIndex: "xsgmXtn",
      key: "活动口径销量-系统内(万元)",
      width: 120,
      sorter: true,
    },
    {
      title: (
        <div>
          活动口径销量
          <br />
          系统外(万元)
        </div>
      ),
      dataIndex: "xsgmXtw",
      key: "活动口径销量-系统外(万元)",
      width: 110,
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
    {
      title: (
        <div>
          当前理财产品
          <br />
          保有规模(亿元)
        </div>
      ),
      dataIndex: "bygmDq",
      key: "当前理财产品保有规模(亿元)",
      width: 110,
    },
    {
      title: (
        <div>
          3月日均保有
          <br />
          规模(亿元)
        </div>
      ),
      dataIndex: "rjByl03",
      key: "3月日均日均保有规模(亿元)",
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
    QueryFinProSale(prams)
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
          keys={{ keys: "emProductsales" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportFinancialProSaleQ2}
        />
        <Table {...tableProps} columns={columns} key={"emProductsales"}></Table>
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
