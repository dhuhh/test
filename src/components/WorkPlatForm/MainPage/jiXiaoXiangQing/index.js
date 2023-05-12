import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {
  Divider,
  Select,
  Input,
  Button,
  Table,
  Modal,
  Popover,
  Empty,
  Spin,
  message,
  Pagination,
} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import TableBtn from './Export/exportIndex';
import jXiaoImg from '$assets/newProduct/staff/icon_my_jixiao@2x.png';
import questionImg from '$assets/newProduct/customerPortrait/question-mark.png';
import ShowCard from './showCard';
import moment from 'moment';
import ShowCardSimple from './showCard-simple';
import {DecryptBase64} from '../../../Common/Encrypt/index';
import {
  QueryStaffEfficiency, //员工主页绩效查询
  QueryIndexCustDetails, //查询员工指标明细客户
  QueryScoreDetails,
  QueryAssessmentScore, //查询考核得分计算公式
} from '$services/newProduct';

const {Search} = Input;
const {Option} = Select;
const index = ({dictionary}) => {
  const history = useHistory();
  //固定的表格结构
  const fixedColumns = [];
  const modelcolumns = [
    {
      title: '指标',
      dataIndex: 'indexName',
      key: 'indexName',
    },
    {
      title: '计分方式',
      dataIndex: 'scoringMethod',
      key: 'scoringMethod',
      render: (_, {scoringMethod, remark}) => {
        return (
          <>
            <span>{scoringMethod}</span>
            {remark ? (
              <Popover
                placement="bottomLeft"
                trigger="hover"
                overlayClassName={styles.indexDetail}
                arrowPointAtCenter={true}
                content={
                  <div
                    style={{
                      color: '#FFFFFF',
                      background: '#474D64',
                      padding: 16,
                      width: 492,
                      boxSizing: 'border-box',
                      maxHeight: 112,
                      overflowY: 'auto',
                    }}
                  >
                    {remark}
                  </div>
                }
                title={null}
              >
                <img
                  style={{
                    width: 15,
                    marginTop: -2,
                    marginLeft: 2,
                  }}
                  src={questionImg}
                  alt=""
                />
              </Popover>
            ) : null}
          </>
        );
      },
    },
    {
      title: '指标值',
      dataIndex: 'indexValue',
      key: 'indexValue',
    },
    {
      title: '目标值',
      dataIndex: 'targetValue',
      key: 'targetValue',
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
    },
  ];
  /* ------------------------------------useState区域--------------------------------------------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [select, setSelect] = useState(
    history.location.query.thisYear
      ? history.location.query.thisYear
      : moment().format('YYYY'),
  );
  //考核年度
  // const [yearSelectVal, setYearSelectVal] = useState(
  //   history.location.query.thisYear
  //     ? moment(history.location.query.thisYear)
  //     : moment(),
  // );
  //考核年度
  const [borderC, setBorderC] = useState('');//当前选中边框变色
  const [tableLoading, setTableLoading] = useState(false); //表格加载变量
  const [spinLoading, setSpinLoading] = useState(false); //表格加载变量
  const [current, setCurrent] = useState(1); //当前页码
  const [pageSize, setPageSize] = useState(10); //当前页长
  const [total, setTotal] = useState(); //总行数
  const [tableData, setTableData] = useState([]); //表格数据
  const [columns, setColumns] = useState(null); //动态表格结构
  const [xiangqingTableData, setXiangqingTableData] = useState([]); //详情表格数据
  const [xiangQingTableLoading, setXiangQingTableLoading] = useState(false); //详情表格加载变量
  const [isLssued, setIsLssued] = useState('2'); //是否存在下发指标
  const [staffName, setStaffName] = useState('---'); //员工姓名
  const [formula, setFormula] = useState('---'); //计算公式
  const [score, setScore] = useState('---'); //总分
  const [assessment, setAssessment] = useState([]); //考核项数组
  const [indexName, setIndexName] = useState('---'); //指标名称
  const [remark, setRemark] = useState('---'); //指标描述
  const [way, setWay] = useState(0); //指标当前状态
  const [mianCurrent, setMianCurrent] = useState(1); //页码
  const [mianpageSize, setMianpageSize] = useState(10); //页码
  const [mianTotal, setMianTotal] = useState(0); //总数量
  const dateArr = dictionary['TPRFM_YEAR'] || []; //年份字典
  const [usrId, setUsrId] = useState(); //总数量
  const [ZBSearchName, setZBSearchName] = useState(''); //指标搜索项
  /* ----------effect区域-----------*/
  useEffect(() => {
    if (usrId) {
      queryStaffEfficiency({
        annual: select,
        current: mianCurrent,
        pageSize: mianpageSize,
        usrId: usrId,
        way: way,
        indexName: ZBSearchName,
      });
    }
  }, [usrId]);
  //在页面加载的时候判断是否存在查询参数
  useEffect(() => {
    console.log(history.location.pathname);
    if (history.location.pathname.split('/')[3]) {
      const {id = '', year = '', name = ''} = JSON.parse(
        DecryptBase64(history.location.pathname.split('/')[3]),
      );
      if (id) {
        setUsrId(Number(id));
      }
      if (year) {
        //setYearSelectVal(moment(year));
        setSelect(year);
      }
      if (name) {
        setStaffName(name);
      }
    } else {
      setUsrId(JSON.parse(sessionStorage.getItem('user')).id);
      setStaffName(JSON.parse(sessionStorage.getItem('user')).name);
    }
  }, []);

  useEffect(() => {
    if (usrId) {
      queryAssessmentScore({
        annual: select,
        usrId: usrId,
      });
    }
  }, [usrId]);

  useEffect(() => {
    if (usrId) {
      queryAssessmentScore({
        annual: select,
        usrId: usrId,
      });
    }
  }, [select]);
  /* ---------function区域--------- */
  //清除右侧详情数据
  const clearDetails = (all) => {
    if (all) {
      setIndexName('---');
      setRemark('---');
    }
    setTableData([]);
    getColumnList([]);
    setTotal(0);
  };

  const queryAssessmentScore = val => {
    QueryAssessmentScore(val).then(res => {
      let data;
      if (res.records.length) {
        data = res.records[0];
      } else {
        data = {};
      }
      if (Object.keys(data).length > 0 && data.formula) {
        setScore(data.score);
        setFormula(data.formula);
        setIsLssued('1');
      } else {
        setIsLssued('2');
      }
    }).catch(err => message.error(err.note || err.message));
  };
  //控制详情弹窗打开关闭的方法
  const handleOpen = () => {
    setIsModalOpen(true);
    const searchData = {
      paging: 1,
      current: 1,
      pageSize: 10,
      annual: select,
      usrId: usrId,
    };
    queryScoreDetails(searchData);
  };
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  //绩效考核请求方法
  const queryStaffEfficiency = val => {
    setSpinLoading(true);
    QueryStaffEfficiency(val).
      then(res => {
        //渲染之前首先进行去重操作
        let newRecords = filterFunction(res.records, 'indexId');
        setMianTotal(res.total);
        setAssessment(newRecords); //指标数组赋值
        if (newRecords.length) {
          clecked(newRecords[0]); //数组第一项预请求
        } else {
          //如果没有指标，就清空详情
          clearDetails(true);
        }
      }).
      catch(err => message.error(err.note || err.message)).
      finally(() => setSpinLoading(false));
  };
  //去重函数
  const filterFunction = (data, name) => {
    let arr = [...data];
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i][name] === arr[j][name]) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  };

  //员工指标明细（table）请求方法
  const queryIndexCustDetails = val => {
    setSpinLoading(true);
    setTableLoading(true);
    QueryIndexCustDetails(val).then(res => {
      const {records = [], total = 0} = res;
      setTableData(records);
      setTotal(total);
      const columnsObj = {...records[0]};
      delete columnsObj['ID'];
      delete columnsObj['序列号'];
      getColumnList(Object.keys(columnsObj));
    }).catch(err => {
      message.error(err.note || err.message);
      clearDetails(true);
    }).finally(() => {
      setTableLoading(false);
      setSpinLoading(false);
    });
  };
  //得分详情（table）请求方法
  const queryScoreDetails = queryData => {
    setXiangQingTableLoading(true);
    QueryScoreDetails(queryData).then(res => {
      const {records = []} = res;
      setXiangqingTableData(records);
    }).catch(err => {
      message.error(err.note || err.message);
    }).finally(() => {
      setXiangQingTableLoading(false);
    });
  };
  //动态生成列的方法
  const getColumnList = arr => {
    const newCol = arr.map((item, index) => {
      return {
        title: item,
        dataIndex: item,
        key: item,
        width: arr.length - 1 === index ? 'auto' : 210,
        align: 'center',
        fixed: item === '客户姓名' || item === '客户号' ? 'left' : false,
      };
    });
    const newJJ = [...fixedColumns, ...newCol]; //合并动态表格
    setColumns(newJJ); //更新表格格式
  };
  //子组件卡片被点击之后的回调
  const clecked = ({indexId, indexName, remark, importFlag}) => {
    setBorderC(indexId);
    setIndexName(indexName);
    setRemark(remark || '无');
    if (!importFlag) {
      const reqData = {
        indexId: indexId,
        ...getRequestData(),
      };
      queryIndexCustDetails(reqData);
    } else {
      clearDetails(false);
    }
  };
  //表格分页操作的回调
  const handleTableChange = (pagination) => {
    const {current, pageSize} = pagination;
    setCurrent(current);
    setPageSize(pageSize);
    const requestData = {
      paging: 1,
      total: -1,
      current: current,
      pageSize: pageSize,
      indexId: borderC,
      usrId: usrId,
      annual: select,
    };
    queryIndexCustDetails(requestData);
  };
  //详情表格改变的回调
  const xiangqingTableChange = ({current, pageSize}) => {
    const searchData = {
      paging: 1,
      current,
      pageSize,
      annual: select,
      usrId: usrId,
    };
    queryScoreDetails(searchData);
  };
  //生成分页请求参数
  const getRequestData = () => {
    return {
      paging: 1,
      total: -1,
      current: current,
      pageSize: pageSize,
      annual: select,
      usrId: usrId,
    };
  };
  //导出表格结构的方法
  const getColumns = () => {
    return columns;
  };
  //负责给导出组件提供数据的两个方法
  const param = () => {
    return {
      paging: 1,
      total: 1,
      usrId: usrId,
      indexId: borderC,
      annual: select,
      isSelectAll: 1,
    };
  };
  //搜索考核项目回调
  const jixiaoSeatch = val => {
    setZBSearchName(val)
    queryStaffEfficiency({
      annual: select,
      current: mianCurrent,
      pageSize: mianpageSize,
      usrId: usrId,
      way: way,
      indexName: val,
    });
  };
  const ChangeXQSize = val => {
    const Mlength = val.length;
    return Mlength >= 6 ? `${170 / Mlength}px` : '40px';
  };
  /* -------------jsx区域----------- */
  return (
    <>
      <Spin spinning={spinLoading}>
        <div className={styles.basicInfo}>
          <div className={styles.basicInfo_left}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span className={styles.font_color} id="test111">
                考核年度
              </span>
              <Select
                getPopupContainer={triggerNode => triggerNode.parentElement}
                style={{width: '225px'}}
                value={select}
                onChange={(val) => {
                  queryStaffEfficiency({
                    annual: val,
                    current: mianCurrent,
                    pageSize: mianpageSize,
                    usrId: usrId,
                    way: way,
                    indexName: ZBSearchName,
                  });
                  setSelect(val);
                }}>
                {dateArr.map(item => (
                  <Option value={item.note}>{item.note}</Option>
                ))}
              </Select>
            </div>
            <Divider></Divider>
            <div className={styles.basicInfo_left_text}>
              <div style={{paddingBottom: '16px'}}>
                <span className={styles.font_weight_color}>考核员工：</span>
                <span className={styles.font_color}>{staffName || '--'}</span>
              </div>
              {/* {isLssued === '1' ? (
                <div
                  className={styles.font_weight_color}
                  style={{paddingBottom: '20px'}}
                >
                  <span className={styles.font_weight_color}>考核公式：</span>
                  <span className={styles.font_color}>{formula || '--'}</span>
                </div>
              ) : (
                <div
                  className={styles.font_weight_color}
                  style={{paddingBottom: '20px'}}
                >
                  <span className={styles.font_weight_color}>考核情况：</span>
                  <span className={styles.font_color}>年度考核指标未下达</span>
                </div>
              )} */}
            </div>
          </div>
          {/* 如果为2：未下达指标则隐藏 */}
          {/* {isLssued === '1' ? (
            <div className={styles.basicInfo_right}>
              <div className={styles.basicInfo_right_circle}>
                <span
                  className={styles.basicInfo_right_circle_num}
                  style={{
                    fontSize: ChangeXQSize(parseFloat(score).toFixed(2)),
                  }}
                >
                  {score ? parseFloat(score).toFixed(2) : '--'}
                </span>
                <span className={styles.basicInfo_right_circle_text}>
                  考核得分
                </span>
              </div>
              <Button type="link" onClick={handleOpen}>
                查看详情
              </Button>
            </div>
          ) : null} */}
        </div>

        <div className={styles.basicInfo_sec}>
          {/* <div className={styles.basicInfo_sec_top}>
            <Search
              className={styles.mySearchInput}
              placeholder="请输入指标名称"
              onSearch={jixiaoSeatch}
              allowClear
              size="small"
              style={{
                width: 260
              }}
            />
          </div> */}

          <div className={styles.basicInfo_sec_buttom}>
            <div className={styles.basicInfo_sec_buttom_left_out}>
              <div className={styles.basicInfo_sec_buttom_left}>
                <div className={styles.basicInfo_sec_buttom_left_bottom}>
                  <div>
                    <Pagination
                      size="small"
                      total={mianTotal}
                      showSizeChanger
                      //showQuickJumper
                      current={mianCurrent}
                      onShowSizeChange={(current, pageSize) => {
                        setMianCurrent(current);
                        setMianpageSize(pageSize);
                        queryStaffEfficiency({
                          annual: select,
                          current: current,
                          pageSize: pageSize,
                          usrId: usrId,
                          way: way,
                          indexName: ZBSearchName,
                        });
                      }}
                      onChange={(current, pageSize) => {
                        setMianCurrent(current);
                        setMianpageSize(pageSize);
                        queryStaffEfficiency({
                          annual: select,
                          current: current,
                          pageSize: pageSize,
                          usrId: usrId,
                          way: way,
                          indexName: ZBSearchName,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className={styles.basicInfo_sec_top}>
                  <div>
                    <Search
                      value={ZBSearchName}
                      className={styles.mySearchInput}
                      placeholder="请输入"
                      onChange={val => setZBSearchName(val.target.value) }
                      onSearch={jixiaoSeatch}
                      allowClear
                      size="small"
                      style={{
                        width: '205px',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                  <div>
                    <Select
                      defaultValue={0}
                      style={{width: 110, marginLeft: '16px'}}
                      onChange={item => {
                        setAssessment([]);
                        queryStaffEfficiency({
                          annual: select,
                          current: mianCurrent,
                          pageSize: mianpageSize,
                          usrId: usrId,
                          way: item,
                          indexName: ZBSearchName,
                        });
                        setWay(item);
                      }}
                    >
                      <Option value={0}>全部指标</Option>
                      <Option value={1}>考核项</Option>
                      <Option value={2}>非考核项</Option>
                    </Select>
                  </div>
                </div>
                <div
                  style={{
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    width: '100%',
                  }}
                ></div>
                {assessment.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无数据"
                    style={{height: 'auto', paddingTop: '130px'}}
                  />
                ) : (
                  <>
                    {way === 1 ? (
                      <>
                        {' '}
                        <div className={styles.basicInfo_sec_buttom_left_title}>
                          <span
                            style={{
                              marginTop: 1,
                              height: 14,
                              width: 4,
                              background: '#0F8AFF',
                              display: 'inline-block',
                              marginRight: 4,
                            }}
                          ></span>
                          <span
                            style={{
                              fontSize: 16,
                              color: '#1A2243',
                              fontWeight: 'bold',
                            }}
                          >
                            考核项目
                          </span>
                        </div>
                        {assessment.filter(item => item.indexId).map(item => (
                          <ShowCard
                            key={item.indexId}
                            {...item}
                            borderC={borderC}
                            clecked={clecked}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        {way === 2 ? (
                          <div
                            className={styles.basicInfo_sec_buttom_left_title}
                          >
                            <span
                              style={{
                                height: 15,
                                width: 4,
                                background: '#0F8AFF',
                                display: 'inline-block',
                                marginRight: 4,
                              }}
                            ></span>
                            <span
                              style={{
                                fontSize: 16,
                                color: '#1A2243',
                                fontWeight: 'bold',
                              }}
                            >
                              非考核项
                            </span>
                          </div>
                        ) : null}
                        {assessment.map(item => (
                          <ShowCardSimple
                            key={item.indexId}
                            {...item}
                            borderC={borderC}
                            simpleClecked={clecked}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className={styles.basicInfo_sec_buttom_right}>
              <div className={styles.basicInfo_sec_buttom_right_title}>
                <img
                  src={jXiaoImg}
                  alt=""
                  style={{
                    width: 24,
                    marginRight: 2,
                    marginTop: -3,
                  }}
                />
                <span>{indexName}</span>
              </div>
              <Divider
                style={{margin: 0, marginTop: 16, marginBottom: 24}}
              ></Divider>
              <div className={styles.basicInfo_sec_buttom_right_miaoShu}>
                <ul>
                  <li>
                    <span className={styles.inputTitle}>指标名称：</span>
                    <span style={{fontWeight: 400, color: '#61698C'}}>
                      {indexName}
                    </span>
                  </li>
                  <li>
                    <span className={styles.inputTitle}>指标口径：</span>
                    <span style={{fontWeight: 400, color: '#61698C'}}>
                      {remark}
                    </span>
                  </li>
                </ul>
              </div>
              <div className={styles.basicInfo_sec_buttom_right_titles}>
                <div className={styles.basicInfo_sec_buttom_left_title}>
                  <span
                    style={{
                      marginTop: 1,
                      height: 14,
                      width: 4,
                      background: '#0F8AFF',
                      display: 'inline-block',
                      marginRight: 4,
                    }}
                  ></span>
                  <span
                    style={{
                      fontSize: 16,
                      color: '#1A2243',
                      fontWeight: 'bold',
                    }}
                  >
                    明细客户
                  </span>
                </div>
                <TableBtn
                  getColumns={getColumns}
                  param={param}
                  total={total}
                ></TableBtn>
              </div>
              <div className={styles.basicInfo_sec_buttom_right_table}>
                <Table
                  rowClassName={styles.MyrowClassName}
                  loading={tableLoading}
                  scroll={{x: true}}
                  columns={columns}
                  dataSource={tableData}
                  bordered
                  rowKey={record => record['ID']}
                  pagination={{
                    current: current,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `总共${total}条`,
                    pageSize: pageSize,
                    total: total,
                  }}
                  onChange={handleTableChange} //表格操作回调
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Modal
            title={<span style={{color: '#1A2243'}}>考核得分详情</span>}
            footer={null}
            width={800}
            visible={isModalOpen}
            //visible={true}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className={styles.modalTable}>
              <Table
                loading={xiangQingTableLoading}
                columns={modelcolumns}
                dataSource={xiangqingTableData}
                bordered
                size="middle"
                onChange={xiangqingTableChange}
                pagination={{
                  //current: current,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  /*  showTotal: (total, range) => `总共${total}条`,
                  pageSize: pageSize,
                  total: total */
                }}
              />
            </div>
          </Modal>
        </div>
      </Spin>
    </>
  );
};
export default connect(({global}) => ({
  authorities: global.authorities, //获取用户功能权限点
  dictionary: global.dictionary, //字典信息
  userBasicInfo: global.userBasicInfo, //用户基本信息
}))(index);
