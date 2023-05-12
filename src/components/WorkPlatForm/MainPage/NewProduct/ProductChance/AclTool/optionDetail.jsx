import React, { Component } from "react";
import { Card, Tooltip, message } from "antd";
import { connect } from "dva";
import { Link } from "umi";
import { QueryPositionInfo } from "$services/newProduct";
import { DecryptBase64 } from "../../../../../Common/Encrypt";
import EtableCheck from "../Common/EtableCheck";
import TableLocale from "./tableLocale";
import Epagination from "../Common/Epagination";
import Calimg from "$assets/activityComPage/aclquestion.png";
import ExportBtn from "./ExportBtn";
import styles from "./index.less";

import config from "$utils/config";
const { ftq } = config;
const {
  newProduct: { queryStrategyToolPositionInfoExport },
} = ftq;
class OptionDetail extends Component {
  state = {
    current: 1,
    pageSize: 10,
    loading: false,
    dataSource: [],
    total: '',
  };
  componentDidMount(){
    this.setState({ current: 1 },()=>{
      this.queryToolInfos();
    });
  }

  componentDidUpdate(preProps) {

    if (preProps.location.change !== this.props.location.change){
      this.setState({ current: 1 }, () => {
        this.queryToolInfos();
      });
    }
  }

  queryToolInfos = () => {
    const acltools = sessionStorage.getItem("acltools");
    const paramsStr = JSON.parse(DecryptBase64(acltools));
    console.log("99899", paramsStr);
    const params = {
      activityTagListList: paramsStr.activityTagListList,
      companyTagListList: paramsStr.companyTagListList,
      staffTagListList: paramsStr.staffTagListList,
      custCode: paramsStr.custCode,
      custGroup: paramsStr.custGroup,
      custLevel: paramsStr.custLevel,
      custRange: paramsStr.custRange,
      pageCount: this.state.pageSize,
      pageNumber: this.state.current,
      sort: paramsStr.sort,
      stockCode: paramsStr.stockCode,
    };
    this.setState({ loading: true });
    
    QueryPositionInfo(params)
      .then(res => {
        const { records, count } = res;
        records.forEach((item, index) => {
          item.xh =
            (this.state.current - 1) * this.state.pageSize + (index + 1);
        });

        this.setState({ loading: false, total: count, dataSource: records });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };

  // 分页
  tableChange = (pageSize, current) => {
    this.setState({ pageSize: current, current: pageSize },()=>{
      this.queryToolInfos();
    });
  };

  render() {
    let locale = {
      emptyText: <TableLocale emptyText="抱歉，没有信息" />,
    };
    let { total, pageSize, current, dataSource, loading } = this.state;
    let incTitle = "客户近三月月均A股交易量*产品提佣率*12" ;
    let columns = [
      {
        title: "序号",
        dataIndex: "xh",
        key: "序号",
        width: 70,
        align: "center",
      },
      {
        title: "客户号",
        dataIndex: "custCode",
        key: "客户号",
        width: 120,
      },
      {
        title: "持仓客户姓名",
        dataIndex: "custName",
        key: "持仓客户姓名",
        width: 140,
        render: (text, record) => (
          <Link
            to={`/customerPanorama/customerInfo?customerCode=${record.custCode}`}
            target="_blank"
          >
            <div
              style={{
                color: "#244fff",
                cursor: "pointer",
                wordBreak: "break-all",
                whiteSpace: "normal",
              }}
            >
              {text}
            </div>
          </Link>
        ),
      },
      {
        title: "开户营业部",
        dataIndex: "depId",
        key: "开户营业部",
        width: 230,
      },
      {
        title: "所属分支",
        dataIndex: "orgId",
        key: "所属分支",
        width: 230,
      },
      {
        title: "总资产",
        dataIndex: "asset",
        key: "总资产",
        width: 130,
      },
      {
        title: "客户等级",
        dataIndex: "custLevel",
        key: "客户等级",
        width: 110,
      },
      {
        title: "风险等级",
        dataIndex: "riskLevel",
        key: "风险等级",
        width: 110,
      },
      {
        title: (
          <div className={styles.titletip}>
            <div>
              签约预估
              <br />
              年贡献
            </div>
            <Tooltip
              title={incTitle}
              getPopupContainer={() => document.getElementById("acltips")}
            >
              <img
                src={Calimg}
                alt=""
                style={{ width: 16, height: 16, marginLeft: 5 }}
              />
            </Tooltip>
          </div>
        ),
        dataIndex: "contributionYear",
        key: "签约预估年贡献",
        width: 130,
      },
      {
        title: "开发关系",
        dataIndex: "devRela",
        key: "开发关系",
        width: 140,
      },
      {
        title: "服务关系",
        dataIndex: "serviceRela",
        key: "服务关系",
        width: 140,
      },
      {
        title: "签约中产品",
        dataIndex: "subscriptionProduct",
        key: "签约中产品",
        width: 140,
      },
    ];
    const acltools = sessionStorage.getItem("acltools");
    const paramsStr = JSON.parse(DecryptBase64(acltools));

    const newGetColums = columns.filter(t => t.dataIndex !== "xh");
    const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
    const tableHeaderNames = newGetColums.map(item => item.key).join(",");
    const strategyToolPositionInfoModel = {
      activityTagListList: paramsStr.activityTagListList,
      companyTagListList: paramsStr.companyTagListList,
      staffTagListList: paramsStr.staffTagListList,
      custCode: paramsStr.custCode,
      custGroup: paramsStr.custGroup,
      custLevel: paramsStr.custLevel,
      custRange: paramsStr.custRange,
      pageCount: this.state.pageSize,
      pageNumber: this.state.current,
      sort: paramsStr.sort,
      stockCode: paramsStr.stockCode,
    };

    const exportPayload = JSON.stringify({
      strategyToolPositionInfoModel,
      tableHeaderNames,
      tableHeaderCodes,
    });
    return (
      <div className={styles.aclTool}>
        <Card bordered={false}>
          <div id="acltips">
            <ExportBtn
              exportPayload={exportPayload}
              total={total}
              action={queryStrategyToolPositionInfoExport}
              text="持仓客户"
              titles={paramsStr}
            />
            <EtableCheck
              columns={columns}
              dataSource={dataSource || []}
              loading={loading}
              rowKey=""
              options={{ locale: locale, scroll: { x: 1450 } }}
            />
          </div>
          <div style={{ float: "right", paddingTop: "16px" }}>
            <Epagination
              onChange={this.tableChange}
              options={{
                total: total,
                pageSize: pageSize,
                current: current,
              }}
            />
          </div>
        </Card>
      </div>
    );
  }
};

export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(OptionDetail);