// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from 'D:/anxin/crm_staff_web/ms-fe-basic/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';
import ModelBase0 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/base.js';
import ModelGlobal1 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/global.js';
import ModelLogin2 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/login.js';
import ModelCustomerPanorama3 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/workPlatForm/customerPanorama/customerPanorama.js';
import ModelCommonList4 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/workPlatForm/mainPage/commonList.js';
import ModelMainPage5 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/workPlatForm/mainPage/mainPage.js';
import ModelProductSalesPanorama6 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/models/workPlatForm/productSalesPanorama/productSalesPanorama.js';
import ModelCustomerAnalysis7 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customer/models/customerAnalysis.js';
import ModelTaskcenter8 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customer/models/taskcenter.js';
import ModelMyTags9 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/customer/myCustomer/models/myTags.js';
import ModelNewFinancialProducts10 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/pages/workPlatForm/mainPage/newProduct/models/newFinancialProducts.js';
import dvaImmer, { enableES5, enableAllPlugins } from 'D:/anxin/crm_staff_web/ms-fe-basic/node_modules/dva-immer/dist/index.js';

let app:any = null;

export function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  
  app.use(createLoading());
  app.use(dvaImmer());
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'base', ...ModelBase0 });
app.model({ namespace: 'global', ...ModelGlobal1 });
app.model({ namespace: 'login', ...ModelLogin2 });
app.model({ namespace: 'customerPanorama', ...ModelCustomerPanorama3 });
app.model({ namespace: 'commonList', ...ModelCommonList4 });
app.model({ namespace: 'mainPage', ...ModelMainPage5 });
app.model({ namespace: 'productSalesPanorama', ...ModelProductSalesPanorama6 });
app.model({ namespace: 'customerAnalysis', ...ModelCustomerAnalysis7 });
app.model({ namespace: 'taskcenter', ...ModelTaskcenter8 });
app.model({ namespace: 'myTags', ...ModelMyTags9 });
app.model({ namespace: 'newFinancialProducts', ...ModelNewFinancialProducts10 });
  return app;
}

export function getApp() {
  return app;
}

/**
 * whether browser env
 * 
 * @returns boolean
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    // run only in client, avoid override server _onCreate()
    if (isBrowser()) {
      _onCreate()
    }
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    let app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
