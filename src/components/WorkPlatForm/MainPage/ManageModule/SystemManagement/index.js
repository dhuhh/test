import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Link } from 'dva/router';
import styles from '../index.less';
import staff from '$assets/pageLayout/staff_manage.png';
import customer from '$assets/pageLayout/customer_manage.png';
import relation from '$assets/pageLayout/relation_manage.png';
import event from '$assets/pageLayout/event_manage.png';
import permission from '$assets/pageLayout/permission_manage.png';
import arrow from '$assets/pageLayout/right_arrow_manage.png';
import addTabbar from '$utils/addTabbar';
import { viewSensors } from '../utils';

function SystemManagement() {
  const [resultList, setResultList] = useState([]);
  const [systemManageTree, setSystemManageTree] = useState({});
  const iamgeList = [staff, customer, relation, event, permission];

  useEffect(()=>{
    setSystemManageTree(JSON.parse(sessionStorage.getItem('systemManageTree')) || {});
  }, [sessionStorage.getItem('systemManageTree')]);

  useEffect(()=>{
    let cardList = [];
    if(systemManageTree && systemManageTree.menu) {
      cardList = systemManageTree.menu.item;
    }
    // console.log('系统管理列表=======', cardList);
    let tmpList = [];
    if(cardList.length > 0) {
      cardList.forEach((item, index)=>{
        const tmpCatalog = []; // 记录所有最底层的数据
        const secondMenu = []; // 记录所有卡片的二级菜单名称及其所有子菜单在catalog数组中对应的下标
        getInnerData(item.menu.item || [], tmpCatalog, secondMenu); // 递归出所有最底层(没有子menu)的名称和路由
        tmpList.push({ title: item.title[0].text || '--', image: iamgeList[index % 5], catalog: tmpCatalog, secondMenu });
      });
    }

    let totalUrl = []; // 记录所有的路由和名称,便于tab页面判断路由对应的名称
    tmpList.forEach((data)=> {
      totalUrl = [...new Set([...totalUrl, ...data.catalog])];
    })
    sessionStorage.setItem('systemUrl', JSON.stringify(totalUrl));

    setResultList(tmpList);
  }, [systemManageTree]);

  useLayoutEffect(() => {
    /** 直接获取，获取不到dom元素，所以利用定时器在元素渲染后获取高度
     *  card高度是动态变化的，所以需要利用js计算来动态赋值高度
     *  给content高度是为了使其flex-wrap生效，当子菜单超出时自动换列
     */
    const timer = setInterval(() => {
      const box = document.getElementsByClassName('cardBox');
      const card = document.getElementsByClassName('manageCard');
      const content = document.getElementsByClassName('cardContent');
      const secondMenu = document.getElementsByClassName('secondWordTree');
      if(card.length > 0) {
        for(let i = 0; i < card.length; i++) {
          content.item(i).style.height = `${card.item(i).offsetHeight - 110}px`;
        }
        // 子菜单超出一列换列时，在最顶部，用offestTop判断，改变marginTop使其与左侧对其
        for(let j = 0; j < secondMenu.length; j++) {
          if(secondMenu[j].offsetTop < 50) secondMenu[j].style.marginTop = '20px';
        }
        // visibility设置为hidden是为了屏蔽页面高度变化的过程
        box[0].style.visibility = 'visible';
        clearInterval(timer);
      }
    }, 500)
    return () => { if(timer) clearInterval(timer) };
  }, [])

  const getInnerData = (list, catalog, secondMenu) => {
    list.forEach((ele) => {
      if(ele.menu && ele.menu.item.length > 0 ) {
        // 二级菜单有子菜单，则对二级菜单进行递归
        const children = [];
        secondMenu.push({ name: ele.title[0].text || '--', children })
        getInnerData(ele.menu.item, catalog, children);
      } else {
        const showData = {name: ele.title[0].text || '--', url: ele.iconUrl=='NOIFRAME'?`${ele.url}`:`/iframe${ele.url}`}
        // catalog用于获取所有叶子节点
        catalog.push(showData);
        // 二级菜单有子菜单，则将所有的子菜单数据放到children中,否则直接放入secondMenu数组
        secondMenu.push(showData);
      }
    });
  }

  const toDetailPage = (listItem, isTree = false) => {
    return (
      <div className={styles.leftWord} key={listItem.name} style={{ marginTop: isTree ? '' : '16px' }}>
        <Link
          // key={listItem.name}
          to={listItem.url}
          title={listItem.name}
          className={styles.link}
        >
          <div className={styles.toDetail} onClick={()=>{addTabbar(`${listItem.url}|`); viewSensors('系统管理', '系统管理', listItem.name);}}>
            <div>{listItem.name}</div>
            <img src={arrow} style={{ width: '16px', height: '16px', cursor: 'pointer' }}/>
          </div>
        </Link>
      </div>
    );
  }

  // 有子菜单
  const secondMenuTree = (listItem) => {
    return (
      <React.Fragment key={listItem.name}>
        <div className={styles.secondName}>{listItem.name}</div>
        {
          listItem.children.map((item, index) => {
            return (
              <div className={`${styles.secondWord} secondWordTree ${listItem.children.length === 1 ? styles.oneItem : index === 0 ? styles.first : index + 1 === listItem.children.length ? styles.last : styles.other}`} key={item.url}>
                <div className={styles.widthLine} />
                { toDetailPage(item, true) }
              </div>
            );
          })
        }
      </React.Fragment>
    );
  }

  return (
    <div className={`${styles.box} cardBox`} style={{ visibility: 'hidden' }}>
      {
        resultList.map((item) =>{
          return (
            <div className={`${styles.card} manageCard`} key={item.title}>
              <div className={styles.title}>{item.title}</div>
              <div className={`${styles.content} cardContent`}>
                {
                  item.secondMenu.map((listItem)=> {
                    return listItem.children ? secondMenuTree(listItem) : toDetailPage(listItem);
                  })
                }
                </div>
              <img src={item.image} className={styles.img}/>
            </div>
          );
        })
      }
    </div>
  );
}

export default SystemManagement;