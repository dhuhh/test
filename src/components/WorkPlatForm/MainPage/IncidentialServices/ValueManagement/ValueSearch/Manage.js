import React from 'react';
import { Button, Modal, message } from 'antd';
import TipModal from '../../Common/TipModal';
import { OperateAssignIntrptCust } from '../../../../../../services/incidentialServices';

class Manage extends React.Component {
    state = {
      visible: false,
      content: '',
    }

    componentDidMount() {
    //   Modal.destroyAll();
    }

    onOperationCh = () => {
      const { visible } = this.state;
      const { data: { uuid }, selectAll, selectedRowKeys, selectedCount } = this.props;
      if (selectedCount === 0) {
        Modal.info({ content: '请至少选择一个客户!' });
        return false;
      } else {
        const Params = {
          uuid: selectedRowKeys.join(','), // 所选客户对应的uid
          asgnTp: 3, // 1.分配；2.转办；3.撤回
          asgnMode: '', // 1.按员工；2.按部门；
          wthrAll: selectAll ? 1 : 0, // 0.非全选；1.全选
          qrySqlId: uuid,
          objNo: '', // 执行人；执行部门
          asgnNum: '', // 客户数
        };
        OperateAssignIntrptCust({ ...Params, asgnParm: '0' }).then((result) => {
          const { code: cxCode = 0, note: cxNote = '' } = result;
          if (cxCode > 0) {
            Modal.confirm({
              title: '提示：',
              content: cxNote,
              okText: '确定',
              cancelText: '取消',
              onOk: () => this.handleRevocation({ ...Params, asgnParm: '1' }),
            });
          }
        }).catch((error) => {
          this.setState({
            visible: !visible,
            content: !error.success ? error.message : error.note,
          });
        });
      }
    }

    handleRevocation = (plaoy) => {
      OperateAssignIntrptCust(plaoy).then((result) => {
        const { code: zxCode = 0, note: zxNote = '' } = result;
        if (zxCode > 0) {
          message.success(zxNote);
          this.props.refresh(1, 10); // 刷新列表
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    handleCancel = () => {
      // 取消按钮的操作
      const { visible } = this.state;
      this.setState({
        visible: !visible,
        content: '',
      });
    }

    render() {
      const { visible, content } = this.state;
      return (
        <React.Fragment>
          <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c ml14 fs14' style={{ border: 'none' }} onClick={() => this.onOperationCh()}>撤回</Button>
          <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
        </React.Fragment>
      );
    }
}

export default Manage;

