import React from 'react';
import { Row, Col, Form, message, Modal } from 'antd';
import MSelect from '../../../Common/Form/Select';
import ScatterGraph from './ScatterGraph';
// import DataList from './DataList';
import { FetchSysCommonTable } from '../../../../services/sysCommon';
import qsy from '../../../../assets/qsy.jpg';

/**
 * Component: ScatterCircle
 * Description: 散点圈人（弹框内容）
 * Author: WANGQI
 * Date: 2019/4/30
 * Remarks: 注释的代码不要删
 */
class ScatterCircle extends React.Component {
  state = {
    xyTargetData: [],
    legendData: [],
    legendName: '',
    xData: '',
    yData: '',
    error: false, // 是否xy坐标一直 t 是 f否
  }

  componentDidMount() {
    this.fetchDropSelData();
  }

  fetchDropSelData = () => {
    FetchSysCommonTable({
      objectName: 'TC_SDQR_ZB',
      queryOption: {
        batchNo: 1,
        batchSize: 999,
      },
    }).then((response) => {
      const { records = [] } = response;
      if (Array.isArray(records)) {
        this.setState({
          xyTargetData: records.filter(value => value.ZSLX === '1'),
          legendData: records.filter(value => value.ZSLX === '2'),
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  onTargetChange = (e) => {
    const { error = false } = this.state;
    if (error) {
      Modal.info({ title: 'X轴指标和Y轴指标不能相同!', content: '请重新选择指标' });
    }
    this.setState({
      legendName: e,
    });
  }

  onXChange = (e) => {
    const { yData } = this.state;
    let error = false;
    if (yData && yData === e) {
      error = true;
      Modal.info({ title: 'X轴指标和Y轴指标不能相同!', content: '请重新选择指标' });
    }
    this.setState({
      xData: e,
      error,
    });
  }

  onYChange = (e) => {
    const { xData } = this.state;
    let error = false;
    if (xData && xData === e) {
      error = true;
      Modal.info({ title: 'X轴指标和Y轴指标不能相同!', content: '请重新选择指标' });
    }
    this.setState({
      yData: e,
      error,
    });
  }

  render() {
    // params: 查询列表的参数
    const { params = {}, userBasicInfo, customerQueryType, parsedQueryParameter, refreshPlanCard } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    const { xyTargetData, legendData, xData = '', yData = '', legendName = '', error = false } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Row className="m-row" style={{ padding: '1.5rem 2rem' }}>
        <Col span={24} style={{ zIndex: 1 }}>
          {/* 指标选择 */}
          <Form className="m-form" style={{ margin: 0 }}>
            <Row>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="X轴指标">
                  {getFieldDecorator('x')(<MSelect
                    style={{ minWidth: '18rem' }}
                    datas={xyTargetData}
                    titleKey="INDEX_NAME"
                    rowKey="ES_CODE"
                    dropdownMatchSelectWidth
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={this.onXChange}
                  />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="Y轴指标">
                  {getFieldDecorator('y')(<MSelect
                    style={{ minWidth: '18rem' }}
                    datas={xyTargetData}
                    titleKey="INDEX_NAME"
                    rowKey="ES_CODE"
                    dropdownMatchSelectWidth
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={this.onYChange}
                  />)}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...formItemLayout} label="维度">
                  {/* eslint-disable-next-line no-undef */}
                  {getFieldDecorator('target')(<MSelect
                    style={{ minWidth: '18rem' }}
                    datas={legendData}
                    titleKey="INDEX_NAME"
                    rowKey="ES_CODE"
                    dropdownMatchSelectWidth
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={this.onTargetChange}
                  />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {
            (xData === '' || yData === '' || legendName === '')
              ? (
                <div style={{
                  height: '40rem',
                  background: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                >
                  <div>
                    <img src={qsy} alt="" style={{ height: '360' }} />
                    <div style={{ textAlign: 'center', color: '#b0b0b0' }}>请先选择条件哟~</div>
                  </div>
                </div>
              ) : (
                <div className="tc">
                  <ScatterGraph
                    error={error}
                    params={params}
                    xData={xData}
                    yData={yData}
                    legendName={legendName}
                    userBasicInfo={userBasicInfo}
                    customerQueryType={customerQueryType}
                    parsedQueryParameter={parsedQueryParameter}
                    refreshPlanCard={refreshPlanCard}
                  />
                </div>
              )
          }
        </Col>
      </Row>
    );
  }
}

export default Form.create()(ScatterCircle);
