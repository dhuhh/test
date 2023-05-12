import React from 'react';
import { Button, message, Spin } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import AgentOpenedItem from './AgentOpenedItem';
import AgentNotOpenItem from './AgentNotOpenItem';
import { QueryWorkSetting, SaveWorkSetting } from '$services/newProduct';
class WorkSet extends React.Component {
  state = {
    agentOpen: [],
    agentNotOpen: [],
    changeData: [], // 改变的数据
    loading: false,
  }

  componentDidMount() {
    this.queryWorkSetting();
  }

  queryWorkSetting = () => {
    this.setState({ loading: true });
    QueryWorkSetting({}).then((response) => {
      const agentOpen = [], agentNotOpen = [];
      const { records = [] } = response;
      records.forEach((item) => {
        if (item.isNotice === '1') {
          agentOpen.push(item);
        } else if (item.isNotice === '0') {
          agentNotOpen.push(item);
        }
      });
      this.setState({ agentOpen, agentNotOpen, loading: false });
    }).catch((error) => {
      message.error(error.note || error.success);
    });
  }

  handleOk = () => {
    // 调用接口保存
    const { changeData } = this.state;
    SaveWorkSetting({ settingInfo: changeData }).then((response) => {
      message.success(response.note || '操作成功');
      window.parent.postMessage({ action: 'queryBacklog' }, '*');
      const { handleCancel } = this.props;
      if (handleCancel) {
        handleCancel();
      }
      // this.props.setInitKey(Math.random().toString(36).substr(2));
      // this.queryWorkSetting();
    });
    const { handleOk } = this.props;
    if (handleOk) {
      handleOk();
    }
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    if (handleCancel) {
      handleCancel();
    }
  }

  handleChangeData = (changeData) => {
    this.setState({ changeData });
  }

  render() {
    const { agentOpen, agentNotOpen, changeData } = this.state;
    return (
      <Spin spinning={this.state.loading}>
        <Scrollbars autoHide style={{ height: document.body.offsetHeight < 600 + 32 + 55 + 68 ? document.body.offsetHeight - 55 - 68 - 32 : 600  }}>
          <div style={{ paddingLeft: '1.866rem', backgroundColor: '#F7F8FA', height: 50, display: 'flex', alignItems: 'center' }}><span style={{ color: '#61698C' }}>已开启待办</span></div>
          {
            agentOpen.map((item, index) => {
              return <AgentOpenedItem key={item.id} item={item} length={agentOpen.length} index={index} changeData={changeData} handleChangeData={this.handleChangeData} />;
            })
          }
          <div style={{ paddingLeft: '1.866rem', marginTop: '5px', backgroundColor: '#F7F8FA', height: 50, display: 'flex', alignItems: 'center' }}><span style={{ color: '#61698C' }}>已关闭待办</span></div>
          {
            agentNotOpen.map((item, index) => {
              return <AgentNotOpenItem key={item.id} item={item} length={agentNotOpen.length} index={index} changeData={changeData} handleChangeData={this.handleChangeData} />;
            })
          }
        </Scrollbars>
        <div style={{ padding: '1rem', textAlign: 'right' }}>
          <Button className="m-btn-radius ax-btn-small" onClick={this.handleCancel}>取消</Button>
          <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleOk}>保存</Button>
        </div>
      </Spin>
    );
  }
}
export default WorkSet;
