import { FC, useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import Charts from '../../Common/Charts';
import { Subtitle } from '../../Common/UniversalTool';
import { lineItemObject } from '../../Common/Charts/provideType';

type Props = Readonly<{
  tabKey: string, // 页面选中的tabKey
  xBarData: string[],
  seriesBarData: number[],
  xLineData: string[],
  seriesLineData: lineItemObject[],
}>

const Chart: FC<Props> = (props) => {
  return (
    <>
      <Row className='cusAnalysisEchartBox' style={{ padding: '0 24px 24px' }}>
        <Col span={12}>
          <Subtitle text='月末账户资产分布趋势' />
          <Charts pageUrl={`customerAssets${props.tabKey}`} chartType={'bar'} barData={{ xData: props.xBarData, seriesData: props.seriesBarData }} />
        </Col>
        <Col span={12}>
          <Subtitle text='流入流出客户' />
          <Charts pageUrl={`customerAssets${props.tabKey}`} chartType={'line'} lineData={{ xData: props.xLineData, seriesData: props.seriesLineData }} />
        </Col>
      </Row>
    </>
  );
}

export default Chart;