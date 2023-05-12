import { Card, Col, Divider, Form, Input, message, Modal, Row, Table, Button, Select, Radio, Checkbox, Pagination, Spin } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import lodash from 'lodash';
import { connect } from 'umi';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import RateModal from '../Common/RateModal/Temp';
import TableLocale from '../Common/TableLocale';
import edit_black from '$assets/newProduct/customerPanorama/edit_black.svg'
import { QuerySocialRelationsInformation, QueryCustAllInfo, QueryBusinessOpportunityList, UpdatePhoneInfo, UpdateCharacteristicInfo, UpdaterelationshipInfo, QueryCustAllInfoMore, QueryOriNetCommissions, QuerySaHaStockRate } from '$services/customerPanorama';
import styles from './index.less';
import { any, string } from 'prop-types';

const locale = { emptyText: <TableLocale emptyText='无记录' /> };

type Props = Readonly<{
  customerCode: string,
  form: any,
  dictionary: any,
  setLoading: (loading: boolean) => void
}>

enum Mode { add, modify }

interface State {
  loading1: boolean,
  dataSource1: any[],
  loading2: boolean,
  dataSource2: any[],
  allInfo: any,
  visible1: boolean,
  visible2: boolean,
  visible3: boolean,
  selected: number,
  mode: Mode,
  current: number,
  pageSize: number,
  total: number,
  modalLoading1: boolean,
  modalLoading2: boolean,
  modalLoading3: boolean,
  visible: boolean,
  account: string,
  accType: number,
}

const BasicInfo: FC<Props> = (props) => {
  const [state, setState] = useState<State>({
    loading1: false,
    dataSource1: [],
    loading2: false,
    dataSource2: [],
    allInfo: {},
    visible1: false,
    visible2: false,
    visible3: false,
    selected: 0,
    mode: Mode.add,
    current: 1,
    pageSize: 10,
    total: 0,
    modalLoading1: false,
    modalLoading2: false,
    modalLoading3: false,
    visible: false,
    account: '',
    accType: 1,
  })
  interface StateS{
    allCounType:any
  }

  const [stateCount, setStateCount] = useState<StateS>({
    allCounType: {
      optionList: [],
      ordinaryList: [],
      creditList: []
    }
  })


  useEffect(() => {
    props.setLoading(true);
    Promise.all([
      QuerySocialRelationsInformation({ custNo: customerCode, paging: 1, current: state.current, pageSize: state.pageSize }),
      QueryCustAllInfo({ custNo: customerCode }),
      QueryBusinessOpportunityList({ custNo: customerCode, type: '4' }),
      QueryCustAllInfoMore({ custNo: customerCode }),
    ]).then((res: any[]) => {
      props.setLoading(false);
      const [res1, res2, res3,res4] = res;
      const { records: records1 = [], total = 0 } = res1;
      const { records: records2 = [] } = res2;
      const { records: records3 = [] } = res3;
      const { records: records4 = [] } = res4;

      getAccountDetail({ ...lodash.get(records2, '[0]', {}) });

      setState({
        ...state,
        dataSource2: records1.map((item: any, index: number) => ({ ...item, key: index })),
        total,
        allInfo: {...lodash.get(records2, '[0]', {}),...lodash.get(records4, '[0]', {})},
        dataSource1: records3.map((item: any, index: number) => ({ ...item, key: index })),
      });
    }).catch((err: any) => message.error(err.note || err.message));
  }, [])

  const columns1: any[] = [
    { title: '开通业务', dataIndex: 'typeName' },
    { title: '开通日期', dataIndex: 'openAccountDate' },
  ];
  const columns2: any[] = [
    { title: '选择', dataIndex: 'key', width: 80, render: (text: number) => <Checkbox checked={text === state.selected ? true : false} onChange={() => handleCheckboxChange(text)} /> },
    { title: '关系人', dataIndex: 'relatedPerson' },
    { title: '关系', dataIndex: 'relatedName' },
    { title: '联系电话', dataIndex: 'telePhone' },
    { title: '手机', dataIndex: 'phone' },
    { title: '电子邮箱', dataIndex: 'email' },
    { title: '备注', dataIndex: 'remark' },
    { title: '登记人', dataIndex: 'registerPerson' },
    { title: '登记日期', dataIndex: 'registerDate' },
  ];

  const handleSubmit1 = (e: React.FormEvent): void => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        setState({ ...state, modalLoading1: true });
        const params = { ...values, khh: Number(customerCode), servicePhone: Number(values.servicePhone), code: Number(values.code) };
        props.setLoading(true);
        UpdatePhoneInfo(params).then((res: any) => {
          setState({ ...state, visible1: false, modalLoading1: false })
          const { note = '操作成功' } = res;
          message.success(note);
          Promise.all([
            QueryCustAllInfo({ custNo: customerCode }),
            QueryCustAllInfoMore({ custNo: customerCode }),
          ]).then((res2: any) => {
            props.setLoading(false);
            const [res3,res4] = res2;
            const { records: records3 = [] } = res3;
            const { records: records4 = [] } = res4;
            setState({
              ...state,
              allInfo: {...lodash.get(records3, '[0]', {}),...lodash.get(records4, '[0]', {})},
              visible1: false,
              modalLoading1: false,
            })
          });
        }).catch((err: any) => message.error(err.note || err.message));
      }
    });
  }
  const handleSubmit2 = (e: React.FormEvent): void => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        setState({ ...state, modalLoading2: true });
        const params = {
          ...values,
          khh: Number(customerCode),
          way: Number(values.way) === -99 ? null : Number(values.way),
          choose: values.choose.reduce((total: number, currentValue: string) => total + Number(currentValue), 0),
          education: Number(values.education) === -99 ? null : Number(values.education),
          maritalStatus: Number(values.maritalStatus) === -99 ? null : Number(values.maritalStatus),
          occupation: Number(values.occupation) === -99 ? null : Number(values.occupation),
          earn: values.earn === '-99' ? '' : values.earn,
        };
        props.setLoading(true);
        UpdateCharacteristicInfo(params).then((res: any) => {
          setState({ ...state, visible2: false, modalLoading2: false })
          const { note = '操作成功' } = res;
          message.success(note);
          Promise.all([
            QueryCustAllInfo({ custNo: customerCode }),
            QueryCustAllInfoMore({ custNo: customerCode }),
          ]).then((res2: any) => {
            props.setLoading(false);
            const [res3,res4] = res2;
            const { records: records3 = [] } = res3;
            const { records: records4 = [] } = res4;
            setState({
              ...state,
              allInfo: {...lodash.get(records3, '[0]', {}),...lodash.get(records4, '[0]', {})},
              visible2: false,
              modalLoading2: false,
            })
          });
        }).catch((err: any) => message.error(err.note || err.message));
      }
    });
  }
  const handleSubmit3 = (e: React.FormEvent): void => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        setState({ ...state, modalLoading3: true });
        const params = {
          ...values,
          khh: Number(customerCode),
          kind: state.mode === Mode.add ? 2 : 3,
          relationId: Number(values.relationId) === -99 ? null : Number(values.relationId),
          phone: Number(values.phone),
        };
        // 修改传选中条目 id
        if (state.mode === Mode.modify) {
          params.entryId = state.dataSource2[state.selected].id;
        }
        props.setLoading(true);
        UpdaterelationshipInfo(params).then((res: any) => {
          setState({ ...state, visible3: false, modalLoading3: false })
          const { note = '操作成功' } = res;
          message.success(note);
          QuerySocialRelationsInformation({ custNo: customerCode, paging: 1, current: state.current, pageSize: state.pageSize }).then((res1: any) => {
            props.setLoading(false);
            const { records: records1 = [], total = 0 } = res1;
            setState({
              ...state,
              dataSource2: records1.map((item: any, index: number) => ({ ...item, key: index })),
              total,
              visible3: false,
              modalLoading3: false,
            })
          })
        }).catch((err: any) => message.error(err.note || err.message));
      }
    });
  }

  const handleCheckboxChange = (text: number): void => {
    setState({ ...state, selected: text })
  }

  const handlePageChange = (current: number, pageSize: number | undefined = state.pageSize) => {
    setState({ ...state, current, pageSize });
    props.setLoading(true);
    QuerySocialRelationsInformation({ custNo: customerCode, paging: 1, current, pageSize }).then((res1: any) => {
      props.setLoading(false);
      const { records: records1 = [], total = 0 } = res1;
      setState({
        ...state,
        dataSource2: records1.map((item: any, index: number) => ({ ...item, key: index })),
        total,
        current,
        pageSize,
      });
    })
  }

  const getAccountDetail = (item:any)=>{
     // 期权 普通 信用账号
    const { optionAccount, ordinaryAccont, creditAccount } = item 
    let account = optionAccount.split(',')[0];
    let accountBox = {
      optionList: [],
      ordinaryList:[],
      creditList:[]
    }
    if (optionAccount!== ''){
      QueryOriNetCommissions({ account }).then((res: any) => {
        const { data } = res
        let obj = {
          name: '',
          title: '',
        };
        obj.name = account;
        obj.title = data;
        (accountBox.optionList as any).push(obj);
        setStateCount({ ...stateCount, allCounType: accountBox });
      })
    }
    // accountType = 1|普通  2|信用 & accounts
    if (ordinaryAccont!== ''){
      QuerySaHaStockRate({ accountType: 1, accounts: ordinaryAccont }).then((res: any) => {
        const { records = [] } = res;
        records.map((item:any)=>{
          if (item.szRate !== ''){
            item.szRate = `${item.szRate}‰`
          }
          if (item.shRate !== '') {
            item.shRate = `${item.shRate}‰`
          }
        })
        accountBox.ordinaryList = records
        setStateCount({ ...stateCount, allCounType: accountBox });
      })
    }
    if (creditAccount !== ''){
      QuerySaHaStockRate({ accountType: 2, accounts: creditAccount }).then((res: any) => {
        const { records = [] } = res;
        records.map((item: any) => {
          if (item.szRate !== '') {
            item.szRate = `${item.szRate}‰`
          }
          if (item.shRate !== '') {
            item.shRate = `${item.shRate}‰`
          }
        })
        accountBox.creditList = records
        setStateCount({ ...stateCount, allCounType: accountBox });
      })
    }
  };

  const handleClick = (account: string, accType: number) => {
    newClickSensors({
      third_module: "客户概况",
      ax_page_name: '全部信息',
      ax_button_name: '费率',
    });
    setState({ ...state, visible: true, account, accType });
  }

  const { customerCode = '', form: { getFieldDecorator }, dictionary: { MDRXX = [], XLDM = [], ZW = [], ZYDM = [], HYZK = [], NSR = [], LXFS = [], SHGX = [] } } = props;
  const { allInfo = {}, current, pageSize, total, } = state;
  const { allCounType = {}} = stateCount
  console.log(allInfo, allCounType)
  return <div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '0 25px 20px' }}
      title={<div className="ax-card-title">基本信息</div>}
    >
      <Row style={{ padding: '11px 0', borderBottom: '1px solid #EBECF2' }}>
        <Col span={8} className={styles.basicInfoCol}><span>客户姓名：</span><span>{allInfo.custNm || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户号：</span><span>{allInfo.custId || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户性别：</span><span>{allInfo.custSex || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户全称：</span><span>{allInfo.fullName || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户类型：</span><span>{allInfo.custSrc || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户状态：</span><span>{allInfo.custState || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>开户日期：</span><span>{allInfo.openAcconTm || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>证件类型：</span><span>{allInfo.certifType || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>证件编号：</span><span>{allInfo.certifNm || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>证件有效期：</span><span>{allInfo.validPeriod || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>客户级别：</span><span>{allInfo.custLevel || '-'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>活跃度级别：</span><span>{allInfo.activity || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>开户方式：</span><span>{allInfo.openAcconType || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>风险评测结果：</span><span>{allInfo.riskAssesResult || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>风险测评日期：</span><span>{allInfo.riskAssesTm || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>交易年限：</span><span>{allInfo.tradingYear || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>投资期限：</span><span>{allInfo.invesYear || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol} style={{ display: 'flex' }}>
          <span>普通资金账户：</span>
          {
            allCounType.ordinaryList.length>0 ? allCounType.ordinaryList.map((item: any, index: number) => (
              <div key={index} style={{ color: '#1A2243' }}>
                <span>{item.account}</span>
                <span style={{ cursor: 'pointer', color: '#244FFF' }}
                 onClick={() => handleClick(item.account, 1)}>
                  (深A/沪A股票费率: {item.szRate == item.shRate ? (item.szRate !== '' ? item.szRate : '--/--') : ((`${item.szRate} / ${item.shRate}`))})
                   </span>
                {index < (allCounType.ordinaryList.length - 1) && '、'}
              </div>
            )) : '--'
          }
        </Col>

        <Col span={8} className={styles.basicInfoCol} style={{ display: 'flex' }}>
          <span>信用资金账户：</span>
          {
            allCounType.creditList.length > 0 ? allCounType.creditList.map((item: any, index: number) => (
              <div key={index} style={{ color: '#1A2243' }}>
                <span>{item.account}</span>
                <span style={{ cursor: 'pointer', color: '#244FFF' }}
                  onClick={() => handleClick(item.account, 2)}>
                  (深A/沪A股票费率: {item.szRate == item.shRate ? (item.szRate !== '' ? item.szRate : '--/--') : ((`${item.szRate} / ${item.shRate}`))})
                </span>
                {index < (allCounType.creditList.length - 1) && '、'}
              </div>
            )) : '--'
          }
        </Col>
        {/* <Col span={8} className={styles.basicInfoCol}><span>股票期权资金账户：</span><span>{(allInfo.optionAccount || '--').split(',')}</span></Col> */}
        <Col span={8} className={styles.basicInfoCol} style={{ display: 'flex' }}>
          <span>股票期权资金账户：</span>
          {
            allCounType.optionList.length>0 ? allCounType.optionList.map((item: any, index: number) => (
              <div key={index}>
                <span>{item.name}</span>
                <span style={{ color: '#244FFF' }}>（{item.title}元/张）</span>
                {index < ((allCounType.optionList.length - 1)) && '、'}
              </div>
            )) : '--'
          }
        </Col>
        <Col span={8} className={styles.basicInfoCol}><span>沪A股东代码：</span><span>{allInfo.shangHaiA || '--'}</span></Col>
        <Col span={8} className={styles.basicInfoCol}><span>深A股东代码：</span><span>{allInfo.shenZhenA || '--'}</span></Col>
        <Col span={16} className={styles.basicInfoCol}><span>投资品种：</span><span>{allInfo.invesVares || '--'}</span></Col>
      </Row>
      <Row style={{ padding: '19px 0 14px' }}>已开通业务：</Row>
      <Table
        rowKey='key'
        loading={state.loading1}
        columns={columns1}
        dataSource={state.dataSource1}
        className={`m-table-customer ${styles.table}`}
        pagination={false}
        locale={locale}
      />
    </Card>

    <div style={{ height: 12 }}></div>

    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '11px 25px' }}
      title={<div className="ax-card-title">联系方式</div>}
      extra={<div style={{ cursor: 'pointer' }} onClick={() => setState({ ...state, visible1: true })}><span><img src={edit_black} /></span><span style={{ marginLeft: 5, color: '#61698C' }}>修改个人信息</span></div>}
    >
      <Col span={8} className={styles.basicInfoCol}><span>柜台手机：</span><span>{allInfo.phone || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>CRM服务电话：</span><span>{allInfo.crmPhone || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>紧急联系电话：</span><span>{allInfo.urgentPhone || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>微信号：</span><span>{allInfo.wxCode || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>QQ：</span><span>{allInfo.qq || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>Email：</span><span>{allInfo.email || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>家庭电话：</span><span>{allInfo.telephone || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>邮政编码：</span><span>{allInfo.postalCode || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>工作单位：</span><span>{allInfo.employer || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>公司电话：</span><span>{allInfo.companyPhone || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>家庭地址：</span><span>{allInfo.familyAddress || '--'}</span></Col>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '11px 25px' }}
      title={<div className="ax-card-title">个性化信息</div>}
      extra={<div style={{ cursor: 'pointer' }} onClick={() => setState({ ...state, visible2: true })}><span><img src={edit_black} /></span><span style={{ marginLeft: 5, color: '#61698C' }}>修改个性化信息</span></div>}
    >
      <Col span={8} className={styles.basicInfoCol}><span>偏好联系方式：</span><span>{allInfo.preferred || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>免打扰选项：</span><span>{allInfo.notDisturb || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>学历：</span><span>{allInfo.education || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>婚姻状况：</span><span>{allInfo.maritalStatus || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>职业：</span><span>{allInfo.profession || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>爱好：</span><span>{allInfo.hobby || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>个性特征：</span><span>{allInfo.feature || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>投资兴趣：</span><span>{allInfo.invesInterest || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span style={{ visibility: 'hidden' }}>--</span><span></span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>特殊需求/忌讳：</span><span>{allInfo.taboo || '--'}</span></Col>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '11px 25px' }}
      title={<div className="ax-card-title">风险事件</div>}
    >
      <Col span={8} className={styles.basicInfoCol}><span>诉讼时间：</span><span>{allInfo.litigationTm || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>违约时间：</span><span>{allInfo.breachTm || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>违约类型：</span><span>{allInfo.breachTy || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>是否两融黑名单：</span><span>{allInfo.twoFusion || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>是否反洗钱黑名单：</span><span>{allInfo.antiMoney || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>是否自主申报不良诚信记录：</span><span>{allInfo.badIntegrity || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>违约摘要：</span><span>{allInfo.summary || '--'}</span></Col>
      <Col span={8} className={styles.basicInfoCol}><span>诉讼事项：</span><span>{allInfo.thing || '--'}</span></Col>
    </Card>
    <div style={{ height: 12 }}></div>
    <Card
      className={`ax-card ${styles.card}`}
      bordered={false}
      bodyStyle={{ padding: '18px 25px 11px' }}
      title={<div className="ax-card-title">社会关系</div>}
      extra={<div style={{ cursor: 'pointer', color: '#61698C' }}><span><img src={edit_black} /></span><span style={{ marginLeft: 5 }} onClick={() => setState({ ...state, visible3: true, mode: Mode.add })}>新增/</span><span onClick={() => { if (state.dataSource2.length) { setState({ ...state, visible3: true, mode: Mode.modify }); } else { message.warning('请选择关系条目!') } }}>修改社会关系</span></div>}
    >
      <Table
        rowKey='key'
        loading={state.loading2}
        columns={columns2}
        dataSource={state.dataSource2}
        className={`m-table-customer ${styles.table}`}
        pagination={false}
        locale={locale}
      />
      <div style={{ textAlign: 'right' }}>
        <Pagination
          style={{ margin: '20px 0 0' }}
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination}`}
          pageSizeOptions={['10', '20', '40']}
          showTotal={(total) => <div style={{ fontSize: 12 }}>{`总共${total}条`}</div>}
          pageSize={pageSize}
          current={current}
          total={total}
          onChange={handlePageChange}
          onShowSizeChange={(current, pageSize) => handlePageChange(1, pageSize)}
        />
      </div>
    </Card>

    <Modal
      visible={state.visible1}
      title={<div style={{ color: '#1A2243' }}>修改个人信息</div>}
      footer={null}
      onCancel={() => { setState({ ...state, visible1: false }); }}
      bodyStyle={{ padding: '20px 0' }}
      width={800}
      destroyOnClose
    >
      {
        state.visible1 &&
        <Spin spinning={state.modalLoading1}>
          <Form onSubmit={handleSubmit1} className={styles.form}>
            <Row>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="柜台手机">
                {getFieldDecorator('gtsj', { initialValue: allInfo.phone })(
                  <Input disabled />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="CRM服务电话">
                {getFieldDecorator('servicePhone', { initialValue: allInfo.crmPhone, rules: [{ required: true, message: '必填' }, { pattern: /[0-9]*/, message: '非法字符' }] })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="紧急联系电话">
                {getFieldDecorator('ugentPhone', { initialValue: allInfo.urgentPhone })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="家庭电话">
                {getFieldDecorator('familyPhone', { initialValue: allInfo.telephone })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="微信号">
                {getFieldDecorator('weixin', { initialValue: allInfo.wxCode })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="QQ">
                {getFieldDecorator('qq', { initialValue: allInfo.qq })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="EMAIL">
                {getFieldDecorator('email', { initialValue: allInfo.email })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="邮政编码">
                {getFieldDecorator('code', { initialValue: allInfo.postalCode, rules: [{ pattern: /^[1-9][0-9]{5}$/, message: '请输入正确的邮政编码' }] })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={24}><Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="家庭地址">
                {getFieldDecorator('adress', { initialValue: allInfo.familyAddress })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="公司电话">
                {getFieldDecorator('companyPhone', { initialValue: allInfo.companyPhone })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="工作单位">
                {getFieldDecorator('work', { initialValue: allInfo.employer })(
                  <Input />)}
              </Form.Item></Col>
            </Row>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' onClick={() => setState({ ...state, visible1: false })} >取消</Button>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' htmlType='submit'>保存</Button>
            </div>
          </Form>
        </Spin>
      }
    </Modal>

    <Modal
      visible={state.visible2}
      title={<div style={{ color: '#1A2243' }}>修改个性化信息</div>}
      footer={null}
      onCancel={() => { setState({ ...state, visible2: false }); }}
      bodyStyle={{ padding: '20px 0' }}
      width={800}
      destroyOnClose
    >
      {
        state.visible2 &&
        <Spin spinning={state.modalLoading2}>
          <Form onSubmit={handleSubmit2} className={styles.form}>
            <Row>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="偏好联系方式">
                {getFieldDecorator('way', { initialValue: LXFS.find((item: any) => item.note === allInfo.preferred)?.ibm || '-99' })(
                  <Select>
                    {
                      [{ ibm: '-99', note: '请选择' }].concat(LXFS).map((item: any) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                    }
                  </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="年收入">
                {getFieldDecorator('earn', { initialValue: NSR.find((item: any) => item.note === allInfo.annualIncome)?.ibm || '-99' })(
                  <Select>
                    {
                      [{ ibm: '-99', note: '请选择' }].concat(NSR).map((item: any) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                    }
                  </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="学历">
                {getFieldDecorator('education', { initialValue: XLDM.find((item: any) => item.note === allInfo.education)?.ibm || '-99' })(
                  <Select>
                    {
                      [{ ibm: '-99', note: '请选择' }].concat(XLDM).map((item: any) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                    }
                  </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="婚姻状况">
                {getFieldDecorator('maritalStatus', { initialValue: HYZK.find((item: any) => item.note === allInfo.maritalStatus)?.ibm || '-99' })(
                  <Select>
                    {
                      [{ ibm: '-99', note: '请选择' }].concat(HYZK).map((item: any) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                    }
                  </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="职业">
                {getFieldDecorator('occupation', { initialValue: ZYDM.find((item: any) => item.note === allInfo.profession)?.ibm || '-99' })(
                  <Select>
                    {
                      [{ ibm: '-99', note: '请选择' }].concat(ZYDM).map((item: any) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                    }
                  </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="职务">
                {getFieldDecorator('post', { initialValue: allInfo.jobTitle })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={24}><Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="免打扰选项">
                {getFieldDecorator('choose', {
                  initialValue: allInfo.notDisturb.split(',').reduce((result: string[], currentValue: string) => {
                    const selectedValue = MDRXX.find((item: any) => item.note === currentValue)?.ibm;
                    if (selectedValue) result.push(selectedValue);
                    return result;
                  }, [])
                })(
                  <Checkbox.Group options={MDRXX.map((item: any) => ({ label: item.note, value: item.ibm }))} />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="爱好">
                {getFieldDecorator('hobby', { initialValue: allInfo.hobby })(
                  <Input.TextArea />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="个性特征">
                {getFieldDecorator('features', { initialValue: allInfo.feature })(
                  <Input.TextArea />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="特殊需求/忌讳">
                {getFieldDecorator('characteristic', { initialValue: allInfo.taboo })(
                  <Input.TextArea />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="投资兴趣">
                {getFieldDecorator('interest', { initialValue: allInfo.invesInterest })(
                  <Input.TextArea />)}
              </Form.Item></Col>
            </Row>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' onClick={() => setState({ ...state, visible2: false })} >取消</Button>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' htmlType='submit'>保存</Button>
            </div>
          </Form>
        </Spin>
      }
    </Modal>

    <Modal
      visible={state.visible3}
      title={<div style={{ color: '#1A2243' }}>{(state.mode === Mode.add ? '新增' : '修改') + '社会关系'}</div>}
      footer={null}
      onCancel={() => { setState({ ...state, visible3: false }); }}
      bodyStyle={{ padding: '20px 0' }}
      width={800}
      destroyOnClose
    >
      {
        state.visible3 &&
        <Spin spinning={state.modalLoading3}>
          <Form onSubmit={handleSubmit3} className={styles.form}>
            <Row>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="关系人">
                {getFieldDecorator('relationName', { initialValue: state.mode === Mode.modify ? state.dataSource2[state.selected].relatedPerson : '' })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="关系">
                {getFieldDecorator('relationId', { initialValue: state.mode === Mode.modify ? SHGX.find((item: any) => item.ibm === state.dataSource2[state.selected].relatedName)?.ibm || '-99' : '-99' })(
                  <Select>
                    {
                      [{ ibm: '-99', note: '请选择' }].concat(SHGX).map((item: any) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)
                    }
                  </Select>)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="手机">
                {getFieldDecorator('phone', { initialValue: state.mode === Mode.modify ? state.dataSource2[state.selected].phone : '', rules: [{ pattern: /[0-9]*/, message: '非法字符' }] })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="联系电话">
                {getFieldDecorator('phoneNumber', { initialValue: state.mode === Mode.modify ? state.dataSource2[state.selected].telePhone : '' })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={24}><Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 6 }} label="电子邮箱">
                {getFieldDecorator('email', { initialValue: state.mode === Mode.modify ? state.dataSource2[state.selected].email : '' })(
                  <Input />)}
              </Form.Item></Col>
              <Col span={12}><Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} label="备注">
                {getFieldDecorator('note', { initialValue: state.mode === Mode.modify ? state.dataSource2[state.selected].remark : '' })(
                  <Input.TextArea />)}
              </Form.Item></Col>
            </Row>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ margin: '8px 35px 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small' onClick={() => setState({ ...state, visible3: false })} >取消</Button>
              <Button style={{ minWidth: 60, height: 30, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue' htmlType='submit'>保存</Button>
            </div>
          </Form>
        </Spin>
      }
    </Modal>

    <RateModal account={state.account} mode={state.accType} visible={state.visible} setVisible={(visible: boolean) => setState({ ...state, visible })} />
  </div>
}
export default connect(({ global }: any) => ({
  dictionary: global.dictionary,
}))(Form.create()(BasicInfo));
