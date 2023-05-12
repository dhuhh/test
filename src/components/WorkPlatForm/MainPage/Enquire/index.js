import React, { useState } from 'react'
import { Button, Input, Select, Table, message, Spin } from 'antd'
import './index.css'
import isTrue from '../../../../assets/customer/isTure1.png'
import isFalse from '../../../../assets/customer/isFalse1.png'
import IsUp from '../../../../assets/newProduct/chance/arrow_up.png'
import IsDown from '../../../../assets/newProduct/chance/arrow_down.png'
import Dui from '../../../../assets/customer/dui2.png'
import Cuo from '../../../../assets/customer/cuowu2.png'
import { getTag, getQueryCustomer } from '../../../../services/customer/customerTag'
import login from '../../../../utils/api/login'
const { Option } = Select;
let timer = null
export default function EnquireComponent() {
    const [selectValue, setSelectValue] = useState(undefined);
    const [result, setResult] = useState(0);
    const [list, setList] = useState([]);
    const [isSearch, setIsSearch] = useState(false)
    const [outcome, setOutcome] = useState({})
    const [customValue, setCustomerValue] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [condition, setCondition] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [customerNo, setCustomerNo] = useState('')
    const [resultAll, setResultAll] = useState('')
    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)
    const [dropList, setDropList] = useState([])
    const [customer, setCustomer] = useState()
    const [clickValue, setClickValue] = useState({})
    const [pageLoading, setPageLoading] = useState(false)
    const handleChange = (value) => {
        setSelectValue(value)
    };
    const createNewArr = (data) => {
        return data.reduce((result, item) => {
            //首先将labelConditions字段作为新数组result取出
            if (result.indexOf(item.tagName) < 0) {
                result.push(item.tagName)
            }
            return result
        }, []).reduce((result, tagName, indexRul) => {
            //将labelConditions相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
            let color = indexRul == 0 || indexRul % 2 == 0 ? true : false
            const children = data.filter(item => item.tagName === tagName);
            result = result.concat(
                children.map((item, index) => ({
                    ...item,
                    color,
                    rowSpan: index === 0 ? children.length : 0,//将第一行数据添加rowSpan字段
                }))
            )
            return result;
        }, [])
    }

    //   const data = [
    //     {
    //       labelConditions: '传统无效户',
    //       labelDetails:22,
    //       customerInformation: 'New York No. 1 Lake Park',
    //       isSure:true,
    //       determine:'符合'
    //     },
    //     {
    //         labelConditions: '传统无效户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '传统无效户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '传统无效户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '传统无效户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户22',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户22',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户33',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },
    //       {
    //         labelConditions: '销户再开户33',
    //         labelDetails:22,
    //         customerInformation: 'New York No. 1 Lake Park',
    //         isSure:true,
    //         determine:'符合'
    //       },

    //   ];

    const columns = [
        {
            title: '标签条件',
            dataIndex: 'tagName',
            key: 'tagName',
            align: 'center',
            render(_, row) {
                return {
                    children: <div>
                        <span>{row.tagName}</span><br />
                        <span>{row.tagDesc}</span>
                    </div>,
                    props: {
                        rowSpan: row.rowSpan,
                        className: `dontbackground ${row.color ? 'white' : 'grey'}`
                    }
                }
            }
        },
        {
            title: '标签明细',
            align: 'center',
            dataIndex: 'condition',
            key: 'condition',
            // className:`${row.color?'white':'grey'}`
            render(_, row) {
                return {
                    children: row.condition,
                    props: {
                        className: `${row.color ? 'white' : 'grey'}`
                    }
                }
            }
        },
        {
            title: '客户信息',
            align: 'center',
            dataIndex: 'value',
            key: 'value',
            // className:`${row.color?'white':'grey'}`
            render(_, row) {
                return {
                    children: row.value,
                    props: {
                        className: `${row.color ? 'white' : 'grey'}`
                    }
                }
            }
        },
        {
            title: '是否满足',
            align: 'center',
            dataIndex: 'conditionFlag',
            key: 'conditionFlag',
            width: 110,
            // className:`${row.color?'white':'grey'}`,
            render(_, row) {
                return {
                    children: row.conditionFlag == 1 ? <span style={{ color: '#00B7FF ' }}><img src={Dui} style={{ display: 'inline-block', marginTop: '-4px', width: '16px' }} />满足</span> : <span style={{ color: '#EC3A48' }}><img src={Cuo} style={{ display: 'inline-block', marginTop: '-4px', width: '16px' }} />不满足</span>,
                    props: {
                        className: `${row.color ? 'white' : 'grey'}`
                    }
                }
            }
        },
        {
            title: '判定',
            align: 'center',
            dataIndex: 'allConditionFlag',
            key: 'allConditionFlag',
            width: 80,
            render(_, row) {
                return {
                    children: <span style={{ color: row.allConditionFlag == '1' ? '#00B7FF ' : '#EC3A48' }}>{row.allConditionFlag == '1' ? '符合' : '不符合'}</span>,
                    props: {
                        rowSpan: row.rowSpan,
                        className: `dontbackground ${row.color ? 'white' : 'grey'}`
                    }
                }
            }
        }
    ]
    const getDrop = (open) => {
        setIsOpen(open)
    }
    const reset = () => {
        setSelectValue(undefined);
        setCustomerValue('')
        setDropList([])
        setClickValue('')
    }
    const handleBlur = () => {
        setTimeout(() => {
            let upClick, inputValue
            setClickValue(o => upClick = o)
            setCustomerValue(o => inputValue = o)
            if (upClick.customerName) {
                if (upClick.customerName + '(' + upClick.customerNo + ')' != inputValue) {
                    setCustomerValue(upClick.customerName + '(' + upClick.customerNo + ')')
                    setLoading(true);
                    getQueryCustomer({
                        keyword: upClick.customerNo
                    }).then((res) => {
                        if (res.code == 1) {
                            setDropList(res.records);
                            setLoading(false);
                        }
                    })
                }
            } else {
                setCustomerValue('')
                setDropList([])
                setLoading(false)
            }
            setVisible(false)
        }, 200)
    }
    const handleFocus = () => {
        setVisible(true)
        //    setLoading(true)
        //    setTimeout(()=>{
        //       setLoading(false)
        //       setDropList([{id:'1314520',name:'刘mm'},{id:'1314520',name:'刘m1'},{id:'1314520',name:'刘m2'},{id:'1314520',name:'刘m3'},{id:'1314520',name:'刘m4'},{id:'1314520',name:'刘m5'},{id:'1314520',name:'刘m6'},{id:'1314520',name:'刘m7'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},{id:'1314520',name:'刘m'},])
        //    },1000)
    }
    const dropHandle = (item) => {
        setCustomerValue(item.customerName + '(' + item.customerNo + ')')
        setVisible(false)
        setClickValue(item)
        setLoading(true)
        setCustomer(item.customerNo)
        getQueryCustomer({
            keyword: item.customerNo
        }).then((res) => {
            if (res.code == 1) {
                setDropList(res.records);
                setLoading(false);
            }
        })
    }
    const handleClick = () => {
        setPageLoading(true)
        // message.error({
        //     title:'我没有错误',
        //     top:240,
        // })
        getTag({
            customerNo: customer,
            tagId: selectValue,
        }).then((res) => {
            setPageLoading(false)
            if (res.code == '10') {
                message.error(res.note)
            } else {
                setList(res.records);
                setIsSearch(true);
                setCondition(res.condition);
                setCustomerName(res.customerName);
                setCustomerNo(res.customerNo);
                setResultAll(res.result);
                setResult(1)
            }
        })
    }
    const handleOnchange = (e) => {
        setCustomerValue(e.target.value)
        clearTimeout(timer)
        if (e.target.value) {
            setLoading(true)
        }
        timer = setTimeout(() => {
            if(e.target.value){
                getQueryCustomer({
                    keyword: e.target.value
                }).then((res) => {
                    if (res.code == 1&&e.target.value!=(clickValue.customerName + '(' + clickValue.customerNo + ')')&&e.target.value!='') {
                        setDropList(res.records);
                        setLoading(false);
                    }
                })
            }else{
                setLoading(false)
                setDropList([])
            }
        }, 1000)
    }
    return (
        <Spin spinning={pageLoading} style={{ verticalAlign: 'center', alignItems: 'center' }}>
            <div id='enquire'>
                <div style={{ display: 'flex', height: '80px', lineHeight: '80px', borderBottom: '1px solid #EAEEF2' }}>
                    <div>
                        <span className='textClass'>选择标签</span>
                        <Select
                            value={selectValue}
                            placeholder="请选择"
                            suffixIcon={<img src={isOpen ? IsUp : IsDown} />}
                            onDropdownVisibleChange={getDrop}
                            style={{
                                width: 251,
                                height: 32,
                                color: '#1A2243'
                            }}
                            onChange={handleChange}
                        >
                            <Option value="14070029">无效户</Option>
                            <Option value="14070026">有效户</Option>
                            <Option value="14070033">无效户激活</Option>
                        </Select>
                    </div>
                    <div style={{ marginLeft: '59px', marginTop: '-1px', position: 'relative' }}>
                        <span className='textClass'>客户号</span><Input value={customValue} onBlur={handleBlur} onFocus={handleFocus} style={{ height: '32px', width: '251px', borderRadius: '2px' }} placeholder='请输入客户姓名/客户号' onChange={handleOnchange} />
                        {visible && <>{
                            loading ? <div className='dropInName' style={{ textAlign: 'center' }}><Spin></Spin></div> :
                                dropList.length == 0 ? <div className='dropInName' style={{ textAlign: 'center', color: '#61698C' }}>暂无数据</div> : <div className='dropInName' id='dropInCustom'>{dropList.map((item) => (<div onClick={() => dropHandle(item)} key={item.customerNo}>{item.customerName + '(' + item.customerNo + ')'}</div>))}</div>
                        }</>}
                    </div>
                    <div style={{ marginLeft: '46px', marginTop: '1px' }}>
                        <Button className='buttonClass' style={{ color: '#61698C', padding: '0' }} onClick={reset}>重置</Button>
                        <Button className='buttonClass' style={{ background: '#244FFF', color: '#fff', marginLeft: '7px', padding: '0' }} onClick={handleClick}>查询</Button>
                    </div>
                </div>
                <div style={{ height: '88px', background: '#F3F4F7', border: '1px solid #EAECF2', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '24px' }}>
                    <div style={{ marginLeft: '16px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <span className='weight'>综合判断条件 :</span>
                            <span className='dan'>{result == 0 ? '- -' : condition}</span>
                        </div>
                        <div>
                            <span style={{ marginRight: '32px' }}>
                                <span className='weight'>
                                    用户名 :
                                </span>
                                <span className='dan'>
                                    {result == 0 ? '- -' : customerName}
                                </span>
                            </span>
                            <span>
                                <span className='weight'>
                                    客户号 :
                                </span>
                                <span className='dan'>
                                    {result == 0 ? '- -' : customerNo}
                                </span>
                            </span>
                        </div>
                    </div>
                    <div style={{ marginRight: '23px' }}>
                        <span>
                            <span className='weight'>综合判定 :</span>
                            {
                                result == 0 ? '- -' : (resultAll === '1' ? <img src={isTrue} alt='' style={{ width: '70px', height: '62px' }} /> : <img src={isFalse} alt='' style={{ width: '70px', height: '62px' }} />)
                            }
                        </span>
                    </div>
                </div>
                {isSearch ? <Table className='ATable' columns={columns} bordered={true} dataSource={createNewArr(list)} pagination={false} />
                    : <div style={{ height: 'calc(100vh - 313px)' }}></div>
                }
            </div>
        </Spin>
    )
}
