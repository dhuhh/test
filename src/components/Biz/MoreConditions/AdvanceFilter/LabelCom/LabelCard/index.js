import React from 'react';
import { Col, Row, Button, Divider, Card } from 'antd';
import styles from '../index.less';

// 高级筛选弹出框 待选指标
class Index extends React.Component {
  render() {
    const { isthisTab, addname, name, addIndicatorVisible, onDeleClick, onIndicatorsClick, labelArr = [] } = this.props;
    return (
      <React.Fragment>
        <Card style={{ borderBottom: '0', borderRadius: '0' }}>
          <div style={{ padding: '1rem', background: '#f5f5f5' }}>
            {name}
          </div>
        </Card>
        {
        labelArr.map((item, index) => {
            const fislast = index === (labelArr.length - 1);
            return (
              <React.Fragment key={`label_${index}`}>
                <Card className={`${isthisTab && addname === name && ((fislast && addIndicatorVisible === false) || addIndicatorVisible === index) ? 'm-border-color' : ''}`} >
                  <div style={{ padding: '1rem 1.5rem' }}>
                    {
                    item.map((it, dex) => {
                        const { strFormat } = it;
                        return (
                          <React.Fragment key={`labelIt_${dex}`}>
                            <Row>
                              <Col span={2}>
                                {dex === 0 && (
                                <Button size="small" className="m-border-color bg-mcolor" type="primary" shape="circle">
                                  {index + 1}
                                </Button>
                                )}
                              </Col>
                              <Col span={20}>
                                <div>{strFormat}</div>
                              </Col>
                              <Col span={2}>
                                {isthisTab && <Button className="m-border-color m-color" onClick={() => onDeleClick(name, index, dex)} ghost size="small" type="primary" style={{ width: '26.5px', marginRight: '2px' }}>-</Button>}
                                {isthisTab && dex === (item.length - 1) && <Button className="m-border-color m-color" onClick={() => onIndicatorsClick(index)} ghost size="small" type="primary" style={{ width: '26.5px' }}>+</Button>}
                              </Col>
                            </Row>
                            <Row>
                              {dex !== (item.length - 1) && (
                              <Col offset={2} span={22}>
                                <Divider style={{ margin: '5px 0' }} className="m-color" orientation="left" >或</Divider>
                              </Col>
                            )}
                            </Row>
                          </React.Fragment>
                        );
                    })
                    }
                    {
                    isthisTab && addname === name && addIndicatorVisible === index && (
                    <React.Fragment>
                      <Col offset={2} span={22}>
                        <Divider className="m-color" orientation="left" >或</Divider>
                      </Col>
                      <Row>
                        <Col offset={2} span={22}>
                          <Button type="dashed" block >请从左侧选择条件</Button>
                        </Col>
                      </Row>
                    </React.Fragment>)
                    }
                  </div>
                </Card>
                { !fislast && (
                <div style={{ borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', padding: '0 1.5rem' }}>
                  <Row>
                    <Col offset={2} span={22}>
                      <Divider style={{ margin: '5px 0' }} className={`${styles.m_Divider} m-color`} orientation="left" >且</Divider>
                    </Col>
                  </Row>
                </div>
)}
              </React.Fragment>
            );
        })
        }
        {
        labelArr.length === 0 && (
        <Card className={`${isthisTab && addname === name ? 'm-border-color' : ''}`}>
          <div style={{ padding: '1.5rem' }}>
            <Row>
              <Col span={2}>
                <Button size="small" className="m-border-color bg-mcolor" type="primary" shape="circle">1</Button>
              </Col>
              {isthisTab && (
              <Col span={22}>
                <Button type="dashed" block >请从左侧选择条件</Button>
              </Col>
)}
            </Row>
          </div>
        </Card>)
        }
      </React.Fragment>
    );
  }
}

export default Index;
