// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '../../app.js';
import * as Plugin_1 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/.umi/plugin-dva/runtime.tsx';
import * as Plugin_2 from '../plugin-initial-state/runtime';
import * as Plugin_3 from 'D:/anxin/crm_staff_web/ms-fe-basic/src/.umi/plugin-locale/runtime.tsx';
import * as Plugin_4 from '../plugin-model/runtime';
import * as Plugin_5 from '@@/plugin-qiankun/masterRuntimePlugin';
import * as Plugin_6 from '@@/plugin-qiankun/slaveRuntimePlugin';

  plugin.register({
    apply: Plugin_0,
    path: '../../app.js',
  });
  plugin.register({
    apply: Plugin_1,
    path: 'D:/anxin/crm_staff_web/ms-fe-basic/src/.umi/plugin-dva/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: 'D:/anxin/crm_staff_web/ms-fe-basic/src/.umi/plugin-locale/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_4,
    path: '../plugin-model/runtime',
  });
  plugin.register({
    apply: Plugin_5,
    path: '@@/plugin-qiankun/masterRuntimePlugin',
  });
  plugin.register({
    apply: Plugin_6,
    path: '@@/plugin-qiankun/slaveRuntimePlugin',
  });

export const __mfsu = 1;
