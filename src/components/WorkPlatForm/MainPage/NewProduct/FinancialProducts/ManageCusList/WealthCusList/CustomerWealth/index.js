import React , {useEffect, useState,useRef} from 'react'
import EselectCheck from "../components/EselectCheck";
// import EselectCheck from "../components/EselectCheckAll";
import EpaginationBig from "../components/EpaginationBig";
import TableBn from "../components/TableBn";
import { CustProductDetail } from '$services/newProduct';
import Ebutton32 from "../components/Ebutton32";
import Einput from "../components/Einput";
import Etable from "../components/Etable";
import { Divider, message } from 'antd';
import styles from '../../index.less'

export default function CustomerWealth(props) {
  const [selectValueSing, setSelectValueS] = useState('1');
  const [customerRange,setCustomerRange] = useState([])
  const [selectValueMul, setSelectValueM] = useState([]);
  const [cusType,setCusType] = useState([]); 
  const [cusKeyword,setCusKeyword] = useState('')
  const [cusId,setCusId] = useState('')
  const [productKeyword,setProductKeyword] = useState('')
  const [productId,setProductId] = useState('')
  const [page,setPage] = useState('10')
  const [pageNo,setPageNo] = useState(1)
  const [dataList,setDataList] = useState([])
  const [total,setTotal] = useState('0')
  const [loading,setLoading] = useState(false)
  const [exportRef,setExportRef] = useState(undefined)
  const { authorities = {}, teamPmsn = '0', scene = '1' } = props;
  const { productPanorama: productPanoramaAuth = [] } = authorities;
  const cusRef = useRef()
  const proRef = useRef()
  const param = {
    "current": 1,
    "cusId": cusId,  //--客户id
    "cusKeyword": cusKeyword, //--客户关键字
    "cusRng": selectValueSing,  //--客户范围，1|我的；2|团队；3|营业部  
    "cusType": selectValueMul.join(','), //--客户类型，12｜销售关系；11｜无效户激活；1｜服务关系；10｜开发关系 ;0|全部客户
    "pageLength": 0,
    "pageNo": 1,
    "pageSize": 10,
    "paging": 1,
    "productId": productId,  //--产品id
    "productKeyword": productKeyword,  //--产品关键字
    "sort": "",
    "total": -1,
    "totalRows": 0
  }

  useEffect(() => {
    let range = [{value:'1',name:'个人'}]
    if(teamPmsn === '1'){
      range.push({value:'2',name:'团队'})
    }
    if(productPanoramaAuth.includes('yyb')){
      range.push({value:'3',name:'营业部'})
    }
    setCustomerRange(range)
  }, [teamPmsn])

  useEffect(() => {
    scene === '3' ? setCusType([{ value: '12', name: '销售关系' }, { value: '10', name: '开发关系' }, { value: '1', name: '服务关系' }, { value: '11', name: '无效户激活' }, { value: '0', name: '全部客户' }])
    : setCusType([{ value: '12', name: '销售关系' }, { value: '10', name: '开发关系' }, { value: '1', name: '服务关系' }, { value: '11', name: '无效户激活' }])
    scene === '3' ? setSelectValueM(['0']) : setSelectValueM(['12'])
  },[scene])

  console.log(props,'props',productPanoramaAuth,teamPmsn);
  const inputChanges = e => {
    console.log("父组件", e);
    const oldData = [{ value: '12', name: '销售关系' }, { value: '10', name: '开发关系' }, { value: '1', name: '服务关系' }, { value: '11', name: '无效户激活' }];
    const newData = [{ value: '12', name: '销售关系' }, { value: '10', name: '开发关系' }, { value: '1', name: '服务关系' }, { value: '11', name: '无效户激活' }, { value: '0', name: '全部客户' }];
    if (e === '3') {
      setSelectValueM(['0']);
      setCusType(newData)
    } else {
      setSelectValueM(['12']);
      setCusType(oldData)
    }
    setSelectValueS(e);
  };

  const inputChangeM = e => {
    console.log("父组件", e);
    if(e[e.length-1] === '0'){
      setSelectValueM(['0'])
    }else if(e[e.length-1] === '12'){
      setSelectValueM(['12'])
    }else{
      setSelectValueM(e.filter(i=>i!=='0'&&i!=='12'));
    }
  };

  const getRef = (ref)=>{
    setExportRef(ref)
  }

  const inputChange = e => {
    console.log("父组件", e);
    if(e.type === 1){//客户
      e.cusId?(setCusId(e.cusId),setCusKeyword('')):(setCusKeyword(e.cusKeyword),setCusId(''))
    }else{//产品
      e.cusId?(setProductId(e.cusId),setProductKeyword('')):(setProductKeyword(e.cusKeyword),setProductId(''))
    }
  };

  const getMapList = (param) => {
    CustProductDetail(param).then(res=>{
      const {statusCode,records,total} = res
        setLoading(false)
        if(statusCode=='200'){
           setTotal(total)
           setDataList(records)
           records.length>0?exportRef.handle(selectValueMul.includes('12'),records[0].sumjyje,records[0].summarket):exportRef.handle(selectValueMul.includes('12'),'0.00','0.00')
        }
    })
  }

  const handleList = () => {
    if(selectValueMul.length==0){
       message.warning('请选择客户类型 !');
       return 
    }
    let searchParam = {...param,pageSize:page}
    setPageNo(1)
    setLoading(true)
    console.log(exportRef,'efefef');
    getMapList(searchParam)
  }

  const handleTableChange = (current,pageSize) => {
    console.log('diaoyongle ',pageSize, current);
    if(selectValueMul.length==0){
      message.warning('请选择客户类型 !');
      return 
    }
    let newParam = {...param,pageSize,current}
    setLoading(true)
    setPage(pageSize)
    setPageNo(current)
    getMapList(newParam)
  };

  const reset = () => {
    console.log(cusRef,proRef);
    cusRef.current.reset()
    proRef.current.reset()
    setPageNo(1)
    setPage('10')
    setSelectValueS('1')
    scene === '3' ? setSelectValueM(['0']) : setSelectValueM(['12'])
    scene === '3' ? setCusType([{ value: '12', name: '销售关系' }, { value: '10', name: '开发关系' }, { value: '1', name: '服务关系' }, { value: '11', name: '无效户激活' }, { value: '0', name: '全部客户' }])
    : setCusType([{ value: '12', name: '销售关系' }, { value: '10', name: '开发关系' }, { value: '1', name: '服务关系' }, { value: '11', name: '无效户激活' }])
    setCusKeyword('')
    setCusId('')
    setProductKeyword('')
    setProductId('')
    setLoading(true)
    let origin = {...param,cusRng:'1',cusId:'',cusKeyword:'',cusType:scene === '3'?'0':'12',productId:'',productKeyword:'',current:1,pageSize:10}
    console.log(origin,'origin');
    getMapList(origin)
  }

  const columns = [
    {
      title: "序号",
      dataIndex: "summarket",
      key: "序号",
      align: "center",
      render:(text,record,index)=>{
        return <div>{(pageNo-1)*page+index+1}</div>
      }
    },
    {
      title: "客户姓名",
      dataIndex: "customer_name",
      key: "客户姓名",
    },
    {
      title: "客户号",
      dataIndex: "customer_no",
      key: "客户号",
      // width: 120
    },
    {
      title: "产品名称",
      dataIndex: "product_name",
      key: "产品名称",
      // width: 120
    },
    {
      title: "产品代码",
      dataIndex: "product_code",
      key: "产品代码",
      // width: 230
    },
    {
      title: "产品大类",
      dataIndex: "product_type",
      key: "产品大类",
      // width: 120
    },

    {
      title: '上日市值',
      dataIndex: "market_value",
      key: "上日市值",
      // width: 200
      // sorter: true
      render:(text,record,index)=>{
        return <span>{parseFloat(Number(text)).toFixed(2)}</span>
      }
    },
    {
      title:'持有成本',
      dataIndex: "cccb",
      key: "持有成本",
      // width: 200
      // sorter: true
      render:(text,record,index)=>{
        return <span>{parseFloat(Number(text)).toFixed(2)}</span>
      }
    },
    {
      title:'持有收益',
      dataIndex: "cysy",
      key: "持有收益",
      render:(text,record,index)=>{
        if(Number(text)<0){
          return <span style={{color:'green'}}>{parseFloat(Number(text)).toFixed(2)}</span>
        }else if(Number(text)>0){
          return <span style={{color:'red'}}>+{parseFloat(Number(text)).toFixed(2)}</span>
        }else{
          return <span style={{color:'red'}}>{parseFloat(Number(text)).toFixed(2)}</span>
        }
      }
      // width: 200
      // sorter: true
    },
    {
      title:'到期日',
      dataIndex: "dqr",
      key: "到期日",
      // width: 200
      // sorter: true
      // render:(text,record,index)=>{
      //   if(!text){
      //     return
      //   }
      //   return <span>{text.slice(0,4)+'.'+text.slice(4,6)+'.'+text.slice(6)}</span>
      // }
    },
  ]

  const tableProps = {
    dataSource:dataList,
    columns,
    loading,
    scroll: { x: true },
    // onChange: onTableChange,
  };

  return (
    <div>
      <div className={styles.otherTab}>
        <div style={{ marginTop: 20,marginRight: 20 , }}>
          <span className='labelText'>客户范围:</span>
          <EselectCheck
            options={{
              placeholder: "请选择你的内容",
              value: selectValueSing,
            }}
            allowClear={false}
            onChange={inputChanges}
            dataList={customerRange}
          />
        </div>
        <div style={{ marginRight: 20 , marginTop: 20}}>
        <span className='labelText'><span style={{color:'red',verticalAlign:'middle'}}>* </span>客户类型:</span>
            <EselectCheck
              options={{
                placeholder: "请选择你的内容",
                value: selectValueMul,
                mode: "multiple",
              }}
              type={true}
              isMust = {true}
              onChange={inputChangeM}
              dataList={cusType}
            />
          </div>
          <div style={{marginTop: 20 ,marginRight: 20 , display: 'flex', width: 340 }}>
          <span className='labelText'>客户查询:</span>
            <Einput onChange={inputChange} type={1} options={{placeholder:'请输入客户姓名或客户号'}} param = {param} ref={cusRef}/>
          </div>
          <div style={{ marginTop: 20 ,marginRight: 20 , display: 'flex', width: 340 }}>
          <span className='labelText'>产品查询:</span>
            <Einput onChange={inputChange} type={2} options={{placeholder:'请输入产品名称或产品代码'}} param = {param} ref={proRef}/>
          </div>
          <div className={styles.butn} style={{ marginTop: 20,marginBottom:20 }}>
          <Ebutton32 types="main" text="重置" onClick={reset}/>
            <div style={{ marginLeft: 20 }}>
            <Ebutton32 text="查询" onClick={handleList}/>
            </div>
          </div>
      </div>
      {/* <Divider style={{marginTop: 20}}/> */}
      <TableBn total={total} param={param} getRef={getRef}/>
      <Etable options={tableProps}/>
      <div style={{margin:'24px 0',display:'flex',justifyContent:'flex-end'}}>
        <EpaginationBig onChange={handleTableChange} options={{ total: total,current:pageNo,pageSize:page }}/>
      </div>
    </div>
  )
}
