import React, { Fragment, useEffect, useState, useRef } from "react";
import { Button, Modal, Icon, message } from "antd";
import { omit, get, cloneDeep, pick } from "lodash";
import EditLabel from "../com/LabelModal/EditLabel";
import { _operateCustIndi, FetchQueryViewColumns } from "@/services/labelInstr";
import { FetchMenu } from "@/services/amslb/user";
import editCustomer from '../../../../../../assets/customer/editCustomer1.png'
import treeMap from "../utils/treeShow";
import styles from "../index.less";
import "../index.less";
// import data from './data';
/**
 * 员工指标tab右侧
 */

const RightContent = ({
  indiObj = {}, //左边点击获取id传回父组件从所有中过滤出的对象
  isShow, //控制权限按钮是否展示
  nextId,
  visible, //来控制新增、编辑弹窗的展开
  setVisible, //来控制新增、编辑弹窗的展开
  type, //判断弹窗模式是新增还是修改
  setType, //判断弹窗模式是新增还是修改
  getIndiData, //获取员工指标列表的方法
  dictionary = {} //字典信息
}) => {
  const [showWarn, setShowWarn] = useState(false); //表单-计算公式校验
  const [columnData, setColumnData] = useState([]);
  const [editAllTree, setEditAllTree] = useState([]); //已选中的树状结构
  const [allSelect, setAllSelect] = useState([]);
  const [fetchMenuData, setFetchMenuData] = useState([]);
  const [editClick, setEditClick] = useState(false);
  const dom = document.getElementById("treeMap");
  const editRef = useRef();

  useEffect(() => {
    GetQueryViewColumns(); /* 明细展示列列表查询方法 */
  }, []);
  useEffect(() => {
    getFetchMenu();//涉及页面请求方法
  }, []);
  //切换的时候渲染涉及页面图
  useEffect(() => {
    setTimeout(() => {
      const treeDom = document.getElementById("treeMap") ?? "";
      if (treeDom&&indiObj.treeValue) {
        treeDom.innerText = "";
        new treeMap({
          el: "#treeMap",
          margin: "10px 50px",
          data: dataFormat(JSON.parse(indiObj.treeValue)),
          right: 50,
          nodeClass: styles["tree-node"] //节点样式
        });
      }else{
        treeDom.innerText = "";
      }
    }, 10);
  }, [JSON.stringify(indiObj)]);
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
  /* 明细展示列列表查询方法 */
  const GetQueryViewColumns = () => {
    // const newData = data.filter(item => item.level === '2');
    // setColumnData(newData);
    FetchQueryViewColumns()
      .then(res => {
        const { code = 0, records = [] } = res || {};
        if (code > 0) {
          const newData = records.filter(item => item.level === "2");
          setColumnData(newData);
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
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
  const handleOk = () => {
    if (editClick) return;
    setEditClick(true);
    const validateFields = get(editRef, "current.validateFields", "");
    if (typeof validateFields === "function") {
      setTimeout(() => {
        validateFields((err, values) => {
          const {
            indiName = "",
            indiCode = "",
            indiBore = "",
            displayCol = [],
            calcStyle = "",
            calcObj = {},
            dataSrc = "",
            pages = [],
            relaType = []
          } = values;
          const empty =
            JSON.stringify(calcObj) === "{}" || calcObj.calcFormula === "";
          if (err || empty) {
            empty && setShowWarn(true);
            setEditClick(false);
            return;
          }
          const params = {
            indiName,
            indiCode,
            indiBore,
            calcStyle,
            dataSrc: calcStyle == "1" ? dataSrc : undefined,
            calcFormula: get(calcObj, "calcFormula", ""),
            // calcFormulaRsol: get(calcObj, 'calcDescr', ''),
            calcFormulaRsol: "",
            calcDescr: get(calcObj, "calcDescr", ""),
            pages: JSON.stringify(pages),
            treeValue: JSON.stringify(editAllTree),
            relaType: relaType.join(","),
            displayCol: displayCol.join(","),
            cancelFlag: type === "1" ? "0" : cancelFlag,
            indiId: indiObj.indiId
          };
          _OperateCustIndi(params, type);
        });
      }, 5);
    }
    // setVisible(false);
  };
  const handleCancel = () => {
    setShowWarn(false);
    if (typeof setVisible === "function") {
      setVisible(false);
    }
  };
  //上/下架标签
  const handleClick = () => {
    const name = cancelFlag === "0" ? "下架" : "上架";
    const flagMap = new Map([
      ["0", "1"],
      ["1", "0"],
      ["", ""]
    ]);
    const poyload = {
      ...omit(indiObj, "updateTime", "relaTypeId"),
      cancelFlag: flagMap.get(cancelFlag),
      calcDescr: formulaRsol,
      relaType: relaTypeId
    };
    Modal.confirm({
      content: `是否${name}该标签!`,
      icon: (
        <Icon
          className="fs20 ax-icon-yellow"
          type="exclamation-circle"
          theme="filled"
        />
      ),
      width: 300,
      cancelText: "取消",
      okText: "确定",
      onOk: () => _OperateCustIndi(poyload, "3")
    });
  };
  //编辑标签
  const handleEditClick = () => {
    if (typeof setType === "function") {
      setType("2");
    }
    if (typeof setVisible === "function") {
      setVisible(true);
    }
  };
  //标签操作 新增|修改|上/下架
  const _OperateCustIndi = (payload, oprTp) => {
    const params =
      oprTp === "3" ? pick(payload, ["indiCode", "cancelFlag"]) : payload;
    _operateCustIndi({ ...params, oprTp })
      .then(res => {
        const { note, code } = res;
        if (code > 0) {
          if (typeof getIndiData === "function") {
            getIndiData();
          }
          if (oprTp !== "3" && typeof setVisible === "function") {
            setVisible(false);
          }
          message.success(note);
        } else {
          message.error(note);
        }
        setTimeout(() => {
          setEditClick(false);
        }, 500);
      })
      .catch(e => {
        setTimeout(() => {
          setEditClick(false);
        }, 500);
        message.error(!e.success ? e.message : e.note);
      });
  };

  const {
    indiName = "",
    indiBore = "",
    displayCol = "",
    calcStyle = "",
    dataSrc = "",
    calcFormula = "",
    formulaRsol = "",
    relaType = "",
    relaTypeId = "",
    cancelFlag = "",
    updateTime = "",
    indiId = "",
    treeValue = ""
  } = indiObj;
  //console.log(JSON.parse(treeValue),'treeValuetreeValue');
  const relaTypeData = dictionary["RELA_TYPE"] || []; //关系类型
  const calcMethod = dictionary["TINDI_DEF_CAL_MODE"] || []; //计算方式   1|显示数据来源  2, 4|不调用getCalData  3|正常传
  const relaNameArr = relaTypeId
    .split(",")
    .map(item => relaTypeData.find(items => items.ibm === item)?.note ?? ""); //关系类型映射为中文名
  const relayName = relaNameArr.filter(item => item !== "").join("、");

  const calcName = calcMethod.find(item => item.ibm === calcStyle)?.note ?? ""; //计算方式映射为中文名

  const columnNameArr = displayCol
    .split(",")
    .map(item => columnData.find(items => items.id === item)?.viewName ?? ""); //明细展示列映射为中文名
  const columnName = columnNameArr.filter(item => item !== "").join("、");

  

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

  //涉及页面树型数据添加len字段
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

  const obj = type === "2" ? indiObj : { indiCode: nextId };

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
            &nbsp;{indiName || "--"}
          </div>
          <div
            className={styles["ax-btn"]}
            style={{ display: !isShow && "none" }}
          >
            <Button className="mr16" onClick={handleClick}>
              {cancelFlag === "0" ? "下架" : "上架"}指标
            </Button>
            <Button onClick={handleEditClick}>编辑指标</Button>
          </div>
        </div>
        <div
          style={{
            paddingBottom: "1.33rem",
            borderBottom: "1px solid #EAEEF2"
          }}
        >
          <div className={styles["content-detail"]}>
            <span>口径说明：</span>
            {indiBore || "--"}
          </div>
          <div className={styles["content-detail"]}>
            <span>明细展示列：</span>
            {columnName || "--"}
          </div>
          <div className={styles["content-detail"]}>
            <span>更新时间：</span>
            {updateTime || "--"}
          </div>
          <div className={styles["content-title"]}>计算规则</div>
        </div>
        <div
          style={{
            paddingBottom: "1.33rem",
            borderBottom: "1px solid #EAEEF2"
          }}
        >
          <div className={styles["content-detail"]}>
            <span>计算方式：</span>
            {calcName || "--"}
          </div>
          <div className={styles["content-detail"]}>
            <span>计算公式：</span>
            <span
              dangerouslySetInnerHTML={{ __html: formulaRsol || "--" }}
            ></span>
          </div>
          <div className={styles["content-detail"]}>
            <span>关系类型：</span>
            {relayName || "--"}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "felx-start" }}>
          <div className={styles["content-detail"]}>
            <span>涉及页面：</span>
          </div>
          <div id="treeMap" style={{ margin: "10px 0 0 -55px" }}></div>
        </div>
      </div>
      <Modal
        width="46.5rem"
        className={styles["ax-modal"]}
        title={type === "2" ? "编辑指标" : "新增指标"}
        visible={visible}
        maskClosable={false} //点击蒙层不允许关闭
        destroyOnClose={true} //关闭时销毁 Modal 里的子元素
        bodyStyle={{ padding: "1.33rem 2rem" }}
        onOk={handleOk} //确认回调
        onCancel={handleCancel} //取消回调
      >
        <EditLabel
          setEditAllTree={setEditAllTree}
          showWarn={showWarn} //表单-计算公式校验
          setShow={setShowWarn} //表单-计算公式校验
          indiObj={obj} //表单回显内容、根据新增/编辑传入不同的字段
          columnData={columnData} //明细展示列数据
          fetchMenuData={fetchMenuData} //涉及页面数据
          allSelect={allSelect}
          ref={editRef} //表单对象ref
        />
      </Modal>
    </Fragment>
  );
};

export default RightContent;
