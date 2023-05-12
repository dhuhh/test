import React from 'react';
import { Input, Icon, message } from 'antd';
import BasicModal from '../../../../../../../Common/BasicModal';
import Content from './Content';
import FetchMultiContent from './FetchMultiContent';
import FetchSingleContent from './FetchSingleContent';
import { FetchSeniorMenuQueryObject } from '../../../../../../../../services/customersenior';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    const { value = [], data = [], tableType = 1 } = props;
    let selectedRows = [];
    const tempValue = Array.isArray(value) ? value : (value && value.split(',')) || [];
    if (tableType === 1) {
      tempValue.forEach((item) => {
        const noteIndex = data.findIndex((temp) => { return temp.ibm === item; });
        const note = noteIndex >= 0 ? data[noteIndex].note : '';
        selectedRows.push({
          note,
        });
      });
    }
    this.state = {
      visible: false,
      data,
      selectedRows,
      selectedRowKeys: tempValue,
    };
  }
  componentDidMount() {
    const { value = '', data = [], tableType = 1 } = this.props;
    let tempValue = '';
    if (tableType === 1) {
      const selectedRows = [];
      tempValue = Array.isArray(value) ? value : value.split(',');
      tempValue.forEach((item) => {
        const noteIndex = data.findIndex((temp) => { return temp.ibm === item; });
        const note = noteIndex >= 0 ? data[noteIndex].note : '';
        selectedRows.push({
          note,
        });
      });
      this.setState({
        data,
        selectedRows,
        selectedRowKeys: tempValue,
      });
    } else {
      tempValue = Array.isArray(value) ? value.join(',') : value;
      this.queryNames(tempValue);
    }
  }
  componentWillReceiveProps(props) {
    const { value = [], data = [], tableType = 1 } = props;
    let tempValue = '';
    if (tableType === 1) {
      const selectedRows = [];
      tempValue = Array.isArray(value) ? value : value.split(',');
      tempValue.forEach((item) => {
        const noteIndex = data.findIndex((temp) => { return temp.ibm === item; });
        const note = noteIndex >= 0 ? data[noteIndex].note : '';
        selectedRows.push({
          note,
        });
      });
      this.setState({
        data,
        selectedRows,
        selectedRowKeys: tempValue,
      });
    } else {
      tempValue = Array.isArray(value) ? value.join(',') : value;
      this.queryNames(tempValue);
      this.setState({
        data,
        selectedRowKeys: tempValue,
      });
    }
  }

  queryNames = async (keyValues) => {
    if(keyValues) {
      const { tableName, tableDispCol, tableValueCol } = this.props;
      await FetchSeniorMenuQueryObject({ idStr: keyValues, objectName: tableName, nameColumn: tableDispCol, idColumn: tableValueCol }).then(res => {
        const { records = [] } = res;
        this.setState({
          selectedRows: records,
        });
      }).catch(error => {
        message.error(!error.success ? error.message : error.note);
      })
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleSearch = (value) => {
    if (this.table) {
      this.table.handleSearch(value);
    }
  }
  handleOk = () => {
    const { onChange } = this.props;
    let tempSelectedRows = [];
    let tempSelectedRowKeys = [];
    if (onChange && this.table) {
      const { selectedRowKeys, selectedRows } = this.table.getValues();
      tempSelectedRows = selectedRows;
      tempSelectedRowKeys = selectedRowKeys;
      onChange(selectedRowKeys);
    }
    this.setState({
      visible: false,
      selectedRows: tempSelectedRows,
      selectedRowKeys: tempSelectedRowKeys,
    });
  }
  render() {
    // tableType: 对象类型1:字典|2:livebos对象  tableName: 表明  tableDispCol:显示字段  tableValueCol:取值字段
    const { type = 'multi', tableName, tableDispCol, tableValueCol, tableType = 1 } = this.props;
    const { visible, selectedRows, selectedRowKeys, data = [] } = this.state;
    const names = [];
    if (Array.isArray(selectedRows)) {
      selectedRows.forEach((item) => {
        if (tableType === 1) {
          const { note = '' } = item;
          if (note) {
            names.push(note);
          }
        } else {
          if (item[tableDispCol]) {
            names.push(item[tableDispCol]);
          }
        }
      });
    }
    const modalProps = {
      width: '70rem',
      title: <Input.Search
        placeholder="请输入关键字"
        style={{ width: '20rem' }}
        onSearch={this.handleSearch}
        enterButton
      />,
      visible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
    };
    return (
      <React.Fragment>
        <BasicModal {...modalProps}>
          {
            tableType === 1 ?
            (<Content type={type} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows} data={data} ref={(c) => { this.table = c; }} tableName={tableName} tableDispCol={tableDispCol} tableValueCol={tableValueCol} tableType={tableType} />) :
            (type === 'MultiModal' ?
            <FetchMultiContent type={type} selectedRowKeys={selectedRowKeys} selectedRows={selectedRows} data={data} ref={(c) => { this.table = c; }} tableName={tableName} tableDispCol={tableDispCol} tableValueCol={tableValueCol} tableType={tableType} />:
            (<FetchSingleContent selectedRowKeys={selectedRowKeys} selectedRows={selectedRows} data={data} ref={(c) => { this.table = c; }} tableName={tableName} tableDispCol={tableDispCol} tableValueCol={tableValueCol} tableType={tableType} />))
          }
        </BasicModal>
        <Input
          value={names.join(',')}
          readOnly
          className="m-input"
          suffix={<Icon type="search" onClick={this.showModal} className="certain-category-icon" />}
          onClick={this.showModal}
        />
      </React.Fragment>
    );
  }
}

export default Modal;
