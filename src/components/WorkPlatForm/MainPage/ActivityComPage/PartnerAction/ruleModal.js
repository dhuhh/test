import React, { useState } from "react";
import { Modal } from "antd";
import rowor from "$assets/activityComPage/rowor.png";
import ruleleft from "$assets/activityComPage/rule_left.png";
import ruleright from "$assets/activityComPage/rule_right.png";
import canleShow from "$assets/activityComPage/canleShow.png";
import styles from "./index.less";

export default function Embranchment (props) {
  const [modalVisible, setModalVisible] = useState(false);

  // 弹窗
  const showModel = () => {
    setModalVisible(true);
  };

  const ruleList = {
    emNewaccount: [
      {
        name: "计算规则:",
        list: [
          {
            conName: "新增有效户:",
            value:
              "证券端、IB端新增有效户均纳入统计,其中证券端新增有效户数占比不低于90%。证券端新增有效户包括新开有效户和无效户激活。"
          },
          {
            conName: "",
            value:
              "新开有效户标准参照公司CRM标准，以客户代码（客户号）为统计单位，活动期间转为“有效户”的客户。"
          },
          {
            conName: "",
            value:
              "对于活动期间新开机构私募产品户（仅限私募基金（单一客户私募基金）、私募基金（多客户私募基金）、私募投资基金三类），可按1:3折算为新增有效户，登峰组及掘金I组最高可折算年度任务值20%，其他组最高可折算10%"
          },
          {
            conName: "",
            value:
              "无效户激活指活动期间在CRM打上“无效户激活”标签的客户。无效户激活客户数在无效户激活门槛值之内的，每户无效户激活按1:0.5折算为新增有效户，超无效户激活门槛值的，每户无效户激活按1:1折算为新增有效户。"
          },
          {
            conName: "",
            value:
              "商品期货新增有效户标准：活动期间新开户且期货交易10手及以上；金融期货新增有效户标准：活动期间开户成功即算。"
          },
          {
            conName: "",
            value: "数据统计时段：4.10-6.30"
          }
        ]
      }
    ],
    emCustomers: [
      {
        name: "新增中端富裕客户数奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "新增中端富裕客户目标完成率不低于70%。且新增中端富裕客户总数不低于门槛值(雄狮组:200户;猛虎组:120户;猎豹组:60户)。"
          },
          {
            conName: "评奖方法:",
            value:
              "分组评选,按新增中端富裕客户总数进行排名。(雄狮组:6;猛虎组:6;猎豹组:5)。"
          }
        ]
      },
      {
        name: "新增中端富裕客户完成率奖:",
        list: [
          {
            conName: "参评条件:",
            value: "新增中端富裕客户目标完成率不低于100%。"
          },
          {
            conName: "评奖方法:",
            value:
              "分组评选,选出目标完成率最高的分支机构。新增中端富裕客户数奖与新增中端富裕客户完成率奖互斥,如同一分支机构获奖,则以新增中端富裕客户数奖优先排名核发奖励。(每组各1名)"
          }
        ]
      },
      {
        name: "计算规则:",
        list: [
          {
            conName: "",
            value:
              "新增中端富裕客户:证券端、IB期货端新增中端富裕客户均纳入统计,其中证券端新增中端富裕客户占比不低于90%。"
          },
          {
            conName: "",
            value:
              "证券端新增中端富裕客户包括新开中端富裕客户和无效户激活转中端。--新开中端富裕客户指活动期间在我司首次开立A股账户且活动期内在CRM打上“中端富裕客户”标签的客户(当日时点资产≥30万元),同一个客户在公司已有一个以上客户号，再新开的第二个客户号，不纳入统计（机构户和产品户除外）。销户再开户也不纳入统计。--无效户激活指活动期间在CRM打上“无效户激活”客户标签,且同时满足“中端富裕客户”标签的客户(当日时点资产≥30万元)"
          },
          {
            conName: "",
            value:
              "对于活动期间新开私募产品户(仅限私募基金(单一客户私募基金)、私募基金(多客户私募基金)、私募投资基金三类),可按 1:3 折算为新增中端富裕客户数,登峰组及掘金Ⅰ组最高可折算年度任务值的20%,其他组最高可折算此项任务值的10%。"
          },
          {
            conName: "",
            value:
              "IB期货端新增中端富裕客户:活动期间新开期货户，资产净流入≥30万元。"
          },
          {
            conName: "",
            value: "数据统计时段：4.10-6.30"
          }
        ]
      }
    ],
    emSecurities: [
      {
        name: "两融余额增长优胜奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "以独立考核分支机构为单位，活动结束上半年日均两融余额较2022年日均两融余额实现增长。"
          },
          {
            conName: "评奖方法:",
            value:
              "分组排名，对于满足参评条件的分支机构给予专项费用支持，即活动结束上半年两融余额较2022年日均两融余额实现增长的分支机构，按两融日均余额增长规模排名。（雄狮组：7；猛虎组：7；猎豹组：5）"
          }
        ]
      },
      {
        name: "数据来源:",
        list: [
          {
            conName: "",
            value:
              "以2023年1月1日至统计日每个自然日两融余额加总/累计天数，具体以报表系统【融资融券报表-融资融券业务月报-两融日均余额】字段对应的数据为准。"
          }
        ]
      }
    ],
    emProductsales: [
      {
        name: "理财产品销量金额奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "理财产品销售额目标完成率不低于70%,且活动期间日均保有规模不低于2023年3月日均保有规模。（雄狮组：7；猛虎组：7；猎豹组：5）"
          },
          {
            conName: "评奖方法:",
            value: "分组评选，按分支机构理财产品考核口径销售总额进行排名。"
          }
        ]
      },
      {
        name: "理财产品销量完成率奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "理财产品销售目标完成率不低于100%，且6月末时点保有规模不低于2023年3月日均保有规模。雄狮组、猛虎组考核口径销量不低于3亿，猎豹组考核口径销量不低于1亿。（每组各1名）"
          },
          {
            conName: "评奖方法:",
            value:
              "分组评选，选出目标完成率最高的分支机构。理财产品销量金额奖与理财产品销量完成率奖互斥，如同一分支机构获奖，则以理财产品销量金额奖优先排名核发奖励。"
          }
        ]
      },
      {
        name: "理财保有规模增长奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "6月末理财产品保有规模不低于2023年3月日均保有规模。(共10个获奖席位)"
          },
          {
            conName: "评奖方法:",
            value:
              "按分支机构6月末理财产品保有规模较3月日均保有规模的增长金额进行排名。"
          }
        ]
      },
      {
        name: "计算规则:",
        list: [
          {
            conName: "",
            value:
              "纳入销售额、保有规模计算的理财产品包括:公募(货币基金除外)、私募、资管(天利宝除外)、信托、收益凭证(新户专享除外)、安鑫宝(28天期及以上限期,专享系列除外)、基金投顾。"
          },
          {
            conName: "",
            value: "数据统计时段：4.1-6.30。"
          }
        ]
      }
    ],
    emHeadband: [
      {
        name: "基金投顾完成率奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "签约户数目标完成率≥100%，且净增签约有效户数≥400户，保有资产目标完成率≥70%。"
          },
          {
            conName: "评奖方法:",
            value: "按签约户数目标完成率排名。"
          }
        ]
      },
      {
        name: "基金投顾签约户数奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "签约户数目标完成率≥100%，且净增签约有效户数≥1000户，保有资产目标完成率≥70%。"
          },
          {
            conName: "评奖方法:",
            value: "按净增签约有效户数排名。"
          }
        ]
      },
      {
        name: "计算规则:",
        list: [
          {
            conName: "",
            value:
              "净增基金投顾签约有效户数=活动期末签约有效户数-活动期初签约有效户数。"
          },
          {
            conName: "",
            value: "分支机构可重复获得。"
          }
        ]
      }
    ],
    emSigning: [
      {
        name: "V4及以上交易型客户全提佣签约户数奖:",
        list: [
          {
            conName: "参评条件:",
            value: "新增的V4及以上交易型客户全提佣签约目标完成率不低于70%。"
          },
          {
            conName: "评奖方法:",
            value:
              "分组评选，达到参评条件后，按其在活动期内新增的V4及以上交易型客户全提佣签约总户数排名。"
          }
        ]
      },
      {
        name: "计算规则:",
        list: [
          {
            conName: "",
            value:
              "活动期间签约的有效客户，签约后的产品订单需留存至2023年4月30日，若在此日期前解约，则算无效签约。"
          },
          {
            conName: "",
            value:
              "存量签约客户在2022年12月15日0：00之前解约，活动期间重新签约为有效签约，可计入统计范围；存量客户在12月15日0：00之后退订，活动期间重新签约为无效签约，不计入统计范围。"
          },
          {
            conName: "",
            value:
              "签约产品统计范围包括投顾组合、策略工具等支持全提佣签约的产品与量化工具（猎豹、AlphaT和GRT）。"
          },
          {
            conName: "",
            value:
              "同一个客户（以客户号统计）签约一款或多款全提佣（非GRT）产品，仅算作一个客户。"
          },
          {
            conName: "",
            value:
              "如客户签约Alpha T或GRT，则必须产生不低于50万成交量方可计入统计范畴。如过往已签约Alpha T或GRT但2022年成交量不达50万的客户，在本次活动期间内达标，同样作为有效签约计入统计范围。"
          },
          {
            conName: "",
            value:
              "新引入猎豹客户（新开户或者无效户激活，转化为猎豹客户的）作为有效签约计入统计范围。"
          },
          {
            conName: "",
            value:
              "如一个客户为猎豹新引入客户，且同时签约全提佣（非GRT）产品、Alpha T、GRT，且满足相应成交量要求，则可以叠加计算为4户。"
          }
        ]
      }
    ],
    paProductsales: [
      {
        name: "理财产品销售争先奖:",
        list: [
          {
            conName: "评奖方法:",
            value:
              "以营业部为单位评选，理财产品考核口径销售额最先达到1.5亿元的前30家营业部。如果同一天达标且获奖名额不够，则以累计总销售额高者获奖。（共30个获奖席位）"
          }
        ]
      },
      {
        name: "计算规则:",
        list: [
          {
            conName: "",
            value:
              "纳入销售额、保有规模计算的理财产品包括：公募（货币基金除外）、私募、资管（天利宝除外）、信托、收益凭证（新户专享除外）、安鑫宝（28天期及以上期限，专享系列除外）。"
          }
        ]
      }
    ],
    paHeadband: [
      {
        name: "基金投顾净增保有资产奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "参评营业部活动期间净增保有资产≥500万元，且活动期间净增基金投顾签约有效户≥100户。"
          },
          {
            conName: "评奖方法:",
            value: "以营业部为单位评选，按活动期间净增保有资产排名。"
          }
        ]
      }
    ],
    paAsset: [
      {
        name: "资产引入奖:",
        list: [
          {
            conName: "参评条件:",
            value:
              "常规资产（不含限售解禁）净流入大于等于1亿元。常规资产包含普通账户资产、信用账户净资产及期权账户资产，不含限售客户资产、新三板市值及信用账户负债。如在活动期间限售股解禁，则该限售股不计入常规资产净流入金额。"
          },
          {
            conName: "评奖方法:",
            value:
              "以营业部为单位评选，达到参评条件后按常规资产净流入由高到低进行排名。奖励名额30名"
          }
        ]
      }
    ],
    peNewaccount: [
      {
        name: "新开有效户TOP50精英奖:",
        list: [
          {
            conName: "参评条件:",
            value: "活动期间内（4.10-6.30）新开有效户数不低于30户，前50席获奖。"
          },
          {
            conName: "评奖方法:",
            value:
              "按新开有效户数排名，如开户数相同，则按证券端新开有效户日均资产排序；新开有效户标准参照公司CRM标准，以客户代码（客户号）为统计单位，活动期间转为“有效户”的客户。"
          }
        ]
      }
    ],
    peProductsales: [
      {
        name: "理财产品销售TOP50精英奖:",
        list: [
          {
            conName: "",
            value: "按活动期间理财产品考核口径销售额排名。"
          },
          {
            conName: "备注:",
            value:
              "员工需及时在“安信财富管家”预约或认领重点权益产品的销量，否则无法统计业绩（客户通过员工转发的财富管家产品链接下单，将自动认领至员工名下，无需再预约或认领）。"
          }
        ]
      }
    ],
    peHeadband: [
      {
        name: "基金投顾签约TOP50精英奖:",
        list: [
          {
            conName: "",
            value:
              "按首次签约R4（偏股积极、偏股进取）组合的客户数进行排名，客户数不少于30户且持有至活动期末，如签约数相同，则按签约R4资产规模排序。"
          }
        ]
      }
    ],
  };

  const showRule = () => {
    return (
      <div style={{ zIndex: "10" }}>
        {ruleList[props.keys.keys].map((item, index) => (
          <div className={styles.rule_content}>
            <div className={styles.rule_content_title}>{item.name}</div>
            <div>
              {item.list.map((t, i) => (
                <>
                  <div className={styles.rule_content_txt}>
                    <span className={styles.rule_content_ind}>{i + 1} </span>
                    <span>{t.conName}</span>
                    <span className={styles.rule_content_lin}>{t.value}</span>
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <React.Fragment
      key={props.keys.keys}
    >
      <div onClick={() => { showModel();}} className={`${styles.listTab}  ${styles.ruleTab}`}>
        <span style={{ color: "#635E5E" }}>活动规则</span>
        <img src={rowor} alt="" />
      </div>
      <Modal
        key={"showEmbranch"}
        visible={modalVisible}
        title={null}
        footer={null}
        onCancel={() => {
          setModalVisible(false);
        }}
        keyboard={true}
        closable={false}
        style={{ top: 200 }}
        width={700}
        className={styles.rule_modal}
        bodyStyle={{
          padding: 0,
          height: 548,
          border: "none",
          borderRadius: 13,
        }}
      >
        <div className={styles.rule_head}>
          <span className={styles.rule_head_tip_left}></span>
          <span>活动规则</span>
          <span className={styles.rule_head_tip_right}></span>
        </div>
        <img src={ruleleft} alt="" className={styles.ruleleft} />
        <img src={canleShow} alt="" className={styles.canleshow} onClick={() => { setModalVisible(false);}}/>
        <div className={styles.rule_first}>
          <div className={styles.rule_sec}>
            <div className={styles.rule_thr}>{showRule()} </div>
          </div>
        </div>
        <img src={ruleright} alt="" className={styles.ruleright} />
      </Modal>
    </React.Fragment>
  );
}
