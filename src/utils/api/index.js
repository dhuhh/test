import customerbase from './customerbase';
import commonbase from './commonbase';
import login from './login';
import basicservices from './basicservices';
import sysCommon from './sysCommon';
import amslb from './amslb';
import tool from './tool';
import token from './token';
// 伴随服务价值挖掘
import incidentialServices from "./incidentialServices";
// 产品销售一体化
import newProduct from './newProduct';
import customerPanorama from './customerPanorama';
// 金融产品
import financialproducts from './financialproducts';
// 客户高级模块相关api
import customersenior from './customersenior';
// 首页搜索记录相关接口
import searchInput from './searchInput';
// 客户分析
import customeranalysis from './customeranalysis';

const APIPrefix = '/api';

const getAPIs = () => {
  const apisInfo = {
    customerbase, // 客户模块相关api
    commonbase, // 系统通用api
    login, // 登录相关接口
    basicservices, // 基础服务
    sysCommon, // 系统通用相关api
    amslb, // 平台GRPC用户类WS接口
    tool,
    token,
    incidentialServices, // 伴随服务价值挖掘
    newProduct, // 产品销售一体化
    customerPanorama, // 客户360
    financialproducts, // 金融产品
    customersenior, // 客户高级模块相关api
    searchInput, // 首页搜索记录相关接口
    customeranalysis, // 客户分析
  };
  const apis = {};

  Object.keys(apisInfo).forEach((groupKey) => {
    const items = apisInfo[groupKey];
    const finalItems = {};
    items.forEach((item) => {
      const { key, url, version = 'v5.0.0.1' } = item;
      finalItems[key] = `${APIPrefix}${url}`;
      finalItems[`${key}version`] = version;
    });
    apis[groupKey] = finalItems;
  });
  return apis;
};

export default getAPIs;
