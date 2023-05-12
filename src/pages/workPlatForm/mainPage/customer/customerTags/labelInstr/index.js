import React, { FC, useEffect, useState } from 'react';
import { Input, Tabs } from 'antd';
import { connect } from 'dva';
//import { flatToTree } from '@/components/WorkPlatForm/MainPage/LabelInstr/EmployeeIndi/utils/formatTree';
//import EmployeeIndi from '@/components/WorkPlatForm/MainPage/LabelInstr/EmployeeIndi';
import styles from './index.less';

/**
 * 标签指标说明
 */

const { TabPane } = Tabs;

const LabelInstr = ({ dictionary, authorities ,searchChange}) => {

  const [indiName, setIndiName] = useState('');//指标名称

  // const data = [
  //   { id: '1', accountType: '', viewCode: 'parent1', viewName: '父节点1', parentId: '', serialNum: '', level: '0' },
  //   { id: '11', accountType: '', viewCode: 'children11', viewName: '子节点1', parentId: '1', serialNum: '', level: '1' },
  //   { id: '12', accountType: '', viewCode: 'children12', viewName: '子节点2', parentId: '1', serialNum: '', level: '1' },
  //   { id: '13', accountType: '', viewCode: 'children13', viewName: '子节点3', parentId: '1', serialNum: '', level: '1' },
  //   { id: '111', accountType: '', viewCode: 'sun13', viewName: '孙节点1', parentId: '11', serialNum: '', level: '2' },
  //   { id: '2', accountType: '', viewCode: 'parent2', viewName: '父节点2', parentId: '', serialNum: '', level: '0' },
  //   { id: '21', accountType: '', viewCode: 'children21', viewName: '子节点4', parentId: '2', serialNum: '', level: '1' },
  //   { id: '22', accountType: '', viewCode: 'children22', viewName: '子节点5', parentId: '2', serialNum: '', level: '1' },
  //   { id: '23', accountType: '', viewCode: 'children23', viewName: '子节点6', parentId: '2', serialNum: '', level: '1' },
  // ];
  // const root = data.filter(item => item.level === '0')
  //   .map(item => item.id);
  // flatToTree(data, root);

  return (
    <div >
      <div className={`m-form ${styles['m-search']}`} style={{ padding: '16px 24px', background: '#fff', marginBottom: '9px' }}>
        <Input.Search
          placeholder='请输入标签名称'
          allowClear={true}
          prefix={<i className='iconfont icon-a-icontongyong_search1' style={{ fontSize: '16px' }}></i>}
          onSearch={(value) => {
            setIndiName(value)
            searchChange(value)
          }}
        />
      </div>
      {/* <div className={` ${styles['tabs-content']} ${styles['ax-tabs']}`}>
        <Tabs defaultActiveKey="2" destroyInactiveTabPane>
          <TabPane tab="员工指标" key="2">
            <EmployeeIndi indiName={indiName} />
          </TabPane>
        </Tabs>
      </div> */}
    </div>
  );
};


export default connect(({ global }) => ({
  authorities: global.authorities,
  dictionary: global.dictionary,
}))(LabelInstr);