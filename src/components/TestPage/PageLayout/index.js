import React from 'react';
import { Route } from 'dva/router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Layout } from 'antd';
import PageHeader from './PageHeader';
import PageSider from './PageSider';
import NotFound from '../../../routes/Exception/404';

const { Footer, Content } = Layout;

const menuData = [
  {
    key: 'basicDataTable',
    name: 'basicDataTable',
    path: '/testPage/basicDataTable',
  },
  {
    key: 'dataTable',
    name: 'dataTable',
    path: '/testPage/dataTable',
  },
  {
    key: 'testPage 1',
    name: 'testPage 1',
    path: '/testPage/test1',
  },
  {
    key: 'testPage 2',
    name: 'testPage 2',
    path: '/testPage/test2',
  },
  {
    key: 'memberSingleSelect',
    name: 'memberSingleSelect',
    path: '/testPage/memberSingleSelect',
  },
  {
    key: 'vTable',
    name: 'vTable',
    path: '/testPage/vTable',
  },
  {
    key: 'cusGroup',
    name: '客户群相关组件',
    path: '/testPage/cusGroup',
  },
  {
    key: 'test3',
    name: 'test3',
    path: '/testPage/test3',
  },
];

export default class TestPageLayout extends React.PureComponent {
  render() {
    const { routes, location } = this.props;
    return (
      <Layout className="blue-lightgray-theme" style={{ height: '100%' }}>
        <PageSider
          location={location}
          routes={routes}
          menuData={menuData}
        />
        <Layout id="scrollContent">
          <PageHeader />
          <Content>
            <CacheSwitch>
              {
                // 路由
                routes.map(({ key, path, component }) => (
                  <CacheRoute
                    key={key || path}
                    exact
                    path={path}
                    component={component}
                  />
                ))
              }
              <Route render={NotFound} />
            </CacheSwitch>
          </Content>
          <Footer>Footer</Footer>
          <Content id="modalContent" />
        </Layout>
      </Layout>
    );
  }
}
