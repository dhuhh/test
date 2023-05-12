import React, { useEffect, useState } from 'react'
import { Card, Tooltip } from 'antd'
import EselectCheck from './components/EselectCheck'
import ErangePicker from "./components/ErangePicker";
import EtreeSelectMul from "./components/EtreeSelectMul";
import Etable from './components/Etable'
import Einput from "./components/Einput";
import Calimg from "$assets/activityComPage/aclquestion.png";
import styles from './index.less'
import { fetchUserAuthorityDepartment } from '$services/commonbase/userAuthorityDepartment';
import moment from 'moment';
import TableBn from "./components/TableBn";
import TreeUtils from '$utils/treeUtils';

export default function CustransacDetails() {
    const [selectValueSing, setSelectValueS] = useState('1');//客户范围
    const [rangeTime, setRangeTime] = useState([moment().add(-7, 'd'), moment().startOf('day')])//时间
    const [treeValueMul, settreeValueM] = useState([]);//选中开户营业部
    const [treeData, setTreeData] = useState([])//开户营业部列表
    const [cusName, setCusName] = useState('')//客户名
    const [comStr,setComStr] = useState([])//组合策略选中
    const [comList,setComList] = useState([])//组合策略列表
    const [scaType,setScaType] = useState([])//交易类型选中
    const [typeList,setTypeList] = useState([])//交易类型列表
    const [scaStatus,setScaStatus] = useState([])//交易状态选中
    const [statusList,setStatusList] = useState([{value:1,name:'处理中'},{value:2,name:'处理完成'},{value:3,name:'已撤销'},{value:4,name:'处理失败'}])//交易状态列表
    const [relation,setRelation] = useState([])//投顾关系选中
    const [relationList,setRelationList] = useState([])//投顾关系列表
    const [dataSource,setDataSource] = useState([])//查询结果列表
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then(res => {
            const { code = 0, records = [] } = res || {};
            if (code > 0) {
                records.length > 0 && setTreeData(toOrgTree(records, 0));
            }
        }).catch(err => {

        })
    }, [])
    //设置时间范围
    const inputChange = e => {
        console.log("父组件", e);
        setRangeTime(e)
    };
    //开户营业部数组转树
    const toOrgTree = (list, parId) => {
        console.log(list, list.length, 'length');
        const datas = TreeUtils.toTreeData(
            list,
            {
                keyName: "yybid",
                pKeyName: "fid",
                titleName: "yybmc",
                normalizeTitleName: "title",
                normalizeKeyName: "value"
            },
            true
        );
        let departments = [];
        datas.forEach(item => {
            const { children } = item;
            departments.push(...children);
        });
        return departments
    };
    //客户范围
    const inputChanges = e => {
        console.log("父组件", e);
        setSelectValueS(e);
    };
    //开户营业部
    const treeChange = e => {
        console.log("父组件", e);
        settreeValueM(e);
    };
    //客户名
    const handleInName = e => {
        setCusName(e)
    }
    //组合策略
    const handleCom = e => {
        setComStr(e)
    }
    //交易类型
    const handleType = e => {
        setScaType(e)
    }
    //交易状态
    const handleStatus = e => {
        setScaStatus(e)
    }
    //投顾关系类型
    const handleRealtion = e => {
        setRelation(e)
    }
    //禁止选中日
    const disabledDate = (current) => {
        if (current && (current >
            moment().endOf('day') || current <
            moment(moment().subtract(1, 'year').startOf('day')))) {
            return true
        }
        return false
    }
    const dataList = [
        {
            name: "本人业务关系",
            value: "1",
        },
        { name: "直属", value: "2" },
        { name: "所辖", value: "3" },
        { name: "所有", value: "4" },
    ];
    const columns = [
        {
            title: "开户营业部",
            dataIndex: "dept",
            key: "开户营业部",
            // width: 120
        },
        {
            title: "开户营业部代码",
            dataIndex: "deptCode",
            key: "开户营业部代码",
            // width: 120
        },
        {
            title: "客户姓名",
            dataIndex: "customerName",
            key: "客户姓名",
            // width: 120
        },
        {
            title: "客户号",
            dataIndex: "customerCode",
            key: "客户号",
            // width: 120
        },
        {
            title: "资金账号",
            dataIndex: "moneyCode",
            key: "资金账号",
            // width: 120
        },
        {
            title: "组合策略名称",
            dataIndex: "celuename",
            key: "组合策略名称",
            // width: 120
        },
        {
            title: "交易日期",
            dataIndex: "date",
            key: "交易日期",
            // width: 120
        },
        {
            title: "交易类型",
            dataIndex: "type",
            key: "交易类型",
            // width: 120
        },
        {
            title: "委托金额",
            dataIndex: "money",
            key: "委托金额",
            // width: 120
        },
        {
            title: "交易状态",
            dataIndex: "status",
            key: "交易状态",
            // width: 120
        },
        {
            title: "委托金额",
            dataIndex: "money",
            key: "委托金额",
            // width: 120
        },
        {
            title: "委托赎回到账金额金额",
            dataIndex: "hasmoney",
            key: "赎回到账金额",
            // width: 120
        },
        {
            title: "已划转客户资金",
            dataIndex: "cusmoney",
            key: "已划转客户资金",
            // width: 120
        },
        {
            title: "抵扣费",
            dataIndex: "getmoney",
            key: "抵扣费",
            // width: 120
        },
        {
            title: "基金投顾关系",
            dataIndex: "guanxi",
            key: "基金投顾关系",
            // width: 120
        },
        {
            title: "基金投顾关系员工OA",
            dataIndex: "oa",
            key: "基金投顾关系员工OA",
            // width: 120
        },
    ]
    const tableProps = {
        dataSource,
        columns,
        loading,
        scroll: { x: 2900 },
        // onChange: onTableChange,
    };
    return (
        <div>
            <Card bordered={false} bodyStyle={{ padding: "16px 24px" }} id='mytooltip'>
                <div className={styles.boxselect}>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            客户范围
                            <Tooltip
                                title='与员工本人有基金投顾关系的客户'
                                overlayStyle={{ maxWidth: 180 }}
                                getPopupContainer={() => document.getElementById('mytooltip')}
                            >
                                <img
                                    src={Calimg}
                                    alt=""
                                    style={{ width: 16, height: 16, marginLeft: 5 }}
                                />
                            </Tooltip>
                        </div>
                        <EselectCheck
                            options={{
                                placeholder: "请选择你的内容",
                                value: selectValueSing,
                                allowClear:false,
                            }}
                            onChange={inputChanges}
                            dataList={dataList}
                        />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            客户操作<br />日期
                        </div>
                        <ErangePicker onChange={inputChange} options={{ value: rangeTime, disabledDate }} />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            开户<br />营业部
                        </div>
                        <EtreeSelectMul
                            options={{
                                multiple: true,
                                treeCheckable: true,
                                value: treeValueMul,
                            }}
                            treeData={treeData}
                            onChange={treeChange}
                        />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            客户
                        </div>
                        <Tooltip
                            title='客户姓名/客户号/手机号/资金账号/证件号码'
                            overlayStyle={{ width: 300 }}
                            placement='bottom'
                            getPopupContainer={() => document.getElementById('mytooltip')}
                        >
                            <div>
                                <Einput onChange={handleInName} options={{ value: cusName, placeholder: '客户姓名/客户号/手机号/资金...' }} />
                            </div>
                        </Tooltip>
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            组合策略
                        </div>
                        <EselectCheck
                            options={{
                                placeholder: "请选择你的内容",
                                mode: "multiple",
                                value: comStr,
                            }}
                            onChange={handleCom}
                            dataList={comList}
                        />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            交易类型
                        </div>
                        <EselectCheck
                            options={{
                                placeholder: "请选择你的内容",
                                mode: "multiple",
                                value: scaType,
                            }}
                            onChange={handleType}
                            dataList={typeList}
                        />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                            交易状态
                        </div>
                        <EselectCheck
                            options={{
                                placeholder: "请选择你的内容",
                                mode: "multiple",
                                value: scaStatus,
                            }}
                            onChange={handleStatus}
                            dataList={statusList}
                        />
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.label}>
                        基金投顾<br />关系
                        </div>
                        <EselectCheck
                            options={{
                                placeholder: "请选择你的内容",
                                mode: "multiple",
                                value: relation,
                            }}
                            onChange={handleRealtion}
                            dataList={relationList}
                        />
                    </div>
                </div>
            </Card>
            <Card style={{marginTop:'8px'}}>
                <TableBn/>
                <Etable options={tableProps} />
            </Card>
        </div>
    )
}
