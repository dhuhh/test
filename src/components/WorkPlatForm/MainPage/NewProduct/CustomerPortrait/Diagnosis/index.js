import React, { Component } from 'react';
import { Select, Modal, Empty, Button } from 'antd';
import moment from 'moment';
import sensors from 'sa-sdk-javascript';
import Title from '../Common/Title';
import Label from '../Common/Label';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
//import defaultImg from '$assets/newProduct/customerPortrait/缺省图@2x.png';
import defaultImg from '$assets/newProduct/customerPortrait/defaultGraph@2x.png';
import CustomerDiagnosisDetail from '../CustomerDiagnosisDetail';
import { QueryOpeCalendar, QueryOpeSpecial } from '$services/newProduct';
import styles from './index.less';
import { getPdf } from '../util';
const { Option } = Select;

export default class Diagnosis extends Component {
  state = {
    anaCalendar: [],
    bond: [],
    fund: [],
    final: [],
    visible: false,
    time: '1',
    date: [],
    recent1: '',
    recent2: '',
  }
  handleChange = (value , a ) => {
    newClickSensors({
      third_module: "画像",
      ax_page_name: "操作诊断",
      ax_button_name: "统计周期" + a.props.title,
    });
    this.setState({ time: value });
    this.getInfoByYear(value);
  }
  getRecentDetailDate() {
    let recent1 = `${moment().subtract(1, "years").format("YYYY.MM.DD")}-${moment().format("YYYY.MM.DD")}`;
    let recent2 = `${moment().subtract(2, "years").format("YYYY.MM.DD")}-${moment().format("YYYY.MM.DD")}`;
    this.setState({
      recent1,
      recent2,
    });
  }
  getInfoByYear = (timeRange) => {
    const map = {
      '1': '近一年',
      '2': '近两年',
      // '3': this.props.anaCalendar[0],
      // '4': this.props.anaCalendar[1],
    };
    this.state.anaCalendar.forEach((item, index) => {
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
      const { characteristic_style, characteristic_style_comp, characteristic_style_fund } = res.records;
      this.setState({
        bond: characteristic_style,
        fund: characteristic_style_fund,
        final: characteristic_style_comp,
      });
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
    newClickSensors({
      third_module: "画像",
      ax_page_name: "操作诊断",
      ax_button_name: "获取操作诊断报告次数",
    });
  };
  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  componentDidMount() {
    //获取近两年日期详情
    this.getRecentDetailDate();
    //操作诊断日历
    QueryOpeCalendar({
      "cusCode": this.props.cusCode,
      /* "term": "360",
      "year": "2020", */
    }).then(res => {
      let dateArr = res.records.yearly_report.sort((a, b) => b - a);
      let month = moment().format('MM');
      let day = moment().format('DD');
      /* let recent1 = `${moment().subtract(1, "years").format("YYYY.MM.DD")}-${moment().format("YYYY.MM.DD")}`;
      let recent2 = `${moment().subtract(2, "years").format("YYYY.MM.DD")}-${moment().format("YYYY.MM.DD")}`; */
      /* let date1 = `${dateArr[0]}.01.01-${dateArr[0]}.${month}.${day}`;
      let date2 = `${dateArr[1]}.01.01-${dateArr[1]}.12.31`; */
      let date = [];
      dateArr.forEach((item, index) => {
        if (`${item}` === moment().format('YYYY')) {
          date.push(`${item}.01.01-${item}.${month}.${day}`);
        } else {
          date.push(`${item}.01.01-${item}.12.31`);
        }
      });
      this.setState({
        anaCalendar: dateArr,
        date,
        /* recent1,
        recent2, */
      });
    });
    //查询用户操作诊断报告
    this.getInfoByYear(this.state.time);
  }

  export = () => {
    let title = moment().format('操作诊断报告(YYYYMMDD)');
    newClickSensors({
      third_module: "画像",
      ax_page_name: "操作诊断",
      ax_button_name: "操作诊断导出点击次数"
    });
    getPdf(title, '#customerDiagnosisDetailModal');
  }

  render() {
    // console.log(this.state);
    let titleNode = (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '18px', color: '#1A2243', fontWeight: '500', marginRight: '7px' }}>操作诊断报告</span><span style={{ fontSize: '14px', color: '#959CBA', fontWeight: '500' }}>每周末更新数据</span>
        </div>
        <div style={{ position: 'relative', left: -50 }}>
          <Button style={{ height: 34 }} className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.export}>导出</Button>
        </div>
      </div>
    );
    return (
      <div className={styles.diagnosis} >
        <Modal
          className={styles.modal}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          style={{ top: 50, padding: 0 }}
          width='568px'
          title={titleNode}
          destroyOnClose
        // visible={true}
        >
          {/* {
            this.state.final.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ height: '766px', paddingTop: '130px' }} /> :
              <CustomerDiagnosisDetail opeCalendar={this.state.opeCalendar} cusCode={this.props.cusCode} time={this.state.time} detailDate={[this.state.date1, this.state.date2, this.state.recent1, this.state.recent2]} />
          } */}
          <CustomerDiagnosisDetail anaCalendar={this.state.anaCalendar} cusCode={this.props.cusCode} time={this.state.time} detailDate={this.state.date} recent1={this.state.recent1}
            recent2={this.state.recent2} />
        </Modal>
        <Title title='操作诊断'>
          <span>统计周期</span>
          <Select optionLabelProp='title' value={this.state.time} style={{ width: 120, height: 32 }} onChange={this.handleChange} dropdownClassName={styles.select}>
            {/* <Option value="2" title='近两年'>{`近两年`}</Option> */}
            <Option value="1" title='近一年'>{`近一年`}</Option>
            {
              this.state.anaCalendar.map((item, index) => <Select.Option key={`${index + 3}`} value={`${index + 3}`} title={item}>{`${item}`}</Select.Option>)
            }
          </Select>
          {/* <span onClick={this.showModal} style={{ display: this.state.final.length === 0 ? 'none' : 'inline' }}>
            获取操作诊断报告
            <img src={require('$assets/newProduct/customerPortrait/common_year_arrow_light_right.png')} alt=''></img>
          </span> */}
        </Title>
        <div className={styles.line}></div>
        {
          this.state.final.length === 0 ? <Empty image={defaultImg} description='暂无操作诊断建议' style={{ height: '150px', paddingTop: '20px' }} /> :
            (
              <div>
                <div className={styles.content}>
                  {this.state.fund.map((item, index) => <Label key={index} item={item} />)}
                  {this.state.bond.map((item, index) => <Label key={index} item={item} />)}
                  {this.state.final.map((item, index) => <Label key={index} item={item} />)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '28px 0 4px' }}>
                  <Button
                    style={{ width: 152, height: 32, background: '#244FFF', color: '#FFF', borderRadius: 2, boxShadow: '0px 2px 14px 0px rgba(0, 26, 78, 0.14)' }}
                    onClick={this.showModal}
                  >
                  获取操作诊断报告
                  </Button>
                </div>
              </div>
            )
        }

      </div>
    );
  }
}
