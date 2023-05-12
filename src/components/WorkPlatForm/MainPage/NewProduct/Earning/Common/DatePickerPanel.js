import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
import { formatDw } from '../util';
import styles from './index.less';

export default function(props) {
  const [showDate, setShowDate] = useState(props.state.latestDate);
  const [rangeTotalIncome, setRangeTotalIncome] = useState('0');

  let months = [];
  lodash.get(props.state.earningDateData, 'months', []).forEach(item => {
    item.months.forEach(value => {
      months.push(item.year + value);
    });
  });

  const handleClick = (current) => {
    if (!props.disabledDate(current)) {
      props.onChange(current);
      props.pickerRef.blur();
    } ;
  };

  const handleRangeTotalIncome = useCallback((value) => {
    const func = props.handlePanelChange;
    func(value).then(res => {
      const { records = {} } = res;
      setRangeTotalIncome(lodash.get(records, 'rangeTotalIncome', '0'));
    });
  }, [props.handlePanelChange]);

  useEffect(() => {
    handleRangeTotalIncome(showDate);
  }, [handleRangeTotalIncome, showDate]);

  const handleSuperPrevClick = () => {
    const years = lodash.get(props.state.earningDateData, 'years', []).sort((a, b) => a - b);
    if (!(!years.length || showDate.format('YYYY') <= years[0])) {
      const temp = showDate.clone().subtract(1, 'years');
      setShowDate(temp);
    }
  };
  const handlePrevClick = () => {
    let prevArray = [];
    months.forEach(value => {
      if (Number(value) - Number(showDate.format('YYYYMM')) < 0) {
        prevArray.push(value);
      }
    });
    if (prevArray.length) {
      setShowDate(moment(`${Math.max(...prevArray)}`));
    }
  };
  const handleNextClick = () => {
    let nextArray = [];
    months.forEach(value => {
      if (Number(value) - Number(showDate.format('YYYYMM')) > 0) {
        nextArray.push(value);
      }
    });
    if (nextArray.length) {
      setShowDate(moment(`${Math.min(...nextArray)}`));
    }
  };
  const handleSuperNextClick = () => {
    const years = lodash.get(props.state.earningDateData, 'years', []).sort((a, b) => b - a);
    if (!(!years.length || showDate.format('YYYY') >= years[0])) {
      const temp = showDate.clone().add(1, 'years');
      setShowDate(temp);
    }
  };

  return (
    <div onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }} style={{ width: 363, color: '#1A2243', fontSize: 14 }}>
      <Row type='flex' align='middle' justify='space-between' style={{ height: 54, borderBottom: '1px solid #EAEEF2', padding: '0 30px' }}>
        <Col>
          <span onClick={handleSuperPrevClick} className={`${styles.iconHover} ${(() => {
            const years = lodash.get(props.state.earningDateData, 'years', []).sort((a, b) => a - b);
            if (!years.length || showDate.format('YYYY') <= years[0]) {
              return styles.iconDisabled;
            } else {
              return '';
            }
          })()}`}>{props.superPrevIcon}</span>
          <span onClick={handlePrevClick} className={`${styles.iconHover} ${(() => {
            let prevArray = [];
            months.forEach(value => {
              if (Number(value) - Number(showDate.format('YYYYMM')) < 0) {
                prevArray.push(value);
              }
            });
            if (!prevArray.length) {
              return styles.iconDisabled;
            } else {
              return '';
            }
          })()}`} style={{ marginLeft: 20 }}>{props.prevIcon}</span>
        </Col>
        <Col style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12 }}>
            <span style={{ paddingRight: 6 }}>{showDate.format('YYYY年')}</span>
            <span style={{ paddingLeft: 6 }}>{showDate.format('M月')}</span>
          </div>
          <div style={{ fontSize: 14, color: props.computed('color', rangeTotalIncome) }}>{formatDw(rangeTotalIncome)}</div>
        </Col>
        <Col>
          <span onClick={handleNextClick} className={`${styles.iconHover} ${(() => {
            let nextArray = [];
            months.forEach(value => {
              if (Number(value) - Number(showDate.format('YYYYMM')) > 0) {
                nextArray.push(value);
              }
            });
            if (!nextArray.length) {
              return styles.iconDisabled;
            } else {
              return '';
            }
          })()}`} style={{ marginRight: 20 }}>{props.nextIcon}</span>
          <span onClick={handleSuperNextClick} className={`${styles.iconHover} ${(() => {
            const years = lodash.get(props.state.earningDateData, 'years', []).sort((a, b) => b - a);
            if (!years.length || showDate.format('YYYY') >= years[0]) {
              return styles.iconDisabled;
            } else {
              return '';
            }
          })()}`}>{props.superNextIcon}</span>
        </Col>
      </Row>
      <Row type='flex'>
        <Col className={styles.day}>一</Col>
        <Col className={styles.day}>二</Col>
        <Col className={styles.day}>三</Col>
        <Col className={styles.day}>四</Col>
        <Col className={styles.day}>五</Col>
      </Row>
      <Row type='flex' style={{ flexWrap: 'wrap', paddingBottom: 9 }}>
        { function() {
          let arr = [];
          let current = showDate.clone().startOf('month');
          while (current <= showDate.clone().endOf('month')) {
            if (current.format('d') !== '0' && current.format('d') !== '6') arr.push(current.clone());
            current.add(1, 'days');
          }
          [...(new Array(Number(arr[0].format('d')) - 1)).keys()].forEach(() => {
            arr.unshift(undefined);
          });
          return arr.map((current, index) => {
            if (current) {
              return (
                <Col
                  key={current.format('YYYYMMDD')}
                  style={{ width: '20%', padding: '5px 0' }}
                  onClick={() => handleClick(current)}
                >
                  {props.dateRender(current)}
                </Col>
              );
            } else {
              return (
                <Col
                  key={index}
                  style={{ width: '20%', visibility: 'hidden', padding: '5px 0' }}
                >
                  {props.dateRender(moment())}
                </Col>
              );
            }
          } );
        }()
        }
      </Row>
      { showDate.format('YYYYMM') !== props.state.latestDate.format('YYYYMM') &&
        <div style={{ height: 40, color: '#244FFF', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', borderTop: '1px solid #EAEEF2' }} onClick={() => setShowDate(props.state.latestDate)}>回到最新日期</div>
      }
      {props.renderExtraFooter()}
    </div>
  );
}
