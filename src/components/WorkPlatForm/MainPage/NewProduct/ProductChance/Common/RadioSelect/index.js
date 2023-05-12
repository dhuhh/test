import React, { useEffect, useState } from 'react'
import { Radio } from 'antd';
import './index.css'

const RadioSelect = React.memo((props)=>{
    const {plainOptions=[],type,getRadioSelect,showValue='全部'} = props;
    const [value, setValue] = useState(showValue);
    useEffect(()=>{
       setValue(showValue)
    },[showValue])
    const onChange = ({ target: { value } }) => {
        setValue(value);
        getRadioSelect(type,value)
      };
    return (
        <>
        <div id='radioButton'>
        <Radio.Group onChange={onChange} value={value}>
                {plainOptions.map((item,index)=>{
                   return (<Radio.Button className='Radio-button' value={item.value} size='large' key={item.value}>{item.value}</Radio.Button>)
                })}
        </Radio.Group>
        </div>
        </>
      )
})
export default RadioSelect