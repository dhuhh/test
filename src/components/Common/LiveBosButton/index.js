/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { message, Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import Bridge from 'livebos-bridge';
import BasicModal from '../BasicModal';
import { FetchLivebosLink } from '../../../services/amslb/user';

const { Fragment } = React;
const iframeRef = React.createRef();

class LiveBosButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      target: '',
    };
  }
  static propTypes = {
    modalTitle: PropTypes.string.isRequired, // 弹框标题和按钮标题
    onOk: PropTypes.func, // 点击livebos确定按钮调用的函数
    params: PropTypes.string, // link接口的param动态参数的属性值
    method: PropTypes.string, // link接口的method参数
    object: PropTypes.string, // link接口的object参数
    // ------object，method，params这三个 和 liveBosUrl，id选择传递  --------
    liveBosUrl: PropTypes.string, // livebos链接
    id: PropTypes.string, // livebos链接拼接id 需要拼接就传递
    width: PropTypes.string, // 弹框宽度
    height: PropTypes.string, // 弹框高度
    chooseType: PropTypes.number, // 0不需要选择  1.只能单选  2.支持多选
    selectedRowKeys: PropTypes.array, // 选项的集合
    iconName: PropTypes.string, // 更新icon
    colorName: PropTypes.string, // 更换颜色
    buttonType: PropTypes.string, // 1为buttton  2为a标签
    openType: PropTypes.string, // 1弹框 2打开新页面
  }
  static defaultProps = {
    onOk: () => { },
    params: '',
    method: '',
    object: '',
    liveBosUrl: '',
    id: '',
    width: '77rem',
    height: '50rem',
    chooseType: 0,
    selectedRowKeys: [],
    iconName: '',
    colorName: '',
    buttonType: '1', // 1为buttton  2为a标签
    openType: '1', // 1弹框 2打开新页面
  }

  connect = () => {
    const bridge = new Bridge(iframeRef.current.contentWindow);
    // bridge.onReady(() => {
    //   bridge.on(events.OPERATE_CALLBACK, this.operateCallback);
    // });
    bridge.onReady(() => {
      bridge.on('operateCallback', (data) => {
        const {
          callback: {
            closeFlag,
            cancelFlag,
          } = {},
        } = !data ? {} : data;
        if (cancelFlag || closeFlag) { // 取消事件，对应 LiveBOS `operateCancel`
          this.handleCancel();
        } else { // 操作完成事件，对应 LiveBOS `operateCallback`
          message.success(data?.message || '操作成功');
          this.props.onOk();
          this.handleCancel();
        }
      });
    });
  };

  // 回掉方法
  operateCallback = (data) => {
    const {
      callback: {
        reload,
        closeFlag,
        cancelFlag,
      } = {},
    } = !data ? {} : data;
    if (reload) {
      // 刷新数据
      this.props.onOk();
      this.handleCancel();
      message.success(data?.message);
    }
    if (closeFlag || cancelFlag) {
      this.handleCancel();
      this.props.onOk();
    }
  }

  // 提示选择项方法
  showConfirm = (title) => {
    Modal.info({
      title,
      className: 'm-modal-info',
      onOk() { },
    });
  }

  // 处理选择到的数据
  hanldeSelectedRowKey = () => {
    const { selectedRowKeys, chooseType } = this.props;
    const selectedList = _.isArray(selectedRowKeys) ? selectedRowKeys.join(';') : selectedRowKeys;
    const { length } = _.isArray(selectedRowKeys) ? selectedRowKeys : selectedRowKeys.split();
    if (((chooseType === 1 || chooseType === 2) && length < 1) || (_.isArray(selectedRowKeys) && _.isEmpty(selectedRowKeys))) {
      this.showConfirm('请至少选择一个要标记的数据');
    } else if (chooseType === 1 && length > 1) {
      this.showConfirm('只能选择选择一个要标记的数据');
    } else {
      this.buttonShowModal(selectedList);
    }
  }

  // 显示弹窗
  buttonShowModal = (selectedList) => {
    const { params: key, method, object, liveBosUrl, id, openType } = this.props;
    const params = {};
    params[key] = selectedList;
    if (openType === '1') {
      if (liveBosUrl) {
        this.setState({
          target: `${liveBosUrl}${id}`,
          visible: true,
        });
      } else {
        FetchLivebosLink({
          params, method, object,
        }).then((ret = {}) => {
          const { data = '' } = ret;
          if (data) {
            this.setState({
              target: data,
              visible: true,
            });
          }
        }).catch((error) => {
          message.error(!error.success ? error.message : error.note);
        });
      }
    } else {
      this.props.dispatch(routerRedux.push(liveBosUrl));
    }
  }

  // 取消关闭弹框
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // handleLoad
  handleLoad = () => {
    this.connect();
  }

  render() {
    const { visible, target } = this.state;
    const { modalTitle, width, height, iconName, colorName, buttonType, liveBosUrl } = this.props;
    const modalProps = {
      title: modalTitle,
      width,
      visible,
      onCancel: this.handleCancel,
      footer: null,
    };

    return (
      <Fragment>
        {buttonType === '1' ? (
          <Button
            className=" fcbtn m-btn-border m-btn-border-headColor ant-btn btn-1c"
            onClick={this.hanldeSelectedRowKey}
            style={{ marginRight: '0.666rem' }}
          >
            {modalTitle}
          </Button>
        ) : (
          <a onClick={this.hanldeSelectedRowKey}>
            { buttonType === '2' ? (
              <div className={`m-table-icon ${colorName}`} style={{ display: !_.isEmpty(liveBosUrl) ? '' : 'none' }} title={modalTitle}>
                <i
                  className={`iconfont ${iconName}`}
                  style={{ cursor: 'pointer', fontSize: '1.166rem' }}
                />
              </div>
            ) : <span>{this.props.childrens}</span> }
          </a>
        )}
        <BasicModal {...modalProps}>
          <iframe
            ref={iframeRef}
            src={`${localStorage.getItem('livebos') || ''}${target}`}
            style={{ background: 'white', width: '100%', height, border: '0' }}
            onLoad={this.handleLoad}
          />
        </BasicModal>
      </Fragment>
    );
  }
}

export default LiveBosButton;
