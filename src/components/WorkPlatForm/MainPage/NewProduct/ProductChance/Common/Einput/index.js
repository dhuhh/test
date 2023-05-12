import React, { useState } from "react";
import { Input, Tooltip } from "antd";
import styles from "./index.less";
export default function Einput(props) {
  /*
   *props : {options:{} ,style:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang(e) : 把输入的值返回父组件
   *
   *
   *
   */
  const [val, setVal] = useState("");
  const [textWid, setTextWid] = useState(0);

  const { options = {}, style = {}, onChange } = props;

  const inputChange = e => {
    setVal(e.target.value);
    // 计算输字符串的文本宽度
    valueWidth(e.target.value);
    // 把输入的值返回父组件
    onChange(e.target.value);
  };
  const valueWidth = val => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "PingFangSC-Regular, PingFang SC";
    const textWid = context.measureText(val).width;
    setTextWid(textWid);
  };

  return (
    <div className={`${styles.eInput}`} id="inputool">
      <Tooltip
        title={textWid > 140 ? val : ""}
        getPopupContainer={() => document.getElementById("inputool")}
      >
        <Input
          allowClear
          onChange={inputChange}
          style={{ ...style }}
          {...options}
          placeholder={options.placeholder ? options.placeholder : "请输入"}
        />
      </Tooltip>
    </div>
  );
}
