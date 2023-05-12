import React from 'react';
import { message } from 'antd';
import DataList from './DataList';
import DataChart from './DataChart';
import ObjectUtils from '../../../../../utils/objectUtils';
import { FetchSysLoginTrends } from '../../../../../services/customization';


class DataChartAndList extends React.Component {
  state = {
    dataSource: [],
  }
  componentWillReceiveProps(nextProps) {
    if (!ObjectUtils.shallowEqual(this.props.payload, nextProps.payload)) {
      this.queryDatas(nextProps);
    }
  }

  queryDatas = (params = {}) => {
    const { payload = {} } = params;
    FetchSysLoginTrends({ // 获取数字数据
      ksrq: payload.ksrq,
      jsrq: payload.jsrq,
      khd: payload.khd,
      zzjg: payload.zzjg,
    }).then((ret) => {
      const { records = [] } = ret;
      this.setState({
        dataSource: records || [],
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  render() {
    const { dataSource = [] } = this.state;
    return (
      <React.Fragment>
        <DataChart dataSource={dataSource} />
        <DataList dataSource={dataSource} />
      </React.Fragment>
    );
  }
}
export default DataChartAndList;
