import React, { Component } from 'react';
import { Col, Popover } from 'antd';
import LiveBosButton from '@/components/Common/LiveBosButton';

export default class StepsList extends Component {
  state = {
    trackingData: [],
    items: this.props.item,
    currentNode: '',
    trackingUrl: '',
  }
  componentDidMount() {
    this.handleData();
    this.findCurrentNode();
  }

  componentWillReceiveProps(props) {
    const { item } = props;
    this.setState({
      items: item,
    }, () => {
      this.handleData();
      this.findCurrentNode();
    });
  }

  content = (item) => {
    const { trackingUrl, currentNode } = this.state;
    return (
      <span>
        {
          (item === currentNode) && (
            <LiveBosButton
              modalTitle="流程跟踪"
              liveBosUrl={trackingUrl}
              buttonType="2"
              onOk={this.props.onRefresh}
              iconName="icon-check-circle"
              colorName="pink"
            />
          )
        }
      </span>
    );
  }

  // 解析数据
  handleData = () => {
    const { items } = this.state;
    let datas = [];
    if (items.C_JDMC) {
      datas = items.C_JDMC.split(',');
    }
    this.setState({
      trackingData: datas,
    });
  }

  // 确定当前节点
  findCurrentNode = () => {
    const { stepsData = [] } = this.props;
    const { items } = this.state;
    let datas = [];
    if (stepsData[0]?.SUBSCRIBE_ORIGIN?.length > 0) {
      const data = JSON.parse(stepsData[0].SUBSCRIBE_ORIGIN);
      datas = data;
    }
    datas.forEach((item) => {
      if (item.ID === items.C_LCID) {
        this.setState({
          currentNode: item.STATUS,
          trackingUrl: item.PROCESS_TRACKING_URL,
        });
      }
    });
  }

  render() {
    const { trackingData = [], currentNode } = this.state;
    return (
      <React.Fragment>
        <Col xs={24} sm={24} lg={24} xl={19} xxl={20}>
          <div className="ant-steps ant-steps-horizontal m-steps-ant-spot ant-steps-label-vertical ant-steps-dot" style={{ display: 'block' }}>
            {
              trackingData ? trackingData.map((item, index) => {
                const currentNodeIndex = trackingData.indexOf(currentNode);
                return (
                  <Popover key={index} content={this.content(item)} placement="bottom" trigger={item === currentNode ? 'hover' : 'dbClick'}>
                    <div className="ant-steps-item">
                      <div className="ant-steps-item-container">
                        <div className="ant-steps-item-tail" />
                        <div className="ant-steps-item-icon">
                          {
                            index <= currentNodeIndex ? (
                              <span className="ant-steps-icon" style={{ background: '#0099CC', color: '#fff', borderColor: '#0099CC' }}>
                                <span role="img" aria-label="check" className="anticon anticon-check ant-steps-finish-icon">
                                  <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                    <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
                                  </svg>
                                </span>
                              </span>
                            ) : <span className="ant-steps-icon" style={{ color: '#AAA3A3' }}>{index + 1}</span>
                          }
                        </div>
                        <div className="ant-steps-item-content">
                          <div className="ant-steps-item-title">{item || ''}</div>
                        </div>
                      </div>
                    </div>
                  </Popover>
                );
              }) : null
            }
          </div>
        </Col>
      </React.Fragment>
    );
  }
}

