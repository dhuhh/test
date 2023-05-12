/* eslint-disable eqeqeq */
import React from 'react';
import { Button, message } from 'antd';
import BasicModal from '../../../Common/BasicModal';
import AddCustomerIntoGroup from '../AddCustomerIntoGroup';
import CreateActivity from '../../../WorkPlatForm/MainPage/DigitalMarketing/Activity/Activelist/CreateActMoal';
import { addCusGroupSeniorFunc } from '../../../../services/customersenior/addCusGroupSenior';

class Modal extends React.Component {
  state = {
    selectType: 1,
    checkedValues: [],
    khqlx: 1, // 选择 加入/删除后 选中的群类型
    sfyyb: this.props.customerQueryType != '1', // 只要customerQueryType不是1 就是添加到营业部
    groupName: '',
    groupSM: '', // 客群说明
    addGroup: false,
    confirmLoading: false,
    cugid: '',
    cjgz: '',
  }
  componentWillReceiveProps(nextProps) {
    const { visible, customerQueryType = '' } = nextProps;
    if (!visible) {
      // // 执行完毕后将数据恢复初始状态
      this.setState({
        // selectType: 1,
        checkedValues: [],
        sfyyb: customerQueryType != '1',
        groupName: '',
        groupSM: '',
      });
    }
  }
  onSfYyb = (type) => {
    if (type === 1) {
      this.setState({
        sfyyb: false,
      });
    } else {
      this.setState({
        sfyyb: true,
      });
    }
  }
  handleOk = () => {
    const { onOk } = this.props;
    if (onOk) {
      onOk({ ...this.state });
    }
  }

  handleCancel = () => {
    const { confirmLoading = false } = this.state;
    if (confirmLoading) { // 如果正在执行中,那么就不允许取消,需要等待执行完成
      message.info('请等待创建结果');
      return false;
    }
    // 执行完毕后将数据恢复初始状态
    this.setState({
      selectType: 1,
      checkedValues: [],
      sfyyb: false,
      groupName: '',
      groupSM: '',
      addGroup: false,
    });
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  handleSelectTypeChange = (selectType) => {
    this.setState({
      selectType,
    });
  }

  handleCheckedValuesChange = (checkedValues, khqlx) => {
    this.setState({
      checkedValues,
      khqlx,
    });
  }

  handleGroupNameChange = (groupName) => {
    this.setState({
      groupName,
    });
  }

  handleGroupSMChange = (groupSM) => {
    this.setState({
      groupSM,
    });
  }

  initSelectType = () => {
    this.setState({
      selectType: 1,
    });
  }

  setRenderFooter = (addGroup) => {
    this.setState({ addGroup });
  }

  renderFooter = (addGroup, confirmLoading) => {
    const { showAddGroupAndCreateActivityBtn = false, DigitalGroupMyCusGroup = [] } = this.props;
    return addGroup ? (
      <div>
        <Button type="primary" className="m-btn-radius m-btn-headColor" loading={confirmLoading} onClick={() => this.handleaddGroup(1)}>保存群组</Button>
        { (!showAddGroupAndCreateActivityBtn && DigitalGroupMyCusGroup.includes('Establish')) && <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={() => this.handleaddGroup(2)}>保存群组并创建活动</Button>}
        <Button className="m-btn-radius m-btn-white" onClick={this.handleCancel}>取消</Button>
      </div>
    ) : (
      <div>
        <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.handleOk}>确定</Button>
        <Button className="m-btn-radius m-btn-white" onClick={this.handleCancel}>取消</Button>
      </div>
    );
  }
  /** 处理创建规则字段 */
  handleStrgh =(cxfy)=>{
    const { customerQueryType = '1' } = this.props;
    let list = [];
    if(typeof cxfy === 'string' && cxfy){
      if(cxfy.includes('更多条件')){
        const firstIndex = cxfy.indexOf('(');
        const lastIndex = cxfy.lastIndexOf(')');
        const gjsx = cxfy.substring(firstIndex, lastIndex + 1); //高级筛选
        const tjgl = cxfy.substring(lastIndex + 2); // 条件过滤
        const tjgl2 = cxfy.substring(0, firstIndex - 5);
        if(gjsx.includes('排除')){
          const arr = gjsx.split('排除');
          list.push({
            title: '高级筛选',
            bh: arr[0], // 包含
            pc: arr[1], // 排除
          });
        } else {
          list.push({
            title: '高级筛选',
            bh: gjsx,
          });
        }
        list.push({
          title: '条件过滤',
          bh: `${tjgl2}${tjgl}`,
        });
      } else {
        list.push({
          title: '条件过滤',
          bh: cxfy,
        });
      }
    } else {
      list.push({
        title: '条件过滤',
        // eslint-disable-next-line eqeqeq
        bh: `客户范围=${ customerQueryType == '1' ? '我的客户' : '营业部客户' }`,
      })
    }
    return list;
  }
  handleaddGroup = (type) => {
    let values = {};
    if (this.AddCustomerIntoGroup) {
      values = this.AddCustomerIntoGroup.sendSetNewGroupDatas();
    }
    const { khqlb = '', khqmc = '', sm = '', date = '', datezq = '', sfhxxs, yxqx, gxdx = {} } = values;
    const yxqxStr =  yxqx ? yxqx.format('YYYYMMDD') : '';
    // eslint-disable-next-line no-unused-vars
    const { selectedRowKeys, selectAll, customerQueryType, refreshPlanCard, reloadTable, circleModel, planObj = []  } = this.props;
    const { customerListBasicModel = {}, customerListSeniorAndQuickModel = {}, queryParameter = {}, cxgz = [], uuid = '', scene = '' } = this.props;
    const { cxfy = '' } = queryParameter;
    const cjgz = JSON.stringify(this.handleStrgh(cxfy).concat(cxgz));

    if (!khqmc) {
      // message.error({ title: '请输入客群名称' });
      return false;
    }
    if (!sm) {
      // message.error({ title: '请输入客群描述' });
      return false;
    }
    if (!khqlb) {
      // message.error({ title: '请输入客群类型' });
      return false;
    }
    if (khqlb === 2 && (!date || !datezq)) {
      // message.error({ title: '请输入计算周期' });
      return false;
    }
    if (khqlb === 2 && !yxqxStr) {
      // message.error({ title: '请输入有效期限' });
      return false;
    }

    this.setState({
      confirmLoading: true,
    });

    const { sfyyb = false } = this.state;
    addCusGroupSeniorFunc({
      customerGroupManageModel: {
        czlx: 3, // 1.加入群；2.从群中删除；3.添加到新群
        khqlx: sfyyb ? 3 : 1,
        khqlb, // 1.静态群 2.动态群
        khqmc,
        khlx: 1,
        sm,
        jszq: date + datezq,
        cjgz, // Array.isArray(rule) ? rule.join(',') : rule,
        sfhxxs,
        yxqx: yxqxStr,
        sfgx: (gxdx.keys && gxdx.keys.length > 0) ? 1 : 0,
        gxdx: gxdx.keys || '', // 共享对象
        gxlx: 1,
      },
      circleModel,
      customerListBasicModel: {
        ...customerListBasicModel,
        customerQueryType: customerQueryType > 3 ? 3 : customerQueryType,
      },
      customerListSeniorAndQuickModel,
      operateButtonSelModel: {
        scene,
        selectAll: selectAll ? 1 : 0,
        selectCode: selectedRowKeys.join(','),
      },
      uuid,
    }).then((ret = {}) => {
      const { code = 0, note = '', qid } = ret;
      if (code === 99) {
        message.info({ title: note });
        return;
      }
      if (code < 0) {
        message.error(note);
      } else {
        const content = '添加成功！';
        message.success(content);
        if (type === 2) {
          this.setState({
            cugid: qid,
            cjgz,
          }, () => {
            if (this.createActivity) {
              this.createActivity.handeleBeforeClick();
            }
          });
          // const params = {
          //   customerGroups: qid,
          //   customerGroupsTitles: khqmc,
          //   customerQueryType,
          // };
          // createActivityModal.handeleBeforeClick('创建客群', params, cjgz);
        }
        if (refreshPlanCard && typeof refreshPlanCard === 'function') {
          refreshPlanCard();
        }
        if (reloadTable && typeof reloadTable === 'function') {
          reloadTable();
        }
        this.setState({ // 返回结果后关闭弹窗
          confirmLoading: false,
        }, this.handleCancel);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
      this.setState({
        confirmLoading: false,
      });
    });
  }


  /**
   * 格式化参数
   * @param {string} cugid
   */
  getCreatActivtyParams = (cugid) => {
    const customerListBasicModel = {
      customerGroups: cugid,
      customerQueryType: '3', // 只有营业部才能创建活动
    };
    const customerListSeniorAndQuickModel = {};
    const operateButtonSelModel = {
      selectAll: 1,
      selectCode: '',
    };
    const params = {
      customerListBasicModel,
      customerListSeniorAndQuickModel,
      operateButtonSelModel,
    };
    return { params };
  }

  render() {
    const { selectType, checkedValues, addGroup, confirmLoading, cugid = '', cjgz = '' } = this.state;
    const { visible, selectedCount, userBasicInfo, customerQueryType } = this.props;
    const { params } = this.getCreatActivtyParams(cugid);
    const modalProps = {
      width: '70rem',
      title: '群操作',
      style: { top: '2rem' },
      visible,
      confirmLoading,
      onCancel: this.handleCancel,
      footer: this.renderFooter(addGroup, confirmLoading),
    };
    return (
      <React.Fragment>
        <BasicModal {...modalProps}>
          <AddCustomerIntoGroup
            ref={(c) => { this.AddCustomerIntoGroup = c; }}
            setRenderFooter={this.setRenderFooter}
            handleGroupNameChange={this.handleGroupNameChange}
            handleGroupSMChange={this.handleGroupSMChange}
            groupSM={this.state.groupSM}
            groupName={this.state.groupName}
            userBasicInfo={userBasicInfo}
            selectedCount={selectedCount}
            selectType={selectType}
            onSfYyb={this.onSfYyb}
            checkedValues={checkedValues}
            onSelectTypeChange={this.handleSelectTypeChange}
            onCheckedValuesChange={this.handleCheckedValuesChange}
            initSelectType={this.initSelectType}
            customerQueryType={customerQueryType}
          />
        </BasicModal>
        <CreateActivity
          custype="1" // 客户类型 1,存量客户(交易客户) 2.潜在客户
          createType="1" // 创建活动的方式  1: 带客户创建  2: 不带客户
          queryParams={params}
          cugid={cugid}
          cjgz={`规则: ${cjgz}`}
          render={<span style={{ display: 'none' }} />}
          ref={(c) => { this.createActivity = c; }}
        />
      </React.Fragment>


    );
  }
}
export default Modal;
