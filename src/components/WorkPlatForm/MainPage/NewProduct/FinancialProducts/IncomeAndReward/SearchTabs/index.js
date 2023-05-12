import React, { Component } from 'react';
import { Button, Col, Row, Tabs } from 'antd';
import styles from '../index.less';
import allIcon from '../../../../../../../assets/all.png';
import detailIcon from '../../../../../../../assets/detail.png';
import personIcon from '../../../../../../../assets/person.png';
import productIcon from '../../../../../../../assets/product.png';
import allWhiteIcon from '../../../../../../../assets/all-white.png';
import tipWhiteIcon from '../../../../../../../assets/tipWhiteIcon.png';
import tipIcon from '../../../../../../../assets/tipIcon.png';
import detailWhiteIcon from '../../../../../../../assets/detail-white.png';
import personWhiteIcon from '../../../../../../../assets/person-white.png';
import productWhiteIcon from '../../../../../../../assets/product-white.png';
import TableCollectContent from '../TableCollectContent';
import TableDetailContent from '../TableDetailContent';
import TableStaffContent from '../TableStaffContent';
import TableProductContent from '../TableProductContent';
import TableTenureContent from '../TableTenureContent';
import Export from '../Export';
import TenureExport from '../TenureExport';

const { TabPane } = Tabs;
class SearchTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exportMaxcount: 1000000, // 最大导出数量
    };
  }

  componentDidMount() {
    const { sysParam = [] } = this.props;
    console.log(sysParam,'sysParam');
    const exportMaxcount = Number(sysParam.find(item => item.csmc === 'system.export.maxcount')?.csz) || 1000000;
    this.setState({ exportMaxcount });
  }

  handleChange = (e) => {
    const { handleSelectKey } = this.props;
    if (handleSelectKey) {
      handleSelectKey(e);
    }
    // this.setState({ selectKey: e });
  }

  render () {
    // const { selectKey } = this.props;
    const { exportMaxcount = 1000000 } = this.state;
    const { getTotalCount, handleSelectKey, fetchData, setData, incomeAndRewardListModel, selectKey, authorities: { incomeReward = [] }, dataSource, summary, count, loading, handleTableChange, cycleValue ,ownershipDetailModel ,cpdl , cpxl , cpdlDate , cpxlDate } = this.props;
    return (
      <Row style={{ padding: '0' }}>
        {/* 保有明细单独导出 */}
        <Tabs className={`${styles.tabs}`} type="card" activeKey={selectKey} onChange={(e) => this.handleChange(e)} tabBarExtraContent={ selectKey === '5' ? <TenureExport ownershipDetailModel={ownershipDetailModel} cpdl={cpdl} cpxl={cpxl} total={count}/> : <Export exportMaxcount={exportMaxcount} setData={setData} getTotalCount={getTotalCount} cycleValue={cycleValue} incomeAndRewardListModel={incomeAndRewardListModel} incomeReward={incomeReward} />}>
          <TabPane
            tab={
              <div className={selectKey === '1' ? `${styles.allActive} ${styles.inActive}` : `${styles.inActive}`}>
                {
                  selectKey === '1' ? (<img alt="" className={`${styles.tabIcon}`} src={allWhiteIcon} />) : (<img alt="" className={`${styles.tabIcon}`} src={allIcon} />)
                }
                <span className={selectKey === '1' ? `${styles.selectTitle}` : `${styles.unSelectTitle}`}>汇总</span>
              </div>
            }
            key="1"
          >
            {
              selectKey === '1' ? (<div className={`${styles.triangle1}`}></div>) : ''
            }
            <TableCollectContent handleSelectKey={handleSelectKey} handleTableChange={handleTableChange} dataSource={dataSource} summary={summary} count={count} loading={loading} ></TableCollectContent>
          </TabPane>
          <TabPane
            tab={
              <div className={selectKey === '2' ? `${styles.detailActive} ${styles.inActive}` : `${styles.inActive}`}>
                {
                  selectKey === '2' ? (<img alt="" className={`${styles.tabIcon}`} src={detailWhiteIcon} />) : (<img alt="" className={`${styles.tabIcon}`} src={detailIcon} />)
                }
                <span className={selectKey === '2' ? `${styles.selectTitle}` : `${styles.unSelectTitle}`}>销售明细</span>
              </div>
            }
            key="2"
          >
            {
              selectKey === '2' ? (<div className={`${styles.triangle2}`}></div>) : ''
            }
            <TableDetailContent fetchData={fetchData} setData={setData} incomeAndRewardListModel={incomeAndRewardListModel} handleTableChange={handleTableChange} dataSource={dataSource} summary={summary} count={count} loading={loading} ></TableDetailContent>
          </TabPane>
          <TabPane
            tab={
              <div className={selectKey === '5' ? `${styles.tipActive} ${styles.inActive}` : `${styles.inActive}`}>
                {
                  selectKey === '5' ? (<img alt="" className={`${styles.tabIcon}`} src={tipWhiteIcon} />) : (<img alt="" className={`${styles.tabIcon}`} src={tipIcon} />)
                }
                <span className={selectKey === '5' ? `${styles.selectTitle}` : `${styles.unSelectTitle}`}>保有明细</span>
              </div>
            }
            key="5"
          >
            {
              selectKey === '5' ? (<div className={`${styles.triangle5}`}></div>) : ''
            }
            <TableTenureContent fetchData={fetchData} selectKey={selectKey} setData={setData} payload={ownershipDetailModel} cpxlDate={cpxlDate} cpdlDate={cpdlDate} handleTableChange={handleTableChange} dataSource={dataSource} count={count} loading={loading}></TableTenureContent>
          </TabPane>
          <TabPane
            tab={
              <div className={selectKey === '3' ? `${styles.personActive} ${styles.inActive}` : `${styles.inActive}`}>
                {
                  selectKey === '3' ? (<img alt="" className={`${styles.tabIcon}`} src={personWhiteIcon} />) : (<img alt="" className={`${styles.tabIcon}`} src={personIcon} />)
                }
                <span className={selectKey === '3' ? `${styles.selectTitle}` : `${styles.unSelectTitle}`}>按人员</span>
              </div>
            }
            key="3"
          >
            {
              selectKey === '3' ? (<div className={`${styles.triangle3}`}></div>) : ''
            }
            <TableStaffContent handleTableChange={handleTableChange} dataSource={dataSource} summary={summary} count={count} loading={loading}></TableStaffContent>
          </TabPane>
          <TabPane
            tab={
              <div className={selectKey === '4' ? `${styles.productActive} ${styles.inActive}` : `${styles.inActive}`}>
                {
                  selectKey === '4' ? (<img alt="" className={`${styles.tabIcon}`} src={productWhiteIcon} />) : (<img alt="" className={`${styles.tabIcon}`} src={productIcon} />)
                }
                <span className={selectKey === '4' ? `${styles.selectTitle}` : `${styles.unSelectTitle}`}>按产品</span>
              </div>
            }
            key="4"
          >
            {
              selectKey === '4' ? (<div className={`${styles.triangle4}`}></div>) : ''
            }
            <TableProductContent fetchData={fetchData} setData={setData} incomeAndRewardListModel={incomeAndRewardListModel} handleTableChange={handleTableChange} dataSource={dataSource} summary={summary} count={count} loading={loading}></TableProductContent>
          </TabPane>
        </Tabs>
      </Row>
    );
  }
}
export default SearchTabs;
