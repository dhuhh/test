import React, { Component } from 'react';
import { Button, Tabs } from 'antd';
import { Link } from 'dva/router';
import WealthCusList from './WealthCusList';
import InvestSearch from './InvestSearch';
class ManageCusList extends Component {
  state = {
    activeKey: '1',
  }

  componentDidMount = () => {
    const { activeKey = '1' } = this.props;
    this.setState({ activeKey });
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.activeKey !== this.props.activeKey) {
      this.setState({ activeKey: this.props.activeKey });
    }
  }
  render() {
    const { activeKey = '1' } = this.state;
    const { scene = '1', authorities = {}, teamPmsn = '0' } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    return (
      <div style={{ backgroundColor: 'white', minHeight: window.screen.availHeight - 115 }}>
        <div style={{ padding: '20px 24px 10px' }}>
          <Link to={`/newProduct/financialProducts/index`} className="txt-d">
            <Button className="m-btn-radius ax-back-btn">
              <i className="iconfont icon-back" />返回上层
            </Button>
          </Link>
        </div>
        <Tabs activeKey={activeKey} className="m-lckh-tabs" onChange={(activeKey) => { this.setState({ activeKey }); }}>
          {
            productPanoramaAuth.includes('lckhlb') &&
            (
              <Tabs.TabPane tab='理财客户列表' key='1'>
                <WealthCusList authorities={authorities} scene={scene} teamPmsn={teamPmsn} />
              </Tabs.TabPane>
            )
          }
          {
            productPanoramaAuth.includes('dtcx') &&
            (
              <Tabs.TabPane tab='定投查询' key='2'>
                <InvestSearch authorities={authorities} scene={scene} teamPmsn={teamPmsn} />
              </Tabs.TabPane>
            )
          }
        </Tabs>
      </div>
    );
  }
}
export default ManageCusList;
