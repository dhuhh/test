import React, { Component } from 'react';
import { Form, Button, DatePicker, Select, Input, message, TreeSelect, Checkbox } from 'antd';
import { GetBankCodeList, QueryChannelAuthorityDepartment } from '$services/newProduct';
import moment from 'moment';
import TreeUtils from '$utils/treeUtils';
import SearchInput from '../Common/SearchInput';
import SingleSelect from '../Common/SingleSelect';
import GroupSearchInput from '../Common/GroupSearchInput';
import styles from './index.less';

const { RangePicker } = DatePicker;

class SearchContent extends Component {
  state = {
    allYyb: [],
    departments: [],
    bankData: [],
  }
  componentDidMount() {
    this.getDepartments();
    this.getBankCodeList();
  }
  getBankCodeList = () => {
    GetBankCodeList().then(res => {
      this.setState({
        bankData: res.records,
      });
    });
  }
  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYyb = [] } = this.state;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val).yybmc }));
  }
  // 获取管辖营业部的数据
  getDepartments = () => {
    QueryChannelAuthorityDepartment().then((result) => {
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
  render() {
    const {
      groupValue,
      codeType,
      busType,
      channelValue,
      bank,
      scene,
      dateValue,
      status,
      department,
      searchValue,
      channelChange,
      busChange,
      sceneChange,
      bankChange,
      statusChange,
      departmentChange,
      handleYybSearch,
      codeChange,
      dateChange,
      groupChange,
      searchInfo,
      searchByInfo,
      clearInputInfo,
      dictionary,
    } = this.props;
    const businessType = dictionary['CHNL_YW'] || [];
    const statusData = dictionary['CHNL_ZT'] || [];
    // const bankData = dictionary['CHNL_CGYH'] || [];
    const { departments, bankData } = this.state;
    return (
      <div className={styles.form}>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>二维码类型</div>
          <SingleSelect selectChange={codeChange} selectValue={codeType}/>
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>业务</div>
          <Select className={styles.selectHeight} value={busType} defaultActiveFirstOption={false} onChange={busChange} style={{ width: '160px' }}>
            <Select.Option key='0' value=''>全部</Select.Option>
            {businessType.map(item => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)}
          </Select>
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>二维码名称</div>
          <GroupSearchInput groupValue={groupValue} groupChange={groupChange} modalType='4'/>
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>渠道</div>
          <SearchInput channelValue={channelValue} channelChange={channelChange} />
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>场景</div>
          <Input value={scene} onChange={sceneChange} className={styles.scene} placeholder="1-99" min={1} max={99} type='number'></Input>
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>存管银行</div>
          <Select
            placeholder='请选择存管银行'
            className={styles.mulSelect}
            showArrow={bank.length === 0}
            allowClear={true}
            mode='multiple'
            defaultActiveFirstOption={false}
            maxTagCount={3}
            maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)
            }
            maxTagTextLength={7}
            menuItemSelectedIcon={e => {
              return bankData.length > 0 && e.value !== 'NOT_FOUND' && <Checkbox checked={bank.filter(key => { return key === e.value; }).length > 0}></Checkbox>;
            }}
            onChange={(e) => bankChange(e)}
            filterOption={(input, option) => option.props.children.indexOf(input) !== -1}
            value={bank}
            dropdownRender={menu => (
              <div className='m-bss-select-checkbox'>
                <div className='m-bss-select-dropdown' >{menu}</div>
              </div>
            )}
          >
            {bankData.map(item => <Select.Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Select.Option>)}
          </Select >
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>开户营业部</div>
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
            allowClear={true}
            // searchValue={searchValue}
            treeDefaultExpandAll
            treeCheckStrictly={true}
            className={styles.mulSelect}
            dropdownClassName='m-bss-treeSelect'
            value={this.formatValue(department)}
            treeData={departments}
            placeholder="请选择开户营业部"
            onChange={departmentChange}
            onSearch={handleYybSearch}
            filterTreeNode={this.filterTreeNode}
            // dropdownMatchSelectWidth={false}
            multiple
            maxTagCount={3}
            maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
            maxTagTextLength={5}
            treeCheckable={true}
          // showCheckedStrategy={TreeSelect.SHOW_ALL}
          />
          {/* <Select className={styles.selectHeight} value={department} defaultActiveFirstOption={false} onChange={departmentChange} style={{ width: '160px' }}>
            {this.state.allYyb.map(item => <Select.Option key={item.yybid} value={item.yybid}>{item.yybmc}</Select.Option>)}
          </Select> */}
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>创建日期从</div>
          <RangePicker
            value={dateValue}
            className={styles.selectHeight}
            dropdownClassName={`${styles.calendar} m-bss-range-picker`}
            style={{ width: '264px' }}
            placeholder={['开始日期', '结束日期']}
            format="YYYY-MM-DD"
            separator='至'
            disabledDate={(current) => current && current > moment().endOf('day')}
            onChange={dateChange}
          />
        </div>
        <div className={styles.formItem}>
          <div className={styles.formItemLabel}>状态</div>
          <Select className={styles.selectHeight} value={status} defaultActiveFirstOption={false} onChange={statusChange} style={{ width: '160px' }}>
            <Select.Option key='0' value=''>全部</Select.Option>
            {statusData.map(item => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)}
          </Select>
        </div>

        <div className={styles.formItem}>
          <Button style={{ minWidth: 62 }} className='m-btn-radius ax-btn-small' type="button" onClick={clearInputInfo} >重置</Button>
          <Button style={{ minWidth: 62 }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={searchByInfo}>查询</Button>
        </div>
      </div >
    );
  }
}
export default Form.create()(SearchContent);