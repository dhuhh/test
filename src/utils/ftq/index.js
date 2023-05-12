
//港股通--业务报表
import businessStatement from './businessStatement';
import searchProcess from './searchProcess';
import getMyQrCodeWithLogo from './getMyQrCodeWithLogo';
import getBankCodeList from './getMyQrCodeWithLogo';
import customerPanoramaFtq from './customerPanoramaFtq';
import ecifEvent from './ecifEvent';
import newProduct from './newProduct';
import customerTag from './customerTag';
import productChance from './productChance';
import activityComPage from './activityComPage' ;
import fortuneCalendar from './fortuneCalendar';

const APIPrefix = '/ftq';

const getFTQs = () => {
  const apisInfo = {
    businessStatement,//港股通--业务报表
    searchProcess, //聚安一站通业务查询
    getMyQrCodeWithLogo,
    getBankCodeList,
    ecifEvent, // 客户不规范信息--ECIF
    customerPanoramaFtq,
    activityComPage, // 活动接口公用
    newProduct,
    customerTag,
    productChance,
    fortuneCalendar,
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

export default getFTQs;
