import React, { FC, useEffect } from 'react';
import { Row, Col } from 'antd';
import BasicInfo from '$components/WorkPlatForm/CustomerPanorama/CustomerInfo/BasicInfo';
import Tag from '$components/WorkPlatForm/CustomerPanorama/CustomerInfo/Tag';
import AccountSituation from '$components/WorkPlatForm/CustomerPanorama/CustomerInfo/AccountSituation';
import ServiceDynamic from '$components/WorkPlatForm/CustomerPanorama/CustomerInfo/ServiceDynamic';
import InfoCard from '$components/WorkPlatForm/CustomerPanorama/CustomerInfo/InfoCard';
import sensors from 'sa-sdk-javascript';

type Props = Readonly<{
  location: any,
}>

type BasicInfo = React.Component

const CustomerInfo: FC<Props> = (props) => {

  useEffect(() => {
    // 浏览事件埋点
    sensors.track('page_view', {
      first_module: '员工端PC',
      second_module: '客户360',
      third_module: '客户概况',
      ax_page_name: '',
      ax_page_url: location.href,
      staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
      source_from: '',
      card_id: '',
      card_name: '',
    });
  }, [])

  // 点击事件埋点
  const clickSensors = (ax_button_name: string) => {
    sensors.track('page_click', {
      first_module: '员工端PC',
      second_module: '首页',
      third_module: '客户360',
      ax_page_name: '首页',
      ax_page_url: location.href,
      staff_code: `${JSON.parse(sessionStorage.user).id}`, // 员工号
      ax_button_name,
      card_id: '',
      card_name: '',
    });
  }

  const { location: { query: { customerCode = '' } } } = props;

  return (
    <div style={{ color: '#1A2243' }}>
      <Row type='flex'>
        <Col style={{ width: 'calc(100% - 325px - 12px)' }}>
          <BasicInfo customerCode={customerCode} clickSensors={clickSensors} />
        </Col>
        <Col style={{ width: 325, margin: '0 0 0 12px' }}>
          <Tag customerCode={customerCode} clickSensors={clickSensors} />
        </Col>
      </Row>
      <Row type='flex' style={{ marginTop: 12 }}>
        <Col style={{ width: 'calc(100% - 325px - 12px)' }}>
          <AccountSituation customerCode={customerCode} clickSensors={clickSensors} />
          <div style={{ height: 12 }}></div>
          <ServiceDynamic customerCode={customerCode} clickSensors={clickSensors} />
        </Col>
        <Col style={{ width: 325, margin: '0 0 0 12px' }}>
          <InfoCard customerCode={customerCode} clickSensors={clickSensors} />
        </Col>
      </Row>
    </div>
  );
};
export default CustomerInfo;
