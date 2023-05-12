import React from "react";
import { Table } from "antd";
import styles from "./index.less";
export default function Etable(props) {
  /*
   *props : {options:{} onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang(e) : 把输入的值返回父组件
   *
   */

  const { options = {} } = props;

  const tableProps = {
    className: styles.eTableSmall,
    pagination: false,
    bordered: false
  };

  return <Table {...options} {...tableProps}></Table>;
}
