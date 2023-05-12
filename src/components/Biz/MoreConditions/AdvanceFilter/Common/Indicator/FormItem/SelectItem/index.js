import React from 'react';
import { Select, message } from 'antd';
import _get from 'lodash/get';
import { FetchSysCommonTable } from '../../../../../../../../services/sysCommon';
import { FetchSeniorMenuQueryObject } from '../../../../../../../../services/customersenior';

class SelectItem extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value,
      dataSource: [],
    };
  }
  componentWillReceiveProps(props){
    const { value } = props;
    if(value && value !== this.state.value){
      this.setState({ value });
    }
  }
  handleChange=(value) => {
    const { onChange } = this.props;
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  }
  componentDidMount() {
    // tableType: 对象类型1:字典|2:livebos对象  tableName: 表明  tableDispCol:显示字段  tableValueCol:取值字段
    const { tableType, tableName } = this.props;
    if (tableType === 2) {
      this.fetchLivebosData(tableName);
    }
  }
  fetchLivebosData = (tableName) => {
    // FetchSysCommonTable({ objectName: tableName }).then((res) => {
    //   const { code, records = [] } = res;
    //   if (code > 0) {
    //     this.setState({
    //       dataSource: records,
    //     });
    //   }
    // }).catch(error => {
    //   message.error(!error.success ? error.message : error.note);
    // })
    const { tableValueCol, tableDispCol } = this.props;
    FetchSeniorMenuQueryObject({
      objectName: tableName,
      nameColumn: tableDispCol,
      idColumn: tableValueCol,
      paging: 0,
    }).then(res => {
      const { records = [] } = res;
      this.setState({
        dataSource: records,
      })
    }).catch(error => {
      message.error(!error.success ? error.message : error.note);
    })
  }
  render() {
    // tableType: 对象类型1:字典|2:livebos对象  tableName: 表明  tableDispCol:显示字段  tableValueCol:取值字段
    const { type, bkx = [], data = [], style = {}, tableValueCol, tableDispCol, tableType } = this.props;
    const { dataSource = [] } = this.state;
    const tempData = tableType === 1 ? data : dataSource;
    return (
      <React.Fragment>
        {
          <Select
            getPopupContainer={() => document.getElementById('advance_modal')}
            dropdownMatchSelectWidth mode={ type === 'MultiSelect' ? 'multiple' : '' }
            style={{ width: '100%', ...style }}
            value={this.state.value}
            onChange={this.handleChange}
          >
            {tempData.map((item) => {
              if (tableType === 2) {
                return <Select.Option title={_get(item, tableDispCol, '')} key={_get(item, tableValueCol, '')} value={_get(item, tableValueCol, '')}>{_get(item, tableDispCol, '')}</Select.Option>;
              } else {
                return <Select.Option title={_get(item, 'note', '')} key={_get(item, 'value', '')} value={_get(item, 'value', '')}>{_get(item, 'note', '')}</Select.Option>;
              }
            })}
          </Select>
        }
      </React.Fragment>
    );
  }
}
export default SelectItem;
