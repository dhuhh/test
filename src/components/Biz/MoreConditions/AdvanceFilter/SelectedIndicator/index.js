import React from 'react';
import loadsh from 'lodash';
import LeftMenu from '../Common/LeftMenu';
import PlanList from '../Common/PlanList';
import SearchIndicator from './SearchIndicator';
// import OutputIndicator from './OutputIndicator';
import { message } from 'antd';
import LabelLeftMenu from '../LabelCom/LeftMenu';
import LabelCard from '../LabelCom/LabelCard';
import GroupLeftMenu from '../../../CustomerGroup/CustomerGroupPage/groupInfo'
import { getCusGroup } from '../../../../../services/customerbase/myCusGroup';
import style from './mTabs.less';

// 高级筛选弹出框 待选指标
class SelectedIndicator extends React.Component {
  constructor(props) {
    super(props);
    const { labelArr = [], nolabelArr = [], GroupArr = [], noGroupArr = [] } = props;
    this.state={
      addIndicatorVisible: true,
      // 标签
      LabeladdKey: false,
      labelArr,
      nolabelArr,
      addname: '包含项',
      // 客群
      myCusGroup: [],
      departmentCusGroup: [],
      GroupaddKey: false,
      GroupArr,
      noGroupArr,
      addGroupname: '包含项',
    }
  }
  componentDidMount() {
    this.fetchCusGroupData();
  }
  // 获取客户群信息
  fetchCusGroupData = () => {
    getCusGroup({ khqlx: '', paging: 0 }).then((result) => {
      const { records = [] } = result || {};
      const myCusGroup = [];
      const departmentCusGroup = [];
      if (Array.isArray(records)) {
        records.forEach((item) => {
          const { khqlx = '我的客户群' } = item;
          if (khqlx === '我的客户群') {
            myCusGroup.push(item);
          } else {
            departmentCusGroup.push(item);
          }
        });
      }
      this.setState({
        myCusGroup,
        departmentCusGroup,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  componentWillReceiveProps(nextProps) {
    const { labelArr = [], nolabelArr = [], GroupArr = [], noGroupArr = [] } = nextProps;
    this.setState({
      labelArr: [...labelArr],
      nolabelArr: [...nolabelArr],
      GroupArr: [...GroupArr],
      noGroupArr: [...noGroupArr],
    });
  }
  onAddGroupClick = (key) => {
    this.setState({
      GroupaddKey: key,
    });
  }
  onClickAddGroup = (addGroupname) => {
    this.setState({
      addGroupname,
    });
  }
  onGroupMenuClick = (key, customerGroupType, customerGroupName) => {
    let strFormat = ''
    if (customerGroupType === 'mine') {
      strFormat = `我的客群 —— ${customerGroupName}`;
    } else if (customerGroupType === 'share') {
      strFormat = `营业部客群 —— ${customerGroupName}`;
    }
    const obj = { value:key, strFormat, title: `<${customerGroupName}>`};
    const { GroupaddKey, GroupArr = [], noGroupArr = [], addGroupname } = this.state;
    let arrClone = addGroupname === '包含项' ? loadsh.cloneDeep(GroupArr) : loadsh.cloneDeep(noGroupArr);
    if (GroupaddKey === false) { // 且
      arrClone.push([obj]);
      if (addGroupname === '包含项') {
        this.setState({
          GroupArr: arrClone,
        }, this.onChangeGroup);
      } else {
        this.setState({
          noGroupArr: arrClone,
        }, this.onChangeGroup);
      }
    } else {
      arrClone[GroupaddKey].push(obj);
      if (addGroupname === '包含项') {
        this.setState({
          GroupArr: arrClone,
        }, this.onChangeGroup);
      } else {
        this.setState({
          noGroupArr: arrClone,
        }, this.onChangeGroup);
      }
      this.setState({
        GroupaddKey: false,
      });
    }
  }
  onDeleGroupClick = (addGroupname, index, dex) => {
    const { GroupArr = [], noGroupArr = [] } = this.state;
    let arrClone = addGroupname === '包含项' ? loadsh.cloneDeep(GroupArr) : loadsh.cloneDeep(noGroupArr);
    arrClone[index] = arrClone[index].filter((item, i) => {
      return i !== dex;
    });
    arrClone = arrClone.filter((item) => {
      return item.length > 0;
    });
    if (addGroupname === '包含项') {
      this.setState({
        GroupArr: arrClone,
      }, this.onChangeGroup);
    } else {
      this.setState({
        noGroupArr: arrClone,
      }, this.onChangeGroup);
    }
    this.setState({
      GroupaddKey: false,
    });
  }
  onChangeGroup = () => {
    const { GroupArr = [], noGroupArr = [] } = this.state;
    const { onChangeGroup } = this.props;
    if (onChangeGroup) {
      onChangeGroup([...GroupArr], [...noGroupArr]);
    }
  }
  //
  onAddLableClick = (key) => {
    this.setState({
      LabeladdKey: key,
    });
  }
  onClickAdd = (addname) => {
    this.setState({
      addname,
    });
  }
  onLabelMenuClick = (obj) => {
    const { LabeladdKey, labelArr = [], nolabelArr = [], addname } = this.state;
    let arrClone = addname === '包含项' ? loadsh.cloneDeep(labelArr) : loadsh.cloneDeep(nolabelArr);
    if (LabeladdKey === false) { // 且
      arrClone.push([obj]);
      if (addname === '包含项') {
        this.setState({
          labelArr: arrClone,
        }, this.onChangeLabel);
      } else {
        this.setState({
          nolabelArr: arrClone,
        }, this.onChangeLabel);
      }
    } else {
      arrClone[LabeladdKey].push(obj);
      if (addname === '包含项') {
        this.setState({
          labelArr: arrClone,
        }, this.onChangeLabel);
      } else {
        this.setState({
          nolabelArr: arrClone,
        }, this.onChangeLabel);
      }
      this.setState({
        LabeladdKey: false,
      });
    }
  }
  onDeleClick = (addname, index, dex) => {
    const { labelArr = [], nolabelArr = [] } = this.state;
    let arrClone = addname === '包含项' ? loadsh.cloneDeep(labelArr) : loadsh.cloneDeep(nolabelArr);
    arrClone[index] = arrClone[index].filter((item, i) => {
      return i !== dex;
    });
    arrClone = arrClone.filter((item) => {
      return item.length > 0;
    });
    if (addname === '包含项') {
      this.setState({
        labelArr: arrClone,
      }, this.onChangeLabel);
    } else {
      this.setState({
        nolabelArr: arrClone,
      }, this.onChangeLabel);
    }
    this.setState({
      LabeladdKey: false,
    });
  }
  onChangeLabel = () => {
    const { labelArr = [], nolabelArr = [] } = this.state;
    const { onChangeLabel } = this.props;
    if (onChangeLabel) {
      onChangeLabel([...labelArr], [...nolabelArr]);
    }
  }
  onIndicatorsClick = (key) => {
    const { onIndicatorsClick } = this.props;
    this.setState({
      addIndicatorVisible: false,
    });
    this.emptyIndicatorVisible = true;
    onIndicatorsClick(key);
  }
  onBlur = (fkey, subKey) => {
    const { onDelet } = this.props;
    if (onDelet) {
      onDelet(fkey, subKey, '2');
    }
    this.setState({
      addIndicatorVisible: true,
    });
    setTimeout(() => {
      this.emptyIndicatorVisible = false;
    }, 500);
  }
  onMenuClick = (value) => {
    const { onMenuClick } = this.props;
    if (this.emptyIndicatorVisible) {
      this.setState({
        addIndicatorVisible: true,
      });
      onMenuClick(value, '1'); // 新增 '或' 条件
    } else {
      this.setState({
        addIndicatorVisible: true,
      });
      onMenuClick(value, '2');// 新增 '且' 条件
    }
  }
  emptyIndicatorVisible = false;
  render() {
    const { addIndicatorVisible } = this.state;
    const { LabeladdKey, labelArr = [], nolabelArr = [], addname } = this.state;
    const { GroupaddKey, GroupArr = [], noGroupArr = [], addGroupname } = this.state;
    const { faid, form, queryParameter, currentKey, dispatch, dictionary, userBusinessRole, handleClick, onPlanClick, objectDictionary, currentStep, onDelet, addStep, steps, mySearchSchemeService, seniorMenuService, onSaveScheme, canOperateGroup = true } = this.props;
    return (
      <div className="m-form ant-form ant-form-horizontal">
        <div className={`${style.m_rows} m-row-form ant-row`}>
          <div className="ant-col-sm-6">
          {currentKey === '4' && <LabelLeftMenu onMenuClick={this.onLabelMenuClick} /> }
          {currentKey === '5' && (
            <GroupLeftMenu
              menuClassType={1}
              myCusGroup={this.state.myCusGroup}
              departmentCusGroup={this.state.departmentCusGroup}
              authorities={this.props.authorities}
              userBasicInfo={this.props.userBasicInfo}
              onSelecetedKeyChange={this.onGroupMenuClick}
              refreshCusGroupData={this.fetchCusGroupData}
              canOperate={canOperateGroup}
            /> )
          }
          {currentKey === '0' && <LeftMenu onMenuClick={this.onMenuClick} seniorMenuService={seniorMenuService} /> }
          {(currentKey === '1' || currentKey === '2' || currentKey === '3') && <PlanList faid={faid} queryParameter={queryParameter} userBusinessRole={userBusinessRole} dispatch={dispatch} currentKey={currentKey} onPlanClick={onPlanClick} mySearchSchemeService={mySearchSchemeService} onSaveScheme={onSaveScheme} /> }
          </div>
          <div className="ant-col-sm-18">
            <div id="anchor-Container-cus" className="scroll" style={{ height: '40rem' }}>
              {/* <Tabs onChange={this.handleTabsChange} activeKey={activeKey} className={`${style.m_tabs} m-tabs-screen2 m-tabs-underline`} >
                <Tabs.TabPane tab={<div style={{ fontWeight: 'bold', fontSize: '18px' }}>输出条件配置</div>} key="sc">
                  <OutputIndicator onDeletOutPut={this.onDeletOutPut} form={form} datas={this.state.outPut} dictionary={dictionary} />
                </Tabs.TabPane>
              </Tabs> */}
              <div id='components-anchor-zb' style={{ padding: '1rem 0', fontWeight: 'bold', fontSize: '18px' }}>已选指标</div>
              <SearchIndicator seniorMenuService={seniorMenuService} isthisTab={currentKey === '0'} onBlur={this.onBlur} addIndicatorVisible={addIndicatorVisible} onIndicatorsClick={this.onIndicatorsClick} dictionary={dictionary} objectDictionary={objectDictionary} handleClick={handleClick} currentStep={currentStep} form={form} onDelet={onDelet} addStep={addStep} steps={steps} />
              <div id='components-anchor-bq' style={{ padding: '1rem 0', fontWeight: 'bold', fontSize: '18px' }}>已选标签</div>
              <div style={{ marginBottom: '3rem' }} onClick={() => this.onClickAdd('包含项')}>
                <LabelCard isthisTab={currentKey === '4'} name='包含项' addname={addname} addIndicatorVisible={LabeladdKey} labelArr={labelArr} onDeleClick={this.onDeleClick} onIndicatorsClick={this.onAddLableClick}/>
              </div>
              <div style={{ marginBottom: '3rem' }} onClick={() => this.onClickAdd('排除项')}>
                <LabelCard isthisTab={currentKey === '4'} name='排除项' addname={addname} addIndicatorVisible={LabeladdKey} labelArr={nolabelArr} onDeleClick={this.onDeleClick} onIndicatorsClick={this.onAddLableClick}/>
              </div>
              <div id='components-anchor-kq' style={{ padding: '1rem 0', fontWeight: 'bold', fontSize: '18px' }}>客群体系</div>
              <div style={{ marginBottom: '3rem' }} onClick={() => this.onClickAddGroup('包含项')}>
                <LabelCard isthisTab={currentKey === '5'} name='包含项' addname={addGroupname} addIndicatorVisible={GroupaddKey} labelArr={GroupArr} onDeleClick={this.onDeleGroupClick} onIndicatorsClick={this.onAddGroupClick}/>
              </div>
              <div style={{ marginBottom: '3rem' }} onClick={() => this.onClickAddGroup('排除项')}>
                <LabelCard isthisTab={currentKey === '5'} name='排除项' addname={addGroupname} addIndicatorVisible={GroupaddKey} labelArr={noGroupArr} onDeleClick={this.onDeleGroupClick} onIndicatorsClick={this.onAddGroupClick}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SelectedIndicator;
