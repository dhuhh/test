import React, { useState } from "react";
import { Modal, Button, Upload, message, ConfigProvider } from "antd";
import { ImportData } from "$services/activityComPage";
import uploadred from "$assets/activityComPage/upload_red.png";
import styles from "./index.less";

export default function InModal(props) {
  const [fileLists, setFileList] = useState([]);
  const [disOnClick, setDisOnClick] = useState(false);

  const deleteConfirm = async e => {
    let del = new Promise((resolve, reject) => {
      Modal.confirm({
        title: "你确认要删除该文件吗？",
        onOk() {
          let newFileList = [];
          if (fileLists.length > 1) {
            newFileList = fileLists.filter(item => item.name !== e.name);
          } else {
            newFileList = [];
          }
          setFileList(newFileList);
          if (e.status === "removed") {
            resolve(true);
          }
        },
        onCancel() {
          reject(false);
        }
      });
    });
    return await del;
  };
  // 上传文件状态改变
  const handleFlideChange = ({ file, fileList }) => {
    if (fileList.length > 1) {
      message.error("最多能提交1个附件！");
      return false;
    }
    setFileList([...fileList]);
  };
  const beforeUpload = file => {
    // const tempList = fileLists.filter(item => item.name === file.name);
    // if (tempList.length > 0) {
    //   message.error("附件重复提交！");
    //   return new Promise(resolve => {
    //     console.info(resolve(file)); // eslint-disable-line
    //   });
    // }
    return false;
  };
  const onSubmit = () => {
    if (fileLists.length === 0) {
      message.error("请先上传附件！");
      return false;
    }
    setDisOnClick(true);
    const formData = new FormData();
    fileLists.forEach(file => {
      formData.append("file", file.originFileObj);
    });
    formData.append("type", props.type);
    ImportData(formData)
      .then(res => {
        message.success(res.note || res.message);
        setFileList([]);
        props.closeInModal();
        setDisOnClick(false);
      })
      .catch(err => {
        setFileList([]);
        setDisOnClick(false);
        return message.error(err.note || err.message);
      });
  };

  return (
    <React.Fragment key={props.keys.keys}>
      <Modal
        key={"showInModal"}
        visible={props.showInModal}
        className={styles.inmodal}
        title={`导入数据-${props.title}`}
        footer={
          <ConfigProvider autoInsertSpaceInButton={false}>
            <Button
              style={{
                width: 60,
                height: 32,
                border: "1px solid #D9171B",
                background: "rgba(217, 23, 27, 0.06)",
                color: "#D9171B",
                borderRadius: 2,
                marginRight: 8
              }}
              onClick={() => {
                props.closeInModal();
                setFileList([]);
                setDisOnClick(false);
              }}
            >
              取消
            </Button>
            <Button
              style={{
                width: 60,
                height: 32,
                background: "#D9171B",
                color: "#FFFFFF",
                borderRadius: 2,
                border: "none"
              }}
              disabled={disOnClick}
              onClick={() => {
                onSubmit();
              }}
            >
              确定
            </Button>
          </ConfigProvider>
        }
        onCancel={() => {
          props.closeInModal();
          setFileList([]);
        }}
        keyboard={true}
        style={{ top: "30%" }}
        width={670}
      >
        <Upload
          fileList={fileLists}
          onChange={handleFlideChange}
          beforeUpload={beforeUpload}
          onRemove={deleteConfirm}
          accept=".xls, .xlsx"
        >
          <div
            style={{
              border: "1px solid #D5D5D5",
              padding: "6px 16px",
              cursor: "pointer"
            }}
          >
            <img
              style={{ width: "1.5rem", marginTop: "-5px" }}
              src={uploadred}
              alt=""
            />
            <span style={{ marginLeft: "2px" }}>点击上传附件</span>
          </div>
        </Upload>
      </Modal>
    </React.Fragment>
  );
}
