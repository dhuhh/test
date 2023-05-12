import React from 'react';
import { message, Empty, Spin } from 'antd';
import { Link } from 'dva/router';
import { FetchUserMsgRmdList } from '../../../../../services/commonbase/index';
import { fetchRmndEventList } from '../../../../../services/basicservices/index';
import RemindMessageDropItem from './RemindMessageDropItem';
import WorkflowDropItem from './Workflow/WorkflowDropItem';

class MessageDropContent extends React.Component {
  state = {
    records: [],
    pagination: {
      paging: 1,
      current: 1,
      pageSize: 5,
      sort: '',
      total: -1,
    },
    cardLoading: false,
  };

  componentDidMount() {
    this.getListDatas();
  }

  componentWillReceiveProps(nextProps) {
    const { typeKey: nextKey } = nextProps;
    const { typeKey } = this.props;
    if (nextKey !== typeKey) this.getListDatas();
  }

  getListDatas = () => {
    const { typeKey = '', type = '' } = this.props;
    const { pagination = {} } = this.state;
    this.setState({ cardLoading: true });
    if (typeKey === 'Workflow') {
      FetchUserMsgRmdList({
        ...pagination,
        isread: 0,
        type: 'Workflow',
      }).then((ret = {}) => {
        const { records = [] } = ret;
        this.setState({
          records,
          cardLoading: false,
        });
      }).catch((error) => {
        this.setState({ cardLoading: false });
        message.error(!error.success ? error.message : error.note);
      });
    } else {
      fetchRmndEventList({
        ...pagination,
        clCode: type,
        rdFlg: 0,
      }).then((ret = {}) => {
        const { records = [] } = ret;
        this.setState({
          records,
          cardLoading: false,
        });
      }).catch((error) => {
        this.setState({ cardLoading: false });
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  handleRefresh = () => {
    this.getListDatas();
    const { onRefresh } = this.props;
    if (onRefresh) {
      onRefresh();
    }
  }

  render() {
    const { records = [], cardLoading = false } = this.state;
    const { typeKey = '', dictionary, type = '' } = this.props;
    return (
      <div style={{ padding: '1rem' }}>
        <Spin spinning={cardLoading}>
          {
            records.length === 0 ? (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无未读消息" />)
              : records.map((item = {}, index) => {
                if (typeKey === 'Workflow') {
                  return (
                    <WorkflowDropItem key={index} item={item} tabCode={type} onRefresh={this.handleRefresh} />
                  );
                } return (
                  <RemindMessageDropItem key={index} item={item} tabCode={type} onRefresh={this.handleRefresh} dictionary={dictionary} />
                );
              })
          }
        </Spin>
        <div style={{ textAlign: 'center', marginTop: '.5rem' }}>
          <Link to={`/messageDropList/${typeKey}`} target="_blank" rel="noopener noreferrer" style={{ color: '#44abff' }}>查看全部 &gt;&gt;</Link>
        </div>
      </div>
    );
  }
}

export default MessageDropContent;
