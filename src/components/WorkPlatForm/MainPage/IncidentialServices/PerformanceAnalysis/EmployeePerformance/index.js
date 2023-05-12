/* eslint-disable array-callback-return */
import React from 'react';
import { message } from 'antd';
import { FetchStaffPerfermReport } from '../../../../../../services/incidentialServices';
import DataTable from './DataTable';
import SearchContent from './SearchContent';

class EmployeePerformance extends React.Component {
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
        chnl: '', // 渠道来源
        tjzq: '', // 统计周期
        zxbm: '', // 执行部门
        zxry: '', // 执行人员
        mode: '', // 查询类型
        dept: '',
        zdlx: '',
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
    FetchStaffPerfermReport({
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
    FetchStaffPerfermReport({
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

  setDept = (dept) => {
    this.setState({ ...this.state, dept });
  }

  render() {
    const { show, pageState, payload, data, totalData, loading ,newPayload } = this.state;
    const { qdObj ,zdlxObj } = this.props;
    return (
      <React.Fragment>
        <div style={{ backgroundColor: '#ffffff' }}>
          <SearchContent handleSubmit={this.handleSubmit} qdObj={qdObj} setDept={this.setDept} zdlxObj={zdlxObj}/>
          {show && <DataTable loadChangePage={this.loadChangePage} pageState={pageState} payload={payload} data={data} totalData={totalData} loading={loading} newPayload={newPayload}/>}
        </div>
      </React.Fragment>
    );
  }
}
export default EmployeePerformance;