import React, { Component } from 'react';
import { Button, Checkbox, Col, Form, message, Row, Select } from 'antd';
import SearchInput from '../SearchInput';
import { FetchProductCusList, FetchQueryStaticsCycleConfig } from '$services/newProduct';
import styles from '../index.less';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    //let { params: { customerType = '' } } = this.props;
    const { customerType, queryType = '1' } = this.props;
    const cusType = customerType.split(',');
    let selectList = customerType === '' ? ['12'] : cusType;
    selectList = queryType === '3' ? ['0'] : selectList;
    let datas = [];
    datas = queryType === '3' ? [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }, { ibm: '0', note: '全部客户' }]
      : [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }];
    this.state = {
      checkedList: selectList, //: ['1', '10', '11', '12'],  // 下拉多选框值
      data: datas,  // 下拉框数据
      period: [], //时间统计周期
      cusTypeProps: selectList,
      selectData: [], //模糊搜索下拉框数据
      queryTypeProps: queryType,
      loading: false,
    };
    const { getInstence } = props;
    if (getInstence) {
      getInstence(this);  //暴露this给父组件
    }
  }

  componentDidMount() {
    this.handleSubmit();
    this.fetchQueryPeriod();
  }

  handleChange = (e) => {
    const oldData = [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }];
    const newData = [{ ibm: '12', note: '销售关系' }, { ibm: '10', note: '开发关系' }, { ibm: '1', note: '服务关系' }, { ibm: '11', note: '无效户激活' }, { ibm: '0', note: '全部客户' }];
    if (e === '3') {
      const checkedList = ['0'];
      this.setState({ data: newData, checkedList: ['0'] });
      this.props.form.setFieldsValue({ khlx: checkedList });
    } else {
      const checkedList = ['12'];
      this.setState({ data: oldData, checkedList: ['12'] });
      this.props.form.setFieldsValue({ khlx: checkedList });
    }
  }

  //查询统计周期
  fetchQueryPeriod = () => {
    FetchQueryStaticsCycleConfig({ srchScene: 2, suitTp: 1 }).then((res) => {
      const { code = 0, records = [] } = res;
      if (code > 0) {
        const statusticsArr = [];
        records.forEach((item) => {
          let { cyclNm: note = '', cyclVal: ibm = '' } = item;
          ibm = parseInt(ibm);
          statusticsArr.push({ ibm, note });
        });
        this.setState({
          period: statusticsArr,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 查询数据
  fetchData = (data) => {
    const { handleFormChange, pdId } = this.props;
    const { isSubmit = 0, current = this.props.current, pageSize = this.props.pageSize, cusNo = '', srchTp = 1, sort = this.props.sort, cusInfo = this.SearchInput.state.seleValue } = data;
    if (srchTp === 1 && isSubmit === 1) {
      handleFormChange({ loading: true });
    }
    const customerType = this.props.form.getFieldsValue().khlx;
    const payload = {
      current,
      cusRng: parseInt(this.props.form.getFieldsValue().khfw) || '1',   //客户范围
      cusType: customerType.length !== 0 ? customerType.join(',') : ['12'].join(','),  //客户类型,如果为空默销售关系
      pageSize,
      paging: 1,
      pdId,
      srchTp,
      tmPrd: parseInt(this.props.form.getFieldsValue().tjzq),  //时间周期
      total: -1,
      sort,
      cusNo,
      cusInfo, //模糊搜索关键字
    };
    FetchProductCusList(payload).then((res) => {
      const { code = 0, records = [], statcData = [], total = 0 } = res;
      const dataSource = [];
      const checkDatas = [];
      if (code > 0) {
        if (srchTp === 1) {
          records.forEach((item, index) => {
            item['no'] = (((current - 1) * pageSize) + index + 1) + '';
            dataSource.push(item);
          });
          if (isSubmit === 1) { //按钮搜索或者翻页搜索
            handleFormChange({
              dataSource,
              statcData,
              total,
              loading: false,
              customerType: customerType.length !== 0 ? customerType.join(',') : ['12'].join(','),
              tmPrd: parseInt(this.props.form.getFieldsValue().tjzq),
              queryType: parseInt(this.props.form.getFieldsValue().khfw) || '1',
              cusInfo,
            });
          } else {
            handleFormChange({
              searchTotal: total,
            });
            this.setState({ selectData: records, loading: false });
          }
        } else {
          records.forEach((item) => {
            checkDatas.push(item);
          });
          handleFormChange({
            checkDatas,
          });
        }

      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }


  // 客户类型下拉框
  onChange = (checkedList) => {
    // const { handleFormChange } = this.props;
    const length = checkedList.length;
    const item = checkedList[length - 1];
    if (item === '0') {    //如果是全部客户,则和其他所有关系互斥
      checkedList.splice(0, length - 1);
    } else {
      if (item === "12") {   //如果是销售关系
        checkedList.splice(0, length - 1);
      } else {
        if (checkedList.indexOf("12") > -1) {
          checkedList.splice(checkedList.indexOf("12"), 1);
        }
        if (checkedList.indexOf("0") > -1) {
          checkedList.splice(checkedList.indexOf("0"), 1);
        }
      }
    }

    this.setState({
      checkedList: checkedList,
    });
    // const customerType = checkedList.join(',');
    // handleFormChange({ customerType });
    this.props.form.setFieldsValue({ khlx: checkedList });

  };
  // 下拉多选框显示
  maxTagPlaceholder = (value) => {
    const num = 3 + value.length;
    return <span>...等{num}项</span>;
  };
  // 表单提交
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { handleFormChange, sort = '', cusNo = '' } = this.props;
        this.fetchData({ current: 1, sort, cusNo, isSubmit: 1 });
        if (handleFormChange && typeof handleFormChange === 'function') {
          handleFormChange({ current: 1 });
        }
      }
    });
  }
  handleDataChange = (payload) => {
    this.setState(payload);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { suffixIcon = false, queryType = '1', authorities, teamPmsn = '0', searchTotal } = this.props;
    const { loading, checkedList, data, period = [], cusTypeProps = [], selectData, queryTypeProps } = this.state;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    return (
      <Form style={{ marginTop: '1.5rem' }} onSubmit={this.handleSubmit} className='m-form-default ant-advanced-search-form'>
        <Row className={styles.label}>
          <Col xs={12} sm={12} md={12} lg={12} xl={5} xxl={6} style={{ paddingLeft: 0 }}>
            <Form.Item className={`${styles.border} m-form-item`} label='客户范围'>
              {
                getFieldDecorator('khfw', { initialValue: queryTypeProps + '' })(
                  <Select defaultActiveFirstOption={false} onChange={(e) => this.handleChange(e)}>
                    <Select.Option key='1' value='1'>个人</Select.Option>
                    {teamPmsn === '1' && <Select.Option key='2' value='2'>团队</Select.Option>}
                    {
                      productPanoramaAuth.includes('yyb') &&
                      <Select.Option key='3' value='3'>营业部</Select.Option>
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={6} xxl={6}>
            <Form.Item className="m-form-item m-form-bss-item " label='客户类型'>
              {
                getFieldDecorator('khlx', { initialValue: checkedList, rules: [{ required: true, message: '请选择客户类型' }] })(
                  <Select
                    filterOption={(input, option) => option.key.indexOf(input) >= 0}
                    showArrow={checkedList.length === 0}
                    allowClear={true}
                    mode='multiple'
                    multiple
                    defaultActiveFirstOption={false}
                    maxTagCount={3}
                    maxTagPlaceholder={(value) => this.maxTagPlaceholder(value)}
                    maxTagTextLength={7}
                    menuItemSelectedIcon={e => {
                      return data.length > 0 && e.value !== 'NOT_FOUND' && (
                        <Checkbox
                          checked={checkedList.filter(key => { return key === e.value; }).length > 0}
                        // disabled={e.value === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                        >
                        </Checkbox>
                      );
                    }}
                    onChange={(e) => this.onChange(e)}
                    // className='m-bss-select-checkbox m-bss-select-dropdown m-bss-select-dropdown-title'
                    dropdownRender={menu => (
                      <div className='m-bss-select-checkbox'>
                        <div className='m-bss-select-dropdown'>{menu}</div>
                      </div>
                    )}
                    suffixIcon={suffixIcon && checkedList.length === 0 ? <i className='iconfont icon-search' style={{ marginTop: '-.5rem' }}></i> : ''}
                  // open
                  >
                    {
                      data.map((item, index) => (
                        <Select.Option
                          key={item.note}
                          value={item.ibm}
                        // disabled={item.ibm === '12' ? !checkedList.includes('12') && checkedList.length > 0 ? true : false : checkedList.includes('12') ? true : false}
                        >
                          {item.note}
                          <div style={index === 0 ? { borderBottom: '1px solid #e6e7e8', position: 'relative', top: '0.666rem' } : {}}></div>
                        </Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={5} xxl={6}>
            <Form.Item className={`${styles.border} m-form-item`} label='统计周期'>
              {
                getFieldDecorator('tjzq', { initialValue: 2 })(
                  <Select defaultActiveFirstOption={false}>
                    {
                      period.length !== 0 && period.map((item) => {
                        return (
                          <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>
                        );
                      })
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={6}>
            <Form.Item className={`m-form-item`} label='客户查询'>
              {
                getFieldDecorator('khcx', { initialValue: '' })(
                  <SearchInput loading={loading} handleDataChange={this.handleDataChange} ref={(node) => { this.SearchInput = node; }} total={searchTotal} parentThis={this} selectData={selectData} />
                )
              }
            </Form.Item>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={6} className={styles.srchBtn} style={{ float: 'right' }}>
            <Form.Item>
              <Button className="m-btn-radius m-btn-blue" onClick={this.handleSubmit}>查询</Button>
              <Button className="m-btn-radius" onClick={() => {
                this.props.form.resetFields(); this.state.checkedList = cusTypeProps; this.props.form.setFieldsValue({
                  khlx: cusTypeProps,
                });
                this.SearchInput.state.seleValue = '';
                const { handleFormChange } = this.props;
                if (handleFormChange) {

                  handleFormChange({ cusNo: '', filters: [] }, this.handleSubmit);
                }
              }}>重置</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(SearchForm);
