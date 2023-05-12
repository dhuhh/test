import React from 'react';
import { Layout, Menu, Divider, Card, message } from 'antd';
import lodash from 'lodash';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { suffix } from '../../../../utils/config';
import { FetchQuerySingleProductDetail } from '$services/newProduct';
import { MenuOutlined } from '@ant-design/icons';
import styles from './index.less';

class ProductPanoramaSider extends React.PureComponent {
  constructor(props) {
    super(props);
    const { collapsed } = props;
    this.state = {
      collapsed,
      riskLevel: '--', // 风险等级
      riskType: '', // 投资者类型
    };
  }

  componentDidMount() {
    console.log('侧边栏开始加载了！！！！！！！！');
    this.getQuerySingleProductDetail();
  }

  UNSAFE_componentWillReceiveProps(props) {
    if ('collapsed' in props) {
      const { collapsed } = props;
      this.setState({
        collapsed,
      });
    }
  }

  componentDidUpdate = (prevProps) => {
    const { dictionary: { FXCSNL: oldFXCSNL = [] } } = prevProps;
    const { dictionary: { FXCSNL: newFXCSNL = [] } } = this.props;
    if (JSON.stringify(oldFXCSNL) !== JSON.stringify(newFXCSNL)) {
      this.getQuerySingleProductDetail();
    }
  }

  /**
 * 获得菜单子节点
 */
  getNavMenuItems = (menusData) => {
    console.log(menusData,'>>>>>>>>>>>>>>>>>>>>>>');
    if (!menusData) {
      return [];
    }
    
    // 过滤隐藏的菜单,并检查菜单权限
    return menusData.filter(item => item.name && !item.hideInMenu).map((item) => {
      const ItemDom = this.getSubMenuOrItem(item);
      return this.checkPermissionItem(item.authority, ItemDom);
    }).filter(item => !!item);
  }
  /**
   * 获取当前菜单节点及其子节点
   */
  getSubMenuOrItem = (item) => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <Menu.SubMenu
          key={item.key || item.path}
          title={
            item.icon ? (
              <span>
                <i className={`iconfont ${item.icon}`} />
                <span style={{ marginLeft: '1rem' }} className="hide-menu" id={this.state.collapsed ? styles.listHide : ''}>{item.name}</span>
              </span>
            ) : item.name
          }
        >
          {this.getNavMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={item.key || item.path} title={
        <a>
          {item.icon ? <i className={`iconfont ${item.icon}`} /> : ''}
          <span style={{ paddingLeft: '0.666rem' }} className="hide-menu" >{item.name}</span>
        </a>}>
        {this.getMenuItemPath(item)}
      </Menu.Item>
    );
  }
  /**
 * 判断是否是http链接.返回 Link 或 a
 */
  getMenuItemPath = (item) => {
    console.log(item,'2222');
    const { oldUrl } = this.props;
    let itemPath = this.conversionPath(item.path);
    itemPath = itemPath.substring(0, itemPath.lastIndexOf('/'));
    itemPath = `${itemPath}/${oldUrl}`;
    const { name, icon } = item;
    // 如果是 http(s) 链接,那么就返回一个a标签
    // if (/^https?:\/\//.test(itemPath)) {
    //   return (
    //     <a href={itemPath}>
    //       {icon ? <i className={`iconfont ${item.icon}`} /> : ''}
    //       <span className="hide-menu">{name}</span>
    //     </a>
    //   );
    // }
    // return (
    //   <Link
    //     to={itemPath}
    //     // replace={itemPath === this.props.location.pathname}
    //   >
    //     {icon ? <i className={`iconfont ${item.icon}`} /> : ''}
    //     <span className="hide-menu" style={{ marginLeft: '1rem' }}>{name}</span>
    //   </Link>
    // );
    return (
      <a onClick={() => this.handleLink(itemPath)}>
        {icon ? <i className={`iconfont ${item.icon}`} /> : ''}
        <span style={{ paddingLeft: '0.666rem' }} className="hide-menu" id={this.state.collapsed ? styles.listHide : ''}>{name}</span>
      </a>
    );
  }

  handleLink = (itemPath) => {
    window.location.href = `/#${itemPath}`;
  }
  /**
  * 转化路径
  */
  conversionPath = (path) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  }
  /**
    * 路由后缀处理
    */
  concatSuffix = (menuData) => {
    const suffixWithDot = `${suffix ? `.${suffix}` : ''}`;
    return menuData.map((item) => {
      const finalItem = { ...item };
      if (item.path && !item.path.endsWith(suffixWithDot)) {
        finalItem.path = `${item.path}${suffixWithDot}`;
      }
      if (item.children && item.children.length > 0) {
        finalItem.children = this.concatSuffix(item.children);
      }
      return finalItem;
    });
  }
  /**
   * 获取选中的菜单节点
   */
  getSelectedMenuKeys = (pathname, menus) => {
    const selectedKeys = [];
    // const { customerType = '', queryType = '' } = this.props;
    const newPathname = pathname.substring(0, pathname.lastIndexOf('/'));
    menus.every((item) => {
      let curentPath = item.path || '';
      //const queryParams = curentPath.substring(curentPath.lastIndexOf('/') + 1);
      curentPath = `${curentPath.substring(0, curentPath.lastIndexOf('/'))}`;
      // curentPath = `${curentPath}/${EncryptBase64(cpid)}`;
      const curentKey = item.key || curentPath;
      if (item.children) {
        let tempKeys = [];
        tempKeys.push(curentKey);
        // 递归检查子菜单
        tempKeys = tempKeys.concat(this.getSelectedMenuKeys(pathname, item.children));
        // 如果子菜单符合条件,那么就放到selectedKeys
        if (tempKeys.length > 1) {
          selectedKeys.push(...tempKeys);
          return false;
        }
      } else if (curentPath === newPathname) {
        selectedKeys.push(curentKey);
        return false;
      } else {
        // 如果没有匹配的,就清空数组
        selectedKeys.length = 0;
      }
      return true;
    });
    return selectedKeys;
  }
  /**
  * 检查菜单权限
  */
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(
        authority,
        ItemDom
      );
    }
    return ItemDom;
  }
  getQuerySingleProductDetail = () => {
    const { dictionary: { FXCSNL = [] } } = this.props;
    const { cpid: productId = '' } = this.props;
    if (JSON.stringify(FXCSNL) !== '[]') {
      FetchQuerySingleProductDetail({ productCode: '', productId, serviceId: '710013' }).then((res) => {
        let { note } = res;
        try {
          note = JSON.parse(note);
        }catch (error) {
          console.log('JSON格式化失败 !');
          console.log('res:', res);
          console.log('error:', error);
        }
        const riskLevel = lodash.get(note, 'ANSWERS[0].ANS_COMM_DATA[0][0].RISK_LVL_DESC', '--');
        const riskLevelVal = lodash.get(note, 'ANSWERS[0].ANS_COMM_DATA[0][0].RISK_LVL', '');
        let riskType = '--';
        FXCSNL.forEach(item => {
          if (riskLevelVal === item.ibm) {
            riskType = item.note;
          }
        });
        this.setState({ riskLevel, riskType });
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }
  getColor = (riskLevel) => {
    if (riskLevel === '高风险') {
      return '#FF0000';
    } else if (riskLevel === '中高风险') {
      return '#FF5100';
    } else if (riskLevel === '中风险') {
      return '#8400FF';
    } else if (riskLevel === '中低风险') {
      return '#0059FF';
    } else if (riskLevel === '低风险') {
      return '#008DFF';
    } else {
      return '#008DFF';
    }
  }
  render() {
    const { menuData, toggleCollapsed, location: { pathname }, productName = '' } = this.props;
    const { riskLevel = '--', riskType = '',collapsed } = this.state;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuData));
    } else {
      finalMenuData.push(...menuData);
    }
    // 获取当前选中的菜单key值
    const selectedKeys = this.getSelectedMenuKeys(pathname, finalMenuData);
    return (
      <Layout.Sider collapsible collapsedWidth={60} width="17.666rem" trigger={null} collapsed={collapsed} style={{ position: 'fixed', background: 'white' }} className={`${collapsed ? styles.m_collapsed : styles.m_uncollapsed} m-sider360`} >
        <Scrollbars
          autoHide
          renderTrackVertical={props => <div {...props} className={styles['scrollbars-track-vertical']} />}
        >
          <div style={collapsed ? { padding: '0 1.766rem' } : { width: '17.666rem' }} id={collapsed ? styles.isSmall : ''} className="m-product-sider360-head" onClick={toggleCollapsed} >
            <h3 id={collapsed ? styles.isClosed : ''}>
              <span>
                <i className="iconfont icon-menu" style={{ color: ' rgba(0, 0, 0, 0.65)', fontSize: '2rem', cursor: 'pointer' }}>
                  {collapsed ? <MenuOutlined /> : ''}
                </i>
              </span>
            </h3>
            <Card className='m-card' id={collapsed ? styles.isHide : ''}>
              <div style={{ padding: '24px 20px 0 20px' }}>
                <div style={{ fontSize: 20, color: '#1a2243', fontWeight: 'bold' }}>{productName || '--'}</div>
                <div style={{ width: 'max-content', padding: '5px 15px', borderRadius: 14, marginTop: '.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: this.getColor(riskLevel) }}>
                  <span style={{ color: '#fff' }}>{riskLevel}</span>
                </div>
                <Divider style={{ margin: '18px 0' }} />
              </div>
              <div style={{ padding: '0 20px 0 20px' }}>
                <div style={{ fontSize: 20, color: '#1a2243', fontWeight: 'bold' }}>{riskType}</div>
                <div>
                  <span style={{ fontSize: 14, color: '#61698c', marginTop: '.5rem' }}>投资者类型</span>
                </div>
                <Divider style={{ margin: '18px 0' }} />
              </div>
            </Card>
          </div>

          <div className="scroll-wrap" >
            <div className="scroll-cont">
              {/* <Scrollbars
                autoHide
                renderTrackVertical={props => <div {...props} className={styles['scrollbars-track-vertical']} />}
                style={{ width: '100%' }}
              > */}
              <Menu
                className='m-psp-menu'
                inlineIndent="24"
                mode='inline'
                style={{ width: '100%', marginTop: '0rem' }}
                selectedKeys={selectedKeys}
              >
                {
                  this.getNavMenuItems(finalMenuData)
                }
              </Menu>
              {/* </Scrollbars> */}
            </div>
          </div>
        </Scrollbars>
      </Layout.Sider>
    );
  }
}
  // console.log("🚀 ~ file: index.js:311 ~ ProductPanoramaSider ~ menusData", menusData)

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(ProductPanoramaSider);