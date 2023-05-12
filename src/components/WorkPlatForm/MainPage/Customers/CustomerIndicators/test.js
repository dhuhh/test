const getCustomerLabelData=()=>{
  const res={
    dataItem:{
      state:'on',
      formulaOfCalculation:'计算公式计算公式计算公式',
      descriptionOfCaliber:'客户号、客户姓名、本月日均资产、累计股基',
      sourceOfIndicators:'一站通系统',
      updateTime:'2022.09.13',
      parentLevelIndicator:'1-2',
      
    },
    treeData:[
      {
        label:'一级标签（1）',
        pId:'1-1',
        value:'1-1',
        Mypid:[],
        up:true,
        children:[
          {
            label:'二级标签（1）',
            value:'1-2',
            pId:'1-1',
            Mypid:['1-1'],
            up:true,
            children:[
              {
                label:'三级标签（1）',
                value:'1-3',
                pId:'1-2',
                Mypid:['1-1','1-2'],
                up:true,
                children:[
                  {
                    label:'四级标签结果（1）',
                    Mypid:['1-1','1-2','1-3'],
                    value:'1-4-1',
                    pId:'1-3',
                    up:true
                  },
                  {
                    label:'四级标签结果（2）',
                    Mypid:['1-1','1-2','1-3'],
                    value:'1-4-2',
                    pId:'1-3',
                    up:false
                  },
                  {
                    label:'四级标签结果（3）',
                    Mypid:['1-1','1-2','1-3'],
                    value:'1-4-3',
                    pId:'1-3',
                    up:false
                  },
                  {
                    label:'四级标签结果（4）',
                    Mypid:['1-1','1-2','1-3'],
                    value:'1-4-4',
                    pId:'1-3',
                    up:false
                  },
                  {
                    label:'四级标签结果（5）',
                    Mypid:['1-1','1-2','1-3'],
                    value:'1-4-5',
                    pId:'1-3',
                    up:false
                  },
                  
                ]
              }
            ]
          },
        ]
      },
     
     
    ]
  }
  
  return res
}
export default getCustomerLabelData