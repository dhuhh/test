import React, { Component } from 'react';
import { GetChannelInfoModel, OptionalStaffList, GetGroupInfoModel, GroupManagement, SaveOperateRecord, QueryStaffPracticeInfo, GetBankCodeList, QueryChannelAuthorityDepartment ,BankGroupInfo,} from '$services/newProduct';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { connect } from 'dva';
import { Button, Icon, Form, Input, Row, Col, Select, TreeSelect, message, Modal, Popover, Checkbox, Pagination, Spin, Tooltip } from 'antd';
import { history as router } from 'umi';
import lodash, { initial, map } from 'lodash';
const { Option } = Select;
import SelectCheckbox from '../Common/SelectCheckbox';
import TreeUtils from '$utils/treeUtils';
import styles from './addGroup.less';
import Scrollbars from 'react-custom-scrollbars';

class changeGroup extends Component {
  state = {
    administratorData: [],
    searchValue: '',
    departments: [],
    department: '', // 营业部
    departmentValue: '',
    allYyb: [],
    authDeptLst: [],
    channelInfo: [],
    codeType: '',
    visible: false,
    recordVisible: false,
    checkedList: [],
    checkAll: false,
    indeterminate: false,
    // arrow: false,
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    searchMemberValue: '',
    bankData: [],
    inputValue: '',
    listData: [],
  }
  componentDidMount() {
    this.getBankCodeList();
    // this.queryStaffPracticeInfo()
    GetChannelInfoModel().then(res => {
      this.setState({
        channelInfo: res.records,
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
      this.props.form.setFieldsValue({ 'btn': this.state.checkedList })
    });
  }
  componentDidUpdate(preProps) {
     if (preProps.location.change !== this.props.location.change) {
      const { grpMbrLst } = this.props.location.state;
      this.setState({
        checkedList: grpMbrLst.map(item => (`${item.stId}/${item.stfNm}/${item.stfNo}`)),
      }, () => {
        this.checkSelectStatus();
        this.props.form.setFieldsValue({ btn: this.state.checkedList });
      });
    }
    // console.log(document.getElementsByClassName('ant-select-selection__choice'))
    let tag = document.getElementsByClassName('ant-select-selection__choice')
    for (let i = 0; i < tag.length; i++) {
      // console.log(tag[i].title)
      if (i < 3) {
        tag[i].title = tag[i].title.split('/').length > 1 ? `${tag[i].title.split('/')[1]}(${tag[i].title.split('/')[2]})` : tag[i].title;
        tag[i].childNodes[0].innerHTML = tag[i].title.split('/').length > 1 ? `${tag[i].title.split('/')[1]}(${tag[i].title.split('/')[2]})` : tag[i].title;
      }
    }
  }
  getBankCodeList = () => {
    GetBankCodeList().then(res => {
      this.setState({
        bankData: res.records,
      });
    });
  }
  queryStaffPracticeInfo = () => {
    this.setState({
      loading: true,
    });
    QueryStaffPracticeInfo({
      channelId: this.props.form.getFieldValue('channel') * 1,
      keyword: this.state.searchMemberValue,
      paging: 1,
      sort: '',
      total: -1,
      pageSize: 20,
      grpTp: this.props.form.getFieldValue("codeType") === "3" ? 3 : undefined,
      current: this.state.current,
    }).then(res => {
      this.setState({
        administratorData: res.records,
        total: res.total,
        loading: false,
      });
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handlePagerChange = (current) => {
    this.setState({
      current,
    }, () => {
      this.queryStaffPracticeInfo();
    });
  }
  searchAdmin = (value) => {
    this.setState({
      searchMemberValue: value,
      current: 1,
    }, () => {
      lodash.debounce(this.queryStaffPracticeInfo, 300)()
    })
  }
  handleOnFocus = () => {
    this.setState({
      searchMemberValue: '',
      current: 1,
    }, () => {
      lodash.debounce(this.queryStaffPracticeInfo, 300)()
    })
  }
  handleVisibleChange = visible => {
    this.setState({ recordVisible: visible });
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
  }
  remove = (index) => {
    let arr = this.state.checkedList.filter((item, id) => id !== index);
    this.setState({
      checkedList: arr,
      listData: arr,
    }, () => {
      this.checkSelectStatus();
      this.props.form.setFieldsValue({ 'btn': this.state.checkedList })
    });

    /*   const { form } = this.props;
      const keys = form.getFieldValue('keys');
      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      }); */
  }

  showModal = () => {
    this.setState({
      visible: true,
      listData: this.state.checkedList,
    }, () => {
      this.checkSelectStatus()
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
      checkedList: this.state.listData,
    }, () => {
      this.props.form.setFieldsValue({ 'btn': this.state.checkedList })
    });
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
      callback('请添加小组成员');
    } else {
      callback();
    }
  }
  isOnlyNameTip = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && value !== '' && getFieldValue('codeType') && getFieldValue('codeType') !== '') {
      GetGroupInfoModel({ 'grpCode': value, 'grpTp': getFieldValue('codeType') }).then(res => {
        if (res.total !== 0 && value !== this.props.location.state.grpNm) {
          callback('已存在相同的二维码名称');
        } else {
          callback();
        }
      }).catch(error => {
        message.error(!error.success ? error.message : error.note);
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
    let grpMbrLst = this.state.checkedList.map((item, index) => { return { userid: item.split('/')[0], username: item.split('/')[1], userno: item.split('/')[2], ration: this.props.form.getFieldValue(`Member${item.split('/')[0]}`) }; });

    this.props.form.validateFields((err, value) => {
      // console.log(value, '新')
      // console.log(this.props.location.state, '旧')
      if (!err) {
        const { channelInfo, allYyb } = this.state;
        const businessType = this.props.dictionary['CHNL_YW'] || [];
        // const bankData = this.props.dictionary['CHNL_CGYH'] || [];
        const groupTypeInfo = this.props.dictionary['CHNL_EWMLX'] || [];

        let { grpNm, grpTp, busTp, chnlNm, depBank, acctDept, applSc, grpId ,isBank} = this.props.location.state;
        let { codeName, codeType, busType, channel, bank, department, scene } = value;

        codeType = groupTypeInfo.find(item => item.ibm === codeType)?.note;
        channel = channelInfo.find(item => item.chnlNm === channel)?.chnlNm;
        busType = businessType.find(item => item.ibm === busType)?.note;
        bank = this.state.bankData.find(item => item.orgCode === bank)?.orgName;
        department = allYyb.find(item => item.yybid === department)?.yybmc;
        let saveLog = ''
        if (grpNm !== codeName) {
          saveLog += `小组名称修改前:${grpNm},修改后:${codeName}；`
        }
        if (grpTp !== codeType) {
          saveLog += `小组类型修改前:${grpTp},修改后:${codeType}；`
        }
        if (busTp !== busType) {
          saveLog += `业务类型修改前:${busTp},修改后:${busType}；`
        }
        if (chnlNm !== channel && channel) {
          saveLog += `渠道名称修改前:${chnlNm},修改后:${channel}；`
        }
        if (depBank !== bank && bank) {
          saveLog += `存管银行修改前:${depBank},修改后:${bank}；`
        }
        if (acctDept !== department && department) {
          saveLog += `开户营业部修改前:${acctDept},修改后:${department}；`
        }
        if (applSc !== scene && scene) {
          saveLog += `场景修改前:${applSc || ' '},修改后:${scene}；`
        }
        GroupManagement({
          'grpId': grpId * 1,
          "acctDept": value.department * 1,
          "applSc": value.scene,
          "busTp": value.busType * 1,
          "chnlId": value.channel * 1,
          "depBank": value.bank * 1,
          "grpMbrLst": grpMbrLst,
          "grpNm": value.codeName,
          "grpTp": value.codeType * 1,
          "oprTp": 2,
          'isBank' : isBank == '' ? "" : value.isBank * 1
        }).then(res => {
          let description = grpMbrLst.length > 0 ? saveLog + res.note : saveLog
          if (description !== '') {
            SaveOperateRecord({ type: 2, description: description, oprId: 2, objId: grpId * 1 }).then(res => {
            }).catch(error => {
              message.error(!error.success ? error.message : error.note);
            })
          }
          message.info('操作成功');
          this.props.form.resetFields();
          router.push({ pathname: '/merge/account/personal', state: Date.now().toString(36) })
        }).catch(error => {
          message.error(!error.success ? error.message : error.note);
        });
      } else {
        message.error(err)
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
  onChange = (checkedList) => {
    this.setState({
      inputValue: '',
      listData: checkedList
    }, () => {
      this.checkSelectStatus()
    });
  };
  onCheckAllChange = (e) => {
    let { administratorData } = this.state;
    const key = [];
    if (this.state.inputValue) administratorData = administratorData.filter((item) => item.ryxm.indexOf(this.state.inputValue) > -1);
    administratorData.map(item => {
      // key.push(`${item.ryid}/${item.ryxm}/${item.rybh}`);
      if (item.zyzg !== "0") {
        key.push(`${item.ryid}/${item.ryxm}/${item.rybh}`);
      }
    });
    this.onChange(e.target.checked ? key : []);
  };
  setIsBankType = e => {
    let { grpNm , isBank} = this.props.location.state;
    if(isBank === '1'){
     this.props.form.setFieldsValue({ codeName: grpNm });
    }else{
      if (e === "1") {
        this.getBankGroupInfo();
      } else {
        let { grpNm } = this.props.location.state;
        this.props.form.setFieldsValue({ codeName: grpNm });
      }
  }

  };
  getBankGroupInfo = () => {
    BankGroupInfo().then(res => {
      const { records } = res;
      this.props.form.setFieldsValue({ codeName: records[0].name });
    });
  };

  render() {
    const { channelInfo, codeType, checkedList, checkAll, indeterminate, allYyb, current, total, loading, bankData, listData, departments } = this.state;
    let { administratorData } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const businessType = this.props.dictionary['CHNL_YW'] || [];
    // const bankData = this.props.dictionary['CHNL_CGYH'] || [];
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
      { note: "否", ibm: "2" }
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

    let { grpNm, grpTp, busTp, chnlNm, depBank, acctDept, applSc, grpMbrLst, status, adtInf , isBank} = this.props.location.state;
    let changeType = ((grpTp === '渠道小组' || grpTp === '营业部合作小组') && status === '已生效');
    grpTp = groupTypeInfo.find(item => item.note === grpTp)?.ibm;
    chnlNm = channelInfo.find(item => item.chnlNm === chnlNm)?.chnlId;
    busTp = businessType.find(item => item.note === busTp)?.ibm;
    depBank = bankData.find(item => item.orgName === depBank)?.orgCode;
    acctDept = allYyb.find(item => item.yybmc === acctDept)?.yybid;
    const contentNode = (
      <Scrollbars autoHide style={{ width: '878px' }}
        autoHeight
        autoHeightMin={0}
        autoHeightMax={200}>
        <div className={styles.popOver} id='popOver'>
          <div>
            <div>审批人</div>
            <div>审批时间</div>
            <div>状态</div>
            <div>审批意见</div>
          </div>
          {
            adtInf?.map(item => (
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
                        textAlign: "right"
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
              router.push({ pathname: "/merge/account/personal" });
              this.props.form.resetFields();
            }}
          >
            <Icon type="arrow-left" />
            返回上层
          </Button>
          <span className={styles.titleText}>修改二维码</span>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow} style={{ position: "relative" }}>
            {getFieldValue("codeType") === "2" ? (
              <div
                style={{
                  position: "absolute",
                  top: "-15px",
                  paddingLeft: "90px"
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
                        { validator: this.nameMaxLength }
                      ]
                    })(
                      <Input
                        placeholder="请输入二维码名称"
                        autoComplete="off"
                        disabled={changeType || getFieldValue("isBank") === "1"}
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
                          getFieldValue("codeType") === "2" ? "1" : busTp
                      })(
                        <Select
                          defaultActiveFirstOption={false}
                          placeholder="请选择"
                          disabled={changeType}
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
                        initialValue: depBank
                      })(
                        <Select
                          className={styles.selectHeight}
                          defaultActiveFirstOption={false}
                          disabled={changeType}
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
                            message: "请添加小组成员"
                          }
                        ]
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
                              key={item.split("/")[0]}
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
                                        message: "请输入人员比例"
                                      }
                                    ]
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
                                    key={item.split("/")[0]}
                                    autoComplete="off"
                                    onChange={this.checkMax}
                                  ></Input>
                                )}
                              </Form.Item>
                              <Icon
                                type="close"
                                style={{
                                  fontSize: "16px",
                                  transform: "translate(-20px,12px)"
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
                      initialValue: grpTp
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
                        rules: [{ required: true, message: "请选择渠道" }]
                      })(
                        <Select
                          defaultActiveFirstOption={false}
                          placeholder="请选择"
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.indexOf(input) !== -1
                          }
                          disabled={changeType}
                        >
                          {channelInfo.map(item => (
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
                            message: "请选择开户营业部"
                          }
                        ],
                        initialValue: acctDept
                      })(
                        <TreeSelect
                          disabled={changeType}
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
                      {getFieldDecorator("scene", { initialValue: applSc })(
                        <Input
                          placeholder="1-99"
                          autoComplete="off"
                          min={1}
                          max={99}
                          type="number"
                          disabled={changeType}
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
                        initialValue: isBank === "" ? "2" : isBank
                      })(
                        <Select
                          className={styles.selectHeight}
                          defaultActiveFirstOption={false}
                          onChange={this.setIsBankType}
                          disabled={changeType}
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
              {this.props.location.state.grpTp !== "个人" && (
                <Row
                  type="flex"
                  style={{
                    alignItems: "center",
                    marginBottom: "60px",
                    marginTop: "-10px"
                  }}
                >
                  <div className={styles.records}>
                    <div>当前审批信息</div>
                    <div>
                      <div>审批人</div>
                      <div>
                        {`${adtInf[0]?.audtNm || ""}`}
                        {adtInf[0]?.audtNo ? `(${adtInf[0]?.audtNo})` : ""}
                      </div>
                    </div>
                    <div>
                      <div>状态</div>
                      <div>{adtInf[0]?.audtSt || ""}</div>
                    </div>
                    <span className={styles.line}></span>
                    <div style={{ cursor: "pointer" }} id="popNode">
                      <Popover
                        content={contentNode}
                        title={null}
                        trigger="click"
                        visible={this.state.recordVisible}
                        onVisibleChange={this.handleVisibleChange}
                        placement="bottom"
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

              <Row type="flex" className={styles.submit}>
                <Button htmlType="submit" className={styles.submitBtn}>
                  提交
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
}))(Form.create()(changeGroup));