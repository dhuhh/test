import { FC, useState, useEffect, useRef, ReactNode } from 'react';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { Modal, Select, InputNumber, Button, Input, DatePicker } from 'antd';
import { getDictKey } from '$utils/dictUtils';
import styles from './index.less';
import { CustomizeSelect } from '../../Common/UniversalTool';
import AccountDepartment from './AccountDepartment';
import CustomizeRangePicker from './CustomizeRangePicker';
import MultipleSearchInput from './MultipleSearchInput/index.js';
import CodeModalContent from './CodeModalContent';
import add from '$assets/add-button.png';

interface controlItem {
  name: string, // 组件的标识名称, 控制组件是否显示
  orderNum?: number, // 组件排列顺序，不传默认为组件数组对应的下标
  dateLabel?: string, // 几个日期选择组件的标签名
  isDescribe?: boolean, // 日期选择是否包含下方的描述信息
  label?: string, // CustomizeSelect类型的选择组件是否覆盖默认的标签名;
  selectItem?: selectOption[], // CustomizeSelect类型的选择组件是否覆盖默认的选择项信息
  intervalLabel?: string, // 区间类型的标签
  inputItem?: inputOption, // input输入框类型
  isCusMultiple?: boolean, // CustomizeSelect类型组件是否多选
  isDefaultValue?: boolean, // CustomizeSelect类型组件是否强制默认初始值为第一个
  rankRangeDefaultValue?: number, // 排名范围默认值
}

type Props = Readonly<{
  queryData: any, // 查询
  getAllParams: Function, // 获取所有组件值
  controlList: controlItem[], // 组件列表
  dictionary: any,
  sysParam: any[],
  tokenAESEncode: string,
  hasDateDefault?: boolean, // 日期选择组件是否有默认值
}>

interface selectOption {
  name: string, // 名称
  value: string | number, // 选择对应的值
}

interface inputOption {
  label: string, // 标签名称
  tipContent?: string, // 提示内容
}

interface selectItem {
  name: string, // 对应的标识名称
  label: string, // 标签名
  selectItem: selectOption[], // 选择项信息
  isMultiple?: boolean, // 是否多选
  isSinReset?: boolean, // 单选是否可取消
  isDefaultValue?: boolean, // 强制默认初始值为第一个
}

interface dicObj { 
  fldm: string,
  flmc: string,
  ibm: string, // 字典项的值
  note: string,
}

interface dataItem {
  stockCode: string, // 证券代码
  stockName: string // 名称
}

const SearchContent: FC<Props> = (props) => {
  const allCusSelectValue = useRef([]); // 所有CustomizeSelect类型组件的值

  // 根据类型获取对应组件携带的入参
  const getCorrespondPropsValue = (name: string, type: string) => {
    const orderNum = props.controlList.find(opt => opt.name === name)?.orderNum;
    switch(type) {
      case 'orderNum': 
        return orderNum !== undefined ? orderNum : nameList.indexOf(name);
      case 'dateLabel':
        return props.controlList.find(opt => opt.name === name)?.dateLabel || '';
      case 'isDescribe':
        return props.controlList.find(opt => opt.name === name)?.isDescribe || false;
      case 'intervalLabel':
        return props.controlList.find(opt => opt.name === name)?.intervalLabel || '';
      case 'inputLabel': 
        return props.controlList.find(opt => opt.name === name)?.inputItem?.label || '';
      case 'tipContent': 
        return props.controlList.find(opt => opt.name === name)?.inputItem?.tipContent || '';
      case 'isCusMultiple':
        return props.controlList.find(opt => opt.name === name)?.isCusMultiple || false;
      case 'isDefaultValue':
        return props.controlList.find(opt => opt.name === name)?.isDefaultValue || false;
      case 'selectItem': 
        return props.controlList.find(opt => opt.name === name)?.selectItem || '';
      case 'label': 
        return props.controlList.find(opt => opt.name === name)?.label || '';
      case 'rankRangeDefaultValue':
        return props.controlList.find(opt => opt.name === name)?.rankRangeDefaultValue || undefined;
    }
  }

  const [selectDept, setSelectDept] = useState<string[]>([]); // 开户营业部选中的值
  const [custGrup, setCustGrup] = useState<string[]>([]); // 客户群数据
  const [addVisible, setAddVisible] = useState<boolean>(false); // 客户群添加按钮弹窗
  const [khly, setKhly] = useState<number | undefined>(undefined); // 客户来源选中的值
  const [pmtj, setPmtj] = useState<string>(props.dictionary[getDictKey('pmtj')]?.slice(0,1)?.ibm || '1'); // 排名条件选中的值
  const [dateValue, setDateValue] = useState<any[]>([undefined, undefined]); // 日期选择类型数据
  const [monthValue, setMonthValue] = useState<any[]>([undefined, undefined]); // 月份选择类型数据
  const [datePickerValue, setDatePickerValue] = useState<any>(moment(moment().subtract(1, 'days').format('YYYYMMDD'), 'YYYY-MM-DD')); // 日期数据
  const [channel, setChannel] = useState<string[]>([]); // 渠道选择的数据
  const [rankRange, setRankRange] = useState<number | undefined>(getCorrespondPropsValue('rankingRange', 'rankRangeDefaultValue') as number); // 排名范围
  const [securitiesCode, setSecuritiesCode] = useState<dataItem[]>([]); // 证券代码数据
  const [codeVisible, setCodeVisible] = useState<boolean>(false); // 证券代码弹窗
  const [intervalMin, setIntervalMin] = useState<number | undefined>(undefined); // 区间组件最小值
  const [intervalMax, setIntervalMax] = useState<number | undefined>(undefined); // 区间组件最大值
  const [inputValue, setInputValue] = useState<string>(''); // input框输入内容
  const [tags, setTags] = useState<string[]>([]); // 客户标签选择的值
  const [excludeCusValue, setExcludeCusValue] = useState<number>(1); // 剔除非中端富裕客户
  const [isReset, setIsReset] = useState<number>(0); // CustomizeSelect类型组件统一控制是否重置

  // 监听证券代码选择框，点击打开弹窗
  useEffect(() => {
    const element = document.getElementById('securitiesCode');
    if(element) element.addEventListener('click', () => { setCodeVisible(true) });
    return element?.removeEventListener('click', () => { setCodeVisible(true) });
  }, [])

  useEffect(() => {
    getDefaultValue();
  }, [JSON.stringify(allCusSelectValue.current.find((item: any) => item.name === 'transactionTime'))])

  useEffect(() => {
    getParams();
  }, [JSON.stringify(selectDept), JSON.stringify(custGrup), khly, pmtj, JSON.stringify(dateValue), 
  JSON.stringify(monthValue),JSON.stringify(datePickerValue) , JSON.stringify(channel), rankRange, JSON.stringify(securitiesCode),
  intervalMin, intervalMax, inputValue, JSON.stringify(tags), excludeCusValue])

  // 页面传入的组件标识名称数组
  const nameList = props.controlList.map((item) => item.name);

  // 获取日期默认范围
  const getDefaultValue = () => {
    const tpmValue = allCusSelectValue.current.find((item: any) => item.name === 'transactionTime');
    if(tpmValue && tpmValue['value'] === '1') { // 历史提交
      if(props.hasDateDefault) { // 默认范围
        setDateValue([moment(moment().subtract(1, 'year').subtract(1, 'month').format('YYYYMMDD'), 'YYYY-MM-DD'), moment(moment().subtract(1, 'year').format('YYYYMMDD'), 'YYYY-MM-DD')]);
      } else {
        setDateValue([undefined, undefined]);
      }
      setMonthValue([moment(moment().subtract(1, 'year').subtract(1, 'month').format('YYYYMM'), 'YYYY-MM'), moment(moment().subtract(1, 'year').format('YYYYMM'), 'YYYY-MM')]);
    } else {
      if(props.hasDateDefault && getCorrespondPropsValue('dateSelection', 'dateLabel') === '新增日期') {
        setDateValue([moment(moment().startOf('year').format('YYYYMMDD'), 'YYYY-MM-DD'), moment(moment().format('YYYYMMDD'), 'YYYY-MM-DD')]);
      } else if(props.hasDateDefault) {
        setDateValue([moment(moment().subtract(1, 'month').format('YYYYMMDD'), 'YYYY-MM-DD'), moment(moment().format('YYYYMMDD'), 'YYYY-MM-DD')]);
      } else {
        setDateValue([undefined, undefined]);
      }
      if(['成交时间从', '交易起止日期'].includes(getCorrespondPropsValue('monthSelection', 'dateLabel') as string)) {
        setMonthValue([moment(moment().subtract(3, 'month').format('YYYYMM'), 'YYYY-MM'), moment(moment().format('YYYYMM'), 'YYYY-MM')]);
      } else {
        setMonthValue([moment(moment().subtract(1, 'month').format('YYYYMM'), 'YYYY-MM'), moment(moment().format('YYYYMM'), 'YYYY-MM')]);
      }
    }
  }

  const getParams = () => {
    // 所有组件参数传给父组件, name默认为组件标识名，特殊地方注释标出
    if(props.getAllParams) {
      props.getAllParams([
        { name: 'accountOpeningDepartment', value: selectDept },
        { name: 'custGrup', value: custGrup },
        { name: 'custSource', value: khly },
        { name: 'rankingConditions', value: pmtj },
        { name: 'dateSelection', value: dateValue },
        { name: 'monthSelection', value: monthValue },
        { name: 'datePicker', value: datePickerValue },
        { name: 'channel', value: channel }, // 客户来源-渠道选择
        { name: 'rankingRange', value: rankRange },
        { name: 'securitiesCode', value: securitiesCode.map((item: dataItem) => item.stockCode) },
        { name: 'intervalMin', value: intervalMin }, // 区间最小值
        { name: 'intervalMax', value: intervalMax }, // 区间最大值
        { name: 'inputBox', value: inputValue },
        { name: 'customerLabel', value: tags },
        { name: 'excludeCus', value: excludeCusValue },
        ...allCusSelectValue.current, // 所有CustomizeSelect类型组件的值, name参考allCustomizeSelectList
      ]);
    }
  }

  // 将字典数据转化为allCustomizeSelectList 中 selectItem的格式
  const dicToCusSelectList = (dicList: any[]) => {
    if(dicList.length > 0) {
      return dicList.map((item) => {
        return { name: item?.note, value: item?.ibm };
      })
    }
    return [];
  }

  // 所有自定义选择类型的组件
  const allCustomizeSelectList: selectItem[] = [
    { name: 'transactionTime', label: '成交时间', selectItem: [{ name: '近期成交', value: '0' }, { name: '历史成交', value: '1' }] },
    { name: 'customerAttribution', label: getCorrespondPropsValue('customerAttribution', 'label') as string || '客户归属', selectItem: [{ name: '直属', value: 1 }, { name: '所辖', value: 2 }, { name: '所有', value: 4 }] },
    { name: 'assetFlow', label: '资产流向', selectItem: [{ name: '资产净流入', value: 1 }, { name: '资产流入', value: 2 }, { name: '资产流出', value: 3 }] },
    { name: 'rankOrder', label: '排名顺序', selectItem: [{ name: '从大到小', value: 1 }, { name: '从小到大', value: 2 }] },
    { name: 'customerLever', label: '客户级别', isMultiple: true, isDefaultValue: getCorrespondPropsValue('customerLever', 'isDefaultValue') as boolean, selectItem: [{ name: 'V1', value: '1' }, { name: 'V2', value: '2' }, { name: 'V3', value: '3' }, { name: 'V4', value: '4' }, { name: 'V5', value: '5' }, { name: 'V6', value: '6' }, { name: 'V7', value: '7' }] },
    { name: 'relationshipType', label: '关系类型', isSinReset: true, isDefaultValue: true, isMultiple: getCorrespondPropsValue('relationshipType', 'isCusMultiple') as boolean , selectItem: [{ name: '服务关系', value: 1 }, { name: '期权服务关系', value: 3 }, { name: '开发关系', value: 10 }, { name: '无效户激活', value: 11 }, { name: '业务开发关系', value: 20 }] },
    { name: 'addReason', label: '新增原因', isMultiple: true, selectItem: getCorrespondPropsValue('addReason', 'selectItem') as selectOption[]  || [{ name: '指定交易和转托管入', value: 1 }, { name: '存量客户资产增长', value: 2 }, { name: '资金转入', value: 3 }] },
    { name: 'reduceReason', label: '减少原因', isMultiple: true, selectItem: [{ name: '撤指定或转托管转出', value: 1 }, { name: '存量客户资产减少', value: 2 }, { name: '资金转出', value: 3 }] },
    { name: 'rankConditions', label: '排行条件', selectItem: getCorrespondPropsValue('rankConditions', 'selectItem') as selectOption[] || [{ name: '持股市值', value: 1 }, { name: '持股股数', value: 2 }, { name: '持有人数', value: 3 }] },
    { name: 'varietyRange', label: '品种范围', isMultiple: true, selectItem: dicToCusSelectList(props.dictionary[getDictKey('pzfw')] || []) },
    { name: 'marketRange', label: '市场范围', isMultiple: true, selectItem: dicToCusSelectList(props.dictionary[getDictKey('scfw')] || []) },
    { name: 'investorLevel', label: '投资者级别', isSinReset: true, isDefaultValue: getCorrespondPropsValue('investorLevel', 'isDefaultValue') as boolean, selectItem: [{ name: '一级投资者', value: 1 }, { name: '二级投资者', value: 2 }, { name: '三级投资者', value: 3 }] },
    { name: 'queryMethod', label: '查询方式', selectItem: [{ name: '明细', value: 1 }, { name: '统计', value: 2 }] },
  ];

  // 开户营业部选中值发生变化
  const selectDeptChange = (dept: string[]) => {
    setSelectDept(dept);
  }

  // 日期选择组件选择日期发生变化
  const dateChange = (value: any) => {
    setDateValue(value);
  }

  // 月份选择组件选择日期发生变化
  const monthChange = (value: any) => {
    setMonthValue(value);
  }

  // 计算日期组件下方描述距离左侧的距离
  const getDescribeLeft = (str: string): number => {
    // 针对label全是汉字的情况，一个汉字width为14，加上固定距离为8
    const len = str.length;
    return len * 14 + 8;
  }

  // 证券代码内容显示
  const maxTagPlaceholder = (value: string[]) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  // 获取资产流向当前选中对应的标签名
  const getAssetFlowName = () => {
    const tpmValue = allCusSelectValue.current.find((item: any) => item.name === 'assetFlow');
    let name: string | undefined = '';
    if(tpmValue) {
      allCustomizeSelectList.forEach((item) => {
        if(item.name === 'assetFlow') {
          name = item.selectItem.find(opt => opt.value === tpmValue['value'])?.name;
        }
      })
    }
    return name;
  }

  // 获取月份选择下方默认的描述信息
  const getDescribeContent = (type: string) => {
    if(type === 'month' && getCorrespondPropsValue('monthSelection', 'isDescribe')) {
      const tpmValue = allCusSelectValue.current.find((item: any) => item.name === 'transactionTime');
      if(tpmValue && tpmValue['value'] === '1') {
        return `历史可查日期区间为: ${moment().subtract(1, 'year').format('YYYYMM')}之前的历史信息`;
      } else {
        return `近期可查日期区间为: ${moment().subtract(1, 'year').format('YYYYMM')}-本月`;
      }
    } else if(type === 'date' && getCorrespondPropsValue('dateSelection', 'isDescribe')) {
      const tpmValue = allCusSelectValue.current.find((item: any) => item.name === 'transactionTime');
      if(tpmValue && tpmValue['value'] === '1') {
        return `历史可查日期区间为: 归档日${moment().subtract(1, 'year').format('YYYYMMDD')}之前的历史信息`;
      } else {
        return `近期可查日期区间为: ${moment().subtract(1, 'year').format('YYYYMMDD')}-上一交易日的信息`;
      }
    } else {
      return '';
    }
  }

  // 获取选中证券代码的值
  const getCodeList = (value: dataItem[]) => {
    setSecuritiesCode(value);
  } 

  // 关闭证券代码弹窗
  const closeCodeModal = () => {
    setCodeVisible(false);
  }

  // 获取所有CustomizeSelect类型组件的值
  const getCusSelectValue = (item: any) => {
    const tmpList = cloneDeep(allCusSelectValue.current);
    // 存在就替换
    allCusSelectValue.current.forEach((opt: any, index) => {
      if(item.name === opt.name) {
        tmpList.splice(index, 1, item);
      }
    })
    // 不存在添加
    if(!allCusSelectValue.current.some((cus: any) => {
      return cus.name === item.name;
    })) {
      tmpList.push(item);
    }
    allCusSelectValue.current = tmpList;
    getParams();
  } 

  

  const reset = () => {
    setIsReset(isReset + 1);
    setSelectDept([]);
    setCustGrup([]);
    setKhly(undefined);
    setDateValue([undefined, undefined]);
    setMonthValue([undefined, undefined]);
    setRankRange(undefined);
    setIntervalMin(undefined);
    setIntervalMax(undefined);
    setInputValue('');
    setSecuritiesCode([]);
    setChannel([]);
    setPmtj(props.dictionary[getDictKey('pmtj')]?.slice(0,1)?.ibm || '1');
    setDatePickerValue(undefined);
    setTags([]);
    setExcludeCusValue(1);
  }

  return (
    <div className={styles.searchBox}>
      {
        allCustomizeSelectList.map((item) => {
          return (
            nameList.includes(item.name) && (
              <div className={styles.selectBox} style={{ order: getCorrespondPropsValue(item.name, 'orderNum') as number }} key={item.name}>
                <div className={styles.searchItem}>
                  <CustomizeSelect isReset={isReset} name={item.name} label={item.label} selectItem={item.selectItem} isMultiple={item.isMultiple} isSinReset={item.isSinReset} isDefaultValue={item.isDefaultValue} getCusSelectValue={getCusSelectValue} />
                </div>
              </div>
            )
          );
        })
      }
      {
        nameList.includes('accountOpeningDepartment') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('accountOpeningDepartment', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              {/* 开户营业部 */}
              <AccountDepartment selectDept={selectDept} selectDeptChange={selectDeptChange} />
            </div>
          </div>
        )
      }
      {
        nameList.includes('custGrup') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('custGrup', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              <span className={styles.label}>客户群</span>
              <div style={{ padding: 0 ,border: 0 }} id='custGrup'>
                <MultipleSearchInput value={custGrup} onChange={(custGrup: string[])=>{ setCustGrup(custGrup) }} api='custGrup' maxTagTextLength={6}/>
              </div>
              <img src={add} style={{ marginLeft: '8px', cursor: 'pointer' }} onClick={ () => { setAddVisible(true) } } />
            </div>
            <Modal
              visible={addVisible}
              className={styles.modal}
              onCancel={() => { setAddVisible(false) }}
              width="1080px"
              destroyOnClose
              footer={null}
            >
              {/* 客户群组页面 */}
              <iframe className={styles.iframe} height='630px' width='100%'
                src={`${props.sysParam?.find(i => i.csmc === 'system.c4ym.url')?.csz || ''}/loginServlet?token=${props.tokenAESEncode || ''}&callBackUrl=${encodeURIComponent(encodeURIComponent(`${props.sysParam?.find(i => i.csmc === 'system.c4ym.url')?.csz || ''}/bss/customer/group/page/index.sdo?queryType=1`))}`} 
              />
            </Modal>
          </div>
        )
      }
      {
        nameList.includes('custSource') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('custSource', 'orderNum') as number }}>
            <div className={styles.searchSelectItem}>
              <span className={styles.label}>客户来源</span>
              <Select
                style={{ width: 250, height: 32 }}
                placeholder='请选择'
                value={khly}
                defaultActiveFirstOption={false}
                onChange={(value: number) => { setKhly(value) }}
              >
                <Select.Option key={null} >请选择</Select.Option>
                {(props.dictionary[getDictKey('khly')] || []).map((item: dicObj) => <Select.Option key={item.ibm} value={Number(item.ibm)}>{item.note}</Select.Option>)}
              </Select>
              {/* 渠道选择 */}
              {
                khly === 1 && (
                  <MultipleSearchInput value={channel} onChange={(channel: string[])=>{ setChannel(channel) }} api='channel' maxTagTextLength={6}/>
                ) 
              }
            </div>
          </div>
        )
      }
      {
        nameList.includes('rankingConditions') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('rankingConditions', 'orderNum') as number }}>
            <div className={styles.searchSelectItem}>
              <span className={styles.label}>排名条件</span>
              <Select
                style={{ width: 250, height: 32 }}
                placeholder='请选择'
                value={pmtj}
                defaultActiveFirstOption={false}
                onChange={(value: string) => { setPmtj(value) }}
              >
                {(props.dictionary[getDictKey('pmtj')] || []).map((item: dicObj) => <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>)}
              </Select>
            </div>
          </div>
        )
      }
      {
        nameList.includes('datePicker') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('datePicker', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              <span className={styles.label} style={{ marginRight: '8px' }}>日期</span>
               <DatePicker className={`${styles.datePicker}`} value={datePickerValue} onChange={(value) => { setDatePickerValue(value) }} />
            </div>
          </div>
        )
      }
      {
        nameList.includes('dateSelection') && (
          <div className={styles.datePickerBox} style={{ order: getCorrespondPropsValue('dateSelection', 'orderNum') as number }}>
            <div className={styles.datePickerItem}>
              <span className={styles.label}>{getCorrespondPropsValue('dateSelection', 'dateLabel') as ReactNode}</span>
              <CustomizeRangePicker dateValue={dateValue} dateChange={dateChange} type={'date'} />
            </div>
            { getCorrespondPropsValue('dateSelection', 'isDescribe') && (
              <span className={styles.describeContent} style={{ marginLeft: `${getDescribeLeft(getCorrespondPropsValue('dateSelection', 'dateLabel') as string)}px` }}>{getDescribeContent('date')}</span>
            ) }
          </div>
        )
      }
      {
        nameList.includes('monthSelection') && (
          <div className={styles.datePickerBox} style={{ order: getCorrespondPropsValue('monthSelection', 'orderNum') as number }}>
            <div className={styles.datePickerItem}>
              <span className={styles.label}>{getCorrespondPropsValue('monthSelection', 'dateLabel') as ReactNode}</span>
              <CustomizeRangePicker monthValue={monthValue} monthChange={monthChange} type={'month'} />
            </div>
            { getCorrespondPropsValue('monthSelection', 'isDescribe') && (
              <span className={styles.describeContent} style={{ marginLeft: `${getDescribeLeft(getCorrespondPropsValue('monthSelection', 'dateLabel') as string)}px` }}>{getDescribeContent('month')}</span>
            ) }
          </div>
        )
      }
      {
        nameList.includes('rankingRange') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('rankingRange', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              <span className={styles.label}>排名范围</span>
              <span className={styles.inputSpan}>前</span>
              <InputNumber placeholder='100' className={styles.rangeInput} value={rankRange} onChange={(value)=>{ setRankRange(value) }} min={0} />
              <span className={styles.inputSpan}>名</span>
            </div>
          </div>
        )
      }
      {
        nameList.includes('securitiesCode') && (
          <>
            <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('securitiesCode', 'orderNum') as number }}>
              <div className={`${styles.searchSelectItem}`}>
                <span className={styles.label}>证券代码</span>
                <Select
                  mode='multiple'
                  id='securitiesCode'
                  placeholder='请选择'
                  // style={{ width: 250, height: 32 }}
                  open={false}
                  showArrow={false}
                  value={securitiesCode.map((item: dataItem) => item.stockCode) as any}
                  maxTagCount={3}
                  maxTagPlaceholder={(value: string[]) => maxTagPlaceholder(value)}
                  className={`${styles.mulSelect} ${styles.zqdmSelect}`}
                >
                  {
                    securitiesCode.map((item) => {
                      return (
                        <Select.Option key={item.stockCode} title={item.stockName}>
                          {item.stockName}
                        </Select.Option >
                      )
                    })
                  }
                </Select>
              </div>
            </div>
            <Modal
              title='证券代码选择'
              visible={codeVisible}
              className={`${styles.codeModal}`}
              onCancel={() => { setCodeVisible(false) }}
              width="860px"
              // destroyOnClose
              footer={null}
            >
              <CodeModalContent getCodeList={getCodeList} closeCodeModal={closeCodeModal} />
            </Modal>
          </>
        )
      }
      {/* 区间类型组件, 例如  资产净流入(万)：XXX - XXX */}
      {
        nameList.includes('interval') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('interval', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              <span className={styles.label}>{getCorrespondPropsValue('interval', 'intervalLabel') as ReactNode || `${getAssetFlowName()}(万)`}</span>
              <InputNumber className={styles.rangeInput} value={intervalMin} onChange={(value)=>{setIntervalMin(value);}} min={0} precision={2}/>
              <span style={{ color: '#D1D5E6',margin: '0 8px',width: 12,overflow: 'hidden' }}>—</span>
              <InputNumber className={styles.rangeInput} value={intervalMax} onChange={(value)=>{setIntervalMax(value);}} min={intervalMin} precision={2}/>
            </div>
          </div>
        )
      }
      {/* 最基础input类型输入框组件 */}
      {
        nameList.includes('inputBox') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('inputBox', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              <span className={styles.label}>{getCorrespondPropsValue('inputBox', 'inputLabel') as ReactNode}</span>
              <Input style={{ width: 250, height: 32, marginLeft: 8 }} value={inputValue} placeholder={getCorrespondPropsValue('inputBox', 'tipContent') as string} onChange={(e)=>{ setInputValue(e.target.value); }} />
            </div>
          </div>
        )
      }
      {
        nameList.includes('customerLabel') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('customerLabel', 'orderNum') as number }}>
            <div className={styles.searchItem}>
              <span className={styles.label}>客户标签</span>
              <div style={{ padding: 0 ,border: 0 }} id='tag'>
                <MultipleSearchInput value={tags} onChange={(value: string[]) => {setTags(value);}} source='query' api='tag' maxTagTextLength={6}/>
              </div>
            </div>
          </div>
        )
      }
      {
        nameList.includes('excludeCus') && (
          <div className={styles.selectBox} style={{ order: getCorrespondPropsValue('excludeCus', 'orderNum') as number, display: 'flex', alignItems: 'start', paddingTop: '5px' }}>
            <div className={styles.searchItem}>
              <span className={styles.label} style={{ marginRight: '12px' }}>剔除非中端富裕客户</span>
              <input type='radio' checked={excludeCusValue? true : false} value={excludeCusValue} onClick={() => { if(excludeCusValue === 0) { setExcludeCusValue(1) } else { setExcludeCusValue(0) } }}/>
            </div>
          </div>
        )
      }

      <div className={styles.selectBox} style={{ order: 99 }}>
          <div style={{ margin: '0px 36px 16px 10px', display: 'flex', alignItems: 'center' }}>
            <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginRight: 16 ,borderRadius: 2 }} className='m-btn-radius ax-btn-small' onClick={reset} >重置</Button>
            <Button style={{ minWidth: 60, height: 32, width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' ,borderRadius: 2,boxShadow: 'none' }} className='m-btn-radius ax-btn-small m-btn-blue' onClick={props.queryData} >查询</Button>
          </div>
      </div>
    </div>
  );
}

export default connect(({ global }: any)=>({
  dictionary: global.dictionary,
  sysParam: global.sysParam,
  tokenAESEncode: global.tokenAESEncode,
}))(SearchContent);

