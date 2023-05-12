import React from 'react';
import classnames from 'classnames';
import { Card, Row, Col } from 'antd';
import GroupInfo from './groupInfo';
import GroupList from './groupList';
// import styles from './index.less';

class CustomerGroupPage extends React.Component {
  constructor(props) {
    super(props);
    const { myCusGroup = [], departmentCusGroup = [] } = props;
    let selectedKey = '';
    let selectedName = '';
    if (myCusGroup.length > 0 && myCusGroup[0]) {
      selectedKey = myCusGroup[0].khqid;
      selectedName = myCusGroup[0].khqmc;
    } else if (departmentCusGroup.length > 0 && departmentCusGroup[0]) {
      selectedKey = departmentCusGroup[0].khqid;
      selectedName = departmentCusGroup[0].khqmc;
    }
    this.state = {
      myCusGroup,
      departmentCusGroup,
      selectedKey,
      customerGroupType: myCusGroup.length > 0 && myCusGroup[0] ? 'mine' : 'share',
      selectedName,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { selectedKey: selectedKeyInstate, selectedName: selectedNameInstate } = this.state;
    const { myCusGroup = [], departmentCusGroup = [] } = nextProps;
    let selectedKey = selectedKeyInstate;
    let selectedName = selectedNameInstate;
    if (selectedKey === '' && myCusGroup.length > 0 && myCusGroup[0]) {
      selectedKey = myCusGroup[0].khqid;
      selectedName = myCusGroup[0].khqmc;
    } else if (selectedKey === '' && departmentCusGroup.length > 0 && departmentCusGroup[0]) {
      selectedKey = departmentCusGroup[0].khqid;
      selectedName = departmentCusGroup[0].khqmc;
    }
    this.setState({ myCusGroup, departmentCusGroup, selectedKey, selectedName });
  }
  // 左侧菜单选中项改编后,修改state
  handleSelectedKeyChange = (selectedKey, customerGroupType, customerGroupName) => {
    this.setState({ selectedKey, customerGroupType, selectedName: customerGroupName });
  }
  render() {
    const { className, myCusGroup, departmentCusGroup, selectedKey, customerGroupType, selectedName } = this.state;
    const { refreshCusGroupData, authorities, dictionary, userBasicInfo, handleDelete, queryParameter, khfwDatas } = this.props;
    return (
      <Card className={classnames('m-card myCard default', className)}>
        <Row className="m-row" style={{ marginTop: '1.833rem', marginBottom: '0.666rem' }}>
          <Col span={6}>
            <GroupInfo
              handleDelete={handleDelete}
              myCusGroup={myCusGroup}
              departmentCusGroup={departmentCusGroup}
              authorities={authorities}
              userBasicInfo={userBasicInfo}
              selectedKey={selectedKey}
              onSelecetedKeyChange={this.handleSelectedKeyChange}
              refreshCusGroupData={refreshCusGroupData}
              khfwDatas={khfwDatas}
            />
          </Col>
          <Col span={18}>
            <GroupList khfwDatas={khfwDatas} selectedName={selectedName} authorities={authorities} userBasicInfo={userBasicInfo} queryParameter={queryParameter} refreshCusGroupData={refreshCusGroupData} dictionary={dictionary} selectedKey={selectedKey} customerGroupType={customerGroupType} />
          </Col>
        </Row>
      </Card>
    );
  }
}
export default CustomerGroupPage;
