import React, { Component } from 'react';
import { Button, Modal, Table, Select, Pagination, Form, Spin, message, Checkbox, Input } from 'antd';
import { SaveChnnlAccnBreakCust } from '$services/newProduct';
import styles from '../index.less';
import lodash from 'lodash';
import { FetchExcStaffList } from '$services/incidentialServices';
const { Option } = Select;

class distribution extends Component {
  state = {
    visible: false,
    ryData: [],
    listData: [],
    administratorData: [],
    distributeNum: 0,
    searchMemberValue: '',
    current: 1,
    loading: false,
  }
  queryStaffPracticeInfo = () => {
    this.setState({
      loading: true,
    });
    FetchExcStaffList({
      cxlx: "2",
      zt: "0",
      cxbs: this.state.searchMemberValue,
      paging: 1,
      sort: '',
      total: -1,
      pageSize: 20,
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
  handlePageChange = (current) => {
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
      lodash.debounce(this.queryStaffPracticeInfo, 300)();
    });

  }
  handleOnFocus = () => {
    this.setState({
      searchMemberValue: '',
      current: 1,
    }, () => {
      lodash.debounce(this.queryStaffPracticeInfo, 300)();
    });
  }
  showModal = () => {
    let param = {
      proType: this.props.tableType,
      srcType: this.props.oprType,
      beignDate: this.props.beignDate,
      endDate: this.props.endDate,
      custType: this.props.custType,
      dept: this.props.dept,
      chnlId: this.props.chnlId,
      grpId: this.props.grpId,
      staff: this.props.staff,
      isAll: this.props.isAll,
      accnId: this.props.accnId,
    };
    SaveChnnlAccnBreakCust(param).then(res => {
      if (res.code > 0) {
        this.setState({
          visible: true,
          ryData: [],
          listData: [],
          distributeNum: 0,
        });
      }
    }).catch(error => {
      Modal.warn({ content: !error.success ? error.message : error.note });
    });
  };
  getColumn = () => [
    {
      title: 'OA员工账号',
      dataIndex: 'oa',
      width: '285px',
      align: 'center',
    },
    {
      title: '员工姓名',
      dataIndex: 'name',
      width: '285px',
      align: 'center',
    },
    {
      title: '分配客户数',
      dataIndex: 'customerNum',
      editable: true,
      width: '285px',
      align: 'center',
      render: (text, record, index) => (
        <Form.Item label='' className={styles.formItem} colon={false}>
          {this.props.form.getFieldDecorator(`zx${record.oa}`)(
            <Input
              placeholder="分配客户数"
              autoComplete='off'
              onBlur={() => this.checkTableInput(`zx${record.oa}`)}
              type='number'
              min={1}
            />,
          )}
        </Form.Item>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (text, record, index) =>
        this.state.ryData.length >= 1 ? (
          <div onClick={() => {
            let ryData = this.state.ryData; ryData.splice(index, 1);
            this.setState({ ryData });
          }}>
            <a className='m-darkgray'>删除</a><i className="iconfont icon-shanchu" style={{ fontSize: '15px', cursor: 'pointer' }} />
          </div>
        ) : null,

    },
  ];
  getAvargeTask = (num, people) => {
    if (this.state.ryData.length < 1) {
      message.warn('请先选择执行人');
      return;
    }
    let firstNum = Math.floor(num / people);
    let restNum = num - firstNum * people;
    let arr = new Array(people).fill(firstNum).map((val, index) => {
      if (index < restNum) {
        return val + 1;
      } else {
        return val;
      }
    });
    let list = this.state.ryData.map(item => `zx${item.oa}`);
    list.forEach((item, index) => {
      this.props.form.setFieldsValue({ [item]: arr[index] });
    });
    this.setState({
      distributeNum: this.props.customerTotal,
    });
  }
  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  onChange = (checkedList) => {
    this.setState({
      listData: checkedList,
    });
  };
  checkTableInput = (index) => {
    let value = this.props.form.getFieldValue(index);
    if (value.length) {
      value = Math.round(value);
      this.props.form.setFieldsValue({ [index]: value });
      let list = this.state.ryData.map(item => `zx${item.oa}`);
      let totalValue = this.props.form.getFieldsValue(list);
      let distributeNum = 0;
      Object.values(totalValue).forEach(item => {
        if (item) {
          distributeNum += item * 1;
        }
      });
      if (distributeNum > this.props.customerTotal) {
        message.warn('已超过能分配的客户数');
        this.props.form.setFieldsValue({ [index]: undefined });
      } else {
        this.setState({
          distributeNum,
        });
      }
    }
  }
  submit = () => {
    if (this.state.ryData.length < 1) {
      message.warn('请先添加执行人');
    } else if (this.props.customerTotal < this.state.ryData.length) {
      message.warn('选中员工数不能大于客户总数，请检查重新输入');
    } else {
      let list = this.state.ryData.map(item => `zx${item.oa}`);
      let totalValue = this.props.form.getFieldsValue(list);
      let ryId = this.state.ryData.map(item => item.id);
      let orgId = this.state.ryData.map(item => item.orgid);
      let accnInfo = Object.values(totalValue).map((item, index) => ({ user: ryId[index], num: item + '', orgid: orgId[index] }));
      accnInfo = accnInfo.filter(item => item.num * 1 > 0);
      let param = {
        proType: this.props.tableType,
        srcType: this.props.oprType,
        beignDate: this.props.beignDate,
        endDate: this.props.endDate,
        custType: this.props.custType,
        dept: this.props.dept,
        chnlId: this.props.chnlId,
        grpId: this.props.grpId,
        staff: this.props.staff,
        isAll: this.props.isAll,
        accnId: this.props.accnId,
        accnInfo,
      };
      SaveChnnlAccnBreakCust(param).then(res => {
        if (res.code > 0) {
          message.info('操作成功');
          this.setState({
            visible: false,
          });
          this.props.fetchData();
          this.props.resetTable();
        }
      }).catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
    }

  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  render() {
    const { btnStatus, customerTotal, selectAll, selectedRowKeys } = this.props;
    const { administratorData, listData, distributeNum } = this.state;
    const PaginationProps = {
      hideOnSinglePage: true,
      showQuickJumper: true,
      current: this.state.current,
      onChange: this.handlePageChange,
      total: this.state.total,
    };
    return (
      <div>
        <Button onClick={this.showModal} disabled={btnStatus ? false : true} className={`${styles.bannedBtn} ${btnStatus ? styles.activeBtn : styles.deactiveBtn}`} >{this.props.oprType === 5 ? '分配' : '转办'}{selectedRowKeys.length > 0 || selectAll ? `(${customerTotal})` : ''}</Button>
        <Modal
          maskClosable={false}
          width='1000px'
          title="分配客户"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          className={styles.mulSelect}
          destroyOnClose={true}
          footer={<div style={{ color: '#1A2243', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ marginLeft: 6 }}>
              <span style={{ marginRight: 20 }}>客户总数 {customerTotal}</span>
              <span style={{ marginRight: 20 }}>已分配 {distributeNum}</span>
              <span style={{ marginRight: 20 }}>未分配 <span style={{ color: 'rgb(255, 100, 33)' }}>{customerTotal - distributeNum}</span></span>
            </div>
            <div style={{ marginRight: 8 }}>
              <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c mr20 fs14' style={{ height: 35, border: 'none' }} onClick={() => this.getAvargeTask(customerTotal, this.state.ryData.length)}>平均分配</Button>
              <Button onClick={this.submit} className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14' style={{ height: 35, color: '#fff', background: '#244FFF' }}>下发</Button>
            </div>
          </div>}
        >
          <Form.Item label='执行人' style={{ display: 'flex' }} colon={false}>
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              <Select
                placeholder='请选择执行人'
                onSearch={this.searchAdmin}
                showArrow={listData.length === 0}
                allowClear={true}
                mode='multiple'
                defaultActiveFirstOption={false}
                maxTagCount={3}
                maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)
                }
                maxTagTextLength={6}
                menuItemSelectedIcon={e => {
                  return administratorData.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={listData.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
                }}
                onChange={(e) => this.onChange(e)}
                value={listData}
                onFocus={this.handleOnFocus}
                dropdownRender={menu => (
                  <div className='m-bss-select-checkbox'>
                    <Spin spinning={this.state.loading}>
                      <div className='m-bss-select-dropdown' >{menu}</div>
                    </Spin>
                    <div style={{ marginTop: '3px', marginBottom: '3px', textAlign: 'right' }}>
                      <Pagination {...PaginationProps} simple />
                    </div>
                  </div>
                )}
              // open
              >
                {administratorData.map(item => <Option key={`${item.yhid}/${item.yhxm}`} value={`${item.yhid}/${item.yhxm}/${item.yhbh}/${item.orgid}`} >{`${item.yhxm}(${item.yhbh})`}</Option>)}
              </Select >
              <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14 ml10' style={{ border: 'none', height: '30px', width: '50px' }}
                onClick={() => {
                  this.setState({
                    ryData: this.state.listData.map(item => ({ id: item.split('/')[0], name: item.split('/')[1], oa: item.split('/')[2], orgid: item.split('/')[3] })),
                  });
                }}>
                添加执行人</Button>
            </div>
          </Form.Item>
          <Table
            rowKey='oa'
            className='m-Card-Table'
            bordered
            dataSource={this.state.ryData}
            scroll={{ y: this.state.ryData.length > 8 ? 480 : '' }}
            columns={this.getColumn()}
            pagination={false}
          />
        </Modal>
      </div>
    );
  }
}
export default (Form.create()(distribution));
