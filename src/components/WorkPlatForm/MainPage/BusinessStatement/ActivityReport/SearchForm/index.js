import React, { Component } from 'react';
import { Button,  Col, Form, Row, Select ,TreeSelect } from 'antd';
import { getActivityPerformance } from '$services/businessStatement';
import styles from '../../index.less';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: '', //营业部
      dimension: '4' ,//维度
      searchValue: '',
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);
    }
  }
  componentDidMount(){
    this.fetchData();
  }
  // 列表查询
  fetchData= (p)=>{
    const { parentThis } = this.props;
    parentThis.setState({
      loading: true,
    });
    let { department,dimension  } = this.state;
    let current = p ? p.current : parentThis.state.current;
    let pageSize = p ? p.pageSize : parentThis.state.pageSize;
    const payload = { 
      current ,
      department,
      dimension, // 汇总维度
      pageLength: 0,
      pageSize,
      paging: 1, // 是否分页
      sort: "", // 排序
      total: -1,
      totalRows: 0 };
    getActivityPerformance(payload).then(res=>{
      const { total = 0, records = [] } = res;
      records.forEach((item,index)=>{
        item.no = (((current - 1) * pageSize) + index + 1) + '';
      });
      parentThis.setState({
        dataSource: records,
        total,
        loading: false,
        payload,
      });
    });
  }
  // 表单提交
  handleSubmit = () => {
    this.fetchData();
  }
  // 选中维度维度
  handleChange = (e) =>{
    const { parentThis } = this.props;
    this.setState({
      dimension: e,
    });
    if(parentThis && e === '1'){
      parentThis.setState({ departTabel: '单点机构' });
    }
    if(parentThis && e === '4'){
      parentThis.setState({ departTabel: '单点营业部' });
    }

  }
  // 表单重置
  resetSearchForm = () => {
    const { parentThis } = this.props;
    if(parentThis){
      parentThis.setState({ departTabel: '单点营业部' });
    }
    this.setState({
      department: '',
      dimension: '4',
      current: 1, 
      searchValue: '',
    },()=>{this.fetchData();});
  }
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
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
    this.setState({
      department: department.join(','),
    });
    this.setState({ searchValue: this.state.searchValue });
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
    let { department,dimension ,searchValue } = this.state;
    return (
      <Form style={{ margin: '1.5rem 0 1rem' }} className={`${styles.label} m-form-default ant-advanced-search-form`}>
        <Row>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={5}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='所属营业部'>
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
                  maxTagCount={3}
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
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={5}>
            <Form.Item className={`${styles.border} m-form-item m-form-bss-item-p`} label='汇总维度'>
              <Select defaultActiveFirstOption={false} value={dimension} onChange={(e) => this.handleChange(e)}>
                <Select.Option key='1' value='1'>按分支机构</Select.Option>
                <Select.Option key='4' value='4'>按营业部</Select.Option>
              </Select>
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
