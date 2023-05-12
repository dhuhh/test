import React, { FC } from 'react';
import { Link } from 'umi';

type Props = Readonly<{
  routes?: any[],
}>

const RoutesMenu: FC<Props> = (props) => {
  const { routes = [] } = props;
  let arr: any[] = [];
  const getRoutes = (arr: any[], routes: any[]): void => {
    routes.map((item: any) => {
      arr.push(item.path);
      if (item.hasOwnProperty('routes')) {
        getRoutes(arr, item.routes);
      }
    })
  };
  getRoutes(arr, routes);
  return <div style={{ padding: '50px 0' }}>
    {
      arr.map((item, index) => <p><Link key={index} to={item}>{item}</Link></p>)
    }
  </div>
}

export default RoutesMenu;