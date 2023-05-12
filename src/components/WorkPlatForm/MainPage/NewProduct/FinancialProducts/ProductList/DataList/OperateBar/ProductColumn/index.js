import React from 'react';
import { Popover, Tag, Row, Col, Icon, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../../../index.less';

class ProductColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
      currentTags: [],
      allTags: [], // 保存可添加指标中的所有数据
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dictionary: preDic = {}, allProductDisplayColumns: preCs = [], payload: { fieldsCode: preFC = [] } } = this.props;
    const { dictionary: aftDic = {}, allProductDisplayColumns: aftCs = [], payload: { fieldsCode: aftFC = [] } } = nextProps;
    if ((JSON.stringify(preDic) !== JSON.stringify(aftDic)) || (JSON.stringify(preCs) !== JSON.stringify(aftCs)) || (JSON.stringify(preFC) !== JSON.stringify(aftFC))) {
      this.initialData(nextProps);
    }
  }

  componentDidMount = () => {
    this.initialData(this.props);
  }

  initialData = (props) => {
    // 所有的可选指标
    const { dictionary = {}, allProductDisplayColumns = [], payload } = props;
    const { PDLST_IDX_TP = [] } = dictionary;
    const allTags = PDLST_IDX_TP.map(m => ({
      ...m,
      children: allProductDisplayColumns.filter(n => n.idxCl === m.ibm),
    }));
    // 已选中指标
    const { fieldsCode } = payload;
    const tmplAllColumns = [];
    allProductDisplayColumns.forEach((m) => {
      // 把指标的子指标展开
      if (!m.statcCycl) {
        tmplAllColumns.push(m);
      } else {
        const tArr = m.statcCycl.split(';');
        tArr.forEach((n) => {
          const [tTitle, tCode] = n.split(':');
          tmplAllColumns.push({
            ...m,
            colCode: tCode,
            dispCol: `${m.dispCol}(${tTitle})`,
            statcCycl: '',
          });
        });
      }
    });
    const currentTags = [];
    fieldsCode.forEach((m) => {
      const tmpl = tmplAllColumns.find(n => n.colCode === m);
      if (tmpl) {
        currentTags.push(tmpl);
      }
    });
    this.setState({ allTags, currentTags });
  }

  deleteTag = (data) => {
    const { payload: { fieldsCode = [] }, handleFormChange } = this.props;
    const tf = fieldsCode.filter(m => m !== data.colCode);
    if (handleFormChange) {
      handleFormChange({ fieldsCode: tf });
    }
  }

  handleNormalTagChange = (data) => {
    const { payload: { fieldsCode = [] }, handleFormChange } = this.props;
    if (!data.colCode) {
      return;
    }
    const tf = JSON.parse(JSON.stringify(fieldsCode));
    if (!tf.includes(data.colCode)) {
      tf.push(data.colCode);
    }
    if (handleFormChange) {
      handleFormChange({ fieldsCode: tf });
    }
  }

  handlePopTagChange = (code) => {
    const { payload: { fieldsCode = [] }, handleFormChange } = this.props;
    if (!code) {
      return;
    }
    const tf = JSON.parse(JSON.stringify(fieldsCode));
    // 同一个指标的下拉子指标，只是最后一个小数点后面的内容不同
    const prefix = code.substring(0, code.lastIndexOf('.'));
    // 先判断现在的字段里面有没有同一个指标
    const tIndex = tf.findIndex(m => m.indexOf(prefix) === 0);
    if (tIndex > -1) {
      tf[tIndex] = code;
    } else {
      tf.push(code);
    }
    if (handleFormChange) {
      handleFormChange({ fieldsCode: tf });
    }
  }

  handleVisibleChange = visible => {
    this.setState({ visibleModal: visible });
  };

  getPopoverContent = () => {
    const { currentTags = [], allTags = [] } = this.state;
    return (
      <div style={{ width: '42rem' }}>
        <Scrollbars autoHide style={{ width: '100%', minHeight: '48rem' }}>
          <div style={{ borderBottom: '1px solid #EBECF2', paddingBottom: '8px' }}>
            <p className="ax-zbtk-name">当前指标</p>
            {
              currentTags.map((item, index) => {
                if (index <= 1) {
                  return (
                    <Tag key={index} className="m-tag-ax tag-nodelete">
                      {index + 1}.{item.dispCol || '--'}
                    </Tag>
                  );
                }
                else {
                  return (
                    <Tag key={index} className="m-tag-ax">
                      <span>{index + 1}.{item.dispCol || '--'}</span>
                      <span onClick={() => { this.deleteTag(item); }}><Icon type="close" /></span>
                    </Tag>
                  );
                }
              })
            }
          </div>
          <div style={{ paddingBottom: '18px', marginTop: '18px' }}>
            <p className="ax-zbtk-name">可添加的指标</p>
            {
              allTags.length === 0 ? (<div className={styles.noneTarget}>暂无可添加指标</div>) : (
                allTags.map(m => (
                  this.isAllTagHaveChildren(m.children) && (
                    <Row key={m.ibm} className="ax-zbtb-row">
                      <Col span={5}><span className="ax-zbtk-sec">{m.note || '--'}：</span></Col>
                      <Col span={19}>
                        {
                          (m.children || []).map(n => this.getAllDataCellContent(n))
                        }
                      </Col>
                    </Row>
                  )
                ))
              )
            }
          </div>
        </Scrollbars>
      </div>
    );
  }

  // 判断指标分类下有没有指标
  isAllTagHaveChildren = (cs = []) => {
    if (cs.length === 0) {
      return false;
    }
    let flag = false;
    const { payload: { fieldsCode = [] } } = this.props;
    cs.every((m) => {
      //
      if (!fieldsCode.includes(m.colCode)) {
        flag = true;
        return false;
      }
      return true;
    });
    return flag;
  }

  // 下面全部标签单元格的内容
  getAllDataCellContent = (data) => {
    const { currentTags = [] } = this.state;
    const getPopCont = (stat) => {
      const tArr = stat.split(';');
      return (
        <div>
          {
            tArr.map((m, i) => {
              const [tTitle, tCode] = m.split(':');
              return (
                <div
                  key={tCode}
                  style={{
                    padding: '.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: currentTags.map(p => p.colCode).includes(tCode) && 'rgb(36, 79, 255)',
                    color: currentTags.map(p => p.colCode).includes(tCode) && '#FFFFFF',
                  }}
                  onClick={() => { this.handlePopTagChange(tCode); }}
                >
                  {tTitle}
                </div>
              );
            })
          }
        </div>
      );
    };
    // 有没有下拉选项
    const { statcCycl } = data;
    if (!statcCycl) {
      return !currentTags.map(p => p.colCode).includes(data.colCode) ? (
        <span onClick={() => { this.handleNormalTagChange(data); }}>
          <Tag.CheckableTag key={data.id} className="m-tag-ax m-tag-kbj">
            {data.dispCol || '--'} <span style={{ fontSize: '17px' }}>+</span>
          </Tag.CheckableTag>
        </span>
      ) : null;
    } else {
      return (
        <Popover
          content={getPopCont(statcCycl)}
          trigger="hover"
          placement="bottom"
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          <span>
            <Tag.CheckableTag key={data.id} className="m-tag-ax m-tag-kbj">
              {data.dispCol || '--'} <span style={{ fontSize: '12px' }}><Icon type="menu" /></span>
            </Tag.CheckableTag>
          </span>
        </Popover>
      );
    }
  }

  render() {
    const { visibleModal = false } = this.state;
    return (
      <React.Fragment>
        <Popover
          content={this.getPopoverContent()}
          trigger="click"
          visible={visibleModal}
          onVisibleChange={this.handleVisibleChange}
          placement="bottomRight"
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {/* <span style={{ padding: '10px 21px', backgroundColor: '#f0f1f5', cursor: 'pointer' }} onClick={this.handleVisibleChange}>
            <i className="iconfont icon-bianji1" style={{ fontSize: '19px' }} />编辑指标
          </span> */}
          <Button className="m-btn-radius" style={{ color: '#1A2243', background: '#f0f1f5', cursor: 'pointer', border: 'none' }} onClick={this.handleVisibleChange}>
            <i className="iconfont icon-bianji1" style={{ fontSize: '17px',paddingRight: '4px' }} />编辑指标
          </Button>
        </Popover>
      </React.Fragment>
    );
  }

}

export default ProductColumn;
