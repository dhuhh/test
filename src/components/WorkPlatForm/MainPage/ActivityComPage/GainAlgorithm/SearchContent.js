import React, { Component } from 'react';
import styles from './index.less';
import { Button,DatePicker,Input, message ,TreeSelect , Select, Col } from 'antd';
import moment from 'moment';
import { getQueryDictionary } from '$services/searchProcess';
import { QueryDictionary } from '$services/activityComPage';
import agarrow from '$assets/activityComPage/agarrow.png';
import { QueryChannelAuthorityDepartment } from '$services/newProduct';
import TreeUtils from '$utils/treeUtils';
// import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';

export default class SearchContent extends Component {
  state ={
    allYyb: [],
    departments: [],
    KFSFList: [] ,
    treeDates: [] ,
  }
  componentDidMount(){
    this.getDepartments();
    this.getAllQueryDictionary();
    this.getFfpzQueryDictionary();
  }
  componentDidUpdate(){
    let that = this;
    document.onclick = function (param) {
      if (!param.target) {
        return;
      }
      const { setStateChange } = that.props;
      if (param.target.id !== 'algorithm') {
        setStateChange({ algorithmVisible: false });
      }

    };
  }
  // debounceFetchData = lodash.debounce(this.searchGroupInfo, 300);
  // 获取字典
  getAllQueryDictionary = ()=>{
    let payload = { dictionaryType: "KFSF" }; // 卡方算法
    Promise.all([
      getQueryDictionary(payload),
    ]).then(res=>{
      const [res1] = res;
      const { records: records1 = [] } = res1;
      this.setState({ KFSFList: records1 });
    });
  };

  // 获取字典
  getFfpzQueryDictionary = () =>{
    QueryDictionary({ dictionaryType: "KFFFPZ" }).then(res=>{
      
      let list = res.records;
      console.log(list);
      let comData = [];
      let difData = [];
      let children = [];
      let treeData = [];
      // 分出相同的大类
      for(const t of list){
        if(difData.find(c=>c.flag === t.flag)){
          let obj = {};
          let childrenObj = {};
          childrenObj.title = t.name;
          childrenObj.value = `${t.id}|${t.flag}`;
          childrenObj.id = t.flag;
          children.push(childrenObj);
          obj.title = t.code;
          obj.value = t.flag;
          obj.children = children;
          comData.push(obj);
          continue;
        }
        difData.push(t);
      }
      // 组装不相同的大类的chlidren
      for(var i = 0,length = difData.length; i < length; i++){
        let objNot = {};
        let childrenObj = {};
        let children = [];
        objNot.title = difData[i].code;
        objNot.value = difData[i].flag;
        childrenObj.title = difData[i].name;
        childrenObj.value = `${difData[i].id}|${difData[i].flag}`;
        childrenObj.id = difData[i].flag;
        children.push(childrenObj);
        objNot.children = children;
        treeData.push(objNot);
      }

      // console.log(difData);
      // 去重相同的大类
      let newComData = [...new Set(comData.map(t=>JSON.stringify(t)))].map(s=>JSON.parse(s));

      // 去重大类下的children
      let comDataChildren = newComData.map(item=>item.children.filter(d=>item.value === d.id));

      treeData.map((t,i)=>{
        comDataChildren.map((m,n)=>{
          if(t.value === m[0].id ){
            treeData[i].children.push(...comDataChildren[n]);
          }
        });
      });
      console.log(treeData);
      this.setState({ treeData });
    });
  };

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
  maxTagPlaceholder = (value) => {
    const num = 1 + value.length;
    return <span style={{ color: '#FF6E30 ' }}>...等{num}项</span>;
  }
  // 格式化treeSelectValue
  formatValue = (dept) => {
    const { allYyb = [] } = this.state;
    return dept.map(val => ({ value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
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
  // 选中营业部变化
  handleYybChange = (value, label, extra) => {
    let { dept } = this.props;
    if (value.length) {
      const array = [];
      array.push(extra.triggerValue);
      this.getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (dept.indexOf(item) === -1) dept.push(item);
        });
      } else {
        array.forEach(item => {
          if (dept.indexOf(item) > -1) dept.splice(dept.indexOf(item), 1);
        });
      }
    } else {
      dept = [];
    }
    this.props.setStateChange({ deptSearch: this.props.deptSearch, dept });
  }

  handlePayChange = (value, label, extra) => {

    this.props.setStateChange({ payVar: value });
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
  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.props.setStateChange({
      deptSearch: value,
    });
  }

  render() {
    const { departments , KFSFList , treeData } = this.state;
    const {
      algorithm,
      dateNmu,
      custName,
      capNmu,
      dept,
      // deptSearch,
      payVar,
      setStateChange,
      reset,
      queryData,
      algorithmVisible,
    } = this.props;

    return (
      <div className={styles.searchBox}>
        <Col xs={9} sm={12} md={9} lg={12} xl={8} xxl={6} >
          <div className={styles.searchItem}>
            <span className={styles.label}>客户姓名</span>
            <div style={{ padding: 0 ,border: 0 }}>
              <Input
                className={styles.rangeInput} 
                value={custName} 
                placeholder="请输入客户姓名、客户号"
                onChange={(custName)=>{setStateChange({ custName: custName.target.value });}} >
              </Input>
            </div>
          </div>
        </Col>

        <Col xs={9} sm={12} md={9} lg={12} xl={8} xxl={6} >
          <div className={styles.searchItem}>
            <span className={styles.label}>营业部</span>
            <TreeSelect
              // showSearch
              className={styles.treeSelect}
              value={this.formatValue(dept)}
              treeData={departments}
              // dropdownMatchSelectWidth={false}
              dropdownClassName='m-bss-treeSelect'
              style={{ marginLeft: 8 }}
              dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
              filterTreeNode={this.filterTreeNode}
              placeholder="请选择营业部"
              allowClear
              multiple
              // searchValue={deptSearch}
              // autoClearSearchValue={false}
              treeDefaultExpandAll
              maxTagCount={1}
              maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
              maxTagTextLength={7}
              treeCheckable={true}
              onChange={this.handleYybChange}
              onSearch={this.handleYybSearch}
              treeCheckStrictly={true}
              // showCheckedStrategy={TreeSelect.SHOW_ALL}
            />
          </div>
        </Col>

        <Col xs={9} sm={12} md={9} lg={12} xl={8} xxl={6} >
          <div className={styles.searchItem}>
            <span className={styles.label}>付费品种</span>
            <TreeSelect
              // showSearch
              className={styles.treeSelect}
              value={payVar}
              treeData={treeData ? treeData : []}
              dropdownClassName='m-bss-treeSelect'
              style={{ marginLeft: 8 }}
              dropdownStyle={{ maxHeight: 270, overflowY: 'auto' }}
              filterTreeNode={this.filterTreeNode}
              placeholder="请选择付费品种"
              showArrow= {true}
              // suffixIcon={<img src={agarrow} alt=''/>}
              allowClear
              multiple
              autoClearSearchValue
              // treeDefaultExpandAll
              maxTagCount={1}
              maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
              maxTagTextLength={7}
              treeCheckable={true}
              onChange={this.handlePayChange}
              // treeCheckStrictly={true}
              // showCheckedStrategy
            >
            </TreeSelect>
          </div>
        </Col>
        <Col xs={9} sm={12} md={9} lg={12} xl={8} xxl={6} >
          <div className={styles.searchItem}>
            <span className={styles.label}>资金账号</span>
            <div style={{ padding: 0 ,border: 0 }} >
              <Input 
                className={styles.rangeInput} 
                value={ capNmu } 
                placeholder="请输入资金账号"
                onChange={(capNmu)=>{setStateChange({ capNmu: capNmu.target.value });}}>
              </Input>
            </div>
          </div>
        </Col>
        <Col xs={9} sm={12} md={9} lg={12} xl={8} xxl={6} >
          <div className={styles.searchItem}>
            <span className={styles.label} >日期</span>
            <DatePicker.RangePicker
              allowClear={true}
              value={dateNmu}
              className={styles.rangePicker}
              dropdownClassName={`${styles.calendar} m-bss-range-picker`}
              style={{ width: '250px' }}
              placeholder={['请选择', '请选择']}
              format="YYYY-MM-DD"
              separator='至'
              disabledDate={(current) => current && current > moment().endOf('day')}
              onChange={dateNmu => setStateChange({ dateNmu })}
            />
          </div>
        </Col>
        <Col xs={9} sm={12} md={9} lg={12} xl={8} xxl={6} >
          <div className={styles.searchItem}>
            <span className={styles.label}>算法</span>
            <div onClick={e => { e.stopPropagation(); setStateChange({ algorithmVisible: true }); }} style={{ padding: 0 ,border: 0 }}>
              <Select 
                open={algorithmVisible}
                className={styles.rangeSelect}
                suffixIcon={<img className={ algorithmVisible ? styles.tabelHasArrow : '' } src={agarrow} alt=''/>}
                value={algorithm}
                // style={{ width: 250 , color: '#1A2243' }} 
                onChange={(algorithm,t)=>{setStateChange({ algorithm , algorithmLabel: t.props.title });}}>
                {
                  KFSFList.map( (item ) => {
                    return <Select.Option key={item.id} value={item.id} title={item.name}>{item.name}</Select.Option>;
                  }) 
                }
              </Select>
            </div>
          </div>
        </Col>


        <div style={{ margin: '0px 36px 16px 10px', display: 'flex', alignItems: 'center' }}>
          <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginRight: 16 ,borderRadius: 2 }} className='m-btn-radius ax-btn-small' type="button" onClick={reset} >重置</Button>
          <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }} className='m-btn-radius ax-btn-small m-btn-blue' type="button" onClick={queryData}>查询</Button>
        </div>
      </div>
    );
  }
}
