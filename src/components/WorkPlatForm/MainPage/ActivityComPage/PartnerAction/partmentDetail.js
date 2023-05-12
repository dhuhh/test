import React, { useState, useEffect, useCallback } from "react";
import { Card, message, Tooltip, Icon, Table, Pagination } from "antd";
import { prefix } from "$utils/config";
import { connect } from "dva";
import { Link } from "dva/router";
import { DecryptBase64, EncryptBase64 } from "../../../../Common/Encrypt";
import partneraction from "$assets/activityComPage/partneraction.png";
import smallpartneraction from "$assets/activityComPage/smallpartneraction.png";

import {
  QueryNewValidCust,
  QueryMidAffluentCust,
  QueryMarginBalance,
  QueryFinancialProSale,
  QueryFundAdviseSign,
  QueryFullCommissionSign,
  QueryCustAuthQ2,
  QueryExportAuthQ2,
} from "$services/activityComPage";
import DetailExportTab from "./detailExportTab";
import CheckBoxs from './checkBoxs';
import styles from "./index.less";
import config from "$utils/config";
const { ftq } = config;
const {
  activityComPage: {
    exportNewValidCust,
    exportMidAffluentCust,
    exportNewCreditCustomerQ2,
    exportFinancialProSaleQ2,
    exportFundAdviseSign,
    exportFullCommissionSign,
  },
} = ftq;


const PartnerDetail = (props,deps)=> {
  const [changeBaner, setChangeBaner] = useState(false);
  const [pageParams, setPageParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState([]);
  const [action, setAction] = useState("");
  const [exParams, seExParams] = useState({});
  const [newValidFrom, setNewValidFrom] = useState("");
  const [midAffFrom, setMidAffFrom] = useState("");
  const [newCreditFrom, setNewCreditFrom] = useState("");
  const [fullCommSignFrom, setFullCommSignFrom] = useState("");
  const [authShowExport, setAuthShowExport] = useState(false); // 客户明细下--客户明细导出权限点
  const [authCustDetail, setCustDetail] = useState(false); // 新增跟管理员具有导出权限的员工权限点--客户明细导出
  const [authExportOther, setAuthOther] = useState(false); // 新增跟管理员具有导出权限的员工权限点--其他导出
  const [exportPerson , setExportPerson] = useState([]);
  const [exportCustomer, setExportCustomer] = useState([]);
  const { authorities = {} } = props;
  const { partnerAction = [] } = authorities;



  useEffect(() => {
    const paramsStr = JSON.parse(DecryptBase64(props.queryParams));
    setPageParams(paramsStr);
  }, []);


  useEffect(() => {
    let wid = document.body.clientWidth;
    if (wid > 1280) {
      setChangeBaner(false);
    } else {
      setChangeBaner(true);
    }
  }, []);
  //客户明细下--客户明细导出表格--权限点
  const getQueryCustAuth = (id,org) => {
    QueryCustAuthQ2({ staffId: id, orgId: org }).then(res => {
      const { data } = res;
      let param = data == "1" ? true : false;
      setAuthShowExport(param);
    });
  };
    // 新增跟管理员具有导出权限的员工权限点
  const getAdminShowExport = (org) => {
    QueryExportAuthQ2({ orgId: org ? org : 0 }).then(res => {
      const { data } = res;
      setCustDetail(data.authExportCustDetail);
      setAuthOther(data.authExportOther);
    });
  };

  const jumpRelation = (paramsStr) => {
    let authExportCustDetails = '';
    let authExportOthers = "";
    const paramsStrs = JSON.parse(DecryptBase64(props.queryParams));

    const uu = new Promise((resolve,reject)=>{
      QueryExportAuthQ2({ orgId: paramsStrs.orgId ? paramsStrs.orgId : 0 }).then(res => {
        const { data } = res;
        // console.log("33333333333333333333---", data.authExportCustDetail);
        // console.log("22222222222222222222---", data.authExportOther);
        authExportCustDetails = data.authExportCustDetail;
        authExportOthers = data.authExportOther;
        return resolve(data)
      });
      return
    });

    // let uu = QueryExportAuthQ2({ orgId: paramsStrs.orgId ? paramsStrs.orgId : 0 }).then(res => {
    //   const { data } = res;
    //   // console.log("33333333333333333333---", data.authExportCustDetail);
    //   // console.log("22222222222222222222---", data.authExportOther);
    //   authExportCustDetails = data.authExportCustDetail;
    //   authExportOthers = data.authExportOther;
    //   return data;

    // });
    console.log("无开发关系", partnerAction);
    console.log("无开发关系2--", authExportCustDetails);
    console.log("无开发关系3--", authExportOthers);
    console.log("无开发关系4", uu);

    return (
      <div>
        {partnerAction.includes("partnerAction_ToExcel") ||
        authShowExport ||
        authCustDetail ? (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            <span style={{ color: "#244FFF" }}>无开发关系</span>
          </Link>
        ) : (
          "无开发关系"
        )}
      </div>
    );
  };

  let em_yxhZs =
    "折算前新增有效户总数=证券端新开有效户+实际无效户激活数+IB端新开有效户+(新开私募产品户*3)";
  let em_yxhIb =
    "商品期货新增有效户标准：活动期间新开户且期货交易10手及以上；金融期货新增有效户标准：活动期间开户成功即算";

  let cu_zdfyZs =
    "新增中端富裕客户总数=证券端新开中端富裕客户+无效户激活转中端+(新开私募产品客户*3)+IB端新开中端富裕客户";
  let cu_khsZdfy =
    "新开中端富裕客户指活动期间在我司首次开立A股账户且活动期内在CRM打上“中端富裕客户”标签的客户（当日时点资产≥30万元），同一个客户在公司已有一个以上客户号，再新开的第二个客户号，不纳入统计（机构户和产品户除外）。销户再开户也不纳入统计";
  let cu_khsWxhjhZdfy =
    "无效户激活指活动期间在CRM打上“无效户激活”客户标签，且同时满足“中端富裕客户”标签的客户（当日时点资产≥30万元）。";
  let cu_zdfyIb = "活动期间新开期货户，资产净流入≥30万元。";

  let cu_zdfySmcp =
      "仅限私募基金（单一客户私募基金）、私募基金（多客户私募基金）、私募投资基金三类"; 

  let pr_cpxsZs =
    "活动口径销售额-合计 = (活动口径销量-系统内) + (活动口径销量-系统外) + (基金投顾组合购买量)";
  let he_khsJz = "净增签约有效户数=期末签约有效户数-活动期初签约有效户数";
  let si_v4QtyQysPm =
    "V4及以上交易型客户全提佣签约户数奖=全提佣签约户数（非GRT产品）+Alpha T签约户数+GRT签约户数+猎豹签约户数";
  const paramsStrs = JSON.parse(DecryptBase64(props.queryParams));
  let emNewaccount_partment = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
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
      width: 200,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-新增有效户-${record.name}`,
          tableType: "emNewaccount_person",
          orgId: record.id,
          staffId: "",
          showCheckBox: false,
          showExport: false,
          queryDate: paramsStrs.queryDate,
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
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>折算前新增有效户总数</div>
          <Tooltip title={em_yxhZs} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhZs",
      width: 180,
      key: "折算前新增有效户总数",
    },
    {
      title: "证券端-新开有效户",
      dataIndex: "khsYxh",
      width: 135,
      key: "证券端-新开有效户",
    },
    {
      title: "实际无效户激活数",
      dataIndex: "khsWxhjh",
      key: "实际无效户激活数",
      width: 130,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>新开私募产品户</div>
          <Tooltip title={cu_zdfySmcp} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhSmcp",
      key: "新开私募产品户",
      width: 140,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>IB端-新开有效户</div>
          <Tooltip title={em_yxhIb} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhIb",
      key: "IB端-新开有效户",
      width: 140,
    },
  ];
  let emNewaccount_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 190,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      key: "OA账号",
      width: 100,
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      key: "员工姓名",
      width: 100,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-新增有效户-${
            record.ryxm ? record.ryxm : "无开发关系"
          }`,
          tableType: "emNewaccount_customer",
          orgId: paramsStrs.orgId,
          staffId: record.ryid === "" ? "0" : record.ryid,
          showCheckBox: true,
          showExport: false,
          queryDate: paramsStrs.queryDate,
        };
        const paramsStr = JSON.stringify(params);
        return record.ryxm !== "无开发关系" ? (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        ) : (
          jumpRelation(
            paramsStr,
            authCustDetail,
            authExportOther,
            authShowExport
          )
        );
      },
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>折算前新增有效户总数</div>
          <Tooltip title={em_yxhZs} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhZs",
      width: 180,
      key: "折算前新增有效户总数",
    },
    {
      title: "证券端-新开有效户",
      dataIndex: "khsYxh",
      width: 140,
      key: "证券端-新开有效户",
    },
    {
      title: "实际无效户激活数",
      dataIndex: "khsWxhjh",
      key: "实际无效户激活数",
      width: 130,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>新开私募产品户</div>
          <Tooltip title={cu_zdfySmcp} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhSmcp",
      key: "新开私募产品户",
      width: 140,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>IB端-新开有效户</div>
          <Tooltip title={em_yxhIb} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "yxhIb",
      key: "IB端-新开有效户",
      width: 140,
    },
  ];
  let emNewaccount_customer = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号",
      width: 118,
    },
    {
      title: "客户姓名",
      dataIndex: "khxm",
      key: "客户姓名",
      width: 118,
    },
    {
      title: "新增有效户来源",
      dataIndex: "tzlx",
      width: 141,
      key: "新增有效户来源",
    },
    {
      title: "开户时间",
      dataIndex: "khrq",
      width: 141,
      key: "开户时间",
    },
    {
      title: "转有效户时间",
      dataIndex: "gxrq",
      key: "转有效户时间",
      width: 141,
    },
  ];
  let emCustomers_partment = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
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
      width: 200,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-新增中端富裕客户-${record.name}`,
          tableType: "emCustomers_person",
          orgId: record.id,
          staffId: "",
          showCheckBox: false,
          showExport: false,
          queryDate: paramsStrs.queryDate,
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
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新增中端富
            <br />
            裕客户总数
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
      width: 110,
      key: "新增中端富裕客户总数",
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
      width: 130,
      key: "证券端-新开中端富裕客户",
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            无效户激
            <br />
            活转中端
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
      width: 100,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新开私募
            <br />
            产品账号
          </div>
          <Tooltip title={cu_zdfySmcp} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "zdfySmcp",
      key: "新开私募产品账号",
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
          <Tooltip title={cu_zdfyIb} placement="bottom">
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
  ];
  let emCustomers_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 200,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      key: "OA账号",
      width: 100,
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      key: "员工姓名",
      width: 100,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-新增中端富裕客户-${
            record.ryxm ? record.ryxm : "无开发关系"
          }`,
          tableType: "emCustomers_customer",
          orgId: paramsStrs.orgId,
          staffId: record.ryid === "" ? "0" : record.ryid,
          showCheckBox: true,
          showExport: false,
          queryDate: paramsStrs.queryDate,
        };
        const paramsStr = JSON.stringify(params);
        return record.ryxm !== "" ? (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        ) : (
          // "无开发关系"
          jumpRelation(paramsStr)
        );
      },
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            新增中端富
            <br />
            裕客户总数
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
      width: 120,
      key: "新增中端富裕客户总数",
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
      width: 141,
      key: "证券端-新开中端富裕客户",
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            无效户激
            <br />
            活转中端
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
      width: 100,
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
          <Tooltip title={cu_zdfySmcp} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "zdfySmcp",
      key: "新开私募产品户",
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
          <Tooltip title={cu_zdfyIb} placement="bottom">
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
  ];
  let emCustomers_customer = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号",
      width: 120,
    },
    {
      title: "客户姓名",
      dataIndex: "khxm",
      key: "客户姓名",
      width: 120,
    },
    {
      title: "新增中端富裕客户来源",
      dataIndex: "tzlx",
      width: 160,
      key: "新增中端富裕客户来源",
    },
    {
      title: "开户时间",
      dataIndex: "khrq",
      width: 110,
      key: "开户时间",
    },
  ];
  let emSecurities_partment = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66
    },
    {
      title: "分支号",
      dataIndex: "id",
      key: "分支号"
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部"
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
      key: "两融日均余额增长规模(亿元)"
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
      key: "当前两融日均余额(亿元)"
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
  let emProductsales_partment = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "分支号",
      dataIndex: "id",
      key: "分支号",
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 180,
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
          <Tooltip title={pr_cpxsZs} placement="bottomLeft">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "cpxsZs",
      key: "活动口径销售额-合计(万元)",
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
      key: "保有规模增长(亿元)",
    },
    {
      title: (
        <div>
          当前理财产品保
          <br />
          有规模(亿元)
        </div>
      ),
      dataIndex: "bygmDq",
      key: "当前理财产品保有规模(亿元)",
    },
    {
      title: (
        <div>
          3月月日均保
          <br />
          有规模(亿元)
        </div>
      ),
      dataIndex: "rjByl03",
      key: "3月月日均保有规模(亿元)",
    },
  ];
  let emHeadband_partment = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "分支号",
      dataIndex: "id",
      key: "分支号",
      width: 118,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 200,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-基金投顾-${record.name}`,
          tableType: "emHeadband_person",
          orgId: record.id,
          staffId: "",
          showCheckBox: false,
          showExport: false,
          queryDate: paramsStrs.queryDate,
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
      title: "期末签约总户数(户)",
      dataIndex: "khsQm",
      key: "期末签约总户数(户)",
      width: 145,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>净增签约有效户数(户)</div>
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
      width: 185,
    },
    {
      title: "活动期初签约有效户数",
      dataIndex: "khsQyq",
      key: "活动期初签约有效户数",
      width: 160,
    },
    {
      title: "月日均保有资产(万元)",
      dataIndex: "zzcJjtg",
      key: "月日均保有资产(万元)",
      width: 160,
    },
  ];
  let emHeadband_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 228,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      key: "OA账号",
      width: 118,
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      key: "员工姓名",
      width: 118,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-基金投顾-${
            record.ryxm ? record.ryxm : "无开发关系"
          }`,
          tableType: "emHeadband_customer",
          orgId: paramsStrs.orgId,
          staffId: record.ryid === "" ? "0" : record.ryid,
          showCheckBox: true,
          showExport: false,
          queryDate: paramsStrs.queryDate,
        };
        const paramsStr = JSON.stringify(params);
        return record.ryxm !== "" ? (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        ) : (
          // "无开发关系"
          jumpRelation(paramsStr)
        );
      },
    },
    {
      title: "期末签约总户数(户)",
      dataIndex: "khsQm",
      key: "期末签约总户数(户)",
      width: 145,
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>净增签约有效户数(户)</div>
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
      width: 180,
    },
    {
      title: "活动期初签约有效户数",
      dataIndex: "khsQyq",
      key: "活动期初签约有效户数",
      width: 165,
    },
    {
      title: "月日均保有资产(万元)",
      dataIndex: "zzcJjtg",
      key: "月日均保有资产(万元)",
      width: 160,
    },
  ];
  let emHeadband_customer = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号",
      width: 130,
    },
    {
      title: "客户姓名",
      dataIndex: "khxm",
      key: "客户姓名",
      width: 130,
    },
    {
      title: "月日均保有资产(万元)",
      dataIndex: "zzcJjtg",
      key: "月日均保有资产(万元)",
      width: 160,
    },
  ];
  let emSigning_partment = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "分支号",
      dataIndex: "id",
      key: "分支号",
      width: 118,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 200,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-全提佣签约-${record.name}`,
          tableType: "emSigning_person",
          orgId: record.id,
          staffId: "",
          showCheckBox: false,
          showExport: false,
          queryDate: paramsStrs.queryDate,
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
          V4及以上交易型客
          <br />
          户全提佣签约总数
        </div>
      ),
      dataIndex: "khsZs",
      key: "V4及以上交易型客户全提佣签约总数",
      width: 150,
    },
    {
      title: (
        <div>
          全提佣签约户数
          <br />
          (非GRT产品)
        </div>
      ),
      dataIndex: "khsQty",
      key: "全提佣签约户数(非GRT产品)",
      width: 130,
    },
    {
      title: "AlphaT签约户数",
      dataIndex: "khsAlphat",
      key: "AlphaT签约户数",
      width: 130,
    },
    {
      title: "GRT签约户数",
      dataIndex: "khsGrt",
      key: "GRT签约户数",
      width: 110,
    },
    {
      title: "猎豹签约户数",
      dataIndex: "khsLb",
      key: "猎豹签约户数",
      width: 110,
    },
  ];
  let emSigning_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 228,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      key: "OA账号",
      width: 118,
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      key: "员工姓名",
      width: 118,
      render: (text, record) => {
        const params = {
          pageTitle: `分支机构奖项-全提佣签约-${
            record.ryxm ? record.ryxm : "无开发关系"
          }`,
          tableType: "emSigning_customer",
          orgId: paramsStrs.orgId,
          staffId: record.ryid === "" ? "0" : record.ryid,
          showCheckBox: true,
          showExport: false,
          queryDate: paramsStrs.queryDate,
        };
        const paramsStr = JSON.stringify(params);
        return record.ryxm !== "" ? (
          <Link
            to={`${prefix}/single/PartnerDetail/${EncryptBase64(paramsStr)}`}
            target="_blank"
          >
            {text}
          </Link>
        ) : (
          // "无开发关系"
          jumpRelation(paramsStr)
        );
      },
    },
    {
      title: (
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div>
            V4及以上交易型客
            <br />
            户全提佣签约总数
          </div>
          <Tooltip title={si_v4QtyQysPm} placement="bottom">
            <Icon
              style={{ marginLeft: 5, color: "#794B00" }}
              type="question-circle"
            />
          </Tooltip>
        </div>
      ),
      dataIndex: "khsZs",
      key: "V4及以上交易型客户全提佣签约总数",
      width: 160,
    },
    {
      title: (
        <div>
          全提佣签约户数
          <br />
          (非GRT产品)
        </div>
      ),
      dataIndex: "khsQty",
      key: "全提佣签约户数(非GRT产品)",
      width: 130,
    },
    {
      title: "AlphaT签约户数",
      dataIndex: "khsAlphat",
      key: "AlphaT签约户数",
      width: 130,
    },
    {
      title: "GRT签约户数",
      dataIndex: "khsGrt",
      key: "GRT签约户数",
      width: 110,
    },
    {
      title: "猎豹签约户数",
      dataIndex: "khsLb",
      key: "猎豹签约户数",
      width: 110,
    },
  ];
  let emSigning_customer = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号",
      width: 130,
    },
    {
      title: "客户姓名",
      dataIndex: "khxm",
      key: "客户姓名",
      width: 130,
    },
    {
      title: "全提佣签约客户来源",
      dataIndex: "tzlx",
      key: "全提佣签约客户来源",
      width: 150,
    },
  ];
  let paHeadband_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "营业部",
      dataIndex: "name",
      key: "营业部",
      width: 228,
    },
    {
      title: "OA账号",
      dataIndex: "rybh",
      key: "OA账号",
      width: 118,
    },
    {
      title: "员工姓名",
      dataIndex: "ryxm",
      key: "员工姓名",
      width: 118,
      render: text => text || "无开发关系",
    },
    {
      title: "净增保有资产(万元)",
      dataIndex: "zzcJzJjtg",
      width: 145,
      key: "净增保有资产(万元)",
    },
    {
      title: "期末保有资产(万元)",
      dataIndex: "zzcJjtg",
      key: "期末保有资产(万元)",
      width: 145,
    },
    {
      title: (
        <div>
          活动期初保有
          <br />
          资产(万元)
        </div>
      ),
      dataIndex: "zzcQcJjtg",
      key: "活动期初保有资产(万元)",
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
      width: 115,
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
      width: 85,
    },

    {
      title: (
        <div>
          活动期初签约
          <br />
          有效户数(户)
        </div>
      ),
      dataIndex: "khsQyq",
      key: "活动期初签约有效户数(户)",
      width: 110,
    },
  ];
  let peProductsales_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "客户",
      dataIndex: "khxm",
      key: "客户",
      width: 131,
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号",
      width: 131,
    },
    {
      title: "产品",
      dataIndex: "cpjc",
      key: "产品",
      width: 131,
    },
    {
      title: "理财产品实际销售额(元)",
      dataIndex: "qrje",
      width: 210,
      key: "理财产品实际销售额(元)",
    },
  ];
  let peHeadband_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66,
    },
    {
      title: "客户",
      dataIndex: "khxm",
      key: "客户",
      width: 131,
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号",
      width: 131,
    },
    {
      title: "签约时间",
      dataIndex: "qysj",
      key: "签约时间",
      width: 131,
    },
    {
      title: "签约产品",
      dataIndex: "qycp",
      width: 131,
      key: "签约产品",
    },
  ];
  let peNewaccount_person = [
    {
      title: "序号",
      dataIndex: "xhno",
      key: "序号",
      width: 66
    },
    {
      title: "客户号",
      dataIndex: "khh",
      key: "客户号"
    },
    {
      title: "客户姓名",
      dataIndex: "khxm",
      key: "客户姓名"
    },
    {
      title: "开户时间",
      dataIndex: "khrq",
      key: "开户时间"
    },
    {
      title: "转有效户时间",
      dataIndex: "gxrq",
      key: "转有效户时间"
    }
  ];

  const fetchData = useCallback(
    (payload = {}) => {
      const paramsStr = JSON.parse(DecryptBase64(props.queryParams));
      if (paramsStr.staffId !== "") {
        getQueryCustAuth(paramsStr.staffId, paramsStr.orgId);
      }
      getAdminShowExport(paramsStr.orgId);
      setLoading(true);
      const prams = {
        current,
        orgId: "",
        pageSize,
        paging: 1,
        queryDate: paramsStr.queryDate,
        sort: "",
        staffId: "",
        summaryType: "",
      };
      // 分支机构奖项--新增有效户--营业部明细
      if (paramsStr.tableType === "emNewaccount_partment") {
        prams["summaryType"] = "2";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "yxhZs_DESC";
        seExParams({
          summaryType: "2",
          orgId: paramsStr.orgId,
          sort: "yxhZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emNewaccount_partment);
        setExportPerson(emNewaccount_person);
        setExportCustomer(emNewaccount_customer);
        setAction(exportNewValidCust);
        return QueryNewValidCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--新增有效户--员工明细
      } else if (paramsStr.tableType === "emNewaccount_person") {
        prams["summaryType"] = "3";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "yxhZs_DESC";
        seExParams({
          summaryType: "3",
          orgId: paramsStr.orgId,
          sort: "yxhZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emNewaccount_person);
        setExportCustomer(emNewaccount_customer);
        setAction(exportNewValidCust);
        return QueryNewValidCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--新增有效户--客户明细
      } else if (paramsStr.tableType === "emNewaccount_customer") {
        prams["summaryType"] = "4";
        prams["staffId"] = paramsStr.staffId;
        prams["orgId"] = paramsStr.orgId;
        prams["newValidFrom"] = newValidFrom;
        seExParams({
          summaryType: "4",
          staffId: paramsStr.staffId,
          orgId: paramsStr.orgId,
          queryDate: paramsStr.queryDate,
        });
        setColumns(emNewaccount_customer);
        setAction(exportNewValidCust);
        return QueryNewValidCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--新增中端富裕客户--营业部明细
      } else if (paramsStr.tableType === "emCustomers_partment") {
        prams["summaryType"] = "2";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "zdfyZs_DESC";
        seExParams({
          summaryType: "2",
          orgId: paramsStr.orgId,
          sort: "zdfyZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emCustomers_partment);
        setExportPerson(emCustomers_person);
        setExportCustomer(emCustomers_customer);
        setAction(exportMidAffluentCust);
        return QueryMidAffluentCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--新增中端富裕客户--员工明细
      } else if (paramsStr.tableType === "emCustomers_person") {
        prams["summaryType"] = "3";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "zdfyZs_DESC";
        seExParams({
          summaryType: "3",
          orgId: paramsStr.orgId,
          sort: "zdfyZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emCustomers_person);
        setExportCustomer(emCustomers_customer);
        setAction(exportMidAffluentCust);
        return QueryMidAffluentCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--新增中端富裕客户--客户明细
      } else if (paramsStr.tableType === "emCustomers_customer") {
        prams["summaryType"] = "4";
        prams["staffId"] = paramsStr.staffId;
        prams["orgId"] = paramsStr.orgId;
        prams["midAffFrom"] = midAffFrom;
        seExParams({
          summaryType: "4",
          staffId: paramsStr.staffId,
          orgId: paramsStr.orgId,
          queryDate: paramsStr.queryDate,
        });
        setColumns(emCustomers_customer);
        setAction(exportMidAffluentCust);
        return QueryMidAffluentCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--融资融券--营业部明细
      } else if (paramsStr.tableType === "emSecurities_partment") {
        prams["summaryType"] = "2";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "zzgmLrye_DESC";
        seExParams({
          summaryType: "2",
          orgId: paramsStr.orgId,
          sort: "zzgmLrye_DESC",
          queryDate: paramsStr.queryDate
        });
        setColumns(emSecurities_partment);
        setAction(exportNewCreditCustomerQ2);
        return QueryMarginBalance(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--理财销售产品--营业部明细
      } else if (paramsStr.tableType === "emProductsales_partment") {
        prams["summaryType"] = "2";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "cpxsZs_DESC";
        seExParams({
          summaryType: "2",
          orgId: paramsStr.orgId,
          sort: "cpxsZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emProductsales_partment);
        setAction(exportFinancialProSaleQ2);
        return QueryFinancialProSale(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--基金投顾--营业部明细
      } else if (paramsStr.tableType === "emHeadband_partment") {
        prams["summaryType"] = "2";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "khsJz_DESC";
        seExParams({
          summaryType: "2",
          orgId: paramsStr.orgId,
          sort: "khsJz_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emHeadband_partment);
        setExportPerson(emHeadband_person);
        setExportCustomer(emHeadband_customer);
        setAction(exportFundAdviseSign);
        return QueryFundAdviseSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--基金投顾--员工明细
      } else if (paramsStr.tableType === "emHeadband_person") {
        prams["summaryType"] = "3";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "khsJz_DESC";
        seExParams({
          summaryType: "3",
          orgId: paramsStr.orgId,
          sort: "khsJz_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emHeadband_person);
        setExportCustomer(emHeadband_customer);
        setAction(exportFundAdviseSign);
        return QueryFundAdviseSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--基金投顾--客户明细
      } else if (paramsStr.tableType === "emHeadband_customer") {
        prams["summaryType"] = "4";
        prams["staffId"] = paramsStr.staffId;
        prams["orgId"] = paramsStr.orgId;
        seExParams({
          summaryType: "4",
          staffId: paramsStr.staffId,
          orgId: paramsStr.orgId,
          queryDate: paramsStr.queryDate,
        });
        setColumns(emHeadband_customer);
        setAction(exportFundAdviseSign);
        return QueryFundAdviseSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--全提佣签约--营业部明细
      } else if (paramsStr.tableType === "emSigning_partment") {
        prams["summaryType"] = "2";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "khsZs_DESC";
        seExParams({
          summaryType: "2",
          orgId: paramsStr.orgId,
          sort: "khsZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emSigning_partment);
        setExportPerson(emSigning_person);
        setExportCustomer(emSigning_customer);
        setAction(exportFullCommissionSign);
        return QueryFullCommissionSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--全提佣签约--员工明细
      } else if (paramsStr.tableType === "emSigning_person") {
        prams["summaryType"] = "3";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "khsZs_DESC";
        seExParams({
          summaryType: "3",
          orgId: paramsStr.orgId,
          sort: "khsZs_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(emSigning_person);
        setExportCustomer(emSigning_customer);
        setAction(exportFullCommissionSign);
        return QueryFullCommissionSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        //分支机构奖项--全提佣签约--客户明细
      } else if (paramsStr.tableType === "emSigning_customer") {
        prams["summaryType"] = "4";
        prams["staffId"] = paramsStr.staffId;
        prams["orgId"] = paramsStr.orgId;
        prams["fullCommSignFrom"] = fullCommSignFrom;
        seExParams({
          summaryType: "4",
          staffId: paramsStr.staffId,
          orgId: paramsStr.orgId,
          queryDate: paramsStr.queryDate,
          fullCommSignFrom: fullCommSignFrom,
        });
        setColumns(emSigning_customer);
        setAction(exportFullCommissionSign);
        return QueryFullCommissionSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        //营业部部组织--基金投顾--员工明细
      } else if (paramsStr.tableType === "paHeadband_person") {
        prams["summaryType"] = "6";
        prams["orgId"] = paramsStr.orgId;
        prams["sort"] = "zzcJzJjtg_DESC";
        seExParams({
          summaryType: "6",
          orgId: paramsStr.orgId,
          sort: "zzcJzJjtg_DESC",
          queryDate: paramsStr.queryDate,
        });
        setColumns(paHeadband_person);
        setAction(exportFundAdviseSign);
        return QueryFundAdviseSign(prams).then(res => {
          setLoading(false);
          return res;
        });
        // 员工个人奖--新开有效户--客户明细
      } else if (paramsStr.tableType === "peNewaccount_person") {
        prams["summaryType"] = "4";
        prams["staffId"] = paramsStr.staffId;
        prams["newValidFrom"] = newValidFrom;
        seExParams({
          summaryType: "4",
          staffId: paramsStr.staffId,
          queryDate: paramsStr.queryDate,
        });
        setColumns(peNewaccount_person);
        setAction(exportNewValidCust);
        return QueryNewValidCust(prams).then(res => {
          setLoading(false);
          return res;
        });
        // 员工个人奖--理财产品销售--客户明细
      } else if (paramsStr.tableType === "peProductsales_person") {
        prams["summaryType"] = "4";
        prams["staffId"] = paramsStr.staffId;
        seExParams({
          summaryType: "4",
          staffId: paramsStr.staffId,
          queryDate: paramsStr.queryDate,
        });
        setColumns(peProductsales_person);
        setAction(exportFinancialProSaleQ2);
        return QueryFinancialProSale(prams).then(res => {
          setLoading(false);
          return res;
        });
        //员工个人奖--基金投顾--客户明细
      } else if (paramsStr.tableType === "peHeadband_person") {
        prams["summaryType"] = "8";
        prams["staffId"] = paramsStr.staffId;
        seExParams({
          summaryType: "8",
          staffId: paramsStr.staffId,
          queryDate: paramsStr.queryDate,
        });
        setColumns(peHeadband_person);
        setAction(exportFundAdviseSign);
        return QueryFundAdviseSign(prams).then(res => {
          setLoading(false);
          return res;
        });
      }
    },
    [current,
      pageSize,
      newValidFrom,
      midAffFrom,
      newCreditFrom,
      fullCommSignFrom,
    ]
  );

  useEffect(() => {
    fetchData()
      .then(res => {
        const { records = [], total = 0 } = res;
        records.forEach((item, index) => {
          item.xhno = (current - 1) * pageSize + index + 1 + "";
        });
        setDataSource(records);
        setTotal(total);
      })
      .catch(err => {
        setLoading(false);
        return message.error(err.note || err.message);
      });
  }, [
    current,
    pageSize,
    fetchData,
  ]);

  // 分页
  const handleTableChange = (p, c) => {
    setCurrent(p);
    setPageSize(c);
  };

  const tableProps = {
    dataSource,
    columns,
    loading,
    className: `${styles.tabs} ${styles.dateilTab}`,
    scroll: { x: true },
    pagination: false,
  };

  const newGetColums = columns.filter(t => t.dataIndex !== "xhno");
  const tableHeaderCodes = newGetColums.map(item => item.dataIndex).join(",");
  const tableHeaderNames = newGetColums.map(item => item.key).join(",");
  const queryModel = exParams;

  const exportPayload = JSON.stringify({
    queryModel,
    tableHeaderNames,
    tableHeaderCodes,
  });
  const params = JSON.parse(DecryptBase64(props.queryParams));
  return (
    <React.Fragment>
      <Card
        className="ax-card"
        bodyStyle={{
          padding: "0 0 40px 0"
        }}
      >
        <div
          className={
            changeBaner ? styles.head_panner_small : styles.head_panner
          }
          style={{
            backgroundImage: changeBaner
              ? `url(${smallpartneraction})`
              : `url(${partneraction})`
          }}
        ></div>
        <div style={{ marginTop: "-40px", background: "#fff" }}>
          <div
            style={{ left: 0 }}
            className={
              changeBaner ? styles.margin_top_small : styles.margin_top
            }
          ></div>

          <div className={`${styles.basic_box} ${styles.tabs}`}>
            <div>
              <DetailExportTab
                pageTitle={pageParams.pageTitle}
                showExport={pageParams.showExport}
                exportPayload={exportPayload}
                total={total}
                action={action}
                authShowExport={authShowExport}
                authCustDetail={authCustDetail}
                authExportOther={authExportOther}
                pageParams={pageParams}
                exportPerson={exportPerson}
                exportCustomer={exportCustomer}
                exParams={exParams}
              />
              {pageParams.showCheckBox && (
                <CheckBoxs
                  setNewValidFrom={setNewValidFrom}
                  setMidAffFrom={setMidAffFrom}
                  setNewCreditFrom={setNewCreditFrom}
                  setFullCommSignFrom={setFullCommSignFrom}
                  params={params}
                />
              )}
              <Table
                {...tableProps}
                columns={columns}
                key={params.tableType}
              ></Table>
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
          </div>
          <div
            style={{ right: 0 }}
            className={
              changeBaner ? styles.margin_top_small : styles.margin_top
            }
          ></div>
        </div>
      </Card>
    </React.Fragment>
  );
};
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(PartnerDetail);
