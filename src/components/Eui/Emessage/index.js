import React from "react";
import { message } from "antd";
import styles from "./index.less";
import Error from "../assets/error.svg";
import Info from "../assets/info.svg";
import Success from "../assets/success.svg";

// closeIcon={<img src={Close} alt="" />}

const show = () => {
  return <img src={Success} alt="" />;
};
message.success({ icon: show });

export default function Emessage(props) {
  /*
   *props : {options:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang() : 把输入的值返回父组件
   *
   *visible : 显隐Modal层
   *
   *content: 主体文本
   */

  const { options = {}, onChange, visible, setVisible, content } = props;

  const changeOk = e => {
    // 把输入的值返回父组件
    onChange();
  };

  const success = () => {
    message.success("This is a normal message");
  };
  return <div></div>;
}

// import { message, Button } from "antd";

// const info = () => {
//   message.info("This is a normal message");
// };

// ReactDOM.render(
//   <Button type="primary" onClick={info}>
//     Display normal message
//   </Button>,
//   mountNode
// );
