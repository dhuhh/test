import React, { Component } from 'react';
import { Card, Row, Col, message } from 'antd';
import SceneSchemeLists from '../../../../../../components/WorkPlatForm/MainPage/Customer/HighNetWorthCus/ConfigCenter';
import SchemeDetail from '../../../../../../components/WorkPlatForm/MainPage/Customer/HighNetWorthCus/ConfigCenter/SchemeDetail';
import { FetchsearchConfigurationPlan, FetchproConfigurationPlanSearch } from '../../../../../../services/customerbase';

/**
 * 交互逻辑：左侧方案列表为空时点击保存按钮添加标题实为新增操作，点击新增icon先添加方案标题，保存后刷新方案列表
 * 点击方案列表的某个方案在右侧展示该方案的详情，编辑后点击保存修改方案，新增，编辑，删除为一个接口
 */
export default class configCenter extends Component {
  state={
    loading: false,
    operTp: 2,
    currentScheme: {}, // 当前方案
    sceneSchemeLists: [], // 左侧方案列表
  }

  componentDidMount() {
    this.getSchemeLists();
  }

  updateScheme = (type, data = {}) => { // type  1|新增 2|编辑 仅改变操作类型不调接口
    this.setState({
      operTp: type,
      currentScheme: data,
    });
  }

  selectedScheme = (type, data) => { // type  1|新增 2|编辑(新增、编辑 子组件调用传'',operTp由本组件控制) 3|删除
    if (type) {
      this.setState({ operTp: type, currentScheme: data });
      this.operateSch(type, data);
    }
  }

  // 获取方案列表
  getSchemeLists = () => {
    this.setState({ loading: true });
    FetchsearchConfigurationPlan().then((res) => {
      const { records = [] } = res || {};
      this.setState({ sceneSchemeLists: records, loading: false, currentScheme: records[0] });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({ loading: false });
    });
  }

  // 方案操作
  operateSch = (type, data = {}) => { // type  1|新增 2|编辑 3|删除
    this.setState({ loading: true });
    FetchproConfigurationPlanSearch({
      operTp: type,
      ...data,
    }).then(() => {
      message.success('成功')
      this.getSchemeLists();
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({ loading: false });
    });
  }

  render() {
    const { operTp = '2', currentScheme = {}, loading = false, sceneSchemeLists = [] } = this.state;
    return (
      <React.Fragment>
        <Card title="统一方案配置" style={{ marginTop: '2rem' }} className="m-card m-card-right m-card-pay">
          <Row>
            <Col span={4}>
              {/* 场景方案列表 */}
              <SceneSchemeLists currentScheme={currentScheme} selectedScheme={this.selectedScheme} selectedKeys={currentScheme.id} loading={loading} sceneSchemeLists={sceneSchemeLists} updateScheme={this.updateScheme} />
            </Col>
            <Col span={20}>
              {/* 场景方案详情及操作 */}
              <SchemeDetail currentScheme={currentScheme} operateType={operTp} selectedScheme={this.selectedScheme} loading={loading} sceneSchemeLists={sceneSchemeLists}/>
            </Col>
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}
