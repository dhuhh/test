import React, { Fragment, useEffect, useState, useRef } from "react";
import { Button, Modal, Icon, message, Tag, Input, Spin } from "antd";
import { omit, get, cloneDeep, pick } from "lodash";
import styles from "./index.less";
import EditLabel from "../com/LabelModal/EditLabel";
import DetailsPopover from "../com/DetailsPopover";
import { FetchMenu } from "@/services/amslb/user";
import editCustomer from '../../../../../../assets/customer/editCustomer1.png'
import treeMap from "../utils/treeShow";
import {
  AddCustIndex, //新增客户指标
  DeleteCustCode, //删除客户指标
  UpdateCustIndexDetails, //编辑
  QueryCustCodeObscure, //客户指标模糊查询
  QueryCustMetricsTree, //查询客户指标树
  QueryCustIndiDetails //查询客户指标详情
} from "$services/newProduct";
const { TextArea } = Input;
export default function RightContent({
  visible,
  setVisible,
  type,
  setType,
  customerLabel,
  detailsOfIndicators, //指标详情数据
  currentIndicators, //指标id
  customerIndicatorsChoseId, //当前选中的id
  queryCustIndiDetails, //请求详情方法
  getCustomerLabel,
  labelType,
  deleteCustomerIndicator, //删除指标回调
  customerTags //权限控制
}) {
  useEffect(() => {
    getFetchMenu(); //涉及页面请求方法
  }, []);

  const {
    calFormula = [],
    exegesis = "",
    indexCode = "",
    indexId:indexIds = "",
    indexName = "",
    indexStatus,
    level = "",
    parentId: parentIds = "",
    parentIndex = [],
    source = "",
    updateTime = "",
    viewColumn = "",
    viewTree = ""
  } = detailsOfIndicators;
  const [fetchMenuData, setFetchMenuData] = useState([]); //涉及页面数据
  const [editAllTree, setEditAllTree] = useState(viewTree); //已选中的树状结构(用于反向选择)
  const [allSelect, setAllSelect] = useState([]);
  const [okButtonLoading, setokButtonLoading] = useState(false);
  const [indicatorDetailsVisible, setIndicatorDetailsVisible] = useState(false); //指标详情浮窗控制
  const [indicatorDetailsId, setIndicatorDetailsId] = useState(""); //当前计算公式点击的指标id
  const [returnView, setReturnView] = useState(false); //控制回显还是编辑动作
  const [indicatorDetailsPopUpTitle, setIndicatorDetailsPopUpTitle] = useState(
    ""
  ); //展开的浮层标题

  //切换的时候渲染涉及页面图
  useEffect(() => {
    setTimeout(() => {
      const treeDom = document.getElementById("treeMap") ?? "";
      if (treeDom && detailsOfIndicators.viewTree) {
        treeDom.innerText = "";
        new treeMap({
          el: "#treeMap",
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
  const editRef = useRef();
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
  function buildTree(fid, id, root, resultRoot) {
    // 根节点
    if (resultRoot["fid"] === undefined) {
      resultRoot["fid"] = fid;
      resultRoot["id"] = "root";
      resultRoot["value"] = "root";
      resultRoot["title"] = "root";
      resultRoot["children"] = [];
      let idIndexMap = {};
      if (root["menu"] !== undefined) {
        for (let i = 0; i < root["menu"]["item"].length; i++) {
          buildTree(
            resultRoot["id"],
            root["menu"]["item"][i],
            root["menu"]["item"][i],
            resultRoot
          );
          if (idIndexMap[resultRoot["children"][i]["id"]] === undefined) {
            idIndexMap[resultRoot["children"][i]["id"]] = [i];
          } else {
            idIndexMap[resultRoot["children"][i]["id"]].push(i);
          }
        }
        let offset = 0;
        for (let key in idIndexMap) {
          if (idIndexMap[key].length > 1) {
            for (let j = 1; j < idIndexMap[key].length; j++) {
              if (
                resultRoot["children"][idIndexMap[key][j] - offset] ===
                undefined
              ) {
                continue;
              }
              // 如果第0个为空数组
              if (
                resultRoot["children"][idIndexMap[key][0] - offset] ===
                undefined
              ) {
                resultRoot["children"][idIndexMap[key][0] - offset] =
                  resultRoot["children"][idIndexMap[key][j] - offset];
              } else {
                resultRoot["children"][idIndexMap[key][0] - offset][
                  "children"
                ] = resultRoot["children"][idIndexMap[key][0] - offset][
                  "children"
                ].concat(
                  resultRoot["children"][idIndexMap[key][j] - offset][
                    "children"
                  ]
                );
              }
              resultRoot["children"].splice(idIndexMap[key][j] - offset, 1);
              offset++;
            }
          }
        }
      }
    } else {
      let result = {
        fid: fid,
        id: fid + "-" + root["title"][0]["text"],
        value: fid + "-" + root["title"][0]["text"],
        title: root["title"][0]["text"],
        children: []
      };
      resultRoot["children"].push(result);
      let idIndexMap = {};
      if (root["menu"] !== undefined) {
        for (let i = 0; i < root["menu"]["item"].length; i++) {
          buildTree(
            result["id"],
            root["menu"]["item"][i],
            root["menu"]["item"][i],
            result
          );
          if (idIndexMap[result["children"][i]["id"]] === undefined) {
            idIndexMap[result["children"][i]["id"]] = [i];
          } else {
            idIndexMap[result["children"][i]["id"]].push(i);
          }
        }
        let offset = 0;
        for (let key in idIndexMap) {
          if (idIndexMap[key].length > 1) {
            for (let j = 1; j < idIndexMap[key].length; j++) {
              if (
                result["children"][idIndexMap[key][j] - offset] === undefined
              ) {
                continue;
              }
              // 如果第0个为空数组
              if (
                result["children"][idIndexMap[key][0] - offset] === undefined
              ) {
                result["children"][idIndexMap[key][0] - offset] =
                  result["children"][idIndexMap[key][j] - offset];
              } else {
                result["children"][idIndexMap[key][0] - offset][
                  "children"
                ] = result["children"][idIndexMap[key][0] - offset][
                  "children"
                ].concat(
                  result["children"][idIndexMap[key][j] - offset]["children"]
                );
              }
              result["children"].splice(idIndexMap[key][j] - offset, 1);
              offset++;
            }
          }
        }
      }
    }
  }
  //数组扁平化
  function deep(node) {
    let stack = node,
      data = [];
    while (stack.length != 0) {
      let pop = stack.pop();
      data.push({
        id: pop.id,
        title: pop.title,
        fid: pop.fid,
        value: pop.value
      });
      let children = pop.children;
      if (children) {
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push(children[i]);
        }
      }
    }
    return data;
  }
  /* 涉及页面请求方法 */
  const getFetchMenu = () => {
    FetchMenu({ project: "SYSTEM" }).then(res => {
      let result = {};
      buildTree(0, 1, res["data"]["menuTree"], result);
      let arr = JSON.parse(JSON.stringify(result.children));
      let a = deep(arr);
      setAllSelect(a);
      setFetchMenuData(result.children);
    });
  };
  //根据level来递归寻找节点并返回对应的id
  function findNode(data, id, level) {
    let result;
    data.map(item => {
      if (item.indexId == id) {
        result = { ...item }; // 结果赋值
      } else {
        if (item.children) {
          findNode(item.children, id, level);
        }
      }
    });
    return level === "1" ? result.parentId : result.indexId;
  }
  //下架指标操作
  //编辑页面点击确定之后的回调
  const handleOk = () => {
    setokButtonLoading(true);
    const validateFields = get(editRef, "current.validateFields", "");
    if (typeof validateFields === "function") {
      setTimeout(() => {
        validateFields((err, values) => {
          if (err) {
            setokButtonLoading(false);
            return;
          } else {
            const {
              source = "", //指标来源----
              exegesis = "", //口径说明-----
              level = "", //父级还是子集-----
              calFormula = [], //计算公式-----
              parentId = "", //指标位置-----
              indexName = "", //指标名称-----
              viewColumn = "" //涉及页面回显数据-----
              /*  indexStatus="" */
            } = values;
            //开始构建请求参数
            const newCalFormula = calFormula.map((item, index) => {
              item.orders = index;
              return item;
            });
            let newParentId;
            function findNode(data, id, level) {
              data.map(item => {
                if (item.id == id) {
                  if (level === "1") {
                    newParentId = item.parentId;
                  } else {
                    newParentId = item.id;
                  }
                } else {
                  if (item.children) {
                    findNode(item.children, id, level);
                  }
                }
              });
            }
            findNode(customerLabel, parentId, level);
            if (!newParentId) {
              console.log(parentId);
              newParentId = parentIds;
            }
            const parms = {
              source,
              exegesis,
              level,
              calFormula: JSON.stringify(newCalFormula),
              parentId: newParentId,
              indexName,
              viewColumn: JSON.stringify(viewColumn),
              /* status: indexStatus, */
              viewTree: JSON.stringify(editAllTree)
            };
            //请求参数构建完成，开始根据字段值判断新建或编辑接口
            if (type === "2") {
              //进行编辑指标操作
              parms.indexId = indexIds;
              parms.status = indexStatus;
              console.log(parms);
              UpdateCustIndexDetails(parms)
                .then(res => {
                  message.success(res.note);
                  setReturnView(false);
                  setokButtonLoading(false);
                  setVisible(false);
                  //queryCustIndiDetails(currentIndicators)
                  getCustomerLabel({ status: 0 });
                })
                .catch(err => {
                  setokButtonLoading(false);
                  message.error(err.note || err.message);
                });
            }
            if (type === "1") {
              parms.status = values.indexStatus;
              //进行新建指标操作
              AddCustIndex(parms)
                .then(res => {
                  message.success("新增成功");
                  setReturnView(false);
                  setokButtonLoading(false);
                  setVisible(false);
                  //queryCustIndiDetails(currentIndicators)
                  getCustomerLabel({ status: 0 });
                })
                .catch(err => {
                  setokButtonLoading(false);
                  message.error(err.note || err.message);
                });
            }
          }
        });
      }, 5);
    }
  };
  //添加元素的回调
  return (
    <Fragment>
      <div className={styles["right-container"]}>
        <div className={styles["right-header"]}>
        
          <div>
          <img src={editCustomer} style={{ marginTop: '-2px',width:'24px' }} />
            <i
              className="iconfont icon-icon_my_zhibiao"
              style={{ verticalAlign: "middle", fontWeight: "normal" }}
            />
            &nbsp;{indexName}
          </div>
          <div
            className={styles["ax-btn"]}
            //style={{ display: !isShow && "none" }}
          >
            {customerTags.length > 0 &&
              customerTags.includes("customer_target_del") && (
                <Button
                  className="mr16"
                  onClick={() => {
                    deleteCustomerIndicator("删除");
                  }}
                >
                  删除指标
                </Button>
              )}
            {customerTags.length > 0 &&
              customerTags.includes("customer_target_upLower") && (
                <Button
                  className="mr16"
                  onClick={() => {
                    deleteCustomerIndicator(
                      indexStatus === "1" ? "下架" : "上架"
                    );
                  }}
                >
                  {indexStatus === "1" ? "下架" : "上架"}指标
                </Button>
              )}
            {customerTags.length > 0 &&
              customerTags.includes("customer_target_edit") && (
                <Button
                  onClick={() => {
                    setType("2");
                    setVisible(true);
                  }}
                >
                  编辑指标
                </Button>
              )}
          </div>
        </div>
        <div
          style={{
            paddingBottom: "1.33rem",
            borderBottom: "1px solid #EAEEF2"
          }}
        >
          {customerTags.length > 0 && (
            <div className={styles["content-detail"]}>
              <span>
                指标状态：
                <span  style={{fontWeight:400,color:'#61698C'}}>
                {indexStatus === "1"
                  ? "上架"
                  : indexStatus === "2"
                  ? "下架"
                  : "无"}
                </span>
              </span>
            </div>
          )}

          <div className={styles["content-detail"]}>
            <span>计算公式：</span>
            <div>
              {calFormula.length
                ? calFormula.map(item => (
                    <Tag
                      key={item.orders}
                      className={
                        item.isSymbol === "1"
                          ? styles["symbolStyle"]
                          : item.status === "1"
                          ? styles["shelfLabelStyle"]
                          : customerTags.length > 0 &&
                            customerTags.includes("customer_target_edit")
                          ? styles["shelfLabelStyle"]
                          : styles["removeShelfIndicatorStyle"]
                      }
                      onClick={() => {
                        if (item.status === "1") {
                          setIndicatorDetailsId(item.indexId);
                          setIndicatorDetailsVisible(true);
                        }else{
                          if(customerTags.length > 0 && customerTags.includes("customer_target_edit")){
                            setIndicatorDetailsId(item.indexId);
                            setIndicatorDetailsVisible(true);
                          }else{
                            return
                          }
                        }
                      }}
                    >
                      <span style={{ fontSize: 14,fontWeight: "400" }}>
                        {item.contens}
                      </span>
                    </Tag>
                  ))
                : "无"}
              {}
            </div>
          </div>
          <div className={styles["content-detail"]}>
            <span>口径说明：</span>
            {exegesis ? exegesis : "无"}
          </div>
          <div className={styles["content-detail"]}>
            <span>指标来源：</span>
            {source ? source : "无"}
          </div>
          <div className={styles["content-detail"]}>
            <span>更新时间：</span>
            {updateTime ? updateTime : "无"}
          </div>
          <div className={styles["content-detail"]}>
            <span>父级指标：</span>
            <div>
              {parentIndex.length
                ? parentIndex.map(item => (
                    <Tag
                      key={item.indexId}
                      className={
                        item.indexStatus === "1"
                        ? styles["shelfLabelStyle"]
                        : customerTags.length > 0 &&
                          customerTags.includes("customer_target_edit")
                        ? styles["shelfLabelStyle"]
                        : styles["removeShelfIndicatorStyle"]
                      }
                      onClick={() => {
                        if (item.indexStatus === "1") {
                          setIndicatorDetailsId(item.indexId);
                          setIndicatorDetailsVisible(true);
                        }else{
                          if(customerTags.length > 0 && customerTags.includes("customer_target_edit")){
                            setIndicatorDetailsId(item.indexId);
                            setIndicatorDetailsVisible(true);
                          }else{
                            return
                          }
                        }
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: "400" }}>
                        {item.indexName}
                      </span>
                    </Tag>
                  ))
                : "无"}
              {}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "felx-start" }}>
          <div className={styles["content-detail"]}>
            <span>涉及页面：</span>
          </div>
          <div id="treeMap" style={{ margin: "10px 0 0 -55px",/* maxHeight:'400px',overflow:'auto' */}}></div>
        </div>
      </div>

      <Modal
        width="596px"
        className={styles["ax-modal"]}
        title={type === "2" ? "编辑指标" : "新增指标"}
        visible={visible}
        maskClosable={false} //点击蒙层不允许关闭
        destroyOnClose={true} //关闭时销毁 Modal 里的子元素
        bodyStyle={{ padding: "1.33rem 2rem" }}
        onOk={handleOk} //确认回调
        onCancel={() => {
          if (!okButtonLoading) {
            setVisible(false);
            setReturnView(false);
          }
        }} //取消回调
      >
        <Spin spinning={okButtonLoading}>
          <EditLabel
            type={type}
            returnView={returnView}
            setReturnView={setReturnView}
            setEditAllTree={setEditAllTree}
            customerLabel={customerLabel}
            fetchMenuData={fetchMenuData} //涉及页面数据
            allSelect={allSelect}
            ref={editRef}
            indiObj={type === "2" ? detailsOfIndicators : {}}
          />
        </Spin>
      </Modal>
      <Modal
        footer={null}
        title={indicatorDetailsPopUpTitle}
        className={styles["ax-modal2"]}
        visible={indicatorDetailsVisible}
        //detailsOfIndicators={detailsOfIndicators}//详情数据
        maskClosable={false} //点击蒙层不允许关闭
        destroyOnClose={true} //关闭时销毁 Modal 里的子元素
        bodyStyle={{ padding: "1.33rem 2rem" }}
        onCancel={() => {
          setIndicatorDetailsVisible(false);
        }}
      >
        <DetailsPopover
          customerTags={customerTags}
          indicatorDetailsId={indicatorDetailsId}
          setIndicatorDetailsPopUpTitle={setIndicatorDetailsPopUpTitle}
        />
      </Modal>
    </Fragment>
  );
}
