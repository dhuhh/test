import React, { Component } from 'react';
import { GetChannelInfoModel, OptionalStaffList, GetGroupInfoModel, GroupManagement, QueryChannelAuthorityDepartment } from '$services/newProduct';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { connect } from 'dva';
import { Button, Icon, Form, Input, Row, Col, Select, TreeSelect, message, Modal, Popover , Tooltip } from 'antd';
import { history as router } from 'umi';
import lodash, { initial, map } from 'lodash';
import SelectCheckbox from '../Common/SelectCheckbox';
import TreeUtils from '$utils/treeUtils';
import Scrollbars from 'react-custom-scrollbars';
import styles from './addGroup.less';

class groupDetail extends Component {
  state = {
    administratorData: [],
    searchValue: '',
    departments: [],
    department: '', // 营业部
    departmentValue: '',
    allYyb: [],
    authDeptLst: [],
    channel: [],
    codeType: '',
    visible: false,
    checkedList: [],
    checkAll: false,
    indeterminate: false,
    // arrow: false,
    recordVisible: false,
  }
  componentDidMount() {
    OptionalStaffList({
      paging: 1,
      sort: '',
      total: -1,
      pageSize: 10,
      current: 1,
    }).then(res => {
      this.setState({
        administratorData: res.records,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
    GetChannelInfoModel().then(res => {
      this.setState({
        channel: res.records,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
    this.getDepartments();

    const { grpMbrLst } = this.props.location.state;
    this.setState({
      checkedList: grpMbrLst.map(item => (`${item.stId}/${item.stfNm}/${item.stfNo}`)),
    }, () => {
      this.checkSelectStatus();
    });
  }
  componentDidUpdate(preProps) {
    /* if (preProps.location.detail !== this.props.location.detail) {
      const { grpMbrLst } = this.props.location.state;
      this.setState({
        checkedList: grpMbrLst.map(item => (`${item.stId}/${item.stfNm}/${item.stfNo}`)),
      }, () => {
        this.checkSelectStatus();
      });
    } */
  }
  handleVisibleChange = visible => {
    this.setState({ recordVisible: visible });
  };
  checkSelectStatus = () => {
    const { administratorData, checkedList } = this.state;
    // console.log('1111111111');
    if (checkedList.length !== 0 && checkedList.length === administratorData.length) {
      this.setState({
        checkAll: true,
      });
    } else {
      this.setState({
        checkAll: false,
      });
    }
    if (checkedList.length !== 0 && checkedList.length !== administratorData.length) {
      this.setState({
        indeterminate: true,
      });
    } else {
      this.setState({
        indeterminate: false,
      });
    }
  }
  remove = (index) => {
    let arr = this.state.checkedList.filter((item, id) => id !== index);
    this.setState({
      checkedList: arr,
    }, () => {
      this.checkSelectStatus();
    });
  }
  setValue = (value, type) => {
    const { administratorData, checkedList } = this.state;
    if (type === 'all') {
      this.setState({
        indeterminate: false,
        checkAll: !this.state.checkAll,
      });
    } else {
      this.setState({
        indeterminate: (checkedList.length < administratorData.length) && !(checkedList.length + 1 === administratorData.length),
        checkAll: checkedList.length + 1 === administratorData.length,
      });
    }
    this.setState({
      checkedList: value,
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
    this.setState({
      checkedList: [],
      checkAll: false,
      indeterminate: false,
    });
  };
  isOnlyNameTip = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== '' && getFieldValue('codeType') && getFieldValue('codeType') !== '') {
      GetGroupInfoModel({ 'grpCode': value, 'grpTp': getFieldValue('codeType') }).then(res => {
        if (res.total !== 0 && value !== this.props.location.state.grpNm) {
          callback('已存在相同的二维码名称');
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  }
  nameMaxLength = (rule, value, callback) => {
    if (this.props.form.getFieldValue('codeType') === '2') {
      let len = 0;
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
          len += 2;
        } else {
          len++;
        }
      }
      if (len > 20) return callback('不能超过10位汉字');
      callback();
    } else {
      callback();
    }
  };
  maxValidate = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== '') {
      let groupKey = this.state.checkedList.map((item, index) => `Member${item.split('/')[0]}`);
      let total = 0;
      groupKey.forEach((item, index) => {
        if (getFieldValue(item)) {
          total += getFieldValue(item) * 1;
        }
      });
      if (total > 100) {
        callback('总比例不能大于100');
      } else {
        callback();
      }
    } else {
      callback();
    }
  }
  checkMax = () => {
    let groupKey = this.state.checkedList.map((item, index) => `Member${item.split('/')[0]}`);
    setTimeout(() => {
      this.props.form.validateFields(groupKey);
    }, 0);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let grpMbrLst = this.state.checkedList.map((item, index) => { return { userid: item.split('/')[0], ration: this.props.form.getFieldValue(`Member${item.split('/')[0]}`) }; });

    this.props.form.validateFields((err, value) => {
      if (!err) {
        GroupManagement({
          'grpId': this.props.location.state.grpId * 1,
          "acctDept": value.department * 1,
          "applSc": value.scene,
          "busTp": value.busType * 1,
          "chnlId": value.channel * 1,
          "depBank": value.bank * 1,
          "grpMbrLst": grpMbrLst,
          "grpNm": value.codeName,
          "grpTp": value.codeType * 1,
          "oprTp": 2,
        }).then(res => {
          if (res.statusCode === 200) {
            this.props.form.resetFields();
            this.setState({
              checkedList: [],
            });
            router.push('/merge/account/personal');
          }
        });
      } else {
        return;
      }
    });
  }

  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  }
  // 获取管辖营业部的数据
  getDepartments = () => {
    let param = this.props.form.getFieldValue('codeType') === '2' ? { channelId: this.props.form.getFieldValue('channel') * 1 } : '';
    QueryChannelAuthorityDepartment(param).then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      this.setState({ departments, allYyb: records });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYyb = [] } = this.state;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val).yybmc }));
  }

  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }
  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.state;
    const util = (fid, title) => {
      if (fid === '0') return false;
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
  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }
  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let authDeptLst = [];
    authDeptLst = value.map(item => ({ id: item.value, name: item.label }));
    this.setState({
      authDeptLst,
    });
    let { department } = this.state;
    if (value.length) {
      department = department ? department.split(',') : [];
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (department.indexOf(item) === -1) department.push(item);
        });
      } else {
        array.forEach(item => {
          if (department.indexOf(item) > -1) department.splice(department.indexOf(item), 1);
        });
      }
    } else {
      department = [];
    }
    setTimeout(() => {
      this.props.form.setFieldsValue({ department: this.formatValue(department.join(',')) });
    }, 0);
    this.setState({
      department: department.join(','),
      searchValue: this.state.searchValue,
    });

  }

  render() {
    const { channel, codeType, checkedList, checkAll, indeterminate, administratorData, allYyb } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const businessType = this.props.dictionary['CHNL_YW'] || [];
    const bankData = this.props.dictionary['CHNL_CGYH'] || [];
    const groupTypeInfo = this.props.dictionary['CHNL_EWMLX'] || [];
    const codeTips = getFieldValue('codeType') !== '1' ? (
      < div style={{ position: 'absolute', right: "0", top: '35px' }
      }> { getFieldValue('codeName') ? getFieldValue('codeName').length : 0} / 10中文</div >
    ) : '';
    const busType = () => {
      if (getFieldValue('codeType') === '1') {
        return businessType;
      } else if (getFieldValue('codeType') === '2' || getFieldValue('codeType') === '3') {
        return businessType.slice(0, 1);
      } else {
        return [];
      }
    };


    const tip = '个人和营业部合作小组开户会自动加挂开发关系' ;

    const bankTypeInfo = [
      { note: "是", ibm: "1" },
      { note: "否", ibm: "2" },
    ];

    const showTitle = (text) =>{
      return (
        <span>
          <span>二维码类型</span>
          <Tooltip title={text}>
            <Icon style={{ marginLeft: 3,color: 'rgb(178 181 191)' }} type="question-circle" />
          </Tooltip>
        </span>
      );
    };

    let { grpNm, grpTp, busTp, chnlNm, depBank, acctDept, applSc, grpMbrLst, status, adtInf ,isBank } = this.props.location.state;
    let changeType = ((grpTp === '渠道小组' || grpTp === '营业部合作小组') && status === '已生效');
    grpTp = groupTypeInfo.find(item => item.note === grpTp) ? groupTypeInfo.find(item => item.note === grpTp).ibm : '';
    chnlNm = channel.find(item => item.chnlNm === chnlNm) ? channel.find(item => item.chnlNm === chnlNm).chnlId : '';
    busTp = businessType.find(item => item.note === busTp) ? businessType.find(item => item.note === busTp).ibm : '';
    depBank = bankData.find(item => item.note === depBank) ? bankData.find(item => item.note === depBank).ibm : '';
    acctDept = allYyb.find(item => item.yybmc === acctDept) ? allYyb.find(item => item.yybmc === acctDept).yybid : '';

    const contentNode = (
      <Scrollbars autoHide style={{ width: '878px' }} autoHeight
        autoHeightMin={0}
        autoHeightMax={200}>
        <div className={styles.popOver}>
          <div>
            <div>审批人</div>
            <div>审批时间</div>
            <div>状态</div>
            <div>审批意见</div>
          </div>
          {
            adtInf.map(item => (
              <div>
                <div>{`${item.audtNm}(${item.audtNo})`}</div>
                <div>{item.audtTm}</div>
                <div>{item.audtSt}</div>
                <div>{item.audtIdel}</div>
              </div>
            ))
          }
        </div>
      </Scrollbars>
    );
    return (
      <div className={styles.addTable}>
        <Modal
          title="添加小组成员"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.mulSelect}
          destroyOnClose={true}
        >
          <Form.Item label="小组成员" style={{ display: "flex" }} colon={false}>
            <div
              onMouseDown={e => {
                e.preventDefault();
                return false;
              }}
            >
              <SelectCheckbox
                checkAll={checkAll}
                indeterminate={indeterminate}
                checkedList={checkedList}
                data={administratorData}
                placeholder="客户的开户渠道"
                setValue={this.setValue}
              />
            </div>
          </Form.Item>
        </Modal>
        <div className={styles.title}>
          <Button
            type="primary"
            onClick={() => router.push("/merge/account/personal")}
          >
            <Icon type="arrow-left" />
            返回上层
          </Button>
          <span className={styles.titleText}>二维码详情</span>
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
                    extra={codeTips}
                  >
                    {getFieldDecorator("codeName", {
                      initialValue: grpNm,
                      rules: [
                        { required: true, message: "请输入二维码名称" },
                        { validator: this.isOnlyNameTip },
                        { validator: this.nameMaxLength },
                      ],
                    })(
                      <Input
                        placeholder="请输入二维码名称"
                        autoComplete="off"
                        disabled
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
                        initialValue:
                          getFieldValue("codeType") === "2" ? "1" : busTp,
                      })(
                        <Select
                          defaultActiveFirstOption={false}
                          placeholder="请选择"
                          disabled
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
                          initialValue: depBank,
                        })(
                          <Select
                            className={styles.selectHeight}
                            defaultActiveFirstOption={false}
                            disabled
                          >
                            {bankData.map(item => (
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
                          style={{
                            color: "#61698C",
                          }} /* onClick={this.showModal} */
                        >
                          添加小组成员
                        </div>
                      )}
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  <div style={{ transform: "translateY(-65px)" }}>
                    {getFieldValue("codeType") !== "1" && checkedList
                      ? checkedList.map((item, index) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              marginTop: "10px",
                              alignItems: "center",
                            }}
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
                                  initialValue: grpMbrLst.find(
                                    item1 => item1.stId === item.split("/")[0]
                                  )?.ratio,
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
                                  disabled
                                  addonBefore={`${item.split("/")[1]}(${
                                    item.split("/")[2]
                                  })`}
                                  addonAfter="%"
                                  className={`${styles.groupMember}  ${styles.groupDetail}`}
                                  key={item.split("/")[0]}
                                  autoComplete="off"
                                  onChange={this.checkMax}
                                ></Input>
                              )}
                            </Form.Item>
                            {/* <Icon type="close" style={{ fontSize: '16px', transform: 'translateX(-20px)' }} onClick={() => this.remove(index)} /> */}
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
                      initialValue: grpTp,
                    })(
                      <Select
                        className={styles.selectHeight}
                        defaultActiveFirstOption={false}
                        disabled
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
                        initialValue: chnlNm,
                        rules: [{ required: true, message: "请选择渠道" }],
                      })(
                        <Select
                          defaultActiveFirstOption={false}
                          placeholder="请选择"
                          showSearch
                          disabled
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
                          initialValue: acctDept,
                        })(
                          <Select
                            className={styles.selectHeight}
                            defaultActiveFirstOption={false}
                            disabled
                          >
                            {this.state.allYyb.map(item => (
                              <Select.Option key={item.yybid} value={item.yybid}>
                                {item.yybmc}
                              </Select.Option>
                            ))}
                          </Select>
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
                      {getFieldDecorator("scene", { initialValue: applSc })(
                        <Input placeholder="1-99" autoComplete="off" disabled />
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
                        initialValue: isBank === "" ? "2" : isBank,
                      })(
                        <Select
                          className={styles.selectHeight}
                          defaultActiveFirstOption={false}
                          disabled
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
              {this.props.location.state.grpTp !== "个人" && adtInf[0] && (
                <Row
                  type="flex"
                  style={{ alignItems: "center", marginBottom: "20px" }}
                >
                  <div className={styles.records}>
                    <div>当前审批信息</div>
                    <div>
                      <div>审批人</div>
                      <div>{`${adtInf[0]?.audtNm}(${adtInf[0]?.audtNo})`}</div>
                    </div>
                    <div>
                      <div>状态</div>
                      <div>{adtInf[0].audtSt}</div>
                    </div>
                    <span className={styles.line}></span>
                    <div style={{ cursor: "pointer" }}>
                      <Popover
                        content={contentNode}
                        title={null}
                        trigger="click"
                        placement="bottom"
                        visible={this.state.recordVisible}
                        onVisibleChange={this.handleVisibleChange}
                        overlayClassName={styles.popNode}
                      >
                        审批历史
                        {this.state.recordVisible ? (
                          <Icon
                            type="up"
                            style={{ transform: "translate(5px,2px)" }}
                          />
                        ) : (
                          <Icon
                            type="down"
                            style={{ transform: "translate(5px,2px)" }}
                          />
                        )}
                      </Popover>
                    </div>
                  </div>
                </Row>
              )}
              {/* <Row type='flex' className={styles.submit}>
                <Button htmlType='submit' className={styles.submitBtn} >保存</Button>
                <Button className={styles.cancelBtn}>取消</Button>
              </Row> */}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(groupDetail));