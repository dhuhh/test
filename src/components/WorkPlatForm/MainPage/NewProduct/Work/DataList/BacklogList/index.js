import React, { useEffect, useReducer } from 'react';
import { Col, Pagination, Rate, Row } from 'antd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { formatTimer } from '../../util';
import { SaveTakeNotesProcessInfo } from '$services/newProduct';
import styles from '../../index.less';
import TASK from '$assets/newProduct/task.png';
import EVENT from '$assets/newProduct/event.png';
import FLOW from '$assets/newProduct/flow.png';

function BacklogList(props) {
  const [remind, dispatch] = useReducer((remind, id) => { remind.push(id); return remind; }, []);

  useEffect(() => {
    let d = document.getElementById('bottomPagination');
    const height = d.offsetTop - 8;
    props.setHeight(height);
    return () => {
      d = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeActiveList = (activeList, isFlow = false, id = '0', status = '0') => {
    const { setActiveList , ecifEventType ,setEventType } = props;
    //同步当前点击的卡片id
    setActiveList(activeList);
    // 区分ecif事件跟其他事件
    if( id === ecifEventType){
      setEventType('ecifEvent');
    }else{
      setEventType('otherEvent');
    }
    if (isFlow && status === '0') {
      SaveTakeNotesProcessInfo({ procId: Number(id) });
    }
    dispatch(id);
  };

  //计算样式的方法
  const computed = (type, ...params) => {
    if (type === 'remind') {
      const [obj] = params;
      return remind.indexOf(obj.id) > -1 ? 'hidden' : (obj?.status === '0' ? 'visible' : 'hidden');
    } else if (type === 'dateFontSize') {
      const [obj] = params;
      return moment(obj.endTime).endOf('day') < moment() ? 16 : 20;
    } else if (type === 'dateLeft') {
      const [obj] = params;
      return moment(obj.endTime).endOf('day') < moment() ? '281px' : (306 - ((`${moment(obj.endTime).startOf('day').diff(moment().startOf('day'), 'days', true)}`.length - 1) * 6)) + 'px';
    } else if (type === 'emptyHeight') {
      const [category, index] = params;
      return document.getElementById(`${category}${index}`) ? document.getElementById(`${category}${index}`).offsetHeight + 'px' : '0';
    }
  };

  const handlePageChange = (current, pageSize) => {
    props.setCurrent(current);
    props.setPageSize(pageSize);
  };
  return (
    <>
      <Scrollbars autoHide style={{ height: props.calendar ? props.height - 40 - 46 - 60 - 98 : props.height - 40 - 46 - 98, marginBottom: 40 }}>
        <div style={{ paddingLeft: 10 }}>
          {
            props.listData.map((obj, index) => {
              //console.log(obj,'obj');
              if (obj.typeId === '2') {
                return (
                  <div id={`task${index}`} key={`task${index}`} className={`${(Number(props.activeList.replace(/[^0-9]/g, '')) - 1 === index || Number(props.activeList.replace(/[^0-9]/g, '')) === index) ? styles.visibleAfter : styles.taskAfter}`} style={{ width: '100%', padding: '2px 10px 0 0', position: 'relative' }} onClick={() => handleChangeActiveList(`task${index}`, false, obj.id)}>
                    <div style={{ width: '100%', padding: '10px 10px 0' }} className={`${props.activeList !== `task${index}` ? styles.listHover : styles.shadow}`}>
                      <Row type='flex' align='middle' style={{ lineHeight: '14px', position: 'relative' }}>
                        <Col style={{ display: 'flex', alignItems: 'center', height: 14 }}>
                          <img style={{ width: 26, height: 14 }} src={TASK} alt='' />
                        </Col>
                        <Col style={{ alignSelf: 'flex-start' }}>
                          <div style={{ width: 6, height: 6, background: '#E81919', borderRadius: '50%', visibility: computed('remind', obj), position: 'relative', top: -2 }}></div>
                        </Col>
                        <Col style={{ color: '#959CBA', fontSize: 12 }}>{formatTimer(obj.updateTime || '-')}丨来自{obj.name || '-'}</Col>
                        <Col style={{ position: 'absolute', right: '0' }}>
                          {
                            moment(obj.endTime).endOf('day') < moment() ? <div style={{ color: '#FF6E30' }}>{moment(obj.endTime).format('YYYY.MM.DD')}</div> : (
                              <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#61698C' }}>
                                <div>距离截止</div>
                                <div style={{ fontSize: computed('dateFontSize', obj), color: '#FF6E30', padding: '0 2px' }}>{moment(obj.endTime).startOf('day').diff(moment().startOf('day'), 'days', true) || 0}</div>
                                <div>天</div>
                              </div>
                            )
                          }
                        </Col>
                      </Row>
                      <div dangerouslySetInnerHTML={{ __html: obj.sbj || '-' }} title={obj.sbj || '-'} style={{ width: '100%', padding: '5px 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600, lineHeight: '16px' }} />
                      {/* <div dangerouslySetInnerHTML={{ __html: obj.cntnt || '-' }} style={{ width: '100%', paddingBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#61698C', fontSize: 12, lineHeight: '12px' }} /> */}
                      <Row style={{ width: '100%', padding: '12px 10px', background: 'linear-gradient(90deg, #F6F7FA 0%, rgba(255, 255, 255, 0) 100%)', fontSize: 12 }}>
                        <div style={{ display: 'flex', position: 'relative' }}>
                          <Row type='flex' align='middle' style={{ paddingBottom: 6, lineHeight: '12px' }}>
                            <Col style={{ paddingRight: 4 }}>{obj.server || ''}</Col>
                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                              <Rate disabled value={Number(obj.implvl || '0')} count={Number(obj.implvl || '0')} style={{ fontSize: 14, color: '#FCAC01' }} className={styles.rate} />
                            </Col>
                          </Row>
                        </div>
                        <div style={{ color: '#61698C', display: 'flex', position: 'relative' }}>
                          <div style={{ lineHeight: '12px', color: '#1A2243' }}>
                            <span style={{ color: '#61698C' }}>待服务客户</span>
                            <span style={{ fontWeight: 'bold' }}>{obj.custCount || '0'}/{obj.custAccom || '0'}</span>
                            <span style={{ color: '#61698C' }}> / 已服务客户</span>
                            <span style={{ fontWeight: 'bold' }}>{obj.rate || '0'}</span>
                            <span style={{ color: '#61698C' }}> / 完成率</span>
                            <span style={{ fontWeight: 'bold' }}>{obj.custOver || '0'}</span>
                          </div>
                        </div>
                      </Row>
                      <div style={{ width: '100%', height: 1, background: '#D1D5E6', marginTop: 12, visibility: 'hidden' }}></div>
                    </div>
                  </div>
                );
              } else if (obj.typeId === '1') {
                return (
                  <div id={`event${index}`} key={`event${index}`} className={`${(Number(props.activeList.replace(/[^0-9]/g, '')) - 1 === index || Number(props.activeList.replace(/[^0-9]/g, '')) === index) ? styles.visibleAfter : styles.taskAfter}`} style={{ width: '100%', padding: '2px 10px 0 0', position: 'relative' }} onClick={() => handleChangeActiveList(`event${index}`, false, obj.id)}>
                    <div style={{ width: '100%', padding: '10px 10px 0' }} className={`${props.activeList !== `event${index}` ? styles.listHover : styles.shadow}`}>
                      <Row type='flex' align='middle' style={{ lineHeight: '14px', position: 'relative' }}>
                        <Col style={{ display: 'flex', alignItems: 'center', height: 14 }}>
                          <img style={{ width: 26, height: 14 }} src={EVENT} alt='' />
                        </Col>
                        <Col style={{ alignSelf: 'flex-start' }}>
                          <div style={{ width: 6, height: 6, background: '#E81919', borderRadius: '50%', visibility: computed('remind', obj), position: 'relative', top: -2 }}></div>
                        </Col>
                        <Col style={{ color: '#959CBA', fontSize: 12 }}>{formatTimer(obj.updateTime || '-')}丨来自{obj.name || '-'}</Col>
                        <Col style={{ position: 'absolute', right: '0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', color: '#61698c' }}>
                            <span>{props.calendar ? '' : '今日新增'}</span>
                            <span style={{ fontSize: 20, color: '#FF6E30', padding: '0 2px' }}>{props.calendar ? '' : (obj.implvl || '0')}</span>
                            <span>{props.calendar ? '' : '件'}</span>
                          </div>
                        </Col>
                      </Row>
                      <div dangerouslySetInnerHTML={{ __html: obj.sbj || '-' }} title={obj.sbj || '-'} style={{ width: '100%', lineHeight: '16px', padding: '5px 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600 }} />
                      <Row type='flex' align='middle' style={{ width: '100%', padding: '0 10px', height: 30, lineHeight: '30px', background: 'linear-gradient(90deg, #F6F7FA 0%, rgba(255, 255, 255, 0) 100%)', fontSize: 12, position: 'relative',display: 'flex',justifyContent: 'space-between' }}>
                        <Col>
                          <div>
                            <span style={{ color: '#61698C' }}>待服务客户</span>
                            <span style={{ color: '#1A2243', fontWeight: 'bold' }}>{obj.custCount || '0'}{props.calendar ? `/${obj.custAccom}` : ''}</span>
                            {props.calendar ? '' : <span style={{ color: '#61698C' }}> / 2天内到期</span>}
                            {props.calendar ? '' : <span style={{ color: '#1A2243', fontWeight: 'bold' }}>{obj.rate || '0'}</span>}
                          </div>
                        </Col>
                        <Col>
                          <div style={{ color: '#61698C',border: '1px solid #61698C',padding: '0px 10px' }}>{obj.importType === '2' ? '一般' : '重要'}</div>
                        </Col>
                      </Row>
                      <div style={{ width: '100%', height: 1, background: '#D1D5E6', marginTop: 12, visibility: 'hidden' }}></div>
                    </div>
                  </div>
                );
              } else if (obj.typeId === '3') {
                return (
                  <div id={`flow${index}`} key={`flow${index}`} className={`${(Number(props.activeList.replace(/[^0-9]/g, '')) - 1 === index || Number(props.activeList.replace(/[^0-9]/g, '')) === index) ? styles.visibleAfter : styles.flowAfter}`} style={{ width: '100%', padding: '2px 10px 0 0', position: 'relative' }} onClick={() => handleChangeActiveList(`flow${index}`, true, obj.id, obj.status)}>
                    <div style={{ width: '100%', padding: '10px 10px 0' }} className={`${props.activeList !== `flow${index}` ? styles.listHover : styles.shadow}`}>
                      <Row type='flex' align='middle' style={{ lineHeight: '14px' }}>
                        <Col style={{ display: 'flex', alignItems: 'center', height: 14 }}>
                          <img style={{ width: 26, height: 14 }} src={FLOW} alt='' />
                        </Col>
                        <Col style={{ alignSelf: 'flex-start' }}>
                          <div style={{ width: 6, height: 6, background: '#E81919', borderRadius: '50%', visibility: computed('remind', obj), position: 'relative', top: -2 }}></div>
                        </Col>
                        <Col style={{ color: '#959CBA', fontSize: 12 }}>{formatTimer(obj.updateTime || '-')}更新丨来自{obj.name || '-'}</Col>
                      </Row>
                      <div dangerouslySetInnerHTML={{ __html: obj.sbj || '-' }} title={obj.sbj || '-'} style={{ width: '100%', padding: '5px 0 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600, lineHeight: '16px' }} />
                    </div>
                  </div>
                );
              } else {
                return '';
              }
            })
          }
        </div>
      </Scrollbars>
      <div id='bottomPagination' style={{ width: props.width, height: 40, background: '#FFF', borderTop: '1px solid #e8e8e8', position: 'fixed', bottom: 0, display: 'flex', alignItems: 'center' }}>
        {/* <Scrollbars autoHide className={styles.paginationScrollbar} style={{ width: '100%', height: '100%', position: 'relative' }}> */}
        <Pagination
          // simple
          style={{ width: '100%', whiteSpace: 'nowrap', position: 'absolute', inset: '0', display: 'flex', alignItems: 'center' }}
          size='small'
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination} ${styles.smallPagination}`}
          pageSizeOptions={['20', '50', '100']}
          pageSize={props.pageSize}
          current={props.current}
          total={props.total}
          onChange={handlePageChange}
          onShowSizeChange={(current,pageSize) => handlePageChange(1, pageSize)}
        />
        {/* </Scrollbars> */}
      </div>
    </>
  );
}

export default BacklogList;
