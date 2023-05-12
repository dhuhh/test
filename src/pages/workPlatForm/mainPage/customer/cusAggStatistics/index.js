import React from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Row, Tabs, message } from 'antd';
import Content from '../../../../../components/WorkPlatForm/MainPage/Customer/newCusAggStatistics/content';
import { DecryptBase64 } from '../../../../../components/Common/Encrypt';

class CusAggStatistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerCount: 0,
      params: {},
      isSkip: false, // 是否是带参数跳转过来的
    }
  }
  componentDidMount() {
    const { match: { params: { queryParams = '' } } } = this.props;
    if (queryParams === 'index') {
       // 不传数据直接访问的时候
       this.setState({
        isSkip: false,
      })
    } else {
      const params = this.getParams(queryParams);
      this.setState({
        params,
        isSkip: true,
      });
    }
  }
  ocChangeCount = (customerCount) => {
    this.setState({
      customerCount,
    });
  }
  getParams = (str) => {
    if (str === '') {
      return '';
    }
    let params = null;
    try {
      // 把base64格式的变成字符串
      const parseStr = DecryptBase64(str);
      // 字符串转JSON格式
      params = JSON.parse(parseStr);
    } catch (error) {
      message.error('未知错误,无法查看客户汇总信息');
    }
    return params;
  }

  render() {
    const tabs = [
      { title: '综合查询' , url: 'ComprehensiveQuery', key: '7'},
    ];
    const { match: { path, url }, location: { pathname }, dictionary } = this.props;
    let tabkey = '';
    tabs.forEach((item) => {
      if (pathname.includes(item.url)) {
        tabkey = item.key;
      }
    });
    const { params, isSkip } = this.state;
    const { customerOptModel = {} } = params;
    const { selectedCount = '' } = customerOptModel;
    const { customerListBasicModel = {} } = params;
    const { customerQueryType = '' } = customerListBasicModel;
    let tempType = '';
    if (customerQueryType === '1' || customerQueryType === '2') {
      tempType = '1';
    } else if (customerQueryType === '3') {
      tempType = '2';
    } else {
      tempType = '3';
    }
    return (
      <div>
        <Row type="flex" justify="space-around" align="middle" className="m-row-pay-cont">
          <Tabs
            style={{ background: '#fff' }}
            activeKey={tabkey}
            className="m-tabs-underline m-tabs-underline-small"
            tabBarExtraContent={<div className="m-tabs-right">客户数：<span className="pink fwb">{this.state.customerCount}/{selectedCount}</span></div>}
          >
            {
              tabs.map((it) => {
                return <Tabs.TabPane key={it.key} tab={<Link to={`${url}/${it.url}`} replace={tabkey === it.key} style={{ display: 'block' }}>{it.title}</Link>} />
              })
            }
          </Tabs>
        </Row>
        {/* {
          tabsArr.length === 0 && <Spin />
        } */}
        {
          tabs.length > 0 && (
            <CacheSwitch>
              {
                tabs.map((it) => {
                  return <CacheRoute cacheKey={it.url} path={`${path}/${it.url}`} exact render={(props) => <Content isSkip={isSkip} type={tempType} ocChangeCount={this.ocChangeCount} routeProps={props} params={params} dictionary={dictionary} tabkey={it.key}/>} />
                })
              }
              <Redirect to={`${url}/${tabs[0].url}`} />
            </CacheSwitch>
          )
        }
      </div>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(CusAggStatistics);
