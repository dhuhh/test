// import { useSetState } from 'ahooks'
import React from 'react'
import { useEffect,useState } from 'react'
import { Button, Input, Modal } from 'antd';
import { withRouter } from 'umi'
import {getSearch} from '$services/customer/customerTag'
import { FetchQueryCustIndi } from '@/services/labelInstr';
import {QueryCustCodeObscure} from "$services/newProduct";//客户指标模糊查询
import LabelInstr from './labelInstr'
import CustomerTags from '../../../../../components/WorkPlatForm/MainPage/Customers/CustomerTags'
import Icon from '../../../../../assets/customer/search3.png'
import Search from '../../../../../assets/customer/search2.png'
import styles from './index.less'
import { useRef } from 'react';

function CustomTagList(props) {
  //客户指标搜索测试数据
    const KHZB=[
      {
        label:'四级标签结果（1）',
        Mypid:['1-3','1-1','1-2'],
        value:'1-4-1',
      },
      {
        label:'四级标签结果（3）',
        Mypid:['1-1','1-2','1-3'],
        value:'1-4-3',
      },
     
      {
        label:'二级标签结果（2）',
        Mypid:['1-1'],
        value:'1-2-1',
      },
      {
        label:'四级标签结果（5）',
        Mypid:['1-1','1-2','1-3'],
        value:'1-4-20',
      },
      
    ]
    const [state, setState] = useState({
        //接口获取数据
        asideList: [],
        visible: false,
        customerLabel: [],
        customerIndicators: [],
        employeeIndicators: [],
        value: '',
        inRange: false,
        trick: 0,
        type:'上架'
    })
    const [searchList ,setSearchList] = useState(undefined)
    const [customerIndicatorsList ,setCustomerIndicatorsList] = useState([])
    const [yuanGonfSearchList ,setYuanGonfSearchList] = useState(undefined)
    const [tabnumber ,setTabnumber] = useState(1)
    const [yuangongSearch ,setYuangongSearch] = useState('')
    const [customerIndicatorsChoseId ,setCustomerIndicatorsChoseId] = useState('')//选中的客户指标id
    const [customerIndicatorsChosePId ,setCustomerIndicatorsChosePId] = useState('')//选中的客户指标Pid
    const [searchOrClick ,setSearchOrClick] = useState(false)//控制搜索还是点击展开逻辑
    const [gouzi ,setgouzi] = useState(true)//控制是否进行默认选择
    const [choic,setChoic] = useState({})
    const [treeOpen,setTreeOpen] = useState(true)
    const [KHZBchoic,setKHZBChoic] = useState({})

    const inputRef = useRef()
    const re = useRef(null)
    useEffect(() => {
        setState({
            ...state,
            asideList: []
        })
    }, [])
    const focus = () => {
        setState({
            ...state,
            visible: true,
        })
    }
    const blur = () => {
        if (!state.inRange) {
            setState({
                ...state,
                visible: false,
            })
        } else {
            inputRef.current.focus();
        }
    }

    const getType = (item)=>{
        setState({
            ...state,
            type:item
        })
    }

    const onChange = (e) => {
        if(!e.target.value){
            setSearchList(undefined)
            setYuanGonfSearchList(undefined)
        }else{

          FetchQueryCustIndi({
            indiName:e.target.value,
            indiType: '',
            paging: 1,
            current: 1,
            pageSize: 10,
            total: -1,
            sort: '',
          }).then(res=>{
            setYuanGonfSearchList([...res.records])
          }).catch(err=>{
            console.log(err);
          })

          getSearch({
              tagName:e.target.value,
              type:state.trick,
              tagState:state.type
            }).then((res)=>{
                setSearchList([...res.records])
            })
            QueryCustCodeObscure({
              indexName:e.target.value
            }).then(res=>{
              setCustomerIndicatorsList([...res.records])
            })
        }        
        setState({
            ...state,
            value: e.target.value
        })
    }

    const enter = () => {
        setState({
            ...state,
            inRange: true
        })
    }

    const handleTrink = (type) => {
        setState({
            ...state,
            trick: type
        })
    }

    const reSend = ()=>{
        setState({
            ...state,
            trick:0,
        })
    }

    const prefix = () => {
        if (state.trick == 1) {
            return <span className={styles.inputTag} onMouseEnter={enter} onMouseLeave={leave}>客户标签<img src={Icon} style={{marginTop:'-2px',marginLeft:'2px',width:'16px'}} onClick={reSend}/></span>
        } else if (state.trick == 2) {
            return <span className={styles.inputTag} onMouseEnter={enter} onMouseLeave={leave}>客户指标<img src={Icon} style={{marginTop:'-2px',marginLeft:'2px',width:'16px'}} onClick={reSend}/></span>
        } else {
            return <span className={styles.inputTag} onMouseEnter={enter} onMouseLeave={leave}>员工指标<img src={Icon} style={{marginTop:'-2px',marginLeft:'2px',width:'16px'}} onClick={reSend}/></span>
        }
    }

    const leave = () => {
        setState({
            ...state,
            inRange: false
        })
    }

    const getProps = ()=>{
        setChoic({})
    }

    const cancle = ()=>{
        setState({
            ...state,
            inRange:false,
            visible:false
        },()=>{
            inputRef.current.blur()
        })
    }
    const changeTabType=(type)=>{
      setTabnumber(type)
      setState({
        ...state,
        trick: type
    })
    }
    const searchChange=(val)=>{
      setYuangongSearch(val)
    }
    const handleKeyDown=(e)=>{
      if(state.trick===3&&e.key==='Enter'){
        setYuangongSearch(state.value)
      }
    }
    const searchYuanGong=(val)=>{
      re.current.changeTabs('3')
      setYuangongSearch(val)
    }
    const searchCustomerIndicators=(val)=>{
      console.log(val);
      setState({
        ...state,
        value:val.indexName,
       })
      re.current.changeTabs('2')
      setgouzi(false)
      setSearchOrClick(true)
      setTreeOpen(true)
      setKHZBChoic({value:val.id})
      setCustomerIndicatorsChoseId(val.id)
      setCustomerIndicatorsChosePId(val.parentId)
      
     
      
    }
    const onClick = (item)=>{
      console.log(item,'搜索框点击');
       setState({
        ...state,
        value:item.tagName,
       })
       re.current.changeTabs('1')
       setChoic(item)
    }

    // let list = [{ tab1: ['新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2'], tab2: ['新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2'], tab3:['新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2','新开户', '新开户1', '新开户2'] }]
    
    return (
      <>
        <div className={styles.tabsLevel}>
          <div style={{ height: '64px', background: '#fff', marginBottom: '8px', position: 'relative' }} className={styles.id_input}>
              <Input tabIndex="0" placeholder={state.trick == 3?'请输入员工指标名称':state.trick == 2?'请输入客户指标名称':'请输入标签名称'} prefix={state.trick == 0 ?(state.value?<span></span>:<img src={Search} style={{width:'16px'}}/> ): prefix()} ref={inputRef} onFocus={focus} onBlur={blur} onChange={onChange} value={state.value} style={{ width: 'calc(100% - 48px)', height: '32px', margin: '16px 24px', position: 'absolute', top: '0', bottom: '0', left: '0', right: '0',borderRadius:'2px',caretColor:'#244FFF'}} className={state.trick == 0 ? 'padding' : 'hastag'}  onKeyDown={handleKeyDown}/>
              <div style={{ display: state.visible ? 'block' : 'none', position: 'absolute', top: '50px', maxHeight: '244px', width: 'calc(100% - 48px)', left: '24px', boxShadow: '0px 6px 30px 0px rgba(5,14,28,0.1)', borderadius: '2px', zIndex: '9', background: '#fff'}} onMouseEnter={enter} onMouseLeave={leave}>
                  <table className={styles.table}>
                      {
                          !state.value && state.trick == 0 ?
                              <div style={{margin:'16px 0 17px 16px'}}>
                                  <Button onClick={() => {
                                    handleTrink(1)
                                    re.current.changeTabs('1')
                                  }} style={{marginRight:'8px'}} className={styles.search_btn}>客户标签</Button>
                                  <Button onClick={() => handleTrink(2)} style={{marginRight:'8px'}} className={styles.search_btn}>客户指标</Button>
                                  <Button onClick={() => {
                                    handleTrink(3)
                                    re.current.changeTabs('3')
                                  }} style={{marginRight:'8px'}} className={styles.search_btn}>员工指标</Button>
                              </div> :
                              <div style={{display:'flex'}}>
                                  {
                                      (state.trick==0||state.trick==1)&&
                                      <div style={{flex:'1',display:'flex',flexDirection:'column',justifyContent:'start'}}>
                                              <div className={styles.titleModal}><span style={{background:'#00B7FF'}}></span>客户标签</div>
                                          <div style={{overflowY:'auto',maxHeight:'200px'}} className={styles.tableScroll}>
                                          <table >
                                          {
                                          searchList? (searchList.length>0? searchList.map((item) => {
                                                  return (<tr><td onClick={()=>onClick(item)}>{item.tagName}</td></tr>)
                                              }):<div style={{fontSize: '14px',fontFamily: 'PingFangSC-Regular, PingFang SC',fontWeight: 400,color: '#959CBA',marginLeft:'28px',marginBottom:'10px'}}>未找到符合条件的结果</div>):<span></span>
                                          }
                                      </table>
                                          </div>
                                      </div>
                                  }
                                  {
                                      (state.trick==0||state.trick==2)&&
                                      <div style={{flex:'1',overflowY:'auto',borderLeft:`${state.trick==0?'1px solid #EAECF2 ':'none'}`,display:'flex',flexDirection:'column',justifyContent:'start'}}>
                                          <div className={styles.titleModal}><span style={{background:'#F6C34F'}}></span>客户指标</div>
                                          <div style={{overflowY:'auto',maxHeight:'200px'}} className={styles.tableScroll}>
                                          <table>
                                          {
                                              customerIndicatorsList.length>0?customerIndicatorsList.map((item) => {
                                                   return (<tr><td onClick={()=>{
                                                    
                                                    searchCustomerIndicators(item)
                                                     //setKHZBChoic(item)
                                                   }}>{item.indexName}</td></tr>)
                                               }):<div style={{fontSize: '14px',fontFamily: 'PingFangSC-Regular, PingFang SC',fontWeight: 400,color: '#959CBA',marginLeft:'28px',marginBottom:'10px'}}>未找到符合条件的结果</div>
                                              //state.value&&<div style={{fontSize: '14px',fontFamily: 'PingFangSC-Regular, PingFang SC',fontWeight: 400,color: '#959CBA',marginLeft:'28px',marginBottom:'10px'}}>未找到符合条件的结果</div>
                                          }
                                      </table>
                                          </div>
                                      </div>
                                  }
                                  {
                                      (state.trick==0||state.trick==3)&&
                                      <div style={{flex:'1',overflowY:'auto',borderLeft:`${state.trick==0?'1px solid #EAECF2 ':'none'}`,display:'flex',flexDirection:'column',justifyContent:'start'}}>
                                          <div className={styles.titleModal}><span style={{background:'#708EFF'}}></span>员工指标</div>
                                          <div style={{overflowY:'auto',maxHeight:'200px'}} className={styles.tableScroll}>
                                          <table>
                                          {
                                                yuanGonfSearchList? (yuanGonfSearchList.length>0? yuanGonfSearchList.map((item) => {
                                                  return (<tr><td onClick={()=>{searchYuanGong(item.indiName)}}>{item.indiName}</td></tr>)
                                              }):<div style={{fontSize: '14px',fontFamily: 'PingFangSC-Regular, PingFang SC',fontWeight: 400,color: '#959CBA',marginLeft:'28px',marginBottom:'10px'}}>未找到符合条件的结果</div>):<span></span>
                                              // [].map((item) => {
                                              //     return (<div>未找到符合条件的结果</div>)
                                              // })
                                              //state.value&&<div style={{fontSize: '14px',fontFamily: 'PingFangSC-Regular, PingFang SC',fontWeight: 400,color: '#959CBA',marginLeft:'28px',marginBottom:'10px'}}>未找到符合条件的结果</div>
                                          }
                                      </table>
                                          </div>
                                      </div>
                                  }
                              </div>
                      }
                  </table>
              </div>
          </div>
      </div>
      {/* <LabelInstr searchChange={searchChange}></LabelInstr> */}
        
        <CustomerTags getType={getType} searchValue={state.value} ref={re} cancle={cancle} choic={choic} KHZBchoic={KHZBchoic} {...props} getProps={getProps} changeTabType={changeTabType} yuangongSearch={yuangongSearch} customerIndicatorsChoseId={customerIndicatorsChoseId}setCustomerIndicatorsChoseId={setCustomerIndicatorsChoseId} searchOrClick={searchOrClick} setSearchOrClick={setSearchOrClick} customerIndicatorsChosePId={customerIndicatorsChosePId} gouzi={gouzi} treeOpen={treeOpen} setTreeOpen={setTreeOpen}/>
      </>
    )
}
export default withRouter(CustomTagList)