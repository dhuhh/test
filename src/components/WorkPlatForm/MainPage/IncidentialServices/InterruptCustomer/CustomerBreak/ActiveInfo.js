import React from 'react';
import { Row, Card, Table, message } from 'antd';
import { FetchIntrptCustActvInfo } from '../../../../../../services/incidentialServices';
import styles from './index.less';

class ActiveInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activData: [], // 服务信息 
      loading: false,  // 列表加载状态显示
      pageState: {  // 分页查询条件
        paging: 1,
        current: 1,
        pageSize: 3,
        sort: '',
        total: -1,
      },
      totals: 0,
    };
  }

  componentDidMount() {
    this.getActiveData();
  }

    // 获取活动信息
    getActiveData = () => {
      const { custNo } = this.props;
      const { pageState } = this.state;
      FetchIntrptCustActvInfo({
        ...pageState,
        custNo,
        actvTm: '',
      }).then((ret = {}) => {
        const { records = [], code = 0, total = 0 } = ret || {};
        if (code > 0) {
          this.setState({
            activData: records,
            totals: total,
            loading: false,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }

    // 加载
    handlePagerChange = () => {
      const { pageState } = this.state;
      const newPageState = {
        ...pageState, 
        pageSize: pageState.pageSize + 10,
      };
      this.setState({
        pageState: newPageState,
        loading: true,
      }, this.getActiveData );
    }

    limitLength = (target) => {
      let targetLength;
      if (target.length >= 15) {
        targetLength = `${target.substr(0, 15)}...`;
        return targetLength;
      }
      return target;
    }

    render() {
      const { activData = [], loading = false, totals = 0 } = this.state;
      const columns = [
        {
          title: '参与时间',
          dataIndex: 'actvTm',
          align: 'center',
          key: 'actvTm',
          width: '50%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
        {
          title: '活动内容',
          dataIndex: 'cntnt',
          align: 'center',
          key: 'cntnt',
          width: '50%',
          className: 'm-black',
          render: text => <div className='m-darkgray'>{text}</div>,
        },
      ];
      const tableProps = {
        loading,
        rowKey: 'rgstTm',
        dataSource: activData,
        columns,
        bordered: true,
        className: 'm-Card-Table',
        pagination: false,
      };
      return (
        activData.length !== 0 && (
          <Row>
            <Card title={<span className="ax-card-title">活动信息</span>} className="m-card default">
              <div className={styles.mCardTableMg}>
                <Table {...tableProps} />
                {totals > activData.length && <span className='m-black tc width100 pt10' style={{ cursor: 'pointer', display: 'inline-block' }} onClick={this.handlePagerChange}>点击加载更多</span>}
              </div>
            </Card>
          </Row>
        )
      );
    }
}
export default ActiveInfo;
