import React from 'react';
import Bridge from 'livebos-bridge';
import AttachmentDownload from '../../../../components/WorkPlatform/SinglePage/AttachmentDownload';

const { Fragment } = React;
const { events } = Bridge.constants;

class AttachmentDownloadPage extends React.Component {
  state={
  }

  componentDidMount() {
    this.connect();
  }

  connect = () => {
    const bridge = new Bridge(window.parent);
    bridge.onReady(() => {
      bridge.on(events.SESSION_TIME_OUT, () => {
        console.log('会话超时');
      });
      bridge.on(events.SESSION_LOCKED, () => {
        console.log('会话锁定');
      });
      bridge.on(events.SESSION_UNLOCKED, () => {
        console.log('会话解锁');
      });
      bridge.on(events.THEME_CHANGED, ({ name }) => {
        console.log('主题切换:', name);
      });
      bridge.on(events.OPERATE_CALLBACK, (data) => {
        console.log('操作回调', data);
      });
    });
  }

  closeDialog = () => {
    window.close();
  }

  onLoad = () => {
    this.connect();
  }

  render() {
    const {
      location,
    } = this.props;
    const { search } = location;
    return (
      <Fragment>
        <AttachmentDownload
          search={search}
          onCancelOperate={this.closeDialog}
          onSubmitOperate={this.onSubmitOperate}
          onLoad={this.onLoad}
        />
      </Fragment>
    );
  }
}

export default AttachmentDownloadPage;
