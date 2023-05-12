import React, { Component } from "react";
import {
  GetChannelInfoModel,
  OptionalStaffList,
  GetGroupInfoModel,
  GroupManagement,
  QueryStaffPracticeInfo,
  GetBankCodeList,
  QueryChannelAuthorityDepartment,
  QueryUserRoleInfo,
  BankGroupInfo,
} from "$services/newProduct";
import { fetchUserAuthorityDepartment } from "$services/commonbase/userAuthorityDepartment";
import { connect } from "dva";
import {
  Button,
  Icon,
  Form,
  Input,
  Row,
  Col,
  Select,
  TreeSelect,
  message,
  Modal,
  Checkbox,
  Pagination,
  Spin,
  Tooltip,
} from "antd";
import { history as router } from "umi";
import lodash, { initial, map } from "lodash";
import SelectCheckbox from "../Common/SelectCheckbox";
import TreeUtils from "$utils/treeUtils";
import styles from "./addGroup.less";
const { Option } = Select;

class addGroup extends Component {
  state = {
    administratorData: [],
    searchValue: "",
    departments: [],
    department: "", // 营业部
    departmentValue: "",
    allYyb: [],
    authDeptLst: [],
    channel: [],
    codeType: "",
    visible: false,
    checkedList: [],
    current: 1,
    total: 0,
    loading: false,
    searchMemberValue: "",
    bankData: [],
    inputValue: "",
    listData: [],
    auth: false,
  };
  componentDidMount() {
    this.getBankCodeList();
    // this.queryStaffPracticeInfo();
    GetChannelInfoModel()
      .then(res => {
        this.setState({
          channel: res.records,
        });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
    // this.getDepartments();
    QueryUserRoleInfo().then(res => {
      this.setState({
        auth: res.records[0].rolelist.find(
          item =>
            item.roleCode === "QDFZR" ||
            item.roleCode === "QDZXFZR" ||
            item.roleCode === "ZBQDZXFZR" ||
            item.roleCode === "ZBQDFZR" ||
            item.roleCode === "YYBGLY"
        )
          ? true
          : false,
      });
    });
  }
  componentDidUpdate(preProps) {
    /* if (preProps.location.add !== this.props.location.add) {
      this.setState({
        checkedList: [],
      }, () => {
        this.checkSelectStatus();
      });
    } */
    let tag = document.getElementsByClassName("ant-select-selection__choice");
    // console.log(tag);
    for (let i = 0; i < tag.length; i++) {
      // console.log(tag[i].title)
      if (i < 3) {
        tag[i].title =
          tag[i].title.split("/").length > 1
            ? `${tag[i].title.split("/")[1]}(${tag[i].title.split("/")[2]})`
            : tag[i].title;
        tag[i].childNodes[0].innerHTML =
          tag[i].title.split("/").length > 1
            ? `${tag[i].title.split("/")[1]}(${tag[i].title.split("/")[2]})`
            : tag[i].title;
      }
    }
  }
  checkChannel = () => {
    const { getFieldValue } = this.props.form;
    if (getFieldValue("codeType") === "2") {
      if (!getFieldValue("channel")) {
        this.setState({
          allYyb: [],
        });
        message.info("请先选择渠道");
      } else {
        //传入对应渠道获取接口数据
        // this.getDepartments();
        return true;
      }
    } else {
      //获取接口数据
      this.getDepartments();
      return true;
    }
  };

  getBankCodeList = () => {
    GetBankCodeList().then(res => {
      this.setState({
        bankData: res.records,
      });
    });
  };
  queryStaffPracticeInfo = loading => {
    const { getFieldValue } = this.props.form;
    if (loading !== "noLoading") {
      this.setState({
        loading: true,
      });
    }
    QueryStaffPracticeInfo({
      channelId: getFieldValue("channel") ? getFieldValue("channel") * 1 : "",
      keyword: this.state.searchMemberValue,
      paging: 1,
      sort: "",
      total: -1,
      pageSize: 20,
      grpTp: getFieldValue("codeType") === "3" ? 3 : undefined,
      current: this.state.current,
    })
      .then(res => {
        this.setState({
          administratorData: res.records,
          total: res.total,
          loading: false,
        });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  handlePagerChange = current => {
    this.setState(
      {
        current,
      },
      () => {
        this.queryStaffPracticeInfo();
      }
    );
  };
  searchAdmin = value => {
    this.setState(
      {
        searchMemberValue: value,
        current: 1,
      },
      () => {
        lodash.debounce(this.queryStaffPracticeInfo, 300)();
      }
    );
  };
  handleOnFocus = () => {
    const { getFieldValue } = this.props.form;
    if (getFieldValue("codeType") === "2" && !getFieldValue("channel")) {
      message.info("请先选择渠道");
      this.setState({
        administratorData: [],
        total: 0,
        loading: false,
      });
    } else {
      this.setState(
        {
          searchMemberValue: "",
          current: 1,
        },
        () => {
          lodash.debounce(this.queryStaffPracticeInfo, 300)();
        }
      );
    }
  };
  checkSelectStatus = () => {
    const { administratorData, listData } = this.state;
    if (listData.length !== 0 && listData.length === administratorData.length) {
      this.setState({
        checkAll: true,
      });
    } else {
      this.setState({
        checkAll: false,
      });
    }
    if (listData.length !== 0 && listData.length !== administratorData.length) {
      this.setState({
        indeterminate: true,
      });
    } else {
      this.setState({
        indeterminate: false,
      });
    }
  };
  remove = index => {
    let arr = this.state.checkedList.filter((item, id) => id !== index);
    this.setState(
      {
        checkedList: arr,
        listData: arr,
      },
      () => {
        this.checkSelectStatus();
        this.props.form.setFieldsValue({ btn: this.state.checkedList });
      }
    );
  };
  showModal = () => {
    this.setState(
      {
        visible: true,
        listData: this.state.checkedList,
      },
      () => {
        this.checkSelectStatus();
      }
    );
  };
  handleOk = e => {
    this.setState(
      {
        visible: false,
        checkedList: this.state.listData,
      },
      () => {
        this.props.form.setFieldsValue({ btn: this.state.checkedList });
      }
    );
  };

  handleCancel = e => {
    this.setState({
      visible: false,
      listData: [],
      checkAll: false,
      indeterminate: false,
    });
  };
  addMember = (rule, value, callback) => {
    if (this.state.checkedList.length === 0) {
      callback("请添加小组成员");
    } else {
      callback();
    }
  };
  /* checkName = () => {
    setTimeout(() => {
      this.props.form.validateFields(['codeName']);
    }, 0);

  } */
  isOnlyNameTip = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (
      value &&
      value !== "" &&
      getFieldValue("codeType") &&
      getFieldValue("codeType") !== ""
    ) {
      GetGroupInfoModel({
        grpCode: value,
        grpTp: getFieldValue("codeType"),
      }).then(res => {
        if (res.total !== 0) {
          callback("已存在相同的二维码名称");
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };
  nameMaxLength = (rule, value, callback) => {
    if (
      value &&
      value !== "" &&
      this.props.form.getFieldValue("codeType") !== "1"
    ) {
      if (value.length > 10) return callback("不能超过10位汉字");
      callback();
    } else {
      callback();
    }
  };
  maxValidate = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== "") {
      let groupKey = this.state.checkedList.map(
        (item, index) => `Member${item.split("/")[0]}`
      );
      let total = 0;
      groupKey.forEach((item, index) => {
        if (getFieldValue(item)) {
          total += getFieldValue(item) * 1;
        }
      });
      if (total > 100) {
        callback("总比例不能大于100");
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  checkMax = () => {
    let groupKey = this.state.checkedList.map(
      (item, index) => `Member${item.split("/")[0]}`
    );
    setTimeout(() => {
      this.props.form.validateFields(groupKey);
    }, 0);
  };

  handleSubmit = e => {
    e.preventDefault();
    let grpMbrLst = this.state.checkedList.map((item, index) => {
      return {
        userid: item.split("/")[0],
        username: item.split("/")[1],
        userno: item.split("/")[2],
        ration: this.props.form.getFieldValue(`Member${item.split("/")[0]}`),
      };
    });

    this.props.form.validateFields((err, value) => {
      if (!err) {
        GroupManagement({
          acctDept: value.department * 1,
          applSc: value.scene,
          busTp: value.busType * 1,
          chnlId: value.codeType === "3" ? 81 : value.channel * 1, // 选中营业部合作小组  默认传 81
          depBank: value.bank * 1,
          grpMbrLst: value.codeType !== "1" ? grpMbrLst : [],
          grpNm: value.codeName,
          grpTp: value.codeType * 1,
          oprTp: 1,
          isBank: value.isBank === '' ? "" : value.isBank * 1,
        })
          .then(res => {
            // message.info(res.note);
            if (res.statusCode === 200) {
              message.info("操作成功");
              this.props.form.resetFields();
              this.setState({
                checkedList: [],
              });
              this.props.form.resetFields();
              router.push({
                pathname: "/merge/account/personal",
                state: Date.now().toString(36),
              });
            }
          })
          .catch(error => {
            message.error(!error.success ? error.message : error.note);
          });
      } else {
        return;
      }
    });
  };

  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  };
  // 获取管辖营业部的数据
  getDepartments = () => {
    let param =
      this.props.form.getFieldValue("codeType") === "2"
        ? { channelId: this.props.form.getFieldValue("channel") * 1 }
        : "";
    QueryChannelAuthorityDepartment(param)
      .then(result => {
        const { records = [] } = result;
        const datas = TreeUtils.toTreeData(
          records,
          {
            keyName: "yybid",
            pKeyName: "fid",
            titleName: "yybmc",
            normalizeTitleName: "title",
            normalizeKeyName: "value",
          },
          true
        );
        let departments = [];
        datas.forEach(item => {
          const { children } = item;
          departments.push(...children);
        });
        this.setState({ departments, allYyb: records });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  // 格式化treeSelectValue
  formatValue = department => {
    const { allYyb = [] } = this.state;
    department = department ? department.split(",") : [];
    return department.map(val => ({
      value: val,
      label: allYyb.find(item => item.yybid === val).yybmc,
    }));
  };

  // 搜索营业部变化
  handleYybSearch = value => {
    this.setState({
      searchValue: value,
    });
  };
  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.state;
    const util = (fid, title) => {
      if (fid === "0") return false;
      for (let item of allYyb) {
        if (item.yybid === fid) {
          if (item.yybmc.indexOf(inputValue) > -1) {
            return true;
          } else {
            util(item.fid);
          }
          break;
        }
      }
    };
    if (treeNode.props.title.indexOf(inputValue) > -1) {
      return true;
    } else {
      return util(treeNode.props.fid, treeNode.props.title);
    }
  };
  maxTagPlaceholder = value => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };
  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let authDeptLst = [];
    authDeptLst = value.map(item => ({ id: item.value, name: item.label }));
    this.setState({
      authDeptLst,
    });
    let { department } = this.state;
    if (value.length) {
      department = department ? department.split(",") : [];
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (department.indexOf(item) === -1) department.push(item);
        });
      } else {
        array.forEach(item => {
          if (department.indexOf(item) > -1)
            department.splice(department.indexOf(item), 1);
        });
      }
    } else {
      department = [];
    }
    setTimeout(() => {
      this.props.form.setFieldsValue({
        department: this.formatValue(department.join(",")),
      });
    }, 0);
    this.setState({
      department: department.join(","),
      searchValue: this.state.searchValue,
    });
  };
  onChange = checkedList => {
    this.setState(
      {
        inputValue: "",
        listData: checkedList,
      },
      () => {
        this.checkSelectStatus();
      }
    );
  };
  onCheckAllChange = e => {
    let { administratorData } = this.state;
    const key = [];
    if (this.state.inputValue)
      administratorData = administratorData.filter(
        item => item.ryxm.indexOf(this.state.inputValue) > -1
      );
    administratorData.map(item => {
      // key.push(`${item.ryid}/${item.ryxm}/${item.rybh}`);
      if (item.zyzg !== "0") {
        key.push(`${item.ryid}/${item.ryxm}/${item.rybh}`);
      }
    });
    this.onChange(e.target.checked ? key : []);
  };
  setBusType = () => {
    this.props.form.setFieldsValue({ busType: "1" });
  };
  setIsBankType = e => {
    if (e === "1") {
      this.getBankGroupInfo();
    }else{
      this.props.form.setFieldsValue({ codeName: "" });
    }
  };
  getBankGroupInfo = () => {
    BankGroupInfo().then(res => {
      const { records } = res;
      this.props.form.setFieldsValue({ codeName: records[0].name });
    });
  };

  render() {
    const {
      channel,
      codeType,
      checkedList,
      checkAll,
      indeterminate,
      administratorData,
      current,
      total,
      loading,
      bankData,
      listData,
      auth,
      departments,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const businessType = this.props.dictionary["CHNL_YW"] || [];
    // const bankData = this.props.dictionary['CHNL_CGYH'] || [];
    let groupTypeInfo = this.props.dictionary["CHNL_EWMLX"] || [];
    groupTypeInfo = auth
      ? groupTypeInfo
      : groupTypeInfo.filter(item => item.note !== "渠道小组");
    const codeTips =
      getFieldValue("codeType") !== "1" ? (
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "35px",
            color: "#959CBA",
          }}
        >
          {" "}
          {getFieldValue("codeName") ? getFieldValue("codeName").length : 0} /
          10中文
        </div>
      ) : (
        ""
      );
    const busType = () => {
      if (getFieldValue("codeType") === "1") {
        return businessType;
      } else if (
        getFieldValue("codeType") === "2" ||
        getFieldValue("codeType") === "3"
      ) {
        return businessType.slice(0, 1);
      } else {
        return [];
      }
    };

    const tip = "个人和营业部合作小组开户会自动加挂开发关系";

    const bankTypeInfo = [
      { note: "是", ibm: "1" },
      { note: "否", ibm: "2" },
    ];

    const showTitle = text => {
      return (
        <span>
          <span>二维码类型</span>
          <Tooltip title={text}>
            <Icon
              style={{ marginLeft: 3, color: "rgb(178 181 191)" }}
              type="question-circle"
            />
          </Tooltip>
        </span>
      );
    };

    const PaginationProps = {
      pageSize: 20,
      hideOnSinglePage: true,
      showQuickJumper: true,
      current: current,
      onChange: this.handlePagerChange,
      total: total,
    };
    return (
      <div className={styles.addTable}>
        <Modal
          maskClosable={false}
          title="添加小组成员"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.mulSelects}
          destroyOnClose={true}
        >
          <Form.Item label="小组成员" style={{ display: "flex" }} colon={false}>
            <div
              onMouseDown={e => {
                e.preventDefault();
                return false;
              }}
            >
              <Select
                placeholder="请选择小组成员"
                onSearch={this.searchAdmin}
                showArrow={listData.length === 0}
                allowClear={true}
                mode="multiple"
                defaultActiveFirstOption={false}
                filterOption={(input, option) => {
                  return option.props.children.indexOf(input) !== -1;
                }}
                maxTagCount={3}
                maxTagPlaceholder={value => this.maxTagPlaceholder(value)}
                maxTagTextLength={7}
                menuItemSelectedIcon={e => {
                  return (
                    administratorData.length > 0 &&
                    e.value !== "NOT_FOUND" && (
                      <Checkbox
                        disabled={e.disabled}
                        checked={
                          listData.filter(key => {
                            return key === e.value;
                          }).length > 0
                        }
                      ></Checkbox>
                    )
                  );
                }}
                onChange={e => this.onChange(e)}
                value={listData}
                onFocus={this.handleOnFocus}
                dropdownRender={menu => (
                  <div className="m-bss-select-checkbox">
                    {administratorData.length > 0 && (
                      <div className="m-bss-select-dropdown-title" id="test1">
                        <Checkbox
                          indeterminate={indeterminate}
                          onChange={e => this.onCheckAllChange(e)}
                          checked={checkAll}
                        >
                          全选
                        </Checkbox>
                      </div>
                    )}
                    <Spin spinning={loading}>
                      <div className="m-bss-select-dropdown">{menu}</div>
                    </Spin>
                    <div
                      style={{
                        marginTop: "3px",
                        marginBottom: "3px",
                        textAlign: "right",
                      }}
                    >
                      <Pagination {...PaginationProps} simple />
                    </div>
                  </div>
                )}
                // open
              >
                {administratorData.map(item => (
                  <Option
                    key={`${item.ryid}/${item.ryxm}`}
                    value={`${item.ryid}/${item.ryxm}/${item.rybh}`}
                    disabled={item.zyzg === "0"}
                  >
                    {`${item.ryxm}(${item.rybh})${
                      item.zyzg === "0" ? "(无一般证券从业)" : ""
                    }`}
                  </Option>
                ))}
              </Select>
            </div>
          </Form.Item>
        </Modal>
        <div className={styles.title}>
          <Button
            type="primary"
            onClick={() => {
              router.push("/merge/account/personal");
              this.props.form.resetFields();
            }}
          >
            <Icon type="arrow-left" />
            返回上层
          </Button>
          <span className={styles.titleText}>新增二维码</span>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow} style={{ position: "relative" }}>
            {getFieldValue("codeType") === "2" ? (
              <div
                style={{
                  position: "absolute",
                  top: "-15px",
                  paddingLeft: "90px",
                }}
              >
                建议小组名称含有渠道名称
              </div>
            ) : (
              ""
            )}
            <Form onSubmit={this.handleSubmit}>
              <Row type="flex" style={{ flexDirection: "row" }}>
                <Row
                  type="flex"
                  style={{ alignItems: "flex-end", marginRight: "36px" }}
                >
                  <Form.Item
                    label="二维码名称"
                    style={{ display: "flex" }}
                    colon={false}
                    extra={ getFieldValue("isBank") === "1" ? '' : codeTips}
                  >
                    {getFieldDecorator("codeName", {
                      rules: [
                        { required: true, message: "请输入二维码名称" },
                        { validator: this.isOnlyNameTip },
                        { validator: getFieldValue("isBank") === "1" ? '' : this.nameMaxLength },
                      ],
                    })(
                      <Input
                        placeholder="请输入二维码名称"
                        autoComplete="off"
                        maxLength={getFieldValue("codeType") !== "1" ? 10 : 100}
                        disabled={
                          getFieldValue("isBank") === "1" ? true : false
                        }
                      />
                    )}
                  </Form.Item>
                  {getFieldValue("codeType") ? (
                    <Form.Item
                      label="业务类型"
                      style={{ display: "flex" }}
                      colon={false}
                    >
                      {getFieldDecorator("busType", {
                        rules: [{ required: true, message: "请选择业务类型" }],
                        initialValue: "1",
                      })(
                        <Select
                          defaultActiveFirstOption={false}
                          placeholder="请选择"
                        >
                          {busType().map(item => (
                            <Select.Option key={item.ibm} value={item.ibm}>
                              {item.note}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {getFieldValue("codeType") &&
                  getFieldValue("busType") !== "2" ? (
                      <Form.Item
                        label="存管银行"
                        style={{ display: "flex" }}
                        colon={false}
                      >
                        {getFieldDecorator("bank", {
                          rules: [],
                        })(
                          <Select
                            className={styles.selectHeight}
                            defaultActiveFirstOption={false}
                            showSearch
                            filterOption={(input, option) =>
                              option.props.children.indexOf(input) !== -1
                            }
                          >
                            {bankData.map(item => (
                              <Select.Option
                                key={item.orgCode}
                                value={item.orgCode}
                              >
                                {item.orgName}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    ) : (
                      ""
                    )}
                  {getFieldValue("codeType") !== "1" ? (
                    <Form.Item
                      label="小组成员"
                      style={{ display: "flex" }}
                      colon={false}
                    >
                      {getFieldDecorator("btn", {
                        rules: [
                          {
                            required:
                              getFieldValue("codeType") === "3" ? false : true,
                            message: "请添加小组成员",
                          },
                        ],
                      })(
                        <div
                          style={{ color: "#244FFF", cursor: "pointer" }}
                          onClick={this.showModal}
                        >
                          添加小组成员
                        </div>
                      )}
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  <div style={{ transform: "translate(14px,-30px)" }}>
                    {getFieldValue("codeType") !== "1" && checkedList
                      ? checkedList.map((item, index) => {
                        return (
                          <div
                            style={{ display: "flex", marginTop: "10px" }}
                            key={item.split("/")[1]}
                          >
                            <Form.Item
                              label=""
                              style={{ display: "flex" }}
                              colon={false}
                              className={styles.groupMember}
                            >
                              {getFieldDecorator(
                                `Member${item.split("/")[0]}`,
                                {
                                  rules: [
                                    { validator: this.maxValidate },
                                    {
                                      required: true,
                                      message: "请输入人员比例",
                                    },
                                  ],
                                }
                              )(
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  addonBefore={`${item.split("/")[1]}(${
                                    item.split("/")[2]
                                  })`}
                                  addonAfter="%"
                                  className={styles.groupMember}
                                  key={index}
                                  autoComplete="off"
                                  onChange={this.checkMax}
                                ></Input>
                              )}
                            </Form.Item>
                            <Icon
                              type="close"
                              style={{
                                fontSize: "16px",
                                transform: "translate(-20px,12px)",
                              }}
                              onClick={() => this.remove(index)}
                            />
                          </div>
                        );
                      })
                      : ""}
                  </div>
                </Row>
                <Row type="flex" style={{ alignItems: "flex-end" }}>
                  <Form.Item
                    label={showTitle(tip)}
                    style={{ display: "flex" }}
                    colon={false}
                  >
                    {getFieldDecorator("codeType", {
                      rules: [{ required: true, message: "请选择二维码类型" }],
                      initialValue: auth ? "2" : "1",
                    })(
                      <Select
                        className={styles.selectHeight}
                        defaultActiveFirstOption={false}
                        onChange={this.setBusType}
                      >
                        {groupTypeInfo.map(item => (
                          <Select.Option key={item.ibm} value={item.ibm}>
                            {item.note}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  {getFieldValue("codeType") === "2" ? (
                    <Form.Item
                      label="渠道"
                      style={{ display: "flex" }}
                      colon={false}
                    >
                      {getFieldDecorator("channel", {
                        rules: [{ required: true, message: "请选择渠道" }],
                      })(
                        <Select
                          onChange={() => {
                            setTimeout(() => this.getDepartments(), 0);
                          }}
                          defaultActiveFirstOption={false}
                          placeholder="请选择"
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.indexOf(input) !== -1
                          }
                        >
                          {channel.map(item => (
                            <Select.Option
                              key={item.chnlId}
                              value={item.chnlId}
                            >{`${item.chnlCode}/${item.chnlNm}`}</Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {getFieldValue("codeType") &&
                  getFieldValue("busType") !== "2" ? (
                      <Form.Item
                        label="开户营业部"
                        style={{ display: "flex" }}
                        colon={false}
                      >
                        {getFieldDecorator("department", {
                          rules: [
                            {
                              required:
                              getFieldValue("codeType") === "1" ? false : true,
                              message: "请选择开户营业部",
                            },
                          ],
                        })(
                          <TreeSelect
                            onFocus={this.checkChannel}
                            defaultActiveFirstOption={false}
                            showSearch
                            filterTreeNode={(input, option) =>
                              option.props.title.indexOf(input) !== -1
                            }
                            style={{ width: "100%" }}
                            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                            treeData={departments}
                            placeholder="请选择开户营业部"
                            treeDefaultExpandAll
                          />
                        )}
                      </Form.Item>
                    ) : (
                      ""
                    )}
                  {getFieldValue("codeType") ? (
                    <Form.Item
                      label="场景"
                      style={{ display: "flex" }}
                      colon={false}
                    >
                      {getFieldDecorator("scene")(
                        <Input
                          placeholder="1-99"
                          autoComplete="off"
                          min={1}
                          max={99}
                          type="number"
                        />
                      )}
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {getFieldValue("codeType") === "3" ? (
                    <Form.Item
                      label="是否银行专属"
                      style={{ display: "flex" }}
                      colon={false}
                    >
                      {getFieldDecorator("isBank", {
                        rules: [{ required: false, message: "请选择" }],
                        initialValue: "2",
                      })(
                        <Select
                          className={styles.selectHeight}
                          defaultActiveFirstOption={false}
                          onChange={this.setIsBankType}
                        >
                          {bankTypeInfo.map(item => (
                            <Select.Option key={item.ibm} value={item.ibm}>
                              {item.note}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  ) : (
                    ""
                  )}
                </Row>
              </Row>
              <Row type="flex" className={styles.submit}>
                <Button htmlType="submit" className={styles.submitBtn}>
                  保存
                </Button>
                <Button
                  className={styles.cancelBtn}
                  onClick={() => {
                    router.push("/merge/account/personal");
                    this.props.form.resetFields();
                  }}
                >
                  取消
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(addGroup));
