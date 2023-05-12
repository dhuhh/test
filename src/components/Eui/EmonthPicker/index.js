import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import rili from "../assets/rili.svg";
import styles from "./index.less";

const { MonthPicker } = DatePicker;
export default function EmonthPicker(props) {
  /*
   *props : {options:{} ,style:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang(e) : 把输入的值返回父组件
   *
   *
   */

  const { options = {}, style = {}, onChange } = props;
  const [val, setVal] = useState(null);
  const [isOpens, setOpen] = useState(false);

  const dateChange = e => {
    // console.log(moment(e).format("YYYYMDD"));
    if (e === null) {
      setVal(null);
    } else {
      setOpen(false);
      setVal(moment(e));
      onChange(moment(e));
    }
  };
  const onOpenChange = status => {
    if (status) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  return (
    <MonthPicker
      className={`${styles.eMonthPicker} ${
        isOpens ? styles.eMonthPickers : ""
      }`}
      dropdownClassName={styles.eMonthPicker}
      monthCellContentRender={date => {
        return `${moment(date).format("M")}月`;
      }}
      onChange={dateChange}
      open={isOpens}
      value={val}
      onOpenChange={onOpenChange}
      showToday={false}
      format={"YYYY.M"}
      style={{ ...style }}
      {...options}
      allowClear
      suffixIcon={
        <img src={rili} alt="" style={{ width: "15px", height: "15px" }} />
      }
    />
  );
}
