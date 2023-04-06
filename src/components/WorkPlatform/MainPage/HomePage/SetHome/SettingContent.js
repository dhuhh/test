import React from 'react';
import { Tabs } from 'antd';
import PanelSettings from './PanelSettings/index';
import styles from './index.less';

function SettingContent(props) {
  const { fetchConfigure, onCancel } = props;
  return (
    <Tabs
      className={`${styles.selfTab} m-tabs-underline`}
      defaultActiveKey="1"
    >
      <Tabs.TabPane tab="首页面板设置" key="1">
        <PanelSettings {...props} fetchConfigure={fetchConfigure} onCancel={onCancel} />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default SettingContent;
