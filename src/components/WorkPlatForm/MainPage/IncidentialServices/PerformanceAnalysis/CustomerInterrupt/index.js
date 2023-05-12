/* eslint-disable array-callback-return */
import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { FetchIntrptCustAnalysis } from '../../../../../../services/incidentialServices';
import SearchContent from './SearchContent';
import DataTable from './DataTable';

class CustomerInterrupt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false, // 表格是否显示, 初进页面时为false
      pageState: { // 分页查询条件
        paging: 1,
        current: 1,
        pageSize: 10,
        sort: '',
        total: -1,
      },
      payload: { // 查询条件
        zdlx: '', // 中断类型
        chnl: '', // 渠道来源
        zdsj: '', // 中断时间
        zxbm: '', // 执行部门
        zxry: '', // 执行人员
        mode: '', // 查询类型
      },
      data: {
        records: [],
        total: 0,
        note: '',
      },
      totalData: [],
      loading: false,
      newPayload: {},
    };
  }

  componentDidMount() {

  }

  // 表单提交
  handleSubmit = async (values) => {
    this.setState({
      payload: {
        ...this.state.payload,
        ...values,
      },
      loading: true,
      show: true,
    }, await this.fetchData({ ...values, mode: '1' }), this.fetchData(values));
  }

  fetchData = (payload) => {
    const { pageState } = this.state;
    FetchIntrptCustAnalysis({
      ...pageState,
      ...payload,
    }).then((ret = {}) => {
      const { records = [], code = 0, total = 0, note = '' } = ret || {};
      if (code > 0) {
        if (payload.mode === '0') {
          this.setState({
            data: {
              records,
              total,
              note,
            },
            loading: false,
            newPayload: payload,
          });
        } else {
          this.setState({
            totalData: records,
          });
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  loadChangePage = (pageState) => {
    this.setState({ loading: true, pageState });
    const { payload } = this.state;
    FetchIntrptCustAnalysis({
      ...pageState,
      ...payload,
    }).then((ret = {}) => {
      const { records = [], code = 0, total = 0, note = '' } = ret || {};
      if (code > 0) {
        this.setState({
          data: {
            records,
            total,
            note,
          },
          loading: false,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  render() {
    const { show, pageState, payload, data, totalData, loading ,newPayload } = this.state;
    const { qdObj, zdlxObj } = this.props;
    return (
      <React.Fragment>
        <div style={{ backgroundColor: '#ffffff' }}>
          <SearchContent handleSubmit={this.handleSubmit} qdObj={qdObj} zdlxObj={zdlxObj} dictionary={this.props.dictionary}/>
          {show && <DataTable loadChangePage={this.loadChangePage} pageState={pageState} payload={payload} data={data} totalData={totalData} loading={loading} newPayload={newPayload}/>}
        </div>
      </React.Fragment>
    );
  }
}
export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(CustomerInterrupt);