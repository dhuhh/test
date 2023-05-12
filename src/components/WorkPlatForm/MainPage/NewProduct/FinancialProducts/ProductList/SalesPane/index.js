import React from 'react';
import { Row, Card, Col, Tabs, message, Button, Spin } from 'antd';
import { Link } from 'dva/router';
import { FetchSalesDisplayBoard } from '../../../../../../../services/newProduct';
import styles from '../index.less';
class SalesPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: false, // 是否隐藏面板
      scene: 1,
      loading: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getTabMessage = () => {
    const { authorities = {} } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    let khfwDatas = [{ name: '个人', key: 1 }];
    const { teamPmsn = '0' } = this.props;
    if (teamPmsn === '1') {
      khfwDatas.push({ name: '团队', key: 2 });
    }
    if (productPanoramaAuth.includes('yyb')) {
      khfwDatas.push({ name: '营业部', key: 3 });
    }
    return khfwDatas;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.scene !== this.state.scene) {
  //     this.getData();
  //   }
  // }

  getData = () => {
    this.setState({ loading: true });
    FetchSalesDisplayBoard({}).then((res) => {
      const { records = [], code = 0, date = '' } = res;
      if (code > 0) {
        const ryArr = [];
        const tdArr = [];
        const yybArr = [];
        records.forEach((item) => {
          if (item.cusRng === '人员' && item.idxNm.indexOf('保有') < 0) {
            ryArr.push(item);
          } else if (item.cusRng === '团队' && item.idxNm.indexOf('保有') < 0) {
            tdArr.push(item);
          } else if (item.cusRng === '营业部' && item.idxNm.indexOf('保有') < 0) {
            yybArr.push(item);
          }
        });
        this.setState({
          ryDatas: ryArr,
          tdDatas: tdArr,
          yybDatas: yybArr,
          date,
          loading: false,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleTabsChange = (key) => {
    this.setState({
      scene: key,
    });
  }

  // 千分位处理
  handleQfNumberStr = (s, fixNum) => {
    let text = String(s);
    if (!text) {
      return '';
    }
    text = parseFloat(text).toFixed(fixNum);
    const arr = text.split('.');
    const [zs = '', xs] = arr;
    const re = /(?=(?!(\b))(\d{3})+$)/g;
    let str = zs.replace(re, ',');
    if (xs) {
      str = `${str}.${xs}`;
    }
    return str;
  }


  render() {
    const khfwDatas = this.getTabMessage();
    const { isHide = false, scene = 1, ryDatas = [], tdDatas = [], yybDatas = [], date = '' } = this.state;
    const { authorities = {} } = this.props;
    const { productPanorama: productPanoramaAuth = [] } = authorities;
    const operations = (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {
          productPanoramaAuth.includes('lckhlb') && (
            <Link to={{ pathname: `/newProduct/financialProducts/customerList/index/cusList`, state: { scene } }} className="txt-d">
              <Button className="fcbtn m-btn-border m-btn-border-blue btn-1c" style={{ marginRight: '14px' }}>理财客户列表</Button>
            </Link>
          )
        }
        {
          productPanoramaAuth.includes('dtcx') && (
            <Link to={{ pathname: `/newProduct/financialProducts/customerList/index/invest`, state: { scene } }} className="txt-d">
              <Button className="fcbtn m-btn-border m-btn-border-blue btn-1c" >定投查询</Button>
            </Link>
          )
        }
      </div>
    );
    return (
      <React.Fragment>
        <Row>
          <Card className="ax-card" title={<span><span className="ax-card-title">销售看板</span>&nbsp;<span className={styles.subtitle}>{scene === '3' ? "不含货基/天利宝/证金宝/新户理财，该看板统计数据为“营业部全部客户”数据" : '不含货基/天利宝/证金宝/新户理财，该看板统计数据为“理财产品销售关系”数据'}</span></span>}>
            <Col sm={24}>
              <div>
                {/**页签 */}
                <Tabs className={`${styles.fxlxTab}`} style={{ display: isHide ? 'none' : '', marginTop: '-14px' }} animated={false} onChange={this.handleTabsChange} defaultActiveKey={`${scene}`} activeKey={`${scene}`} tabBarExtraContent={operations} tabBarStyle={{ borderBottom: 'none' }} >
                  {
                    khfwDatas.map((item) => {
                      const { name = '', key = '' } = item;
                      return (
                        <Tabs.TabPane tab={name} key={key}>
                          {
                            key === 1 && (
                              <div className="ax-tabdata">
                                <Spin spinning={this.state.loading}>
                                  {
                                    ryDatas.length !== 0 ? ryDatas.map((item, index) => {
                                      return (
                                        <div className="ax-datamodule">
                                          <div className="ax-moduleOne">{item.idxVal === '0' ? '--' : item.idxVal}</div>
                                          <div className="ax-moduleSecond">{item.idxNm}</div>
                                        </div>
                                      );
                                    }) : <span style={{ fontWeight: 'bold', fontSize: '1.666rem' }}>暂无数据</span>
                                  }
                                </Spin>
                              </div>
                            )}
                          {
                            key === 2 && (
                              <div className="ax-tabdata">
                                {
                                  tdDatas.length !== 0 ? tdDatas.map((item) => {
                                    return (
                                      <div className="ax-datamodule">
                                        <div className="ax-moduleOne">{item.idxVal === '0' ? '--' : item.idxVal}</div>
                                        <div className="ax-moduleSecond">{item.idxNm}</div>
                                      </div>
                                    );
                                  }) : <span style={{ fontWeight: 'bold', fontSize: '1.666rem' }}>暂无数据</span>
                                }
                              </div>
                            )}
                          {
                            key === 3 && (
                              <div className="ax-tabdata">
                                {
                                  yybDatas.length !== 0 ? yybDatas.map((item) => {
                                    return (
                                      <div className="ax-datamodule">
                                        <div className="ax-moduleOne">{item.idxVal === '0' ? '--' : item.idxVal}</div>
                                        <div className="ax-moduleSecond">{item.idxNm}</div>
                                      </div>
                                    );
                                  }) : <span style={{ fontWeight: 'bold', fontSize: '1.666rem' }}>暂无数据</span>
                                }
                              </div>
                            )}

                        </Tabs.TabPane>
                      );
                    })
                  }
                </Tabs>

                <div className="ax-data-sm">数据更新至{date}</div>
              </div>
            </Col>
          </Card>
        </Row>
      </React.Fragment>
    );
  }

}
export default SalesPane;
