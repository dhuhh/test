/* eslint-disable no-nested-ternary */
import React from 'react';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { suffix } from '../../../../../utils/config';
import LeftContent from './content/LeftContent';
import RightContent from './content/RightContent';
import styles from './index.less';

class MenuSider extends React.Component {
  componentDidMount() {
    const { menuShow, width } = this.props;
    if (menuShow === true || width <= 768) {
      window.addEventListener('resize', this.props.setWidth); // 后期优化为resizeobserver
      this.props.setWidth();
    }
  }

  render() {
    const { width, menuLangKey, selectedMenuKeys, menuTree = [], location, collapsed, menuShow, logo, logoSmall } = this.props;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    return (
      <React.Fragment >
        <Layout.Sider
          className="m-sider"
          id="m-sider"
          collapsed={menuTree.length === 0 ? true : !collapsed}
          collapsedWidth={width < 1280 ? (menuShow ? '220px' : '0') : (menuShow ? menuTree.length === 0 ? 0 : '220px' : menuTree.length === 0 ? 0 : '72px')}
          breakpoint="md"
          width={width < 1280 ? (menuShow ? '220px' : '0') : (menuShow ? '220px' : '72px')}
          style={{ position: 'fixed' }}
        >
          <div>
            <a href="/" className="m-logo-link dis-fx alc" style={{ height: '6.666rem', color: '#fff', padding: '0 0.833rem 0 0rem', fontSize: '2rem' }}>
              {
                collapsed ? <React.Fragment> <img src={logo} style={{ width: '9rem', marginRight: '0.833rem' }} alt="logo" /></React.Fragment>
                  :
                <img src={logoSmall} style={{ width: '3rem' }} alt="logo" />
              }
            </a>
          </div>
          <Scrollbars
            autoHide
            renderTrackVertical={props => <div {...props} className={styles['scrollbars-track-vertical']} />}
            style={{ width: '100%' }}
          >
            <LeftContent collapsed={collapsed} selectedMenuKeys={selectedMenuKeys} menuLangKey={menuLangKey} menuTree={finalMenuData} location={location} />
          </Scrollbars>
        </Layout.Sider>
        <RightContent selectedMenuKeys={selectedMenuKeys} menuTree={finalMenuData} location={location} />
      </React.Fragment>
    );
  }
}
export default MenuSider;
