import React, { Component } from "react";
import {
  GetChannelInfoModel,
  OptionalStaffList,
  ChannelManagementModel,
  QueryStaffTips,
  GetCommissionAgreementInfo,
  QueryChannelAuthorityDepartment,
  QueryCreditInfo
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
  Spin
} from "antd";
import { history as router } from "umi";
import lodash, { initial } from "lodash";
import TreeUtils from "$utils/treeUtils";
import styles from "./addChannel.less";

class addChannel extends Component {
  state = {
    administratorData: [],
    searchValue: "",
    departments: [],
    department: "", // 营业部
    depLength: 0,
    departmentValue: "",
    allYyb: [],
    authDeptLst: [],
    loading: false,
    agreeInfo: [],
    crediInfo: []
  };
  componentDidMount() {
    this.getDepartments();
    // this.queryCreditInfo();
    GetCommissionAgreementInfo({
      current: 0,
      pageLength: 0,
      pageNo: 0,
      // "pageSize": 10,
      paging: 1,
      sort: "",
      total: -1,
      totalRows: 0
    })
      .then(res => {
        this.setState({
          agreeInfo: res.records
        });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  }
  componentDidUpdate(preProps) {
    /* if (preProps.location.add !== this.props.location.add) {
      this.setState({
        department: '',
      });
    } */
  }
  queryCreditInfo = value => {
    this.setState({
      loading: true
    });
    QueryCreditInfo({
      keywrod: value,
      paging: 1,
      sort: "",
      total: -1,
      pageSize: 20,
      current: 1
    })
      .then(res => {
        this.setState({
          crediInfo: [{ name: "无", code: "无", id: "无" }, ...res.records],
          loading: false
        });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  searchCrediInfo = value => {
    lodash.debounce(this.queryCreditInfo, 500)(value);
  };

  queryStaffTips = value => {
    this.setState({
      loading: true
    });
    QueryStaffTips({
      keyword: value,
      paging: 1,
      sort: "",
      total: -1,
      pageSize: 20,
      current: 1
    })
      .then(res => {
        this.setState({
          administratorData: res.records,
          loading: false
        });
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };
  searchAdmin = value => {
    lodash.debounce(this.queryStaffTips, 500)(value);
  };
  // 获取焦点回调
  handleFocus = () => {
    this.searchAdmin("");
  };

  handleCrediFocus = e => {
    this.searchCrediInfo("");
  };

  isOnlyCodeTip = (rule, value, callback) => {
    if (value && value !== "") {
      if (!/^[A-Za-z]+$/g.test(value)) {
        callback("请输入字母");
      } else if (value.length < 2 || value.length > 6) {
        callback("渠道代码为2~6位字母");
      } else {
        GetChannelInfoModel({ chnlCode: value }).then(res => {
          if (res.total !== 0) {
            callback("已存在相同的渠道代码");
          } else {
            callback(
              this.props.form.setFieldsValue({
                // 自动转成大写
                code: value.toLowerCase()
              })
            );
          }
        });
      }
    } else {
      callback();
    }
  };
  isOnlyNameTip = (rule, value, callback) => {
    if (value && value !== "") {
      GetChannelInfoModel({ chnlCode: value }).then(res => {
        if (res.total !== 0) {
          callback("已存在相同的渠道名称");
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      let feeArr = [
        { code: "0", name: "计提比例", fee: value.fee0 || 0 },
        { code: "1", name: "服务费1", fee: value.fee1 || 0 },
        { code: "2", name: "服务费2", fee: value.fee2 || 0 }
      ];
      /* if (value.fee1 && value.fee2) {
        feeArr = [
          { "code": "1", "name": "服务费1", "fee": value.fee1 }, { "code": "2", "name": "服务费2", "fee": value.fee2 },
        ];
      } else if (value.fee1) {
        feeArr = [
          { "code": "1", "name": "服务费1", "fee": value.fee1 },
        ];
      } else if (value.fee2) {
        feeArr = [
          { "code": "2", "name": "服务费2", "fee": value.fee2 },
        ];
      } else {

      } */
      if (!err) {
        ChannelManagementModel({
          authDeptLst: this.state.authDeptLst,
          chnlCode: value.code,
          chnlNm: value.name,
          chnlTp: value.type * 1,
          cmsnAgr: value.agreement * 1,
          crtGrpAdt: value.examin * 1,
          mngUsr: value.administrator * 1,
          oprTp: 1,
          pmsnPersRlt: value.relate * 1,
          srvcFeeDtl: feeArr,
          creditCode: value.creditCode
        })
          .then(res => {
            if (res.statusCode === 200) {
              message.info(res.note);
              router.push({
                pathname: "/merge/account/accountManagement",
                state: Date.now().toString(36)
              });
              this.props.form.resetFields();
              this.setState({
                authDeptLst: []
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
    QueryChannelAuthorityDepartment()
      .then(result => {
        const { records = [] } = result;
        const datas = TreeUtils.toTreeData(
          records,
          {
            keyName: "yybid",
            pKeyName: "fid",
            titleName: "yybmc",
            normalizeTitleName: "title",
            normalizeKeyName: "value"
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
      label: allYyb.find(item => item.yybid === val).yybmc
    }));
  };

  // 搜索营业部变化
  handleYybSearch = value => {
    this.setState({
      searchValue: value
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
        department: this.formatValue(department.join(","))
      });
    }, 0);
    this.setState({
      department: department.join(","),
      searchValue: this.state.searchValue,
      authDeptLst: this.state.allYyb
        .filter(item => department.indexOf(item.yybid) !== -1)
        .map(item => ({ id: item.yybid, name: item.yybmc }))
    });
  };

  render() {
    const {
      department,
      departments,
      searchValue,
      depLength,
      loading,
      agreeInfo,
      crediInfo
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const channelTypeInfo = this.props.dictionary["CHNL_GLFL"] || [];
    return (
      <div className={styles.addTable}>
        <div className={styles.title}>
          <Button
            type="primary"
            onClick={() => {
              router.push("/merge/account/accountManagement");
              this.props.form.resetFields();
            }}
          >
            <Icon type="arrow-left" />
            返回上层
          </Button>
          <span className={styles.titleText}>新增渠道</span>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <Form className="login-form" onSubmit={this.handleSubmit}>
              <Row type="flex" style={{ flexDirection: "row" }}>
                <Row
                  type="flex"
                  style={{ alignItems: "flex-end", marginRight: "36px" }}
                >
                  <Form.Item
                    label="渠道代码"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("code", {
                      rules: [
                        { required: true, message: "请输入渠道代码" },
                        { validator: this.isOnlyCodeTip }
                      ]
                    })(
                      <Input
                        placeholder="请输入2~6位字母代码"
                        autoComplete="off"
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="佣金协议"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("agreement", {
                      rules: [{ required: true, message: "请选择佣金协议" }]
                    })(
                      <Select
                        placeholder="请选择"
                        showSearch
                        // firstActiveValue={false}
                        filterOption={(input, option) =>
                          option.props.children.indexOf(input) !== -1
                        }
                        dropdownRender={menu => (
                          <div>
                            <Spin spinning={loading}>
                              <div>{menu}</div>
                            </Spin>
                          </div>
                        )}
                      >
                        {agreeInfo.map(item => (
                          <Select.Option key={item.Id} value={item.Id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    label="授权营业部"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("department", {
                      rules: [{ required: true, message: "请选择授权营业部" }]
                    })(
                      <TreeSelect
                        showSearch
                        style={{ width: "100%" }}
                        className={styles.mulSelect}
                        // value={this.formatValue(department)}
                        treeData={departments}
                        // dropdownMatchSelectWidth={false}
                        dropdownClassName="m-bss-treeSelect"
                        dropdownStyle={{ maxHeight: 400, overflowY: "auto" }}
                        filterTreeNode={this.filterTreeNode}
                        placeholder="营业部"
                        allowClear
                        multiple
                        searchValue={searchValue}
                        treeDefaultExpandAll
                        maxTagCount={3}
                        maxTagPlaceholder={value =>
                          this.maxTagPlaceholder(value)
                        }
                        maxTagTextLength={5}
                        treeCheckable={true}
                        onChange={this.handleYybChange}
                        onSearch={this.handleYybSearch}
                        treeCheckStrictly={true}
                        // showCheckedStrategy={TreeSelect.SHOW_ALL}
                      ></TreeSelect>
                    )}
                  </Form.Item>
                  <Form.Item
                    className={styles.wrapItem}
                    label={
                      <>
                        <span>
                          创建小组
                          <br />
                          总部审批
                        </span>
                      </>
                    }
                    colon={false}
                  >
                    {getFieldDecorator("examin", {
                      rules: [{ required: true, message: "请选择授权营业部" }],
                      initialValue: "1"
                    })(
                      <Select defaultActiveFirstOption={false}>
                        <Select.Option key="1" value="1">
                          是
                        </Select.Option>
                        <Select.Option key="2" value="2">
                          否
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    label="服务费2"
                    className={styles.formItem}
                    colon={
                      false
                    } /* style={{ transform: 'translateY(-2px)' }} */
                  >
                    {getFieldDecorator("fee2")(
                      <Input
                        placeholder="请输入服务费2"
                        autoComplete="off"
                        type="number"
                        step="0.01"
                        min={0}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="计提比例"
                    className={styles.formItem}
                    colon={
                      false
                    } /* style={{ transform: 'translateY(-2px)' }} */
                  >
                    {getFieldDecorator("fee0")(
                      <Input
                        placeholder="请输入计提比例"
                        autoComplete="off"
                        type="number"
                        min={0}
                        max={100}
                      />
                    )}
                  </Form.Item>
                </Row>
                <Row type="flex" style={{ alignItems: "flex-end" }}>
                  <Form.Item
                    label="渠道名称"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("name", {
                      rules: [
                        { required: true, message: "请输入渠道名称" },
                        { validator: this.isOnlyNameTip }
                      ]
                    })(
                      <Input placeholder="请输入渠道名称" autoComplete="off" />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="分类"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("type", {
                      rules: [{ required: true, message: "请选择渠道分类" }]
                    })(
                      <Select
                        defaultActiveFirstOption={false}
                        placeholder="请选择"
                      >
                        {channelTypeInfo.map(item => (
                          <Select.Option key={item.ibm} value={item.ibm}>
                            {item.note}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    className={styles.wrapItem}
                    label={
                      <>
                        <span>
                          允许个人
                          <br />
                          开发关系
                        </span>
                      </>
                    }
                    colon={false}
                  >
                    {getFieldDecorator("relate", {
                      rules: [
                        { required: true, message: "请选择个人开发关系" }
                      ],
                      initialValue: "2"
                    })(
                      <Select
                        defaultActiveFirstOption={false}
                        placeholder="请选择"
                      >
                        <Select.Option key="1" value="1">
                          是
                        </Select.Option>
                        <Select.Option key="2" value="2">
                          否
                        </Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    label="服务费1"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("fee1")(
                      <Input
                        placeholder="请输入服务费1"
                        autoComplete="off"
                        type="number"
                        step="0.01"
                        min={0}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label="管理人"
                    className={styles.formItem}
                    colon={false}
                  >
                    {getFieldDecorator("administrator", {
                      rules: [{ required: true, message: "请选择管理人" }]
                    })(
                      <Select
                        placeholder="请选择"
                        showSearch
                        onSearch={this.searchAdmin}
                        onFocus={this.handleFocus}
                        filterOption={false}
                        /* filterOption={(input, option) => {
                          if ((/.*[\u4e00-\u9fa5]+.*$/).test(input)) {
                            return option.props.children.indexOf(input) !== -1;
                          } else {
                            return option.key?.indexOf(input) !== -1 ? option.props.children : '';
                          }
                        }} */
                        dropdownRender={menu => (
                          <div>
                            <Spin spinning={loading}>
                              <div>{menu}</div>
                            </Spin>
                          </div>
                        )}
                      >
                        {this.state.administratorData.map(item => (
                          <Select.Option key={item.rybh} value={item.ryid}>
                            {`${item.ryxm}(${item.rybh})`}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item
                    label=""
                    className={styles.formItem}
                    colon={false}
                  ></Form.Item>
                </Row>
              </Row>
              <Row type="flex" style={{ alignItems: "flex-end" }}>
                <Form.Item
                  label="绑定企业"
                  className={`${styles.formItem} ${styles.inputW}`}
                  colon={false}
                >
                  {getFieldDecorator("creditCode", {
                    rules: [
                      {
                        required: true,
                        message: "请输入统一社会信用代码或填'无'"
                      }
                    ]
                  })(
                    <Input
                      placeholder="请输入统一社会信用代码或填'无'"
                      autoComplete="off"
                    />
                    // <Select
                    //   placeholder="请输入统一社会信用代码或填'无'"
                    //   showSearch
                    //   onSearch={this.searchCrediInfo}
                    //   allowClear
                    //   // onChange={this.searchCrediInfo}
                    //   onFocus={this.handleCrediFocus}
                    //   showArrow={false}
                    //   filterOption={(input, option) => {
                    //     return (
                    //       option.props.value
                    //         .toLowerCase()
                    //         .indexOf(input.toLowerCase()) >= 0 ||
                    //       option.props.children
                    //         .toLowerCase()
                    //         .indexOf(input.toLowerCase()) >= 0
                    //     );
                    //   }}
                    //   dropdownRender={menu => (
                    //     <div>
                    //       <Spin spinning={loading}>
                    //         <div>{menu}</div>
                    //       </Spin>
                    //     </div>
                    //   )}
                    // >
                    //   {crediInfo.map(item => (
                    //     <Select.Option key={item.id} value={item.code}>
                    //       {item.code}
                    //     </Select.Option>
                    //   ))}
                    // </Select>
                  )}
                  <div style={{ color: "#959CBA", lineHeight: "20px" }}>
                    {/* <p>1.营业执照上写有社会统一信用代码等信息</p> */}
                    <p>
                      渠道若有具体合作企业，请务必填写统一社会信用代码（尤其是对公签约的渠道，必填对方营业执照所示的统一社会信用代码）；若渠道为活动类或无特定合作企业，可填'无'。
                    </p>
                  </div>
                </Form.Item>
              </Row>
              <Row type="flex" className={styles.submit}>
                <Button htmlType="submit" className={styles.submitBtn}>
                  保存
                </Button>
                <Button
                  className={styles.cancelBtn}
                  onClick={() => {
                    router.push("/merge/account/accountManagement");
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
  dictionary: global.dictionary
}))(Form.create()(addChannel));
