import React, { PureComponent } from 'react';
import { Button, Layout, Modal } from 'antd';
import { history as router, connect } from 'umi';
import getIframeSrc from '$utils/getIframeSrc';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import Iframe from 'react-iframe';
import collapsed_icon from '$assets/newProduct/earing/collapsed.png';
import styles from './index.less';

class SubPageHeader extends PureComponent {
  state = {
    visible: false,
    title: '',
    url: '',
    width: 0,
    height: 0,
    modalKey: '1',
  }

  componentDidMount() {
    window.addEventListener('message', (e) => {
      const { page, action, success } = e.data;
      if (action === 'closeModal') {
        this.setState({ visible: false });
      }
    });
  }
  

  handleClick = (key) => {

    let url = '', title = '', width = document.body.clientWidth - 100, height = document.body.clientHeight - 150;
    const { sysParam = [], customerCode = '' } = this.props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    if (key === '1') {
      title = '服务记录';
      url = `/bss/ncrm/ncustomer/customerHandle/customerServiceLogs/page/customerFW.sdo?allSelected=false&allSelectedDatas=${customerCode}&fromToken=`;
      width = 624;
      height = 615;
      newClickSensors({
        third_module: "服务记录",
        ax_button_name: "服务记录点击次数",
      });
    } else if (key === '2') {
      title = '联系方式';
      url = `/bss/ncrm/ncustomer/nPanorama/basicInfo/page/modifyContactWay.sdo?isWindow=1&customerCode=${customerCode}&hasDefault=0&wechat=152544`;
      width = 688;
      height = 470;
      newClickSensors({
        third_module: "联系方式",
        ax_button_name: "联系方式点击次数",
      });
    } else if (key === '3') {
      title = '个性信息';
      url = `/bss/ncrm/ncustomer/nPanorama/basicInfo/page/personalizedInformation.sdo?isWindow=1&customerCode=${customerCode}&hasDefault=0`;
      width = 888;
      height = 630;
      newClickSensors({
        third_module: "个性信息",
        ax_button_name: "个性信息点击次数",
      });
    } else if (key === '4') {
      title = '调佣申请';
      url = `/bss/commissionApply/page/commissionApplyIndex.sdo?khh=${customerCode}`;
      width = 1088;
      newClickSensors({
        third_module: "调佣申请",
        ax_button_name: "调佣申请点击次数",
      });
    } else if (key === '5') {
      title = '打标签';
      url = `/bss/ncrm/ncustomer/customerHandle/customerLabels/page/customerDBQ.sdo?allSelected=false&allSelectedDatas=${customerCode}&fromToken=`;
      width = 688;
      height = 660;
      newClickSensors({
        third_module: "打标签",
        ax_button_name: "点击打标签次数",
      });
    } else if (key === '6') {
      title = '关系预约';
      url = `/bss/ncrm/ncustomer/nPanorama/page/pop.sdo?customerCode=${customerCode}&lx=1`;
      width = document.body.clientWidth;
      height = document.body.clientHeight;
      newClickSensors({
        third_module: "关系预约",
        ax_button_name: "点击次数",
      });
    } else if (key === '7') {
      title = '关系认领';
      url = `/bss/ncrm/ncustomer/nPanorama/page/pop.sdo?customerCode=${customerCode}&lx=2`;
      width = document.body.clientWidth;
      height = document.body.clientHeight;
      newClickSensors({
        third_module: "关系认领",
        ax_button_name: "点击次数",
      });
    } else if (key === '8') {
      const serverName = server === 'https://crm.axzq.com.cn:8081' ? 'http://sit-was.axzq.com.cn:8090' : 'http://was.essence.com.cn';
      window.open(`${serverName}/front/html/pages/home.html?menucode=1707&cusCode=${customerCode}`);
      newClickSensors({
        third_module: "资产配置",
        ax_button_name: "点击资产配置次数",
      });
      return;
    }
    this.setState({ url: `${server}${url}`, title, visible: true, width, height, modalKey: key });
  }

  colseModal = ()=>{
    this.setState({ visible: false });
    if (this.state.modalKey === '4'){
      newClickSensors({
        third_module: "调佣申请",
        ax_button_name: "调佣申请点击退出次数",
      });
    }

  }

  render() {
    const { toggleCollapsed, pathname, routes, collapsed, sysParam = [] } = this.props;
    const server = sysParam.find(item => item.csmc === 'system.c4ym.url')?.csz;
    const { width, height } = this.state;
    const x = 12 + (collapsed ? 80 : 176);
    const menuItem = routes.find(item => item.path === pathname);
    return (
      <div className={styles.box} style={{ position: 'fixed', top: 54, left: x, zIndex: 99, width: `calc(100% - ${x}px - 12px)` }}>
        <Layout.Header className={styles.header} >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div onClick={toggleCollapsed} style={{ cursor: 'pointer' }}>
              <img src={collapsed_icon} alt='' />
            </div>
            {
              !(routes.map(item => item.key).includes(pathname.substring(pathname.lastIndexOf('/') + 1))) && (
                <>
                  <div style={{ width: 1, height: 20, border: '1px solid #61698C', margin: '0 11px' }}></div>
                  <Button icon='arrow-left' className={styles.backButton} onClick={() => router.goBack()}>返回上层</Button>
                </>
              )}
          </div>
          <div>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('1')}>服务记录</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('2')}>联系方式</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('3')}>个性信息</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('4')}>调佣申请</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('5')}>打标签</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('6')}>关系预约</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('7')}>关系认领</span>
            <span className={styles.subMenuItem} onClick={() => this.handleClick('8')}>资产配置</span>
          </div>
          <Modal
            visible={this.state.visible}
            title={(this.state.modalKey === '6' || this.state.modalKey === '7') ? null : <div style={{ color: '#1A2243' }}>{this.state.title}</div>}
            footer={null}
            onCancel={() => { this.colseModal(); }}
            width={width}
            bodyStyle={{ padding: 0 }}
            destroyOnClose
            className={(this.state.modalKey === '6' || this.state.modalKey === '7') ? styles.modal : ''}
          >
            <Iframe url={getIframeSrc(this.props.tokenAESEncode, this.state.url, server)} height={`${height}px`} className={styles.iframe} />
          </Modal>
        </Layout.Header>
        {menuItem.key === 'assets' && <div className={styles.menuTitle}>资产贡献</div>}
        {menuItem.key === 'transaction' && <div className={styles.menuTitle}>交易</div>}
      </div>
    );
  }
}

export default connect(({ global }) => ({ sysParam: global.sysParam, tokenAESEncode: global.tokenAESEncode, }))(SubPageHeader);
