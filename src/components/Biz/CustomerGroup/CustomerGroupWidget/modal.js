import React from 'react';
import BasicModal from '../../../Common/BasicModal';
import CustomerGroupPage from '../CustomerGroupPage';
// import styles from './index.less';

class Modal extends React.Component {
  render() {
    const { visible, onCancel, title = '客户群管理', style = { top: '2rem' }, ...restProps } = this.props;
    const modalProps = {
      title,
      visible,
      style,
      width: '90%',
      onCancel,
      footer: null,
    };
    return (
      <BasicModal {...modalProps}>
        <CustomerGroupPage {...restProps} />
      </BasicModal>
    );
  }
}
export default Modal;
