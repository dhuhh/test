

1.组件存放位置      src/components/Eui (暂时放在测试分支  dev-menu-temp/dev-com-eui)

2.组件页面地址      https://crm.axzq.com.cn:8084/#/testPage/eUi  

3.组件页面引用地址  src/pages/testPage/eUi.js

4.组件说明

   Ebutton-------------主要按钮   min-width:112px   高度42px    type='main' :无背景带边框  

                *props : {options:{} ,types='' ,text = '' , onClick , style:{}} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *types: 主要样式带背景色 无border|| types='main'-- 次要样式 无背景色带border （按钮分类）
                *
                *text : 主要按钮 || text （按钮文案）

   Ebutton32-----------主要按钮   min-width:112px   高度32px    type='main' :无背景带边框

                *props : {options:{} ,types='' ,text = '' , onClick , style:{}} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *types: 主要样式带背景色 无border|| types='main'-- 次要样式 无背景色带border （按钮分类）
                *
                *text : 主要按钮 || text （按钮文案）

   EbuttonS------------主要按钮   width:auto    高度32px    无背景带边框

                *props : {options:{}  ,text = '' , onClick , style:{}} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *text : 主要按钮 || text （按钮文案）

   EdatePicker---------单日期选择器

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件

   ErangePicker--------日期范围选择器

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件

   EmonthPicker--------单月选择器

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件

   ErangeMonthPicker---月范围选择器

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件
                *
                *mode='month' 注意一下两点
                *
                *ps:组件选好时间后须在空白地方点击一下下面面板才会消失
                *ps:disabledTime这个属性会失效 mode='month'

   EyearPicker---------月选择器

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件

   Epagination---------分页

                *props : {options:{} ,  onChange } （默认入参）
                *
                *options : 沿用antd自带api （组件默认带有以下属性）
                *
                *size | small小尺寸  默认不是小尺寸

   EselectCheck--------下拉筛选框带checkBox  设置 mode: "multiple"为多选 不带checkBox

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *option.value : 回显到筛选框里面的值
                * 
                *onChang(e) : 把输入的值返回父组件
                *
                *dataList = [{name:"",value:""}]

   EselectCheckAll-----下拉筛选框带checkBox带全选

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *option.value : 回显到筛选框里面的值
                *
                *onChang(e) : 把输入的值返回父组件
                *
                *dataList = [{name:"",value:""}]

   EtreeSelectMul------树形下拉选择器带checkBox  多选

                *props : {options:{} onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *option.value : 回显到筛选框里面的值
                *
                *onChang(e) : 把输入的值返回父组件
                *
                * treeData :数据源及结构 [{name:'',value:'',children:[{name:'',value:''}]}]

   Etable--------------基础表格    斑马样式 内表格不带边框不带checkBox

                *props : {options:{} onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件
   
   EtableCheck---------基础表格    斑马样式 内表格不带边框带checkBox

                const rowSelection = {
                    type: "checkbox",
                    crossPageSelect: true, // checkbox默认开启跨页全选
                    selectAll: selectAll,
                    selectedRowKeys: selectedRowKeys,
                    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {

                    },
                  fixed: true
                };
                <EtableCheck
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  rowKey={"mbYxh"}
                  {...options}
                />

   EtableCheckBorder---基础表格    内表格带边框带checkBox

                const rowSelection = {
                    type: "checkbox",
                    crossPageSelect: true, // checkbox默认开启跨页全选
                    selectAll: selectAll,
                    selectedRowKeys: selectedRowKeys,
                    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {

                    },
                  fixed: true
                };
                <EtableCheck
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={dataSource}
                  rowKey={"mbYxh"}
                  {...options}
                />

   EtableSmall---------基础表格    内表格带下边框

                *props : {options:{} onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件

   Einput--------------文本输入框带Tip提示

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件

   EtextArea-----------文本输入框

                *props : {options:{} ,style:{} , onChange} （默认入参）
                *
                *options : 沿用antd自带api
                *
                *onChang(e) : 把输入的值返回父组件
                *
                *maxLength自定义限制字数个数


