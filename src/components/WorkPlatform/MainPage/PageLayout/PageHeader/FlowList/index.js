/* eslint-disable no-debugger */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Icon, Badge, message } from 'antd';
import { routerRedux } from 'dva/router';
import { FetchUserTodoWorkflowNum } from '../../../../../../services/commonbase/index';

class FlowList extends React.PureComponent {
  state = {
    tableData: [],
  }

  componentDidMount() {
    this.getMsgNum();
    // 每隔20秒执行一次,刷新一下数字
    this.timer = setInterval(() => {
      this.getMsgNum();
    }, 20 * 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getMsgNum = () => {
    // 调用端口获取客户列表
    FetchUserTodoWorkflowNum({
    }).then((response) => {
      const { records = [] } = response || {};
      this.setState({
        tableData: records[0],
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleUnreadClick = (url) => {
    if (url !== '') {
      const recentlyVisited = sessionStorage.getItem('recentlyVisited');
      if (recentlyVisited.indexOf(`${url}|`) === -1) {
        sessionStorage.setItem('recentlyVisited', recentlyVisited.concat(`,${url}|`));
      }
      this.props.dispatch(routerRedux.push(url));
    }
  }

  render() {
    const { tableData } = this.state;
    const { dblcs = 0 } = tableData;
    return (
      <div
        className="aLink"
        title="流程中心"
        style={{ float: 'right', margin: '0 .5rem 0 1rem' }}
        onClick={() => { this.handleUnreadClick('/UIProcessor?Table=WORKFLOW_TOTASKS'); }}
      >
        {dblcs && (
          <Badge count={dblcs} showZero>
            <a>
              <Icon type="apartment" style={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
            </a>
          </Badge>
        )}
      </div>

    );
  }
}
export default FlowList;
