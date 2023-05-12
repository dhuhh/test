import React, { useState, useEffect } from "react";
import { DatePicker, Row, Col } from "antd";
import moment from "moment";
import rili from "../assets/rili.svg";
import styles from "./index.less";

const { RangePicker } = DatePicker;
export default function ErangeMonthPicker(props) {
  /*
   *props : {options:{} ,style:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang(e) : 把输入的值返回父组件
   *
   *mode='month' 注意一下两点
   *
   *ps:组件选好时间后须在空白地方点击一下下面面板才会消失
   *ps:disabledTime这个属性会失效 mode='month'
   */

  const { options = {}, style = {}, onChange } = props;
  const [val, setVal] = useState([null, null]);
  const [isOpens, setOpen] = useState(false);

  const dateChange = e => {
    setVal([null, null]);
    onChange([]);
  };

  const onPanelChange = e => {
    setVal(e);
    onChange(e);
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
      className={`${styles.eRangeMonthPicker} ${
        isOpens ? styles.eRangeMonthPickers : ""
      }`}
      dropdownClassName={styles.eRangeMonthPicker}
      onChange={dateChange}
      open={isOpens}
      value={val}
      showToday={false}
      format={"YYYY.M"}
      mode={["month", "month"]}
      onOpenChange={onOpenChange}
      onPanelChange={onPanelChange}
      separator="至"
      style={{ ...style }}
      {...options}
      allowClear
      suffixIcon={
        <img
          src={rili}
          alt=""
          style={{
            width: "15px",
            height: "15px"
          }}
        />
      }
    />
  );
}
