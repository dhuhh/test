import React, { useState } from "react";
import { Select, Checkbox } from "antd";
import Down from "../assets/down.svg";
import Up from "../assets/up.svg";
import styles from "./index.less";
const { Option } = Select;
export default function EselectCheck(props) {
  /*
   *props : {options:{} ,style:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *option.value : 回显到筛选框里面的值
   * 
   *onChang(e) : 把输入的值返回父组件
   *
   *dataList = [{name:"",value:""}]
   *
   */

  const { options = {}, onChange, dataList = [] } = props;

  const [isDown, setDown] = useState(true); //判断下拉框三角图标向上还是向下


  const onDropdown = open => {
    if (open) {
      setDown(false);
    } else {
      setDown(true);
    }
  };
  const onChanges = e => {
    onChange(e);
  };
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

  return (
    <Select
      {...options}
      showSearch
      showArrow
      className={styles.eSelectCheck}
      placeholder={options.placeholder ? options.placeholder : "请选择"}
      allowClear={true}
      defaultActiveFirstOption={false}
      filterOption={(input, option) => {
        return option.props.children.indexOf(input) !== -1;
      }}
      suffixIcon={
        <img
          src={isDown ? Down : Up}
          alt=""
          style={{
            width: 16,
            height: 16,
          }}
        />
      }
      maxTagCount={1}
      maxTagPlaceholder={maxTagPlaceholder}
      onDropdownVisibleChange={onDropdown}
      maxTagTextLength={8}
      menuItemSelectedIcon={e => {
        return (
          dataList.length > 0 &&
          e.value !== "NOT_FOUND" && (
            <Checkbox
              disabled={e.disabled}
              checked={
                options?.value?.filter(key => {
                  return key === e.value;
                }).length > 0
              }
            ></Checkbox>
          )
        );
      }}
      onChange={onChanges}
      value={options.value}
      dropdownRender={menu => (
        <div className={styles.selectcheckbox}>
          <div>{menu}</div>
          <div
            style={{
              marginTop: "3px",
              marginBottom: "3px",
              textAlign: "right",
            }}
          ></div>
        </div>
      )}
    >
      {dataList.map(item => (
        <Option
          key={item.name}
          value={item.value}
        >
          {item.name}
        </Option>
      ))}
    </Select>
  );
}
