import React, { Component } from 'react';
import { Button,  Col, Form, Row, Select ,TreeSelect ,DatePicker,Checkbox,message } from 'antd';
import { getProcedureList,getQueryDictionary ,getBusinessNameList } from '$services/searchProcess';
import SearchInput from './SearchInput';
import moment from 'moment';
import styles from '../index.less';
const { RangePicker } = DatePicker;
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: '', //营业部
      searchValue: '', //营业部搜索
      relationType: ['0'],//关系类型
      businessId: false, // 关系类型是否显示图标
      status: '',
      businessList: [], // 业务名称--option
      YWLC_GXLXList: [], // 关系类型--option
      KHGSList: [], // 客户范围--option
      YWLC_ZTList: [] ,//状态--option
      custCode: '',
      businessRowWidth: 'auto',
      relationRowWidth: 'auto',
      departmentRowWith: 'auto',
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }
  }
  componentDidMount(){
    this.fetchData();
    this.getAllQueryDictionary();
    
  }
  // 关系类型--YWLC_GXLX 客户范围--KHGS 处理状态--YWLC_ZT  业务名称   options 字典 
  getAllQueryDictionary= ()=>{
    let payload = [{ dictionaryType: "YWLC_GXLX",List: 'YWLC_GXLXList' },{ dictionaryType: "KHGS" ,  List: 'KHGSList' },{ dictionaryType: "YWLC_ZT",List: 'YWLC_ZTList' }];
    for(let i = 0;i < payload.length;i++){
      getQueryDictionary(payload[i]).then(res=>{
        const { records = [] } = res;
        let allOption = { name: "全部", id: "0" };
        if(payload[i].List === 'YWLC_GXLXList'){
          records.unshift(allOption);
        }
        this.setState({ [payload[i].List]: records });
      });
    }
    getBusinessNameList().then(res=>{
      const { records = [] } = res;
      let allOption = { ywmc: "全部", ywdm: "0" };
      records.unshift(allOption);
      this.setState({ businessList: records });
    });
      
  }

  // 列表查询
  fetchData= (p)=>{
    const { parentThis } = this.props;
    const { custCode } = this.state;
    if(this.props.form.getFieldsValue().time.length < 1){
      message.error('请选择查询日期！！',4);
      return false;
    }
    parentThis.setState({
      loading: true,
    });

    let { department,relationType,status  } = this.state;
    let current = p ? p.current : parentThis.state.current;
    let pageSize = p ? p.pageSize : parentThis.state.pageSize;
    // 过滤 ‘全部’ 选项置为空字符串
    let ojbkey = this.props.form.getFieldsValue().businessId;
    let businessIdS;
    // 点击清空按钮没有选项--值为空字符串 
    if(ojbkey){
      businessIdS = ojbkey.key === '0' ? '' : this.props.form.getFieldsValue().businessId.key;
    }else{
      businessIdS = '';
    }

    let relationTypeS = relationType.join(',') === '0' ? '' : relationType.join(',');
    const payload = { 
      businessId: businessIdS,//业务名称
      custCode, //客户搜索
      custLimits: this.props.form.getFieldsValue().custLimits, //客户范围
      custOrgId: department, //所属机构
      endDate: this.props.form.getFieldsValue().time[1].format('yyyyMMDD'),
      pageCount: pageSize, //每页行数
      pageNumber: current, // 页数
      relationType: relationTypeS, //关系类型
      startDate: this.props.form.getFieldsValue().time[0].format('yyyyMMDD'),
      status, //处理状态
    };
    getProcedureList(payload).then(res=>{
      const { total = 0, records = [] ,note } = res;
      if(note.includes('成功')){
        records.forEach((item,index)=>{
          item.no = (((current - 1) * pageSize) + index + 1) + '';
        });
      }else{
        // 异常提示
        message.error(note,4);
      }
      parentThis.setState({
        dataSource: records,
        total,
        loading: false,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  //业务选择
  businessTypeChange=(e) =>{
    if(e){
      let textWidth = 100 + (e.label.length * 18) + 'px' ;
      this.setState({ businessId: true,businessRowWidth: textWidth });
    }else{
      this.setState({ businessId: false });
    }
  }
  // 关系类型
  handleRelationTypeChange=(e)=>{
    const length = e.length;
    const item = e[length - 1];
    if (item === '0') {    //如果是全部,则和其他所有关系互斥
      e.splice(0, length - 1);
    }else{
      if (e.indexOf("0") > -1) {
        e.splice(e.indexOf("0"), 1);
      }
    }
    let textWidth;
    if(e.length > 2){
      textWidth = '540px';
    }else{
      textWidth = 'auto';
    }
    this.setState({ relationType: e ,relationRowWidth: textWidth });
  }
  
  // 表单提交
  handleSubmit = () => {
    this.props.parentThis.setState({ current: 1,pageSize: 10 },()=>{this.fetchData();});
  }

  // 表单重置
  resetSearchForm = () => {
    // 重置状态
    this.props.searchTable.searchTabelThis.setState({ checkedGroup: [] });
    // 重置客户
    this.searchInputThis.setState({ seleValue: '' });
    this.props.form.resetFields();
    this.props.parentThis.setState({ current: 1,pageSize: 10 });
    this.setState({ relationType: ['0'] ,department: '',searchValue: '',status: '',custCode: '',businessRowWidth: 'auto',relationRowWidth: 'auto',departmentRowWith: 'auto'  },()=>{this.fetchData();});
  }
  maxTagPlaceholder = (value) => {
    const num = 2 + value.length;
    return <span>...等{num}项</span>;
  }
  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValue: value,
    });
  }

  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
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
    let textWidth;
    if(department.length > 2){
      textWidth = '580px';
    }else{
      textWidth = 'auto';
    }
    this.setState({ department: department.join(','), searchValue: '',departmentRowWith: textWidth });
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
  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYyb = [] } = this.props;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val).yybmc }));
  }

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYyb = [] } = this.props;
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
  render() {

    const { departments } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { department,searchValue,relationType,businessId ,YWLC_GXLXList,KHGSList,businessList ,businessRowWidth,relationRowWidth,departmentRowWith } = this.state;

    return (
      <Form style={{ margin: '1.5625rem 0 0.3125rem' }} className={`${styles.label} m-form-default ant-advanced-search-form`}>
        <Row >
          <Col style={{ minWidth: '360px',height: '46px' }}  xs={9} sm={9} md={9} lg={9} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item m-form-bss-item-p`} label='客户'>
              <SearchInput parentThis={this} getInstence={(searchInputThis) => { this.searchInputThis = searchInputThis; }}/> 
            </Form.Item>
          </Col>
          <Col style={{ width: businessRowWidth,minWidth: '320px',height: '46px' }} xs={9} sm={9} md={9} lg={9} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} ${styles.clearIcon} m-form-item m-form-bss-item-p`} label='业务名称'>
              {
                getFieldDecorator('businessId',{ initialValue: { key: '0',label: '0' } })(
                  <Select 
                    showSearch 
                    optionFilterProp="children"
                    allowClear={businessId}
                    showArrow={!businessId}
                    labelInValue
                    onChange={e=>{this.businessTypeChange(e);}}
                    defaultActiveFirstOption={false}>
                    {
                      businessList.map((item)=>(
                        <Select.Option key={`${item.ywdm}+i`} title={item.ywmc}  value={item.ywdm}>{item.ywmc}</Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col style={{ width: relationRowWidth,minWidth: '320px',height: '46px' }}  xs={9} sm={9} md={9} lg={9} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item m-form-bss-item-p`} label='关系类型'>
              <Select
                value={relationType}
                showArrow={relationType.length === 0}
                allowClear={true}
                mode='multiple'
                multiple
                defaultActiveFirstOption={false}
                menuItemSelectedIcon={e => {
                  return YWLC_GXLXList.length > 0 && e.value !== 'NOT_FOUND' &&
                        (
                          <Checkbox checked={relationType.filter(key => { return key === e.value; }).length > 0} />
                        );
                }}
                dropdownRender={menu => (
                  <div className='m-bss-select-checkbox'>
                    <div className='m-bss-select-dropdown'>{menu}</div>
                  </div>
                )}
                onChange={(e) =>{this.handleRelationTypeChange(e);}}>
                {
                  YWLC_GXLXList.map((item)=>(
                    <Select.Option key={`${item.id}+s`} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ minWidth: '280px',height: '46px' }} xs={9} sm={9} md={9} lg={9} xl={6} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item m-form-bss-item-p`} label='客户范围'>
              {
                getFieldDecorator('custLimits',{ initialValue: '1' })(
                  <Select defaultActiveFirstOption={false} >
                    {
                      KHGSList.map((item)=>(
                        <Select.Option key={`${item.id}+y`} value={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col style={{ width: departmentRowWith,minWidth: '360px',height: '46px' }} xs={9} sm={9} md={9} lg={9} xl={6} xxl={6}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='客户所属机构'>
              {
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  value={this.formatValue(department)}
                  treeData={departments}
                  dropdownClassName='m-bss-treeSelect'
                  dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                  filterTreeNode={this.filterTreeNode}
                  placeholder="营业部"
                  allowClear
                  multiple
                  searchValue={searchValue}
                  treeDefaultExpandAll
                  maxTagCount={2}
                  maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                  maxTagTextLength={7}
                  treeCheckable={true}
                  onSearch={this.handleYybSearch}
                  onChange={this.handleYybChange}
                  treeCheckStrictly={true}
                >
                </TreeSelect>
              }
            </Form.Item>
          </Col>
          <Col style={{ minWidth: '360px',height: '46px' }} xs={9} sm={9} md={9} lg={9} xl={6} xxl={5}>
            <Form.Item className={`${styles.pickDate} m-form-item m-form-bss-item-p`} label='查询日期'>
              {
                getFieldDecorator('time',{ initialValue: [moment().startOf('day').subtract(7,'d'),moment().endOf('day')] })(
                  <RangePicker
                    dropdownClassName='m-bss-range-picker-p'
                    separator='至'
                    disabledDate={(current) => current > moment().endOf('day')}
                  /> 
                )
              }
            </Form.Item>
          </Col>
          <Form.Item style={{ float: 'left' }} className='m-form-bss-item-p'>
            <Button  className="m-btn-radius ax-btn-small" onClick={() => { this.resetSearchForm(); }}>重置</Button>
            <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleSubmit}>查询</Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
