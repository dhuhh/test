import React from 'react';
// import { message } from 'antd';
import BasicModal from '../../../../../../Common/BasicModal';
import TransferItem from './transferItem';
// import { FetchSaveMySearchInfo } from '../../../../../../../../services/customerbase/customerListHandle';

class CustomizedColumn extends React.Component {
  state = {
    visibleModal: false,
    selectedKeys: [], // 已选指标IDs
    selectedTitles: [], // 已选指标名称
  };

  handleTransferSelect = ({ selectedKeys, selectedTitles }) => {
    this.setState({ selectedKeys, selectedTitles });
  }

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  }
  // 确定按钮
  handleOk = () => {
    const { cusListDisplayColumnDatas } = this.props;
    const { selectedKeys } = this.state;
    const fieldsCode = ['customer_id', 'customer_no', 'customer_name'];
    const columns = [
      { dataIndex: 'customer_no',
        title: '客户号',
        render: (_, record) => (
          <React.Fragment>
            <a className="blue-link">{record.khmc}</a>
            <div className="gray">{record.khh}</div>
          </React.Fragment>),
      },
      {
        dataIndex: 'customer_name',
        title: '客户名称',
      },
    ];
    selectedKeys.forEach((item) => {
      const codeIndex = cusListDisplayColumnDatas.findIndex((temp) => { return temp.jdid === item; });
      if (codeIndex >= 0) {
        fieldsCode.push(cusListDisplayColumnDatas[codeIndex].ysjbm);
        columns.push({
          key: item,
          dataIndex: cusListDisplayColumnDatas[codeIndex].ysjbm,
          title: cusListDisplayColumnDatas[codeIndex].xsmc,
        });
      }
    });
    this.props.handleSearch(fieldsCode, columns); // 刷新页面.
    this.setState({
      visibleModal: false,
    });
  }
  // 取消按钮
  handleCancel = () => {
    this.setState({
      visibleModal: false,
    });
  }
  render() {
    const { selectedKeys, selectedTitles } = this.state;
    const { cusListDisplayColumnDatas = [] } = this.props;
    return (
      <span >
        {/* <a onClick={this.showModal} ><i className="iconfont icon-setLine" /></a> */}
        <a onClick={this.showModal} title="自定义输出列">
          <div className="m-table-icon" style={{ width: '2.566rem', height: '2.566rem', lineHeight: '2.566rem' }}>
            <i className="iconfont icon-zdysz" style={{ fontSize: '1.633rem' }} />
          </div>
        </a>
        <BasicModal
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          title="自定义列设置"
          width="50%"
          style={{ margin: '0 auto', top: 40 }}
          maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <TransferItem selectedKeys={selectedKeys} selectedTitles={selectedTitles} allDatas={cusListDisplayColumnDatas} handleTransferSelect={this.handleTransferSelect} />
        </BasicModal>
      </span>
    );
  }
}
export default CustomizedColumn;
