import React from 'react';
import LBDialog from 'livebos-frame/dist/LBDialog';
import AttachmentDownload from '../../../../components/WorkPlatform/SinglePage/AttachmentDownload';

class AttachmentDownloadPage extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line no-debugger
    debugger;
    if (this.props.resizeDialog) {
      const height = this.getParamString('height') || 400;
      const width = this.getParamString('width') || 500;
      this.props.resizeDialog({ width, height });
    }
  }

  // liveBos弹框确定
  onSubmitOperate = () => {
    const result = { code: 1 };
    // if( 操作成功  ){
    if (this.props.onSubmitOperate) {
      this.props.onSubmitOperate(result);
    }
    // }
  }
  // liveBos弹框关闭
  onCancelOperate = () => {
    if (this.props.onCancelOperate) {
      this.props.onCancelOperate();
    }
  }
  getParamString = (key) => {
    const { location: { search = '' } } = this.props;
    const regExp = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
    const paramString = search.match(regExp);
    if (paramString !== null) {
      return unescape(paramString[2]);
    }
    return null;
  }
  render() {
    const {
      location,
    } = this.props;
    const { search } = location;

    return (
      <LBDialog trustedOrigin="*">
        <AttachmentDownload
          search={search}
          onCancelOperate={this.onCancelOperate}
          onSubmitOperate={this.onSubmitOperate}
        />
      </LBDialog>
    );
  }
}

const AttachmentDownloadPages = ({ ...props }) => {
  return (
    <LBDialog trustedOrigin="*">
      <AttachmentDownloadPage {...props} />
    </LBDialog>
  );
};

export default AttachmentDownloadPages;
