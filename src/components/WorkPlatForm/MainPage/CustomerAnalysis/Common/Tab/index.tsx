import { FC, ReactElement, ReactNode, useState } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
const { TabPane } = Tabs;

type Props = Readonly<{
  title: string[], // tab标题
  children: ReactElement[],
}>

const Tab: FC<Props> = (props) => {
  const [tabKey, setTabKey] = useState<string>('0');

  const changeTab = (tabKey: string)=>{
    setTabKey(tabKey);
  }

  return (
    <div className={styles.tabsBox}>
      <Tabs className={styles.tabs} onChange={changeTab} activeKey={tabKey}>
        {
          props.children.map((item, index)=>{
            return (
              <TabPane tab={props.title[index]} key={String(index)}>
                {
                  item
                }
              </TabPane>
            );
          })
        }
      </Tabs>
    </div>
  );
}

export default Tab;
