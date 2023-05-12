import React from 'react';
import { Checkbox } from 'antd';
// import styles from './index.less';
// import { FetchCusHotSearchQuota } from '../../../../services/customerbase/mySearchScheme';
import { fetchCommonSearchInfo } from '../../../../services/customersenior';

class CardFilter extends React.Component {
  state = {
    selectedIndicattor: [], // 已经选中的指标
    // hotIndicators: [], // 热门筛选的指标
    commonIndicators: [], // 常用指标
    checkedLabel: [], // 已经选中的标签
  }
  componentDidMount() {
    this.fetCommonIndicators();
    // this.fetchCusHotSearchQuota();
  }
  componentWillReceiveProps(nextProps) {
    const { valueArray = [] } = nextProps;
    if (valueArray.length === 0) {
      this.cleanValues();
    }
  }
  fetCommonIndicators = () => { // 获取常用条件
    fetchCommonSearchInfo().then((response) => {
      const { records = [] } = response;
      if (Array.isArray(records)) {
        const commonIndicators = [];
        records.forEach((item) => {
          const { desc, id, encode, code } = item;
          const lestIndex = commonIndicators.findIndex((temp) => { return temp.desc === desc; }); // 合并相同desc的条件
          const { encode: lastEncode = [] } = lestIndex >= 0 ? commonIndicators[lestIndex] : { encode: [] };
          lastEncode.push(encode);
          if (lestIndex >= 0) {
            commonIndicators[lestIndex] = {
              id,
              desc,
              encode: lastEncode,
              code,
            };
          } else {
            commonIndicators.push({
              id,
              desc,
              encode: lastEncode,
              code,
            });
          }
        });
        this.setState({
          commonIndicators,
        });
      }
    });
  }
  // fetchCusHotSearchQuota= () => { // 获取热门条件
  //   // 获取热门条件
  //   const records = [{
  //     id: 1,
  //     code: 'account_open_date',
  //     encode: 'account_type:1',
  //     desc: '最近一周普通账户开户',
  //     sssx: 1,
  //   }, {
  //     id: 1,
  //     code: 'account_open_date',
  //     encode: 'range:100,1000',
  //     desc: '最近一周普通账户开户',
  //     sssx: 1,
  //   }, {
  //     id: 2,
  //     code: 'account_open_date',
  //     encode: 'account_type:2',
  //     desc: '最近一周信用账户开户',
  //     sssx: 0,
  //   }, {
  //     id: 2,
  //     code: 'account_open_date',
  //     encode: 'range:100,1000',
  //     desc: '最近一周信用账户开户',
  //     sssx: 0,
  //   }];
  //   if (Array.isArray(records)) {
  //     const hotIndicators = [];
  //     records.forEach((item) => {
  //       const { desc, id, encode, code, sssx } = item;
  //       const { encode: lastEncode = [] } = hotIndicators[parseInt(sssx, 10)] || {};
  //       lastEncode.push(encode);
  //       hotIndicators[parseInt(sssx, 10)] = {
  //         id,
  //         desc,
  //         encode: lastEncode,
  //         code,
  //       };
  //     });
  //     this.setState({
  //       hotIndicators,
  //     });
  //   }
  // }
  // 清空
  cleanValues = () => {
    this.setState({
      selectedIndicattor: [],
      checkedLabel: [],
    });
  }
  handleChechked=(item, e) => { // 处理checkeBox
    if (e.target.checked) {
      this.state.selectedIndicattor.push(item);
      this.state.checkedLabel.push(item.desc);
    } else {
      this.state.selectedIndicattor = this.state.selectedIndicattor.filter((temp) => { return temp.desc !== item.desc; });
      this.state.checkedLabel = this.state.checkedLabel.filter((temp) => { return temp !== item.desc; });
    }
    this.setState({
      selectedIndicattor: this.state.selectedIndicattor,
      checkedLabel: this.state.checkedLabel,
    }, () => { this.triggerChange(); });
  }
  // 将改变的值传递到外部
  triggerChange = () => {
    const { hanleInputTagPickerChange } = this.props;
    const { selectedIndicattor = [] } = this.state;
    // const valueArray = [];
    const obj = {};
    selectedIndicattor.forEach((indicator) => {
      const tempIndicattor = {};
      const { code, encode = [] } = indicator;
      encode.forEach((item) => {
        const [key, value] = item.split(':');
        tempIndicattor[key] = value;
      });
      tempIndicattor.code = code;
      // valueArray.push(tempIndicattor);
      if (obj[code]) {
        obj[code].push(tempIndicattor);
      } else {
        obj[code] = [];
        obj[code].push(tempIndicattor);
      }
    });
    hanleInputTagPickerChange(Object.values(obj));
  }

  render() {
    return (
      <div className="ant-card-body m-hight-search-body">
        <div className="m-list-item">
          <div className="m-list-title">已选条件</div>
          <ul className="m-list-cont" id="moreConditions_indexCard">
            {
              this.state.selectedIndicattor.map((item, index) => {
                const { desc = '' } = item;
                return (
                  <li key={`${item}_${index}`} className="m-list-form m-form ant-form ">
                    <div className="m-list-select m-list-current">
                      <span className="ant-checkbox-wrapper-checked">
                        <p className="m-item-info" style={{ lineHeight: '0' }}>{name}<br /><span className="blue">{desc}</span> </p>
                      </span>
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className="m-list-item">
          <div className="m-list-title">常用搜索</div>
          <ul className="m-list-cont">
            {this.state.commonIndicators.map((item) => {
                  const { desc = '' } = item;
                  return (
                    <li key={desc} className="m-list-form m-form ant-form ">
                      <div className="m-list-select">
                        <Checkbox checked={this.state.checkedLabel.includes(desc)} onChange={(checked) => { this.handleChechked(item, checked); }}>{desc}</Checkbox>
                      </div>
                    </li>
                    );
                })}
          </ul>
        </div>
        {/* <div className="m-list-item">
          <div className="m-list-title">热门搜索</div>
          <ul className="m-list-cont">
            {this.state.hotIndicators.map((item) => {
              const { desc = '' } = item;
              let flag = false; // 去重
              for (const temp of this.state.commonIndicators) {
                if (temp.desc === item.desc) {
                  flag = true;
                  break;
                }
              }
              if (!flag) {
                return (
                  <li key={desc} className="m-list-form m-form ant-form ">
                    <div className="m-list-select">
                      <Checkbox checked={this.state.checkedLabel.includes(desc)} onChange={(checked) => { this.handleChechked(item, checked); }}>{desc}</Checkbox>
                    </div>
                  </li>);
              }
              return null;
                })}
          </ul>
        </div> */}
      </div>
    );
  }
}
export default CardFilter;
