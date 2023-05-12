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


  let cu_zdfyZs = "新增中端富裕客户总数=证券端新开中端富裕客户+无效户激活转中端+IB端新开中端富裕客户+安信国际端新开中端富裕客户";
  let cu_khsZdfy = "新开中端富裕客户指活动期间在我司首次开立A股账户且资产净流入≥30万元，同一个客户在公司已有一个以上客户号，再新开的第二个客户号，不纳入统计（产品户除外）。2023年1月1日后销户再开户也不纳入统计";
  let cu_khsWxhjhZdfy =
    "无效户激活指活动期间在CRM打上“无效户激活”标签的客户且资产净流入≥30万元。同一个客户在公司已有一个以上客户号，如全部为无效户，则第一个被激活的无效户纳入统计；如除本账户以外其他账户有非无效户且非销户账户（即没有“无效户”标签且不为销户状态），则本账户的无效户激活不纳入统计。";
  let cu_zdfyIb = "活动期间新开期货户，资产净流入≥30万元。该数据每周一更新截至上周五的数据。";
  let cu_zdfyAxgj = "活动期间新开户且活动结束日汇率结算时点资产大于或等于30万元人民币。该数据每周一更新截至上周五的数据"; 

  let columns = [
    {
      title: "序号",
      dataIndex: "xh",
      key: "序号",
      width: 66,
      fixed: "left",
    },
    {
      title: "组别",
      dataIndex: "fz",
      key: "组别",
      width: 110,
      fixed: "left",
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
          queryDate: queryDate && queryDate.format("YYYYMMDD"),
        };
        const paramsStr = JSON.stringify(params);
        return (
          <Link
            to={`${prefix}/single/PartmentDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: "目标值(户)",
      dataIndex: "mbZdfy",
      width: 100,
      key: "目标值(户)",
      sorter: true,
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
      width: 90,
      key: "目标完成率(%)",
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新增中端富裕
            <br />
            客户总数
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
      width: 130,
      sorter: true,
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
      sorter: true,
    },
    {
      title: (
        <div>
          新增中端富裕客户
          <br />
          完成率奖-排名
        </div>
      ),
      dataIndex: "pmWcl",
      key: "新增中端富裕客户完成率奖-排名",
      width: 140,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
      sorter: true,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            证券端-新开中
            <br />
            端富裕客户
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
      width: 135,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            无效户激活
            <br />
            转中端
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
      width: 120,
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
      width: 120,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            安信国际端-新开
            <br />
            中端富裕客户
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
      key: "安信国际端-新开中端富裕客户",
      width: 130,
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
      awardsType: 1,
      current,
      orgId: "",
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format("YYYYMMDD"),
      sort,
      staffId: "",
      summaryType: 1,
    };
    QueryMidAffluentCustomer(prams)
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
          action={exportMidAffluentCustomer}
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
