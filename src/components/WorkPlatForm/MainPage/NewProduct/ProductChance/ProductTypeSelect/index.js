import React,{ useState } from 'react';
import { Tabs } from 'antd';
import { connect } from "dva";
import SelectAll from '../SelectAll';
import AlphaTIndex from '../AlphaT';
import AclTool from "../AclTool";
import { newViewSensors } from "../util";

const { TabPane } = Tabs;
const ProductTypeSelect = React.memo((props)=>{
  const { tab,onChangeTab } = props;
  const [tabKey,usetabKey] = useState(tab);
  const { authorities = {} } = props;
  const { productChance = [] } = authorities;
  const onChange = (key) => {
    usetabKey(key);
    onChangeTab(key);
    if(key === '3'){
      newViewSensors({
        ax_page_name: "策略工具信号池",
      }); 
    }
  };
  return (
    <Tabs activeKey={tabKey} onChange={onChange} className="addList">
      <TabPane tab="增值产品" key="0">
        <SelectAll />
      </TabPane>
      <TabPane tab="AlphaT" key="2">
        <AlphaTIndex />
      </TabPane>
      {productChance.includes("aclToolAuth") && (
        <TabPane tab="策略工具信号池" key="3">
          <AclTool />
        </TabPane>
      )}

      {/* <TabPane tab="理财产品" key="1">
        <div>本功能暂未开放</div>
      </TabPane> */}
    </Tabs>
  );

});

export default connect(({ global }) => ({
  authorities: global.authorities,
}))(ProductTypeSelect);
