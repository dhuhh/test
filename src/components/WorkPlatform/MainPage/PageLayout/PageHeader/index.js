/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
import React from 'react';
import { Layout, Row } from 'antd';
import SearchInput from './searchInput';
import SwitchMenu from './SwitchMenu';
import UserDrop from './userDrop';
import SystemSetting from '../../../../Biz/SystemSetting';
import Logo from './logo';
import FlowList from './FlowList';

class PageHeader extends React.PureComponent {
  state = {
    type: 1,
    total: '0',
  }
  styleFcn = () => {
    const { menuTree = [], width, collapsed } = this.props;
    let style = '';
    if (menuTree.length > 0) {
      if (width < 1280) {
        style = collapsed ? '0 0 0 20.416rem' : '0 0 0 0.333rem';
      } else {
        style = '';
      }
    } else {
      style = '0';
    }
    return style;
  }
  render() {
    const { style = {}, width } = this.props;
    let situation = 'pc';
    const userAgent = navigator.userAgent.toLocaleLowerCase();
    const device = /ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
    if (device.test(userAgent)) {
      // 移动端
      situation = 'mobile';
    } else {
      // PC端
      situation = 'pc';
    }
    return (
      <Layout.Header className="m-header" style={{ padding: this.styleFcn(), width: '100%', ...style }}>
        {/* 判断是否是在移动端，如果在移动端，则不展示头部的内容 */}
        {
          situation === 'pc' ?
          (
            <Row>
              <Logo
                {...this.props}
              />
              <div className="right" style={{ marginLeft: '0.5rem' }}>
                <UserDrop {...this.props} />
              </div>
              <div className="right" style={{ display: `${width < 768 ? 'none' : 'block'}` }}>
                <SearchInput {...this.props} />
              </div>
              <div className="right">
                <SwitchMenu {...this.props} />
              </div>
              <div className="right aLink">
                <SystemSetting {...this.props} type={this.state.type} />
              </div>
              <FlowList {...this.props} />
            </Row>
          )
          :
          null
        }
      </Layout.Header>
    );
  }
}
export default PageHeader;
