import { Col, Rate, Row, Pagination } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { formatTimer } from '../../util';
import styles from '../../index.less';
import task_expried from '$assets/newProduct/task_expried.png';
import task_finished from '$assets/newProduct/task_finished.png';
import task_ing from '$assets/newProduct/task_ing.png';
import task_will_issue from '$assets/newProduct/task_will_issue.png';
// import delete_icon from '$assets/newProduct/delete.svg';

const map = {
  待完成: {
    img: task_ing,
    color: '#FF6E2F',
    backgroundColor: 'rgba(255,110,47,0.1)',
  },
  已完成: {
    img: task_finished,
    color: '#00B280',
    backgroundColor: 'rgba(0,178,128,0.1)',
  },
  未下发: {
    img: task_will_issue,
    color: '#0079FF',
    backgroundColor: 'rgba(0,121,255,0.1)',
  },
  已过期: {
    img: task_expried,
    color: '#74819E',
    backgroundColor: 'rgba(116,129,158,0.1)',
  },
};

function BacklogList(props) {
  useEffect(() => {
    let d = document.getElementById('bottomPagination');
    const height = d.offsetTop - 10;
    // props.setHeight(height);
    return () => {
      d = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeActiveList = (activeList) => {
    console.log(activeList,'activeList')
    const { setActiveList } = props;
    setActiveList(activeList);
  };

  const computed = (type, ...params) => {
    if (type === 'dateFontSize') {
      const [obj] = params;
      return moment(obj.endTime).endOf('day') < moment() ? 16 : 20;
    } else if (type === 'dateLeft') {
      const [obj] = params;
      return moment(obj.endTime).endOf('day') < moment() ? '281px' : (306 - ((`${moment(obj.endTime).startOf('day').diff(moment().startOf('day'), 'days', true)}`.length - 1) * 6)) + 'px';
    } else if (type === 'emptyHeight') {
      const [index] = params;
      return document.getElementById(`task${index}`) ? document.getElementById(`task${index}`).offsetHeight + 'px' : '';
    }
  };

  const handlePageChange = (current, pageSize) => {
    props.setCurrent(current);
    props.setPageSize(pageSize);
  };
  return (
    <>
      <Scrollbars autoHide style={{ height: 'calc(100vh - 200px)' }}>
        <div style={{ paddingLeft: 10 }}>
          {
            props.listData.map((obj, index) => {
              return (
                <div id={`task${index}`} key={`task${index}`} className={`${(Number(props.activeList.replace(/[^0-9]/g, '')) - 1 === index || Number(props.activeList.replace(/[^0-9]/g, '')) === index) ? styles.visibleAfter : styles.taskAfter}`} style={{ width: '100%', padding: '2px 10px 0 0', position: 'relative' }} onClick={() => handleChangeActiveList(`task${index}`)}>
                  <div style={{ width: '100%', padding: '10px 10px 0', position: 'relative' }} className={`${props.activeList !== `task${index}` ? styles.listHover : styles.shadow}`}>
                    <Row type='flex' align='middle' style={{ lineHeight: '14px', position: 'relative' }}>
                      <Col style={{ display: 'flex', alignItems: 'center', padding: '2px 4px', backgroundColor: map[obj.typeName]?.backgroundColor || 'rgba(255,110,47,0.1)', color: map[obj.typeName]?.color || '#FF6E2F', borderRadius: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
                          <img style={{ width: 12, height: 12 }} src={map[obj.typeName]?.img || task_ing} alt='' />
                        </div>
                        <div style={{ fontSize: 12 }}>
                          {obj.typeName}
                        </div>
                      </Col>
                      {/* <Col style={{ alignSelf: 'flex-start' }}>
                        <div style={{ width: 6, height: 6, background: '#E81919', borderRadius: '50%', visibility: computed('remind', obj), position: 'relative', top: -2 }}></div>
                      </Col> */}
                      <Col style={{ color: '#959CBA', fontSize: 12, marginLeft: 5 }}>{formatTimer(obj.updateTime || '-')}丨来自{obj.name || '-'}</Col>
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
                    <div dangerouslySetInnerHTML={{ __html: obj.taskSbj || '-' }} title={obj.taskSbj || '-'} style={{ width: '100%', padding: '5px 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 600, lineHeight: '16px' }} />
                    {/* <div dangerouslySetInnerHTML={{ __html: obj.cntnt || '-' }} style={{ width: '100%', paddingBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#61698C', fontSize: 12, lineHeight: '12px' }} /> */}
                    <Row style={{ width: '100%', padding: '12px 10px', background: 'linear-gradient(90deg, #F6F7FA 0%, rgba(255, 255, 255, 0) 100%)', fontSize: 12 }}>
                      <div style={{ display: 'flex', position: 'relative' }}>
                        <Row type='flex' align='middle' style={{ paddingBottom: 6, lineHeight: '12px' }}>
                          <Col style={{ paddingRight: 4 }}>{obj.taskType || ''}</Col>
                          <Col style={{ display: 'flex', alignItems: 'center' }}>
                            <Rate disabled value={Number(obj.impLvl || '0')} count={Number(obj.impLvl || '0')} style={{ fontSize: 14, color: '#FCAC01' }} className={styles.rate} />
                          </Col>
                        </Row>
                      </div>
                      <div style={{ color: '#61698C', display: 'flex', position: 'relative' }}>
                        <div style={{ lineHeight: '12px', color: '#1A2243' }}>
                          <span style={{ color: '#61698C' }}>待服务客户</span>
                          <span style={{ fontWeight: 'bold' }}>{obj.custCount || '0'}</span>
                          <span style={{ color: '#61698C' }}> / 已服务客户</span>
                          <span style={{ fontWeight: 'bold' }}>{obj.rate || '0'}</span>
                          <span style={{ color: '#61698C' }}> / 完成率</span>
                          <span style={{ fontWeight: 'bold' }}>{obj.custOver || '0'}</span>
                        </div>
                      </div>
                    </Row>
                    <div style={{ width: '100%', height: 1, background: '#D1D5E6', marginTop: 12, visibility: 'hidden' }}></div>
                    {/* { props.activeList.replace(/[^0-9]/g, '') === `${index}` && (
                      <div onClick={() => handleDeleteClick(obj.taskId)} className={styles.deleteHover} style={{ position: 'absolute', right: 0, bottom: 0, width: 34, height: 34, clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}>
                        <img style={{ width: 13, height: 13, position: 'absolute', right: 3, bottom: 3 }} src={delete_icon} alt='' />
                      </div>
                    )} */}
                  </div>
                </div>
              );
            })
          }
        </div>
      </Scrollbars>
      <div id='bottomPagination' style={{ width: 374, height: 40, background: '#FFF', borderTop: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8', position: 'fixed', bottom: 0, display: 'flex', alignItems: 'center' }}>
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
