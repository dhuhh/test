import { Modal } from 'antd';

export default {

  namespace: 'commonList',

  state: {
    buttons: [
      {
        key: 'btn1',
        name: '发消息',
        title: '按钮标题1',
        color: 'violet',
        open: (dispatch) => {
          // 打开弹出框时fetch数据
          dispatch({ type: 'commonList/fetchButton1Datas' });
        },
        ok: (values) => {
          console.log(values);// eslint-disable-line
        },
        cancel: () => {
          console.log('点击了取消按钮！');// eslint-disable-line
        },
        forms: {
          showExtends: true, // 展开
          exTends: false, // 是否有展开按钮
          items: [
          ],
        },
      },
      {
        key: 'btn2',
        name: '加入群',
        title: '加入群',
        color: 'blue',
      },
      {
        key: 'btn3',
        name: '定服务',
        title: '定服务',
        color: 'orange',
      },
      {
        key: 'btn4',
        name: '打标签',
        title: '打标签',
        color: 'pink',
      },
      {
        key: 'btn5',
        name: '填写服务记录',
        title: '填写服务记录',
        color: 'violet',
      },
      {
        key: 'btn6',
        name: '查看汇总数据',
        title: '查看汇总数据',
        color: 'blue',
      },
      {
        key: 'btn7',
        name: '导出',
        title: '导出',
        color: 'violet',
      },
    ],
    customers: {
      ds: [
        { id: 1, name: '张三1' },
        { id: 2, name: '张三2' },
        { id: 3, name: '张三3' },
        { id: 4, name: '张三4' },
        { id: 5, name: '张三5' },
        { id: 6, name: '张三6' },
      ],
      columns: [
        { dataIndex: 'id', title: '客户号' },
        { dataIndex: 'name', title: '姓名' },
      ],
      rowKey: 'id',
    },
    forms: {
      showExtends: true, // 展开
      exTends: false, // 是否有展开按钮
      ok: (values) => {
        console.log(values);// eslint-disable-line
      },
      cancel: () => {

      },
      save: () => {
        Modal.info({ content: '保存方案成功！' });
      },
      items: [
        { // 第一行 该数组中每一个对象代表form表单中的一行
          rowGutter: 24, // 该行的间隔
          rowKey: 'rowKey21',
          rowItems: [
            {
              key: '搜索输入框',
              type: 'SearchInput',
              // name: '自定义3',
              span: { sm: 24, md: 12, lg: 6 }, // 所占列的宽度
              itemStyle: {
                labelSpan: 0, // 标签的宽度
                itemSpan: 24, // item的宽度
              },
            },
            {
              key: '自定义1',
              type: 'SelectInput',
              // name: '自定义1',
              span: { sm: 24, md: 12, lg: 6 }, // 所占列的宽度
              itemStyle: {
                labelSpan: 0, // 标签的宽度
                itemSpan: 24, // item的宽度
              },
              initialValue: {
                selectValue: '1', // 下拉框的默认值
                inputValue: '', // 输入框的默认值
              },
              datas: [
                { key: 's1', value: '1', lable: '证券代码', disable: false },
                { key: 's2', value: '2', lable: '客户代码', disable: false },
              ],
            },
            {
              key: '自定义2',
              type: 'BetweenInput',
              labelName: '总资产(万元)',
              // name: '自定义2',
              span: { sm: 12, md: 12, lg: 8 }, // 所占列的宽度
              itemStyle: {
                labelSpan: 0, // 标签的宽度
                itemSpan: 24, // item的宽度
              },
              // rules: {
              // leftRules: { required: true, pattern: number, message: '请输入数字' }, // 左输入框验证规则
              // rightRules: { required: true, pattern: number, message: '请输入数字' }, // 右输入框验证规则
              // },
            },
            {
              key: '查询按钮',
              type: 'Button',
              action: 'Search',
              name: '查询',
              span: { sm: 12, md: 4, lg: 4 }, // 所占列的宽度
              className: 'm-btn-radius m-btn-headColor ant-btn',
            },
          ],
        },
      ],
    },
  },

  subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
      // history.listen(({ pathname }) => {
      //   console.info(333333333333);
      //   console.info(pathname);
      // });
    },
  },

  effects: {
          *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *fetchButton1Datas(_, { call, put }) { // eslint-disable-line
      // 获取button1的表单配置项目
      // const datas = yield call(.......);// 调用call获取表单数据
      const datas = [{ // 该数组中每一个对象代表form表单中的一行
        rowGutter: 12, // 该行的间隔
        rowKey: 'rowKey1',
        rowItems: [{
          key: '输入框',
          type: 'Input',
          rules: [{ required: true, message: '输入框为必填项' }, { max: 4, message: '输入超出长度' }, { pattern: /^[a-z0-9]+$/, message: '输入小写字符' }, { validator(rule, value, callback, source, options) {// eslint-disable-line
            const errors = [];
            // 远程校验，判断客户号是否已经存在，是否规范等等
            // 如果错误，则在errors中添加一条
            if (value) {
              // setTimeout(() => { errors.push(new Error(`${value}已经存在`)); callback(errors); }, 3100);
              callback(errors);
            } else {
              callback(errors);
            }
            // errors.push(new Error(`${value}已经存在`));
          } }], // 校验模式
          name: '输入框',
          placeholder: '请输入XXXX',
          span: { spn: 24 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 4, // 标签的宽度
            itemSpan: 20, // item的宽度
          },
        }],
      },
      { // 该数组中每一个对象代表form表单中的一行
        rowGutter: 12, // 该行的间隔
        rowKey: 'rowKey2',
        rowItems: [{
          key: '下拉单选1',
          type: 'singleSelect',
          initialValue: '1',
          name: '下拉单选1',
          span: { span: 12 }, // 所占列的宽度
          onSelect: (dispatch, value, setFieldsValue) => {
            dispatch({ type: 'commonList/changeButtonForms', payload: { 下拉单选1: value, type: 's1', setFieldsValue } });
          },
          itemStyle: {
            labelSpan: 8, // 标签的宽度
            itemSpan: 16, // item的宽度
          },
          datas: [
            { key: 's1', value: '1', lable: '选项一' },
            { key: 's2', value: '2', lable: '选项二' },
            { key: 's3', value: '3', lable: '选项三' },
            { key: 's4', value: '4', lable: '选项四' },
          ],
        },
        {
          key: '下拉单选2',
          type: 'singleSelect',
          name: '下拉单选2',
          initialValue: '1',
          span: { span: 12 }, // 所占列的宽度
          itemStyle: {
            labelSpan: 8, // 标签的宽度
            itemSpan: 16, // item的宽度
          },
          datas: [
            { key: 's1', value: '1', lable: '选项一' },
          ],
        },
        {
          key: '单选框',
          type: 'radio',
          name: '单选框',
          initialValue: '1',
          span: { span: 24 }, // 所占列的宽度
          onChange: (dispatch, value, setFieldsValue) => {
            const { target: { value: num } } = value;
            dispatch({ type: 'commonList/changeButtonForms', payload: { 单选框: num, type: 's2', setFieldsValue } });
          },
          itemStyle: {
            labelSpan: 4, // 标签的宽度
            itemSpan: 20, // item的宽度
          },
          datas: [
            { key: 's1', value: '1', lable: '隐藏' },
            { key: 's2', value: '2', lable: '显示' },
          ],
        },
        ],
      },
      { // 该数组中每一个对象代表form表单中的一行
        rowGutter: 12, // 该行的间隔
        rowKey: 'rowKey3',
        rowItems: [
          {
            key: '下拉单选',
            type: 'singleSelect',
            name: '下拉单选',
            span: { span: 12 }, // 所占列的宽度
            initialValue: '1',
            itemStyle: {
              labelSpan: 8, // 标签的宽度
              itemSpan: 16, // item的宽度
            },
            datas: [
              { key: 's1', value: '1', lable: '选项一', disable: false },
              { key: 's2', value: '2', lable: '选项二', disable: false },
              { key: 's3', value: '3', lable: '选项三', disable: true },
              { key: 's4', value: '4', lable: '选项四', disable: false },
            ],
          },
          {
            key: '下拉多选',
            type: 'multiSelect',
            name: '下拉多选',
            span: { span: 12 }, // 所占列的宽度
            itemStyle: {
              labelSpan: 8, // 标签的宽度
              itemSpan: 16, // item的宽度
            },
            datas: [
              { key: 's1', value: '1', lable: '选项一', disable: false },
              { key: 's2', value: '2', lable: '选项二', disable: false },
              { key: 's3', value: '3', lable: '选项三', disable: false },
              { key: 's4', value: '4', lable: '选项四', disable: false },
            ],
          }],
      }, {// 第四行
        rowGutter: 12, // 该行的间隔
        rowKey: 'rowKey4',
        rowItems: [
          {
            key: '下拉树单选',
            type: 'singleTreeSelect',
            name: '下拉树单选',
            span: { span: 12 }, // 所占列的宽度
            itemStyle: {
              labelSpan: 8, // 标签的宽度
              itemSpan: 16, // item的宽度
            },
            datas: [{
              label: '父节点1',
              value: '0-0',
              key: '0-0',
              children: [{
                label: '子节点1-1',
                value: '0-0-1',
                key: '0-0-1',
              }, {
                label: '子节点1-2',
                value: '0-0-2',
                key: '0-0-2',
              }],
            }, {
              label: '父节点2',
              value: '0-1',
              key: '0-1',
              children: [{
                label: '子节点2-1',
                value: '0-1-1',
                key: '0-0-1',
              }, {
                label: '子节点2-2',
                value: '0-1-2',
                key: '0-1-2',
              }],
            }],
          },
          {
            key: '下拉树多选',
            type: 'multiTreeSelect',
            name: '下拉树多选',
            span: { span: 12 }, // 所占列的宽度
            itemStyle: {
              labelSpan: 8, // 标签的宽度
              itemSpan: 16, // item的宽度
            },
            datas: [{
              label: '父节点1',
              value: '0-0',
              key: '0-0',
              children: [{
                label: '子节点1-1',
                value: '0-0-1',
                key: '0-0-1',
              }, {
                label: '子节点1-2',
                value: '0-0-2',
                key: '0-0-2',
              }],
            }, {
              label: '父节点2',
              value: '0-1',
              key: '0-1',
              children: [{
                label: '子节点2-1',
                value: '0-1-1',
                key: '0-1-1',
              }, {
                label: '子节点2-2',
                value: '0-1-2',
                key: '0-1-2',
              }],
            }],
          },
        ],
      }];
      yield put({ type: 'saveButton1Datas', payload: { items: datas } });
    },
    *changeButtonForms({ payload }, { call, put }) { // eslint-disable-line
      // button1中的select联动操作
      const { type } = payload;
      if (type === 's1') {
        // 两个select组件的联动
        yield put({ type: 'button1Change', payload });
      } else if (type === 's2') {
        // radio组件联动空值显示和隐藏
        yield put({ type: 'button2Change', payload });
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveButton1Datas(state, { payload }) {
      // 获取botton1中的数据
      const tempState = Object.assign({}, state);
      const { items } = payload;
      tempState.buttons[0].forms.items = items;
      return { ...tempState };
    },
    button1Change(state, { payload }) {
      // botton1中的select联动操作
      const datas = {
        1: [{ key: 's1', value: '1', lable: '选项一' }],
        2: [{ key: 's1', value: '1', lable: '选项二' }],
        3: [{ key: 's1', value: '1', lable: '选项三' }],
        4: [{ key: 's1', value: '1', lable: '选项四' }],
      };
      const tempState = Object.assign({}, state);
      tempState.buttons[0].forms.items[1].rowItems[1].datas = datas[payload['下拉单选1']];
      payload.setFieldsValue({
        下拉单选2: '1',
      });
      return { ...tempState };
    },
    button2Change(state, { payload }) {
      // botton1中的radio联动操作
      const tempState = Object.assign({}, state);
      const { 单选框: type } = payload;
      if (type === '2') {
        tempState.buttons[0].forms.items[2] = { rowGutter: 12, // 该行的间隔
          rowKey: 'rowKey3',
          rowItems: [{
            key: '下拉树单选',
            type: 'singleTreeSelect',
            name: '下拉树单选',
            span: { spn: 16 }, // 所占列的宽度
            itemStyle: {
              labelSpan: 8, // 标签的宽度
              itemSpan: 16, // item的宽度
            },
            datas: [{
              label: '父节点1',
              value: '0-0',
              key: '0-0',
              children: [{
                label: '子节点1-1',
                value: '0-0-1',
                key: '0-0-1',
              }, {
                label: '子节点1-2',
                value: '0-0-2',
                key: '0-0-2',
              }],
            }, {
              label: '父节点2',
              value: '0-1',
              key: '0-1',
              span: { spn: 8 }, // 所占列的宽度
              itemStyle: {
                label: 8, // 标签的宽度
                item: 16, // item的宽度
              },
              children: [{
                label: '子节点2-1',
                value: '0-1-1',
                key: '0-0-1',
              }, {
                label: '子节点2-2',
                value: '0-1-2',
                key: '0-1-2',
              }],
            }],
          }] };
      } else {
        const myarr = tempState.buttons[0].forms.items.filter((s) => {
          if (s.rowKey === 'rowKey3') {
            return false;
          }
          return s;
        });
        tempState.buttons[0].forms.items = myarr;
      }
      return { ...tempState };
    },
  },

};

