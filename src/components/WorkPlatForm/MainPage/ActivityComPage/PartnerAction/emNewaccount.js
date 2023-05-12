import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import {
  QueryNewValidCustomer,
  GetMarketDay,
  QueryNewValidCust,
} from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import moment from "moment";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
const { ftq } = config;
const {
  activityComPage: { exportNewValidCustomer, exportNewValidCust },
} = ftq;

export default function EmNewaccount(props) {
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

  let em_yxhZs =
    "折算后新增有效户总数=证券端新开有效户+可计入新增有效户的无效户数+IB端新开有效户+(新开私募产品户*3)";
  let em_khsWxhjhYxh =
    "无效户激活指活动期间在CRM打上“无效户激活”标签的客户。无效户激活客户数在无效户激活门槛值之内的，每户无效户激活按1:0.5折算为新增有效户，超无效户激活门槛值的，每户无效户激活按1:1折算为新增有效户。";
  let em_yxhIb =
    "商品期货新增有效户标准：活动期间新开户且期货交易10手及以上；金融期货新增有效户标准：活动期间开户成功即算";
  let em_yxhSmcp =
    "仅限私募基金（单一客户私募基金）、私募基金（多客户私募基金）、私募投资基金三类";

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
          pageTitle: `分支机构奖项-新增有效户-${record.jg}`,
          tableType: "emNewaccount_partment",
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
      dataIndex: "mbYxh",
      width: 110,
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
            折算后新增
            <br />
            有效户总数
          </div>
          <Tooltip title={em_yxhZs} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhZs",
      key: "折算后新增有效户总数",
      width: 140,
      sorter: true
    },

    {
      title: (
        <div>
          证券端-新
          <br />
          开有效户
        </div>
      ),
      dataIndex: "khsYxh",
      key: "证券端-新开有效户",
      width: 120,
      sorter: true
    },
    {
      title: (
        <div>
          无效户激
          <br />
          活门槛值
        </div>
      ),
      dataIndex: "mbWxhjh",
      key: "无效户激活门槛值",
      width: 120
    },
    {
      title: (
        <div>
          实际无效
          <br />
          户激活数
        </div>
      ),
      dataIndex: "khsWxhjh",
      key: "实际无效户激活数",
      width: 120
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            可计入新增有效
            <br />
            户的无效户数
          </div>
          <Tooltip title={em_khsWxhjhYxh} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "khsWxhjhYxh",
      key: "可计入新增有效户的无效户数",
      width: 140
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新开私募
            <br />
            产品户
          </div>
          <Tooltip title={em_yxhSmcp} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhSmcp",
      key: "新开私募产品户",
      width: 120
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            IB端-新开
            <br />
            有效户
          </div>
          <Tooltip title={em_yxhIb} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhIb",
      key: "IB端-新开有效户",
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
      newValidFrom: "",
      orgId: "",
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: 1,
    };
    QueryNewValidCust(prams)
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
    scroll: { x: 1400, y: 630 },
    rowClassName: e =>
      e.fz.trim() === "本人所在分支"
        ? styles.myBranch
        : e.fz.trim() === "合计"
          ? styles.fixTab
          : "",
    onChange: onTableChange,
    pagination: false,
  };

  const newGetColums = columns.filter(t => t.dataIndex !== "xhno");
  const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
  const tableHeaderNames = newGetColums.map(item => item.key).join(",");
  const queryModel = {
    newValidFrom: "",
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
          keys={{ keys: "emNewaccount" }}
          setQueryDate={setQueryDate}
          queryDate={queryDate}
          exportPayload={exportPayload}
          total={total}
          action={exportNewValidCust}
        />
        <Table {...tableProps} columns={columns} key={"emNewaccount"}></Table>
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
