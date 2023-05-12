import React, { useState, useEffect } from "react";
import { Checkbox } from "antd";

export default function CheckBoxs(props) {

  const [myCusGroup , setMyCusGroup] = useState([]);

  const emNewaccount = [
    { khqid: "1", khqmc: "证券端-新开有效户" },
    { khqid: "2", khqmc: "实际无效户激活数" },
    { khqid: "3", khqmc: "IB端-新开有效户" },
    { khqid: "4", khqmc: "新开私募产品户" },
  ];

  const emCustomers = [
    { khqid: "1", khqmc: "证券端-新开中端富裕客户" },
    { khqid: "2", khqmc: "无效户激活转中端" },
    { khqid: "3", khqmc: "IB端-新开中端富裕客户" },
    { khqid: "4", khqmc: "新开私募产品户" },
  ];
  const pmCustomers = [
    { khqid: "1", khqmc: "证券端-新开中端富裕客户" },
    // { khqid: "2", khqmc: "证券端-无效户激活转中端" },
    { khqid: "3", khqmc: "IB端-新开中端富裕客户" },
    { khqid: "4", khqmc: "安信国际端-新开中端富裕客户" },
  ];

  const emSecurities = [
    { khqid: "1", khqmc: "个人-存量新开信用账户" },
    { khqid: "2", khqmc: "机构-存量新开信用账户" },
    { khqid: "3", khqmc: "个人-新开户且开通信用账户" },
    { khqid: "4", khqmc: "机构-新开户且开通信用账户" },
    { khqid: "5", khqmc: "存量信用账户激活" },
    { khqid: "6", khqmc: "新开信用账户且开期权账户" },
    { khqid: "7", khqmc: "“博衍杯”全国ETF及期权交易大赛" },
    { khqid: "8", khqmc: "新开北交所权限" },
  ];

  const emSigning = [
    { khqid: "1", khqmc: "全提佣签约（非GRT产品）" },
    { khqid: "2", khqmc: "Alpha T签约" },
    { khqid: "3", khqmc: "GRT签约" },
    { khqid: "4", khqmc: "猎豹签约" },
  ];

  useEffect(()=>{
    if (props.params.tableType === "emNewaccount_customer") {
      setMyCusGroup(emNewaccount);
    }
    if (props.params.tableType === "emCustomers_customer" ){
      setMyCusGroup(emCustomers);
    }
    if (props.params.tableType === "peCustomers_partment") {
      setMyCusGroup(pmCustomers);
    }
    if (props.params.tableType === "emSecurities_customer"){
      setMyCusGroup(emSecurities);
    }
    if (props.params.tableType === "emSigning_customer") {
      setMyCusGroup(emSigning);
    }
  },[]);

  const tableChange = (a) =>{
    
    if (props.params.tableType === "emNewaccount_customer") {
      props.setNewValidFrom(a.join(","));
    }
    if (
      props.params.tableType === "emCustomers_customer" ||
      props.params.tableType === "peCustomers_partment"
    ) {
      props.setMidAffFrom(a.join(","));
    }
    if (props.params.tableType === "emSecurities_customer") {
      props.setNewCreditFrom(a.join(","));
    }
    if (props.params.tableType === "emSigning_customer") {
      props.setFullCommSignFrom(a.join(","));
    }
  };
  
  return (
    <React.Fragment>
      <Checkbox.Group
        className="m-checkbox-group-popup three"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "0 16px",
        }}
        onChange={a => {
          tableChange(a);
        }}
      >
        {myCusGroup.map(item => (
          <Checkbox
            style={{ paddingRight: "30px" }}
            key={item.khqid}
            value={item.khqid}
          >
            {item.khqmc}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </React.Fragment>
  );
}
