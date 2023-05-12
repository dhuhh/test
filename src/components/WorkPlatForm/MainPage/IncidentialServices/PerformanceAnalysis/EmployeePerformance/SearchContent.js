import React, { Component } from 'react';
import { Col, Row, Form, Button, message, TreeSelect, DatePicker ,Select } from 'antd';
import moment from 'moment';
import lodash from 'lodash';
import { fetchUserAuthorityDepartment } from '../../../../../../services/commonbase/userAuthorityDepartment';
import { FetchExcStaffList,IntrptCustEr ,QueryStrategyCombine } from '../../../../../../services/incidentialServices';
import ExecutiveDepartment from '../../Common/ExecutiveDepartment';
import TreeUtils from '../../../../../../utils/treeUtils';
import SelectCheckbox from '../../Common/SelectCheckbox';
import styles from '../index.less';


const { RangePicker } = DatePicker;
const { Option } = Select;

class SearchContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      khyyb: { // 营业部
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      },
      zxbm: {
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      }, // 执行部门
      zxry: {
        isloading: true,
        dataLoaded: false,
        searchValue: '',
        datas: [],
        selected: [],
      }, // 执行人员
      allYYB: [], // 所有营业部，未分级
      mode: ['month', 'month'],
      showNum: 4,
      searchValueTwo: '',
      searchValue: '',
      searchValueThree: '',
      department: undefined, // 开户营业部
      onClickYYB: {},
      zdlx: '0',
      intrptReason: [],
      opsTypeData: [{ ibm: '港股通权限开通断点',note: '港股通权限开通断点' },{ ibm: '科创板权限开通断点',note: '科创板权限开通断点' },{ ibm: '创业板权限开通断点',note: '创业板权限开通断点' },{ ibm: '新三板权限开通断点',note: '新三板权限开通断点' },{ ibm: '北交所权限开通断点',note: '北交所权限开通断点' }],
    };
    [],
    this.fetchExcStaffListDebounce = lodash.debounce(this.fetchExcStaffList, 300);
  }

  componentDidMount() {
    this.fetchGxyybList();
    this.updateDimensions();
    this.intrptCustEr();
    this.queryStrategyCombine();
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => { // 窗口大小改变的时候调整固定
    const { documentElement } = document;
    const [body] = document.getElementsByTagName('body');
    let width = window.innerWidth || documentElement.clientWidth || body.clientWidth;
    let showNum = 4;
    if (width >= 1200 && width < 1600) {
      showNum = 3;
    }
    this.setState({
      showNum,
    });
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

  // 获取管辖营业部的数据
  fetchGxyybList = (zxbm = this.state.zxbm) => {
    const gxyybCurrent = zxbm;
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
        this.setState({ khyyb: gxyybCurrent, zxbm: gxyybCurrent, allYYB: records });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  }

  setQdValue = (value) => {
    this.props.form.setFieldsValue({ qd: value });
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
        const { zxbm, khyyb } = this.state;
        if (handleSubmit) {
          const kssj = moment(values.cxsjqj[0]).format('YYYYMMDD');
          const jssj = moment(values.cxsjqj[1]).format('YYYYMMDD');
          const bmid = [];
          zxbm.selected.forEach((item) => {
            bmid.push(item.value);
          });
          const yybid = [];
          khyyb.selected.forEach((item) => {
            yybid.push(item.value);
          });
          const payload = {
            zdlx: this.state.zdlx,
            chnl: values.qd !== '' ? values.qd.join(',') : '', // 渠道来源
            tjzq: `${kssj},${jssj}`, // 统计周期
            zxbm: bmid.join(','), // 执行部门
            zxry: values.zxry !== '' && values.zxry !== undefined ? values.zxry.join(',') : '', // 执行人员
            mode: '0', // 查询类型 0|明细，1|总计
            dept: yybid.join(','),
            zdyy: (values.zdyy && values.zdyy.join(',')) || (values.strategyType && values.strategyType.join(',')),
            ywlx: (values.opsType && values.opsType.join(',')) || (values.fundType),
          };
          this.setState({ searchValue: '' });
          this.setState({ searchValueTwo: '' });
          handleSubmit(payload);
        }
      }
    });
  }

  // 清空表单
  resetSearchForm = () => {
    this.setState({
      zxbm: { // 执行部门
        ...this.state.zxbm,
        selected: [],
      },
      khyyb: { // 执行部门
        ...this.state.khyyb,
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
      department: undefined,
      zdlx: '0',
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

  filterTreeNode = (inputValue, treeNode) => {
    // 方式一
    const { allYYB = [] } = this.state;
    const util = (fid, title) => {
      if (fid === '0') return false;
      for (let item of allYYB) {
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
  handleYybChange = (value, label, extra) => {
    const { khyyb, allYYB, onClickYYB } = this.state;
    const newkhyyb = JSON.parse(JSON.stringify(khyyb));
    const { selected: OldYYBSelected = [] } = newkhyyb;
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
          newkhyyb.selected = value;
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
          newkhyyb.selected = value;
          onClickTime = 2;
          break;
        case 2:
          treeNode.forEach((item) => {
            value = value.filter(Item => Item.value !== item.yybid);
          });
          value = value.filter(Item => Item.value !== triggerValue);
          newkhyyb.selected = value;
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
      newkhyyb.selected = newOldSelected;
    } else {
      newkhyyb.selected = value;
    }
    onClickYYB[triggerValue] = onClickTime;
    this.setState({
      searchValueThree: this.state.searchValueThree,
      onClickYYB: onClickYYB,
      khyyb: newkhyyb,
    });
  }

  // 获取父节点下的所有子节点key
  getCheckedKeys = (triggerNodes, array) => {
    triggerNodes.forEach(item => {
      array.push(item.key);
      if (item.props.children.length) {
        this.getCheckedKeys(item.props.children, array);
      }
    });
  }

  // 格式化treeSelectValue
  formatValue = (department) => {
    const { allYYB = [] } = this.state;
    department = department ? department.split(',') : [];
    return department.map(val => ({ value: val, label: allYYB.find(item => item.yybid === val)?.yybmc }));
  }

  // 搜索营业部变化
  handleYybSearch = (value) => {
    this.setState({
      searchValueThree: value,
    });
  }

  render() {
    const { form: { getFieldDecorator }, qdObj ,zdlxObj = [] } = this.props;
    const { zxbm, zxry, mode, showNum, allYYB } = this.state;
    const lastMounte = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    return (
      <Form onSubmit={this.handleSubmit} className="m-form-default ant-advanced-search-form" style={{ marginBottom: '6px' }}>
        <div style={{ display: 'flex' ,margin: '0 0 16px 50px',alignItems: 'center' }}>
          <span style={{ fontSize: 14,color: '#1A2243',paddingRight: 10 }}>中断类型</span>
          {
            zdlxObj.map(item=>
              <div key={item.value} className={`${styles.nomalBtn} ${this.state.zdlx === item.ibm ? styles.activeBtn : ''}`} onClick={()=>{this.setState({ zdlx: item.ibm });}}>{item.note}</div>
            )
          }
        </div>
        <Row style={{ display: 'block' }}>
          <Row className='pl14' style={{ paddingRight: '282px' }} type='flex'>
            <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
              <Form.Item className="m-form-item m-form-bss-item " label="分配时间">
                {
                  getFieldDecorator('cxsjqj', {
                    initialValue: [moment(lastMounte, 'YYYY-MM-DD'), moment(new Date(Date.now()), 'YYYY-MM-DD')],
                    rules: [{ required: true, message: '请选择分配时间' }],
                  })(<RangePicker
                    dropdownClassName='m-bss-range-picker'
                    placeholder={['开始日期', '结束日期']}
                    format="YYYY-MM-DD"
                    separator='至'
                    disabledDate={(current) => current && current > moment().endOf('day')}
                  // mode={mode}
                  // onPanelChange={this.handlePanelChange}
                  // showTime={true}
                  // onOk={this.onOk}
                  />)
                }
              </Form.Item>
            </Col>
            <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
              <Form.Item className="m-form-item m-form-bss-item " label="执行部门" >
                <ExecutiveDepartment resetUserValue={this.resetUserValue} searchValueTwo={this.state.searchValueTwo} onSearch={(value) => { this.setState({ searchValueTwo: value }); }} zxbm={zxbm} zxry={zxry} allYYB={allYYB} searchType={true} setData={this.setData} maxTagPlaceholder={this.maxTagPlaceholder} />
              </Form.Item>
            </Col>
            <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
            </Col>
            {showNum !== 3 && (
              <React.Fragment>
                <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                </Col>
                <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
                  <Form.Item className="m-form-item m-form-bss-item " label="开户营业部" >
                    <TreeSelect
                      showSearch
                      value={this.state.khyyb.selected}
                      treeData={this.state.khyyb.datas}
                      // dropdownMatchSelectWidth={false}
                      dropdownClassName='m-bss-treeSelect'
                      dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                      filterTreeNode={this.filterTreeNode}
                      placeholder="开户营业部"
                      allowClear
                      multiple
                      searchValue={this.state.searchValueThree}
                      treeDefaultExpandAll
                      maxTagCount={3}
                      maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                      maxTagTextLength={5}
                      treeCheckable={true}
                      onChange={this.handleYybChange}
                      onSearch={this.handleYybSearch}
                      treeCheckStrictly={true}
                    // showCheckedStrategy={TreeSelect.SHOW_ALL}
                    />
                  </Form.Item>
                </Col>
                {
                  ['6'].includes(this.state.zdlx) && (
                    <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                  )
                }
                {
                  ['7'].includes(this.state.zdlx) && (
                    <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                  )
                }
                {
                  ['8'].includes(this.state.zdlx) && (
                <>
                <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                </>
                  )
                }
              </React.Fragment>
            )}
          </Row>
          {showNum === 3 && (
            <Row className='pl14' style={{ paddingRight: '282px' }}>
              <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
              </Col>
              <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
                <Form.Item className="m-form-item m-form-bss-item " label="开户营业部" >
                  <TreeSelect
                    showSearch
                    value={this.state.khyyb.selected}
                    treeData={this.state.khyyb.datas}
                    // dropdownMatchSelectWidth={false}
                    dropdownClassName='m-bss-treeSelect'
                    dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                    filterTreeNode={this.filterTreeNode}
                    placeholder="开户营业部"
                    allowClear
                    multiple
                    searchValue={this.state.searchValueThree}
                    treeDefaultExpandAll
                    maxTagCount={3}
                    maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                    maxTagTextLength={5}
                    treeCheckable={true}
                    onChange={this.handleYybChange}
                    onSearch={this.handleYybSearch}
                    treeCheckStrictly={true}
                  // showCheckedStrategy={TreeSelect.SHOW_ALL}
                  />
                </Form.Item>
              </Col>
              {
                ['6'].includes(this.state.zdlx) && (
                  <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                )
              }
              {
                ['7'].includes(this.state.zdlx) && (
                  <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                )
              }
              {
                ['8'].includes(this.state.zdlx) && (
                <>
                <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                <Col md={12} lg={12} xl={8} xxl={6} className='pl18'>
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
                </>
                )
              }
            </Row>
          )}
          <Row style={{ position: 'absolute', bottom: '16px', right: '0rem' }} className='tr pr24'>
            <Button className='m-btn ant-btn m-bss-btn mr14' type="button" onClick={this.resetSearchForm}>重置</Button>
            <Button className='m-btn ant-btn m-btn-blue m-bss-btn' type="button" htmlType="submit">查询</Button>
          </Row>
        </Row>
      </Form>
    );
  }
}
export default Form.create()(SearchContent);