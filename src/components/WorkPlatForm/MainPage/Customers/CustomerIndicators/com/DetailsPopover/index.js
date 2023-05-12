import React, { useEffect, useState } from "react";
import { omit, get, cloneDeep, pick } from "lodash";
import styles from "./index.less";
import treeMap from "../../utils/treeShow";
import { Row, Col, message, Spin, Tag } from "antd";
import {
  AddCustIndex, //新增客户指标
  DeleteCustCode, //删除客户指标
  QueryCustCodeObscure, //客户指标模糊查询
  QueryCustMetricsTree, //查询客户指标树
  QueryCustIndiDetails //查询客户指标详情
} from "$services/newProduct";
export default function index({
  indicatorDetailsId,
  setIndicatorDetailsPopUpTitle,
  customerTags
}) {
  const [detailsOfIndicators, setDetailsOfIndicators] = useState({}); //客户指标详情
  const [loading, setLoading] = useState(false); //整体的加载中状态
  //监听id数值的改变，如果存在id值就去请求
  useEffect(() => {
    if (indicatorDetailsId) {
      //(indicatorDetailsId, "检测到改变，准备请求数据。。。");
      queryCustIndiDetails({ indexId: indicatorDetailsId });
    } else {
      //console.log(indicatorDetailsId);
    }
  }, [indicatorDetailsId]);
  useEffect(() => {
    setTimeout(() => {
      const treeDom = document.getElementById("treeMap2") ?? "";
      if (treeDom && detailsOfIndicators.viewTree) {
        treeDom.innerText = "";
        new treeMap({
          el: "#treeMap2",
          margin: "10px 50px",
          data: dataFormat(JSON.parse(detailsOfIndicators.viewTree)),
          right: 50,
          nodeClass: styles["tree-node"] //节点样式
        });
      } else {
        treeDom.innerText = "";
      }
    }, 10);
  }, [JSON.stringify(detailsOfIndicators)]);
  const dataFormat = (data = []) => {
    let tree = cloneDeep(data);
    let node = tree;
    while (node.length > 0) {
      const tempArr = [];
      const lenArr = node.map(item => item.title?.length ?? 0);
      const maxLen = Math.max(...lenArr);
      node.forEach(item => {
        const { title = "", children = [] } = item;
        const len = (maxLen - title.length) * 14;
        len && treeUpdata(tree, title, len);
        if (children.length > 0) {
          tempArr.push(...item.children);
        }
      });
      node = cloneDeep(tempArr);
    }
    return tree;
  };
  //根据title 修改节点(具体接口具体调整)
  const treeUpdata = (treeData = [], title, len) => {
    if (treeData.length === 0) return;
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].title === title) {
        treeData[i].length = len;
        break;
      }
      if (treeData[i].children) {
        treeUpdata(treeData[i].children, title, len);
      }
    }
  };
  //查询客户指标详情
  const queryCustIndiDetails = queryData => {
    setLoading(true);
    QueryCustIndiDetails(queryData)
      .then(res => {
        setDetailsOfIndicators(res.records[0]);
        //console.log(res.records[0], "res.records[0]");
        setIndicatorDetailsPopUpTitle(res.records[0].indexName);
        //console.log(res);
      })
      .catch(err => message.error(err.note || err.message))
      .finally(() => setLoading(false));
  };
  const {
    calFormula = [],
    exegesis = "",
    indexCode = "",
    indexId = "",
    indexName = "",
    indexStatus = "",
    level = "",
    parentId = "",
    parentIndex = [],
    source = "",
    updateTime = "",
    viewColumn = "",
    viewTree = ""
  } = detailsOfIndicators;
  return (
    <Spin spinning={loading}>
      <div>
        <div
          style={{
            paddingBottom: "1.33rem",
            borderBottom: "1px solid #EAEEF2"
          }}
        >
          {customerTags.length > 0 && (
            <div className={styles["content-detail"]}>
              <span>指标状态：</span>
              {indexStatus === "1" ? "上架" : indexStatus === "2" ? "下架" : ""}
            </div>
          )}

          <div className={styles["content-detail"]}>
            <span>计算公式：</span>
            <div>
              {calFormula.map(item => (
                <Tag
                  key={item.orders}
                  className={
                    item.isSymbol === "1"
                      ? styles["symbolStyle"]
                      : styles["removeShelfIndicatorStyle"]
                  }
                >
                  <span style={{ fontSize: 14, fontWeight: "400px" }}>
                    {item.contens}
                  </span>
                </Tag>
              ))}
            </div>
          </div>
          <div className={styles["content-detail"]}>
            <span>口径说明：</span>
            {exegesis}
          </div>
          <div className={styles["content-detail"]}>
            <span>指标来源：</span>
            {source}
          </div>
          <div className={styles["content-detail"]}>
            <span>更新时间：</span>
            {updateTime}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "felx-start" }}>
          <div className={styles["content-detail"]}>
            <span>涉及页面：</span>
          </div>
          <div id="treeMap2" style={{ margin: "10px 0 0 -55px" }}></div>
        </div>
      </div>
    </Spin>
  );
}
