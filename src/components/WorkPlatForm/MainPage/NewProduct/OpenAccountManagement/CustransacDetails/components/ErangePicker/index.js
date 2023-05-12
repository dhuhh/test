import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import rili from "../assets/rili.svg";
import styles from "./index.less";

const { RangePicker } = DatePicker;
export default function ErangePicker(props) {
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
  const [val, setVal] = useState([null, null]);
  const [isOpens, setOpen] = useState(false);
  const dateChange = e => {
    if (e === null) {
      setVal([null, null]);
    } else {
      setOpen(false);
      setVal(e);
      onChange(e);
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
    <RangePicker
      className={`${styles.eRangePicker} ${
        isOpens ? styles.eRangePickers : ""
      }`}
      dropdownClassName={styles.eRangePicker}
      onChange={dateChange}
      showToday={false}
      format={"YYYY.M.D"}
      separator="至"
      open={isOpens}
      value={val}
      onOpenChange={onOpenChange}
      style={{ ...style }}
      {...options}
      allowClear={false}
      suffixIcon={
        <img src={rili} alt="" style={{ width: "15px", height: "15px" }} />
      }
    />
  );
}
