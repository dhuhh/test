import React from 'react';
import { connect } from 'dva';
import { Route, Switch } from 'dva/router';
import { Layout } from 'antd';
// import lodash from 'lodash';
import PageSider from './PageSider';
// import PageHeader from './PageHeader';
// import PanoramaOperate from './PageHeader/operate';
import NotFound from '../../../pages/Exception/404';
// import logo from '../../../assets/logo.png';
import Profile from '../../../pages/workPlatForm/productSalesPanorama/profile';
import CustomerList from '../../../pages/workPlatForm/productSalesPanorama/customerList';
import { DecryptBase64 } from '../../../components/Common/Encrypt';

const { Content } = Layout;
class ProductSalesPanoramaLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    // 获取菜单默认展开状态，0：不展开，1：展开
    const menuExpansion = localStorage.getItem('menuExpansion');
    this.state = {
      collapsed: false,//menuExpansion !== '1',
    };
  }
  componentDidMount() {
    console.log('this.props', this.props);
  }
  getMenuData = (menuData, cpid) => {
    return menuData.map((item) => {
      const { path, children } = item;
      if (children && children.length > 0) { // 如果有子菜单,那么就递归调用该函数
        return {
          ...item,
          children: this.getMenuData(children, cpid),
        };
      }
      return {
        ...item,
        path: `${path}${cpid ? `/${cpid}` : ''}`,
      };
    });
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  render() {
    const { location, productSalesPanorama, sysParam } = this.props;
    const { pathname = '' } = location;
    console.info(location);
    // const queryParamsJson = DecryptBase64(pathname.substring(pathname.lastIndexOf('/') + 1));
    // let odlqueryParams = queryParamsJson.substring(queryParamsJson.lastIndexOf('=') + 1);
    // console.log('oldqueryParams', odlqueryParams);
    // const queryParams = JSON.parse(odlqueryParams);
    const { cusMoreInfo: { queryParams, oldUrl } } = productSalesPanorama;
    const { cusType: customerType = '', queryType = '', cpId: cpid = '', productName = '', productCode = '' } = queryParams;
    // const pathArr = pathname.split('/');
    // const cpid = pathArr[5];
    // //const productName = pathArr[4];
    // const queryType = pathArr[4];
    // const customerType = pathArr[3];
    // console.log('pathArr', pathArr);
    // const routes = lodash.get(route, 'routes', []);
    const { menuData } = productSalesPanorama;
    const menuDataWithCpid = this.getMenuData(menuData, cpid);
    return (
      <div className={`${this.state.collapsed ? 'hild-menu-box' : ''}`}>
        <Layout className="m-layout">
          <PageSider
            collapsed={this.state.collapsed}
            location={location}
            toggleCollapsed={this.toggleCollapsed}
            cpid={cpid}
            productName={productName}
            // routes={routes}
            menuData={menuDataWithCpid}
            queryType={queryType}
            customerType={customerType}
            oldUrl={oldUrl}
          />
          <Layout className="m-layout">
            {/* <PageHeader
              collapsed={this.state.collapsed}
              menuData={menuData}
              toggleCollapsed={this.toggleCollapsed}
              location={location}
              logo={logo}
            /> */}
            <Content className="m-layout-content360" style={this.state.collapsed ? { paddingTop: 0,paddingLeft:'6.5rem', height: '100%', overflowY: 'auto', background: '#f3f4f7' } : { padding: '0 1.333rem 0 19rem', height: '100%', overflowY: 'auto', background: '#f3f4f7' }}>
              <Switch>
                {/* {
                  // 路由
                  routes.map(({ key, path, component }) => (
                    <Route
                      key={key || path}
                      exact
                      path={path}
                      component={component}
                    />
                  ))
                } */}
                <Route key='Profile' path="/productSalesPanorama/index" render={() => (<Profile productCode={productCode} sysParam={sysParam} />)} />
                <Route key='CustomerList' path="/productSalesPanorama/customerList" render={() => (<CustomerList cpid={cpid} queryType={queryType} customerType={customerType} />)} />
                {/* <Redirect exact from={`${prefix}/customerPanorama/`} to={routes[0] ? routes[0].path : `${prefix}/404`} /> */}
                <Route render={NotFound} />
              </Switch>
            </Content>
            <Content id="modalContent" />
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default connect(({ global, productSalesPanorama }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  theme: global.theme,
  productSalesPanorama,
}))(ProductSalesPanoramaLayout);;
