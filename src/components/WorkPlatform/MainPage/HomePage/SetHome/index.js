import React from 'react';
import { message } from 'antd';
import BasicModal from '@/components/Common/BasicModal';
import { FetchMyStatistics } from '@/services/home/home';
import SettingContent from './SettingContent';

const { Fragment } = React;

class SetHome extends React.Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    this.FetchMyStatisticsList();
  }

  // 调用端口获取我的统计基本信息
  FetchMyStatisticsList = async () => {
    await FetchMyStatistics({
    }).then(() => {

    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  // 打开弹框
  openModal = () => {
    this.setState({
      visible: true,
    });
  }

  // 取消
  handCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const { visible } = this.state;
    const { fetchConfigure } = this.props;
    const modalProps = {
      title: '',
      visible,
      width: '86rem',
      onCancel: this.handCancel,
      footer: null,
    };
    return (
      <Fragment>
        <div
          className="m-home-set"
          title="首页设置"
          onClick={() => this.openModal()}
        ><i className="iconfont icon-set1" />
        </div>
        <BasicModal {...modalProps}>
          <SettingContent fetchConfigure={fetchConfigure} onCancel={this.handCancel} />
        </BasicModal>
      </Fragment>
    );
  }
}

export default SetHome;
