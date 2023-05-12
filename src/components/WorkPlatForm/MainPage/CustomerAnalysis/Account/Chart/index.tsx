import { FC, useState, useEffect } from 'react';
import { Row, Col, message } from 'antd';
import Charts from '../../Common/Charts';
import { Subtitle } from '../../Common/UniversalTool';
import { lineItemObject, pieItemObject } from '../../Common/Charts/provideType';
import { unstable_batchedUpdates } from 'react-dom';
import { FetchQueryCustomerDistribution, FetchQueryAssetTrend } from '$services/customeranalysis';

type Props = Readonly<{
  ryid: string, // 人员id
  tabKey: string, // 页面选中的tabKey
}>

const Chart: FC<Props> = (props) => {
  const [pieData, setPieData] = useState<pieItemObject[]>([]);
  const [xLineData, setXLineData] = useState<string[]>([]);
  const [seriesLineData, setSeriesLineData] = useState<lineItemObject[]>([]);
  const [normalData, setNormalData] = useState<lineItemObject>({ name: '普通账户盈亏金额', color: '#1389F4', rgbaColor: 'rgba(19, 137, 244, 0.2) ', data: [] });
  const [creditData, setCreditData] = useState<lineItemObject>({ name: '信用账户盈亏金额', color: '#F6C34E', rgbaColor: 'rgba(246, 195, 78, 0.2)', data: [] });

  useEffect(() => {
    fetchEchartsData(4);
  }, [])

  useEffect(() => {
    setSeriesLineData([normalData, creditData]);
  }, [JSON.stringify(normalData), JSON.stringify(creditData)])

  // 查询图表数据
  const fetchEchartsData = (type: number) => {
    // 折线图
    FetchQueryAssetTrend({ 
      accountType: 1,
      queryLevel: 1, // 查询层级，默认为1
      queryValue: props.ryid, // 人员id
      type, // 查询类型，1|月末账户资产分布趋势;2|净流入趋势分析;3|净流出趋势分析;4|账户盈亏趋势5|月度交易量趋势变化6|平均佣金率变化趋势
     }).then((response: any) => {
      const { records = [] } = response || {};
      if(type === 4) {
        let xData: string[] = [];
        let noData: number[] = []
        let creData: number[] = []
        records.forEach((item: any) => {
          xData.push(item.month2);
          noData.push(item.normalAmount);
          creData.push(item.creditAmount);
        });
        unstable_batchedUpdates(() => {
          setXLineData(xData);
          setNormalData({ ...normalData, data: noData });
          setCreditData({ ...creditData, data: creData });
        })
      }
    }).catch((error: any) => {
      message.error(!error.success ? error.message : error.note);
    });

    // 饼图
    FetchQueryCustomerDistribution({
      queryHierarchy: 1, // 查询层级，默认为1
      queryValue: props.ryid, // 人员id
      queryType: 10, // 查询类型，8|交易量  10|按盈亏度分布-盈亏
    }).then((response: any) => {
      const { records = [] } = response || {};
      let dataList: pieItemObject[] = [];
      const colorObj: any = { '亏损20%以上': '#0F8AFF', '亏损20%以内': '#00B7FF', '盈利20%以内': '#F6C34F', '盈利20%以上': '#FF7957' };
      records.forEach((item: any) => {
        dataList.push({ name: item.MS, data: item.numberOfCustomers, color: colorObj[item.MS] });
      });
      setPieData(dataList);
    }).catch((error: any) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  return (
    <>
      <Row className='cusAnalysisEchartBox' style={{ padding: '0 24px 24px' }}>
        <Col span={10}>
          <Subtitle text='盈亏度' />
          <Charts pageUrl={`account${props.tabKey}`} chartType={'pie'} pieData={{ data: pieData, label: '盈亏度' }} />
        </Col>
        <Col span={14}>
          <Subtitle text='账户盈亏趋势' />
          <Charts pageUrl={`account${props.tabKey}`} chartType={'line'} lineData={{ xData: xLineData, seriesData: seriesLineData, yName: '盈亏金额 (万元)' }} />
        </Col>
      </Row>
    </>
  );
}

export default Chart;