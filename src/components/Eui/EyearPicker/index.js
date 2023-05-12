import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import rili from "../assets/rili.svg";
import styles from "./index.less";
export default function EyearPicker(props) {
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

  const onPanelChange = e => {
    setOpen(false);
    setVal(moment(e));
    onChange(moment(e));
  };
  const dateChange = e => {
    setVal(null);
  };
  const onOpenChange = status => {
    if (status) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  return (
    <DatePicker
      className={styles.eYearPicker}
      dropdownClassName={styles.eYearPicker}
      onChange={dateChange}
      showToday={false}
      open={isOpens}
      value={val}
      format={"YYYY"}
      style={{ ...style }}
      placeholder={"请选择年份"}
      onOpenChange={onOpenChange}
      onPanelChange={onPanelChange}
      mode="year"
      {...options}
      allowClear
      suffixIcon={
        <img src={rili} alt="" style={{ width: "15px", height: "15px" }} />
      }
    />
  );
}
