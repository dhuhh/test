import React from 'react';
import loadsh from 'lodash';
import LeftMenu from './LeftMenu';
import style from '../SelectedIndicator/mTabs.less';
import LabelCard from './LabelCard';

// 高级筛选弹出框 待选指标
class Index extends React.Component {
  constructor(props) {
    super(props);
    const { labelArr = [], nolabelArr = [] } = props;
    this.state={
      LabeladdKey: false,
      labelArr,
      nolabelArr,
      addname: '包含项',
    }
  }
  componentWillReceiveProps(nextProps) {
    const { labelArr = [], nolabelArr = [] } = nextProps;
    this.setState({
      labelArr: [...labelArr],
      nolabelArr: [...nolabelArr],
    });
  }
  onIndicatorsClick = (key) => {
    this.setState({
      LabeladdKey: key,
    });
  }
  onClickAdd = (addname) => {
    this.setState({
      addname,
    });
  }
  onLabelMenuClick = (obj) => {
    const { LabeladdKey, labelArr = [], nolabelArr = [], addname } = this.state;
    let arrClone = addname === '包含项' ? loadsh.cloneDeep(labelArr) : loadsh.cloneDeep(nolabelArr);
    if (LabeladdKey === false) { // 且
      arrClone.push([obj]);
      if (addname === '包含项') {
        this.setState({
          labelArr: arrClone,
        }, this.onChangeLabel);
      } else {
        this.setState({
          nolabelArr: arrClone,
        }, this.onChangeLabel);
      }
    } else {
      arrClone[LabeladdKey].push(obj);
      if (addname === '包含项') {
        this.setState({
          labelArr: arrClone,
        }, this.onChangeLabel);
      } else {
        this.setState({
          nolabelArr: arrClone,
        }, this.onChangeLabel);
      }
      this.setState({
        LabeladdKey: false,
      });
    }
  }
  onDeleClick = (addname, index, dex) => {
    const { labelArr = [], nolabelArr = [] } = this.state;
    let arrClone = addname === '包含项' ? loadsh.cloneDeep(labelArr) : loadsh.cloneDeep(nolabelArr);
    arrClone[index] = arrClone[index].filter((item, i) => {
      return i !== dex;
    });
    arrClone = arrClone.filter((item) => {
      return item.length > 0;
    });
    if (addname === '包含项') {
      this.setState({
        labelArr: arrClone,
      }, this.onChangeLabel);
    } else {
      this.setState({
        nolabelArr: arrClone,
      }, this.onChangeLabel);
    }
    this.setState({
      LabeladdKey: false,
    });
  }
  onChangeLabel = () => {
    const { labelArr = [], nolabelArr = [] } = this.state;
    const { onChangeLabel } = this.props;
    if (onChangeLabel) {
      onChangeLabel([...labelArr], [...nolabelArr]);
    }
  }
  render() {
    const { LabeladdKey, labelArr = [], nolabelArr = [], addname } = this.state;
    return (
      <div className="m-form ant-form ant-form-horizontal">
        <div className={`${style.m_rows} m-row-form ant-row`}>
          <div className="ant-col-sm-6">
            <LeftMenu onMenuClick={this.onLabelMenuClick} />
          </div>
          <div className="ant-col-sm-18">
            <div className="scroll" style={{ height: '40rem' }}>
              <div style={{ padding: '1rem 0', fontWeight: 'bold', fontSize: '18px' }}>已选标签</div>
              <div style={{ marginBottom: '3rem' }} onClick={() => this.onClickAdd('包含项')}>
                <LabelCard name='包含项' addname={addname} addIndicatorVisible={LabeladdKey} labelArr={labelArr} onDeleClick={this.onDeleClick} onIndicatorsClick={this.onIndicatorsClick}/>
              </div>
              <div style={{ marginBottom: '3rem' }} onClick={() => this.onClickAdd('排除项')}>
                <LabelCard name='排除项' addname={addname} addIndicatorVisible={LabeladdKey} labelArr={nolabelArr} onDeleClick={this.onDeleClick} onIndicatorsClick={this.onIndicatorsClick}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
