import React, { Component } from 'react';
import { Button, Modal, Form, Select, Input, DatePicker, message } from 'antd';
import { SaveChnnlAccnBreakCust, ChannelServiceRecord } from '$services/newProduct';
import styles from '../index.less';
import { connect } from 'dva';
import moment from 'moment';
const { TextArea } = Input;

class Execute extends Component {
  state = {
    visible: false,
  }
  showModal = () => {
    let param = {
      proType: this.props.tableType,
      srcType: this.props.oprType,
      beignDate: this.props.beignDate,
      endDate: this.props.endDate,
      custType: this.props.custType,
      dept: this.props.dept,
      chnlId: this.props.chnlId,
      grpId: this.props.grpId,
      staff: this.props.staff,
      isAll: this.props.isAll,
      accnId: this.props.accnId,
    };
    /* this.setState({
      visible: true,
    }); */
    SaveChnnlAccnBreakCust(param).then(res => {
      if (res.code > 0) {
        this.setState({
          visible: true,
        });
      }
    }).catch(error => {
      Modal.warn({ content: !error.success ? error.message : error.note });
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
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, value) => {
      if (!err) {
        let param = {
          "kindType": this.props.selectAll ? 1 : 0,
          "staffAccount": this.props.selectedRows.map(item => item.custNm).join(','),
          "md5": this.props.note,
          "nServiceRequest": value.nextServe,
          "reminderDate": value.remindTime?.format('YYYYMMDD') * 1,
          "serviceContent": value.serveContent,
          "serviceDate": value.serveDate?.format('YYYYMMDD') * 1,
          "serviceMode": value.serveMode * 1,
          "serviceProject": '',
          accnStage: this.props.tableType,
          "serviceTitle": value.serveTopic,
          "serviceType": value.serveType * 1,
        };
        ChannelServiceRecord(param).then(res => {
          if (res.code > 0) {
            this.setState({
              visible: false,
            });
            this.props.fetchData();
            this.props.resetTable();
            message.info('操作成功');
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    });
  }
  render() {
    const { btnStatus, customerTotal, selectedRowKeys, selectAll } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const { FWLB, FWFS, NRMB } = this.props.dictionary;
    return (
      <div>
        <Button onClick={this.showModal} disabled={btnStatus ? false : true} className={`${styles.bannedBtn} ${btnStatus ? styles.activeBtn : styles.deactiveBtn}`} >执行{selectedRowKeys.length > 0 || selectAll ? `(${customerTotal})` : ''}</Button>
        <Modal
          title="客户服务记录"
          visible={this.state.visible}
          className={styles.exeModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose={true}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label='服务类型  ' className={styles.formItem} colon={false}>
              {getFieldDecorator('serveType', {
                rules: [{ required: true, message: '请选择服务类型' }],
              })(
                <Select placeholder='请选择服务类型'>
                  {FWLB?.map(item => (
                    <Select.Option key={item.ibm} value={item.ibm}>
                      {item.note}
                    </Select.Option >
                  ))}

                </Select>
              )}
            </Form.Item>
            <Form.Item label='服务日期' className={styles.formItem} colon={false}>
              {getFieldDecorator('serveDate', {
                rules: [{ required: true, message: '请选择服务日期' }],
              })(
                <DatePicker
                  placeholder='请选择服务日期'
                  dropdownClassName={styles.calendar}
                  disabledDate={current => current <= moment().subtract('day', 8) || current > moment().endOf('day')}
                />
              )}
            </Form.Item>
            <Form.Item label='服务方式' className={styles.formItem} colon={false}>
              {getFieldDecorator('serveMode', {
                rules: [{ required: true, message: '请选择服务方式' }],
              })(
                <Select placeholder='请选择服务方式'>
                  {FWFS?.map(item => (
                    <Select.Option key={item.ibm} value={item.ibm}>
                      {item.note}
                    </Select.Option >
                  ))}

                </Select>
              )}
            </Form.Item>
            <Form.Item label='服务主题' className={styles.formItem} colon={false}>
              {getFieldDecorator('serveTopic', {
                rules: [{ required: true, message: '请输入服务主题' }],
              })(
                <Input placeholder='请输入服务主题' style={{ width: 200 }} autoComplete='off' />
              )}
            </Form.Item>
            <Form.Item label='内容模板' className={styles.formItem} colon={false}>
              {getFieldDecorator('content')(
                <Select placeholder='请选择内容模板' dropdownClassName={styles.contentSelect} onChange={(value) => { setFieldsValue({ 'serveContent': NRMB?.find(item => item.ibm === value)?.note }); }}>
                  {NRMB?.map(item => (
                    <Select.Option key={item.ibm} value={item.ibm} title={item.note}>
                      {item.note}
                    </Select.Option >
                  ))}

                </Select>
              )}
            </Form.Item>
            <Form.Item label='服务内容' className={styles.formItem} colon={false}>
              {getFieldDecorator('serveContent', {
                initialValue: NRMB?.find(item => item.ibm === getFieldValue('content'))?.note,
                rules: [{ required: true, message: '请输入服务内容' }],
              })(
                <TextArea style={{ width: 200 }}
                  placeholder="请输入服务内容"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              )}
            </Form.Item>
            <Form.Item label='下次服务需求' className={styles.formItem} colon={false}>
              {getFieldDecorator('nextServe')(
                <Input style={{ width: 200 }} autoComplete='off' placeholder='服务需求' />
              )}
            </Form.Item>
            <Form.Item label='提醒时间' className={styles.formItem} colon={false}>
              {getFieldDecorator('remindTime')(
                <DatePicker
                  placeholder='请选择提醒时间'
                  dropdownClassName={styles.calendar}
                // disabledDate={current => current && current > moment().endOf('day')}
                />
              )}
            </Form.Item>
            <div className={styles.submit}>
              <Button htmlType='submit' className={styles.submitBtn} >保存</Button>
              <Button className={styles.cancelBtn} onClick={this.handleCancel}>取消</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(Execute));