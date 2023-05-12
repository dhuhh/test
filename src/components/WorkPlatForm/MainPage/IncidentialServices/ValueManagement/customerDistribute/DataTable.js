import React from 'react';
import { Form, Table } from 'antd';
import EditableCell from './EditableCell';
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { dataSource, distributeType = '' } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    let columnss = distributeType === '1' ?
      [
        {
          title: 'OA员工账号',
          dataIndex: 'account',
          width: '285px',
          align: 'center',
        },
        {
          title: '员工姓名',
          dataIndex: 'name',
          width: '285px',
          align: 'center',
        },
        {
          title: '分配客户数',
          dataIndex: 'customerNum',
          editable: true,
          width: '285px',
          align: 'center',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          render: (text, record) =>
            dataSource.length >= 1 ? (
              <div onClick={() => this.props.handleDelete(record)}>
                <a className='m-darkgray'>删除</a><i className="iconfont icon-shanchu" style={{ fontSize: '15px', cursor: 'pointer' }} />
              </div>
            ) : null,
        },
      ] :
      [
        {
          title: '部门代码',
          dataIndex: 'bmdm',
          width: '285px',
          align: 'center',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '部门名称',
          dataIndex: 'bmmc',
          width: '285px',
          align: 'center',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '分配客户数',
          dataIndex: 'customerNum',
          editable: true,
          width: '285px',
          align: 'center',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          className: 'm-black',
          render: (text, record) =>
            dataSource.length >= 1 ? (
              <div onClick={() => this.props.handleDelete(record)}>
                <a className='m-darkgray'>删除</a><i className="iconfont icon-shanchu" style={{ fontSize: '15px', cursor: 'pointer' }} />
              </div>
            ) : null,
        },
      ];

    const columns = columnss.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          className: 'm-form-bss-item-tableEditing',
          handleSave: this.props.handleSave,
        }),
      };
    });

    return (
      <React.Fragment>
        <Table
          className='m-Card-Table'
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          scroll={{ y: dataSource.length > 8 ? 480 : '' }}
          columns={columns}
          pagination={false}
        />
      </React.Fragment>
    );

  }
}

export default DataTable;
