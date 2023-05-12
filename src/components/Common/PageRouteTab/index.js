/**
 * tab公共组件，根据传进来的菜单接口数据，将每一个子菜单路由当作一个tab页面
 */
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import { cloneDeep } from 'lodash';
import Iframe from 'react-iframe';
import styles from './index.less';
import tagNew from '$assets/pageLayout/tag_new.svg';
import { viewSensors } from './utils.js';
const { TabPane } = Tabs;

const PageRouteTab = (props) => {
  const [tabKey, setTabKey] = useState('0');
  const [showList, setShowList] = useState([]); // 用于展示的页面数组
  const [iframeIndex, setIframeIndex] = useState([]); // 记录所有iframe页面对应的tabKey
  const [secondModule, setSecondModule] = useState(''); // 菜单二级模块名称，用于埋点

  useEffect(() => {
    const menuTree = JSON.parse(sessionStorage.getItem('menuTree')) || [];
    let name = '';
    menuTree.forEach((item) => {
      if(item.menu && item.menu.item && item.menu.item.length > 0) { // 存在二级菜单
        item.menu.item.forEach((obj)=>{
          // 根据传进来的三级模块名称查找二级模块名称
          if(obj.title && obj.title.length > 0 && obj.title[0].text && obj.title[0].text === props.third_module) {
            name = item.title[0].text;
          }
        });
      }
    })
    setSecondModule(name);
  }, [sessionStorage.getItem('menuTree')])

  useEffect(() => {
    let showRoute = []; // 遍历路由数组，根据不同类型url将需要的内容放进数组，方便展示
    let indexList = []; // 记录所有iframe页面对应的tabKey
    props.routeList.forEach((item, index) => {
      if(item.url === '') { // url为空时
        showRoute.push(0);
      } else if (item.url.startsWith('{')) { // 为C4iframe类型页面时
        showRoute.push(item);
        indexList.push(index);
      } else if(item.url.startsWith('/epa')) { // epa页面
        showRoute.push(item);
        indexList.push(index);
      } else { // C5页面
        let routeItem = null;
        props.routes.forEach((opt) => {
          // 金融产品页面由于路由带有动态参数，所以特殊判断
          if(item.url.startsWith('/newProduct/financialProducts/') && opt.path === '/newProduct/financialProducts/:showActiveKey') {
            const tmpOpt = cloneDeep(opt);
            // 由于此处无法Link跳转，所以将每个页面的showActiveKey字段利用组件传参传入组件中
            tmpOpt.routeTabKey = item.url.substr(item.url.lastIndexOf('/') + 1);
            routeItem = { componentObj: tmpOpt, name: item.title[0]?.text };;
          } else if(opt.path === item.url) {
            routeItem = { componentObj: opt, name: item.title[0]?.text };
          }
        });
        showRoute.push(routeItem);
      }
    });
    setShowList(showRoute);
    setIframeIndex(indexList);
  },[JSON.stringify(props.routeList)]);

  useLayoutEffect(() => {
    // 为了使iframe的高度100%生效
    const opt = document.getElementsByClassName('pageRouteTabName')[0];
    opt.parentNode.parentNode.style.height = '100%';
  }, [])

  useEffect(() => {
    // 第一次进入页面时，默认第一个页面, 此时不会走changeTab逻辑，手动添加埋点
    if (showList.length > 0) {
      if (showList[0].url) {
        // 第一个页面为C4页面
        viewSensors(
          secondModule,
          props.third_module,
          showList[0].title[0]?.text
        );
      } else {
        // C5页面
        viewSensors(secondModule, props.third_module, showList[0].name);
      }
    }
  }, [JSON.stringify(showList), secondModule, props.third_module]);

  const changeTab = key => {
    setTabKey(key);
    if (showList[key].url) {
      // 切换到C4页面
      viewSensors(
        secondModule,
        props.third_module,
        showList[key].title[0]?.text
      );
    } else {
      // C5页面
      viewSensors(secondModule, props.third_module, showList[key].name);
    }
  };

  // C5组件
  const getComponentNode = item => {
    const C = item.component;
    return <C {...props} routeTabKey={item?.routeTabKey} />;
  };

  // 根据url判断paddingBottom的值
  const getIframeBottom = url => {
    let bottomLen = "100px";
    // 服务记录页面特殊处理
    if (url === "/bss/ncrm/ncustomer/serviceRecord/page/index.sdo") {
      bottomLen = "100px";
    }
    return bottomLen;
  };

  // 切换页面时，发现会执行多个合并页面对应的该组件，该方法找出当前路由对应的js执行过程，防止多个组件同时更改滚动条
  const verifyRealUrl = tmpRouteList => {
    const menuTree = JSON.parse(sessionStorage.getItem("menuTree")) || [];
    const routeList = [];
    menuTree.forEach(item => {
      if (item.menu && item.menu.item && item.menu.item.length > 0) {
        // 存在二级菜单
        item.menu.item.forEach(obj => {
          // 传入对应当前路由的二级菜单下的三级菜单(tab)路由
          if (
            obj.url &&
            window.location.hash.includes(obj.url) &&
            obj.menu &&
            obj.menu.item &&
            obj.menu.item.length > 0
          ) {
            routeList.push(obj);
          }
        });
      }
    });
    return (
      JSON.stringify(tmpRouteList) === JSON.stringify(routeList[0]?.menu?.item)
    );
  };

  // C4的页面，要隐藏最外层的滚动条
  const opt = document.getElementById("htmlContent");
  if (opt && verifyRealUrl(props.routeList)) {
    opt.scrollTop = 0; // 还原滚动条位置，否则会导致顶部tab被隐藏的问题
    opt.style.overflowY = iframeIndex.includes(Number(tabKey))
      ? "hidden"
      : "auto";
  }

  // console.log('showList=======', showList);
  return (
    <Tabs
      className={`${styles.tab} pageRouteTabName`}
      onChange={changeTab}
      activeKey={tabKey}
      style={{ height: iframeIndex.includes(Number(tabKey)) ? "100%" : "" }}
    >
      {showList.map((item, index) => {
        console.log("😅 => file: index.js:140 => showList.map => item", item);
        console.log(props.sysParam, "props.sysParam");
        return (
          <TabPane
            tab={
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>{props.routeList[index]?.title[0]?.text || ""}</span>
                {props.routeList[index].iconUrl &&
                  props.routeList[index].iconUrl === "NEW" && (
                    <img
                      width="25px"
                      style={{ marginLeft: "2px" }}
                      src={tagNew}
                    />
                  )}
              </div>
            }
            key={String(index)}
            style={{ height: "100%" }}
          >
            {item === 0 ? null : item.url?.startsWith("/epa") ? (
              <div style={{ height: "100%", paddingBottom: "70px" }}>
                <Iframe
                  className={styles.iframe}
                  height="100%"
                  width="100%"
                  src={`${props.sysParam
                    ?.find(i => i.csmc === "system.c4ym.url")
                    ?.csz.replace("8081", "8084") || ""}/#/single${item.url}`}
                />
              </div>
            ) : item.url ? (
              <div
                style={{
                  height: "100%",
                  paddingBottom: getIframeBottom(JSON.parse(item?.url)?.url)
                }}
              >
                <Iframe
                  className={styles.iframe}
                  height="100%"
                  width="100%"
                  src={`${props.sysParam?.find(
                    i => i.csmc === "system.c4ym.url"
                  )?.csz || ""}/loginServlet?token=${sessionStorage.getItem(
                    "iframeTabToken"
                  ) || ""}&callBackUrl=${encodeURIComponent(
                    encodeURIComponent(
                      `${props.sysParam?.find(i => i.csmc === "system.c4ym.url")
                        ?.csz || ""}${JSON.parse(item?.url)?.url}`
                    )
                  )}`}
                />
              </div>
            ) : item?.name === "考核查询" ? (
              <div
                style={{
                  height: "1000px"
                  //background: "red"
                  //paddingBottom: 1500
                }}
              >
                <Iframe
                  className={styles.iframe}
                  style={{ border: 0 }}
                  height="100%"
                  width="100%"
                  src={`${props.sysParam
                    ?.find(i => i.csmc === "system.c4ym.url")
                    ?.csz.replace("8081", "8084") || ""}/#/single${item?.componentObj?.path}`}
                />
              </div>
            ) : (
              getComponentNode(item.componentObj)
            )}
          </TabPane>
        );
      })}
    </Tabs>
  );
}

export default connect(({global})=>({
  userBasicInfo: global.userBasicInfo,
  sysParam: global.sysParam,
  tokenAESEncode: global.tokenAESEncode,
}))(PageRouteTab);