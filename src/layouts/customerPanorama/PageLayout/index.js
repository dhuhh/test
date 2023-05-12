import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Layout, message } from 'antd';
import PageSider from './PageSider';
import PageHeader from './PageHeader';
import SubPageHeader from './SubPageHeader';
import NotFound from '../../../pages/Exception/404';
import sensors from 'sa-sdk-javascript';
import { QueryCustomerAccessControl } from '$services/customerPanorama';
// import { DecryptBase64 } from '../../../components/Common/Encrypt';

const { Content } = Layout;
class CustomerPanoramaLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false, // 菜单收起状态
      isAccess: false, // 客户是否有客户号对应的权限
    };
  }

  componentDidMount(){
    const { location } = this.props;
    let { query: { customerCode = '' } } = location;
    this.verifyCustomerAccess(customerCode);
    this.initSensors();
  }

  // 初始化埋点
  initSensors = () => {
    // 设置定时器，使得获取用户id和运行环境（测试/生产）后再初始化埋点
    const timer = setInterval(() => {
      const { sysParam = [] } = this.props;
      const serverName = sysParam.filter(item => item?.csmc === 'system.c4ym.url')[0]?.csz;
      let server_url = '';
      let env = '';
      if (serverName === 'https://crm.axzq.com.cn:8081') {
        server_url = 'https://sit-ubdt.axzq.com.cn/sa?project=production'; // 埋点测试环境地址
        env = 'stg';
      } else if (serverName === 'https://crm.essence.com.cn:8081') {
        server_url = 'https://ubdt.essence.com.cn/sa?project=production'; // 埋点生产环境地址
        env = 'prd';
      } else if (!serverName) {
        return;
      } else {
        clearInterval(timer);
        console.log('系统参数表环境域名地址（测试/生产）发生改变，埋点初始化失败');
        return;
      }
      let id = '';
      try {
        id = `${JSON.parse(sessionStorage.user).id}`;
      } catch (e) {
        return;
      }
      // 初始化
      sensors.init({
        server_url,
        // is_track_single_page: true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
        heatmap: {
          // 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
          clickmap: 'not_collect',
          // 是否开启触达注意力图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
          scroll_notice_map: 'not_collect',
        },
        name: 'sensors',
        show_log: env === 'prd' ? false : true,
        // batch_send: true,
        // batch_send: {
        //   datasend_timeout: 6000, // 一次请求超过多少毫秒的话自动取消，防止请求无响应。
        //   send_interval: 6000, // 间隔多少毫秒发一次数据。
        //   one_send_max_length: 6, // 一次请求最大发送几条数据，防止数据太大
        // },
        send_type: 'ajax',
      });
      // (sensors as any).quick('autoTrack'); //用于采集 $pageview 事件。
      // 注册公共属性
      sensors.register({
        platform_type: 'Web',
        sys_name: '员工端PC端',
      });
      // 用户登录
      sensors.login(id);
      clearInterval(timer);
      // 埋点初始化成功
      console.log('埋点初始化成功');
    }, 300);
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  // 点击事件埋点
  clickSensors = (ax_button_name) => {
    sensors.track('page_click', {
      first_module: '员工端PC',
      second_module: '首页',
      third_module: '客户360',
      ax_page_name: '首页',
      ax_page_url: location.href,
      staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
      ax_button_name,
      card_id: '',
      card_name: '',
    });
  }
  // 查询客户是否拥有对应的客户号权限,没有则不能展示客户信息
  verifyCustomerAccess = (customerCode) => {
    if(customerCode) {
      QueryCustomerAccessControl({customerNo: customerCode}).then((response) => {
      const { note = '' } = response || {};
      if(note !== '当前用户无访问权限！') {
        this.setState({
          isAccess: true,
        });
      } else {
        message.info(note);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    } else {
      message.info('该客户暂无客户号！');
    }
  }

  render() {
    const { location, route } = this.props;
    const { collapsed, isAccess } = this.state;
    const { routes: propsRoutes = [] } = route;
    // console.log('客户360接收参数============', this.props);
    const routes = propsRoutes.find(item => item.path.startsWith('/customerPanorama'))?.routes;
    let { pathname = '', search = '', query: { customerCode = '' } } = location;
    return (
      <React.Fragment>
        {
          isAccess && (
            <Layout style={{ fontSize: 14, color: '#1A2243', minHeight: document.body.clientHeight - 10 }}>
              <PageHeader />
              <Layout>
                <PageSider
                  collapsed={this.state.collapsed}
                  toggleCollapsed={this.toggleCollapsed}
                  routes={routes}
                  search={search}
                  pathname={pathname}
                  customerCode={customerCode}
                  clickSensors={this.clickSensors}
                />
                <Content style={{ marginRight: 12, width: '100%', marginLeft: 12 + (collapsed ? 80 : 176) }}>
                  <SubPageHeader
                    toggleCollapsed={this.toggleCollapsed}
                    routes={routes}
                    pathname={pathname}
                    customerCode={customerCode}
                    collapsed={collapsed}
                    clickSensors={this.clickSensors}
                  />
                  <Content style={{ marginTop: 54 + 46 + 12 }}>
                    <CacheSwitch>
                      { routes.map(({ key, path, component, isCache = '0' }, index) => {
                        return (
                          <CacheRoute
                            when={() => (isCache === '1' || isCache === true) ? true : false}
                            key={key || path || index}
                            path={path}
                            exact={true}
                            unmount={false}
                            saveScrollPosition
                            component={component}
                          />
                        );
                      })
                      }
                      <Route component={NotFound} />
                    </CacheSwitch>
                  </Content>
                </Content>
                <Content id="modalContent" />
              </Layout>
            </Layout>
          )
        }
      </React.Fragment>
    );
  }
}

export default connect(({ global }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  theme: global.theme || 'anxin-dark-theme',
}))(CustomerPanoramaLayout);;
