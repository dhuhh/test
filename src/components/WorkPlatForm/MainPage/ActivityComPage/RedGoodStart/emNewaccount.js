import React, { useEffect, useState } from "react";
import { EncryptBase64 } from "../../../../Common/Encrypt";
import top1 from "$assets/activityComPage/homered1.png";
import top2 from "$assets/activityComPage/homered2.png";
import top3 from "$assets/activityComPage/homered3.png";
import { QueryNewValidCustomer, GetMarketDay } from "$services/activityComPage";
import { prefix } from "$utils/config";
import { Link } from "dva/router";
import { Tooltip, Icon, message, Table, Pagination } from "antd";
import moment from "moment";
import ExportTab from "./exportTab";
import styles from "./index.less";
import config from "$utils/config";
const { ftq } = config;
const {
  activityComPage: { exportNewValidCustomer },
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
      if (data > "20230331") {
        setQueryDate(moment("20230331"));
      }else{
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

  let em_yxhZs = "折算后新增有效户总数=证券端新开有效户+可计入新增有效户的无效户数+IB端新开有效户+安信国际端新开有效户";
  let em_khsWxhjhYxh =
    "无效户激活指活动期间在CRM打上“无效户激活”标签的客户。无效户激活客户数在无效户激活门槛值之内的，每户无效户激活按1:0.5折算为新增有效户，超无效户激活门槛值的，每户无效户激活按1:1折算为新增有效户。同一个客户在公司已有一个以上客户号，如全部为无效户，则第一个被激活的无效户纳入统计；如除本账户以外其他账户有非无效户且非销户账户（即没有“无效户”标签且不为销户状态），则本账户的无效户激活不纳入统计。";
  let em_yxhIb =
    "商品期货新增有效户标准：活动期间新开户且期货交易10手及以上。金融期货新增有效户标准：活动期间开户成功即算。该数据每周五更新截至当周四的数据";
  let em_yxhAxgj =
    "安信国际端新增有效户指活动期间新开户且入款1万港币或发生一笔交易。该数据每周五更新截至当周四的数据";

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
          pageTitle: `分支机构奖项-新增有效户-${record.jg}`,
          tableType: "emNewaccount_partment",
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
      dataIndex: "mbYxh",
      width: 110,
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
      width: 131,
      sorter: true,
    },
    {
      title: (
        <div>
          新增有效户
          <br />
          数奖-排名
        </div>
      ),
      dataIndex: "pmKhs",
      key: "新增有效户数奖-排名",
      width: 110,
      sorter: true,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
    },
    {
      title: (
        <div>
          新增有效户完
          <br />
          成率奖-排名
        </div>
      ),
      dataIndex: "pmWcl",
      key: "新增有效户完成率奖-排名",
      width: 120,
      sorter: true,
      render: (text, record) => <div>{reWriteRank(text)}</div>,
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
      width: 90,
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
      width: 80,
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
      width: 80,
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
      width: 140,
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
      width: 100,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            安信国际端-新
            <br />
            开有效户
          </div>
          <Tooltip title={em_yxhAxgj} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhAxgj",
      key: "安信国际端-新开有效户",
      width: 131,
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
      newValidFrom: "",
      orgId: "",
      pageSize: pageSize,
      paging: 1,
      queryDate: queryDate.format('YYYYMMDD'),
      sort,
      staffId: "",
      summaryType: 1,
    };
    QueryNewValidCustomer(prams)
      .then(res => {
        setLoading(false);
        const { records = [], total = 0 } = res;
        let showNum = 0; 
        records.forEach((item)=>{
          if(item.fz.trim() === "本人所在分支"){
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
    // rowKey:e =>e.jg,
    scroll: { x: 1550 ,y: 630 },
    rowClassName: e => (e.fz.trim() === "本人所在分支" ? styles.myBranch : e.fz.trim() === '合计' ? styles.fixTab : ""),
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
          action={exportNewValidCustomer}
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
