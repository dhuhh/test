import React, { Component } from 'react';
import styles from './index.less';
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Col, Row, Select } from 'antd';
import moment from 'moment';
import { QueryOpeSpecial } from '$services/newProduct';
import bond from '$assets/newProduct/customerPortrait/inner-bond.png';
import fund from '$assets/newProduct/customerPortrait/outer-fund.png';
import assessment from '$assets/newProduct/customerPortrait/assessment.png';
import CustomerDiagnosisCard from './components/CustomerDiagnosisCard';
const { Option } = Select;
export default class CustomerDiagnosisDetail extends Component {
  state = {
    opeCalendar: [],
    bond: [],
    fund: [],
    assessment: [],
    time: this.props.time,
  }
  handleChange = (value) => {
    this.setState({ time: value });
    this.getInfoByYear(value);
  }
  getInfoByYear = (timeRange) => {
    const map = {
      '1': '近一年',
      '2': '近两年',
      // '3': this.props.anaCalendar[0],
      // '4': this.props.anaCalendar[1],
    };
    this.props.anaCalendar.forEach((item, index) => {
      map[index + 3] = item;
    });
    const param = {
      cusCode: this.props.cusCode,
      term: '360',
    };
    // 如果不是年份
    if (map[timeRange] === '近两年') {
      param.term = '720';
    } else if (map[timeRange] === '近一年') {
      param.term = '360';
    } else {
      param.year = map[timeRange];
    }
    //更新各项能力得分详情
    this.queryOpeSpecial(param);
  }
  queryOpeSpecial = (param) => {
    QueryOpeSpecial(param).then(res => {
      this.initDetailData(res);
      const { characteristic_style, characteristic_style_comp, characteristic_style_fund } = res.records;
      this.setState({
        bond: characteristic_style,
        fund: characteristic_style_fund,
        final: characteristic_style_comp,
      });
    }).catch(() => {
      /* this.initDetailData(mockRes);
      const { characteristic_style, characteristic_style_comp, characteristic_style_fund } = mockRes.records;
      this.setState({
        bond: characteristic_style,
        fund: characteristic_style_fund,
        final: characteristic_style_comp,
      }); */
    });
  }

  formatterDate(date) {
    const arr = date.split('-');
    return `${arr[0]}.${arr[1]}.${arr[2]}`;
  }

  initDetailData(res) {
    function genID() {
      return Number(Math.random().toString().substr(3, 10) + Date.now()).toString(36);
    }
    this.computeDate = `${this.formatterDate(res.records.beginDate)}-${this.formatterDate(res.records.endDate)}`;
    this.inner = res.records.characteristic_style.map((e) => ({
      ...e,
      idx: genID(),
    }));
    this.outer = res.records.characteristic_style_fund.map((e) => ({
      ...e,
      idx: genID(),
    }));
    this.composite = res.records.characteristic_style_comp.map((e) => ({
      ...e,
      idx: genID(),
    }));
    this.setState({
      bond: this.inner,
      fund: this.outer,
      assessment: this.composite,
    });
  }

  componentDidMount() {
    this.getInfoByYear(this.state.time);
  }

  render() {
    return (
      <Scrollbars autoHide style={{ height: '800px' }}>
        <div id='customerDiagnosisDetailModal' className={styles.customerDiagnosisDetail}>
          <div className={styles.select} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>统计周期：{this.computeDate}</span>
            <Select dropdownClassName={styles.selectItem} optionLabelProp='title' defaultValue={this.state.time} style={{ width: 152, height: 40 }} onChange={this.handleChange}>
              {/* <Option value="2" title='近两年'>{`近两年`}</Option> */}
              <Option value="1" title='近一年'>{`近一年`}</Option>
              {
                this.props.anaCalendar.map((item, index) => <Select.Option key={`${index + 3}`} value={`${index + 3}`} title={item}>{`${item}`}</Select.Option>)
              }
            </Select>
          </div>
          {
            this.state.bond.length > 0 ? (<img src={bond} className={styles.title} alt=''></img>) : ''
          }
          {
            this.state.bond.map((item, index) => (
              <CustomerDiagnosisCard
                level={item.level}
                type={item.type}
                key={item.idx}
                title={item.title}
                chartData={item} />
            )
            )
          }
          {
            this.state.fund.length > 0 ? (<img src={fund} className={styles.title} alt=''></img>) : ''
          }
          {
            this.state.fund.map((item, index) => (
              <CustomerDiagnosisCard
                level={item.level}
                type={item.type}
                key={item.idx}
                title={item.title}
                chartData={item} />
            )
            )
          }
          {
            this.state.assessment.length > 0 ? (<img src={assessment} className={styles.title} alt=''></img>) : ''
          }
          {
            this.state.assessment.map((item, index) => (
              <CustomerDiagnosisCard
                level={item.level}
                type={item.type}
                key={item.idx}
                title={item.title}
                chartData={item} />
            )
            )
          }
        </div >
      </Scrollbars>

    );
  }
}
