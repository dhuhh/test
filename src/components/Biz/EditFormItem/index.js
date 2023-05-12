import React from 'react';
import { Input, Select, DatePicker, Cascader, InputNumber, Icon, Row, Col, message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { fetchObject } from '../../../services/sysCommon';
import styles from './index.less';

moment.locale('zh-cn');
// const constructsDicDatas = (result) => {
//   const datas = [];
//   const { success = false, list = [] } = result;
//   if (success) {
//     if (list.length > 1) {
//       const columnsObj = list[0].baseInfo.metaData.colInfo;
//       const resultObj = list.slice(1);
//       resultObj.forEach((xItem) => {
//         const rowData = {};
//         columnsObj.forEach((yItem, index) => {
//           rowData[yItem.name] = xItem.record.values[index];
//         });
//         datas.push(rowData);
//       });
//     }
//   }
//   return datas;
// };

class FormItem extends React.Component {
  constructor(props) {
    super(props);
    const { type = 'Text', value, options = [], atype = '', maxLength = '', gjz = '', xszd = '' } = props;// 获取控件类型
    this.state = {
      type,
      value,
      options,
      atype,
      maxLength,
      gjz,
      xszd,
      mouseShowEdit: false, // 鼠标划上数据区域才可以展示修改图标
    };
  }
  componentDidMount() {
    const { zdcxlx = '', ibm: name = '' } = this.props;
    if (zdcxlx === '2' && name !== '') {
      this.fetchLivebosTable(name);
    }
  }
  componentWillReceiveProps(nextporps) {
    const { options = [], zdcxlx = '', value, type } = nextporps;
    // if (this.props.ibm === 'TGJDM') {
    //   const { gj = [], gjz = '', xszd = '' } = this.props;
    //   const gjData = [];
    //   gj.forEach((item, index) => {
    //     gjData.push({ ibm: item[gjz] || '', note: item[xszd] || '', key: index });
    //   });
    //   this.setState({ options: gjData });
    // }
    if (zdcxlx !== '2') {
      this.setState({
        options,
        type,
        value,
      });
    }
  }
  fetchLivebosTable = (name) => {
    const { gjz = '', xszd = '' } = this.state;
    let queryOption = {};
    if (name === 'TGJDM' || name === 'TGXDM') { // 国籍直接从kyc中取
      queryOption = { orderBy: 'NAME ASC', batchNo: 1, batchSize: 9999, queryCount: false, valueOption: 0 };
    }
    fetchObject(name, { queryOption }).then((response) => {
      const { records = [] } = response; // livebos对象表返回的结果结构不同，所以进行判断
      if (Array.isArray(records)) {
        const finalRecords = [];
        records.forEach((item, index) => {
          const ibm = item[gjz];
          const note = item[xszd];
          finalRecords.push({ ibm, note, key: index });
        });
        this.setState({ options: finalRecords });
        // finalRecords.length === 0 ? this.setState({ options: records }) : this.setState({ options: finalRecords }); // eslint-disable-line
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handelInputChange=(e) => { // 处理input输入框
    const { target: { value } } = e;
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handelNumberInputChange=(value) => { // 处理之能是数字的input
    let a = '';
    if (value === undefined) {
      a = '';
    } else {
      a = value;
    }
    this.setState({
      value: a,
    });
    this.triggerChange(a);
  }
  handelSelectChange=(value) => { // 处理select输入框
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handelMutiSelectChange = (value) => {
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handleDatePickerChange = (dateString) => { // 处理datepicker日期控件
    this.setState({
      value: dateString,
    });
    this.triggerChange(dateString);
  }
  handleCascaderSelectChange = (value) => { // 处理省市区级联控件
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handleEdit = (id) => {
    const { handleEdit } = this.props;
    if (handleEdit) {
      handleEdit(id);
    }
  }

  handleSave = (id) => {
    const { handleSave } = this.props;
    if (handleSave) {
      handleSave(id);
    }
    this.setState({ mouseShowEdit: false });
  }

  triggerChange = (changedValue) => {
    // 将值改变传递给form组件.
    const { onChange } = this.props;
    if (onChange) {
      onChange(changedValue);
    }
  }
  // 渲染输入控件
  renderItem = (type, onlyNumber, suffix) => {
    if (type === 'Text') {
      return (
        <span className="ant-form-item-children">
          <span className="ant-form-text">{this.state.value || '--'}</span>
        </span>
      );
    } else if (type === 'Input') {
      return (
        onlyNumber ?
          <InputNumber style={{ width: '100%' }} formatter={value => `${value}${suffix}`} precision={2} value={this.state.value} onChange={this.handelNumberInputChange} /> :
          <Input value={this.state.value} onChange={this.handelInputChange} maxLength={this.state.maxLength} />
      );
    } else if (type === 'Select') {
      if (this.state.atype === 'gj') {
        const conutryDic = this.state.options.records || [];
        return (
          <Select value={this.state.value} onChange={value => this.handelSelectChange(value, 'gj')} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {conutryDic.map((item) => {
              return <Select.Option key={item.IBM} value={item.IBM}>{item.GJMC}</Select.Option>;
            })}
          </Select>
        );
      } else if (this.state.atype === 'sf') {
        const provinceDic = this.state.options.records || [];
        return (
          <Select value={this.state.value} onChange={value => this.handelSelectChange(value, 'sf')} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {provinceDic.map((item) => {
              return <Select.Option key={item.IBM} value={item.IBM}>{item.NAME}</Select.Option>;
            })}
          </Select>
        );
      } else if (this.state.atype === 'cs') {
        const cityDic = this.state.options.records || [];
        return (
          <Select value={this.state.value} onChange={value => this.handelSelectChange(value, 'cs')} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {cityDic.map((item) => {
              return <Select.Option key={item.POST} value={item.POST}>{item.NAME}</Select.Option>;
            })}
          </Select>
        );
      } else if (this.state.atype === 'qx') {
        const areaDic = this.state.options.records || [];
        return (
          <Select value={this.state.value} onChange={this.handelSelectChange} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {areaDic.map((item) => {
              return <Select.Option key={item.POST} value={item.POST}>{item.NAME}</Select.Option>;
            })}
          </Select>
        );
      }
      return (
        <Select dropdownStyle={{ zIndex: 1 }} value={this.state.value} onChange={this.handelSelectChange} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
          {this.state.options.map((item) => {
            return <Select.Option key={item.ibm} value={item.ibm}>{item.note}</Select.Option>;
          })}
        </Select>
      );
    } else if (type === 'MutiSelect') {
      // const keys = Object.keys(this.state.options);
      return (
        <Select dropdownStyle={{ zIndex: 1 }} value={this.state.value} mode="multiple" onChange={this.handelMutiSelectChange} showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
          {this.state.options.map((Item) => {
            return <Select.Option key={Item.ibm} value={Item.ibm}>{Item.note}</Select.Option>;
          })}
        </Select>
      );
    } else if (type === 'datePicker') {
      let moments;
      if (this.state.value) {
        moments = moment(this.state.value, 'YYYYMMDD');
      }
      return (
        <DatePicker dropdownClassName={styles.blow} onChange={this.handleDatePickerChange} format="YYYYMMDD" value={moments} />
      );
    } else if (type === 'Cascader') {
      return (<Cascader popupClassName={styles.blow} options={this.state.options} value={this.state.value} onChange={this.handleCascaderSelectChange} placeholder="请选择" />);
    }
    return null;
  }
  // 渲染静态文字
  renderText = (type, suffix) => {
    let selectShowValue = '';
    if (type === 'Select') {
      if (this.state.options && this.state.options.length > 0) {
        this.state.options.forEach((item) => {
          if (item.ibm === this.state.value) {
            selectShowValue = item.note;
          }
        });
      } else if (this.state.options.records && this.state.options.records.length > 0) { // livebos中取出来的数据特殊处理
        this.state.options.records.forEach((item) => {
          if (item.IBM === this.state.value) {
            selectShowValue = item.NAME || item.GJMC;
          }
          if (item.POST === this.state.value) {
            selectShowValue = item.NAME || item.GJMC;
          }
        });
      }
    } else if (type === 'datePicker') {
      if (this.state.value !== '') {
        try {
          selectShowValue = this.state.value.format('YYYYMMDD');
        } catch (e) {
          selectShowValue = this.state.value || '';
        }
      }
    } else if (type === 'Cascader') {
      const { value = [] } = this.state;
      const { treeData = [] } = this.props;
      const pro = value[0] ? value[0] : '';
      const cit = value[1] ? value[1] : '';
      const are = value[2] ? value[2] : '';
      let proLabel = '';
      let citLabel = '';
      let areLabel = '';
      let count = 0;
      if (value.length !== 0) {
        treeData.forEach((item) => {
          if (item.POST === pro) { proLabel = item.NAME; count++; }
          if (item.POST === cit) { citLabel = item.NAME; count++; }
          if (item.POST === are) { areLabel = item.NAME; count++; }
        });
      }
      switch (count) {
        case 0:
          selectShowValue = '';
          break;
        case 1:
          selectShowValue = proLabel;
          break;
        case 2:
          selectShowValue = `${proLabel}/${citLabel}`;
          break;
        case 3:
          selectShowValue = `${proLabel}/${citLabel}/${areLabel}`;
          break;
        default:
          selectShowValue = '';
      }
      // selectShowValue = `${proLabel}/${citLabel}/${areLabel}`;
      // if (selectShowValue.replace(/[//]+/g, '') === '') selectShowValue = '';
    } else if (type === 'MutiSelect') {
      if (this.state.options && this.state.options.length > 0) {
        const arr = [];
        this.state.options.forEach((item) => {
          this.state.value.forEach((chiItem) => {
            if (item.ibm === chiItem) {
              arr.push(item.note);
            }
          });
        });
        selectShowValue = arr.join(',');
      }
    } else {
      selectShowValue = `${this.state.value || ''} ${suffix}` || '--';
    }
    if (!selectShowValue.replace(/\s/g, '')) {
      selectShowValue = '';
    }
    switch (type) {
      case 'Select':
        return (
          <span className="ant-form-item-children">
            <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>{selectShowValue || '--'}</span>
          </span>
        );
      case 'MutiSelect':
        return (
          <span className="ant-form-item-children">
            <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>{selectShowValue || '--'}</span>
          </span>
        );
      case 'datePicker':
        return (
          <span className="ant-form-item-children">
            <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>{selectShowValue || '--'}</span>
          </span>
        );
      default:
        return (
          <span className="ant-form-item-children">
            <span className="ant-form-text" style={{ wordBreak: 'break-all' }}>{selectShowValue || '--'}</span>
          </span>
        );
    }
  }

  handleMouseEnter = () => {
    const { canEdit = true } = this.props;
    if (canEdit) {
      this.setState({ mouseShowEdit: true });
    }
  }

  handleMouseLeave = () => {
    this.setState({ mouseShowEdit: false });
  }

  render() {
    const { mouseShowEdit = false } = this.state;
    const { editingFieldId = '', isEdit, id, onlyNumber = false, suffix = '' } = this.props;
    if (isEdit === 1) {
      if (editingFieldId !== id && editingFieldId !== 'all') {
        return (
          <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
            {this.renderText(this.state.type, suffix)}
            {
              mouseShowEdit && (
                <span style={{ cursor: 'pointer' }} className="ant-form-item-children" onClick={() => { this.handleEdit(id); }}>
                  <span className="ant-form-text blue" title="修改">
                    <Icon type="form" />
                  </span>
                </span>
              )
            }
          </div>
        );
      }
      return (
        <Row>
          <Col span={editingFieldId !== 'all' ? 20 : 24}>
            {this.renderItem(this.state.type, onlyNumber, suffix)}
          </Col>
          {
            editingFieldId !== 'all' && (
              <Col span={4} style={{ textAlign: 'center', fontSize: '1.866rem' }}>
                <span style={{ cursor: 'pointer' }} className="ant-form-item-children" onClick={() => { this.handleSave(id); }}>
                  <span className="ant-form-text blue" title="保存">
                    <Icon type="check" />
                  </span>
                </span>
              </Col>
            )
          }
        </Row>
      );
    }
    return this.renderText(this.state.type);
  }
}
export default FormItem;
