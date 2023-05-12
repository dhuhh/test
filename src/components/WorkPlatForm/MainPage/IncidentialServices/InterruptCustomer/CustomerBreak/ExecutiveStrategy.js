import React, { Component } from 'react';
import { Input, message, Popover, Spin, Tabs } from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import { FetchQryExecutionStrategy } from '$services/incidentialServices';
import { FetchFuzzyQryCusInfo } from '$services/incidentialServices';
import styles from './index.less';
// import light from '$assets/incidentialServices/执行策略.svg';
// import empty from '$assets/incidentialServices/缺省.svg';
import light from '$assets/incidentialServices/executionStrategy.svg';
import empty from '$assets/incidentialServices/defaultImg.svg';
// import defalultImage from '$assets/dev_app_qrcode.png';

class ExecutiveStrategy extends Component {
  state = {
    activeKey: '1',
    loading: true,
    data: [],
    value: '',
    keyWord: '',
    hasMore: true,
    pagination: {
      current: 1,
      pageSize: 5,
    },
    tabData: [],
  }

  componentDidMount = async () => {
    this.fetchFuzzyQryCusInfo('4');
    this.fetchFuzzyQryCusInfo('3');
  }
  fetchFuzzyQryCusInfo = (queryType) => {
    const { custNo = '' } = this.props;
    const payload = { cxlx: queryType, gjz: custNo };
    let activeKey = '';
    FetchFuzzyQryCusInfo(payload).then((res) => {
      const { records = [] } = res;
      if (queryType === '4') {
        this.setState({ tabData: records });
      } else {
        if (records[0].intrptTp === '0') {
          activeKey = records[0].stepCode;
        } else if (records[0].intrptTp === '1') {
          activeKey = '13';
        } else if (records[0].intrptTp === '2') {
          activeKey = '14';
        }
        this.setState({ activeKey });
        this.fetchData({
          intrptStep: activeKey === '13' || activeKey === '14' ? '' : activeKey,
          keyWord: '',
          intrptTp: activeKey === '13' ? '1' : activeKey === '14' ? '2' : '0',
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  fetchData = (payload) => {
    this.setState({ loading: true });
    let { pagination, hasMore } = this.state;
    const { pagination: payPagination } = payload;
    if (payPagination) {
      pagination = payPagination;
    }
    const { pageSize = 5 } = pagination;
    FetchQryExecutionStrategy({ ...payload, ...pagination }).then((res) => {
      const { records = [], total = 0 } = res;
      if (pageSize >= total) hasMore = false;
      this.setState({ loading: false, data: records, hasMore });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleTabChange = (activeKey) => {
    this.setState({ activeKey });
    this.fetchData({
      intrptStep: activeKey === '13' || activeKey === '14' ? '' : activeKey,
      keyWord: '',
      intrptTp: activeKey === '13' ? '1' : activeKey === '14' ? '2' : '0',
    });
  }
  handleInputChange = (e) => {
    this.setState({ value: e.target.value });
  }
  handleSearchChange = (e) => {
    this.setState({ keyWord: e.target.value });
    this.fetchData({
      intrptStep: this.state.activeKey === '13' || this.state.activeKey === '14' ? '' : this.state.activeKey,
      keyWord: e.target.value,
      intrptTp: this.state.activeKey === '13' ? '1' : this.state.activeKey === '14' ? '2' : '0',
    });
  }
  handleInfiniteOnLoad = () => {
    const { pagination: { pageSize = 5 } } = this.state;
    const pagination = { current: this.state.current, pageSize: pageSize + 5 };
    this.fetchData({
      intrptStep: this.state.activeKey === '13' || this.state.activeKey === '14' ? '' : this.state.activeKey,
      keyWord: this.state.keyWord,
      intrptTp: this.state.activeKey === '13' ? '1' : this.state.activeKey === '14' ? '2' : '0',
      pagination,
    });
    this.setState({ pagination });
  }
  renderData = (data) => {
    const isDialogue = lodash.get(data, '[0].stgyCntnt', '--').substr(0, 2) === '员工' || lodash.get(data, '[0].stgyCntnt', '--').substr(0, 2) === '客户';
    if (isDialogue) {
      // return this.renderSelectYyb(data);
      return this.renderSearch(data);
    } else if (!data.length) {
      return this.renderEmpty();
    } else {
      return this.renderSearch(data);
    }
  }
  renderSelectYyb = (data) => {
    const { sysParam = [] } = this.props;
    const serverName = sysParam.filter(item => item.csmc === 'system.c4ym.url')[0].csz;
    return (
      <React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={styles.executiveStrategyLine}></div>
            <div style={{ marginLeft: '8px', fontWeight: 500 }}>
              <div>策略名称</div>
              <div style={{ fontSize: 18 }}>{lodash.get(data, '[0].stgyName', '--')}</div>
            </div>
          </div>
          { lodash.get(data, '[0].pictInfo', '') && (
            <div style={{ width: 58, height: 58 }}>
              <img style={{ width: '100%', height: '100%' }} src={`${serverName}/OperateProcessor?Column=PICT_INF&PopupWin=false&Table=TC_EXC_STGY&&operate=Download&&Type=View&ID=${lodash.get(data, '[0].stgyId', '')}`} alt=''></img>
            </div>
          )}
        </div>
        {
          lodash.get(data, '[0].stgyCntnt', '') && (
            <React.Fragment>
              <div style={{ padding: '8px 0', fontSize: 16 }}>
                <div style={{ fontWeight: 500 }}>员工：</div>
                <div>您好，这里是安信证券股份有限公司客户服务中心，我的工号是：8888，我们接收到您在安信证券的手机开户断开了，想了解一下您这边是有遇到什么问题？</div>
              </div>
              <div style={{ padding: '8px 0', fontSize: 16 }}>
                <div style={{ fontWeight: 500 }}>客户：</div>
                <div>是的，我不知道选择哪个营业部。</div>
              </div>
              <div style={{ padding: '8px 0', fontSize: 16 }}>
                <div style={{ fontWeight: 500 }}>员工：</div>
                <div>您的位置是在哪？我们帮您查一下附近的营业部</div>
              </div>
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }
  renderSearch = (data) => {
    const { sysParam = [] } = this.props;
    const serverName = sysParam.filter(item => item.csmc === 'system.c4ym.url')[0].csz;
    return (
      <Scrollbars autoHide style={{ height: '100%' }}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          {
            data.map((item, index) => {
              return (
                <div style={{ marginBottom: index === data.length - 1 ? 0 : 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div className={styles.executiveStrategyLine}></div>
                      <div style={{ marginLeft: '8px', fontWeight: 500, width: '100%' }}>
                        <div>策略名称</div>
                        <div title={item.stgyName} style={{ fontSize: 18, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.stgyName} </div>
                      </div>
                    </div>
                    { lodash.get(item, 'pictInfo', '') && (
                      <div style={{ width: 58, height: 58 }}>
                        <img style={{ width: '100%', height: '100%' }} src={`${serverName}/OperateProcessor?Column=PICT_INF&PopupWin=false&Table=TC_EXC_STGY&&operate=Download&&Type=View&ID=${lodash.get(item, 'stgyId', '')}`} alt=''></img>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '2px 0', fontSize: 16 }}>
                    <div dangerouslySetInnerHTML={{ __html: item.stgyCntnt }}></div>
                    {lodash.get(item, 'url', '') && <a href={lodash.get(item, 'url', '')} target='_blank' rel='noreferrer' className={styles.site}>{lodash.get(item, 'url', '')}</a>}
                  </div>
                </div>
              );
            })
          }
        </InfiniteScroll>
      </Scrollbars>
    );
  }
  renderEmpty = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', height: '80%' }}>
        <img src={empty} alt='暂无'></img>
        <div style={{ color: '#61698c', fontSize: 16 }}>暂无相关策略或营销话术</div>
      </div>
    );
  }
  render() {
    const { activeKey = '1', loading = true, data = [], value = '', tabData = [] } = this.state;
    // const { dictionary: { INTCUS_STP: tabData = [] } } = this.props;
    // tabData.sort((a, b) => a.ibm - b.ibm);
    return (
      <Popover
        overlayClassName={styles.popover}
        placement='bottomLeft'
        trigger='click'
        content={
          <Tabs tabPosition='left' tabBarGutter={5} activeKey={activeKey} onChange={this.handleTabChange}>
            {
              tabData.map((item, index) => (
                <Tabs.TabPane key={(index + 1) + ''} tab={item.intrptStep}>
                  <div style={{ width: 563 }}>
                    <div style={{ padding: '0 20px', height: 82, display: 'flex', alignItems: 'center', borderBottom: '1px solid #EBECF2' }}>
                      <Input
                        className={styles.strategyInput}
                        value={value}
                        onChange={this.handleInputChange}
                        onPressEnter={this.handleSearchChange}
                        placeholder='其他策略或营销话术'
                        suffix={<i className='iconfont icon-search' style={{ marginTop: '-.2rem', color: '#00000040' }}></i>}
                      />
                    </div>
                    <Spin spinning={loading}>
                      <div style={{ padding: 20, height: '540px' }}>
                        {this.renderData(data)}
                      </div>
                    </Spin>
                  </div>
                </Tabs.TabPane>
              ))
            }
          </Tabs>
        }>
        <div style={{ cursor: 'pointer', width: 84, height: 84, borderRadius: '50%', boxShadow: '0px 0px 30px 0px rgba(5,14,28,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ paddingBottom: 1 }}><img src={light} alt='执行策略' /></span>
          <span style={{ paddingTop: 1 }}>执行策略</span>
        </div>
      </Popover>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
  sysParam: global.sysParam,
}))(ExecutiveStrategy);
