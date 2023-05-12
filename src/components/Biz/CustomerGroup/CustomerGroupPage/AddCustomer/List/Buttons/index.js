import React from 'react';
import { Button, Input } from 'antd';
import { connect } from 'dva';
// import Export from '../../../../cusGroup/Rule/Trade/DataList/Buttons/Export';
import ScatterCircle from '../../../../../../WorkPlatForm/MainPage/DigitalMarketing/cusGroup/Rule/Trade/DataList/Buttons/ScatterCircle';
import SetUpGroup from '../../../../../../WorkPlatForm/MainPage/DigitalMarketing/cusGroup/Rule/Trade/DataList/Buttons/setUpGroup';
import CreateActivityMoal from '../../../../../../WorkPlatForm/MainPage/DigitalMarketing/Work/MarketingCard/CreateActivityMoal';

class Buttons extends React.Component {
  // 获取按钮操作通用参数(selectAll, selectedRowKeys, selectedCount)
  getExBtnOperateProps = () => {
    const { selectAll = false, selectedRowKeys = [], selectedCount = 0, showScatter = false, scatterCircleCusIds = [] } = this.props;
    let tSelAll = selectAll;
    let tSelRowKeys = selectedRowKeys;
    let tSelCount = selectedCount;
    // 散点圈人状态的参数
    if (showScatter) {
      tSelAll = false;
      tSelRowKeys = scatterCircleCusIds;
      tSelCount = scatterCircleCusIds.length;
    }
    return { selectAll: tSelAll, selectedRowKeys: tSelRowKeys, selectedCount: tSelCount };
  }

  render() {
    const { showScatter = false, showGroupSpread = false, changeShowScatter, dispatch, dictionary, userBasicInfo } = this.props;
    // const columns = [
    //   { label: '客户号', dataKey: 'customer_no' },
    //   { label: '客户姓名', dataKey: 'customer_name' },
    //   { label: '最近一次行为事件', dataKey: 'xwmc' },
    //   { label: '最近一次行为事件时间', dataKey: 'xwsj' },
    //   { label: '客户标签', dataKey: 'khbq' },
    //   { label: '客户级别', dataKey: 'khjb' },
    //   { label: '营业部编码', dataKey: 'department' },
    // ];
    return (
      <div className="m-szys-btn-list" style={{ display: 'inline' }}>
        <SetUpGroup customerQueryType="3" userBasicInfo={userBasicInfo} dispatch={dispatch} dictionary={dictionary} {...this.getExBtnOperateProps()} />

        <CreateActivityMoal type="1" dispatch={dispatch} dictionary={dictionary} {...this.getExBtnOperateProps()} />

        {/* 散点圈人 */}
        {
          <ScatterCircle disabled={showGroupSpread} showScatter={showScatter} changeShowScatter={changeShowScatter} />
        }
        {
          <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c">种群扩散</Button>
        }
        {/* <Export queryParameter={this.props.queryParams} displayColumns={columns} {...this.getExBtnOperateProps()} /> */}

        <div className="right certain-category-search-wrapper" style={{ width: '20rem' }}>
          <Input.Search
            placeholder="客户姓名/客户号/手机号"
            className="certain-category-search"
            style={{ width: '100%' }}
            disabled={showScatter || showGroupSpread}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  userBusinessRole: global.userBusinessRole,
  dictionary: global.dictionary,
  userBasicInfo: global.userBasicInfo,
}))(Buttons);
