import { Col, Row } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import React from 'react';
import STRATEGY from '$assets/newProduct/strategy.png';
import noticeIconEnclosure from '$assets/newProduct/notice_icon_enclosure.png';
import styles from '../../index.less';

function Detail(props) {
  const download = () => {
    const { sysParam } = props;
    const serverName = sysParam.find(i => i.csmc === 'system.c4ym.url')?.csz || '';
    window.open(`${serverName}${props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.dealType}`);
  };

  const computed = (type) => {
    if (type === 'lookAttac') {
      return props.activeList.replace(/[0-9]/g, '') === 'task' && props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.dealType ? 'visible' : 'hidden';
    } else if (type === 'taskPeriod') {
      return props.activeList.replace(/[0-9]/g, '') === 'task' ? 'visible' : 'hidden';
    }
  };

  return (
    <div>
      <div style={{ padding: '20px 0', color: '#1A2243', fontSize: 16 , textAlign: 'center', verticalAlign: 'center' }}>
        <span style={{ float: 'left' }}>{props.activeList.replace(/[0-9]/g, '') === 'task' ? '任务详情' : '事件详情'}</span>
        <span style={{ visibility: computed('taskPeriod') }}>任务周期：{moment(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.beginTime).format('YYYY.MM.DD')}-{moment(props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.endTime).format('YYYY.MM.DD')}</span>
        <div onClick={download} className={styles.hover} style={{ float: 'right', display: 'flex', alignItems: 'center', color: '#61698C', fontSize: 14, visibility: computed('lookAttac') }}>
          <div>
            <img src={noticeIconEnclosure} alt='' />
          </div>
          <span>查看附件</span>
        </div>
      </div>
      <div style={{ background: '#F7F8FA', padding: '20px 24px', marginBottom: 30 }}>
        <div dangerouslySetInnerHTML={{ __html: props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskSbj || '-' }} title={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskSbj || '-'} style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 18, lineHeight: '18px', fontWeight: 600 }}>
        </div>
        <div dangerouslySetInnerHTML={{ __html: props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskCntnt || '-' }} title={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.taskCntnt || '-'} style={{ color: '#61698C', padding: '14px 0 0', wordBreak: 'break-all' }}>
        </div>
        {
          props.activeList.replace(/[0-9]/g, '') === 'task' && props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy && (
          <>
            <div style={{ background: '#D1D5E6', width: '100%', height: 1, opacity: 0.4, marginTop: 18 }} />
            <Row type='flex' align='middle' style={{ paddingTop: 18 }}>
              <Col style={{ display: 'flex', alignItems: 'center' }}>
                <img src={STRATEGY} alt='' />
              </Col>
              <Col style={{ alignSelf: 'flex-start' }}>
                <div style={{ width: 6, height: 6, background: '#E81919', borderRadius: '50%' }}></div>
              </Col>
              <Col title={props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy || '-'} style={{ paddingLeft: 10, color: '#959CBA' }}>{props.listData[Number(props.activeList.replace(/[^0-9]/g, ''))]?.strategy || '-'}</Col>
            </Row>
          </>
          )}
      </div>
    </div>
  );
}

export default connect(({ global }) => ({
  // authorities: global.authorities,
  // dictionary: global.dictionary,
  sysParam: global.sysParam,
  // theme: global.theme,
}))(Detail);