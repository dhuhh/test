import { Col, message, Row, Spin, Modal, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { ConfirmUploadComplete, HandleInAndReAuditDelete } from '$services/newProduct';
import attachedFileIcon from '$assets/newProduct/attached-file.png';
import styles from '../index.less';


export default function UploadRecord(props) {
  const { records = [] } = props;

  // 点击删除弹出对话框
  const handleDeleteClick = (file) => {
    Modal.confirm({
      title: '你确认要删除该表格吗？',
      // okType: 'danger',
      onOk() {
        handleDeleteFile(file);
      },
    });
  };

  // 删除文件
  const handleDeleteFile = (file) => {
    const { queryUploadList, setLoading } = props;
    setLoading(true);
    HandleInAndReAuditDelete({ uuid: file.upldNo, month: Number(file.asmtMonth) }).then((response) => {
      const { note = '操作成功' } = response;
      if (queryUploadList) queryUploadList();
      message.success(note);
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
      setLoading(false);
    });
  };

  // 确认上传完成
  const confirmUploadComplete = (month) => {
    const { queryUploadList, setLoading } = props;
    setLoading(true);
    ConfirmUploadComplete({ asmtMonth: Number(month) }).then(() => {
      if (queryUploadList) queryUploadList();
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
      setLoading(false);
    });
  };

  // 下载文件
  const download = (url) => {
    const { serverName } = props;
    window.open(`${serverName}${url}`);
  };

  return (
    <React.Fragment>
      <Row style={{ padding: '12px 0 0 24px', fontSize: 16, color: '#1a2243' }}>上传记录</Row>
      <Spin spinning={props.loading}>
        <Scrollbars style={{ height: `calc(${props.height}px*0.9)` }} autoHide>
          <Row style={{ padding: '0 24px', fontSize: 14 }}>
            {
              records.map((item, index) => {
                return (
                  <React.Fragment>
                    <div style={{ padding: '12px 0' }}>
                      <div style={{ width: '100%', height: '1px', background: '#d1d5e6' }}></div>
                    </div>
                    <Row type='flex' justify='space-between' style={{ paddingBottom: 5 }}>
                      <Col>
                        <span style={{ color: '#1a2243' }}>考核月份 </span>
                        <span style={{ fontWeight: 'bold', color: '#1a2243' }}>{item.month.substr(0, 4)}年{item.month.substr(4, 2)}月</span>
                      </Col>
                      <Col>
                        { item.isVerify === '1' ? <span style={{ color: '#959CBA' }}>已确认</span> : <span className={styles.hoverTwo} onClick={() => {confirmUploadComplete(item.month);}}>确认上传完成</span> }
                      </Col>
                    </Row>
                    {
                      item.files.map(file => {
                        return (
                          <Row type='flex' justify='space-between' style={{ padding: '4px 0', wordBreak: 'break-all', flexWrap: 'nowrap' }}>
                            <Col span={12}>
                              <span title={file.atch || '--'} style={{ cursor: 'pointer', color: '#1a2243' }} className={styles.link} onClick={() => { download(file.atchUrl); }}><img src={attachedFileIcon} style={{ width: 16, height: 16 }} alt='附件' />{file.atch || '--'}    </span>
                            </Col>
                            <Col>
                              <span className={styles.hoverOne} onClick={() => { handleDeleteClick(file); }}>删除</span>
                              <span style={{ color: '#959CBA', marginLeft: '4rem' }}>{file.upldTm}</span>
                            </Col>
                          </Row>
                        );
                      })
                    }
                  </React.Fragment>
                );
              })
            }
          </Row>
        </Scrollbars>
      </Spin>
    </React.Fragment>
  );
}