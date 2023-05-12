import React, { Component } from 'react';
import { Button, message, Modal } from 'antd';
import { SaveChnnlAccnBreakCust } from '$services/newProduct';
import styles from '../index.less';

export default class OtherOperate extends Component {
  handleCust = () => {
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
    if (this.props.status) {
      param = { ...param, status: this.props.status };
    }
    SaveChnnlAccnBreakCust(param).then(res => {
      if (res.code > 0) {
        this.props.fetchData();
        this.props.resetTable();
        message.info('操作成功');
      }
    }).catch(error => {
      Modal.warn({ content: !error.success ? error.message : error.note });
    });;
  }
  render() {
    const { btnStatus, customerTotal, selectedRowKeys, selectAll } = this.props;
    return (
      <div>
        <Button onClick={this.handleCust} disabled={btnStatus ? false : true} className={`${styles.bannedBtn} ${btnStatus ? this.props.oprType === 3 ? styles.ignoreBtn : styles.activeBtn : styles.deactiveBtn}`} >{this.props.oprType === 1 ? '本人跟进' : this.props.oprType === 2 ? '重新跟进' : '忽略'}{selectedRowKeys.length > 0 || selectAll ? `(${customerTotal})` : ''}</Button>
      </div>
    );
  }
}
