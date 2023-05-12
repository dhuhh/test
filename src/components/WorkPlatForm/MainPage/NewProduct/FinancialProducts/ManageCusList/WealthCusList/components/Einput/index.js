import React, { useEffect, useState,forwardRef,useImperativeHandle,useRef } from "react";
import { Input, Tooltip, Spin } from "antd";
import { CustProductDetail } from '$services/newProduct';
import Epagination from "../Epagination";
import styles from "./index.less";
export default forwardRef(function Einput(props,ref) {
  /*
   *props : {options:{} ,style:{} , onChange} （默认入参）
   *
   *options : 沿用antd自带api
   *
   *onChang(e) : 把输入的值返回父组件
   *
   *
   *
   */
  const [val, setVal] = useState("");
  const [textWid, setTextWid] = useState(0);
  const [visible,setVisible] = useState(false)
  const [timer,setTimer] = useState(null)
  const [dataList,setDataList] = useState([])
  const [total,setTotal] = useState(0)
  const [isShow,setIsShow] = useState(false)
  const [isRange,setIsRange] = useState(false)

  const { options = {}, style = {}, onChange  ,param ,type = 1} = props;
  const modelRef = useRef()
  const inputRef = useRef()

  useImperativeHandle(ref, () => ({
    reset: () => {
      setVal('')
      setTextWid(0)
      setVisible(false)
      setTimer(null)
      setDataList([])
      setTotal(0)
    }
  }));

  useEffect(()=>{
    if(!visible){
      inputRef.current.blur()
    }
  },[visible])

  const inputChange = e => {
    setVal(e.target.value);
    // 计算输字符串的文本宽度
    valueWidth(e.target.value);
    // 把输入的值返回父组件
    // onChange(e.target.value);
    let params = {...param}
    if(type == 1){
       params.productKeyword = ''
       params.cusKeyword = e.target.value
       params.cusId=''
       params.productId = ''
       params.total = '-2'
       onChange({type:type,cusKeyword:e.target.value,cusId:''})
       if(!e.target.value){
        setDataList([])
        return
      }
       getList(params)
    }else{
      params.productKeyword = e.target.value
      params.cusKeyword = ''
      params.cusId = ''
      params.productId = ''
      params.total = '-2'
      onChange({type:type,cusKeyword:e.target.value,cusId:''})
      if(!e.target.value){
        setDataList([])
        return
      }
      getList(params)
    }
  };
  const onblur = e =>{
      if(!isRange){
        setVisible(false)
      }else{
        visible&&inputRef.current.focus()
      }
  }

  const onfocus = e =>{
    setVisible(true)
  }

  const enter = () => {
    setIsRange(true)
  }

  const leave = () => {
    setIsRange(false)
  }

  const reset = () =>{
    setVal('');
    setDataList([])
    setVisible(false)
    setTimer(0)
  }

  const getMapList = (param) => {
    CustProductDetail(param).then(res=>{
      if(!inputRef.current.state.value){
        setIsShow(false)
        setDataList([])
        return
      }
      const {statusCode,records = [],total} = res
      if(type==1){
        if(statusCode=='200'&&(param.cusKeyword==inputRef.current.state.value||param.cusId==inputRef.current.state.value)){
           setIsShow(false)
           setTotal(total)
           setDataList(records)
        }
      }else{
        if(statusCode=='200'&&(param.productKeyword==inputRef.current.state.value||param.productId==inputRef.current.state.value)){
           setTotal(total)
           setDataList(records)
           setIsShow(false)
        }
      }
    })
  }

  const getList = (param) => {
    if(timer!=null){
      clearTimeout(timer)
    }
    let time = setTimeout(()=>{
      setIsShow(true)
      getMapList(param)
    },1000)
    setTimer(time)
  }

  const handleTableChange = (current, pageSize) => {
    setIsShow(true)
    let newParam = {...param,pageSize,current,total:'-2'}
    if(type == 1){
      newParam.productId = ''
      newParam.productKeyword = ''
    }else{
      newParam.cusId = ''
      newParam.cusKeyword = ''
    }
    getMapList(newParam)
  };

  const handleItem = (item)=>{
    if(type == 1){
      onChange({type:type,cusKeyword:'',cusId:item.customer_no})
      let handparam = {...param,cusKeyword:'',cusId:item.customer_no,productKeyword:'',productId:'',total:'-2'}
      getMapList(handparam)
      setVal(item.customer_no)
      setVisible(false)
    }else{
      onChange({type:type,cusKeyword:'',cusId:item.product_code})
      let handparam = {...param,cusKeyword:'',cusId:'',productKeyword:'',productId:item.product_code,total:'-2'}
      getMapList(handparam)
      setVal(item.product_code)
      setVisible(false)
    }
  }

  const valueWidth = val => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "PingFangSC-Regular, PingFang SC";
    const textWid = context.measureText(val).width;
    setTextWid(textWid);
  };

  const showList = (data)=>{
    return (
      <div className={styles.searchList}>
        <div className="totalInline" onClick={()=>{inputRef.current.focus()}}>共{total}条</div>
        <ul>
          {
            type==1?dataList.map((item,index)=><li key={index} className="modal_item" onClick={()=>{handleItem(item)}} title={`${item.customer_name}  ${item.customer_no}`}>{item.customer_name}    {item.customer_no}</li>):dataList.map((item,index)=><li key={index} className="modal_item" onClick={()=>{handleItem(item)}} title={`${item.product_name}  ${item.product_code}`}>{item.product_name}   {item.product_code}</li>)
          }
        </ul>
        <div onClick={()=>{inputRef.current.focus()}}>
          <Epagination onChange={handleTableChange} options={{ total: total,size:'small' }} />
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.eInput}`} id="inputool" ref={ref}>
      <Tooltip
        title={textWid > 140 ? val : ""}
        getPopupContainer={() => document.getElementById("inputool")}
      >
        <Input
          allowClear
          onChange={inputChange}
          onBlur={onblur}
          onFocus={onfocus}
          ref={inputRef}
          style={{ ...style }}
          value={val}
          {...options}
          placeholder={options.placeholder || '请输入'}
        />
      </Tooltip>
      <div className={styles.modal} onMouseEnter={enter} onMouseLeave={leave} id="nodeShow" style={{display:visible?'':'none'}} ref={modelRef}>
        <Spin spinning={isShow}>
        {
          dataList.length===0?<div className="neverData" onClick={()=>{inputRef.current.focus()}}>查询不到{type==1?'客户':'产品'}数据</div>:
          showList(dataList)
        }
        </Spin>
      </div>
    </div>
  );
})
