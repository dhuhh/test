import React from "react";
import { Modal, ConfigProvider } from "antd";
import styles from "./index.less";
import Close from "../assets/close.svg";
export default function Emodal(props) {
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

  return (
    <div className={styles.eModal}>
      <ConfigProvider autoInsertSpaceInButton={false}>
        <Modal
          {...options}
          key={"eModal"}
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={changeOk}
          closeIcon={<img src={Close} alt="" />}
          getContainer={false}
          keyboard={true}
          className={styles.eModal}
        >
          <div>{content}</div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
