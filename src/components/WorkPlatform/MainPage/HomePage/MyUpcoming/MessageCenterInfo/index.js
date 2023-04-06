
import React, { useEffect, useState } from 'react';
import { Link } from 'dva/router';
import { Card, Tabs, message, List, Skeleton, Avatar } from 'antd';
import { FetchMsgUpdate, FetchUpcomingList } from '@/services/home/home';
import { paginationState } from '@/utils/pagination';
import img from '@/assets/szyx/hd-ywkt.png';

function MessageCenterInfo(props) {
  const [loading, setLoading] = useState(false);
  const [tabsList, setTabsList] = useState([]);
  const [list, setList] = useState([]);
  const [type, setType] = useState('1');
  const [total, setTotal] = useState(-1);
  const [payload, setPayload] = useState({ ...paginationState, pageSize: 9 });
  const { current } = payload;

  useEffect(() => {
    fetchMessageMoreList();
  }, [type]);

  // 调用端口获取消息中心更多列表
  const fetchMessageMoreList = (pages = { ...payload, current: 1 }) => {
    setLoading(true);
    FetchUpcomingList({
      ...pages,
      total: -1,
      type, // 1|查询全部;2|运营任务;2|流程提; 4|风控
    }).then((response) => {
      const { records = [], total: newTotal } = response || {};
      // listDatas去重后的标题
      const listDatas = [...new Set(records.map(item => item.typeDesc))];
      setTabsList(['全部', ...listDatas]);
      setList(records);
      setTotal(newTotal);
      setLoading(false);
      setPayload({ ...pages });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // 消息中心操作
  const fetchMsgUpdate = async (id) => {
    await FetchMsgUpdate({
      id,
      operate: '1',
    }).then((response) => {
      fetchMessageMoreList();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // 页面切换
  const onChangePag = (page) => {
    fetchMessageMoreList({
      ...payload,
      current: page,
    });
  };

  // tabs 切换
  const onChange = (data) => {
    setType(data);
  };

  const handleOperation = (id) => {
    fetchMsgUpdate(id);
  };

  return (
    <Card className="m-card m-card-shadow" style={{ margin: '4px 20px 20px 20px' }}>
      <Tabs
        className="m-tabs-underline m-tabs-underline-small"
        animated={false}
        style={{ borderBottom: 0, paddingBottom: '10px', paddingRight: '10px' }}
        defaultActiveKey="1"
        onChange={onChange}
      >
        {
          tabsList.map((item, index) => (
            <Tabs.TabPane tab={<div>{item}</div>} key={index + 1}>
              <List
                className="m-list"
                loading={loading}
                itemLayout="horizontal"
                pagination={{
                  ...payload,
                  onChange: onChangePag,
                  className: 'm-paging m-paging-no',
                  total,
                  current,
                  showTotal: () => `共${total}条`,
                }}
                dataSource={list}
                renderItem={keys => (
                  <List.Item style={{ margin: '0' }} onClick={() => handleOperation(keys.id)}>
                    <Skeleton avatar title={false} loading={keys.loading} active>
                      <List.Item.Meta
                        avatar={
                          <Avatar src={img} />
                        }
                        title={
                          <span className="dis-fx alc-start">
                            <button className="m-btn-tag m-btn-radius-small m-btn-tag-level ant-btn">{keys.typeDesc || '--'}
                            </button>&nbsp;&nbsp;
                            <Link to={keys.url || ''} className="inoneline" rel="noopener noreferrer">{keys.msgDesc || '--'}</Link>
                          </span>}
                        description={<span>{keys.occurTime || '--'}</span>}
                      />
                      <div style={{ fontSize: '1rem' }} >
                        <Link to={keys.url || ''} className="m-color" style={{ display: 'block', textAlign: 'right' }}>办理</Link>
                      </div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Tabs.TabPane>
          ))
        }
      </Tabs>
    </Card>
  );
}

export default MessageCenterInfo;
