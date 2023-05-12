import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Card, Icon, message, Modal, Tooltip, Table, Switch, Spin } from "antd";
import { JoinQuant, GetRecommendCapital } from "$services/customerPanorama";
import { formatColor } from "../../Earning/util";
import styles from "./modal.less";

function ModalInTable(props, ref) {
  const [switchKey, setSwitchKey] = useState(false);
  const [alphaTVisible, setAlphaTVisible] = useState(false);
  const [oldShow, setOldShow] = useState(false);
  const [securityAvgGainsRateOld, setSecurityAvgGainsRateOld] = useState("");
  const [securitySumGainsRateOld, setSecuritySumGainsRateOld] = useState("");
  const [securityAvgGainsRate, setSecurityAvgGainsRate] = useState("");
  const [securitySumGainsRate, setSecuritySumGainsRate] = useState("");
  const [supportFlag, setSupportFlag] = useState(false);
  const [capitalLimit, setCapitalLimit] = useState("");
  const [capitalLimitOld, setCapitalLimitOld] = useState("");
  const [alphatDateListOld, setAlphatDateListOld] = useState([]);
  const [alphatDateList, setAlphatDateList] = useState([]);
  const [alphatLoading, setAlphatLoading] = useState(false);
  const [cusNo, setCusNo] = useState("");
  const [date, setDate] = useState("");

  const changeSwitch = e => {
    setSwitchKey(!switchKey);
    if (e) {
      getJoinQuant();
    } else {
      setOldShow(false);
    }
  };

  useImperativeHandle(ref, () => ({
    open: (cusOn, date) => {
      setDate(date);
      setCusNo(cusOn);
      setAlphatLoading(true);
      setAlphaTVisible(true);
      JoinQuant({
        accountType: "1",
        allFlag: 1,
        customerNo: cusOn,
        date: date,
        timeRange: "3"
      }).then(res => {
        setAlphatLoading(false);
        if (res.data) {
          let {
            positionList,
            securityAvgGainsRate,
            securitySumGainsRate
          } = res.data;
          let newpositionsList = positionList.filter(
            item => item.level !== "notSupport"
          );
          let supportList = [];
          newpositionsList.map(item => {
            let obj = "";
            obj = `${item.jqStockCode},${item.positionNum}`;
            supportList.push(obj);
          });
          setSecurityAvgGainsRate(securityAvgGainsRate);
          setSecuritySumGainsRate(securitySumGainsRate);
          setAlphatDateList(newpositionsList);
          getRecommendCapital(supportList, "new", cusOn);
        }
      });
    }
  }));

  //   const open = ()=>{
  //     setAlphaTVisible(true);
  //     JoinQuant({}).then((res)=>{

  //     })
  //   }

  const computed = (type, ...rest) => {
    if (type === "color") {
      const [val = ""] = rest;
      return formatColor(val);
    }
  };

  const getJoinQuant = () => {
    let codeLists = [];
    let supportList = [];
    alphatDateList.map(item => {
      if (item.level === "good" || item.level === "excellent") {
        codeLists.push(item.jqStockCode);
        let obj = "";
        obj = `${item.jqStockCode},${item.positionNum}`;
        supportList.push(obj);
      }
    });
    if (codeLists.length === 0) {
      message.warning("近期暂无表现优秀、良好的持仓");
      return;
    }

    const aphlatParam = {
      accountType: "1",
      customerNo: cusNo,
      timeRange: "3",
      allFlag: 0,
      date: date,
      codeListStr: codeLists.join(",")
    };
    setAlphatLoading(true);
    getRecommendCapital(supportList, "old");
    JoinQuant(aphlatParam).then(res => {
      let {
        positionList,
        securityAvgGainsRate,
        securitySumGainsRate
      } = res.data;
      setOldShow(true);
      setAlphatLoading(false);
      setSecurityAvgGainsRateOld(securityAvgGainsRate);
      setSecuritySumGainsRateOld(securitySumGainsRate);
      setAlphatDateListOld(positionList);
    });
  };

  const handleCancel = () => {
    setSwitchKey(false);
    setAlphaTVisible(false);
    setOldShow(false);
    setSecurityAvgGainsRateOld("");
    setSecuritySumGainsRateOld("");
    setSecurityAvgGainsRate("");
    setSecuritySumGainsRate("");
    setSupportFlag(false);
    setCapitalLimit("");
    setCapitalLimitOld("");
    setAlphatDateListOld([]);
    setAlphatDateList([]);
    setAlphatLoading(false);
    setCusNo("");
    setDate("");
  };

  const getRecommendCapital = (list, type, cusOn) => {
    if (list.length == 0) return;
    const accountTypeMap = {
      1: "0",
      2: "1",
      3: "2",
      4: "3",
      5: "5", // 基金投顾
      6: "4"
    };
    const CapitalParam = {
      customerNo: cusNo || cusOn,
      tradeAccount: "",
      accountType: accountTypeMap[2],
      positions: list.join("/")
    };

    GetRecommendCapital(CapitalParam)
      .then(res => {
        const { capitalLimit, supportFlag } = res.data;
        setSupportFlag(supportFlag);
        if (type === "old") {
          setCapitalLimitOld(capitalLimit);
        } else {
          setCapitalLimit(capitalLimit);
        }
      })
      .catch(err => message.error(err.note || err.message));
  };

  const alphatColumms = () => {
    return [
      {
        title: "股票代码",
        dataIndex: "jqStockCode"
      },
      {
        title: "股票名称",
        dataIndex: "name"
      },
      {
        title: "股数",
        dataIndex: "positionNum"
      },
      {
        title: "回测结果",
        dataIndex: "level",
        render: text => (
          <div style={{ color: "#244FFF" }}>{changeText(text)}</div>
        )
      }
    ];
  };

  const changeText = e => {
    switch (e) {
      case "normal":
        return <div style={{ color: "#4B516A" }}>一般</div>;
        break;
      case "medium":
        return <div style={{ color: "#4B516A" }}>中等</div>;
        break;
      case "good":
        return <div style={{ color: "#FFA257" }}>良好</div>;
        break;
      case "excellent":
        return <div style={{ color: "#EC3A48" }}>优秀</div>;
        break;
      case "notSupport":
        return <div style={{ color: "#4B516A" }}>不支持</div>;
        break;
      default:
        return <div style={{ color: "#4B516A" }}>{e}</div>;
        break;
    }
  };

  const halfShowTooltip = () => {
    return (
      <div>
        以客户持仓股票与AlphaT标的交集为组合，回测组合最近三个月的累计收益率（计算方式：近三个月通过AlphaT-T0策略交易该组合的扣税费后累计收益/（成交金额/2）*100）
      </div>
    );
  };

  const comShowTooltip = () => {
    return (
      <div>
        以客户持仓股票与AlphaT标的交集为组合，回测组合的年化收益情况（计算方式：通过AlphaT-T0策略交易该组合的近三个月日均收益率*本年交易天数）
      </div>
    );
  };

  const firShowTooltip = () => {
    return (
      <div>
        以客户持仓股票与AlphaT标的交集为组合，组合如果要进行T0实盘，需要的最小资金下限。
      </div>
    );
  };

  return (
    <div>
      <Modal
        title={
          <div style={{ display: "flex" }}>
            <div>AlphaT 持仓回测</div>
            <div className={`${styles.alphatActive} ${styles.alphatText}`}>
              <span>仅回测近期表现优秀的持仓</span>
              <Switch
                style={{ marginLeft: 8 }}
                onChange={e => changeSwitch(e)}
                checked={switchKey}
              ></Switch>
            </div>
          </div>
        }
        className={styles.detailModals}
        centered
        destroyOnClose
        maskClosable={false}
        visible={alphaTVisible}
        onCancel={handleCancel}
        width={"70%"}
        footer={null}
      >
        <Spin spinning={alphatLoading}>
          <Card
            className={`ax-card ${styles.aplhaTcard}`}
            bordered={false}
            bodyStyle={{ padding: "0 0" }}
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#1A2243"
                }}
              >
                <span className="ax-card-title">组合回测收益</span>
              </div>
            }
          >
            <div className={styles.alphaBox}>
              <div
                className={styles.alphaBoxItem}
                style={{ width: supportFlag == "1" ? "33%" : "49%" }}
              >
                <div
                  className={styles.alphaBoxNum}
                  style={{
                    color: computed(
                      "color",
                      oldShow ? securitySumGainsRateOld : securitySumGainsRate
                    )
                  }}
                >
                  {oldShow ? securitySumGainsRateOld : securitySumGainsRate}
                </div>
                <div>
                  最近三个月累计收益
                  <Tooltip
                    placement="bottom"
                    trigger="click"
                    title={halfShowTooltip()}
                  >
                    <Icon
                      style={{ marginLeft: 5, color: "rgb(178 181 191)" }}
                      type="question-circle"
                    />
                  </Tooltip>
                </div>
              </div>
              <div
                className={styles.alphaBoxItem}
                style={{ width: supportFlag == "1" ? "33%" : "49%" }}
              >
                <div
                  className={styles.alphaBoxNum}
                  style={{
                    color: computed(
                      "color",
                      oldShow ? securityAvgGainsRateOld : securityAvgGainsRate
                    )
                  }}
                >
                  {oldShow ? securityAvgGainsRateOld : securityAvgGainsRate}
                </div>
                <div>
                  组合年化收益
                  <Tooltip
                    placement="bottom"
                    trigger="click"
                    title={comShowTooltip()}
                  >
                    <Icon
                      style={{ marginLeft: 5, color: "rgb(178 181 191)" }}
                      type="question-circle"
                    />
                  </Tooltip>
                </div>
              </div>
              {supportFlag == "1" && (
                <div className={styles.alphaBoxItem}>
                  <div style={{ color: "#1A2243", fontSize: 40 }}>
                    {oldShow ? capitalLimitOld : capitalLimit}W
                  </div>
                  <div>
                    实盘预计所需现金
                    <Tooltip
                      placement="bottom"
                      trigger="click"
                      title={firShowTooltip()}
                    >
                      <Icon
                        style={{ marginLeft: 5, color: "rgb(178 181 191)" }}
                        type="question-circle"
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </Card>
          <Card
            className={`ax-card ${styles.aplhaTcard}`}
            bordered={false}
            bodyStyle={{ padding: "0 0" }}
            title={
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#1A2243",
                    paddingTop: "8px"
                  }}
                >
                  <span className="ax-card-title">单票回测结果</span>
                </div>
                <div className={styles.aplhaTcardTip}>
                  回测数据仅供参考，不预示未来表现，不构成对该算法业绩的承诺及保证
                </div>
              </div>
            }
          >
            <Table
              columns={alphatColumms()}
              className={`m-table-customer ${styles.table}`}
              pagination={false}
              scroll={{ y: 350 }}
              dataSource={oldShow ? alphatDateListOld : alphatDateList}
            />
            <div style={{ float: "right", padding: "10px 10px 0 0" }}>
              总共{oldShow ? alphatDateListOld.length : alphatDateList.length}条
            </div>
          </Card>
        </Spin>
      </Modal>
    </div>
  );
}

export default forwardRef(ModalInTable);
