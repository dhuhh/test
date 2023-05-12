import React, { Fragment, useEffect, useState, useRef } from "react";
import { Tree, Input, Row, Col, Button, Empty, Spin, Icon, Tag } from "antd";
import { connect } from "dva";
import { cloneDeep, uniqBy } from "lodash";
//import { treeToFlat } from "../../utils/formatTree";
import { Scrollbars } from "react-custom-scrollbars";
//import EditContent from "./editContent";
import styles from "./index.less";
import {
  AddCustIndex, //新增客户指标
  DeleteCustCode, //删除客户指标
  QueryCustCodeObscure, //客户指标模糊查询
  QueryCustMetricsTree, //查询客户指标树
  QueryCustIndiDetails //查询客户指标详情
} from "$services/newProduct";
import { symbol } from "prop-types";
/**
 * 编辑标签-计算公式模块
 */
const operatorData = [
  {
    expsDescr: "+",
    expsNm: "+",
    calExpsRsol: "+",
    calExps: "+",
    regStr: "\\+",
    span: 6
  },
  {
    expsDescr: "-",
    expsNm: "-",
    calExpsRsol: "-",
    calExps: "-",
    regStr: "\\-",
    span: 6
  },
  {
    expsDescr: "*",
    expsNm: "×",
    calExpsRsol: "*",
    calExps: "*",
    regStr: "\\*",
    span: 6
  },
  {
    expsDescr: "/",
    expsNm: "÷",
    calExpsRsol: "/",
    calExps: "/",
    regStr: "\\÷",
    span: 6
  },

  {
    expsDescr: "(",
    expsNm: "(",
    calExpsRsol: "max",
    calExps: "(",
    regStr: "\\GREATEST",
    span: 12
  },
  {
    expsDescr: ")",
    expsNm: ")",
    calExpsRsol: "min",
    calExps: ")",
    regStr: "\\LEAST",
    span: 12
  },
  {
    expsDescr: "略",
    expsNm: "略",
    calExpsRsol: "min",
    calExps: "略",
    regStr: "\\LEAST",
    span: 24
  }
];
const { TreeNode } = Tree;
const CalCulation = ({
  //showWarn,
  //editable,
  //defaultValue = "",
  //loading,
  calData = [],
  //onChange,
  //handleCalParamsChange,
  testCalArr,
  setTestCalArr,
  culculationTreeSelect,
  symbolButtonClick,
  selectedKeys,
  removeTags,
  returnView,
  setReturnView,
  setSelectedKeys,
  indexId
}) => {
  const divRef = useRef();
  const editRef = useRef();
  // const [indiArr, setIndiArr] = useState(calData);
  const [thisCalData, setThisCalData] = useState([...calData]);
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [searchValue, setSearchValue] = useState(""); //Tree搜索值
  const [expandedKeys, setKeys] = useState([]); //Tree展开值
  const [autoExpandParent, setAutoExpandParent] = useState(true); //Tree自动展开
  const [openKeys, setOpenKeys] = useState([]); //控制树打开状态
  //const [selectedKeys, setSelectedKeys] = useState([]); //控制menuItem选中状态
  //const [testCalArr, setTestCalArr] = useState([]); //计算公式数组，测试

  /* ---------光标可控制计算器显示区域----------- */
  const dom = document.getElementById("edit2");
  const text = dom ? dom.innerHTML : "null";
  const defaultValue = ``;
  const [value, setValue] = useState("");
  const [savedRange, setSavedRange] = useState(null);
  const [oldData, setOldData] = useState([]);

  const handleSelectionChange = () => {
    let sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount) {
      setSavedRange(sel.getRangeAt(0));
    }
  };
  const handleInput = e => {
    //if (editable) return ;
    const event = e || window.event;
    event.preventDefault();
  };
  const handleAddElement = () => {
    insertElement(value);
  };
  // 获取光标，插入html
  const insertElement = html => {
    let sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel && sel.rangeCount === 0 && savedRange !== null)
        sel.addRange(savedRange); // 保留光标在文字中间插入的最后位置
      if (sel && sel.rangeCount) range = sel.getRangeAt(0);
      if (["", null, undefined].includes(range)) {
        // 如果div没有光标，则在div内容末尾插入
        range = resetCursor(true).getRangeAt(0);
      } else {
        const contentRange = document.createRange();
        contentRange.selectNode(divRef.current);
        // 对比range，检查光标是否在输入范围内
        const compareStart = range.compareBoundaryPoints(
          Range.START_TO_START,
          contentRange
        );
        const compareEnd = range.compareBoundaryPoints(
          Range.END_TO_END,
          contentRange
        );
        const compare = compareStart !== -1 && compareEnd !== 1;
        if (!compare) range = resetCursor(true).getRangeAt(0);
      }
      let input = range.createContextualFragment(html);
      let lastNode = input.lastChild; // 记录插入input之后的最后节点位置
      range.insertNode(input);
      if (lastNode) {
        // 如果有最后的节点
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else if (
      document["selection"] &&
      document["selection"].type !== "Control"
    ) {
      document["selection"].createRange().pasteHTML(html);
    }
  };
  const resetCursor = isReturn => {
    if (window.getSelection) {
      divRef.current.focus();
      let sel = window.getSelection(); // 创建range
      sel.selectAllChildren(divRef.current); // range 选择obj下所有子内容
      sel.collapseToEnd(); // 光标移至最后
      if (isReturn) return sel;
    } else if (document["selection"]) {
      let sel = document["selection"].createRange(); // 创建选择对象
      sel.moveToElementText(divRef.current); // range定位到编辑器
      sel.collapse(false); // 光标移至最后
      sel.select();
      if (isReturn) return sel;
    }
  };

  //在这里得到变化的计算公式对象，并执行渲染
  useEffect(() => {
    console.log(testCalArr, "testCalArr");
    if (testCalArr) {
      document.getElementById("edit2").innerHTML = "";
      let element;
      testCalArr.forEach(item => {
        element = `<input
          class="select-tag"
          value="${item.contens}"
          name="${item.nowTime}"
          type="button"
        />`;
        insertElement(element);
      });
    }
  }, [testCalArr]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange, false);
    //document.getElementById('edit').addEventListener('textInput', handleInput, false);
    //document.getElementById("edit").addEventListener("textInput", handleInput);
  }, []);

  useEffect(() => {
    setValue(text);
  }, [text]);

  useEffect(() => {
    const filterValue = value
      .replace(new RegExp('<input class="select-tag" value="(.+?)"', "g"), "")
      .replace(new RegExp('<input class="btn-tag" value="(.+?)"', "g"), "")
      .replace(new RegExp('type="button">', "g"), "")
      .replace(new RegExp('type="button"/>', "g"), "")
      .replace(new RegExp('name="|"', "g"), "");
    // .replace(new RegExp(' ', 'g'), '');
    removeTags(filterValue.split("  ").map(item => item.replace(/\s*/g, "")));
  }, [value]);

  /* ---------光标可控制计算器显示区域----------- */

  //模糊搜索树状结构
  const queryCustCodeObscure = searchValue => {
    setTreeLoading(true);
    QueryCustCodeObscure(searchValue)
      .then(res => {
        setThisCalData(res.records);
      })
      .catch(err => message.error(err.note || err.message))
      .finally(() => setTreeLoading(false));
  };
  const renderTreeNodes = data => {
    let returnRes = data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            disabled={indexId && indexId == item.id}
            title={
              <span
                id={"menuItem" + item.id}
                className={item.status}
                onClick={() =>
                  indexId && indexId == item.id
                    ? console.log("禁止执行")
                    : culculationTreeSelect(item)
                }
              >
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
          disabled={indexId && indexId == item.id}
          title={
            <span
              id={"menuItem" + item.id}
              onClick={() =>
                indexId && indexId == item.id
                  ? console.log("禁止执行")
                  : culculationTreeSelect(item)
              }
            >
              {item.indexName}
              <Icon type="right" style={{ fontSize: "12px" }} />
            </span>
          }
          key={item.id}
          /* onClick={culculationTreeSelect(item)} */
        />
      );
    });
    return returnRes;
  };
  /********************************** 数据格式化 ********************************/

  return (
    <Fragment>
      <div
        className={styles.editDiv}
        id="edit2"
        placeholder="请输入"
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        contentEditable={"plaintext-only"}
        ref={divRef}
        onKeyDown={e => {
          if (e.keyCode !== 8) {
            divRef.current.blur();
            e.preventDefault();
          } else {
            setReturnView(true);
            setTimeout(() => {
              if (document.getElementById("edit2").innerHTML === "") {
                console.log("执行了清空的操作");
                setTestCalArr([]);
              }
            }, 100);
          }
        }}
      ></div>

      {/* <EditContent
        ref={editRef}
        defaultValue={defaultValue}
        editable={editable}
        onChange={onChange}
        showWarn={showWarn}
      /> */}
      <div className={styles["edit-container"]}>
        <Spin spinning={false}>
          <div className={styles["left-container"]}>
            <div style={{ padding: "9px 8px 0", lineHeight: "0" }}>
              <Input.Search
                placeholder="请输入"
                onSearch={val => {
                  val
                    ? queryCustCodeObscure({ indexName: val })
                    : setThisCalData(calData);
                }}
                allowClear={true}
              />
            </div>
            <Scrollbars autoHide className={styles["scroll-container"]}>
              {calData.length > 0 ? (
                <Tree
                  onExpand={val => {
                    setOpenKeys(val);
                  }}
                  labelInValue={true}
                  expandedKeys={openKeys}
                  //onSelect={culculationTreeSelect}
                  //selectedKeys={selectedKeys}
                >
                  {renderTreeNodes(thisCalData)}
                </Tree>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Scrollbars>
          </div>
        </Spin>
        <div className={styles["right-container"]}>
          <Row gutter={4}>
            {operatorData.map((item, index) => (
              <Col span={item.span}>
                <Button
                  key={`${index}`}
                  value={item.expsDescr}
                  className={styles["row-btn"]}
                  onClick={() => symbolButtonClick(item)}
                >
                  {item.expsNm}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      {/* {
        showWarn && <div style={{ position: 'absolute', bottom: '-31px', color: '#f5222d' }}>计算公式不能为空!</div>
      } */}
      {/*  {showWarn && (
        <div style={{ height: "2rem", lineHeight: "2rem", color: "#f5222d" }}>
          计算公式不能为空!
        </div>
      )} */}
    </Fragment>
  );
};

export default CalCulation;
