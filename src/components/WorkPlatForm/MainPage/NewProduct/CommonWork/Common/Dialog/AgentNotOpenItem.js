import React from 'react';
import { Row, Col, Switch } from 'antd';
import arrow_up from '$assets/newProduct/arrow_up.svg';
import arrow_down from '$assets/newProduct/arrow_down.svg';
import styles from '../index.less';
import workStyles from '../../index.less';
class AgentNotOpenItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: false,
      checked: false,
      cusLvl: props.item?.cusLvl, // 0|全部客户 1|金桂卡客户
      pushChecked: props.item?.appPush === '1' ? true : false,
    };
  }

  handleChange = () => {
    const { type } = this.state;
    this.setState({
      type: !type,
    });
  }

  handlePushSwitchChange = (checked) => {
    this.setState({ pushChecked: checked });
    const { item, changeData, handleChangeData } = this.props;
    if (changeData.findIndex(obj => obj.id === item.id) !== -1) {
      changeData.splice(changeData.findIndex(obj => obj.id === item.id), 1);
    }
    changeData.push({ id: item.id, isNotice: this.state.checked ? '1' : '0', cusLvl: this.state.cusLvl, appPush: checked ? '1' : '0' });
    handleChangeData(changeData);
  }

  handleSwitchChange = (checked) => {
    this.setState({ checked });
    if (!checked) {
      this.setState({ pushChecked: false });
    }
    const { item, changeData, handleChangeData } = this.props;
    if (changeData.findIndex(obj => obj.id === item.id) !== -1) {
      changeData.splice(changeData.findIndex(obj => obj.id === item.id), 1);
    }
    changeData.push({ id: item.id, isNotice: checked ? '1' : '0', cusLvl: this.state.cusLvl, appPush: checked ? (this.state.pushChecked ? '1' : '0') : '0' });
    handleChangeData(changeData);
  }

  handleCheckCusLvl = (cusLvl) => {
    this.setState({ cusLvl });
    const { item, changeData, handleChangeData } = this.props;
    if (changeData.findIndex(obj => obj.id === item.id) !== -1) {
      changeData.splice(changeData.findIndex(obj => obj.id === item.id), 1);
    }
    changeData.push({ id: item.id, isNotice: this.state.checked ? '1' : '0', cusLvl: cusLvl, appPush: this.state.pushChecked ? '1' : '0' });
    handleChangeData(changeData);
  }

  render() {
    const { item = {} } = this.props;
    const { type } = this.state;
    return (
      <React.Fragment>
        <div>
          <Row type="flex" justify='space-between' align='middle' style={{ padding: '12px 0', margin: '0 24px', borderBottom: this.props.length - 1 !== this.props.index && '1px solid #EAEEF2' }}>
            <Col onClick={this.handleChange} className={workStyles.titleHover} style={{ color: "#959CBA", fontWeight: 500, fontSize: 16 }}>{item.motName || '--'}</Col>
            <Col onClick={this.handleChange} className={workStyles.titleHover} style={{ color: '#1A2243', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 4 }}>{type ? '收起' : '修改设置'}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img id={`arrow${item.id}`} style={{ width: 14, height: 14 }} src={type ? arrow_up : arrow_down} alt='' />
              </span>
            </Col>
          </Row>
        </div>
        {
          type ? (
            <div style={{ backgroundColor: '#F7F8FA', margin: '0 24px', padding: '20px 14px', display: 'flex' }}>
              <div style={{ width: '40%' }}>
                <div style={{ color: '#61698C', textAlign: 'justify' }}>
                提醒描述：{ item.describe }
                </div>
                <div style={{ fontSize: '16px', fontWeight: 400, color: '#61698C', paddingTop: 17 }}>待办时长<span style={{ fontSize: '24px', color: '#FF6E30' }}>3</span>天</div>
              </div>
              <div style={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 1, height: '100%', backgroundColor: '#D1D5E6', opacity: 0.4 }} />
              </div>
              <div style={{ width: 'calc(60% - 48px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {/* <div> */}
                  <div style={{ color: '#1A2243' }}>
                    是否开启该事件待办提醒
                  </div>
                  <div>
                    <Switch className={this.state.checked && styles.switch} checked={this.state.checked} onChange={this.handleSwitchChange} />
                  </div>
                  {/* </div> */}
                </div>

                <div style={{ display: this.state.checked ? 'flex' : 'none', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 0' }}>
                  {/* <div> */}
                  <div style={{ color: '#1A2243' }}>
                      客户级别
                  </div>
                  <div style={{ cursor: 'pointer', width: '130px', height: '40px', borderRadius: 20, border: '1px solid #D1D5E6', display: 'flex', backgroundColor: '#F7F8FA' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, fontSize: 12, borderRadius: 20, backgroundColor: this.state.cusLvl === '0' ? '#244FFF' : '#F7F8FA', color: this.state.cusLvl === '0' ? '#FFF' : '#61698C', zIndex: this.state.cusLvl === '0' ? 2 : 1 }} onClick={() => { this.handleCheckCusLvl('0'); }}>
                      <span>全部客户</span>
                    </div>
                    <div style={{ lineHeight: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, fontSize: 12, borderRadius: 20, backgroundColor: this.state.cusLvl === '1' ? '#244FFF' : '#F7F8FA', color: this.state.cusLvl === '1' ? '#FFF' : '#61698C', zIndex: this.state.cusLvl === '1' ? 2 : 1 }} onClick={() => { this.handleCheckCusLvl('1'); }}>
                      <div>V5-V7</div>
                      <div>(金桂卡)</div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>

                <div style={{ display: item.pushButton === '1' ? (this.state.checked ? 'flex' : 'none') : 'none', justifyContent: 'space-between', padding: '20px 0 0' }}>
                  {/* <div> */}
                  <div style={{ color: '#1A2243' }}>
                      是否开启app推送
                  </div>
                  <div>
                    <Switch className={this.state.pushChecked ? styles.switch : ''} checked={this.state.pushChecked} onChange={this.handlePushSwitchChange} />
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          ) : null
        }
      </React.Fragment>
    );
  }
}
export default AgentNotOpenItem;
