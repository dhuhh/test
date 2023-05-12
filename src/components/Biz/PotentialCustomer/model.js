import React from 'react';
import BasicModal from '../../Common/BasicModal';
import PotentialCustomerModal from '../PotentialCustomer';
// import styles from './index.less';

class PotentialCustomerMainModal extends React.Component {
  render() {
    const modalProps = {
      width: '70rem',
      title: '潜在客户全景',
      footer: null,
      ...this.props,
    };
    return (
      <BasicModal {...modalProps}>
        <PotentialCustomerModal />
      </BasicModal>
    );
  }
}
export default PotentialCustomerMainModal;
