import React from 'react'

export default function getdate() {
  let data={
    testData:[
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'1'
      },
      {
        name:'张三2',
        num:'002',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'2'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'3'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'4'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'5'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'6'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'7'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'8'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'9'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'10'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'11'
      },
      {
        name:'张三',
        num:'001',
        date:'2022.6.23',
        daymoney:'500000',
        dayothermoney:'400000',
        key:'12'
      },
    ],
    modalTestData:[
      {
        id:'1',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'2',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'3',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'4',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'5',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'6',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'7',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'8',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'9',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'10',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'11',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
      {
        id:'12',
        zhibiao:'新增有效户',
        jifen:'按指标值折算',
        jifenText:'按指标值折算按指标值折算按指标值折算按指标值折算',
        ceshi1:'20',
        ceshi2:'2000',
        ceshi3:'80'
      },
    ],
    kaoheTest: [
      {
        id: "1",
        mubiao: 100,
        wancheng: 90,
        paiming: 1,
        xishu: 0.8,
        name:'新开有效户1'
      },
      {
        id: "2",
        mubiao: 100,
        wancheng: 80,
        paiming: 2,
        xishu: 0.8,
        name:'新开有效户2'
      },
      {
        id: "3",
        mubiao: 100,
        wancheng: 70,
        paiming: 3,
        xishu: 0.8,
        name:'新开有效户3'
      },
      {
        id: "4",
        mubiao: 100,
        wancheng: 60,
        paiming: 4,
        xishu: 0.8,
        name:'新开有效户4'
      },
      {
        id: "5",
        mubiao: 100,
        wancheng: 50,
        paiming: 5,
        xishu: 0.8,
        name:'新开有效户5'
      },
      {
        id: "6",
        mubiao: 100,
        wancheng: 23,
        paiming: 6,
        xishu: 0.8,
        name:'新开有效户6'
      }
    ],
    queryStaffEfficiency:{
      isLssued:1,
      staffName:'北酱果咩',
      formula:'a+b*3+2+2+2',
      score:'360',
      assessment:[
        {
          remark:'指标描述1',
          indexName:'指标名称1',
          indexValue:70,
          targetValue:100,
          assCoefficient:'0.8',
          departRanking:'1',
          indexId:1,
          indexCode:'1'
        },
        {
          remark:'指标描述2',
          indexName:'指标名称2',
          indexValue:90,
          targetValue:100,
          assCoefficient:'0.9',
          departRanking:'2',
          indexId:2,
          indexCode:'2'
        }
      ]

    },
    queryStaffEfficiency2:{
      isLssued:2,
      staffName:'北酱果咩',
      //formula:'a+b*3+2+2+2',
      //score:'360',
      noAssessment:[
        {
          remark:'指标描述1',
          indexName:'指标名称1',
          indexValue:70,
          targetValue:100,
          assCoefficient:'0.8',
          departRanking:'255',
          indexId:'1',
          indexCode:'1'
        },
        {
          remark:'指标描述2',
          indexName:'指标名称2',
          indexValue:90,
          targetValue:100,
          assCoefficient:'0.9',
          departRanking:'255',
          indexId:'2',
          indexCode:'2'
        }
      ]

    }
  }
  
  return data
}
