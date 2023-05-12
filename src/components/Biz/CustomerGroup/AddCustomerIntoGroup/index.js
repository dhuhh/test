/* eslint-disable eqeqeq */
import React from 'react';
import classnames from 'classnames';
import { Row, Col, Collapse, Select, Input, Checkbox, message } from 'antd';
import CreateGroup from './CreateGroup';
import { getCusGroup } from '../../../../services/customerbase/myCusGroup';
import styles from './index.less';

class AddCustomerIntoGroup extends React.Component {
  state = {
    searchValue: '',
    myCusGroup: [],
    departmentGroup: [],
    addGroup: false,
    selectType: 1,
  };

  componentDidMount() {
    const { initSelectType } = this.props;
    this.fetchMyCusGroupData();
    this.handleSelectTypeChange(1);
    if (initSelectType && typeof initSelectType === 'function') {
      initSelectType();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { selectType } = nextProps;
    this.setState({ selectType });
  }
  onGroupNameChange = (e) => {
    const { handleGroupNameChange } = this.props;
    const { value } = e.target;
    if (handleGroupNameChange) {
      handleGroupNameChange(value);
    }
  }
  onGroupSMChange = (e) => {
    const { handleGroupSMChange } = this.props;
    const { value } = e.target;
    if (handleGroupSMChange) {
      handleGroupSMChange(value);
    }
  }
  fetchMyCusGroupData = () => {
    // 获取我的客户群群信息
    getCusGroup({ khqlx: '', paging: 0 }).then((result) => {
      const { records = [] } = result || {};
      const myCusGroup = [];
      const departmentGroup = [];
      if (Array.isArray(records)) {
        records.forEach((item) => {
          const { khqlx = '我的客户群' } = item;
          if (khqlx === '我的客户群') {
            myCusGroup.push(item);
          } else {
            departmentGroup.push(item);
          }
        });
      }
      this.setState({
        myCusGroup,
        departmentGroup,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleSelectTypeChange = (value) => {
    const { setRenderFooter } = this.props;
    if (value === 1) {
      if (setRenderFooter && typeof setRenderFooter === 'function') {
        setRenderFooter(true);
      }
      this.setState({
        addGroup: true,
      });
    } else {
      if (setRenderFooter && typeof setRenderFooter === 'function') {
        setRenderFooter(false);
      }
      this.setState({
        addGroup: false,
      });
    }
    const { onSelectTypeChange } = this.props;
    if (onSelectTypeChange) {
      onSelectTypeChange(value);
    }
  }
  handleSfYyb = (type) => { // 是否营业部客户群选择框
    const { onSfYyb } = this.props;
    if (onSfYyb) {
      onSfYyb(type);
    }
  }
  handleSelectChange = (checkedValues, khqlx) => {
    const { onCheckedValuesChange } = this.props;
    if (onCheckedValuesChange) {
      onCheckedValuesChange(checkedValues, khqlx);
    }
  }
  handleSearch = (value) => {
    this.setState({ searchValue: value });
  }
  sendSetNewGroupDatas = () => {
    let groupDatas = {};
    const { validateFieldsAndScroll } = this.CreateGroup;
    validateFieldsAndScroll((err, values) => {
      groupDatas = values;
    });
    return groupDatas;
  }
  render() {
    const { searchValue, myCusGroup: myCusGroupInstate, addGroup, selectType, departmentGroup: departmentGroupInstate } = this.state;
    const { selectedCount, checkedValues, userBasicInfo, customerQueryType } = this.props;
    const { orgname = '--' } = userBasicInfo || {};
    const myCusGroup = searchValue === '' ? myCusGroupInstate : myCusGroupInstate.filter(item => item.khqmc.includes(searchValue));
    const departmentGroup = searchValue === '' ? departmentGroupInstate : departmentGroupInstate.filter(item => item.khqmc.includes(searchValue));
    return (
      <div className={classnames('m-form-default m-form')}>
        <Row>
          <Col span={24}>
            <div style={{ margin: '1.333rem 0', padding: '0 3rem' }}>
              <span>请选择目标客户群(客户数:{selectedCount})</span>
            </div>
          </Col>
          <Col span={8}>
            <div className="ant-form-item-label" style={{ width: '30%', textAlign: 'right' }}>
              <span>方式&emsp;</span>
            </div>
            <Select style={{ width: '70%', textAlign: 'right' }} value={selectType} onSelect={this.handleSelectTypeChange}>
              <Select.Option value={1}>存为新群</Select.Option>
              {selectedCount > 0 && <Select.Option value={2}>添加到群</Select.Option>}
              {selectedCount > 0 && <Select.Option value={3}>从群中删除</Select.Option>}
              {/* <Select.Option value={3}>覆盖群</Select.Option> */}
            </Select>
          </Col>
          <Col span={8} style={{ display: addGroup ? '' : 'none' }}>
            <div className="ant-form-item-label" style={{ width: '12%', textAlign: 'right' }}>
              <span>存为&nbsp;</span>
            </div>
            <Select style={{ width: '88%', textAlign: 'right' }} defaultValue={customerQueryType == '1' ? 1 : 2} onSelect={this.handleSfYyb}>
              {/* 客户全景中要允许加入到我的群中 */}
              { customerQueryType == '99' && <Select.Option value={1}>我的客户群</Select.Option> }
              {customerQueryType == '1' ? <Select.Option value={1}>我的客户群</Select.Option> : <Select.Option value={2}>{orgname}</Select.Option> }
            </Select>
          </Col>
          <Col span={24} style={{ display: addGroup ? '' : 'none' }}>
            <CreateGroup customerQueryType={customerQueryType} ref={(c) => { this.CreateGroup = c; }} />
          </Col>
          <Col span={addGroup ? 5 : 10} style={{ display: addGroup ? 'none' : '' }}>
            <Input.Search
              className="m-input-search-white"
              onSearch={this.handleSearch}
              style={{ marginTop: '0.266rem' }}
            />
          </Col>
          {/* 客户全景需要展示我的客户群 */}
          {customerQueryType > '3' && (
            <Col span={24} style={{ display: addGroup ? 'none' : '' }}>
              <Collapse className={`m-collapse m-collapse-popup ${styles.collapse}`} defaultActiveKey="1" >
                <Collapse.Panel key="1" header="我的群">
                  <Checkbox.Group className="m-checkbox-group-popup three" style={{ width: '100%' }} onChange={(e) => this.handleSelectChange(e, 1)}>
                    {
                      myCusGroup.map(item => <Checkbox key={item.khqid} value={item.khqid} checked={checkedValues.includes(item.khqid)} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.khqmc}</Checkbox>)
                    }
                  </Checkbox.Group>
                  { myCusGroup.length === 0 && <div style={{ textAlign: 'center' }}>暂无数据</div> }
                </Collapse.Panel>
              </Collapse>
            </Col>
          )}
          {customerQueryType === '1' ? (
            <Col span={24} style={{ display: addGroup ? 'none' : '' }}>
              <Collapse className={`m-collapse m-collapse-popup ${styles.collapse}`} defaultActiveKey="1" >
                <Collapse.Panel key="1" header="我的群">
                  <Checkbox.Group className="m-checkbox-group-popup three" style={{ width: '100%' }} onChange={(e) => this.handleSelectChange(e, 1)}>
                    {
                      myCusGroup.map(item => <Checkbox key={item.khqid} value={item.khqid} checked={checkedValues.includes(item.khqid)} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.khqmc}</Checkbox>)
                    }
                  </Checkbox.Group>
                  { myCusGroup.length === 0 && <div style={{ textAlign: 'center' }}>暂无数据</div> }
                </Collapse.Panel>
              </Collapse>
            </Col>
          ) : (
            <Col span={24} style={{ display: addGroup ? 'none' : '' }}>
              <Collapse className={`m-collapse m-collapse-popup ${styles.collapse}`} defaultActiveKey="1" >
                <Collapse.Panel key="1" header={orgname}>
                  <Checkbox.Group className="m-checkbox-group-popup three" style={{ width: '100%' }} onChange={(e) => this.handleSelectChange(e, 3)}>
                    {
                      departmentGroup.map(item => <Checkbox key={item.khqid} value={item.khqid} checked={checkedValues.includes(item.khqid)} style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.khqmc}</Checkbox>)
                    }
                  </Checkbox.Group>
                  { departmentGroup.length === 0 && <div style={{ textAlign: 'center' }}>暂无数据</div> }
                </Collapse.Panel>
              </Collapse>
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
export default AddCustomerIntoGroup;
