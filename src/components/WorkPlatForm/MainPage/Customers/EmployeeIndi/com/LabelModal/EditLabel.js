import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";
import { Button, Form, Select, Input, Row, Checkbox, Col, message } from "antd";
import { connect } from "dva";
import { get, omit } from "lodash";
import { FetchQueryCalcFormulaParam } from "@/services/labelInstr";
import CalCulation from "../Calculation";
import TreeDepart from "../TreeDepart";
import styles from "./index.less";
/**
 * 员工指标tab 编辑指标弹窗
 */

const { TextArea } = Input;
const { Option } = Select;

const EditLabel = (
  {
    showWarn, //表单-计算公式校验
    setShow, //表单-计算公式校验
    indiObj = {}, //表单回显内容、根据新增/编辑传入不同的字段
    form, //应该是经过包装之后的表单对象
    columnData = [], //明细展示列数据
    fetchMenuData = [], //涉及页面数据
    allSelect=[],
    dictionary = {}, //字典信息，
    setEditAllTree
  },
  ref
) => {
  const {
    indiName = "", //指标名称
    indiCode = "", //指标代码
    indiBore = "", //指标口径
    displayCol = "", //明细展示列
    calcStyle = "", //计算方式
    dataSrc = "", //数据来源
    calcFormula = "",//计算方式
    formulaRsol = "",//计算公式回显相关数据
    relaType = "",
    relaTypeId = "",//关系类型
    pages = ""//涉及页面
  } = indiObj;

  //接口入参
  const [calParams, setCalParams] = useState({
    calcStyle: calcStyle,
    keyWords: "",
    dataSrc: dataSrc ? dataSrc : "2"
  }); //计算公式树型数据接口入参
  const [loading, setLoading] = useState(false);

  //接口数据
  const [calData, setCalData] = useState([]);
  const [search, setSearch] = useState('');//展示列搜索值
  const [selectArr, setSelectArr] = useState(
    get(indiObj, "displayCol", "").split(",")
  ); //明细展示列选中

  /********************************** useEffect区域 ********************************/

  useEffect(() => {
    handleCalParamsChange({
      calcStyle: calcStyle,
      dataSrc: dataSrc ? dataSrc : "2"
    });
  }, [calcStyle, dataSrc]);

  useEffect(() => {
    if (
      (calParams.calcStyle === "1" && calParams.dataSrc) ||
      calParams.calcStyle === "3"
    ) {
      getCalData();
    } else {
      setCalData([]);
    }
  }, [JSON.stringify(calParams)]);

  /********************************** 接口获取数据区域 ********************************/
  //获取计算公式数据
  const getCalData = (params = {}) => {
    setLoading(true);
    const payload =
      calParams.calcStyle === "1" ? calParams : omit(calParams, "dataSrc");
    FetchQueryCalcFormulaParam({ ...payload, ...params })
      .then(res => {

        const { code = 0, records = [] } = res || {};
        if (code > 0) {
          setCalData(records);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        message.error(!error.success ? error.message : error.note);
      });
  };
  /********************************** render区域 ********************************/
  const maxTagPlaceholder = () => {
    return (
      <span style={{ color: "#FF6E30", background: "#fff", border: "none" }}>
        ...等{selectArr.length}项
      </span>
    );
  };
  /********************************** 逻辑操作区域 ********************************/
  //计算公式改变
  const handleCalChange = (value = {}) => {
    console.log(value,'handleCalChange');
    const { setFieldsValue } = form;
    const empty = JSON.stringify(value) === "{}" || value.calcFormula === "";
    if (!empty && typeof setShow === "function") {
      setShow(false);
    }
    setFieldsValue({ calcObj: value });
  };
  //涉及页面改变
  const handlePageChange = (value,treeValue=[]) => {
    const { setFieldsValue } = form;
    setFieldsValue({
      pages: value
    });
    setEditAllTree(treeValue)

  };

  const handleCalParamsChange = (value = {}) => {
    console.log(value,'handleCalParamsChange');
    setCalParams(params => {
      return { ...params, ...value };
    });
  };

  //计算方式变化回调
  const handleCalcChange = value => {
    const { setFieldsValue, getFieldValue } = form;
    //document.getElementById("edit").innerHTML = "";
    handleCalChange({});
    const dataSrc = getFieldValue("dataSrc");
    setTimeout(() => {
      document.getElementById('edit').innerHTML = '';
    }, 10);

    if (value === '4') {
      //document.getElementById('edit').innerHTML = 'SELECT EMP_NO, SUM(KHS_V1) VAL FROM TCUST_MON_DATA GROUP BY EMP_NO';
      setTimeout(() => {
        document.getElementById('edit').innerHTML = 'SELECT EMP_NO, SUM(KHS_V1) VAL FROM TCUST_MON_DATA GROUP BY EMP_NO';
      }, 10);

    }
    if (value === "1" && !dataSrc) {
      setFieldsValue({ dataSrc: "2" });
      handleCalParamsChange({ calcStyle: value, dataSrc: "2" });
    } else {
      handleCalParamsChange({ calcStyle: value });
    }
  };
  /********************************** 区域 ********************************/

  const { getFieldDecorator, getFieldValue } = form;

  const formItemLayout = {
    colon: false,
    labelCol: { xs: { span: 4 } },
    wrapperCol: { xs: { span: 20 } }
  };

  const calcMethod = dictionary["TINDI_DEF_CAL_MODE"] || []; //计算方式   1|显示数据来源  2, 4|不调用getCalData  3|正常传
  const dataSource = dictionary["TPRFM_DATA_SRC"] || []; //数据来源
  const relaTypeData = dictionary["RELA_TYPE"] || []; //关系类型
 
  return (
    <div className={styles["ax-form"]}>
      {/* <button onClick={()=>console.log('form', getFieldsValue())}>获取</button> */}
      <Form {...formItemLayout} autocomplete="off">
        <Form.Item label="指标名称">
          {getFieldDecorator("indiName", {
            initialValue: indiName ? indiName : undefined,
            rules: [{ required: true, message: "请输入指标名称！" }]
          })(
            <Input
              placeholder="请输入"
              maxLength={30}
              style={{ width: "250px" }}
            />
          )}
        </Form.Item>

        <Form.Item label="指标代码">
          {getFieldDecorator("indiCode", {
            initialValue: indiCode ? indiCode : undefined,
            rules: [{ required: true, message: "请输入指标代码！" }]
          })(
            <Input
              placeholder="请输入"
              maxLength={30}
              style={{ width: "250px" }}
            />
          )}
        </Form.Item>
        <Form.Item label="指标口径">
          {getFieldDecorator("indiBore", {
            initialValue: indiBore ? indiBore : undefined
          })(
            <TextArea
              placeholder="请输入"
              maxLength={200}
              style={{ resize: "vertical" }}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          )}
        </Form.Item>

        <Form.Item label="明细展示列" style={{ marginBottom: "0" }}>
          {getFieldDecorator("displayCol", {
            initialValue: displayCol ? displayCol.split(",") : undefined
          })(
            <Select
              className={styles.mySelect}
              mode="multiple"
              placeholder="请选择"
              showArrow={true}
              style={{ width: "250px" }}
              maxTagCount={1}
              maxTagTextLength={6}
              maxTagPlaceholder={() => maxTagPlaceholder()}
              onSearch={(value) => {console.log(value)}}
              optionFilterProp="children"
              filterOption={(input, option)=>{
                return option.props.children.indexOf(input)>=0
              }}
              //optionFilterProp='viewName'
              //onDropdownVisibleChange={(status)=> !status && setSearch('')}
              onChange={value => {
                console.log(value);
                setSelectArr(value);
              }}
              menuItemSelectedIcon={e => {
                return (
                  columnData.length > 0 && (
                    <Checkbox
                      checked={
                        selectArr.filter(key => {
                          return key === e.eventKey;
                        }).length > 0
                      }
                    ></Checkbox>
                  )
                );
              }}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              dropdownRender={menu => (
                <Row>
                  <div className="m-bss-select-checkbox">
                    <div className="m-bss-select-dropdown">{menu}</div>
                  </div>
                </Row>
              )}
            >
              {columnData.length > 0 &&
                columnData.map(item => (
                  <Select.Option
                    style={{ isplay: "flex", alignItems: "center" }}
                    key={item.id}
                    value={item.id}
                    title={item.viewName}
                  >
                    {item.viewName}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="涉及页面" style={{ marginBottom: "0" }}>
          {getFieldDecorator("pages", {
            initialValue:pages!==''?JSON.parse(pages):[]
          })(
            <TreeDepart
              style={{ width: "250px" }}
              defaultValue={pages}
              treeData={fetchMenuData}
              onChange={handlePageChange}
              allSelect={allSelect}
            />
          )}
        </Form.Item>

        <Form.Item label="计算方式">
          {getFieldDecorator("calcStyle", {
            initialValue: calcStyle ? calcStyle : undefined,
            rules: [{ required: true, message: "请选择计算方式！" }]
          })(
            <Select
              placeholder="请选择"
              style={{ width: "250px" }}
              onChange={handleCalcChange}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {calcMethod &&
                calcMethod.map(item => (
                  <Option key={item.ibm} value={item.ibm}>
                    {item.note}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          label="数据来源"
          style={{ display: calParams.calcStyle != "1" && "none" }}
        >
          {getFieldDecorator("dataSrc", {
            initialValue: calParams.dataSrc ? calParams.dataSrc : undefined,
            rules: [{ required: true, message: "请选择数据来源！" }]
          })(
            <Select
              placeholder="请选择"
              style={{ width: "250px" }}
              onChange={value => handleCalParamsChange({ dataSrc: value })}
              getPopupContainer={triggerNode => triggerNode.parentNode}
            >
              {dataSource &&
                dataSource.map(item => (
                  <Option key={item.ibm} value={item.ibm}>
                    {item.note}
                  </Option>
                ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="计算公式" style={{ position: "relative" }}>
          {getFieldDecorator("calcObj", {
            initialValue: calcFormula
              ? { calcFormula, calcDescr: formulaRsol }
              : undefined,
            rules: [{ required: true, message: "计算公式不能为空！" }]
          })(
            <CalCulation
              key={getFieldValue('calcStyle')}
              showWarn={showWarn}
              defaultValue={formulaRsol ? formulaRsol : undefined}
              calData={calData}
              loading={loading}
              onChange={handleCalChange}
              editable={getFieldValue('calcStyle') === '4'}
              handleCalParamsChange={handleCalParamsChange}
            />
          )}
        </Form.Item>
        <Form.Item label="关系类型">
          {getFieldDecorator("relaType", {
            initialValue: relaTypeId ? relaTypeId.split(",") : undefined
          })(
            <Checkbox.Group style={{ width: "100%", marginTop: "-8px" }}>
              <Row>
                {relaTypeData &&
                  relaTypeData.map(item => (
                    <Col span={8}>
                      <Checkbox key={item.ibm} value={item.ibm}>
                        {item.note}
                      </Checkbox>
                    </Col>
                  ))}
              </Row>
            </Checkbox.Group>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create()(
  connect(({ global }) => ({
    dictionary: global.dictionary
  }))(EditLabel)
);
