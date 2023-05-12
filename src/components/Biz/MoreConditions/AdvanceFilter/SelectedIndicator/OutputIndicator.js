import React from 'react';
import { Table, Row, Col, Icon } from 'antd';
import FormItem from '../Common/Indicator/FormItem';
import jsonData from '../../JSON/indicatorJSON';
import { getDictKey } from '../../../../../utils/dictUtils';

class OutputIndicator extends React.Component {
  render() {
    const { datas, dictionary = {}, form, onDeletOutPut } = this.props;
    const { getFieldDecorator } = form;
    const dataSource = [];
    const columns = [{
      title: '序号',
      dataIndex: 'xh',
      key: 'xh',
      render: text => <span style={{ color: 'red' }} >{text}</span>,
    }, {
      title: '指标',
      dataIndex: 'zb',
      key: 'zb',
    }, {
      title: '附加参数',
      dataIndex: 'fjcs',
      key: 'fjcs',
      width: '400',
    }, {
      title: '单位',
      dataIndex: 'dw',
      key: 'dw',
    }, {
      title: '',
      dataIndex: 'sc',
      key: 'sc',
      render: (text) => {
        return <Icon onClick={() => onDeletOutPut(text)} style={{ cursor: 'pointer', marginLeft: '0.6rem', color: 'red' }} type="close" />;
      },
    }];
    datas.forEach((num, index) => {
      const data = jsonData[num] || {};
      const { name = '', extra = [{
        type: 'Empty',
        zddm: getDictKey('khlx'),
        required: true,
      }], dw = '--' } = data;
      dataSource.push({
        key: num,
        xh: index + 1,
        zb: name,
        fjcs: (
          extra.map((item, subIndex) => {
            const { type, name: extraName, zddm, zdDatas = '', required = false } = item;
            return (
              <Row key={`输出条件_${num}_${subIndex}`}>
                <Col span={8} className="m-parameter-title">{extraName}</Col>
                <Col span={16}><FormItem key={extraName} style={{ width: '100%' }} data={zdDatas === '' ? dictionary[zddm] : zdDatas} required={required} getFieldDecorator={getFieldDecorator} subKey={`输出条件_${num}_${subIndex}`} type={type} /></Col>
              </Row>
            );
          })
        ),
        dw,
        sc: num,
      });
    });
    return (
      <Table pagination={false} className="m-table-customer" columns={columns} dataSource={dataSource} />
    );
  }
}

export default OutputIndicator;
