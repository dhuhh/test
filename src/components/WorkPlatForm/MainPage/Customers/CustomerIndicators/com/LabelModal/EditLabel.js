import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { Button, Form, Select, Input, Row, Col, TreeSelect, Radio } from "antd";
import { connect } from "dva";
import { get, omit } from "lodash";
import CalCulation from "../Calculation";
import TreeDepart from "../TreeDepart/index";
import styles from "./index.less";
/**
 * 员工指标tab 编辑指标弹窗
 */

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const EditLabel = (
  {
    returnView,
    setReturnView,
    customerLabel,
    setShow, //表单-计算公式校验
    indiObj = {}, //表单回显内容、根据新增/编辑传入不同的字段
    form, //经过包装之后的表单对象
    fetchMenuData = [], //涉及页面数据
    allSelect = [],
    setEditAllTree,
    type
  },
  ref
) => {
  const {
    source = "", //指标来源----
    exegesis = "", //口径说明-----
    level = "", //父级还是子集-----
    calFormula = [], //计算公式-----
    parentId, //指标位置-----
    indexName = "", //指标名称-----
    viewColumn = "", //涉及页面回显数据-----
    indexStatus = "", //指标状态,
    indexId='',
  } = indiObj; //计算公式树型数据接口入参

  const [testCalArr, setTestCalArr] = useState(calFormula); //计算公式数组，测试
  const [selectedKeys, setSelectedKeys] = useState([]); //控制menuItem选中状态
  const [openKeys, setOpenKeys] = useState([parentId]); //控制树打开状态(指标位置树)
  const [positionOfIndicatorId, setPositionOfIndicatorId] = useState(""); //指标位置ID(暂存)
  const [
    positionOfIndicatorFatherId,
    setPositionOfIndicatorFatherId
  ] = useState(""); //指标位置父ID(暂存)

  /********************************** 逻辑操作区域 ********************************/
  //计算公式改变
  const handleCalChange = (value = {}) => {
    const { setFieldsValue } = form;
    const empty = JSON.stringify(value) === "{}" || value.calcFormula === "";
    if (!empty && typeof setShow === "function") {
      setShow(false);
    }
    setFieldsValue({ calcObj: value });
  };
  //涉及页面改变
  const handlePageChange = (value, treeValue = []) => {
    console.log(value, treeValue, "value, treeValue");
    const { setFieldsValue } = form;
    setFieldsValue({
      pages: value
    });
    setEditAllTree(treeValue);
  };
  /********************************** 区域 ********************************/

  const { getFieldDecorator, getFieldsValue } = form;

  const formItemLayout = {
    colon: false,
    labelCol: { xs: { span: 4 } },
    wrapperCol: { xs: { span: 20 } }
  };
  const formItemLayout2 = {
    colon: false,
    labelCol: { xs: { span: 6 } },
    wrapperCol: { xs: { span: 18 } }
  };

  //决定节点是否可以选中(弃用)
  const treeNodesOk = item => {
    //判断自身的上架状态
    //如果下架就直接禁用
    if (item.status === "2") {
      return true;
    } else {
      return false;
      //否则判断是否有子节点
      /*  if (item.children && item.children.length) {
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
      } */
    }
  };
  //决定节点是否可以展开
  const treeNodesOpen = val => {
    if (!val.length) setOpenKeys([]);
    setOpenKeys(val);
    /* if (!val.length) setOpenKeys([]);
    const vall = [...val];
    //setOpenKeys(val)
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
        if (
          result.status === "1" &&
          !readUp(result?.children).every(item => item === "2")
        ) {
          setOpenKeys(val);
        }
      }
    } */
    //const vall=[...val]
    //findNode([...customerLabel],vall.pop()).up?setOpenKeys(val):''
  };
  //遍历对象找到所有孩子节点上架属性(弃用)
  function readUp(nodes = [], arr = []) {
    for (let item of nodes) {
      arr.push(item.status);
      if (item.children && item.children.length) {
        readUp(item.children, arr);
      }
    }
    return arr;
  }
  //根据id递归寻找parentId（已弃用）
  function recursivelyFindParentNode(id, arr = []) {
    for (let item of arr) {
      if (item.id === id) {
        setPositionOfIndicatorFatherId(item.parentId);
      } else {
        if (item.children && item.children.length > 0) {
          recursivelyFindParentNode(id, item.children);
        }
      }
    }
  }
  //指标位置树渲染函数
  const renderSelectTreeNodes = data => {
    let returnRes = data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            disabled={item.id===indexId}
            value={item.id}
            title={<span id={"menuItem" + item.id}>{item.indexName}</span>}
            key={item.id}
          >
            {renderSelectTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          disabled={item.id===indexId}
          //disabled={treeNodesOk(item)}
          value={item.id}
          title={<span id={"menuItem" + item.id}>{item.indexName}</span>}
          key={item.id}
        />
      );
    });
    return returnRes;
  };
  //在指标计算器中按下键盘删除之后的操作
  const removeTags = val => {
    if (returnView) {
      if (val.length < testCalArr.length) {
        if (val.length === 0) {
          setTestCalArr([]);
        }
        let copyArr = [...testCalArr];
        testCalArr.forEach((item, index) => {
          if (val.indexOf(item.nowTime) == -1) {
            //setTestCalArr([...testCalArr.splice(index,1)])
            copyArr.splice(index, 1);
          }
        });
        setTestCalArr(copyArr);
        const { setFieldsValue } = form;
        setFieldsValue({
          calFormula: copyArr
        });
      }
    }
  };
  return (
    <div>
      <Form {...formItemLayout} autocomplete="off" className={styles.myForm}>
        <Row>
          <Col span={24}>
            <Form.Item label="指标名称">
              {getFieldDecorator("indexName", {
                initialValue: indexName ? indexName : undefined,
                rules: [
                  { required: true, message: "请输入指标名称！" },
                  { max: 20, message: "指标名称长度不得超过20！" }
                ]
              })(
                <Input
                  placeholder="请输入"
                  maxLength={30}
                  style={{ width: "250px" }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <Form.Item label="指标位置" {...formItemLayout2}>
              {getFieldDecorator("parentId", {
                initialValue: parentId === "1" ? "客户指标" : parentId,
                rules: [{ required: true, message: "请选择指标位置！" }]
              })(
                <TreeSelect
                  autoExpandParent={true}
                  placeholder="请选择"
                  disabled={parentId === "1"}
                  onTreeExpand={treeNodesOpen}
                  treeExpandedKeys={openKeys}
                  dropdownStyle={{maxHeight:'500px'}}
                  style={{ width: "250px" }}
                  //dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  allowClear
                  onChange={value => {
                    setPositionOfIndicatorId(value); //首先将选择的id暂存起来
                  }}
                >
                  {renderSelectTreeNodes(customerLabel)}
                </TreeSelect>
              )}
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: "flex", alignItems: "center" }}>
            <Form.Item>
              {getFieldDecorator("level", {
                initialValue: level ? level : undefined,
                rules: [{ required: true, message: "请选择指标位置！" }]
              })(
                <Radio.Group
                  disabled={parentId === "1"}
                >
                  <Radio value={"1"} key={1}>
                    添加同级
                  </Radio>
                  <Radio value={"2"} key={2}>
                    添加子级
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item label="计算公式">
              {getFieldDecorator("calFormula", {
                initialValue: calFormula ? calFormula : undefined,
                rules: [{ required: true, message: "计算公式不能为空！" }]
              })(
                <CalCulation
                  indexId={indexId}
                  returnView={returnView}
                  setReturnView={setReturnView}
                  removeTags={removeTags}
                  testCalArr={testCalArr}
                  setTestCalArr={setTestCalArr}
                  selectedKeys={selectedKeys}
                  setSelectedKeys={setSelectedKeys}
                  calData={customerLabel}
                  symbolButtonClick={item => {
                    setReturnView(true);
                    const symbolData = [
                      ...testCalArr,
                      {
                        //orders:`${testCalArr.length}`,
                        isSymbol: "1",
                        contens: item.expsNm,
                        nowTime: `${Date.now()}`
                      }
                    ];
                    setTestCalArr(symbolData);
                    const { setFieldsValue } = form;
                    setFieldsValue({
                      calFormula: symbolData
                    });
                  }}
                  culculationTreeSelect={(val) => {
                    console.log(val,'val');
                    setReturnView(true);
                    const formulaData = [
                      ...testCalArr,
                      {
                        //orders:`${testCalArr.length}`,
                        isSymbol: "2",
                        contens: val.indexName,
                        indexId: val.id,
                        nowTime: `${Date.now()}`,
                        status: val.status
                      }
                    ];
                    setTestCalArr(formulaData);
                    const { setFieldsValue } = form;
                    setFieldsValue({
                      calFormula: formulaData
                    });
                  }}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="口径说明" /*  {...formItemLayout2} */>
              {getFieldDecorator("exegesis", {
                initialValue: exegesis ? exegesis : undefined,
                rules: [{ max: 1000, message: "口径说明长度不得超过1000！" }]
              })(<TextArea placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item label="指标来源" /* {...formItemLayout2} */>
              {getFieldDecorator("source", {
                initialValue: source ? source : undefined,
                rules: [{ max: 51, message: "指标来源长度不得超过50！" }]
              })(<TextArea placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24} className={styles.maomaozi}>
            <Form.Item label="涉及页面">
              {getFieldDecorator("viewColumn", {
                initialValue: viewColumn !== "" ? JSON.parse(viewColumn) : []
              })(
                <TreeDepart
                  style={{ width: "250px" }}
                  defaultValue={viewColumn}
                  treeData={fetchMenuData}
                  onChange={handlePageChange}
                  allSelect={allSelect}
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        {type === "1" && (
          <Row>
            <Col span={24}>
              <Form.Item label="指标状态" /* {...formItemLayout2} */>
                {getFieldDecorator("indexStatus", {
                  initialValue: indexStatus ? indexStatus : undefined,
                  rules: [{ required: true, message: "请选择指标状态！" }]
                })(
                  <Radio.Group>
                    <Radio value={"1"} key={1}>
                      上架
                    </Radio>
                    <Radio value={"2"} key={2}>
                      下架
                    </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};
//经过Form.create包装的组件会自带this.props.form属性
export default Form.create()(
  connect(({ global }) => ({
    dictionary: global.dictionary
  }))(EditLabel)
);
