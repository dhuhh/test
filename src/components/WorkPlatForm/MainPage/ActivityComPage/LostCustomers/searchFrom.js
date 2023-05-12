import { Form ,Row ,Col,Button,TreeSelect , message, Input } from 'antd';
import React,{ useState ,useEffect }from 'react';
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import TreeUtils from '$utils/treeUtils';
// import wealthArrow from '$assets/activityComPage/wealth_arrow.png';
import styles from './index.less';

export default Form.create()(function SearchFrom(props) {
  const { setCustCode, department, setDepartment , custCode , setSelectedRowKeys,setSelectedRows,setSelectAll ,getData ,handleTableChange } = props;
  const [searchValue,setSearchValue] = useState(''); //营业部搜索
  const [departments,setDepartments] = useState([]); //营业部树形数据
  const [allYyb ,setAllYyb] = useState([]);


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


  useEffect(()=>{
    getDepartments();
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
    const num = 3 + value.length;
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

  // 输入客户
  const handCustChange = (e)=>{
    setCustCode(e.target.value);
  };

  //重置表单
  const reSetForm = ()=>{
    setCustCode('');
    setDepartment('');
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSelectAll(false);
    handleTableChange(1,10);
  };

  const onSeach = ()=>{
    getData();
  };

  return(
    <React.Fragment>
      <Form style={{ margin: '1.5625rem 0 0.3125rem' }} className={`m-form-default ant-advanced-search-form ${styles.from}`} >
        <Row>
          <Col lg={10} xl={6} xxl={5} style={{width: 336 }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='开户营业部'>
              <TreeSelect
                // showSearch
                style={{ maxWidth: 250 }}
                value={formatValue(department)}
                className={styles.sel}
                treeData={departments}
                dropdownClassName='m-bss-treeSelect'
                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                filterTreeNode={(inputValue, treeNode)=>filterTreeNode(inputValue, treeNode)}
                placeholder="请选择"
                allowClear
                searchValue={searchValue}
                treeDefaultExpandAll
                maxTagCount={3}
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
          <Col lg={10} xl={6} xxl={5} style={{ width: 336 }}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='客户'>
              <Input value={custCode} 
                style={{ height: 32 , maxWidth: 250 }} 
                placeholder="客户号/客户名称" 
                allowClear 
                onChange={(e)=>{handCustChange(e);}} 
              />
            </Form.Item>
          </Col>
          <Col xxl={4} >
            <Button onClick={()=> reSetForm()} type="button" style={{ color: '#61698C' }} className={`${styles.reLostBtn}  ${styles.p}`}>重置</Button>
            <Button onClick={()=> onSeach()} type="button" style={{ color: '#FFFFFF',background: '#244FFF' }} className={`${styles.seaLostBtn} ${styles.p}`} htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
});
