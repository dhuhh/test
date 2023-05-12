import React from 'react';
import { Button, message, Spin } from 'antd';
import lodash from 'lodash';
import { history } from 'umi';
import { QuertTaskServiceLog } from '$services/newProduct';
import arrow_right from '$assets/newProduct/arrow_right.svg';
import styles from '../index.less';
import workStyles from '../../index.less';
class FollowLog extends React.Component {
  state = {
    data: {},
    loading: false,
  }

  componentDidMount() {
    const { custNo } = this.props;
    const { custId } = this.props;
    this.setState({ loading: true });
    QuertTaskServiceLog({ custNo, custId }).then((res) => {
      this.setState({ loading: false });
      const data = lodash.get(res, 'records[0]', {});
      this.setState({ data });
    }).catch((err) => {
      message.error(err.note || err.success);
    });
  }

  handleOk = () => {
    const { handleOk } = this.props;
    if (handleOk) {
      handleOk();
    }
  }

  render() {
    const { data } = this.state;
    return (
      <Spin spinning={this.state.loading}>
        {/* <Card title='跟进日志'> */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#F7F8FA', marginBottom: 9 }}>
            <div style={{ color: "#1A2243" }}>{data.custRank} {data.custName}({data.custNo})</div>
            <div className={workStyles.titleHover} style={{ display: 'flex', color: '#1A2243', alignItems: 'center' }} onClick={() => window.open(`${window.location.href.substring(0, window.location.href.indexOf('#') + 1)}/customerPanorama/customerInfo?customerCode=${data.custNo}`)}>
              <span>查看</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img src={arrow_right} alt='' />
              </span>
            </div>
          </div>
          <div className={styles.form_style}>
            <div style={{ flex: 1, paddingRight: 80 }}>服务方式</div><div style={{ color: '#1A2243', flex: 5 }}>{data.dealType || '空'}</div>
          </div>
          <div className={styles.form_style}>
            <div style={{ flex: 1, paddingRight: 80 }}>处理时间</div><div style={{ color: '#1A2243', flex: 5 }}>{data.dealTime || '空'}</div>
          </div>
          <div className={styles.form_style}>
            <div style={{ flex: 1, paddingRight: 80 }}>处理内容</div><div style={{ flex: 5, wordBreak: 'break-all' }}>{data.dealContent || '空'}</div>
          </div>
          <div className={styles.form_style}>
            <div style={{ flex: 1, paddingRight: 80 }}>处理人</div><div style={{ color: '#1A2243', flex: 5 }}>{data.dealUser || '空'}</div>
          </div>
          <div className={styles.form_style}>
            <div style={{ flex: 1, paddingRight: 80 }}>指办人</div><div style={{ flex: 5 }}>{data.oprUser || '空'}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" className="m-btn-radius ax-btn-small m-btn-blue" onClick={this.handleOk}>确 定</Button>
          {/* <Button className="m-btn-radius m-btn-white" onClick={this.handleCancel}>取 消</Button> */}
        </div>
        {/* </Card> */}
      </Spin>
    );
  }
}
export default FollowLog;
