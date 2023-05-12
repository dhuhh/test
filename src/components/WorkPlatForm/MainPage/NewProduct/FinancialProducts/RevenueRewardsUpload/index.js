import React, { useState, useEffect } from 'react';
import { Col, message, Row } from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import UploadFile from './UploadFile';
import UploadRecord from './UploadRecord';
import { QueryUploadList } from '$services/newProduct';

function RevenueRewardsUpload(props) {
  const { sysParam = [] } = props;
  const serverName = sysParam.filter(item => item.csmc === 'system.c4ym.url')[0]?.csz;
  const [records, setRecords] = useState([]);  // 上传记录
  const [loading, setLoading] = useState(true); // 上传记录列表loading状态
  const [height, setHeight] = useState(500); // 浏览记录高度

  useEffect(() => {
    queryUploadList();
  }, []);

  // 查询上传记录列表
  const queryUploadList = () => {
    setLoading(true);
    QueryUploadList().then((response) => {
      const { records = [] } = response;
      const results = [];
      records.forEach((record) => {
        let temp = 0;
        results.forEach((result) => {
          if (record.asmtMonth === lodash.get(result, 'month', '')) {
            result.files.push(record);
            temp = 1;
          }
        });
        if (!temp) {
          const obj = {};
          obj['month'] = record.asmtMonth;
          obj['isVerify'] = record.isAcct;
          obj['files'] = [];
          obj['files'].push(record);
          results.push(obj);
        }
      });
      results.sort((a, b) => b.month - a.month);
      setRecords(results);
      setLoading(false);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  return (
    <Row style={{ paddingTop: '2rem' }}>
      <Col span={6} offset={5}>
        <UploadFile queryUploadList={queryUploadList} setRecordLoading={setLoading} serverName={serverName} />
      </Col>
      <Col span={7} offset={1} style={{ background: '#F3F4F7', height }}>
        <UploadRecord records={records} loading={loading} setLoading={setLoading} height={height} queryUploadList={queryUploadList} serverName={serverName} />
      </Col>
    </Row>
  );
};

export default connect(({ global }) => ({
  sysParam: global.sysParam,
}))(RevenueRewardsUpload);