import { Icon, Popover } from 'antd';
import React, { Component } from 'react';
import lodash from 'lodash';
import MyPopover from './MyPopover';
import arrow_down from '$assets/newProduct/arrow_down.svg';
import arrow_up from '$assets/newProduct/arrow_up.svg';
import { formatThousands } from '../util';
import { newClickSensors, newViewSensors } from "$utils/newSensors";

class PopoverButton extends Component {
  state = {
    color: '#1A2243',
    src: arrow_down,
  }

  popoverVisibleChange = (visible) => {
    if (visible) {
      newClickSensors({
        third_module: "收益",
        ax_button_name: "资产变动明细点击次数",
      }); 
      this.setState({ color: '#244FFF', src: arrow_up });
    } else {
      this.setState({ color: '#1A2243', src: arrow_down });
    }
  }

  computed = (type, ...rest) => {
    if (type === 'fontSize') {
      let [val] = rest;
      val = Math.abs(Number(val));
      if (val >= 100000000) {
        return 12;
      }
      return 14;
    }
  }
  render() {
    const { homeData } = this.props;
    return (
      <Popover trigger='click' placement={this.props.placement} onVisibleChange={this.popoverVisibleChange} content={<div style={{ color: '#1A2243' }}>
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#61698C', paddingRight: 8 }}>收益金额(元)</span>
          <span style={{ color: this.props.computed('color', lodash.get(homeData, 'totalAssetChanges.profit', '0')), fontSize: 18 }}>{formatThousands(lodash.get(homeData, 'totalAssetChanges.profit', '0'))}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 140, height: 50, background: 'rgba(240,241,245,0.8)', borderRadius: 6, padding: '7px 0 0 15px' }}>
            <div style={{ color: '#61698C', fontSize: 12 }}>期末资产</div>
            <div>{formatThousands(lodash.get(homeData, 'totalAssetChanges.finalAsset', '0'))}</div>
          </div>
          <div style={{ width: 20, height: 20, background: 'rgba(240,241,245,0.8)', border: '3px solid #FFF', borderRadius: '50%', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -3px', zIndex: 2, fontWeight: 'bold' }}>-</div>
          <div style={{ width: 140, height: 50, background: 'rgba(240,241,245,0.8)', borderRadius: 6, padding: '7px 0 0 15px' }}>
            <div style={{ color: '#61698C', fontSize: 12, display: 'flex', alignItems: 'center' }}>
              <div style={{ paddingRight: 6 }}>净流入</div>
              <MyPopover placement='bottom' content={<div style={{ width: 338, lineHeight: '24px' }}>
                <div style={{ fontWeight: 600 }}>净流入=资金流入-资金流出</div>
                <div>资金流入及流出是指该资金账号内外之间的资金出入，例如银证转账、托管转入转出等。</div>
              </div>}>
                <Icon type="question-circle" style={{ width: 14, height: 14 }} />
              </MyPopover>
            </div>
            <div>{function() {
              const result = Number(lodash.get(homeData, 'totalAssetChanges.transferIn', '0')) - Number(lodash.get(homeData, 'totalAssetChanges.transferOut', '0'));
              if (result) {
                return formatThousands(result.toFixed(2));
              } else {
                return result;
              }
            }()}</div>
          </div>
          <div style={{ width: 20, height: 20, background: 'rgba(240,241,245,0.8)', border: '3px solid #FFF', borderRadius: '50%', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -3px', zIndex: 2, fontWeight: 'bold' }}>-</div>
          <div style={{ width: 140, height: 50, background: 'rgba(240,241,245,0.8)', borderRadius: 6, padding: '7px 0 0 15px' }}>
            <div style={{ color: '#61698C', fontSize: 12 }}>期初资产</div>
            <div>{formatThousands(lodash.get(homeData, 'totalAssetChanges.initialAsset', '0'))}</div>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 1, height: 15, background: '#B0B5CC' }}></div>
          <div style={{ width: 134, height: 16, border: '1px solid #B0B5CC', borderBottom: '1px solid transparent' }}></div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: 120, height: 50, background: '#FCF6E9', padding: '6px 0 0 16px', borderRadius: 6 }}>
              <div>资金流入</div>
              <div style={{ color: '#C79031', fontSize: this.computed('fontSize', lodash.get(homeData, 'totalAssetChanges.transferIn', '0')) }}>{formatThousands(lodash.get(homeData, 'totalAssetChanges.transferIn', '0'))}</div>
            </div>
            <div style={{ width: 20, height: 20, background: 'rgba(240,241,245,0.8)', border: '3px solid #FFF', borderRadius: '50%', color: '#61698C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 -3px', zIndex: 2, fontWeight: 'bold' }}>-</div>
            <div style={{ width: 120, height: 50, background: '#FCF6E9', padding: '6px 0 0 16px', borderRadius: 6 }}>
              <div>资金流出</div>
              <div style={{ color: '#C79031', fontSize: this.computed('fontSize', lodash.get(homeData, 'totalAssetChanges.transferOut', '0')) }}>{formatThousands(lodash.get(homeData, 'totalAssetChanges.transferOut', '0'))}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#74819E', padding: '22px 0 10px' }}>
            <Icon type="exclamation-circle" />
            <div style={{ paddingLeft: 6 }}>收益金额=期末资产-净流入-期初资产</div>
          </div>
        </div>
      </div>}>
        <div style={{  width: 134, height: 32, background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #B0B5CC', borderRadius: '1px', cursor: 'pointer' }}>
          <div style={{ paddingRight: 4, color: this.state.color }}>资产变动明细</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={this.state.src} alt='' />
          </div>
        </div>
      </Popover>
    );
  }
}

export default PopoverButton;