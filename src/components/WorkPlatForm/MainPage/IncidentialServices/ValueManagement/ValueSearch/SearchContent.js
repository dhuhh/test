import React, { Component } from 'react';
import { Col, Row, Form, Input, InputNumber, Button, message, TreeSelect, DatePicker, Select, Icon } from 'antd';
import lodash from 'lodash';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchFuzzyQryCusInfo, FetchExcStaffList ,IntrptCustEr ,QueryFundReferee,QueryStrategyCombine } from '../../../../../../services/incidentialServices';
import { getDictKey } from '../../../../../../utils/dictUtils';
import TreeUtils from '../../../../../../utils/treeUtils';
import SelectCheckbox from '../../Common/SelectCheckbox';
import ExecutiveDepartment from '../../Common/ExecutiveDepartment';
import TipModal from '../../Common/TipModal';
import PopoverAndCard from './PopoverAndCard';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from './index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;

class SearchContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandVisible: false,
      onClickYYB: {},
      sjsdType: '1', // 手机属地选择类型1|城市、2|省份
      sjsd: '', // 手机属地NM
      sjsdId: '', // 手机属地Id
      khyyb: { // 营业部
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      zxbm: { // 执行部门
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      zxbmFid: [],
      zxry: { // 执行人员
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      allYYB: [], // 所有营业部，未分级
      qdObj: [], // 渠道
      zdlxObj: [], // 中断类型
      zdlx: props.zdlx,
      showNum: 4,
      visible: false,
      content: '',
      zdbjList: [],
      status: '1',
      searchValue: '',
      searchValueTwo: '',
      searchValueYyb: '',
      isProd: false,
      level: [{ ibm: '1',note: 'V1' },{ ibm: '2',note: 'V2' },{ ibm: '3',note: 'V3' },{ ibm: '4',note: 'V4' },{ ibm: '5',note: 'V5' },{ ibm: '6',note: 'V6' },{ ibm: '7',note: 'V7' }],
      intrptReason: [],
      opsTypeData: [{ ibm: '港股通权限开通断点',note: '港股通权限开通断点' },{ ibm: '科创板权限开通断点',note: '科创板权限开通断点' },{ ibm: '创业板权限开通断点',note: '创业板权限开通断点' },{ ibm: '新三板权限开通断点',note: '新三板权限开通断点' },{ ibm: '北交所权限开通断点',note: '北交所权限开通断点' }],
      fundReferee: [],
      strategyCombine: [],
    };
    this.fetchExcStaffListDebounce = lodash.debounce(this.fetchExcStaffList, 300);
  }

  componentDidMount() {
    this.refPopver.fetchTitle(this.state.sjsd);
    this.fetchGxyybList();
    this.fetchObjectTable();
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    this.fetchFuzzyQryCusInfo();
    this.intrptCustEr();
    this.queryStrategyCombine();
    // this.queryFundReferee();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  queryStrategyCombine = ()=>{
    QueryStrategyCombine().then(res=>{
      this.setState({
        strategyCombine: res?.records.map(item=>{
          return {
            ibm: item.strategyCode,
            note: item.strategyName,
          };
        }),
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  queryFundReferee = ()=>{
    QueryFundReferee().then(res=>{
      console.log(res);
    });
  }

  intrptCustEr = ()=>{
    IntrptCustEr().then(res=>{
      this.setState({
        intrptReason: res?.records.map(item=>{
          return {
            ibm: item.id,
            note: item.title,
          };
        }),
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchFuzzyQryCusInfo = () => {
    FetchFuzzyQryCusInfo({ cxlx: '5' }).then((res) => {
      const { records = [] } = res;
      const status = lodash.get(records, '[0].stepCode');
      this.setState({ status });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  sortZdbz = (zdbzObjLists) => {
    console.log(zdbzObjLists);
    console.log([...zdbzObjLists].sort((a, b) => a.ibm - b.ibm));
    return [...zdbzObjLists].sort((a, b) => {
      return a.ibm - b.ibm;
    });
  }

  updateDimensions = () => { // 窗口大小改变的时候调整固定
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
    let showNum = 4;
    if (width < 1280) {
      showNum = 2;
    } else if (width < 1600) {
      showNum = 3;
    }
    this.setState({
      showNum,
    });
  }

  // 获取管辖营业部的数据
  fetchGxyybList = (khyyb = this.state.khyyb) => {
    const gxyybCurrent = khyyb;
    fetchUserAuthorityDepartment({ paging: 0, current: 1, pageSize: 10, total: -1, sort: '' }).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        const datas = TreeUtils.toTreeData(records, { keyName: 'yybid', pKeyName: 'fid', titleName: 'yybmc', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        gxyybCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          gxyybCurrent.datas.push(...children);
        });
        gxyybCurrent.dataLoaded = true;
        this.setState({ khyyb: gxyybCurrent, zxbm: JSON.parse(JSON.stringify(gxyybCurrent)), allYYB: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  fetchObjectTable = async () => {
    await FetchFuzzyQryCusInfo({ cxlx: '1' }).then((response) => { // 渠道
      const { records = [] } = response;
      if (Array.isArray(records)) {
        const qdObj = [];
        records.forEach((item) => {
          const Item = {
            ibm: item.cusId,
            note: item.name,
            ...item,
          };
          qdObj.push(Item);
        });
        this.setState({ qdObj });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    await FetchFuzzyQryCusInfo({ cxlx: '2' }).then((response) => { // 中断类型
      const { records = [] } = response;
      if (Array.isArray(records)) {
        const zdlxObj = [];
        records.forEach((item) => {
          const Item = {
            ibm: item.cusId,
            note: item.name,
            ...item,
          };
          !['1','2'].includes(item.cusId) && zdlxObj.push(Item);
        });
        this.setState({ zdlxObj });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  onSearchYyb = (value) => {
    this.setState({
      searchValueYyb: value,
    });
  }
  onChangeYyb = (value, label, extra) => {
    const { khyyb, allYYB, visible, onClickYYB } = this.state;
    const newKhyyb = JSON.parse(JSON.stringify(khyyb));
    const { selected: OldYYBSelected = [] } = newKhyyb;
    let treeNode = [];
    const triggerValue = extra.triggerValue;
    let onClickTime = onClickYYB[triggerValue] || 0;
    if (extra.triggerValue === '1') {
      treeNode = allYYB;
    } else {
      treeNode = this.getByFatherdId(extra.triggerValue, treeNode);
    }
    // 选中的父节点
    let faNode = allYYB.find((i) => i.yybid === extra.triggerValue);
    if (treeNode.length > 0) {
      switch (onClickTime) {
        case 0:
          treeNode.forEach((item) => {
            const exist = value.filter(Item => Item.value === item.yybid);
            if (exist.length === 0) {
              const Item = {
                label: item.yybmc,
                value: item.yybid,
              };
              value.push(Item);
            }
          });
          newKhyyb.selected = value;
          onClickTime = 1;
          break;
        case 1:
          treeNode.forEach((item) => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value.push({
            label: faNode.yybmc,
            value: faNode.yybid,
          });
          value = value.filter((item, index) => {
            return value.findIndex(item1 => item1.value === item.value) === index;
          });
          newKhyyb.selected = value;
          onClickTime = 2;
          break;
        case 2:
          treeNode.forEach((item) => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value = value.filter(Item => Item.value !== triggerValue);
          newKhyyb.selected = value;
          onClickTime = 0;
          break;
        default:
          break;
      }
    } else if (!extra.checked && treeNode.length > 0) {
      const newOldSelected = JSON.parse(JSON.stringify(OldYYBSelected));
      newOldSelected.forEach((Item, fatherIndex) => {
        if (Item.value === extra.triggerValue) {
          newOldSelected.splice(fatherIndex, 1);
        }
      });
      treeNode.forEach((item) => {
        newOldSelected.forEach((Item, index) => {
          if (Item.value === item.yybid) {
            newOldSelected.splice(index, 1);
          }
        });
      });
      newKhyyb.selected = newOldSelected;
    } else {
      newKhyyb.selected = value;
    }
    if (newKhyyb.selected.length > 100) {
      this.setState({
        visible: !visible,
        content: '选中的数据一次不允许超过一百个！',
      });
      onClickTime = undefined;
    } else if (OldYYBSelected.length !== newKhyyb.selected.length) { // 判断两次的值是否有变
      this.setState({
        khyyb: newKhyyb,
      });
    }
    onClickYYB[triggerValue] = onClickTime;
    this.setState({
      searchValueYyb: this.state.searchValueYyb,
      onClickYYB: onClickYYB,
    });
  }

  getByFatherdId = (fid, result) => {
    const { allYYB } = this.state;
    let childerNodes = allYYB.filter(item => item.fid === fid);
    if (childerNodes.length > 0) {
      childerNodes.forEach((item) => {
        result.push(item);
        result = this.getByFatherdId(item.yybid, result);
      });
    }
    return result;
  }

  // 搜索项展开
  handleExpand = () => {
    const { expandVisible } = this.state;
    this.setState({
      expandVisible: !expandVisible,
    });
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  handlePanelChange = (value, mode) => {
    this.setState({
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
    });
    this.props.form.setFieldsValue({ cxsjqj: value });
  };

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { handleSubmit } = this.props;
        const { khyyb, zxbm } = this.state;
        if (handleSubmit) {
          const kssj = moment(values.cxsjqj[0]).format('YYYYMMDD');
          const jssj = moment(values.cxsjqj[1]).format('YYYYMMDD');
          let sc = '';
          if (values.zdscks === 0 || values.zdscjs === 0) {
            sc = `${values.zdscks !== null ? values.zdscks : ''},${values.zdscjs !== null ? values.zdscjs : ''}`;
          } else if (values.zdscks && values.zdscjs) {
            sc = `${values.zdscks},${values.zdscjs}`;
          } else if (values.zdscks && !values.zdscjs) {
            sc = `${values.zdscks},`;
          } else if (!values.zdscks && values.zdscjs) {
            sc = `,${values.zdscjs}`;
          }
          let hlz = '';
          if (values.hlzzx === 0 || values.hlzzd === 0) {
            hlz = `${values.hlzzx !== null ? values.hlzzx : ''},${values.hlzzd !== null ? values.hlzzd : ''}`;
          } else if (values.hlzzx && values.hlzzd) {
            hlz = `${values.hlzzx},${values.hlzzd}`;
          } else if (values.hlzzx && !values.hlzzd) {
            hlz = `${values.hlzzx},`;
          } else if (!values.hlzzx && values.hlzzd) {
            hlz = `,${values.hlzzd}`;
          }
          const yybid = [];
          khyyb.selected.forEach((item) => {
            yybid.push(item.value);
          });
          const bmid = [];
          zxbm.selected.forEach((item) => {
            bmid.push(item.value);
          });
          const payload = {
            intTp: this.state.zdlx || '', // 中断类型
            intStp: values.zdbz !== '' ? values.zdbz.join(',') : '', // 中断步骤
            status: values.zt !== '' ? values.zt.join(',') : '', // 状态
            custChnl: values.qd !== '' ? values.qd.join(',') : '', // 渠道来源
            custOrg: yybid.join(','), // 开户营业部
            phnLoc: this.state.sjsdId, // 手机属地
            isRcmdr: this.state.zdlx === '8' ? undefined : values.sfytjr || '', // 是否有推荐人
            intTm: `${kssj},${jssj}`, // 中断时间
            intrptDrtn: sc, // 中断时长
            vigourVal: hlz, // 活力值
            excDept: bmid.join(','), // 执行部门
            excUser: values.zxry !== '' && values.zxry !== undefined ? values.zxry.join(',') : '', // 执行人员
            custInfo: values.kh, // 客户信息
            updateFlag: values.isUpdate,
            custTp: values.khlx,
            custLv: values.khdj && values.khdj.join(','),
            custEr: values.zdyy && values.zdyy.join(','),
            bankAmt: values.failedAmt ? values.failedAmt * 1 : undefined,
            opsType: values.opsType && values.opsType.join(','),
            src: 1,//PC
            strategyType: values.strategyType && values.strategyType.join(','),
            fundType: values.fundType,
            reference: this.state.zdlx === '8' ? values.sfytjr : undefined,
          };
          // this.setState({ searchValue: '' });
          this.setState({ searchValueTwo: '' });
          handleSubmit(payload);
        }
      }
    });
  }

  setGJZ = (value) => {
    this.setState({ sjsd: value, sjsdId: '' }, () => { this.refPopver.fetchTitle(value); });
  }

  setTab = (value) => {
    this.setState({ sjsdType: value }, () => { this.refPopver.fetchTitle(this.state.sjsd); });
  }

  setZtValue = (value) => {
    this.props.form.setFieldsValue({ zt: value });
  }

  setQdValue = (value) => {
    this.props.form.setFieldsValue({ qd: value });
  }

  setBzValue = (value) => {
    this.props.form.setFieldsValue({ zdbz: value });
  }

  setLevel = (value) => {
    this.props.form.setFieldsValue({ khdj: value });
  }

  setReason = (value) => {
    this.props.form.setFieldsValue({ zdyy: value });
  }

  setOpsType = (value) => {
    this.props.form.setFieldsValue({ opsType: value });
  }

  setClValue = (value) => {
    this.props.form.setFieldsValue({ strategyType: value });
  }

  // 清空表单
  resetSearchForm = () => {
    this.setState({
      sjsdType: '1', // 手机属地选择类型1|城市、2|省份
      sjsd: '', // 手机属地NM
      sjsdId: '', // 手机属地Id
      khyyb: { // 营业部
        ...this.state.khyyb,
        selected: [],
      },
      zxbm: { // 执行部门
        ...this.state.zxbm,
        selected: [],
      },
      zxry: {
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      searchValue: '',
      searchValueTwo: '',
      zdlx: this.props.zdlx,
    }, () => {
      this.props.form.resetFields();
      this.fetchExcStaffList();
    });
  }

  setData = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  handleCancel = () => {
    // 取消按钮的操作
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      content: '',
    });
  }

  // 改变执行部门时重置执行人员
  resetUserValue = () => {
    this.props.form.setFieldsValue({ 'zxry': [] });
  }

  handleTreeSelectSearch = (value) => {
    this.setState({ searchValue: value });
    if (!this.state.zxbm.selected.length) {
      this.fetchExcStaffListDebounce(value);
    }
  }

  fetchExcStaffList = (value) => {
    const { zxry } = this.state;
    const params = {
      cxlx: '2',
      yyb: '',
      zt: '0',
      cxbs: value,
      current: 1, pageSize: 100, total: -1, paging: 1,
    };
    FetchExcStaffList(params).then((result) => {
      const { code = 0, records = [] } = result;
      if (code > 0) {
        const ryList = [];
        records.forEach((item) => {
          const temp = JSON.parse(JSON.stringify(item));
          temp.yhxm = item.yhxm + '（' + item.yhbh + '）';
          ryList.push(temp);
        });
        const zxryCurrent = zxry;
        const datas = TreeUtils.toTreeData(ryList, { keyName: 'yhid', pKeyName: 'orgid', titleName: 'yhxm', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
        zxryCurrent.datas = [];
        datas.forEach((item) => {
          const { children } = item;
          zxryCurrent.datas.push(...children);
        });
        zxryCurrent.dataLoaded = true;
        this.setData('zxry', zxryCurrent);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { form: { getFieldDecorator }, dictionary = {} } = this.props;
    const { [getDictKey('ztObj')]: ztObjList = [], [getDictKey('zdbzObj')]: zdbzObjList = [] } = dictionary;
    // this.sortZdbz(zdbzObjList);
    // const zdbzObjList_PRD = dictionary['INTCUS_STP_PRD'] || [];
    const tmpzdbzObjList = [...zdbzObjList].sort((a, b) => a.ibm - b.ibm);
    const newZdbzObjList = ['3','4'].includes(this.state.zdlx) ? tmpzdbzObjList.filter((item)=>{return (item.ibm > 200 && item.ibm < 300); }) : ['5'].includes(this.state.zdlx) ? tmpzdbzObjList.filter((item)=>{return (item.ibm > 300 && item.ibm < 400); }) : ['6'].includes(this.state.zdlx) ? tmpzdbzObjList.filter((item)=>{return (item.ibm > 600 && item.ibm < 700); }) : ['7'].includes(this.state.zdlx) ? tmpzdbzObjList.filter((item)=>{return (item.ibm > 700 && item.ibm < 800); }) : ['8'].includes(this.state.zdlx) ? tmpzdbzObjList.filter((item)=>{return (item.ibm > 800 && item.ibm < 900); }) : tmpzdbzObjList.filter((item)=>{return (item.ibm >= 0 && item.ibm < 100); });
    const { sjsdType, sjsd, expandVisible, khyyb, zxbm, qdObj = [], zdlxObj = [], zxry, showNum, allYYB, visible, content } = this.state;
    const selectBefore = (
      <Select value={sjsdType} dropdownClassName='m-bss-select' style={{ width: '70px', color: '#1A2243' }} onChange={(value) => this.setTab(value)} className={styles.selectBefore}>
        <Option value='1'>城市</Option>
        <Option value='2'>省份</Option>
      </Select>
    );
    const lastMounte = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    const renderContent = [
      ['8'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18'>
          <Form.Item className="m-form-item m-form-bss-item " label={<div><div className='m-form-bss-item-label'>策略</div><div className='m-form-bss-item-label'>组合类型</div></div>}>
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              {
                getFieldDecorator('strategyType', { initialValue: '' })(<SelectCheckbox data={this.state.strategyCombine} placeholder='请选择' setValue={this.setClValue}/>)
              }
            </div>
          </Form.Item>
        </Col>
      ),
      (<Col span={24 / showNum} className='pl18'>
        <Form.Item className="m-form-item m-form-bss-item " label="中断时间">
          {
            getFieldDecorator('cxsjqj', {
              initialValue: [moment(lastMounte, 'YYYY-MM-DD'), moment(new Date(Date.now()), 'YYYY-MM-DD')],
              rules: [{ required: true, message: '请选择中断时间' }],
            })(<RangePicker
              dropdownClassName='m-bss-range-picker'
              separator='至'
              disabledDate={(current) => current && current > moment().endOf('day')}
            />)
          }
        </Form.Item>
      </Col>),
      (<Col span={24 / showNum} className='pl18' key='zt'>
        <Form.Item className="m-form-item m-form-bss-item " label="状态" >
          <div onMouseDown={(e) => {
            e.preventDefault();
            return false;
          }}>
            {
              getFieldDecorator('zt', { initialValue: [this.state.status] })(<SelectCheckbox data={ztObjList} placeholder='请选择状态' setValue={this.setZtValue}/>)
            }
          </div>
        </Form.Item>
      </Col>),
      ['6'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' >
          <Form.Item className="m-form-item m-form-bss-item " label={<div><div className='m-form-bss-item-label'>入金</div><div className='m-form-bss-item-label'>失败金额</div></div>} >
            {
              getFieldDecorator('failedAmt', { initialValue: undefined })(<Select
                placeholder='请选择'
                allowClear={true}
                dropdownClassName='m-bss-select'
                className={styles.tjrSelect}
              >
                <Option key='1'>1000以内（含）</Option>
                <Option key='2'>1000—10000（含）</Option>
                <Option key='3'>10000以上</Option>
              </Select>)
            }
          </Form.Item>
        </Col>
      ),
      ['6'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' >
          <Form.Item className="m-form-item m-form-bss-item " label="中断原因" >
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              {
                getFieldDecorator('zdyy', { initialValue: '' })(<SelectCheckbox data={this.state.intrptReason} placeholder='请选择' setValue={this.setReason} />)
              }
            </div>
          </Form.Item>
        </Col>
      ),
      ['7'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' >
          <Form.Item className="m-form-item m-form-bss-item " label="业务类型" >
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              {
                getFieldDecorator('opsType', { initialValue: '' })(<SelectCheckbox data={this.state.opsTypeData} placeholder='请选择' setValue={this.setOpsType} />)
              }
            </div>
          </Form.Item>
        </Col>
      ),
      ['3','4'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18'>
          <Form.Item className="m-form-item m-form-bss-item " label="是否有更新" >
            {
              getFieldDecorator('isUpdate', { initialValue: '0' })(<Select
                placeholder='请选择'
                // allowClear={true}
                dropdownClassName='m-bss-select'
                className={styles.tjrSelect}
              >
                <Option key='0'>全部</Option>
                <Option key='1'>是</Option>
                <Option key='2'>否</Option>
              </Select>)
            }
          </Form.Item>
        </Col>
      ),
      (
        <Col span={24 / showNum} className='pl18' style={{ display: expandVisible || !['6'].includes(this.state.zdlx) ? 'block' : 'none' }}>
          <Form.Item className="m-form-item m-form-bss-item " label="客户" >
            {
              getFieldDecorator('kh', { initialValue: '' })(<Input
                placeholder='手机/姓名/客户号'
                allowClear={true}
              >
              </Input>)
            }
          </Form.Item>
        </Col>
      ),
      ['5'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18'>
          <Form.Item className="m-form-item m-form-bss-item " label="客户类型" >
            {
              getFieldDecorator('khlx', { initialValue: '0' })(<Select
                placeholder='请选择'
                // allowClear={true}
                dropdownClassName='m-bss-select'
                className={styles.tjrSelect}
              >
                <Option key='0'>全部</Option>
                <Option key='1'>交易型客户</Option>
                <Option key='2'>理财型客户</Option>
                <Option key='3'>配置型客户</Option>
              </Select>)
            }
          </Form.Item>
        </Col>
      ),
      !['0'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }} key='khdj'>
          <Form.Item className="m-form-item m-form-bss-item " label="客户等级" >
            <div onMouseDown={(e) => {
              e.preventDefault();
              return false;
            }}>
              {
                getFieldDecorator('khdj', { initialValue: [] })(<SelectCheckbox data={this.state.level} placeholder='客户等级' setValue={this.setLevel} />)
              }
            </div>
          </Form.Item>
        </Col>
      ),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible || ['0','1','2'].includes(this.state.zdlx) ? 'block' : 'none' }} key='qd'>
        <Form.Item className="m-form-item m-form-bss-item " label="渠道" >
          <div onMouseDown={(e) => {
            e.preventDefault();
            return false;
          }}>
            {
              getFieldDecorator('qd', { initialValue: '' })(<SelectCheckbox data={qdObj} placeholder='客户的开户渠道' setValue={this.setQdValue} />)
            }
          </div>
        </Form.Item>
      </Col>),
      !['6','7'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }}>
          <Form.Item className="m-form-item m-form-bss-item" label={<div><div className='m-form-bss-item-label'>{this.state.zdlx === '8' ? '基金投顾' : '是否'}</div><div className='m-form-bss-item-label'>{this.state.zdlx === '8' ? '推荐人' : '有推荐人'}</div></div>} >
            {
              getFieldDecorator('sfytjr')(<Select
                placeholder='请选择'
                allowClear={true}
                dropdownClassName='m-bss-select'
                className={styles.tjrSelect}
              >
                <Option key='0'>没有推荐人</Option>
                <Option key='1'>有推荐人</Option>
              </Select>)
            }
          </Form.Item>
        </Col>
      ),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }}>
        <Form.Item className="m-form-item m-form-bss-item " label="开户营业部" >
          {
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              value={khyyb.selected}
              treeData={khyyb.datas}
              // dropdownMatchSelectWidth={false}
              className={styles.yybSelect}
              dropdownClassName='m-bss-treeSelect'
              dropdownStyle={{ maxHeight: 400, overflowY: 'auto', display: visible ? 'none' : '' }}
              treeNodeFilterProp="title"
              placeholder="客户所属营业部"
              allowClear={true}
              multiple
              treeDefaultExpandAll
              maxTagCount={3}
              maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
              maxTagTextLength={7}
              treeCheckable={true}
              onChange={(value, label, extra) => this.onChangeYyb(value, label, extra)}
              treeCheckStrictly={true}
              searchValue={this.state.searchValueYyb}
              onSearch={this.onSearchYyb}
            />
          }
        </Form.Item>
      </Col>),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }}>
        <Form.Item className="m-form-item m-form-bss-item " label="执行部门" >
          <ExecutiveDepartment resetUserValue={this.resetUserValue} searchValueTwo={this.state.searchValueTwo} onSearch={(value) => { this.setState({ searchValueTwo: value }); }} zxbm={zxbm} zxry={zxry} allYYB={allYYB} searchType={true} setData={this.setData} maxTagPlaceholder={this.maxTagPlaceholder} />
        </Form.Item>
      </Col>),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }}>
        <Form.Item className="m-form-item m-form-bss-item " label="执行人员" >
          {
            getFieldDecorator('zxry', {})(<TreeSelect
              showSearch
              style={{ width: '100%' }}
              // value={zxbm.selected}
              treeData={zxry.datas}
              // dropdownMatchSelectWidth={false}
              dropdownClassName='m-bss-treeSelect'
              dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
              treeNodeFilterProp="title"
              placeholder="开户执行人员"
              allowClear
              multiple
              treeDefaultExpandAll
              maxTagCount={3}
              maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
              maxTagTextLength={7}
              treeCheckable={true}
              searchValue={this.state.searchValue}
              onSearch={this.handleTreeSelectSearch}
              autoClearSearchValue={false} // 阻止treeSelect当前选中树节点变化时重置searchValue的默认操作
            >
            </TreeSelect>)
          }
        </Form.Item>
      </Col>),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }} key='2'>
        <Form.Item className="m-form-item m-form-bss-item " label="手机属地" >
          {
            getFieldDecorator('sjsd', { initialValue: '' })(
              <PopoverAndCard sjsdType={sjsdType} setData={this.setData} ref={c => { this.refPopver = c; }}>
                <Input
                  className='m-iput-noBorder'
                  placeholder=''
                  value={sjsd}
                  onChange={(e) => this.setGJZ(e.target.value)}
                  addonBefore={selectBefore}
                  suffix={sjsd === '' && <i className='iconfont icon-search' style={{ marginTop: '-.2rem', color: '#00000040' }}></i>}
                  allowClear={true}
                >
                </Input>
              </PopoverAndCard>)
          }
        </Form.Item>
      </Col>),
      // (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }}>
      //   <Form.Item className="m-form-item m-form-bss-item " label="中断类型">
      //     {
      //       getFieldDecorator('zdlx', { initialValue: '0' })(<Select
      //         placeholder='请选择开户中断'
      //         allowClear={true}
      //         dropdownClassName='m-bss-select'
      //       >
      //         {zdlxObj.map(item => <Option key={item.note} value={item.ibm} >{item.note}</Option>)}
      //       </Select>)
      //     }
      //   </Form.Item>
      // </Col>),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }} key='zdbz'>
        <Form.Item className="m-form-item m-form-bss-item " label="中断步骤" >
          <div onMouseDown={(e) => {
            e.preventDefault();
            return false;
          }}>
            {
              getFieldDecorator('zdbz', { initialValue: '' })(<SelectCheckbox data={newZdbzObjList} placeholder='客户开户的中断步骤' setValue={this.setBzValue} />)
            }
          </div>
        </Form.Item>
      </Col>),
      (<Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }} key='0'>
        <Form.Item className="m-form-item m-form-bss-item" label="中断时长" >
          <Input.Group compact>
            {getFieldDecorator('zdscks', { initialValue: '' })(<InputNumber
              min={0}
              style={{ width: '39%', height: '38px', color: '#959cba' }}
              placeholder="请输入"
            />)}
            <Input
              className="site-input-split"
              value="至"
              style={{ width: '8%', height: '38px', maxWidth: '20px', paddingTop: 4 }}
              disabled
            ></Input>
            {getFieldDecorator('zdscjs', { initialValue: '' })(<InputNumber
              min={0}
              style={{ width: '39%', height: '38px', color: '#959cba' }}
              placeholder="请输入"
            // suffix="小时"
            />)}
            <Input
              className="site-input-split"
              value="小时"
              style={{ width: '14%', height: '38px', color: '#959CBA', maxWidth: '42px', textAlign: 'right' }}
              disabled
            ></Input>
          </Input.Group>
        </Form.Item>
      </Col>),
      !['5','6','7','8'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }} key='1'>
          <Form.Item className="m-form-item m-form-bss-item" label="活力值" >
            <Input.Group compact>
              {getFieldDecorator('hlzzx', { initialValue: '' })(<InputNumber
                min={0}
                style={{ width: '44%', height: '38px' }}
                placeholder="最小"
              />)}
              <Input
                className="site-input-split"
                value="至"
                disabled
                style={{ width: '8%', height: '38px', maxWidth: '20px', paddingTop: 4 }}
              />
              {getFieldDecorator('hlzzd', { initialValue: '' })(<InputNumber
                min={0}
                style={{ width: '48%', height: '38px' }}
                placeholder="最大"
              />)}
            </Input.Group>
          </Form.Item>
        </Col>
      ),
      ['8'].includes(this.state.zdlx) && (
        <Col span={24 / showNum} className='pl18' style={{ display: expandVisible ? 'block' : 'none' }}>
          <Form.Item className="m-form-item m-form-bss-item" label={<div><div className='m-form-bss-item-label'>基金</div><div className='m-form-bss-item-label'>投顾类型</div></div>} >
            {
              getFieldDecorator('fundType')(<Select
                placeholder='请选择'
                allowClear={true}
                dropdownClassName='m-bss-select'
                className={styles.tjrSelect}
              >
                <Option key='8'>基金投顾购买</Option>
                <Option key='9'>基金投顾定投</Option>
              </Select>)
            }
          </Form.Item>
        </Col>
      ),
    ].filter(item=>item);
    // console.log(renderContent);
    // if(!['3','4'].includes(this.state.zdlx)){
    //   renderContent.splice(4,1);
    // }
    const lineNum = renderContent.length % showNum === 0 ? renderContent.length / showNum : Math.floor((renderContent.length / showNum) + 1);
    const newRenderContent = [];
    for (let i = 0; i < lineNum; i++) {
      let temp = renderContent.slice(i * showNum, (i * showNum) + showNum);
      newRenderContent.push(temp);
    }
    return (
      <Form onSubmit={this.handleSubmit} className="m-form-default ant-advanced-search-form" style={{ padding: '24px 0 8px' }}>
        <Row>
          <div style={{ display: 'flex' ,margin: '0 0 16px 35px',alignItems: 'center' }}>
            <span style={{ fontSize: 14,color: '#1A2243',paddingRight: 10 }}>中断类型</span>
            {
              zdlxObj.map(item=> (
                <div key={item.value} className={`${styles.nomalBtn} ${this.state.zdlx === item.ibm ? styles.activeBtn : ''}`} onClick={()=>{
                  // if(['3','4'].includes(item.ibm)){
                  //   if(!this.state.isProd){
                  //     this.props.form.setFieldsValue({ zdbz: [] });
                  //   }
                  //   this.setState({
                  //     isProd: true,
                  //   });
                  // }else{
                  //   if(this.state.isProd){
                  //     this.props.form.setFieldsValue({ zdbz: [] });
                  //   }
                  //   this.setState({
                  //     isProd: false,
                  //   });
                  // }
                  this.state.zdlx !== item.ibm && this.props.form.setFieldsValue({ zdbz: [] });
                  this.setState({ zdlx: item.ibm });
                }}>{item.note}</div>
              )
              )
            }
          </div>
          <Row className='pl14' style={{ paddingRight: '282px' }}>
            {newRenderContent.map(Item => {
              return (
                <Row>
                  {Item.map(item => {
                    return item;
                  })}
                </Row>
              );
            })}
          </Row>
          <Row className='tl pl22' style={{ position: 'absolute', bottom: '16px', right: '0rem', minWidth: '282px' }}>
            <Button className='m-btn ant-btn m-bss-btn mr14' type="button" onClick={this.resetSearchForm}>重置</Button>
            <Button className='m-btn ant-btn m-btn-blue m-bss-btn' type="button" htmlType="submit">查询</Button>
            <span style={{ marginLeft: '22px', textAlign: 'center', cursor: 'pointer' }} onClick={this.handleExpand}><span className='m-black fs14'>{expandVisible ? '收起' : '展开'}</span><span className='ml4' ><i className={`iconfont ${expandVisible ? 'icon-jt-top' : 'icon-jt-bottom'}`} style={{ fontSize: '14px' }} /></span></span>
          </Row>
          <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
        </Row>
      </Form>
    );
  }
}
export default Form.create()(SearchContent);