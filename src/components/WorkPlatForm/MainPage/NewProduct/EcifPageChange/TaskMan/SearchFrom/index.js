import { Form ,Row ,Col,Select ,Button,DatePicker ,TreeSelect , message, Input , Checkbox ,Icon } from 'antd';
import React,{ useState ,useEffect }from 'react';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import { getQueryDictionary } from '$services/searchProcess';
import lodash from 'lodash';
import TreeUtils from '$utils/treeUtils';
import ecifSearch from '../../../../../../../assets/ecifSearch.png';
import styles from '../index.less';
import moment from 'moment';
const { RangePicker } = DatePicker;

export default Form.create()(function SearchFrom(props) {
  const { form: { getFieldDecorator ,resetFields , setFieldsValue } , rosterStatus, setDdztData, setDisorderly, setCustField,importance, setImportance, setCustCode, department, setDepartment, setDisDate, setTreat,peopleData, setTreaPeople ,currentPeop, setCurrentPeop,setSearchPeop ,getData ,setSelectedRowKeys,setSelectedRows, setRun , setAllData , handlePageChange , pageSize } = props;
  const [expand , setExpand] = useState(true);
  const [searchValue,setSearchValue] = useState(''); //营业部搜索
  const [departments,setDepartments] = useState([]); //营业部树形数据
  const [mdztDataList,setDdztDataList] = useState([]);// 名单状态字典
  const [gfqxDataList,setGfqxDataList] = useState([]);// 客户不规范情形字典
  const [allYyb ,setAllYyb] = useState([]);
  const importanceData = [
    { key: '', value: '全部' },
    { key: 'A', value: '高' },
    { key: 'B', value: '中' },
    { key: 'C', value: '低' },
  ];

  // 获取管辖营业部的数据
  const getDepartments = () => {
    fetchUserAuthorityDepartment().then((result) => {
      const { records = [] } = result;
      const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'title', normalizeKeyName: 'value' }, true);
      let departments = [];
      datas.forEach((item) => {
        const { children } = item;
        departments.push(...children);
      });
      setDepartments(departments);
      setAllYyb(records);
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  };

  // 名单状态--MDZT 客户不规范情形--KHBGFQX  字典 
  const getAllQueryDictionary = ()=>{
    Promise.all([
      getQueryDictionary({ dictionaryType: "MDZT" }),
      getQueryDictionary({ dictionaryType: "KHBGFQX" }),
    ]).then(res=>{
      const [res1, res2 ] = res;
      const { records: records1 = [] } = res1;
      setDdztDataList(records1);
      const { records: records2 = [] } = res2;
      setGfqxDataList(records2);
    });
  };

  useEffect(()=>{
    getDepartments();
    getAllQueryDictionary();
  },[]);

  // 获取父节点下的所有子节点key
  const getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        getCheckedKeys(item.props.children, array);
      }
    });
  };
  // 格式化treeSelectValue
  const formatValue = (inDepartment) => {
    inDepartment = department ? department.split(',') : [];
    return inDepartment.map(val => ( { value: val, label: allYyb.find(item => item.yybid === val)?.yybmc }));
  } ;
  
  const maxTagPlaceholder = (value) => {
    const num = 1 + value.length;
    return <span>...等{num}项</span>;
  };
  const filterTreeNode = (inputValue, treeNode) => {
    // 方式一
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
  };
    // 搜索营业部变化
  const handleYybSearch = (value) => {
    setSearchValue(value);
  };

  // 选中营业部变化
  const handleYybChange = (value, label, extra) => {
    let inDepartment = [];
    if (value.length) {
      inDepartment = department ? department.split(',') : [];
      const array = [];
      array.push(extra.triggerValue);
      getCheckedKeys(extra.triggerNode.props.children, array);
      if (extra.checked) {
        array.forEach(item => {
          if (inDepartment.indexOf(item) === -1) inDepartment.push(item);
        });
      } else {
        array.forEach(item => {
          if (inDepartment.indexOf(item) > -1) inDepartment.splice(inDepartment.indexOf(item), 1);
        });
      }
    } else {
      inDepartment = [];
    }
    setDepartment(inDepartment.join(','));
    setSearchValue('');
  };
  //选中名单状态
  const handMdztChange = (e)=>{
    const length = e.length;
    const item = e[length - 1];
    if (item === '0') { //如果是全部,则和其他所有关系互斥
      e.splice(0, length - 1);
    }else{
      if (e.indexOf("0") > -1) {
        e.splice(e.indexOf("0"), 1);
      }
    }
    setDdztData(e);
  };
  // 选中不规范情形
  const handGfqxChange = (e)=>{
    setDisorderly(e);
  };
  // 选中重要程度
  const handImpoChange = (e)=>{
    const length = e.length;
    const item = e[length - 1];
    if (item === '') { //如果是全部,则和其他所有关系互斥
      e.splice(0, length - 1);
    }else{
      if (e.indexOf("") > -1) {
        e.splice(e.indexOf(""), 1);
      }
    }
    setImportance(e);
  };
  // 选中分配日期 名单状态改为全部
  const handDisChange = (e)=>{
    if(e.length > 0){
      let time = [];
      time[0] = e[0].format('yyyyMMDD');
      time[1] = e[1].format('yyyyMMDD');
      setFieldsValue( { 'rosterStatus': ['0'] });
      setDdztData(['0']);
      setDisDate(time);
    }else{
      setDisDate(e);
      setFieldsValue( { 'rosterStatus': ['1'] } );
      setDdztData(['1']);
    }
  };
  // 选中执行日期 名单状态改为全部
  const handTreaChange = (e) =>{
    if(e){
      setTreat(e.format('yyyyMMDD'));
      setFieldsValue( { 'rosterStatus': ['0'] });
      setDdztData(['0']);
    }else{
      setTreat('');
      setFieldsValue( { 'rosterStatus': ['1'] } );
      setDdztData(['1']);
    }
  };
  //输入执行人
  const handPeoChange = (e)=>{
    if(e){
      setTreaPeople(e);
    }else{
      setTreaPeople('');
    }
  };

  const debounceHandPeoChange = lodash.debounce(handPeoChange, 300);
  //搜索执行人
  const handSeaChange = (e) =>{
    setSearchPeop(e);
  };

  const debouncehandSeaChange = lodash.debounce(handSeaChange, 300);
  // 执行人滚动加载
  const handPeoScroChange = (e) =>{
    const { target } = e;
    let num = currentPeop;
    if(target.scrollTop + target.offsetHeight > target.scrollHeight - 20){
      num++;
      setCurrentPeop(num);
    }
    if(num > 1){
      if(target.scrollTop === 0){
        num-- ;
        setCurrentPeop(num);
      }
    }
  };
  // 输入客户
  const handCustChange = (e)=>{
    setCustCode(e.target.value);
  };
  //输入客户字段
  const handFieldChange = (e)=>{
    setCustField(e.target.value);
  };
  //重置表单
  const reSetForm = ()=>{
    resetFields();
    setDdztData(['1']);
    setDisorderly('');
    setCustField('');
    setImportance(['']);
    setCustCode('');
    setDepartment('');
    setDisDate([]);
    setTreat('');
    setTreaPeople('');
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setAllData([]);
    handlePageChange(1,10);
    setRun(true);
  };

  const onSeach = ()=>{
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setAllData([]);
    handlePageChange(1,pageSize);
    getData();
  };

  
  return(
    <React.Fragment>
      <Form style={{ margin: '1.5625rem 0 0.3125rem' }} className={`m-form-default ant-advanced-search-form`} >
        <Row>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ height: '50px' }} >
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='名单状态'>
              {
                getFieldDecorator('rosterStatus',{ initialValue: '1' })( 
                  <Select 
                    mode='multiple'
                    multiple
                    onChange={(e)=>{ handMdztChange(e);}}
                    menuItemSelectedIcon={e => {
                      return mdztDataList.length > 0 && e.value !== 'NOT_FOUND' &&
                        (
                          <Checkbox checked={rosterStatus.filter(key => {return key === e.value; }).length > 0} />
                        );
                    }}
                    dropdownRender={menu => (
                      <div className='m-bss-select-checkbox'>
                        <div className='m-bss-select-dropdown'>{menu}</div>
                      </div>
                    )}
                  >
                    {
                      mdztDataList.map( item => {
                        return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>;
                      }) 
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p ${styles.clearIcon}`} label='客户账户不规范情形'>
              {
                getFieldDecorator('disorderlyCode')( 
                  <Select 
                    showSearch
                    allowClear
                    placeholder="下拉选择或者输入关键字"
                    onChange={(e,k)=>{ handGfqxChange(e,k);}} 
                    style={{ maxWidth: '220px' }}
                    filterOption={(input, option) => {
                      return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                  >
                    {
                      gfqxDataList.map( item => {
                        return <Select.Option key={item.id} title={item.name} value={item.id}>{item.name}</Select.Option>;
                      }) 
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='客户字段'>
              {
                getFieldDecorator('custField',{ })( 
                  <Input allowClear placeholder="客户不合规字段" onChange={(e)=>handFieldChange(e)}/>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ display: expand ? 'block' : 'none',height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='重要程度'>
              {
                getFieldDecorator('importance',{ initialValue: [''] })( 
                  <Select 
                    mode='multiple'
                    multiple
                    onChange={(e)=>handImpoChange(e)}
                    menuItemSelectedIcon={e => {
                      return importanceData.length > 0 && e.value !== 'NOT_FOUND' &&
                        (
                          <Checkbox checked={importance.filter(key => {return key === e.value; }).length > 0} />
                        );
                    }}
                    dropdownRender={menu => (
                      <div className='m-bss-select-checkbox'>
                        <div className='m-bss-select-dropdown'>{menu}</div>
                      </div>
                    )}
                  >
                    {
                      importanceData.map( item => {
                        return <Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>;
                      }) 
                    }
                  </Select>
                )
              } 
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ display: expand ? 'block' : 'none',height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='客户'>
              {
                getFieldDecorator('custCode',{ })( 
                  <Input placeholder="客户号/客户名称" allowClear onChange={(e)=>{handCustChange(e)}}/>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ display: expand ? 'block' : 'none',height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='客户营业部'>
              <TreeSelect
                showSearch
                style={{ width: '100%'}}
                value={formatValue(department)}
                treeData={departments}
                dropdownClassName='m-bss-treeSelect'
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                filterTreeNode={(inputValue, treeNode)=>filterTreeNode(inputValue, treeNode)}
                placeholder="营业部"
                allowClear
                multiple
                searchValue={searchValue}
                treeDefaultExpandAll
                maxTagCount={1}
                maxTagPlaceholder={(value) => maxTagPlaceholder(value)}
                maxTagTextLength={7}
                treeCheckable={true}
                onSearch={(value)=> handleYybSearch(value)}
                onChange={(value, label, extra)=> handleYybChange(value, label, extra)}
                treeCheckStrictly={true}
              >
              </TreeSelect>
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ display: expand ? 'block' : 'none',height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='分配日期'>
              {
                getFieldDecorator('disDate', { })(
                  <RangePicker 
                    disabledDate={(current) => current > moment().endOf('day')}
                    onChange={(e)=>handDisChange(e)}
                  />
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ display: expand ? 'block' : 'none' ,height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='执行日期'>
              {
                getFieldDecorator('treaData', { })(
                  <DatePicker
                    disabledDate={(current) => current > moment().endOf('day')}
                    onChange={(e)=>handTreaChange(e)}
                  />
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={6} xxl={5} style={{ display: expand ? 'block' : 'none',height: '50px' }}>
            <Form.Item className={`m-form-item m-form-bss-item-p ${styles.clearIcon}`} label='执行人'>
              {
                getFieldDecorator('people')( 
                  <Select 
                    showSearch
                    allowClear
                    suffixIcon={<img alt="" src={ecifSearch} /> }
                    placeholder="可输入执行人中文姓名搜索"
                    onSearch={debouncehandSeaChange}
                    onChange={debounceHandPeoChange} 
                    onFocus={()=>{setSearchPeop('');}}
                    onBlur={()=>{setSearchPeop('');}}
                    onPopupScroll={(e)=>handPeoScroChange(e)}
                    filterOption={(input, option) => {
                      return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                  >
                    {
                      peopleData.map( (item ,index) => {
                        return <Select.Option key={`${index} + l`} title={item.objName} value={item.objId}>{item.objName}</Select.Option>;
                      }) 
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Row style={{ position: 'absolute', bottom: '16px', right: '-1rem'}}>
            <Button onClick={()=> onSeach()} className='m-btn ant-btn m-btn-blue m-bss-btn mr14' type="button" htmlType="submit">查 询</Button>
            <Button onClick={()=> reSetForm()} className='m-btn ant-btn m-bss-btn' type="button">重 置</Button>
            <span style={{ marginLeft: '22px', textAlign: 'center', cursor: 'pointer' }} onClick={()=>{ setExpand(!expand);}}>
              <span className='m-black fs14'>{expand ? '收起' : '展开'}</span>
              <Icon style={{paddingLeft:'6px'}} type={expand ? 'up' : 'down'} /> 
            </span>
          </Row>
        </Row>
      </Form>
    </React.Fragment>
  );
});
