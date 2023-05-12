import React from 'react';
import { connect } from 'dva';
import { Route, Switch, Link } from 'dva/router';
import { Layout } from 'antd';
import lodash from 'lodash';
import Exception from '../../../components/Exception';
import sensors from 'sa-sdk-javascript';

const { Content } = Layout;

class SinglePageLayout extends React.PureComponent {

  componentDidMount() {
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

  render() {
    const { location, routes: propsRoutes = [], theme } = this.props;
    const routes = propsRoutes.find(item => item.path.startsWith('/single/'))?.routes;
    // console.log('单页面接收路由========', this.props, propsRoutes, routes);
    return (
      <Layout className={`${theme}`} style={{ height: '100%' }}>
        <Content id='modalContent' style={{ minHeight: '100%' }}>
          <Switch>
            {
              // 路由
              routes.map(({ key, path, component }) => (
                <Route
                  key={key || path}
                  path={path}
                  component={component}
                  children={(props) => {
                    const C = component;
                    return <C routes={routes} {...props} />;
                  }}
                />
              ))
            }
            <Route render={() => <Exception type="404" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />} />
          </Switch>
        </Content>
        <Content id="psModalContent" />
      </Layout>
    );
  }
}

export default connect(({ global })=>({
  sysParam: global.sysParam,
  theme : global.theme
}))(SinglePageLayout);
