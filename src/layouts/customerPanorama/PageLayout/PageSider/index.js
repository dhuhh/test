import React from 'react';
import { Layout, Menu, message, Modal } from 'antd';
import { history as router } from 'umi';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import ScoreDetail from './ScoreDetail';
import { QueryCusInfo } from '$services/newProduct';
import face_man from '$assets/newProduct/earing/face_man.png';
import new_icon from '$assets/newProduct/earing/new.svg';
import styles from './index.less';
import { newViewSensors } from "$utils/newSensors";

import icon_bdrz_normal from '$assets/newProduct/customerPanorama/icon_bdrz_normal.svg';
import icon_bdrz_selected from '$assets/newProduct/customerPanorama/icon_bdrz_selected.svg';
import icon_cc_normal from '$assets/newProduct/customerPanorama/icon_cc_normal.svg';
import icon_cc_selected from '$assets/newProduct/customerPanorama/icon_cc_selected.svg';
import icon_fwxx_normal from '$assets/newProduct/customerPanorama/icon_fwxx_normal.svg';
import icon_fwxx_selected from '$assets/newProduct/customerPanorama/icon_fwxx_selected.svg';
import icon_hx_normal from '$assets/newProduct/customerPanorama/icon_hx_normal.svg';
import icon_hx_selected from '$assets/newProduct/customerPanorama/icon_hx_selected.svg';
import icon_jy_normal from '$assets/newProduct/customerPanorama/icon_jy_normal.svg';
import icon_jy_selected from '$assets/newProduct/customerPanorama/icon_jy_selected.svg';
import icon_kh_normal from '$assets/newProduct/customerPanorama/icon_kh_normal.svg';
import icon_kh_selected from '$assets/newProduct/customerPanorama/icon_kh_selected.svg';
import icon_sdxxq_normal from '$assets/newProduct/customerPanorama/icon_sdxxq_normal.svg';
import icon_sdxxq_selected from '$assets/newProduct/customerPanorama/icon_sdxxq_selected.svg';
import icon_sy_normal from '$assets/newProduct/customerPanorama/icon_sy_normal.svg';
import icon_sy_selected from '$assets/newProduct/customerPanorama/icon_sy_selected.svg';
import icon_tg_normal from '$assets/newProduct/customerPanorama/icon_tg_normal.svg';
import icon_tg_selected from '$assets/newProduct/customerPanorama/icon_tg_selected.svg';
import icon_zc_normal from '$assets/newProduct/customerPanorama/icon_zc_normal.svg';
import icon_zc_selected from '$assets/newProduct/customerPanorama/icon_zc_selected.svg';
import icon_zhfx_normal from '$assets/newProduct/customerPanorama/icon_zhfx_normal.svg';
import icon_zhfx_selected from '$assets/newProduct/customerPanorama/icon_zhfx_selected.svg';

class PageSider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [''],
      scoreModalVisible: false,
      cusInfo: {},
      menuData: [],
    };
  }

  componentDidMount() {
    console.log('侧边栏开始加载了！！！！！！！！');
    const { routes = [], pathname = '' } = this.props;
    const menuItem = routes.find(item => item.path === pathname);
    if (menuItem) {
      const key = menuItem.key;
      this.setState({ selectedKeys: [key] });
    }
    this.getMenuData();
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { routes = [], pathname = '' } = this.props;
    const menuItem = routes.find(item => item.path === pathname);
    if (menuItem) {
      const key = menuItem.key;
      if (key !== prevState.selectedKeys[0]) {
        this.setState({ selectedKeys: [key] });
        if (key === 'customerPortrait') {
          const { toggleCollapsed, collapsed = false } = this.props;
          if (!collapsed) toggleCollapsed();
        }
      }
    }
  }

  getMenuData = () => {
    const { routes = [] } = this.props;
    const menuData = [];
    routes.forEach(item => {
      if (item.key === 'customerInfo') menuData.push({ ...item, iconUrl: icon_kh_normal, selectedIconUrl: icon_kh_selected, name: '客户概况', isNew: true });
      if (item.key === 'position') menuData.push({ ...item, iconUrl: icon_cc_normal, selectedIconUrl: icon_cc_selected, name: '持仓', isNew: true });
      if (item.key === 'earning') menuData.push({ ...item, iconUrl: icon_sy_normal, selectedIconUrl: icon_sy_selected, name: '收益', isNew: true });
      if (item.key === 'customerPortrait') menuData.push({ ...item, iconUrl: icon_hx_normal, selectedIconUrl: icon_hx_selected, name: '画像', isNew: true });
      // if (item.key === 'accountAnalyse') menuData.push({ ...item, iconUrl: accountAnalyse, name: '账户分析' });
      if (item.key === 'assets') menuData.push({ ...item, iconUrl: icon_zc_normal, selectedIconUrl: icon_zc_selected, name: '资产贡献' });
      // if (item.key === 'assets_old') menuData.push({ ...item, iconUrl: assets, name: '资产' });
      if (item.key === 'transaction') menuData.push({ ...item, iconUrl: icon_jy_normal, selectedIconUrl: icon_jy_selected, name: '交易' });
      // if (item.key === 'transaction_test') menuData.push({ ...item, iconUrl: transaction, name: '交易' });
      if (item.key === 'investmentAdviser') menuData.push({ ...item, iconUrl: icon_tg_normal, selectedIconUrl: icon_tg_selected, name: '投顾' });
      if (item.key === 'serviceInfo') menuData.push({ ...item, iconUrl: icon_fwxx_normal, selectedIconUrl: icon_fwxx_selected, name: '服务信息' });
      if (item.key === 'changeLog') menuData.push({ ...item, iconUrl: icon_bdrz_normal, selectedIconUrl: icon_bdrz_selected, name: '变动日志' });
      if (item.key === 'adequacyDetail') menuData.push({ ...item, iconUrl: icon_sdxxq_normal, selectedIconUrl: icon_sdxxq_selected, name: '适当性详情' });
    });
    this.setState({ menuData });
  }

  fetchData = () => {
    const { customerCode = '' } = this.props;
    QueryCusInfo({ cusNo: customerCode }).then(res => {
      const { records = [] } = res;
      if (records.length) this.setState({ cusInfo: records[0] });
    }).catch(err => message.error(err.note || err.message));
  }

  handleMenuItemClick = (item) => {
    this.setState({ selectedKeys: [item.key] });
    router.push(item.path + this.props.search);
    // 埋点
    if (['客户概况', '持仓', '收益', '画像', '服务信息'].includes(`${item.name}`)) {
      this.props.clickSensors(item.name + '（侧边导航）');
    }
    let name = item.name === "客户概况" ? `${item.name}总浏览次数` : `${item.name}访问次数`;
    newViewSensors({
      third_module: name,
    });
    // 点击客户画像默认收起侧边栏
    if (item.key === 'customerPortrait') {
      const { toggleCollapsed, collapsed = false } = this.props;
      if (!collapsed) toggleCollapsed();
    }
  }

  handleScoreClick = () => {
    this.setState({ scoreModalVisible: true });
    this.props.clickSensors('客户积分（侧边基本信息）');
  }

  render() {
    const { selectedKeys, cusInfo, menuData } = this.state;
    const { collapsed, customerCode = '' } = this.props;
    return (
      <Layout.Sider collapsible trigger={null} collapsed={collapsed} width='176' collapsedWidth='80' style={{ background: 'white', height: '100%' }} className={styles.sider}>
        <Scrollbars autoHide style={{ width: '100%', height: `calc(100% - 54px)` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ margin: '14px 0' }}><img style={{ width: collapsed ? 30 : 60, height: collapsed ? 30 : 60 }} src={cusInfo.photo || face_man} alt='' /></div>
            {
              !collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 12, color: '#61698C' }}>
                  <div style={{ fontSize: 14, color: '#1A2243' }}>{cusInfo.name}</div>
                  <div style={{ margin: '8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span>{cusInfo.cusType === '0' ? '个人' : cusInfo.cusType === '1' ? '机构' : cusInfo.cusType === '2' ? '产品' : '--'}</span>
                    <span style={{ margin: '0 10px', width: 1, height: 12, background: '#D1D5E6', opacity: 0.5 }}></span>
                    <span>{cusInfo.sex || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span className={styles.tag} style={{ borderColor: '#E6AF57', background: 'rgba(230, 175, 87, 0.2)', color: '#E6AF57' }}>V{cusInfo.cusLvl || '-'}</span>
                    <span className={styles.tag} style={{ borderColor: '#E81818', background: 'rgba(232, 24, 24, 0.2)', color: '#E81818', margin: '0 10px' }}>{cusInfo.riskLvl || '--'}</span>
                    <span className={styles.tag} style={{ borderColor: '#244FFF', background: 'rgba(36, 79, 255, 0.2)', color: '#244FFF' }}>{cusInfo.status || '--'}</span>
                  </div>
                  <div style={{ lineHeight: '20px', marginTop: 12 }}>客户号：{customerCode}</div>
                  <div style={{ lineHeight: '20px', margin: '4px 0' }}>开户日期：{cusInfo.openAccountDate || '--'}</div>
                  <div style={{ lineHeight: '20px' }}>安币：{cusInfo.coin || '0'}</div>
                  <div style={{ lineHeight: '20px', margin: '4px 0' }}>安豆：{cusInfo.bean || '0'}</div>
                  <div onClick={this.handleScoreClick} style={{ lineHeight: '20px', color: '#244FFF', cursor: 'pointer' }}>客户积分：{cusInfo.integral || '0'}</div>
                  <div style={{ width: 149, height: 1, background: '#EBECF2', margin: '24px 0 8px' }} />
                </div>
              )}
          </div>

          <Menu mode="inline" selectedKeys={selectedKeys} onClick={({ _, key }) => this.setState({ selectedKeys: [key] })}>
            {
              menuData.map((item, index) => {
                return (
                  <Menu.Item
                    key={item.key || index}
                    title={item.name}
                    className={`${styles.menuItem} ${selectedKeys[0] === `${item.key}` ? styles.activeMenuItem : ''}`}
                    onClick={() => this.handleMenuItemClick(item)}
                  >
                    <img src={selectedKeys[0] === `${item.key}` ? item.selectedIconUrl : item.iconUrl} alt='' />
                    { !collapsed && (
                      <React.Fragment>
                        <span style={{ marginLeft: 8 }}>{item.name}</span>
                        {
                          (item.isNew) &&
                          <div style={{ width: 32, height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: '-8px' }}><img src={new_icon} alt='' /></div>
                        }
                      </React.Fragment>
                    )}
                  </Menu.Item>
                );
              })
            }
          </Menu>

        </Scrollbars>
        <Modal
          visible={this.state.scoreModalVisible}
          title={<div style={{ color: '#1A2243' }}>客户积分明细</div>}
          footer={null}
          onCancel={() => { this.setState({ scoreModalVisible: false }); }}
          width={document.body.clientWidth > 952 ? 852 : document.body.clientWidth - 100}
          bodyStyle={{ padding: 0 }}
          destroyOnClose
        >
          <ScoreDetail customerCode={customerCode} />
        </Modal>
      </Layout.Sider>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(PageSider);
