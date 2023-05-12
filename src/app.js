// import router from 'umi/router';
import { message } from 'antd';
import onSessionTimeout from 'livebos-frame/dist/session';
import { fetchWebserviceFrontEndConfig } from './services/commonbase';

message.config({
  getContainer: () => document.getElementsByTagName('body')[0],
  maxCount: 2,
});

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      const { statusCode } = err;
      if (statusCode === 900) {
        // c5会话过期，通过页面消息通知livebos
        onSessionTimeout('*');
      }
    },
  },
};

// 从接口中获取子应用配置，export 出的 qiankun 变量是一个 promise
export const qiankun = sessionStorage.getItem('ms-config') ?
  Promise.resolve({
    apps: JSON.parse(sessionStorage.getItem('ms-config')),
    // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
    lifeCycles: {
      afterMount: (props) => {
        console.log(props);
      },
    },
  }) :
  fetchWebserviceFrontEndConfig().then(result => {
    const { records = [] } = result;
    const apps = [];
    records.forEach((item) => {
      const { name = '', entry = '' } = item;
      apps.push({ name, entry });
    });
    sessionStorage.setItem('ms-config', JSON.stringify(apps));
    return Promise.resolve({
      // 注册子应用信息
      apps,
      // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
      lifeCycles: {
        afterMount: (props) => {
          console.log(props);
        },
      },
      // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
    });
  })


// export const qiankun = fetch('/api/commonbase/v1/webserviceFrontEndConfig')
//   .then((res) => {
//     return res.json();
//   })
//   .then(({ apps }) => {
//     console.info(apps);
//     return Promise.resolve({
//       // 注册子应用信息
//       apps,
//       // 完整生命周期钩子请看 https://qiankun.umijs.org/zh/api/#registermicroapps-apps-lifecycles
//       lifeCycles: {
//         afterMount: (props) => {
//           console.log(props);
//         },
//       },
//       // 支持更多的其他配置，详细看这里 https://qiankun.umijs.org/zh/api/#start-opts
//     });
//   });

// 判断会话是否过期
export function render(oldRender) {
  /* const status = window.sessionStorage.getItem('loginStatus') || '0'; // 登录状态: 0|未登录;1|已登录;-1|过期;
  if (status === '1') {
      oldRender();
  } else {
      router.push('/login')
      oldRender();
  } */
  oldRender();
}
