import React, { Fragment, useEffect, useState } from "react";
import { Select, List, Modal, Button } from "antd";
import styles from "../index.less";
/**
 * 员工指标tab左侧
 */

const { Option } = Select;

const LeftContent = ({
  indiData = [],
  params = {},
  selectId,
  setSelectId,
  isShow,
  setType,
  setVisible,
  onChange
}) => {
  //点击左侧的‘新增指标’按钮触发的回调，将状态传递给右侧的组件来打开新建指标的model弹窗
  const handleClick = () => {
    if (typeof setType === "function") {
      setType("1");
    }
    if (typeof setVisible === "function") {
      setVisible(true);
    }
  };
  //指标接口入参变化
  const handleChange = (value = {}) => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  const indiType = [
    { ibm: "0", note: "上架中" },
    { ibm: "1", note: "已下架" }
  ];

  return (
    <Fragment>
      <div
        className={`${styles["left-bar"]} ${styles["ax-form"]} ${styles["ax-btn"]}`}
        style={{ display: !isShow && "none" }}
      >
        <span style={{ marginRight: "8px", color: "#1A2243" }}>指标类型</span>
        <Select
          style={{ flex: "1" }}
          placeholder="请选择"
          allowClear={true}
          onChange={(value = "") => handleChange({ indiType: value })}
          dropdownClassName={styles["left-select"]}
          getPopupContainer={node => node.parentNode}
        >
          {indiType.map(item => (
            <Option key={item.ibm}>{item.note}</Option>
          ))}
        </Select>
        <Button className="ml8" onClick={handleClick}>
          新增指标
        </Button>
      </div>
      <div>
        <List
          className={`h100 ${styles["list"]}`}
          style={{ overflow: "auto", paddingBottom: "1rem" }}
          split={false}//是否显示分割线
          dataSource={indiData}//数据源
          locale={{ emptyText: "" }}//默认文案
          renderItem={(item, index) => (
            <List.Item
              key={item.indiCode}
              className={
                styles[selectId === item.indiCode && "listItem-active"]
              }
              onClick={() => setSelectId && setSelectId(item.indiCode)}
            >
              <div
                className={`${styles[index === 0 ? "listItem-one" : ""]}  ${
                  styles["listItem"]
                }`}
              >
                {item.indiName}
                <i
                  className="iconfont icon-right"
                  style={{ fontSize: "14px" }}
                ></i>
              </div>
            </List.Item>
          )}
          pagination={{
            className: "m-paging",
            simple: true,
            total: params.total,
            onChange: page => handleChange({ current: page })
            // hideOnSinglePage: true,
            // showQuickJumper: true,
            // showTotal: () => `共${params.total}条`,
            // ...pick(params, 'current', 'pageSize', 'total'),
          }}
        />
      </div>
    </Fragment>
  );
};

export default LeftContent;
