import React from 'react';
import { Input, Form } from 'antd';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
    state = {
      editing: false,
    };
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    };
  
    save = e => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields((error, values) => {
        let newValues = {
          customerNum: values[e.currentTarget.id],
        };
        if (error && error[e.currentTarget.id]) {
          this.props.form.setFieldsValue({ [`customerNum${record.key}`]: 0 });
          newValues = {
            customerNum: 0,
          };
          // return;
        } else {

        }
        this.toggleEdit();
        handleSave({ ...record, ...newValues });
      });
    };
  
    renderCell = form => {
      this.form = form;
      const { dataIndex, record } = this.props;
      const { editing } = this.state;
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {this.props.form.getFieldDecorator(`customerNum${record.key}`, {
            rules: [
              {
                required: true,
                pattern: new RegExp(/^(0|[1-9][0-9]*)$/, "g"),
                message: `请输入符合范围的数字`, //${title} 必填.
              },
            ],
            initialValue: record[dataIndex] === 0 ? undefined : record[dataIndex],
          })(<Input style={{ width: '60%',textAlign: 'center' }} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          // style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          <Input style={{ width: '60%',textAlign: 'center', height: '39px' }} value={record[dataIndex] === 0 ? undefined : record[dataIndex]} placeholder="请输入" />
        </div>
      );
    };
  
    render() {
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
      } = this.props;
      return (
        <td {...restProps}>
          {editable ? (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
          ) : (
            children
          )}
        </td>
      );
    }
}

export default Form.create()(EditableCell);
