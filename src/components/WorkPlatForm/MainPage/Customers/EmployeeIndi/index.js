import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, message, Spin } from "antd";
import { connect } from "dva";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import { FetchQueryCustIndi } from "@/services/labelInstr";
import styles from './index.less'
/**
 * 员工指标tab
 */

const EmployeeIndi = ({ indiName = "", dictionary, authorities }) => {
  const [visible, setVisible] = useState(false); //控制操作标签弹窗
  const [type, setType] = useState(""); // 1|新增 2|修改

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectId, setSelectId] = useState(""); //选中的id
  const [indiData, setIndiData] = useState([]); //考核指标数据 （左侧列表的数据源）

  const [nextId, setNextId] = useState(""); //下一个指标id(用于新增指标)

  const [params, setParams] = useState({
    indiName,
    indiType: "",
    paging: 1,
    current: 1,
    pageSize: 10,
    total: -1,
    sort: ""
  }); //考核指标入参
  //在这里对输入框传入的搜索值进行监听，当改变时，同步当前的状态
  useEffect(() => {
    setParams(params => {
      return { ...params, indiName };
    });
  }, [indiName]);
  //当搜索框输入的值被监听并同步状态时，进行员工指标数据的重新请求
  useEffect(() => {
    getIndiData();
  }, [JSON.stringify(params)]);

  /********************************** 接口获取数据 ********************************/

  //获取员工指标数据
  const getIndiData = (value = {}) => {
    setLoading(true);
    FetchQueryCustIndi({ ...params, ...value })
      .then(res => {
        const { code = 0, records = [], note = "", total, nextId = "" } =
          res || {};
        if (code > 0) {
          setTotal(total);
          setNextId(`EMP_INDI_${nextId}`);
          setIndiData(records);
          records.length > 0 && setSelectId(records[0].indiCode);
        }
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        message.error(!error.success ? error.message : error.note);
      });
  };
  /********************************** 逻辑操作 ********************************/
  //传递给左侧组件的方法，切换 指标类型/切换分页 的同时同步状态并请求数据
  const handleParamsChange = (value = {}) => {
    setParams(params => {
      return { ...params, ...value };
    });
  };

  const indiObj = indiData.find(item => item.indiCode === selectId) || {};
  const { LabelInstr = [] } = authorities;
  const isShow = LabelInstr.includes("indi_edit"); //控制员工视角
  const modalProps = { visible, type, setVisible, setType };
  return (
    <Fragment>
      <Spin spinning={loading} size="large">
        <Row className={styles.MyRowHeight}>
          {/* 页面的左部分和右部分，通过组件的方式拆解 */}
          <Col
            xs={6}
            sm={6}
            lg={6}
            xl={6}
            style={{ borderRight: "1px solid #EAECF2" ,height:'800px'}}
          >
            {/* 左侧 */}
            <LeftContent
              indiData={indiData}//左侧列表数据源
              params={{ ...params, total }}//将请求参数传递给组件，获取total显示一共多少条
              selectId={selectId}//用来确定是否是选中状态的id
              isShow={isShow}//用来控制权限，是否显示
              {...modalProps}
              onChange={handleParamsChange}//传递给左侧组件的方法，切换指标类型的同时同步状态并请求数据
              setSelectId={setSelectId}//在左侧列表点击的时候同步已选中的id
            />
          </Col>
          <Col
            xs={18}
            sm={18}
            lg={18}
            xl={18}
            className="h100"
            
          >
            {/* 右侧*/}
            <RightContent
              dictionary={dictionary}
              indiObj={indiObj}
              isShow={isShow}
              nextId={nextId}
              {...modalProps}
              getIndiData={getIndiData}
            />
          </Col>
        </Row>
      </Spin>
    </Fragment>
  );
};

export default connect(({ global }) => ({
  authorities: global.authorities,//获取用户功能权限点
  dictionary: global.dictionary,//字典信息
  userBasicInfo: global.userBasicInfo//用户基本信息
}))(EmployeeIndi);
