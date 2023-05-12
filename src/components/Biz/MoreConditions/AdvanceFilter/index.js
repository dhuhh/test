import React from 'react';
import { Card, Tabs, Anchor } from 'antd';
import SelectedIndicator from './SelectedIndicator';
import style from './index.less';

const { Link } = Anchor;
const { TabPane } = Tabs;
// 高级筛选弹出框 首页
class Content extends React.Component {
  getContainer = () => {
    const Content = document.getElementById('anchor-Container-cus');
    return Content;
  }
  handleClick = (e, link) => {
    e.preventDefault();
  };
  render() {
    const { GroupArr, noGroupArr, onChangeGroup, labelArr, nolabelArr, onChangeLabel, faid, queryParameter, onIndicatorsClick, onPlanClick, userBusinessRole, dispatch, form, dictionary, handleTabsChange, currentKey, onMenuClick, handleClick, currentStep, onDelet, steps, objectDictionary, mySearchSchemeService, searchSchemeDetailService, seniorMenuService, onSaveScheme } = this.props;
    return (
      <Card className="m-card myCard default ant-card-padding-transition" bordered={false}>
        <Anchor onClick={this.handleClick} getContainer={this.getContainer} affix={false}>
          <Tabs className={`${style.m_tabs_link} m-tabs-underline m-tabs-underline-small`} onChange={handleTabsChange} activeKey={currentKey} defaultActiveKey="1">
            <TabPane tab={<Link href="#components-anchor-bq" title="标签体系"/>} key="4" />
            <TabPane tab={<Link href="#components-anchor-kq" title="客群体系"/>} key="5" />
            <TabPane tab={<Link href="#components-anchor-zb" title="待选指标"/>} key="0" />
            <TabPane tab={<Link href="#components-anchor-zb" title="我保存的"/>} key="2" />
            <TabPane tab={<Link href="#components-anchor-zb" title="最近使用"/>} key="3" />
            <TabPane tab={<Link href="#components-anchor-zb" title="系统推荐"/>} key="1" />
          </Tabs>
        </Anchor>
        <div>
          <SelectedIndicator
            GroupArr={GroupArr}
            noGroupArr={noGroupArr}
            onChangeGroup={onChangeGroup}
            labelArr={labelArr}
            nolabelArr={nolabelArr}
            onChangeLabel={onChangeLabel}
            faid={faid}
            onIndicatorsClick={onIndicatorsClick}
            queryParameter={queryParameter}
            userBusinessRole={userBusinessRole}
            objectDictionary={objectDictionary}
            onPlanClick={onPlanClick}
            currentKey={currentKey}
            onMenuClick={onMenuClick}
            handleClick={handleClick}
            currentStep={currentStep}
            onDelet={onDelet}
            steps={steps}
            dictionary={dictionary}
            authorities={this.props.authorities}
            userBasicInfo={this.props.userBasicInfo}
            form={form}
            dispatch={dispatch}
            mySearchSchemeService={mySearchSchemeService}
            searchSchemeDetailService={searchSchemeDetailService}
            seniorMenuService={seniorMenuService}
            onSaveScheme={onSaveScheme}
            canOperateGroup={Number.parseInt(currentKey, 10) !== 5}
          />
        </div>
      </Card>
    );
  }
}

export default Content;
