import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useCallback } from 'react';
import { Pagination, Table, Modal, message, Tabs } from "antd";
import lodash from 'lodash';
import FilterDropdown from './FilterDropdown';
import { formatColor, clickSensors, formatThousands, formatDw } from '../Earning/util';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import { FindPostionNameAndCode } from '$services/newProduct/customerPortrait';
import { QueryStrategyDetail } from '$services/newProduct';
import Iframe from "react-iframe";
import arrow_down from '$assets/newProduct/arrow_down.svg';
import arrow_up from '$assets/newProduct/arrow_up.svg';
import styles from './index.less';
import { history as router } from 'umi';
const { TabPane } = Tabs;

export default forwardRef((props, ref) => {
  const [showDataSource, setShowDataSource] = useState(props.dataSource || []); // 表格显示的数据
  const [expandRows, setExpandRows] = useState([]); // 展开的表格行索引
  const [symbolDataSource, setSymbolDataSource] = useState([]); // 自定义筛选菜单数据
  const [visible, setVisible] = useState(false); // 策略明细弹窗显隐
  const filterRef = useRef(null);

  const [detailDataSource,setDetailDataSource] = useState([]);
  const [detailTotal,setDetailTotal] = useState(0);
  const [detailCurrent,setDetailCurrent] = useState(1);
  const [detailPageSize,setDetailPageSize] = useState(10);
  const [detailLoading,setDetailLoading] = useState(false);
  const [strategyCode,setStrategyCode] = useState('');
  const [proVisible , setProVisible ] = useState(false);//适用产品弹窗
  const [src, setSrc] = useState("");

  const [chlidrenList , setChlidrenList] = useState([]);
  const { authorities = {} } = props;
  const { productChance = [] } = authorities;
  

  useEffect(() => {
    setExpandRows([]);
    setShowDataSource(props.dataSource);
  }, [props.dataSource]);

  const computed = (type, ...rest) => {
    if (type === 'color') {
      const [val = ''] = rest;
      return formatColor(val);
    }
  };
  useEffect(()=>{
    if(visible){
      queryStrategyDetail();
    }
  },[detailCurrent,detailPageSize,strategyCode,visible]);
  const strategyDetail = (productCode)=>{
    setVisible(true);
    setStrategyCode(productCode);
  };
  const queryStrategyDetail = ()=>{
    setDetailLoading(true);
    QueryStrategyDetail({
      cusNo: props.customerCode,
      dateTime: props.positionDate.format('YYYYMMDD'),
      strategyCode: strategyCode,
      // cusNo: '105056395',
      // dateTime: '20211216',
      // strategyCode: '270943433680887808',
      pageSize: detailPageSize,
      current: detailCurrent,
    }).then(res=>{
      let { total,records } = res;
      const { transitPositionsValue = '',transitPositionsRatio = '',cashPositionsValue = '',cashPositionsRatio = '' } = records[0] || {};
      if((transitPositionsValue !== '' || transitPositionsRatio !== '') && (cashPositionsValue !== '' || cashPositionsRatio !== '') || detailTotal > total){
        total = total + 2;
        if(detailPageSize * detailCurrent > total){
          records.push({ proName: '在途资产',positionsValue: transitPositionsValue,positionsRatio: transitPositionsRatio },{ proName: '现金资产',positionsValue: cashPositionsValue,positionsRatio: cashPositionsRatio });
          console.log(records);
        }
      }else if(transitPositionsValue !== '' || transitPositionsRatio !== '' || detailTotal > total){
        total = total + 1;
        if(detailPageSize * detailCurrent > total){
          records.push({ proName: '在途资产',positionsValue: transitPositionsValue,positionsRatio: transitPositionsRatio });
        }
      }else if(cashPositionsValue !== '' || cashPositionsRatio !== '' || detailTotal > total){
        total = total + 1;
        if(detailPageSize * detailCurrent > total){
          records.push({ proName: '现金资产',positionsValue: cashPositionsValue,positionsRatio: cashPositionsRatio });
        }
      }
      setDetailDataSource(records);
      setDetailTotal(total);
      setDetailLoading(false);
    }).catch(err => 
      message.error(err.note || err.message)
    );
  };
  const detailColumms = ()=>{
    return [
      {
        title: '名称',
        dataIndex: 'proName',
        // render: text => <div style={{ color: '#244FFF' }}>{text}</div>,
      },
      {
        title: '代码',
        dataIndex: 'proCode',
      },
      {
        title: '持仓市值',
        dataIndex: 'positionsValue',
      },
      {
        title: '持仓占比',
        dataIndex: 'positionsRatio',
      },
      {
        title: '份额',
        dataIndex: 'share',
      },
      {
        title: '净值',
        dataIndex: 'netWorth',
      },
      {
        title: '成本',
        dataIndex: 'cost',
      },
      // {
      //   title: '盈亏额',
      //   dataIndex: 'profitAndloss',
      //   render: text => <div style={{ color: computed('color', text) }}>{text}</div>,
      // },
      // {
      //   title: '盈亏率',
      //   dataIndex: 'profitAndlossrate',
      //   render: text => <div style={{ color: computed('color', text) }}>{text}</div>,
      // },
    ];
  };
  const proColumms = ()=>{
    return [
      {
        title: "序号",
        dataIndex: "key",
        width: 70,
        align: "center",
      },
      {
        title: "产品名称",
        dataIndex: "productNameAl",
      },
    ];
  };

  // 筛选显隐
  const handleFilterDropdownVisibleChange = useCallback((visible) => {
    if (visible) {
      filterRef.current.setLoading(true);
      const { dateType } = props;
      if (dateType === '1') {
        const accountTypeMap = {
          1: '0',
          2: '1',
          3: '2',
          4: '3',
          5: '5', // 基金投顾
          6: '4',
        };
        FindPostionNameAndCode({ loginAccount: props.customerCode, accountType: accountTypeMap[props.activeAccount], beginDate: props.positionDate.format('YYYYMMDD') }).then(res => {
          const { records = [] } = res;
          setSymbolDataSource(records.map((item, index) => ({ code: item.productCode || '--', name: item.productName || '--' })));
          filterRef.current.setLoading(false);
        });
      } else {
        const { fetchData } = props;
        fetchData({ queryType: '1', paging: 0 }).then(res => {
          let result = res.records.funds || res.records.stocks;
          result = result.map(item => ({ code: item.secu_code, name: item.prd_name }));
          setSymbolDataSource(result);
          filterRef.current.setLoading(false);
        });
      }
    }
  }, [props]);
  
  // 行展开关闭
  const handleExpandRow = useCallback((index, opens) => {
    let expandRowsClone = lodash.cloneDeep(expandRows);
    let showDataSourceClone = lodash.cloneDeep(showDataSource);
    if (expandRowsClone.includes(index)) {
      expandRowsClone.splice(expandRowsClone.findIndex(value => value === index), 1);
      showDataSourceClone.splice(index + 1, opens.length);
    } else {
      expandRowsClone.push(index);
      showDataSourceClone.splice(index + 1, 0, ...opens);
    }
    setExpandRows(expandRowsClone);
    setShowDataSource(showDataSourceClone);
  }, [expandRows, showDataSource]);



  const productChange = (t)=>{

    if (t.clgj !== ''){
      const { sysParam } = props;
      const serverName =
      sysParam
        .find(i => i.csmc === "system.c4ym.url")
        ?.csz.replace("8081", "8084") || "";
      let name = `${serverName}/hqgjs/hqgj?code=${t.productCode}&stockName=${t.productName}&isCRM=1`;
      setSrc(name);
    } else{
      setSrc('');
    }


    newClickSensors({
      third_module: "持仓",
      ax_button_name: "适用产品点击次数",
    }); 

    let pp = t.product;
    let kk = [] ;

    pp.map(t=>{
      let op = {};
      if(t !== ''){
        op.productNameAl = t;
        kk.push(op);
      }
    });
    setChlidrenList(kk);
    setProVisible(true);
  };

  const showText = (t) =>{
    if(t){
      let name = [];
      t.map(x=>{
        if(x !== ''){
          name.push(x);
        }
      });
      return name.join(',');
    }
  };

  const getColumns = useCallback((activeAccount = props.activeAccount, dateType = props.dateType) => {
    const accountMap = {
      0: '全部',
      1: '普通',
      2: '信用',
      3: '理财',
      4: '期权',
      default: '',
    };
    // const { activeAccount, dateType } = props;
    let columns = [];
    if (dateType === '1') {
      if (activeAccount === '1') {
        columns = [
          {
            title: "名称",
            dataIndex: "productName",
            filterDropdown: ({ confirm }) => (
              <FilterDropdown
                ref={filterRef}
                confirm={confirm}
                symbolDataSource={symbolDataSource}
                fetchData={props.fetchData}
                activeAccount={props.activeAccount}
                dateType={props.dateType}
                setTotal={props.setTotal}
                setDataSource={props.setDataSource}
                joinDate={props.joinDate}
              />
            ),
            onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
            filtered: ref.current?.selectRowKeys?.length,
            // render: text => <div style={{ color: '#244FFF' }}>{text}</div>,
          },
          {
            title: "代码",
            dataIndex: "productCode",
          },
          {
            title: "账户类型",
            dataIndex: "accountType",
            render: text => accountMap[text || "default"] || text || "",
          },
          {
            title: "持仓数量",
            dataIndex: "postionNum",
          },
          {
            title: "持仓市值",
            dataIndex: "positionValue",
          },
          {
            title: "成本",
            dataIndex: "cost",
          },
          {
            title: "盈亏额",
            dataIndex: "profitAndloss",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
          {
            title: "盈亏率",
            dataIndex: "profitAndlossrate",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
        ];
      } else if (activeAccount === '2' || activeAccount === '3') {
        columns = [
          {
            title: "名称",
            dataIndex: "productName",
            filterDropdown: ({ confirm }) => (
              <FilterDropdown
                ref={filterRef}
                confirm={confirm}
                symbolDataSource={symbolDataSource}
                fetchData={props.fetchData}
                activeAccount={props.activeAccount}
                dateType={props.dateType}
                setTotal={props.setTotal}
                setDataSource={props.setDataSource}
                joinDate={props.joinDate}
              />
            ),
            onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
            filtered: ref.current?.selectRowKeys?.length,
            // render: text => <div style={{ color: '#244FFF' }}>{text}</div>,
          },
          // 持仓类型是持仓且账户类型是普通
          props.activePositionType === "1" && activeAccount === "2"
            ? {
              title: "近期适用产品",
              dataIndex: "product",
              width: 240,
              render: (text, t) =>
                showText(text) ? (
                  <div
                    onClick={() => {
                      productChange(t);
                    }}
                    style={{ color: "#244FFF", cursor: "pointer" }}
                  >
                    {showText(text)}
                  </div>
                ) : (
                  "/"
                ),
            }
            : {
              width: 0,
              className: `${styles.tables}`,
            },
          {
            title: "代码",
            dataIndex: "productCode",
          },
          {
            title: "持仓数量",
            dataIndex: "postionNum",
          },
          {
            title: "现价",
            dataIndex: "presentPrice",
          },
          {
            title: "成本价",
            dataIndex: "postionCost",
          },
          {
            title: "持仓市值",
            dataIndex: "positionValue",
          },
          {
            title: "成本",
            dataIndex: "cost",
          },
          {
            title: "盈亏额",
            dataIndex: "profitAndloss",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
          {
            title: "盈亏率",
            dataIndex: "profitAndlossrate",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
        ];
      } else if (activeAccount === '4') {
        columns = [
          {
            title: "名称",
            dataIndex: "productName",
            filterDropdown: ({ confirm }) => (
              <FilterDropdown
                ref={filterRef}
                confirm={confirm}
                symbolDataSource={symbolDataSource}
                fetchData={props.fetchData}
                activeAccount={props.activeAccount}
                dateType={props.dateType}
                setTotal={props.setTotal}
                setDataSource={props.setDataSource}
                joinDate={props.joinDate}
              />
            ),
            onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
            filtered: ref.current?.selectRowKeys?.length,
            // render: text => <div style={{ color: '#244FFF' }}>{text}</div>,
          },
          {
            title: "代码",
            dataIndex: "productCode",
          },
          {
            title: "持仓市值",
            dataIndex: "positionValue",
          },
          {
            title: "份额",
            dataIndex: "shareMonth",
          },
          {
            title: "净值",
            dataIndex: "profit",
          },
          {
            title: "成本",
            dataIndex: "cost",
          },
          {
            title: "盈亏额",
            dataIndex: "profitAndloss",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
          {
            title: "盈亏率",
            dataIndex: "profitAndlossrate",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
        ];
      } else if (activeAccount === '5') {
        columns = [
          {
            title: "策略名称",
            dataIndex: "productName",
            filterDropdown: ({ confirm }) => (
              <FilterDropdown
                ref={filterRef}
                confirm={confirm}
                symbolDataSource={symbolDataSource}
                fetchData={props.fetchData}
                activeAccount={props.activeAccount}
                dateType={props.dateType}
                setTotal={props.setTotal}
                setDataSource={props.setDataSource}
                joinDate={props.joinDate}
              />
            ),
            onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
            filtered: ref.current?.selectRowKeys?.length,
            // render: text => <div style={{ color: '#244FFF' }}>{text}</div>,
          },
          {
            title: "策略代码",
            dataIndex: "productCode",
          },
          {
            title: "市值",
            dataIndex: "marketValue",
          },
          {
            title: "盈亏额",
            dataIndex: "profitAndloss",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
          {
            title: "盈亏率",
            dataIndex: "profitAndlossrate",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
          {
            title: "策略配置",
            dataIndex: "策略配置",
            render: (text, record) => (
              <div
                style={{ color: "#244fff", cursor: "pointer" }}
                onClick={() => strategyDetail(record.productCode)}
              >
                查看明细
              </div>
            ),
          },
        ];
      } else if (activeAccount === '6') {
        columns = [
          {
            title: "合约名称",
            dataIndex: "productName",
            filterDropdown: ({ confirm }) => (
              <FilterDropdown
                ref={filterRef}
                confirm={confirm}
                symbolDataSource={symbolDataSource}
                fetchData={props.fetchData}
                activeAccount={props.activeAccount}
                dateType={props.dateType}
                setTotal={props.setTotal}
                setDataSource={props.setDataSource}
                joinDate={props.joinDate}
              />
            ),
            onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
            filtered: ref.current?.selectRowKeys?.length,
            // render: text => <div style={{ color: '#244FFF' }}>{text}</div>,
          },
          {
            title: "代码",
            dataIndex: "productCode",
          },
          {
            title: "合约类型",
            dataIndex: "accountType",
          },
          {
            title: "持仓方向",
            dataIndex: "positionDirection",
          },
          {
            title: "持仓市值",
            dataIndex: "positionValue",
          },
          {
            title: "持仓数量",
            dataIndex: "postionNum",
          },
          {
            title: "成本",
            dataIndex: "cost",
          },
          {
            title: "盈亏额",
            dataIndex: "profitAndloss",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
          {
            title: "盈亏率",
            dataIndex: "profitAndlossrate",
            render: text => (
              <div style={{ color: computed("color", text) }}>{text}</div>
            ),
          },
        ];
      }
    } else {
      columns = [
        {
          title: `${activeAccount === "4" ? "基金" : "股票"}名称`,
          dataIndex: "prd_name",
          filterDropdown: ({ confirm }) => (
            <FilterDropdown
              ref={filterRef}
              confirm={confirm}
              symbolDataSource={symbolDataSource}
              fetchData={props.fetchData}
              setCurrent={props.setCurrent}
              activeAccount={props.activeAccount}
              dateType={props.dateType}
              setTotal={props.setTotal}
              setDataSource={props.setDataSource}
              joinDate={props.joinDate}
            />
          ),
          onFilterDropdownVisibleChange: handleFilterDropdownVisibleChange,
          filtered: ref.current?.selectRowKeys?.length,
          render: (text, record, index) => {
            if (text) {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    onClick={() => {
                      clickSensors(record.prd_name);
                      router.push({
                        pathname: `/newProduct/position/profitDetail/${props.customerCode}`,
                        state: {
                          record,
                          date: props.date,
                          activeAccount: props.activeAccount,
                          latestDate: props.latestDate,
                        },
                      });
                    }}
                    style={{ color: "#244FFF", cursor: "pointer" }}
                  >
                    {text}
                  </div>
                  {record.is_short ||
                  lodash.get(record, "opens[0].is_short", 0) ? (
                      <div
                        style={{
                          width: 38,
                          height: 22,
                          background: "rgba(255, 110, 48, 0.04)",
                          border: "1px solid #FFBFA3",
                          borderRadius: 3,
                          marginLeft: 8,
                          cursor: "default",
                          fontSize: 12,
                          color: "#FF6E30",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                      融券
                      </div>
                    ) : (
                      ""
                    )}
                  {props.merge && (
                    <div
                      onClick={
                        record.open_times > 1
                          ? () => handleExpandRow(index, record.opens)
                          : () => ""
                      }
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: 8,
                        padding: "0 8px",
                        height: 22,
                        border: "1px solid #B0B5CC",
                        borderRadius: 3,
                        cursor: "pointer",
                        fontSize: 12,
                        userSelect: "none",
                      }}
                    >
                      <div>建仓{record.open_times || 0}次</div>
                      {record.open_times > 1 && (
                        <div style={{ marginLeft: 8 }}>
                          <img
                            src={
                              expandRows.includes(index) ? arrow_up : arrow_down
                            }
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            } else {
              return "";
            }
          },
        },
        {
          title: `${activeAccount === "4" ? "基金" : "股票"}代码`,
          dataIndex: "secu_code",
        },
        {
          title: "清仓时间",
          dataIndex: "close_date",
          render: (text, record) => {
            if (props.merge && record.open_times <= 1) {
              return lodash.get(record, "opens[0].is_hold", 0) === 1
                ? "持仓中"
                : lodash.get(record, "opens[0].close_date", "");
            } else {
              return record.is_hold === 1 ? "持仓中" : text;
            }
          },
        },
        {
          title: "持有天数",
          dataIndex: "holding_days",
          render: (text, record) => {
            if (props.merge && record.open_times <= 1) {
              return lodash.get(record, "opens[0].holding_days", "");
            } else {
              return text;
            }
          },
        },
        {
          title: "买入均价",
          dataIndex: "avg_buy_price",
          render: text =>
            text === -1
              ? "--"
              : formatThousands(
                (Math.round(Number(text) * 1000) / 1000).toFixed(3),
                3
              ),
        },
        {
          title: "卖出均价",
          dataIndex: "avg_sell_price",
          render: text =>
            text === -1
              ? "--"
              : formatThousands(
                (Math.round(Number(text) * 1000) / 1000).toFixed(3),
                3
              ),
        },
        {
          title: "收益金额",
          dataIndex: "return",
          render: text => (
            <div style={{ color: computed("color", text) }}>
              {formatDw(text)}
            </div>
          ),
        },
        {
          title: "收益率",
          dataIndex: "mwrr",
          render: (text, record) => {
            if (props.merge && record.open_times <= 1) {
              return (
                <div
                  style={{
                    color: computed(
                      "color",
                      lodash.get(record, "opens[0].mwrr", "0")
                    ),
                  }}
                >
                  {lodash.get(record, "opens[0].mwrr", "")
                    ? `${(
                      Math.round(
                        Number(lodash.get(record, "opens[0].mwrr", "0")) * 100
                      ) / 100
                    ).toFixed(2)}%`
                    : ""}
                </div>
              );
            } else {
              return (
                <div style={{ color: computed("color", text) }}>
                  {text
                    ? `${(Math.round(Number(text) * 10000) / 100).toFixed(2)}%`
                    : ""}
                </div>
              );
            }
          },
        },
      ];
    }
    return columns;
  }, [props, handleFilterDropdownVisibleChange, ref, symbolDataSource, expandRows, handleExpandRow]);

  useImperativeHandle(
    ref,
    () => {
      return {
        selectRowKeys: filterRef?.current?.selectRowKeys || [],
        reset: filterRef?.current?.reset || (() => {}),
        getColumns,
      };
    },
    [getColumns],
  );

  // 分页
  const handlePageChange = (current, pageSize) => {
    const { setCurrent, setPageSize } = props;
    setCurrent(current); setPageSize(pageSize);
  };
  const onChanges = (key) =>{
    if(key === '1'){
      newClickSensors({
        third_module: "持仓",
        ax_button_name: "决策信号列表",
      });
    }
  };
  const { current = 1, pageSize = 10, total = 0 } = props;

  return (
    <React.Fragment>
      <Table
        columns={getColumns()}
        className={`m-table-customer ${styles.table}`}
        pagination={false}
        dataSource={showDataSource.map((item, index) => ({
          ...item,
          key: index,
        }))}
        onRow={(record, index) => ({
          className:
            props.dateType === "1" || record.prd_name ? "" : styles.expandRows,
        })}
      />
      <Pagination
        style={{ float: "right", margin: "20px 0" }}
        size="small"
        showLessItems
        showQuickJumper
        showSizeChanger
        className={`${styles.pagination}`}
        pageSizeOptions={["10", "20", "40", "100"]}
        showTotal={total => (
          <div style={{ fontSize: 12 }}>{`总共${total}条`}</div>
        )}
        pageSize={pageSize}
        current={current}
        total={total}
        onChange={handlePageChange}
        onShowSizeChange={(current, pageSize) => handlePageChange(1, pageSize)}
      />
      <Modal
        title="策略配置"
        className={styles.detailModal}
        centered
        destroyOnClose
        maskClosable={false}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setDetailCurrent(1);
          setDetailPageSize(10);
          setDetailTotal(0);
        }}
        width="1000px"
        footer={null}
      >
        <Table
          columns={detailColumms()}
          className={`m-table-customer ${styles.table}`}
          pagination={false}
          dataSource={detailDataSource.map((item, index) => ({
            ...item,
            key: index,
          }))}
          loading={detailLoading}
        />
        <Pagination
          style={{ textAlign: "right", marginTop: 16 }}
          size="small"
          showLessItems
          showQuickJumper
          showSizeChanger
          className={`${styles.pagination}`}
          pageSizeOptions={["10", "20", "40", "100"]}
          showTotal={() => (
            <div style={{ fontSize: 12 }}>{`总共${detailTotal}条`}</div>
          )}
          pageSize={detailPageSize}
          current={detailCurrent}
          total={detailTotal}
          onChange={(current, pageSize) => {
            setDetailCurrent(current);
            setDetailPageSize(pageSize);
          }}
          onShowSizeChange={(current, pageSize) => {
            setDetailPageSize(pageSize);
            setDetailCurrent(1);
          }}
        />
      </Modal>
      <Modal
        title=""
        className={styles.detailModal}
        centered
        destroyOnClose
        maskClosable={false}
        visible={proVisible}
        onCancel={() => {
          setProVisible(false);
        }}
        width="50%"
        footer={null}
      >
        <Tabs onChange={onChanges}>
          <TabPane tab="近期适用产品" key="0">
            <Table
              columns={proColumms()}
              className={`${styles.eTableSmallss}`}
              pagination={false}
              bordered={true}
              dataSource={chlidrenList.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
            />
          </TabPane>
          {productChance.includes("aclToolAuth") && src !== "" && (
            <TabPane tab="个股决策信号" key="1">
              <Iframe height="600" width="100%" frameBorder="0" src={src} />
            </TabPane>
          )}
        </Tabs>
      </Modal>
    </React.Fragment>
  );
});

