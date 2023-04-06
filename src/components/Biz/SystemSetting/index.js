import React from 'react';
import BasicModal from '../../Common/BasicModal';
import SettingContent from './SettingContent';

class SystemSetting extends React.Component {
    state = {
      visible: false,
    }

  openModal = () => {
    this.setState({
      visible: true,
    });
  }

  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  handleOk=() => { // 点确定之后的操作
    this.closeModal();
  }

  handleItemChange = (checked, value) => {
    if (checked) {
      this.state.selectedItem.push(value);
    } else {
      this.state.selectedItem = this.state.selectedItem.filter(item => item !== value);
    }
    this.setState({
      selectedItem: this.state.selectedItem,
    });
  }

  render() {
    const { theme, handleThemeChange, type } = this.props;
    return (
      <React.Fragment>
        {
          type === 1 ? <a onClick={() => { this.openModal(); }} title="换肤" ><i className="iconfont icon-huanfu" style={{ fontSize: '1.5rem' }} /></a> : (
            <li key="SystemSetting" onClick={() => { this.openModal(); }} >
              <span className="m-handle-icon"><i className="iconfont icon-huanfu" /></span>
              <span className="m-handle-text">
                <div>
                  <div>系统设置</div>
                </div>
              </span>
            </li>
          )
        }
        <BasicModal
          isAllWindow={1}
          style={{ top: '10rem', overflowY: 'auto' }}
          width="72rem"
          destroyOnClose
          title="系统设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.closeModal}
        >
          <SettingContent handleThemeChange={handleThemeChange} theme={theme} />
        </BasicModal>
      </React.Fragment>
    );
  }
}

export default SystemSetting;
