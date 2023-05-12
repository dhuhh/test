import React, { Component } from 'react';
import { Row, Col, Divider, Checkbox, Spin, Button } from 'antd';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../../index.less';
class InputCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      indeterminate: false,  // "全选框"样式属性
      checked: false,  // 列表筛选条件里的"全选"框值
      checkedGroup: [],  // 列表筛选条件里的多选框值
      cusIdArr: [],      //被选中的客户ID
      value: '',         //搜索框值
      loading: false,    //筛选框加载状态
      //checkDatas: this.props.tableProps.dataSource,
    };
    const { getInstance } = this.props;
    if (getInstance) {
      getInstance(this);     //暴露this给父组件
    }
  }

  componentDidMount() {

  }
  componentDidUpdate(preProps, preState) {
    const oldParams = JSON.stringify(preProps.checkDatas);
    const newParams = JSON.stringify(this.props.checkDatas);
    if (oldParams !== newParams) {  //
      this.setState({
        indeterminate: false,  // "全选框"样式属性
        checked: false,  // 列表筛选条件里的"全选"框值
        checkedGroup: [],  // 列表筛选条件里的多选框值
        cusIdArr: [],      //被选中的客户ID
        //value: '',         //搜索框值
        //loading: false,    //筛选框加载状态
      });
    }
  }
  // "全选"多选框改变
  handleCheckboxChange = () => {
    let { checked } = this.state;
    let checkedGroup = [];
    let cusIdArr = [];
    const { checkDatas } = this.props;
    checked = !checked;
    if (checked) {
      checkDatas.forEach((item, index) => {
        const { cus_id } = item;
        checkedGroup.push(index);
        cusIdArr.push(cus_id);
      });
    } else {
      checkedGroup = [];
    }
    this.setState({ checked, indeterminate: false, checkedGroup, cusIdArr }
      // , this.handleSearch()
    );
  }
  // 列筛选里checkbox改变
  handleChange = (item, index) => {
    const { cus_id } = item;
    let { checkedGroup, indeterminate = false, checked, cusIdArr } = this.state;
    const { checkDatas } = this.props;
    if (checkedGroup.indexOf(index) !== -1) {
      checkedGroup.splice(checkedGroup.indexOf(index), 1);
      cusIdArr.splice(cusIdArr.indexOf(cus_id), 1);
    } else {
      checkedGroup.push(index);
      cusIdArr.push(cus_id);
    }
    if (checkedGroup.length === 0) {
      indeterminate = false;
      checked = false;
    } else if (checkedGroup.length === checkDatas.length) {
      indeterminate = false;
      checked = true;
    } else {
      indeterminate = true;
    }
    this.setState({ checkedGroup, indeterminate, checked, cusIdArr }
      // , this.handleSearch()
    );
  }

  //输入框查询
  handleInputSearch = () => {
    const { value } = this.state;
    const { getData, dataIndex, handleFormChange } = this.props;
    let num = dataIndex === 'cus_no' ? 1 : 2;
    const cusNo = `${num}:${value}`;
    if (handleFormChange) {
      handleFormChange({ cusNo });
    }
    if (getData) {
      getData({ srchTp: 2, isSubmit: 1 });
    }
  }

  //重置按钮
  handleClear = (clearFilters) => {
    const { getData, handleFormChange, handleSetPayload } = this.props;
    if (getData) {
      const filters = [];
      if (handleFormChange) {
        handleFormChange({ cusNo: '', filters });
      }
      if (handleSetPayload) {
        handleSetPayload({ columnExtraTitle: {} });
      }
      getData({ isSubmit: 1 });
    }
    // if (handleSetFilter) {
    //   // const filters = [];
    //   // handleSetFilter({ filters });
    // }
    this.setState({
      checked: false,  // 列表筛选条件里的"全选"框值
      checkedGroup: [],  // 列表筛选条件里的多选框值
      cusIdArr: [],      //被选中的客户ID
    }, clearFilters());
  }

  //按钮搜索
  handleSearch = (confirm) => {
    const { cusIdArr, checkedGroup } = this.state;
    const { sort = '', handleFormChange, dataIndex, getData, checkDatas, handleSetPayload } = this.props;
    // if (checkedGroup.length === 0) {
    //   message.warn('需勾选后再搜索');
    //   return;
    // }
    let extraTitle = {};
    let cusNo = cusIdArr.join(',');
    //let num = dataIndex === 'cus_no' ? 1 : 2;
    const checkedGroupLength = checkedGroup.length;
    const checkDataLength = checkDatas.length;
    const length = cusIdArr.length;
    let strValue = '';
    if (getData) {
      if (checkedGroupLength !== 0 && checkedGroupLength === checkDataLength) { //如果全选
        getData({ srchTp: 1, cusNo: '', current: 1, isSubmit: 1 }); //全选 srchT为1,cusNo传空
        strValue = '全选';
      }
      else {                        //非全选 传风险id字符串
        if (checkedGroupLength === 0) {
          getData({ srchTp: 1, cusNo, current: 1, sort, isSubmit: 1 });
        }
        else {
          strValue = '多选';
          if (cusIdArr.length === 1) {
            const item = checkDatas.find(i => i.cus_id === cusIdArr[length - 1]);
            let { cus_nm } = item;
            let re = /^[0-9]+.?[0-9]*$/;
            let titleStr = cus_nm.substring(cus_nm.indexOf('(') + 1, cus_nm.lastIndexOf(')'));
            if (re.test(titleStr)) {
              cus_nm = cus_nm.substring(0, cus_nm.indexOf('('));  //如果括号内是数字就截取
            }
            strValue = cus_nm;
          }
          getData({ srchTp: 1, cusNo, current: 1, sort, isSubmit: 1 });
        }
      }
    }
    extraTitle[dataIndex] = strValue;
    if (handleFormChange) {
      const filters = [];
      filters.push(dataIndex);
      // if (strValue !== '') {
      //   handleFormChange({ filters });
      // }
      handleFormChange({ cusNo, current: 1, filters: strValue === '' ? [] : filters });
    }
    if (handleSetPayload) {
      handleSetPayload({ columnExtraTitle: extraTitle });
    }
    confirm();
    // this.setState({
    //   checkedGroup: [],
    //   cusIdArr: [],
    //   checked: false,
    // }
    //   //, confirm()
    // );
  }
  handleValueChange = (e) => {
    const value = lodash.get(e, 'target.value', '');
    this.setState({ value });
  }


  render() {
    // const { tableProps } = this.props;
    // const { value } = this.state;
    const { checkDatas, clearFilters, confirm } = this.props;
    return (
      <div style={{ width: '18rem', position: 'relative' }}>
        <Row style={{ padding: '10px 0 0 20px' }}>
          <Col>
            <Checkbox className={styles.options} indeterminate={this.state.indeterminate} checked={this.state.checked} onChange={this.handleCheckboxChange}>全选</Checkbox>
          </Col>
        </Row>
        <Divider style={{ margin: '10px 0' }}></Divider>
        {/* <Row style={{ padding: '5px 20px 10px' }}>
          <Col>
            <Input.Search
              placeholder={`请输入${title}`}
              value={value || ''}
              onChange={this.handleValueChange}
              onPressEnter={() => { const { handleOk } = this.props; if (handleOk && typeof handleOk === 'function') handleOk(); }}
              // suffix={<Icon type="search" />}
              onSearch={() => { this.handleInputSearch(); }}
            />
          </Col>
        </Row> */}
        {/* <Row style={{ padding: '0 20px 10px' }}> */}
        <Spin spinning={this.state.loading}>
          <Scrollbars style={{ height: '20rem' }}>
            {
              checkDatas.map((item, index) => {
                return (
                  <Col key={index} style={{ display: 'flex', margin: '15px 0 0', padding: '0 1.666rem' }}>
                    <span><Checkbox className={styles.options} checked={this.state.checkedGroup.includes(index) ? true : false} onChange={() => { this.handleChange(item, index); }} /></span>
                    <span style={{ marginLeft: '0.666rem' }}>{item.cus_nm}</span>
                  </Col>
                );
              })
            }
            {

              // [{ cusid: '2', cus_nm: '银卡(1)' }, { cusid: '1', cus_nm: '普通卡(1)' }, { cusid: '3', cus_nm: '金卡(2)' }].map((item, index) => {
              //   return (
              //     <Col key={index} style={{ display: 'flex', margin: '15px 0 0', padding: '0 1.666rem' }}>
              //       <span><Checkbox checked={this.state.checkedGroup.includes(index) ? true : false} onChange={() => { this.handleChange(item, index); }} /></span>
              //       <span style={{ marginLeft: '0.666rem' }}>{item.cus_nm}</span>
              //     </Col>
              //   );
              // })

            }
          </Scrollbars>
        </Spin>
        {/* </Row> */}
        <Row style={{ padding: '10px 14px', textAlign: 'right' }}>
          <Col>
            <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px' }} onClick={() => this.handleClear(clearFilters)}>
              清 空
            </Button>
            <Button
              className="m-btn-radius ax-btn-small m-btn-blue"
              //style={{ marginLeft: '1rem', background: '#244fff', borderRadius: 0, color: '#FFFFFF' }}
              onClick={() => this.handleSearch(confirm)}
            // icon="search"
            >
              确 定
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

}

export default InputCheckbox;
