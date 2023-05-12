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
  const [normalData, setNormalData] = useState<lineItemObject>({ name: '普通账户交易量', color: '#1389F4', rgbaColor: 'rgba(19, 137, 244, 0.2) ', data: [] });
  const [financialData, setFinancialData] = useState<lineItemObject>({ name: '理财账户交易量', color: '#00B7FF', rgbaColor: 'rgba(0, 183, 255, 0.2)', data: [] });
  const [creditData, setCreditData] = useState<lineItemObject>({ name: '信用账户交易量', color: '#F6C34E', rgbaColor: 'rgba(246, 195, 78, 0.2)', data: [] });
  const [optionData, setOptionData] = useState<lineItemObject>({ name: '个股期权账户交易量', color: '#FF7957', rgbaColor: 'rgba(255, 121, 87, 0.2)', data: [] });

  useEffect(() => {
    fetchEchartsData(5);
  }, [])

  useEffect(() => {
    setSeriesLineData([normalData, creditData, financialData, optionData]);
  }, [JSON.stringify(normalData), JSON.stringify(financialData), JSON.stringify(creditData), JSON.stringify(optionData)])

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
      if(type === 5) {
        let xData: string[] = [];
        let noData: number[] = []
        let finData: number[] = []
        let creData: number[] = []
        let optData: number[] = []
        records.forEach((item: any) => {
          xData.push(item.month2);
          noData.push(item.normalTransaction);
          creData.push(item.creditTransaction);
          finData.push(item.financialTransaction);
          optData.push(item.optionTransaction);
        });
        unstable_batchedUpdates(() => {
          setXLineData(xData);
          setNormalData({ ...normalData, data: noData });
          setCreditData({ ...creditData, data: creData });
          setFinancialData({ ...financialData, data: finData });
          setOptionData({ ...optionData, data: optData });
        })
      }
    }).catch((error: any) => {
      message.error(!error.success ? error.message : error.note);
    });

    // 饼图
    FetchQueryCustomerDistribution({
      queryHierarchy: 1, // 查询层级，默认为1
      queryValue: props.ryid, // 人员id
      queryType: 8, // 查询类型，8|交易量  10|按盈亏度分布-盈亏
    }).then((response: any) => {
      const { records = [] } = response || {};
      let dataList: pieItemObject[] = [];
      const colorObj: any = { '无交易': '#0F8AFF', '0-1万': '#00B7FF', '1-10万': '#F6C34F', '10-50万': '#FFA257', '50-100万': '#FF7957', '100-1000万': '#E9D54C', '1000万以上': '#71CF8E' };
      records.forEach((item: any) => {
        dataList.push({ name: item.tradingVolume, data: item.numberOfCustomers, color: colorObj[item.tradingVolume] });
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
          <Subtitle text='交易量分布' />
          <Charts pageUrl={`tradingVolume${props.tabKey}`} chartType={'pie'} pieData={{ data: pieData, label: '按资产规模' }} />
        </Col>
        <Col span={14}>
          <Subtitle text='月度交易趋势变化' />
          <Charts pageUrl={`tradingVolume${props.tabKey}`} chartType={'line'} lineData={{ xData: xLineData, seriesData: seriesLineData, yName: '交易量 (万元)' }} />
        </Col>
      </Row>
    </>
  );
}

export default Chart;