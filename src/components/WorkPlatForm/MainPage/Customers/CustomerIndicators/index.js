import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, message, Spin, Modal, Button } from "antd";
import { connect } from "dva";
import getCustomerLabelData from "./test";
import LeftContent from "./LeftContent";
import RightContent from "./RightContent";
import { FetchQueryCustIndi } from "@/services/labelInstr";
import {
  AddCustIndex, //新增客户指标
  DeleteCustCode, //删除客户指标
  UpdateCustIndexDetails, //编辑客户指标(用于下架)
  QueryCustCodeObscure, //客户指标模糊查询
  QueryCustMetricsTree, //查询客户指标树
  QueryCustIndiDetails, //查询客户指标详情
  GetUpdateStatus, //指标校验
  UpdateIndexUpAndDown //指标上下架
} from "$services/newProduct";
const { confirm } = Modal;
const EmployeeIndi = ({
  authorities, //权限控制字典
  KHZBchoic,
  customerIndicatorsChoseId, //当前选中的id
  customerIndicatorsChosePId,
  setCustomerIndicatorsChoseId, //控制左侧id的选中状态
  searchOrClick,
  setSearchOrClick,
  gouzi,
  treeOpen,
  setTreeOpen
}) => {
  const [loading, setLoading] = useState(false); //整体的加载中状态
  const [customerLabel, setCustomerLabel] = useState([]); //客户指标标签数据 （左侧列表的数据源）
  const [customerLabelFinish, setCustomerLabelFinish] = useState(false);
  const [visible, setVisible] = useState(false); //控制操作标签弹窗
  const [currentIndicators, setCurrentIndicators] = useState(""); //当前指标id   currentIndicators   setCurrentIndicators
  const [detailsOfIndicators, setDetailsOfIndicators] = useState({}); //客户指标详情
  const [labelType, setLabelType] = useState("0"); //标签类型（上下架、全部）
  const [type, setType] = useState(""); // 1|新增 2|修改
  const [openKeys, setOpenKeys] = useState([]); //控制树打开状态
  const [selectedKeys, setSelectedKeys] = useState([]); //控制menuItem选中状态
  const customerTags = authorities.customerTags || [];

  /********************************** useEffect区域 ********************************/
  //页面开始的获取树状数据
  useEffect(() => {
    getCustomerLabel({ status: 0 });
  }, []);
  //监听树状数据的变化，如果有变化那么就取第一条数据进行请求
  useEffect(() => {
    if(customerIndicatorsChoseId){
      setCustomerIndicatorsChoseId(customerIndicatorsChoseId);
      if (searchOrClick) {
        setOpenKeys([customerIndicatorsChosePId]);
      }
      setSelectedKeys([customerIndicatorsChoseId]);
      queryCustIndiDetails({ indexId: customerIndicatorsChoseId });
      
    }else{
      if (customerLabel.length > 0) {
        //选中第一项
        if (labelType === "1") {
          for (let i = 0; i <= customerLabel.length; i++) {
            //如果当前项微上架状态
            if (customerLabel[i]?.status === "1") {
              //就直接选中当前项
              if (gouzi) {
                setCustomerIndicatorsChoseId(customerLabel[i].id);
                if (searchOrClick) {
                  setOpenKeys([customerIndicatorsChosePId]);
                  setSelectedKeys([customerIndicatorsChoseId]);
                  queryCustIndiDetails({ indexId: customerIndicatorsChoseId });
                }
              }
              break;
            }
          }
        } else if (labelType === "0") {
          for (let i = 0; i <= customerLabel.length; i++) {
              if (gouzi) {
                setCustomerIndicatorsChoseId(customerLabel[i].id);
                if (searchOrClick) {
                  setOpenKeys([customerIndicatorsChosePId]);
                  setSelectedKeys([customerIndicatorsChoseId]);
                  queryCustIndiDetails({ indexId: customerIndicatorsChoseId });
                }
              }
              break;
          }
        }else{
            for (let i = 0; i <= customerLabel.length; i++) {
            if (customerLabel[i]?.status === "2") {
              //就直接选中当前项
              if (gouzi) {
                setCustomerIndicatorsChoseId(customerLabel[i].id);
                if (searchOrClick) {
                  setOpenKeys([customerIndicatorsChosePId]);
                  setSelectedKeys([customerIndicatorsChoseId]);
                  queryCustIndiDetails({ indexId: customerIndicatorsChoseId });
                }
              }
              //跳出循环
              break;
            }
          }
        }
      }
    }
  }, [customerLabel]);

  useEffect(()=>{
    console.log(customerLabel);

  },[customerLabel])

  //监听当前指标id的变化，发起对指标详情的请求
  useEffect(() => {
    if (customerIndicatorsChoseId) {
      if (searchOrClick) {
        setOpenKeys([customerIndicatorsChosePId]);
      }
      setSelectedKeys([customerIndicatorsChoseId]);
      queryCustIndiDetails({ indexId: customerIndicatorsChoseId });
    }
  }, [customerIndicatorsChoseId]);
  //监听上下架的变化，对上下架的树状数据进行请求
  useEffect(() => {
    if (labelType) {
      //console.log(labelType, "准备请求数据了");
      getCustomerLabel({ status: 0 });
    }
  }, [labelType]);

  /********************************** 接口获取数据 ********************************/
  //获取客户指标树状数据
  const getCustomerLabel = queryData => {
    setCustomerLabelFinish(false);
    setLoading(true);
    QueryCustMetricsTree(queryData)
      .then(res => {
        setCustomerLabel([]);
        const { records = [] } = res;
        setCustomerLabel(records);
        setCustomerLabelFinish(true);
        if (searchOrClick) {
          //console.log('开始执行树状数据获取完成之后的操作',customerIndicatorsChoseId,customerIndicatorsChosePId);
          setOpenKeys([customerIndicatorsChosePId]);
          setSelectedKeys([customerIndicatorsChoseId]);
        }
      })
      .catch(err => message.error(err.note || err.message))
      .finally(() => setLoading(false));
  };

  //查询客户指标详情
  const queryCustIndiDetails = queryData => {
    setLoading(true);
    QueryCustIndiDetails(queryData)
      .then(res => {
        setDetailsOfIndicators(res.records[0]);
        //console.log(res);
      })
      .catch(err => message.error(err.note || err.message))
      .finally(() => setLoading(false));
  };

  //删除、下架客户指标
  const deleteCustomerIndicator = type => {
    //删除之前需要先请求验证接口来决定本次操作是否可以进行
    if (type === "删除") {
      GetUpdateStatus({ indexId: customerIndicatorsChoseId }).then(res => {
        if (res.isallow === "0") {
          confirm({
            icon: "exclamation-circle",
            closable: true,
            title: `是否确定${type}?`,
            content: `${type === "删除" ? "删除后不可找回，请谨慎操作！" : ""}`,
            onOk() {
              DeleteCustCode({ indexId: customerIndicatorsChoseId }).then(
                res => {
                  message.success(res.note);
                  getCustomerLabel({ status: 0 });
                  setCustomerIndicatorsChoseId('')
                }
              );
            }
          });
        } else {
          Modal.warning({
            title: `无法${type}`,
            content: `此指标或下属子节点有关联的父级指标，禁止${type}，请在父级指标的计算公式中剔除此指标后再进行${type}操作`,
            okText: "确定"
          });
        }
      });
    } else {
      confirm({
        icon: "exclamation-circle",
        closable: true,
        title: `是否确定${type}?`,
        content: `${type === "删除" ? "删除后不可找回，请谨慎操作！" : ""}`,
        onOk() {
          UpdateIndexUpAndDown({
            indexId: customerIndicatorsChoseId,
            status: type === "下架" ? "2" : "1"
          }).then(res => {
            message.success(res.note);
            getCustomerLabel({ status: 0 });
          });
        }
      });
    }
  };

  const modalProps = { visible, type, setVisible, setType };
  return (
    <Fragment>
      <Spin spinning={loading} size="large">
        <Row>
          {/* 页面的左部分和右部分，通过组件的方式拆解 */}
          <Col
            xs={6}
            sm={6}
            lg={6}
            xl={6}
            className="h100"
            style={{ borderRight: "1px solid #EAECF2" }}
          >
            {/* 左侧 */}
            <LeftContent
              {...modalProps}
              openKeys={openKeys}
              customerTags={customerTags} //权限控制
              setOpenKeys={setOpenKeys}
              selectedKeys={selectedKeys}
              setSelectedKeys={setSelectedKeys}
              labelType={labelType}
              setLabelType={setLabelType}
              setCustomerIndicatorsChoseId={setCustomerIndicatorsChoseId}
              customerIndicatorsChosePId={customerIndicatorsChosePId}
              customerLabel={customerLabel}
              KHZBchoic={KHZBchoic}
              setSearchOrClick={setSearchOrClick}
              treeOpen={treeOpen}
              setTreeOpen={setTreeOpen}
            />
          </Col>
          <Col
            xs={18}
            sm={18}
            lg={18}
            xl={18}
            className="h100"
            //style={{ borderLeft: "1px solid #EAECF2" }}
          >
            <RightContent
              customerTags={customerTags} //权限控制
              labelType={labelType}
              getCustomerLabel={getCustomerLabel}
              queryCustIndiDetails={queryCustIndiDetails}
              customerIndicatorsChoseId={customerIndicatorsChoseId}
              customerLabel={customerLabel}
              setCustomerLabel={setCustomerLabel}
              {...modalProps}
              detailsOfIndicators={detailsOfIndicators}
              deleteCustomerIndicator={deleteCustomerIndicator}
            />
            {/* 右侧*/}
          </Col>
        </Row>
      </Spin>
    </Fragment>
  );
};

export default connect(({ global }) => ({
  authorities: global.authorities, //获取用户功能权限点
  dictionary: global.dictionary, //字典信息
  userBasicInfo: global.userBasicInfo //用户基本信息
}))(EmployeeIndi);
