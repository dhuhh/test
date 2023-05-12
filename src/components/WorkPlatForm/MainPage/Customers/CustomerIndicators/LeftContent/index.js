import React, {
  useEffect
} from "react";
import {
  Tabs,
  Menu,
  Icon,
  Select,
  Button,
  Modal,
  TreeSelect,
  Input,
  Tree
} from "antd";
import { useState } from "react";
import styles from "./index.less";
const { Option } = Select;
const { TreeNode } = Tree;
export default function LeftContent({
  customerLabel = [],
  KHZBchoic = {},
  setVisible,
  setType,
  setCustomerIndicatorsChoseId,
  customerIndicatorsChosePId,
  labelType, //筛选指标状态
  setLabelType,
  openKeys,
  setOpenKeys,
  selectedKeys,
  setSelectedKeys,
  customerTags, //权限控制
  setSearchOrClick,
  treeOpen,
  setTreeOpen
}) {
  /* --------------------------------------数据定义区----------------------------------- */
  const indiType = [
    { ibm: "1", note: "上架" },
    { ibm: "2", note: "下架" },
    { ibm: "0", note: "全部" }
  ];

  /* --------------------------------------effect区----------------------------------- */
/*   useEffect(() => {
    if (Object.keys(KHZBchoic).length !== 0) {
      console.log(KHZBchoic,'KHZBchoic');
      //将choic Id同步到自身组件状态
    setTimeout(()=>{
      console.log('开始执行选中');
      setSelectedKeys([KHZBchoic.value]);
      console.log(customerIndicatorsChosePId,'customerIndicatorsChosePId');
      setOpenKeys([customerIndicatorsChosePId]);
    },300)
      //执行选中函数，进行定位并选中,并传递第二个参数来区别是手动点击还是自动选中
      //menuClick(props.choic,true);
      //setSelectItem(props.choic.originTagId)
    }
  }, [JSON.stringify(KHZBchoic)]); */

  useEffect(() => {
    if (document.getElementById("menuItem" + KHZBchoic.value)) {
      scrollToAnchor("menuItem" + KHZBchoic.value);
    }
  }, [document.getElementById("menuItem" + KHZBchoic.value)]);
  /* --------------------------------------方法区域----------------------------------- */
  //跳转到选中的节点
  const scrollToAnchor = anchorName => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        setTimeout(() => {
          anchorElement.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  };
  //树组件渲染方法
  const renderTreeNodes = data => {
    let returnRes = data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            className={styles[`${choiceTrueColor(item.id)}`]}
            disabled={treeNodesOk(item)}
            title={
              <span id={"menuItem" + item.id} >
                {item.indexName}
                <Icon type="right" style={{ fontSize: "12px" }} />
              </span>
            }
            key={item.id}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          className={styles.myTreeNodes}
          disabled={treeNodesOk(item)}
          title={
            <span id={"menuItem" + item.id}>
              {item.indexName}
              <Icon type="right" style={{ fontSize: "12px" }} />
            </span>
          }
          key={item.id}
        />
      );
    });
    return returnRes;
  };
  //遍历对象找到所有孩子节点上架属性
  function readUp(nodes = [], arr = []) {
    for (let item of nodes) {
      arr.push(item.status);
      if (item.children && item.children.length) {
        readUp(item.children, arr);
      }
    }
    return arr;
  }
  function getObjById(list, id) {
    if (!list instanceof Array) {
      return null;
    }
    for(let i in list){
      let item=list[i]
      if(item.id===id){
        return item
      }else{
        if(item.children){
          let value=getObjById(item.children,id)
          if(value){
            return value
          }
        }
      }
    }
  }
  const choiceTrueColor=(id)=>{
    let res
    findNode([...customerLabel],id);
    function findNode(data, id) {
      let result;
      data.map(item => {
        if (item.id == id) {
          result = item; // 结果赋值
        } else {
          if (item.children) {
            findNode(item.children, id);
          }
        }
      });
      if (result) {
        if(labelType === "1" && readUp(result?.children).every(item => item === "2")){
          res= 'myTreeNode'
        }else if(labelType === "2" && readUp(result?.children).every(item => item === "1")){
          res= 'myTreeNode'
        }else{
          res= ''
        }
      }
    }
    return res
  }
  //决定节点是否可以展开
  const treeNodesOpen = (val) => {
    setTreeOpen(false)
    if (!val.length) setOpenKeys([]);
    const vall = [...val];
    findNode([...customerLabel], vall.pop());
    function findNode(data, id) {
      let result;
      data.map(item => {
        if (item.id == id) {
          result = item; // 结果赋值
        } else {
          if (item.children) {
            findNode(item.children, id);
          }
        }
      });
      if (result) {
        if(labelType === "1"){
          if (!readUp(result?.children).every(item => item === "2")) {setOpenKeys(val)}
        }else if(labelType === "2"){
          if (!readUp(result?.children).every(item => item === "1")) {setOpenKeys(val)}
        }else{
          setOpenKeys(val)
        }
      }
    }
    //const vall=[...val]
    //findNode([...customerLabel],vall.pop()).up?setOpenKeys(val):''
  };

  //决定节点是否可以选中
  const treeNodesOk = item => {
    //分三种情况进行判断
    if (labelType === "1") {
      //上架
      return item.status === "2" ? true : false;
    } else if (labelType === "2") {
      //下架
      return item.status === "2" ? false : true;
    } else {
      //全部
      return false;
    }
    /* //判断自身的上架状态
    //如果下架就直接禁用
    if (item.status === "2") {
      return true;
    } else {
      //否则判断是否有子节点
      if (item.children && item.children.length) {
        //如果存在子节点，判断所有子节点是否都是下架状态?
        if (readUp(item.children).every(item => item === "2")) {
          //如果全部处于下架状态
          return true;
        } else {
          return false;
        }
      } else {
        //如果不存在子节点，可用
        return false;
      }
    } */
  };
  //遍历树节点
  return (
    <div style={{ height: "900px" }}>
      {
        customerTags.length > 0 && <div
        className={`${styles["left-bar"]} ${styles["ax-form"]} ${styles["ax-btn"]}`}
      >
        <span style={{ marginRight: "8px", color: "#1A2243" }}>指标类型</span>
        <Select
          disabled={customerTags.length > 0 ? false : true}
          defaultValue={customerTags.length > 0 ? "0" : "1"}
          style={{ flex: "1" }}
          placeholder="请选择"
          onChange={(value = "") => {
            setCustomerIndicatorsChoseId('')
            setLabelType(value);
            setOpenKeys([]);
          }}
          dropdownClassName={styles["left-select"]}
          getPopupContainer={node => node.parentNode}
        >
          {indiType.map(item => (
            <Option key={item.ibm}>{item.note}</Option>
          ))}
        </Select>
        {customerTags.length > 0 &&
          customerTags.includes("customer_target_add") && (
            <Button
              className="ml8"
              onClick={() => {
                setType("1");
                setVisible(true);
              }}
            >
              新增指标
            </Button>
          )}
      </div>
      }
      <div className={styles.content}>
        <div className={styles.contentUp}></div>
        <div style={{marginTop:'10px'}}>
        <Tree
          //checkStrictly={true}
          onExpand={treeNodesOpen}
          expandedKeys={openKeys}
          autoExpandParent={treeOpen}
          onSelect={val => {
            setSearchOrClick(false)
            setSelectedKeys(val);
            setCustomerIndicatorsChoseId(val[0]);
          }}
          selectedKeys={selectedKeys}
        >
          {renderTreeNodes(customerLabel)}
        </Tree>
        </div>
        
      </div>
    </div>
  );
}
