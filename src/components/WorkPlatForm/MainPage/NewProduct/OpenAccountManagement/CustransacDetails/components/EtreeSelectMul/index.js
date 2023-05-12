import React, { useState } from "react";
import { TreeSelect } from "antd";
import Down from "../assets/down.svg";
import Up from "../assets/up.svg";
import styles from "./index.less";
export default function EtreeSelectMul(props) {
  /*
   *props : {options:{} onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *option.value : 回显到筛选框里面的值
   * 
   *onChang(e) : 把输入的值返回父组件
   *
   * treeData :数据源及结构 [{name:'',value:'',children:[{name:'',value:''}]}]
   *
   */

  const { options = {}, treeData = [], onChange } = props;
  const [isDown, setDown] = useState(true); //判断下拉框三角图标向上还是向下

  const maxTagPlaceholder = value => {
    const num = 1 + value.length;
    return (
      <span
        style={{
          color: "#FF6E30 ",
        }}
      >
        ...等{num}项
      </span>
    );
  };
  const filterTreeNode = (inputValue, treeNode) => {
    let item = treeNode?.props;
    if (
      item.title.indexOf(inputValue) > -1 ||
      item.value.indexOf(inputValue) > -1
    ) {
      return true;
    }
  };
  const handleChange = (value, label, extra) => {
    onChange(value, label, extra);
  };

  const onDropdown = open => {
    if (open) {
      setDown(false);
    } else {
      setDown(true);
    }
  };

  return (
    <div
      id="down"
      style={{
        display: "inline-block",
        position: "relative",
        verticalAlign: "super",
      }}
    >
      <TreeSelect
        {...options}
        treeData={treeData ? treeData : []}
        className={styles.eTreeSelectMul}
        dropdownClassName={styles.eTreeSelectMul}
        dropdownStyle={{
          maxHeight: 270,
          overflowY: "auto",
        }}
        filterTreeNode={filterTreeNode}
        placeholder="请选择"
        showArrow={false}
        allowClear
        value={options.value}
        autoClearSearchValue
        maxTagCount={1}
        maxTagPlaceholder={maxTagPlaceholder}
        onDropdownVisibleChange={onDropdown}
        maxTagTextLength={8}
        onChange={handleChange}
      ></TreeSelect>
      <img
        src={isDown ? Down : Up}
        alt=""
        style={{
          position: "absolute",
          width: "16px",
          top: "8px",
          right: "10px",
        }}
      />
    </div>
  );
}
