import React from 'react';
import { Card, Tabs, Badge, message } from 'antd';
import DropdownBox from '../../../../components/Common/DropdownBox';
import MessageDropContent from './MessageDrop/MessageDropContent';
// import { FetchNotifyCount } from '../../../../../services/amslb/user';
import { FetchRmndEventNum } from '../../../../services/basicservices/index';

export default class MessagesDrop extends React.PureComponent {
  state = {
    currentKey: '',
    unreadMsgConf: [],
    haveNewMsg: false,
  }
  componentDidMount() {
    this.getMsgNum();
    // 每隔3分钟执行一次,刷新一下数字
    this.timer = setInterval(() => {
      this.getMsgNum();
    }, 3 * 60 * 1000);
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  getMsgNum = () => {
    // 任务/计划/其他
    FetchRmndEventNum().then((ret = {}) => {
      const { records = [] } = ret;
      const haveNewMsg = this.judgeHaveMsg(records);
      this.setState({
        unreadMsgConf: records,
        haveNewMsg,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  judgeHaveMsg = (data = []) => {
    let haveNewMsg = false;
    data.forEach((item) => {
      if (Number(item.evntNum) > 0) {
        haveNewMsg = true;
      }
    });
    return haveNewMsg;
  }
  // FetchRmndEventConfData = () => {
  //   fetchRmndEventConf({
  //   }).then((ret = {}) => {
  //     const { records = [] } = ret;
  //     const columnsList = records.map((item) => {
  //       switch(item.tabNm || '') {
  //         case '流程':
  //           return {
  //             key: 'Workflow',
  //             name: '流程',
  //             type: item.tabCode || '',
  //             unReadNumKey: 'workflow',
  //           };
  //         case '任务':
  //           return {
  //             key: 'Task',
  //             name: '任务',
  //             type: item.tabCode || '',
  //             unReadNumKey: 'task',
  //           }
  //         case '计划':
  //           return {
  //             key: 'Plan',
  //             name: '计划',
  //             type: item.tabCode || '',
  //             unReadNumKey: 'plan',
  //           }
  //         case '审批':
  //           return {
  //             key: 'approval',
  //             name: '审批',
  //             type: item.tabCode || '',
  //             unReadNumKey: 'approval',
  //           }
  //         case '反馈':
  //           return {
  //             key: 'Feedback',
  //             name: '反馈',
  //             type: item.tabCode || '',
  //             unReadNumKey: 'feedback',
  //           }
  //         case '其他':
  //           return {
  //             key: 'Other',
  //             name: '其他',
  //             type: item.tabCode || '',
  //             unReadNumKey: 'other',
  //           }
  //         default:
  //           return {};
  //       }
  //     })
  //     this.setState({
  //       columnsList,
  //     });
  //   }).catch((error) => {
  //     message.error(!error.success ? error.message : error.note);
  //   });
  // }
  // tab切换
  handleTabChange = (activeKey) => {
    this.setState({ currentKey: activeKey });
    // 刷新数据
    if (this.messageDropContent && activeKey && this.messageDropContent[activeKey]) {
      this.messageDropContent[activeKey].getListDatas();
    }
  }
  // 展开消息dropbox的时候,刷新数据以及数目
  handleDropBoxClick = (e) => {
    this.getMsgNum();
    const { unreadMsgConf = [] } = this.state;
    if (e) e.preventDefault();
    const { currentKey } = this.state;
    const activeKey = currentKey === '' ? unreadMsgConf[0].clCode : currentKey;
    if (this.messageDropContent && activeKey && this.messageDropContent[activeKey]) {
      this.messageDropContent[activeKey].getListDatas();
    }
  }
  handleRefresh = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.getMsgNum();
    this.timer = setInterval(() => {
      this.getMsgNum();
    }, 3 * 60 * 1000);
  }
  render() {
    const { currentKey, unreadMsgConf = [], haveNewMsg = false } = this.state;
    // const { workflow = '0', task = '0', plan = '0', other = '0' } = unreadMsgNums;
    const { dictionary } = this.props;
    return (
      <DropdownBox
        id="message"
        title={
          <a onClick={this.handleDropBoxClick} style={{ display: 'inline-block', width: '100%', height: '100%' }}>
            {
              !haveNewMsg ?
                <i className="iconfont icon-bell" /> :
                <Badge status="processing" text={<i className="iconfont icon-bell" />} />
            }
          </a>
        }
        dropbox={
          <Card
            className="m-card default"
          >
            {
              unreadMsgConf.length > 0 && (<Tabs className="m-tabs-underline m-tabs-underline-small" activeKey={currentKey === '' ? unreadMsgConf[0].clCode : currentKey} onChange={this.handleTabChange}>
              {
                unreadMsgConf.map((item) => {
                  const { evntNum = 0, clName = '', clCode = '' } = item;
                  return (
                    <Tabs.TabPane
                      key={clCode}
                      tab={(
                        <Badge
                          count={evntNum}
                          style={{ height: '1rem', minWidth: '1rem', lineHeight: '1rem', fontSize: '.8rem', right: '-.8rem' }}
                        >
                          {clName}
                        </Badge>
                      )}
                    >
                      <MessageDropContent
                        ref={(node) => { if (!this.messageDropContent) this.messageDropContent = {}; this.messageDropContent[clCode] = node; }}
                        typeKey={clCode}
                        type={clCode}
                        onRefresh={this.handleRefresh}
                        dictionary={dictionary}
                      />
                    </Tabs.TabPane>
                  );
                })
              }
            </Tabs>)
            }
          </Card>
        }
      />
    );
  }
}
