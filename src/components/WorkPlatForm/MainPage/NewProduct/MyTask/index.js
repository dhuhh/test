import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Select,
  Input,
  Radio,
  Icon,
  Upload,
  DatePicker,
  Pagination,
  Spin,
  Popover
} from "antd";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { history } from "umi";
import config from "../../../../../utils/config";
import { connect } from "dva";
import Iframe from "react-iframe";
import getIframeSrc from "$utils/getIframeSrc";
import DataList from "./DataList";
import {
  QueryUserTaskListInformation,
  AddTask,
  QueryBusinessDetails,
  QueryCueTaskDetails,
  QueryMarketMaterials
} from "$services/newProduct";
import NewWenjianImg from "$assets/newProduct/notice_icon_enclosure.png";
import styles from "./index.less";
import Scrollbars from "react-custom-scrollbars";
import moment from "moment";
import SuperSelect from "./SupperSelect";
import { getVersion } from "../../../../../utils/request";

const { api } = config;
const { TextArea, Search } = Input;
const {
  newProduct: { appRetrofitV1Upload }
} = api;
const sendMessageFileversion = getVersion(appRetrofitV1Upload);

// 因为走蚂蚁的组件，需要在这边设置请求头
function MyTask(props) {
  const [srcId, setSrcId] = useState("0"); // 状态
  const [loading, setLoading] = useState(false); // 列表加载loading
  const [activeList, setActiveList] = useState(""); // 列表激活key
  const [listData, setListData] = useState([]); // 列表数据
  const [pageSize, setPageSize] = useState(20); // 展示数据条数
  const [visible, setVisible] = useState(false); // 创建任务弹框
  const [createTaskVisible, setCreateTaskVisible] = useState(false); // 创建任务弹框(新lyq)
  const [createTaskBtnLoading, setCreateTaskBtnLoading] = useState(false); // 创建任务弹框保存按钮loading(新lyq)
  const [addMaterialVisible, setAddMaterialVisible] = useState(false); // 添加素材弹框(新lyq)
  const [JDSZModleVisible, setJDSZModleVisible] = useState(false); // 节点设置弹框(新lyq)
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0); // 数据总数
  const [fileList, setFileList] = useState({}); // 上传附件列表(lyq)
  const [fileListUploadButLoad, setFileListUploadButLoad] = useState(false); // 上传附件列表(lyq)
  const [changeSCKDataList, setChangeSCKDataList] = useState([]); // 当前选中的素材列表(lyq)
  const [changeJDDataList, setChangeJDDataList] = useState([1]); // 当前选中的节点目标(lyq)
  const [changeYXMBList, setChangeYXMBListt] = useState([]); // 营销目标列表
  const [SCKDataListCurrent, setSCKDataListCurrent] = useState(1); // 营销素材列表(current)
  const [SCKDataListPageSize, setSCKDataListPageSize] = useState(10); // 营销素材列表(pageSize)
  const [SCKDataList, setSCKDataList] = useState([]); // 营销素材列表(当前全量数据)
  const [SCKDataListPage, setSCKDataListPage] = useState([]); // 营销素材列表(当前全量数据的分页)
  const [SCKDataListPageTotal, setSCKDataListPageTotal] = useState(0); // 营销素材列表(当前全量数据的总数)
  const [SCKDataListLoading, setSCKDataListLoading] = useState(false); // 营销素材弹窗(loading)
  const [SuperSelectTrueOrFalse, setSuperSelectTrueOrFalse] = useState(true); // 营销目标虚拟滚动组件重载
  const RWLXList = props.dictionary["FWLB"] || []; //任务类型字典
  //表单数据(lyq)
  const [formData, setFormData] = useState({
    renWuLeiXing: undefined,
    ZYCD: "",
    BT: "",
    FWCL: "",
    FWCL2: "",
    FJ: [],
    SC: [],
    startDate: "",
    endDate: "",
    YXMB: undefined,
    YXMBS: [],
    JDSZ: 1,
    HDMB: undefined
  });
  //表单验证数组(lyq)
  const [formDataVerification, setFormDataVerification] = useState({
    //true为变红false为正常
    renWuLeiXing: true,
    ZYCD: true,
    BT: true,
    startDate: true,
    endDate: true,
    YXMBS: true,
    JDSZ: true,
    FWCL: true
  });

  //模拟节点设置列表数据
  const JDSZDataList = [
    {
      name: "默认节点",
      jieDian:
        formData.YXMB === 1
          ? ["未开通", "已开通"]
          : formData.YXMB === 2
          ? ["未销售", "已销售"]
          : formData.YXMB === 3
          ? ["未签约", "已签约"]
          : ["未签约", "已签约"],
      value: 1
    }
  ];
  useEffect(() => {
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    queryBackLogList().then(response => {
      const listData = response.records || [];
      setListData(listData);
      if (listData.length) {
        setActiveList("task0");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcId, current, pageSize]);

  const listener = e => {
    const { page, action } = e.data;
    if (page === "createTask") {
      if (action === "closeModal") {
        setVisible(false);
      }
    }
  };
  const compareDate = ({ date, type }) => {
    //若传入的date为空，则进行了清空操作，直接通过验证
    if (!date) {
      return true;
    }
    //根据type类型(true=>开始日期/false=>结束日期来定义开始如何比较)
    const endTime = type
      ? Date.parse(moment(formData.endDate).format("YYYY-MM-DD"))
      : Date.parse(moment(date).format("YYYY-MM-DD"));
    const startTime = type
      ? Date.parse(moment(date).format("YYYY-MM-DD"))
      : Date.parse(moment(formData.startDate).format("YYYY-MM-DD"));
    return endTime - startTime >= 0 ? true : false;
  };
  const dateOfJudgment = ({ date, type }) => {
    //判断另一个日期是否为空，如果为空则不做验证
    if (type ? formData.endDate : formData.startDate) {
      //进入验证函数
      return compareDate({ date, type });
    } else {
      return true;
    }
  };
  // 查询列表
  const queryBackLogList = useCallback(
    (payload = {}, flag = 0) => {
      if (!flag) setLoading(true);
      const {
        pagination = { current, pageSize, total: -1, paging: 1 }
      } = payload;
      const params = {
        srcId: Number(payload.srcId) || Number(srcId),
        ...pagination
      };
      return QueryUserTaskListInformation(params)
        .then(response => {
          if (!flag) setLoading(false);
          setTotal(response.total);
          return response;
        })
        .catch(error => {
          message.error(error.success ? error.note : error.message);
        });
    },
    [current, pageSize, srcId]
  );
  // useEffect(()=>{
  //   MyQueryBusinessDetails()
  // },[])
  const formSubmit = () => {
    setCreateTaskBtnLoading(true);
    //点击确认之后的表单回调验证函数(lyq)
    let result = {};
    //定义表单的三种状态，营销线索，营销活动，其他
    const stateXS = [
      "renWuLeiXing",
      "ZYCD",
      "BT",
      "startDate",
      "endDate",
      "YXMBS",
      "JDSZ",
      "FWCL"
    ];
    const stateOther = [
      "renWuLeiXing",
      "ZYCD",
      "BT",
      "startDate",
      "endDate",
      "FWCL"
    ];
    //let List=formData.renWuLeiXing ==='10'? stateXS :stateOther
    let List;
    if (formData.renWuLeiXing === "10") {
      List = stateXS;
    } else {
      List = stateOther;
    }
    //GPT代码
    // Object.keys(formData).forEach((key) => {
    //   const value = formData[key];
    //   const isNotEmptyArray = Array.isArray(value) && value.length > 0;
    //   const isValidBT = key === 'BT' && value.length <= 50;
    //   const isValidFWCL = key === 'FWCL' && value.length <= 500;
    //   result[key] = value || isNotEmptyArray || isValidBT || isValidFWCL;
    // });
    //循环必填的表单验证数组来验证对应的表单数据字段是否为空
    List.forEach(key => {
      if (!formData[key]) {
        //未通过验证，修改验证数组
        result[key] = false;
      } else {
        //增加对空数组的判断
        if (formData[key] instanceof Array && formData[key].length === 0) {
          result[key] = false;
        } else if (key === "BT" && formData[key].length > 50) {
          result[key] = false;
        } else if (key === "FWCL" && formData[key].length > 500) {
          result[key] = false;
        } else {
          result[key] = true;
        }
      }
    });
    //在这之后去判断表单验证数组FormDataVerification中的字段是否全部为true
    if (Object.keys(result).filter(res => result[res] === false).length === 0) {
      handleFormData();
      AddTask(handleFormData())
        .then(res => {
          setCreateTaskBtnLoading(false);
          if (
            window.location.host.includes("axzq") ||
            window.location.host.includes("localhost")
          ) {
            window.open(
              `https://crm.axzq.com.cn:8081/bss/ncrm/work/customerService/page/addCustomer.sdo?rwid=${res.note}`,
              "_blank"
            );
            //window.location.href = `https://crm.axzq.com.cn:8081/bss/ncrm/work/customerService/page/addCustomer.sdo?rwid=${res.note}`;
          } else {
            window.open(
              `https://crm.essence.com.cn:8081/bss/ncrm/work/customerService/page/addCustomer.sdo?rwid=${res.note}`,
              "_blank"
            );
            //window.location.href = `https://crm.essence.com.cn:8081/bss/ncrm/work/customerService/page/addCustomer.sdo?rwid=${res.note}`;
          }
          setCreateTaskVisible(false);
          formDataAfterClose(2);
        })
        .catch(error => {
          setCreateTaskBtnLoading(false);
          message.error(error.success ? error.note : error.message);
        });
    } else {
      setCreateTaskBtnLoading(false);
    }
    setFormDataVerification(result);
  };

  //处理表单数据并提交的方法
  const handleFormData = () => {
    //创建result空对象
    let result = {};
    //获取formData备份
    const thisFormData = { ...formData };
    result.taskType = Number(thisFormData.renWuLeiXing);
    result.importanceDegree = thisFormData.ZYCD;
    result.theme = thisFormData.BT;
    result.content = thisFormData.FWCL;
    result.strategy = thisFormData.FWCL2;
    if (Object.keys(fileList).length > 0) {
      result.attachment = fileList.name;
      result.md5 = fileList.md5;
    }
    result.startTime = Number(thisFormData.startDate.replace(/-/g, ""));
    result.endTime = Number(thisFormData.endDate.replace(/-/g, ""));
    result.activityIndex = thisFormData.HDMB;
    result.marketingMaterial = thisFormData.SC.map(
      item => item.artId
    ).toString();
    result.marketingObjective = thisFormData.YXMB;
    result.marketingContent = thisFormData.YXMBS.toString();
    result.nodeType = thisFormData.JDSZ;
    result.founder = props.authUserInfo.id;
    //result.founder = 0;
    return result;
  };

  const FormDataCallback = formObj => {
    //表单数据填写之后的回调(接收一个对象，{name:'',data:'',isMust:true/false})(lyq)
    let result = { ...formData };
    result[formObj.name] = formObj.data;
    setFormData(result);
    if (formObj.isMust) {
      if (formObj.num) {
        if (formObj.data.length <= formObj.num) {
          let resultVerification = { ...formDataVerification };
          resultVerification[formObj.name] = true;
          setFormDataVerification(resultVerification);
        } else {
          let resultVerification = { ...formDataVerification };
          resultVerification[formObj.name] = false;
          setFormDataVerification(resultVerification);
        }
      } else {
        let resultVerification = { ...formDataVerification };
        resultVerification[formObj.name] = true;
        setFormDataVerification(resultVerification);
      }
    }
  };
  const formDataAfterClose = e => {
    //关闭表单之后的回调(清空当前选择的所有数据,并重置验证状态)
    if (e === 2) {
      setFormData({
        renWuLeiXing: undefined,
        ZYCD: "",
        BT: "",
        FWCL: "",
        FWCL2: "",
        FJ: [],
        SC: [],
        startDate: "",
        endDate: "",
        YXMB: undefined,
        YXMBS: [],
        JDSZ: 1,
        HDMB: undefined
      });
      setChangeSCKDataList([]);
      setChangeYXMBListt([]);
      setFileList([]);
    }
    setFormDataVerification({
      renWuLeiXing: true,
      ZYCD: true,
      BT: true,
      startDate: true,
      endDate: true,
      YXMBS: true,
      JDSZ: true,
      FWCL: true
    });
  };

  const addMaterialItemRadioOnChange = val => {
    //选择素材点击之后的回调
    //判断当前changeSCKDataList中有没有
    if (changeSCKDataList.filter(item => item.artId === val.artId).length > 0) {
      //如果存在,就过滤掉当前项
      const res = changeSCKDataList.filter(item => item.artId !== val.artId);
      setChangeSCKDataList(res);
    } else {
      //否则就将当前项加入数组
      setChangeSCKDataList(data => [...data, val]);
    }
  };

  const deleteSCKDataList = id => {
    //点击删除素材之后的回调
    //同时过滤掉暂暂存列表和form列表中的删除项
    setChangeSCKDataList(
      changeSCKDataList.filter(item => item.artId !== id.artId)
    );
    let result = { ...formData };
    result.SC = changeSCKDataList.filter(item => item.artId !== id.artId);
    setFormData(result);
  };
  const addJDItemRadioOnChange = val => {
    //点击节点选择选择radio的回调
    const res = [];
    res.push(val);
    //判断当前changeSCKDataList中有没有
    setChangeJDDataList(res);
  };
  // 营销目标的loading
  const [YXMBSloading, setYXMBSloading] = useState(false);

  //这里添加一个监听，判断营销目标类别的更改、
  useEffect(() => {
    if (formData.YXMB) {
      setSuperSelectTrueOrFalse(false);
      //setSuperSelectTrueOrFalse(true)
      const result = { ...formData };
      result.YXMBS = [];
      setFormData(result);
      setYXMBSloading(true);
      QueryBusinessDetails({ type: formData.YXMB })
        .then(res => {
          setChangeYXMBListt(res.data);
          setYXMBSloading(false);
          setSuperSelectTrueOrFalse(true);
        })
        .catch(error => {
          message.error(error.success ? error.note : error.message);
        });
    }
  }, [formData.YXMB]);

  const maxTagPlaceholder = value => {
    //下拉选择多选
    const num = 1 + value.length;
    return <span>...等{num}项</span>;
  };
  //文件上传方法=>onChange
  const MyhandleChange = info => {
    const { file } = info;
    const { status = "", percent = 0, response = {} } = file || {};
    if (status !== "uploading") {
      if (status === "error") {
        const { message: fileMessage = "", code = -1, note = "" } = response;
        message.error(fileMessage || note || "文件上传错误");
      } else if (status === "done") {
        setFileList(response.data);
      }
    }
    // //解构上传状态
    // const {file, fileList} = info;
    // const {status = '', percent = 0, response = {}} = file || {};
    // //对当前的上传状态进行判断
    // if (status !== 'uploading') {
    //   //如果当前的状态不是‘正在上传’
    //   if (parseInt(percent, 10) === 100 || status === 'error') {
    //     //进入此则该次上传操作失败
    //     const {message: fileMessage = '', code = -1, note = ''} = response;
    //     if (code < 0) {
    //       const {uid = ''} = file;
    //       if (uid) {
    //         const tempIndex = fileList.findIndex(item => item.uid === uid);
    //         if (tempIndex >= 0) {
    //           fileList.splice(tempIndex, 1);
    //         }
    //       }
    //       message.error(fileMessage || note || '文件上传错误');
    //     }
    //   }
    // } else {
    //   // 校验大小
    //   const size = 32;
    //   const isLt32M = file.size / 1024 / 1024 < size;
    //   if (!isLt32M) {
    //     const {uid = ''} = file;
    //     if (uid) {
    //       const tempIndex1 = fileList.findIndex(
    //         (item) => { return item.uid === uid; });
    //       if (tempIndex1 >= 0) {
    //         fileList.splice(tempIndex1, 1);
    //       }
    //     }
    //     message.error(`附件大小不能超过${size}MB!`);
    //   }
    // }
    // if (Array.isArray(fileList)) {
    //   setFileList(fileList.slice(-1));
    // }
    // return true;
  };

  //上传组件参数
  const uploadProps = {
    action: appRetrofitV1Upload,
    onChange: MyhandleChange,
    //beforeUpload:beforeUpload,
    headers: {
      apiVersion: sendMessageFileversion
    }
    //multiple: true
  };

  //删除已经上传的任务附件列表
  const deleteFile = data => {
    setFileList({});
  };

  //点击添加素材按钮回调
  const clickAddMaterial = () => {
    setSCKDataListLoading(true);
    //根据任务类型id调用素材列表接口
    setAddMaterialVisible(true);
    QueryMarketMaterials({ columnId: 12 })
      .then(res => {
        setSCKDataList(res.records);
        //以下是前端手动分页代码
        setSCKDataListPageTotal(res.total);
        if (res.records.length > 0) {
          const fengeResult2 = res.records.slice(
            (SCKDataListCurrent - 1) * SCKDataListPageSize,
            (SCKDataListCurrent - 1) * SCKDataListPageSize + SCKDataListPageSize
          );
          setSCKDataListPage(fengeResult2);
          setSCKDataListLoading(false);
        }
      })
      .catch(error => {
        setSCKDataListLoading(false);
        message.error(error.success ? error.note : error.message);
      })
      .finally(() => setSCKDataListLoading(false));
  };
  //素材列表模态框中搜索框的回调
  const addMaterialSearch = value => {
    //拿到所有素材数据
    const allDataList = [...SCKDataList];
    //拿到过滤后的数组
    let result = allDataList.filter(item => item.artTitle.includes(value));
    //获取分割之后的数据
    const fengeResult = result.slice(
      0,
      (SCKDataListCurrent - 1) * SCKDataListPageSize + SCKDataListPageSize
    );
    //赋值
    setSCKDataListPage(fengeResult);
    if (value) {
      setSCKDataListPageTotal(result.length);
    } else {
      setSCKDataListPageTotal(SCKDataList.length);
    }
  };

  //在点击切换分页参数时候的回调
  const onShowSizeChange = (current, pageSize) => {
    if (SCKDataList.length > 0) {
      setSCKDataListPage(
        SCKDataList.slice(
          (current - 1) * pageSize,
          (current - 1) * pageSize + pageSize
        )
      );
    }
  };
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Row
        type="flex"
        align="middle"
        style={{ padding: "12px 21px 0", marginBottom: 13 }}
        id="header"
      >
        {/* <Col style={{ paddingRight: 26 }}>
          <Button
            className="m-btn-radius ax-btn-small m-btn-blue"
            style={{ width: 118, height: 32 }}
            onClick={() => setVisible(true)}
          >
            创建任务
          </Button>
        </Col> */}
        <Col style={{ paddingRight: 26 }}>
          <Button
            className="m-btn-radius ax-btn-small m-btn-blue"
            style={{ width: 118, height: 32 }}
            onClick={() => {
              setCreateTaskVisible(true);
              //MyQueryBusinessDetails()
            }}
          >
            创建任务
          </Button>
        </Col>
        <Col style={{ display: "flex", alignItems: "center" }}>
          <div style={{ paddingRight: 8 }}>状态</div>
          <div>
            <Select
              className={styles.select}
              value={srcId}
              onChange={value => {
                setSrcId(value);
                setCurrent(1);
              }}
              style={{ width: 160, color: "#1A2243" }}
            >
              <Select.Option key="0" value="0">
                全部
              </Select.Option>
              <Select.Option key="1" value="1">
                未下发
              </Select.Option>
              <Select.Option key="2" value="2">
                待完成
              </Select.Option>
              <Select.Option key="3" value="3">
                已完成
              </Select.Option>
              <Select.Option key="4" value="4">
                已过期
              </Select.Option>
            </Select>
          </div>
        </Col>
      </Row>
      <DataList
        loading={loading}
        setLoading={setLoading}
        activeList={activeList}
        setActiveList={setActiveList}
        listData={listData}
        setListData={setListData}
        pageSize={pageSize}
        setPageSize={setPageSize}
        queryBackLogList={queryBackLogList}
        current={current}
        setCurrent={setCurrent}
        total={total}
        srcId={srcId}
        setSrcId={setSrcId}
      />
      <Modal
        className={styles.modal}
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
        centered
        width={800}
      >
        <Scrollbars
          autoHide
          style={{
            height:
              document.body.clientHeight < 760
                ? document.body.clientHeight - 60
                : 700
          }}
        >
          <Iframe
            className={styles.iframe}
            src={getIframeSrc(
              props.tokenAESEncode,
              `${props?.sysParam.find(i => i.csmc === "system.c4ym.url")?.csz ||
                ""}/bss/ncrm/work/customerService/page/customerServiceDialog.sdo?rwlx=401`,
              props?.sysParam.find(i => i.csmc === "system.c4ym.url")?.csz || ""
            )}
            width="100%"
            height="700px"
          />
        </Scrollbars>
      </Modal>
      {/*创建任务弹窗*/}
      <Modal
        destroyOnClose={true}
        maskClosable={false}
        className={styles.CJRWModal}
        //destroyOnClose={true}
        title={<div className={styles.myFountsize1}>创建任务</div>}
        visible={createTaskVisible}
        onCancel={() => {
          setCreateTaskVisible(false);
          formDataAfterClose(2);
        }}
        width={650}
        footer={[
          <Button
            className={styles.myFountsize2}
            key="back"
            onClick={() => {
              setCreateTaskVisible(false);
              formDataAfterClose(2);
            }}
          >
            取消
          </Button>,
          <Button
            style={{ background: "#244FFF", borderRadius: "2px" }}
            key="submit"
            type="primary"
            loading={createTaskBtnLoading}
            onClick={formSubmit}
          >
            保存并前往添加客户
          </Button>
        ]}
      >
        {/* -----------------任务类型----------------- */}
        <div className={styles.createTaskFormItem}>
          <div className={styles.createTaskFormItemSpan}>
            <span style={{ float: "right" }}>
              <span className={styles.must}>*</span>
              <span className={styles.myFountsize2}>任务类型</span>
            </span>
          </div>
          <div
            className={
              formDataVerification.renWuLeiXing ? "" : styles.aleartBorder
            }
          >
            <Select
              placeholder={"请选择"}
              style={{ width: 250 }}
              value={formData.renWuLeiXing}
              onChange={val => {
                FormDataCallback({
                  name: "renWuLeiXing",
                  data: val,
                  isMust: true
                });
              }}
            >
              {RWLXList.map(res => {
                return (
                  <Select.Option value={res.ibm}>{res.note}</Select.Option>
                );
              })}
              {/*<Select.Option value={"2"}>Lucy</Select.Option>*/}
            </Select>
          </div>
        </div>
        {formDataVerification.renWuLeiXing ? null : (
          <div className={styles.verification}>请选择任务类型！</div>
        )}
        {/* -----------------重要程度----------------- */}
        <div className={styles.createTaskFormItem}>
          <div
            className={styles.createTaskFormItemSpan}
            style={{ paddingTop: 0 }}
          >
            <span style={{ float: "right" }}>
              <span className={styles.must}>*</span>
              <span className={styles.myFountsize2}>重要程度</span>
            </span>
          </div>
          <div
            className={
              formDataVerification.ZYCD
                ? "styles.nomalBorder"
                : styles.aleartBorder
            }
          >
            <Radio.Group
              onChange={val => {
                FormDataCallback({
                  name: "ZYCD",
                  data: val.target.value,
                  isMust: true
                });
                /* let result={...formData}
                result.ZYCD=val.target.value
                setFormData(result)*/
              }}
              value={formData.ZYCD}
            >
              <Radio value={1}>
                <Icon type="star" theme="filled" className={styles.iconStart} />
              </Radio>
              <Radio value={2}>
                <Icon type="star" theme="filled" className={styles.iconStart} />
                <Icon type="star" theme="filled" className={styles.iconStart} />
              </Radio>
              <Radio value={3}>
                <Icon type="star" theme="filled" className={styles.iconStart} />
                <Icon type="star" theme="filled" className={styles.iconStart} />
                <Icon type="star" theme="filled" className={styles.iconStart} />
              </Radio>
            </Radio.Group>
          </div>
        </div>
        {formDataVerification.ZYCD ? null : (
          <div className={styles.verification}>请选择重要程度！</div>
        )}
        {/* -----------------标题----------------- */}
        <div className={styles.createTaskFormItem}>
          <div className={styles.createTaskFormItemSpan}>
            <span style={{ float: "right" }}>
              <span className={styles.must}>*</span>
              <span className={styles.myFountsize2}>标题</span>
            </span>
          </div>
          <div className={formDataVerification.BT ? "" : styles.aleartBorder}>
            <Input
              placeholder={"请输入"}
              style={{ width: 250 }}
              value={formData.BT}
              onChange={val => {
                FormDataCallback({
                  name: "BT",
                  data: val.target.value,
                  isMust: true,
                  num: 50
                });
                /* let result={...formData}
                result.BT=val.target.value
                setFormData(result)*/
              }}
            />
          </div>
        </div>
        {formDataVerification.BT ? null : (
          <div className={styles.verification}>
            {formData.BT.length > 50 ? "标题最多为50字！" : "请输入标题！"}
          </div>
        )}
        {/* -----------------任务内容----------------- */}
        <div className={styles.createTaskFormItem}>
          <div className={styles.createTaskFormItemSpan}>
            <span style={{ float: "right" }}>
              <span className={styles.must}>*</span>
              {/*<span className={styles.must}>*</span>*/}
              <span className={styles.myFountsize2}>任务内容</span>
            </span>
          </div>
          <div className={formDataVerification.FWCL ? "" : styles.aleartBorder}>
            <TextArea
              placeholder={"请输入"}
              rows={4}
              style={{ width: 400 }}
              value={formData.FWCL}
              onChange={val => {
                FormDataCallback({
                  name: "FWCL",
                  data: val.target.value,
                  isMust: true,
                  num: 500
                });
              }}
            />
          </div>
        </div>
        {formDataVerification.FWCL ? null : (
          <div className={styles.verification}>
            {formData.FWCL.length > 500
              ? "任务内容最多为500字！"
              : "请输入任务内容！"}
          </div>
        )}
        {/* -----------------任务附件----------------- */}
        <div className={styles.createTaskFormItem}>
          <div className={styles.createTaskFormItemSpan}>
            <span style={{ float: "right" }}>
              {/*<span className={styles.must}>*</span>*/}
              <span className={styles.myFountsize2}>上传任务附件</span>
            </span>
          </div>
          <div>
            <Upload
              {...uploadProps}
              //fileList={fileList}
              showUploadList={false}
              disabled={Object.keys(fileList).length > 0}
              //openFileDialogOnClick={false}
            >
              <Button
                disabled={Object.keys(fileList).length > 0}
                loading={fileListUploadButLoad}
                className={styles.uploadButton}
              >
                <Icon type="upload" />
                <span className={styles.myFountsize2}>点击上传附件</span>
              </Button>
            </Upload>
            {Object.keys(fileList).length > 0 && (
              <div className={styles.fileListItem}>
                <img src={NewWenjianImg} style={{ width: 16, height: 16 }} />
                <div className={styles.fileListItemText}>
                  {fileList.name}
                  &nbsp; ({fileList.human})
                </div>
                <div className={styles.fileListItemBut}>
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file, fileList) => {
                    }}
                    action={appRetrofitV1Upload}
                    onChange={info => MyhandleChange(info)}
                    //{...uploadProps}
                    //fileList={fileList}
                    //showUploadList={false}
                    //disabled={fileList.length>0}
                    //openFileDialogOnClick={false}
                  >
                    <div className={styles.reUpload} style={{ width: 67 }}>
                      <span className={styles.myFountsize2}>重新上传</span>
                    </div>
                  </Upload>
                  <span style={{ color: "#EAECF2" }}>|</span>
                  <Button
                    type="link"
                    className={styles.del}
                    onClick={() => {
                      deleteFile();
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {formData.renWuLeiXing === "10" && (
          <div className={styles.createTaskFormItem}>
            <div className={styles.createTaskFormItemSpan}>
              <span style={{ float: "right" }}>
                <span className={styles.myFountsize2}>添加素材</span>
              </span>
            </div>
            <div>
              {/*<Upload {...uploadProps} fileList={fileList} showUploadList={false}>*/}
              <div
                className={styles.uploadButton}
                style={{ width: "100px" }}
                onClick={() => clickAddMaterial()}
              >
                <Icon type="link" />
                添加素材
              </div>
              {/*</Upload>*/}
              <div
                className={styles.TJSCScroll}
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  overflowX: "hidden"
                }}
              >
                {formData.SC.map(item => {
                  return (
                    <div className={styles.fileListItem} key={item.artId}>
                      <div className={styles.fileListItemText}>
                        {
                          SCKDataList.filter(res => res.artId === item.artId)[0]
                            .artTitle
                        }
                        &nbsp; (
                        {SCKDataList.filter(
                          res => res.artId === item.artId
                        )[0].releaseTm.slice(0, 10)}
                        )
                      </div>
                      <div className={styles.fileListItemBut}>
                        <Button
                          style={{ marginBottom: 18 }}
                          type="link"
                          className={styles.del}
                          onClick={() => {
                            deleteSCKDataList(item);
                          }}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* -----------------执行开始日期----------------- */}
        <div className={styles.createTaskFormItem}>
          <div className={styles.createTaskFormItemSpan}>
            <span style={{ float: "right" }}>
              <span className={styles.must}>*</span>
              <span className={styles.myFountsize2}>执行开始日期</span>
            </span>
          </div>
          <div
            className={
              formDataVerification.startDate ? "" : styles.aleartBorder
            }
          >
            <DatePicker
              value={
                formData.startDate ? moment(formData.startDate) : undefined
              }
              style={{ width: 250 }}
              onChange={val => {
                if (
                  dateOfJudgment({
                    date: val,
                    type: true
                  })
                ) {
                  const createDate = val
                    ? moment(val).format("YYYY-MM-DD")
                    : "";
                  FormDataCallback({
                    name: "startDate",
                    data: createDate,
                    isMust: true
                  });
                } else {
                  message.warning("结束日期不得小于开始日期！");
                }
              }}
            />
          </div>
        </div>
        {formDataVerification.startDate ? null : (
          <div className={styles.verification}>请选择执行开始日期！</div>
        )}

        <div className={styles.createTaskFormItem}>
          <div className={styles.createTaskFormItemSpan}>
            <span style={{ float: "right" }}>
              <span className={styles.must}>*</span>
              <span className={styles.myFountsize2}>执行结束日期</span>
            </span>
          </div>
          <div
            className={formDataVerification.endDate ? "" : styles.aleartBorder}
          >
            <DatePicker
              value={formData.endDate ? moment(formData.endDate) : undefined}
              style={{ width: 250 }}
              onChange={val => {
                if (
                  dateOfJudgment({
                    date: val,
                    type: false
                  })
                ) {
                  const createDate = val
                    ? moment(val).format("YYYY-MM-DD")
                    : "";
                  FormDataCallback({
                    name: "endDate",
                    data: createDate,
                    isMust: true
                  });
                } else {
                  message.warning("结束日期不得小于开始日期！");
                }
              }}
            />
          </div>
        </div>
        {formDataVerification.endDate ? null : (
          <div className={styles.verification}>请选择执行结束日期！</div>
        )}
        {/* -----------------营销目标----------------- */}
        {formData.renWuLeiXing === "10" && (
          <div className={styles.createTaskFormItem}>
            <div className={styles.createTaskFormItemSpan}>
              <span style={{ float: "right" }}>
                <span className={styles.must}>*</span>
                <span className={styles.myFountsize2}>营销目标</span>
              </span>
            </div>
            <div
              style={{ display: "flex" }}
              className={formDataVerification.YXMBS ? "" : styles.aleartBorder}
            >
              <div style={{ marginRight: "8px" }}>
                <Select
                  placeholder={"请选择"}
                  value={formData.YXMB}
                  style={{ width: 150 }}
                  onChange={val => {
                    FormDataCallback({
                      name: "YXMB",
                      data: val,
                      isMust: false
                    });
                  }}
                >
                  <Option value={1}>业务开通</Option>
                  <Option value={2}>理财产品销售</Option>
                  <Option value={3}>投顾产品签约</Option>
                </Select>
              </div>
              <div>
                {SuperSelectTrueOrFalse ? (
                  <SuperSelect
                    //suffixIcon={<img src={modal2?Up:Down}/>}
                    YXMB={formData.YXMB}
                    dropdownClassName="hasMultiple"
                    optionFilterProp="showName"
                    mode="multiple"
                    showSearch
                    placeholder="请选择"
                    maxTagCount={1}
                    maxTagTextLength={3}
                    maxTagPlaceholder={value => maxTagPlaceholder(value)}
                    allowClear
                    disabled={!changeYXMBList.length || YXMBSloading}
                    loading={YXMBSloading}
                    value={formData.YXMBS}
                    style={{ width: "250px" }}
                    filterOption={(v, item) => {
                      if (item.props.title.includes(v)) {
                        return true;
                      } else {
                        return false;
                      }
                    }}
                    onChange={e => {
                      //在这里根据营销目标的不同进行三种情况的判断
                      const result = { ...formData };
                      result.YXMBS = e;
                      setFormData(result);
                      let resultVerification = { ...formDataVerification };
                      resultVerification["YXMBS"] = true;
                      setFormDataVerification(resultVerification);
                    }}
                  >
                    {changeYXMBList.map(m => (
                      <Select.Option
                        key={m.businessId}
                        title={m.businessName}
                        value={m.businessId}
                      >
                        {m.businessName}
                      </Select.Option>
                    ))}
                  </SuperSelect>
                ) : (
                  <Input
                    style={{ width: "250px" }}
                    disabled={true}
                    placeholder={YXMBSloading ? "加载中..." : "请选择"}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {formData.renWuLeiXing !==
        "10" ? null : formDataVerification.YXMBS ? null : (
          <div className={styles.verification}>请选择营销目标！</div>
        )}
        {formData.renWuLeiXing === "10" && (
          <div className={styles.createTaskFormItem}>
            <div className={styles.createTaskFormItemSpan}>
              <span style={{ float: "right" }}>
                <span className={styles.must}>*</span>
                <span className={styles.myFountsize2}>节点设置</span>
              </span>
            </div>
            <div
              className={formDataVerification.JDSZ ? "" : styles.aleartBorder}
            >
              <div
                onClick={() => {
                  setJDSZModleVisible(true);
                }}
              >
                <Select
                  value={formData.JDSZ === 1 ? "默认节点" : ""}
                  open={false}
                  placeholder="请选择"
                  style={{ width: 250 }}
                >
                  {/*  <Select.Option value={"1"}>Jack</Select.Option>
              <Select.Option value={"2"}>Lucy</Select.Option> */}
                </Select>
              </div>
            </div>
          </div>
        )}

        {formData.renWuLeiXing !==
        "10" ? null : formDataVerification.JDSZ ? null : (
          <div className={styles.verification}>请选择节点 ！</div>
        )}
        {formData.renWuLeiXing === "4" && (
          <div className={styles.createTaskFormItem}>
            <div className={styles.createTaskFormItemSpan}>
              <span style={{ float: "right" }}>活动目标</span>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ marginRight: "8px" }}>
                <Select
                  placeholder={"请选择"}
                  value={formData.HDMB}
                  style={{ width: 250 }}
                  onChange={val => {
                    FormDataCallback({
                      name: "HDMB",
                      data: val,
                      isMust: false
                    });
                  }}
                >
                  <Option value={1}>资产净流入</Option>
                  <Option value={2}>净资产</Option>
                  <Option value={3}>总资产</Option>
                </Select>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {/* -----------------添加素材弹窗----------------- */}
      <Modal
        maskClosable={false}
        className={styles.addMaterialM}
        title="添加素材"
        visible={addMaterialVisible}
        onCancel={() => {
          setAddMaterialVisible(false);
          setSCKDataListCurrent(1);
          setSCKDataListPageSize(10);
        }}
        width={600}
        footer={[
          <Button
            style={{ borderRadius: "2px" }}
            key="back"
            onClick={() => {
              setAddMaterialVisible(false);
            }}
          >
            取消
          </Button>,
          <Button
            style={{ background: "#244FFF", borderRadius: "2px" }}
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              //点击确定之后将changeSCKDataList中的数据维护到formData.SC中去
              const res = [...changeSCKDataList];
              const formRes = { ...formData };
              formRes.SC = res;
              setFormData(formRes);
              setAddMaterialVisible(false);
            }}
          >
            确定
          </Button>
        ]}
      >
        <Spin spinning={SCKDataListLoading}>
          <div className={styles.addMaterialModal}>
            <div>
              <Search
                allowClear={true}
                placeholder="请输入"
                onSearch={value => {
                  addMaterialSearch(value);
                }}
                style={{ width: "99%", marginLeft: 0, borderRadius: "2px" }}
              />
            </div>

            <div
              className={styles.TJSCScroll}
              style={{ height: 525, overflowY: "auto" }}
            >
              {SCKDataListPage &&
                SCKDataListPage.map(item => {
                  return (
                    <div
                      className={styles.addMaterialItem}
                      key={item.artId}
                      onClick={val => addMaterialItemRadioOnChange(item)}
                    >
                      <div className={styles.addMaterialItemLeft}>
                        <div className={styles.addMaterialItemLeft}>
                          <Radio
                            //checked={changeSCKDataList.indexOf(item.artId) !== -1}
                            checked={
                              changeSCKDataList.filter(
                                items => items.artId === item.artId
                              ).length > 0
                            }
                            value={item.artId}
                          />
                          {item.artTitle.length > 26 ? (
                            <Popover
                              overlayClassName={styles.indexDetail}
                              arrowPointAtCenter={true}
                              title={null}
                              //placement="bottomLeft"
                              trigger="hover"
                              content={
                                <div
                                  style={{
                                    background: "#474D64",
                                    color: "#FFFFFF",
                                    padding: 5,
                                    width: 292,
                                    boxSizing: "border-box",
                                    borderRadius: 2
                                  }}
                                >
                                  {item.artTitle}
                                </div>
                              }
                            >
                              {item.artTitle}
                            </Popover>
                          ) : (
                            item.artTitle
                          )}
                        </div>
                      </div>
                      <div className={styles.addMaterialItemRight}>
                        更新时间：{item.releaseTm.slice(0, 10)}
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className={styles.addMaterialPagination}>
              <Pagination
                size="small"
                showSizeChanger
                showQuickJumper
                current={SCKDataListCurrent}
                total={SCKDataListPageTotal}
                onChange={pageNumber => {
                  setSCKDataListCurrent(pageNumber);
                  onShowSizeChange(pageNumber, SCKDataListPageSize);
                }}
                onShowSizeChange={(current, pageSize) => {
                  setSCKDataListCurrent(current);
                  setSCKDataListPageSize(pageSize);
                  onShowSizeChange(current, pageSize);
                }}
              />
            </div>
          </div>
        </Spin>
      </Modal>

      {/* -----------------节点设置弹窗----------------- */}
      <Modal
        maskClosable={false}
        title="节点设置"
        visible={JDSZModleVisible}
        onCancel={() => {
          setJDSZModleVisible(false);
        }}
        width={550}
        footer={[
          <Button
            style={{ borderRadius: "2px" }}
            key="back"
            onClick={() => {
              setJDSZModleVisible(false);
            }}
          >
            取消
          </Button>,
          <Button
            style={{ background: "#244FFF", borderRadius: "2px" }}
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              //点击确定之后将changeSCKDataList中的数据维护到formData.SC中去
              const res = changeJDDataList[0];
              const formRes = { ...formData };
              formRes.JDSZ = res;
              setFormData(formRes);
              if (formRes.JDSZ) {
                let resultVerification = { ...formDataVerification };
                resultVerification["JDSZ"] = true;
                setFormDataVerification(resultVerification);
              }
              setJDSZModleVisible(false);
            }}
          >
            确定
          </Button>
        ]}
      >
        <div style={{ maxHeight: 600, overflowY: "auto", overflowX: "hidden" }}>
          {JDSZDataList.map(item => {
            return (
              <div className={styles.JDSZItem}>
                <div className={styles.JDSZItemTop}>
                  <Radio
                    checked={changeJDDataList.indexOf(item.value) !== -1}
                    value={item.value}
                    onClick={val => {
                      addJDItemRadioOnChange(item.value);
                    }}
                  />
                  <span>{item.name}</span>
                </div>
                <div className={styles.JDSZItemBot}>
                  <div className={styles.JDSZItemBot_}>
                    {item.jieDian.map((items, indexs) => {
                      return (
                        <div
                          className={styles.JDSZItemBot_O}
                          style={{
                            left:
                              indexs === 0
                                ? "-5px"
                                : `${(395 / (item.jieDian.length - 1)) *
                                    indexs}px`
                          }}
                        >
                          <span className={styles.JDSZItemBot_O_text}>
                            {items}
                          </span>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              background: "#FFF",
                              borderRadius: "50%"
                            }}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
export default connect(({ global }) => ({
  authorities: global.authorities,
  dictionary: global.dictionary,
  sysParam: global.sysParam,
  userBusinessRole: global.userBusinessRole,
  tokenAESEncode: global.tokenAESEncode,
  theme: global.theme,
  authUserInfo: global.authUserInfo
}))(MyTask);
