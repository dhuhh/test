import login from './login';
import amslb from './amslb';
import commonbase from './commonbase';
import basicservices from './basicservices';
import home from './home';
import documentation from './documentation';
import token from './token';
import tool from './tool';
import organManagement from './organManagement';
import operational from './operational';
import sysCommon from './sysCommon';

const APIPrefix = '/api';

const getAPIs = () => {
  const apisInfo = {

    commonbase, // 系统通用api
    login, // 登录相关接口
    amslb, // 平台GRPC用户类WS接口
    basicservices, // 基础服务
    home, // 首页
    documentation, // 文档
    token,
    tool,
    organManagement,
    operational,
    sysCommon,
  };
  const apis = {};

  Object.keys(apisInfo).forEach((groupKey) => {
    const items = apisInfo[groupKey];
    const finalItems = {};
    items.forEach((item) => {
      const { key, url } = item;
      finalItems[key] = `${APIPrefix}${url}`;
    });
    apis[groupKey] = finalItems;
  });
  return apis;
};

export default getAPIs;
