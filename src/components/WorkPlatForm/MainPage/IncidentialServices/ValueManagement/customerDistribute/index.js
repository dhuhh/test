/* eslint-disable array-callback-return */
import React from 'react';
import { Row, Col, Modal, message, Button, Tabs, Form } from 'antd';
import BasicModal from '../../../../../Common/BasicModal';
import { OperateAssignIntrptCust, QueryOpenAccountMsg } from '../../../../../../services/incidentialServices';
import DataTable from './DataTable';
import SearchContent from './SearchContent';
import TipModal from '../../Common/TipModal';
const { TabPane } = Tabs;

class CustomerDistribute extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      customerTotal: 100, //客户总数
      distributeNum: 0, //已分配数
      // evnum:0,
      // evnumSecond:0,
      tabKey: '1', // 分配类型
      disabled: true,
    };
  }

  componentDidMount() {

  }

  //平均分配
  handleDistribute = () => {
    const { dataSource, disabled } = this.state;
    if (!disabled) {
      dataSource.forEach((item) => {
        item.customerNum = 0;
      });
      this.setState({
        distributeNum: 0,
        dataSource,
      }, this.changeData);
    }
  }

  changeData = (type) => {
    const { customerTotal, distributeNum, dataSource } = this.state;
    const newData = [];
    const notContribute = customerTotal - distributeNum;
    const count = dataSource.length;
    let evnum = 0, remainder = 0;
    if (notContribute % count === 0) { //如果能整除
      evnum = notContribute / count;
      dataSource.forEach((item) => {
        item.customerNum = Number(item.customerNum) + evnum;
        newData.push(item);
      });
    } else {
      evnum = Math.floor(notContribute / count);
      remainder = notContribute % count;
      dataSource.forEach((item, index) => {
        if (index + 1 <= remainder) {
          item.customerNum = Number(item.customerNum) + evnum + 1;
        } else {
          item.customerNum = Number(item.customerNum) + evnum;
        }

        newData.push(item);
      });
    }

    if (type) {
      this.setState({
        distributeNum: customerTotal,
        dataSource: newData,
      }, this.Send);
    } else {
      this.setState({
        distributeNum: customerTotal,
        dataSource: newData,
      });
    }
  }

  //下发
  onInspect = () => {
    const { dataSource, customerTotal, tabKey } = this.state;
    let sum = 0;
    dataSource.forEach((item) => {
      sum += parseInt(item.customerNum);
    });
    if (sum > customerTotal) {
      this.setState({
        visible: true,
        content: '分配客户数之和不能大于总数，请检查重新输入！',
      });
      return;
    } else if (dataSource.length === 0) {
      this.setState({
        visible: true,
        content: tabKey === '1' ? '您还未选择员工，请检查重新输入！' : '您还未选择部门，请检查重新输入',
      });
      return;
    } else if (dataSource.length > customerTotal) {
      this.setState({
        visible: true,
        content: tabKey === '1' ? '选中员工数不能大于客户总数，请检查重新输入！' : '选中部门数不能大于客户总数，请检查重新输入！',
      });
      return;
    } else if (sum < customerTotal) {
      Modal.confirm({
        title: `你还有${customerTotal - sum}个客户未分配，请确认是否下发？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => this.Send(),
        onCancel() { },
      });
      return false;
    } else {
      this.Send();
    }
  }

  Send = () => {
    const { tabKey, dataSource } = this.state;
    const { data: { uuid }, selectAll, selectedRowKeys, type } = this.props;
    const objNo = [];
    const asgnNum = [];
    dataSource.map(item => {
      if (tabKey === '1') {
        objNo.push(item.yhid);
        asgnNum.push(item.customerNum);
      } else {
        objNo.push(item.bmdm);
        asgnNum.push(item.customerNum);
      }
    });
    const sendParams = {
      uuid: selectedRowKeys.join(','), // 所选客户对应的uid
      asgnTp: type, // 1.分配；2.转办；3.撤回
      asgnMode: tabKey === '1' ? '2' : '1', // 1.按员工；2.按部门；
      wthrAll: selectAll ? 1 : 0, // 0.非全选；1.全选
      qrySqlId: uuid,
      objNo: objNo.join(','), // 执行人；执行部门
      asgnNum: asgnNum.join(','), // 客户数
      asgnParm: '1',
    };
    OperateAssignIntrptCust(sendParams).then((result) => {
      // QueryOpenAccountMsg();
      const { code = 0, cnote = '下发成功！' } = result;
      if (code > 0) {
        Modal.success({
          content: cnote,
          onOk: () => {this.closeModal(); this.props.refresh(1, 10); },
        });
      }
    }).catch((error) => {
      this.setState({
        visible: true,
        content: !error.success ? error.message : error.note,
      });
    });
    
  }

  handleDelete = (record) => {
    const dataSource = [...this.state.dataSource];
    const newData = dataSource.filter(item => item.key !== record.key);
    this.setState({ dataSource: newData, disabled: newData.length === 0, distributeNum: Number(this.state.distributeNum) - Number(record.customerNum) });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const { customerTotal } = this.state;
    let distributeNum = 0;
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    newData.forEach((item) => {

      distributeNum += parseInt(item.customerNum);

    });
    const index1 = newData.findIndex(item => row.key === item.key);
    const item1 = newData[index1];
    if (distributeNum > customerTotal) {
      message.warn('已超过能分配的客户数！');
      distributeNum -= parseInt(item1.customerNum);
      newData[index1].customerNum = 0;
    }

    this.setState({
      dataSource: newData,
      distributeNum,
    });
  };

  handleDisChange = (key) => {
    this.setState({ tabKey: key, dataSource: [], disabled: true, distributeNum: 0 });
  }

  fetchData = (item) => {
    const { tabKey, dataSource } = this.state;
    if (tabKey === '1') {
      const data = {
        key: (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        yhid: item.yhid,
        account: item.yhbh,
        name: item.yhxm,
        customerNum: 0,
      };
      dataSource.push(data);
    } else {
      const data = {
        key: (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
        bmdm: item.yybid,
        bmmc: item.yybmc,
        customerNum: 0,
      };
      dataSource.push(data);
    }
    this.setState({ dataSource, disabled: false });
  }

  onOperation = (type) => {
    const { data: { uuid }, selectedCount, selectAll, selectedRowKeys } = this.props;
    if (selectedCount === 0) {
      Modal.info({ content: '请至少选择一个客户!' });
      return false;
    } else {
      const Params = {
        uuid: selectedRowKeys.join(','), // 所选客户对应的uid
        asgnTp: type, // 1.分配；2.转办；3.撤回
        asgnMode: '', // 1.按员工；2.按部门；
        wthrAll: selectAll ? 1 : 0, // 0.非全选；1.全选
        qrySqlId: uuid,
        objNo: '', // 执行人；执行部门
        asgnNum: '', // 客户数
      };
      OperateAssignIntrptCust({ ...Params, asgnParm: '0' }).then((result) => {
        const { code = 0 } = result;
        if (code > 0) {
          this.setState({ customerTotal: selectedCount, modalVisible: true });
        }
      }).catch((error) => {
        this.setState({
          visible: true,
          content: !error.success ? error.message : error.note,
        });
      });
    }
  }

  handleCancel = () => {
    // 取消按钮的操作
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      content: '',
    });
  }

  closeModal = () => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: !modalVisible,
    }, this.handleDisChange('1'));
  }

  render() {
    const { dataSource, customerTotal = 0, distributeNum = 0, tabKey, visible, content, modalVisible, disabled } = this.state;
    const { type } = this.props;
    const modalProps = {
      width: '1200px',
      title: '分配客户',
      destroyOnClose: true,
      // isAllWindow: 1, // isAllWindow 是否支持最大化 1:支持|0:不支持
      style: { top: '115px', paddingBottom: '115px', borderRadius: '2px' },
      visible: modalVisible,
      onCancel: this.closeModal,
      footer: null,
    };
    return (
      <React.Fragment>
        <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c ml14 fs14' style={{ border: 'none' }} onClick={() => this.onOperation(type)}>{type === 1 ? '分配' : '转办'}</Button>
        <TipModal visible={visible} content={content} onCancel={this.handleCancel} />
        <BasicModal
          {...modalProps}
        >
          <Row>
            <Tabs defaultActiveKey={tabKey} onChange={(key) => this.handleDisChange(key)} className='m-bss-modal-tabs'>
              <TabPane tab="按员工分配" key='1'>
                {tabKey === '1' && (
                  <div className='pl24 pr24'>
                    <SearchContent dataSource={dataSource} handleSubmit={this.fetchData} tabKey={tabKey} zdlx={this.props.zdlx}/>
                    <DataTable disabled={disabled} dataSource={dataSource} distributeType={tabKey} handleDelete={this.handleDelete} handleSave={this.handleSave} />
                  </div>
                )}
              </TabPane>
              <TabPane tab="按部门分配" key='2'>
                {tabKey === '2' && (
                  <div className='pl24 pr24'>
                    <SearchContent dataSource={dataSource} handleSubmit={this.fetchData} tabKey={tabKey} zdlx={this.props.zdlx}/>
                    <DataTable disabled={disabled} dataSource={dataSource} distributeType={tabKey} handleDelete={this.handleDelete} handleSave={this.handleSave} />
                  </div>
                )}
              </TabPane>
            </Tabs>
            <Row className="dis-fx pt16 pb16 pl24 pr24">
              <Row className="width50 pt9">
                <Col span={8} style={{ fontSize: '16px', lineHight: '20px' }}>
                  <span className='m-darkgray pr6'>客户总数</span><span className='m-black fwb500'>{customerTotal}</span>
                </Col>
                <Col span={8} style={{ fontSize: '16px', lineHight: '20px' }}>
                  <span className='m-darkgray pr6'>已分配</span><span className='m-black fwb500'>{distributeNum}</span>
                </Col>
                <Col span={8} style={{ fontSize: '16px', lineHight: '20px' }}>
                  <span className='m-darkgray pr6'>未分配</span><span className='fwb500' style={{ color: '#FF6421' }}>{customerTotal - distributeNum}</span>
                </Col>
              </Row>
              <Row className="tr width50">
                {/* 操作按钮 */}
                <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c mr20 fs14' style={{ border: 'none' }} onClick={() => this.handleDistribute()}>平均分配</Button>
                <Button className='fcbtn m-btn-border m-btn-border-blue ant-btn btn-1c fs14' style={{ color: '#fff', background: '#244FFF' }} onClick={() => this.onInspect()}>下发</Button>
              </Row>
                
            </Row>
          </Row>
        </BasicModal>
        
      </React.Fragment>
    );
  }
}

export default Form.create()(CustomerDistribute);