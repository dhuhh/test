import React from 'react';
import { Tabs, message } from 'antd';
import { FetchFuzzyQryCusInfo } from '../../../../../services/incidentialServices';
import DepartmentalPerformance from './DepartmentalPerformance';
import EmployeePerformance from './EmployeePerformance';
import CustomerInterrupt from './CustomerInterrupt';
import styles from './index.less';
const { TabPane } = Tabs;

class PerformanceAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '1',
      qdObj: [], // 渠道
      zdlxObj: [], // 中断类型
    };
  }

  componentDidMount() {
    this.fetchObjectTable();
  }

  // livebos表查询 获取渠道数据
  fetchObjectTable = async () => {
    await FetchFuzzyQryCusInfo({ cxlx: '1' }).then((response) => { // 渠道
      const { records = [] } = response;
      if (Array.isArray(records)) {
        const qdObj = [];
        records.forEach(item => {
          const Item = {
            ibm: item.cusId,
            note: item.name,
            ...item,
          };
          qdObj.push(Item);
        });
        this.setState({ qdObj });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
    await FetchFuzzyQryCusInfo({ cxlx: '2' }).then((response) => { // 中断类型
      const { records = [] } = response;
      if (Array.isArray(records)) {
        const zdlxObj = [];
        records.forEach(item => {
          const Item = {
            ibm: item.cusId,
            note: item.name,
            ...item,
          };
          !['1','2'].includes(item.cusId) && zdlxObj.push(Item);
        });
        this.setState({ zdlxObj });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

    handleOnchange = (key) => {
      this.setState({ tabKey: key });
    }

    render() {
      const { tabkey, qdObj, zdlxObj } = this.state;
      return (
        <React.Fragment>
          <div style={{ backgroundColor: '#ffffff' }}>
            <Tabs defaultActiveKey={tabkey} onChange={(key) => this.handleOnchange(key)} className={`m-bss-tabs ${styles.tab}`} >
              <TabPane tab="部门业绩报表" key='1'>
                <DepartmentalPerformance qdObj={qdObj} zdlxObj={zdlxObj} />
              </TabPane>
              <TabPane tab="员工业绩报表" key='2'>
                <EmployeePerformance qdObj={qdObj} zdlxObj={zdlxObj} />
              </TabPane>
              <TabPane tab="中断客户分析" key='3'>
                <CustomerInterrupt qdObj={qdObj} zdlxObj={zdlxObj} />
              </TabPane>
            </Tabs>
          </div>
        </React.Fragment>
      );
    }
}
export default PerformanceAnalysis;
