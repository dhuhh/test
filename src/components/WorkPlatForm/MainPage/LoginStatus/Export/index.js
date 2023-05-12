import React from 'react';
import { Modal } from 'antd';
import config from '../../../../../utils/config';

const { api } = config;
const {
  basicservices: {
    sysLoginTrendsExport,
  } } = api;

class Export extends React.Component {
  showConfirm = () => {
    const { zzjg = '', ksrq = '', jsrq = '', khd = '' } = this.props.payload;
    const newPayload = {
      zzjg,
      ksrq,
      jsrq,
      khd,
    };
    Modal.confirm({
      title: '提示：',
      content: '是否导出数据？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const exportPayload = JSON.stringify({
          tableHeaderCodes: 'rq,dlrs,dlrc',
          headerInfo: '日期,登录人数,登录人次',
          sysLoginTrendsModel: {
            ...newPayload,
          },
        });
        const form1 = document.createElement('form');
        form1.id = 'form1';
        form1.name = 'form1';
        // 添加到 body 中
        document.getElementById('m_iframe').appendChild(form1);
        // 创建一个输入
        const input = document.createElement('input');
        // 设置相应参数
        input.type = 'text';
        input.name = 'exportPayload';
        input.value = exportPayload;
        // 将该输入框插入到 form 中
        form1.appendChild(input);
        // form 的提交方式
        form1.method = 'POST';
        // form 提交路径
        form1.action = sysLoginTrendsExport;
        // 对该 form 执行提交
        form1.submit();
        // 删除该 form
        document.getElementById('m_iframe').removeChild(form1);
      },
    });
  };
  render() {
    return (
      <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
    );
  }
}
export default Export;
