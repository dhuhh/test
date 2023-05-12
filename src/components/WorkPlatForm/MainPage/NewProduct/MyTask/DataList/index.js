import { Col, Row, Spin } from 'antd';
import React, { useState } from 'react';
import BacklogList from './BacklogList';
// import Detail from './Detail'
import DataTable from './DataTable';
// import styles from '../index.less';

function DataList(props) {
  // const [height, setHeight] = useState(800); // scrollbar高度

  return (
    <Spin spinning={props.loading}>
      <Row type='flex' justify='space-between' style={{ color: '#1A2243', width: '100%', margin: '0', borderTop: '1px solid #e8e8e8' }}>
        <Col style={{ width: 374, borderRight: '1px solid #e8e8e8' }}>
          <BacklogList
            activeList={props.activeList}
            setActiveList={props.setActiveList}
            listData={props.listData}
            setListData={props.setListData}
            pageSize={props.pageSize}
            setPageSize={props.setPageSize}
            queryBackLogList={props.queryBackLogList}
            current={props.current}
            setCurrent={props.setCurrent}
            total={props.total}
            // height={height}
            // setHeight={setHeight}
          />
        </Col>
        <Col style={{ width: 'calc(100% - 374px)' }}>
          { props.activeList && props.listData.length ? (
            <div style={{ width: '100%' }} key={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskId}>
              {/* 点击左侧列表初始化右侧框内所有组件 */}
              {/* <Detail
                activeList={props.activeList}
                listData={props.listData}
              /> */}
              <DataTable
                activeList={props.activeList}
                setActiveList={props.setActiveList}
                listData={props.listData}
                setListData={props.setListData}
                // height={height}
                // setHeight={setHeight}
                queryBackLogList={props.queryBackLogList}
              />
            </div>
          ) : ''}
        </Col>
      </Row>
    </Spin>
  );
}

export default DataList;
