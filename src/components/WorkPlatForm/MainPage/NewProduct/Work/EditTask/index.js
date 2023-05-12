import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Descriptions,
  Upload,
  Icon,
  DatePicker
} from "antd";
import { connect } from "dva";
import styles from "./index.less";
import wenjianImg from "$assets/newProduct/notice_icon_enclosure.png";
const { TextArea } = Input;
const EditTask = ({ dictionary, userBasicInfo }) => {

  const [testData, setTestData] = useState("");
  const [fileList, setFileList] = useState([]);//文件上传列表
  useEffect(() => {}, []);
  const handleChange=(info)=>{
    let fileList = [...info.fileList];
    setFileList(fileList)
    console.log(info);
  }
  //点击删除上传附件
  const deleteFile=(info)=>{
    setFileList((val)=>val.filter(item=>item.uid!==info.uid))
    console.log(info);
  }
  //upload组件的属性设置
  const props = {
    action: '//jsonplaceholder.typicode.com/posts/',
    onChange: handleChange,
    multiple: true,
  };
  return (
    <div className={styles.minBody}>
      <div className={styles.basicMessage}>
        <Descriptions title="基本信息" bordered size="middle" column={ 4 }>
          {/*第一行*/}
          <Descriptions.Item
            label="活动/任务主题："
            span={1}>
            { '新建无效户激活' }
          </Descriptions.Item>
          <Descriptions.Item label="活动/任务类型：" span={1}>{ '营销活动' }</Descriptions.Item>
          <Descriptions.Item label="营销目标：" span={1}>{ '业务开通' }</Descriptions.Item>
          <Descriptions.Item label="营销目标：" span={1}>{ '未签约-已签约' }</Descriptions.Item>
          {/*第二行*/}
          <Descriptions.Item label="完成率：" span={1}>{ '新建无效户激活' }</Descriptions.Item>
          <Descriptions.Item label="开始日期：" span={1}>
            <DatePicker
              style={ { width:182 } }
              onChange={(val)=>{console.log(val)}}
            />
          </Descriptions.Item>
          <Descriptions.Item label="结束日期：" span={1}>
            <DatePicker
              onChange={(val)=>{console.log(val)}}
            />
          </Descriptions.Item>
          <Descriptions.Item label="--" span={1}>{ '未签约-已签约' }</Descriptions.Item>
          {/*第三行*/}
          <Descriptions.Item label="活动/任务内容：" span={2}>
            <TextArea rows={2} placeholder={'请输入'}/>
          </Descriptions.Item>
          <Descriptions.Item label="活动/任务内容：" span={2}>
            <TextArea rows={2} placeholder={'请输入'}/>
          </Descriptions.Item>
          {/*第四行*/}
          <Descriptions.Item label="附件：" span={2}>
            <div className={styles.uploadBody}>
              <div>
                <Upload {...props} fileList={fileList}>
                  <Button>
                    <Icon type="upload" />
                    点击上传附件
                  </Button>
                </Upload>
              </div>
              <div>
                {
                  fileList.map(item=>{
                    return(
                      <div className={styles.fileListItem} key={item.uid}>
                        <img src={wenjianImg} style={{ width: 16 }} />
                        <div className={styles.fileListItemText}>
                          {item.name}
                          &nbsp;
                          ({(item.size/102400).toFixed(2)}M)
                        </div>
                        <div>
                          <Button type="link" className={styles.reUpload}>重新上传</Button>
                          <Button
                            type="link"
                            className={styles.del}
                            onClick={()=>{deleteFile(item)} }
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="素材：" span={2}>
            <div className={styles.uploadBody}>
              <div>
                  <Button>
                    <Icon type="upload" />
                    添加素材
                  </Button>
              </div>
              <div>
                {
                  fileList.map(item=>{
                    return(
                      <div className={styles.fileListItem} key={item.uid}>
                        <img src={wenjianImg} style={{ width: 16 }} />
                        <div className={styles.fileListItemText}>
                          {item.name}
                          &nbsp;
                          ({(item.size/102400).toFixed(2)}M)
                        </div>
                        <div>
                          <Button type="link" className={styles.reUpload}>重新上传</Button>
                          <Button
                            type="link"
                            className={styles.del}
                            onClick={()=>{deleteFile(item)} }
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </Descriptions.Item>

        </Descriptions>
      </div>
      <div className={styles.keHulist}></div>
      <div className={styles.FunctionButton}>
        <Button>删除任务</Button>
        <Button>保存任务</Button>
        <Button style={{ background: "#244FFF", color: "white" }}>
          下发任务
        </Button>
      </div>
    </div>
  );
};
export default connect(({ global }) => ({
  authorities: global.authorities, //获取用户功能权限点
  dictionary: global.dictionary, //字典信息
  userBasicInfo: global.userBasicInfo //用户基本信息
}))(EditTask);
