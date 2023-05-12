import React from 'react';
import { Input, Select, DatePicker, message, Cascader } from 'antd';
import { FetchSysCommonTable } from '../../../services/sysCommon';
import TreeUtils from '../../../utils/treeUtils';
import UploadFiles from './UploadFiles';
import styles from './index.less';

// 换一换组件
class Item extends React.Component {
  constructor(props) {
    super(props);
    const { item, dictionary, changeDataForm } = props;
    let { value } = props;
    const { dydxlx, dydxmc, controlType } = item;
    let datas = [];
    if (dydxlx === '1' && controlType !== '5') { // 获取字典项
      datas = dictionary[dydxmc] || [];
      datas = changeDataForm(datas);
    }
    if (controlType === '5') { // 级联选择
      value = value === '' ? [] : value.split(';');
    }
    if (controlType === '2') { // 多选
      value = value === '' ? [] : value.split('#');
    }
    this.state = {
      value,
      datas,
    };
  }
  componentDidMount() {
    this.fetchDictionary();
  }
  fetchDictionary = async () => {
    const { item, changeObjectForm } = this.props;
    const { controlType, dydxlx, dydxmc = '', gjz = 'code', xszd = 'NAME' } = item;
    if (dydxlx === '2' && controlType === '1') {
      const data = await this.fetchSysCommonTable(dydxmc);
      const { records = [] } = data;
      let datas = [];
      datas = changeObjectForm(records || [], gjz, xszd);
      this.setState({
        datas,
      });
    } else if (dydxlx === '1' && controlType === '5') {
      const dydxmcs = Array.from(new Set(dydxmc.split(';')));
      const gjzs = gjz.split(';');
      const xszds = xszd.split(';');
      let treeDatas = [];
      for (let i = 0; i < dydxmcs.length; i++) {
        const tempItem = dydxmcs[i];
        const dxmc = tempItem.indexOf('|') > 0 ? tempItem.substring(0, tempItem.indexOf('|')) : tempItem;
        const fid = tempItem.indexOf('|') > 0 ? tempItem.substring(tempItem.indexOf('|') + 1) : '';
        const data = await this.fetchSysCommonTable(dxmc);
        const { records = [] } = data;
        let datas = [];
        datas = changeObjectForm(records || [], gjzs[i], xszds[i], fid);
        treeDatas = treeDatas.concat(datas);
      }
      const datas = TreeUtils.toTreeData(treeDatas, { keyName: 'key', pKeyName: 'fid', titleName: 'label', normalizeTitleName: 'label', normalizeKeyName: 'value' }, true);
      treeDatas = [];
      datas.forEach((temp) => {
        const { children } = temp;
        treeDatas.push(...children);
      });
      this.setState({
        datas: treeDatas,
      });
    }
  }
  fetchSysCommonTable = (dydxmc) => {
    return FetchSysCommonTable({
      // condition: '',
      condition: {},
      objectName: dydxmc,
      queryOption: {
        batchNo: 1,
        batchSize: 9999,
        queryCount: false,
        valueOption: 0,
      },
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handelSelect = (value) => {
    console.log(value, '123');
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handelMutiSelectChange = (value) => {
    this.setState({
      value,
    });
    this.triggerChange(value.join('#'));
  }
  handelInput = (e) => {
    const { value } = e.target;
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handelDate = (value) => {
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handelCascaderSelect = (value) => {
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  handelNumberInput = (e) => {
    let { target: { value } } = e;
    value = value.replace(/[^\d^.^-]+/g, '');
    this.setState({
      value,
    });
    this.triggerChange(value);
  }
  triggerChange = (value) => {
    const { zbbm, setItemValue } = this.props;
    if (setItemValue) {
      setItemValue(zbbm, value);
    }
  }
  render() {
    const selelProps = {
      getPopupContainer: () => document.getElementById('customerlist_modal_ServiceRecord'),
    };
    const { item, handleUpdatachange, dictionary } = this.props;
    const { controlType, attrCode: zbbm, ibm } = item;
    switch (controlType) {
      case '1':
      {
        return (
          <Select {...selelProps} showSearch onSelect={this.handelSelect} value={this.state.value} filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
            {
            dictionary[ibm] && dictionary[ibm].map((tempitem) => {
              return <Select.Option key={tempitem.ibm} value={tempitem.ibm}>{tempitem.note}</Select.Option>;
            })
          }
          </Select>
        );
      }
      case '2':
      {
        return (
          <Select
            showSearch
            mode="multiple"
            value={this.state.value}
            onChange={this.handelMutiSelectChange}
            {...selelProps}
            // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
            dictionary[ibm] && dictionary[ibm].map((tempitem) => {
              return <Select.Option key={tempitem.ibm} value={tempitem.ibm}>{tempitem.note}</Select.Option>;
            })
          }
          </Select>
        );
      }
      case '3':
        return (
          <Input value={this.state.value} onChange={this.handelInput} />
        );
      case '4':
        return (
          <div ref={(c) => { this.dataPicker = c; }}>
            <DatePicker getCalendarContainer={() => this.dataPicker} value={this.state.value} onChange={this.handelDate} />
          </div>
        );
      case '5':
        return (
          <div ref={(c) => { this.cascader = c; }}>
            <Cascader
              getPopupContainer={() => this.cascader}
              className={`${styles.mCascader}`}
              options={this.state.datas}
              value={this.state.value}
              onChange={this.handelCascaderSelect}
              placeholder="请选择"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showSearch
            />
          </div>
        );
      case '6':
        return (
          <Input value={this.state.value} onChange={this.handelNumberInput} />
        );
      case '7':
      return (
          // const arr = attrValue.split(':') || [];
          // const tx = arr[0] || '';
          // const txpath = arr[1] || ''; tx={tx} txpath={txpath}
          <UploadFiles id={zbbm.toLocaleLowerCase()}  onChange={handleUpdatachange} stacitText={false} isEdit={1} />
      );
      default:
        return <Select showSearch value={this.state.value} placeholder="请选择" options={[]} />;
    }
  }
}
export default Item;
