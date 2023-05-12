import React from 'react';
import { Form, Tabs, Card, Input } from 'antd';
import QuickFilter from './QuickFilter';
import MoreCondition from './MoreCondition';

//  高级筛选 -- 卡片形式
const FormItem = Form.Item;
class MoreConditions extends React.Component {
  constructor(props) {
    super(props);
    const { queryParameter = {} } = props;
    const { logicOrConditionStr = '' } = queryParameter;
    this.state = {
      currentKey: logicOrConditionStr === '' ? 'quickFilter' : 'mreCondition',
    };
  }
  onChangeQuickValue = (valueArray) => { // 快捷搜索的值域发生变化
    const { onAdvanceFilterChange } = this.props;
    onAdvanceFilterChange('quick_valueArray', valueArray);
  }
  onChangeAdvanceValue = (valueArray, titleStrs = '') => { // 高级搜索的值域发生变化
    const { onAdvanceFilterChange } = this.props;
    onAdvanceFilterChange('advancde_valueArray', valueArray, titleStrs);
  }
  onTabsChange = (key) => {
    // const { setFieldsValue } = this.props.form;
    // setFieldsValue({
    //   valueArray: this.value[key],
    // });
    this.setState({
      currentKey: key,
    });
  }
  value={
    quickFilter: [],
    mreCondition: [],
  }
  render() {
    const { queryParameter, dispatch } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { logicOrCondition, logicOrConditionStr, quickOrCondition = [] } = queryParameter;
    return (
      <div style={{ ...this.props.style }}>
        <Card
          className="m-card theme-default ant-card ant-card-wider-padding ant-card-padding-transition"
          style={{ height: 'auto' }}
          bordered={false}
        >
          <Tabs className="m-tabs-underline2 m-tabs-underline-small " onChange={this.onTabsChange} activeKey={this.state.currentKey} >
            <Tabs.TabPane tab="快捷搜索" key="quickFilter"> <QuickFilter valueArray={quickOrCondition} hanleInputTagPickerChange={this.onChangeQuickValue} form={this.props.form} /></Tabs.TabPane>
            <Tabs.TabPane tab="高级搜索" key="mreCondition"><MoreCondition dispatch={dispatch} logicOrConditionStr={logicOrConditionStr} valueArray={logicOrCondition} queryParameter={queryParameter} onChangeValue={this.onChangeAdvanceValue} {...this.props} /></Tabs.TabPane>
          </Tabs>
        </Card>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('quick_valueArray', { initialValue: [] })(<Input style={{ display: 'none' }} />)}
        </FormItem>
        <FormItem style={{ display: 'none' }}>
          {getFieldDecorator('advancde_valueArray', { initialValue: [] })(<Input style={{ display: 'none' }} />)}
        </FormItem>
        <FormItem style={{ display: 'none' }} >
          {getFieldDecorator('titleStrs', { initialValue: [] })(<Input />)}
        </FormItem>
      </div>
    );
  }
}
export default Form.create()(MoreConditions);
