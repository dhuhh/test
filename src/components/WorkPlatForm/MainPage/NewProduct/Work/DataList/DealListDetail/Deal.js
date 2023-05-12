
import React ,{ useState , useEffect , useCallback } from 'react' ;
import { Button,Input, Row,Col, Form ,Select, Upload, message, Spin ,Modal  } from 'antd';
import BasicDataTable from '$common/BasicDataTable';
import { QueryRelEventList ,SaveEventTreatment } from '$services/ecifEvent';
import ecifUpload from '../../../../../../../assets/ecifUpload.png'
import { getQueryDictionary } from '$services/searchProcess';
import { history as router } from 'umi';
import lodash from 'lodash';
import config from '$utils/config';
import styles from '../../index.less';
const { ftq } = config;
const { ecifEvent: {
  uploadFile ,
} } = ftq;


export default Form.create()(function Deal(props) {

  const [dataSource, setDataSource] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // 全选
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选中项key
  const [selectedRows, setSelectedRows] = useState([]); // 选中项
  const [nrmbData , setNrmbData] = useState([]); //内容模板字典
  const [fwfsData, setFwfsData] = useState([]); //服务方式字典
  const [content , setContent] = useState(''); //内容模板入参
  const [srvcWay ,setSrvcWay] = useState(''); // 服务方式入参
  const [custList, setcustList] = useState([]); // 事件id入参
  const [tableLoading, setTableLoading] = useState(false); // 表格loading
  const [fileList, setFileList] = useState([]);
  const [md5s, setMd5s] = useState([]);
  const [deleLoad,setDeleLoad] = useState(true);//触发上传接口
  const [attachmentName , setattachmentName] = useState(''); //文件名
  const [moreDeal , setMoreDeal] = useState(false);
  const { form: { getFieldDecorator ,setFieldsValue } } = props;

  const { TextArea } = Input ;
  // 客户不规范（ECIF）列表表头
  const columns = [
    {
      title: '客户账户不规范情形',
      dataIndex: 'disorderlyName',
      key: 'disorderlyName',
      className: 'columnLine',
      fixed: 'left',
      width: 240,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '事件描述',
      dataIndex: 'describe',
      key: 'describe',
      className: 'columnLine',
      width: 390,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },
    {
      title: '重要程度',
      dataIndex: 'importance',
      key: 'importance',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div >{text}</div>,
    },
    {
      title: '处理方式',
      dataIndex: 'treatmentWay',
      key: 'treatmentWay',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div >{text === '1' ? '尽职调查' : text === '2' ? '通知' : '账户核查'}</div>,
    },
    {
      title: '审核状态',
      dataIndex: 'auditingStatus',
      key: 'auditingStatus',
      className: 'columnLine',
      // width: 150,
      render: (text,reoodes) => text === '审核不通过' ? <div onClick={()=>{ goRecordList(reoodes);}} style={{ color: '#244FFF',cursor: 'pointer' }}>{text}</div> : <div> {text} </div>,
    },
    {
      title: '分配日期',
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      className: 'columnLine',
      // width: 150,
      render: (text) => <div style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>{text}</div>,
    },

  ];
  const tableProps = {
    scroll: { x: 1090 },
  };
  // 全选反向操作数据
  const rowSelection = {
    type: 'checkbox',
    crossPageSelect: true, // checkbox默认开启跨页全选
    selectAll: selectAll,
    selectedRowKeys: selectedRowKeys,
    onChange: (currentSelectedRowKeys, selectedRows, currentSelectAll) => {
      const arr = [];
      const way = [] ;
      if(currentSelectAll){
        if(currentSelectedRowKeys.length === 0){
          dataSource.forEach(item=>{
            // 过滤多条是尽职调查、账户核查的数据
            if(item.treatmentWay === '1' || item.treatmentWay === '3'){
              way.push(item.eventId);
            }
            arr.push(item.eventId);
          });
          setcustList(arr);
        }else{
          dataSource.forEach(item=>{
            currentSelectedRowKeys.forEach(id=>{
              if(item.eventId !== id){
                if(item.treatmentWay === '1' || item.treatmentWay === '3'){
                  way.push(item.eventId);
                }
                arr.push(item.eventId);
              }
            });
          });
          setcustList(arr);
        }
      }else{
        dataSource.forEach(item=>{
          currentSelectedRowKeys.forEach(id=>{
            if(item.eventId === id){
              if(item.treatmentWay === '1' || item.treatmentWay === '3'){
                way.push(item.eventId);
              }
              arr.push(item.eventId);
            }
          });
        });
        setcustList(arr);
      }
      // 避免数据是多条尽调或者通知跟尽调混合
      if(way.length > 1 || (arr.length > 1 && way.length >= 1)){
        message.error('选择事件中包含需尽职调查、账户核查的事件，请进行单条处理！');
        return;
      }
      setSelectedRowKeys(currentSelectedRowKeys);
      setSelectedRows(selectedRows);
      setSelectAll(currentSelectAll);

    },
    fixed: true,
  };

  const goRecordList = (recode) => {

    if(props.crm === '1'){
      router.push({ pathname: `/newProduct/works/dealListDetailRecord/${recode.eventId}&&${props.custCode}&&${props.eventId}&&${props.crm}` });
    }
    if(props.crm === '2'){
      router.push({ pathname: `/single/dealListDetailRecord/${recode.eventId}&&${props.custCode}&&${props.eventId}&&${props.crm}` });
    }

  };

  // 上传文件状态改变
  const handleFlideChange = ({ file, fileList }) => {
    const { name , response = { } } = file;
    // 增加只能上传一个文件逻辑
    if (fileList.length > 1) {
      message.warning('只能上传一个文件');
      return false;
    }

    if (name.includes('.')) {
      const type = name.split('.').pop();
      const score = [
        "jpg",
        "png",
        "gif",
        "pdf",
        "mp3",
        "mp4",
        "wav",
        "doc",
        "docx",
        "txt",
        "xls",
        "xlsx",
        "7z",
        "jpeg",
        "zip",
        "ppt",
        "pptx",
        "bmp",
        "rar",
        "avi",
        "m4a",
        "midi",
        "cda",
        "tif"
      ]; ;
      if (status !== 'removed' && score.indexOf(type) < 0) {
        message.warning(
          "上传文件类型只能是：jpg、png、gif、pdf、mp3、mp4、wav、doc、docx、txt、xls、xlsx、7z、jpeg、zip、ppt、pptx、bmp、rar、avi、m4a、midi、cda、tif文件"
        );
        return false;
      }
    }
    if(response.code == '-1'){
      message.error(
        `${response.note}文件名字只能为数字、字母、下划线、横杠组成`
      );
      setFileList([]);
      return false ;
    }

    if(response.data){
      setFileList([...fileList]);
      setMd5s(response.data);
      setattachmentName(name);
    }
    if(deleLoad){
      setFileList(fileList);
    }
  };
  const deleteConfirm = async (e) => {

    let del = new Promise((resolve,reject)=> {
      Modal.confirm({
        title: '你确认要删除该文件吗？',
        onOk(){
          setFileList([]);
          setMd5s([]);
          setattachmentName('');
          setDeleLoad(true);
          if(e.status === 'removed'){
            resolve(true);
          }
        },
        onCancel(){
          reject(false);
        },
      });
    });

    return await del;
  };
  
  const getData = useCallback(
    ()=>{
      const params = {
        current: 1,
        custCode: props.custCode, // 列表客户级别
        eventId: props.eventId,
        motId: props.motId,
        isTreatment: 1, // 是否查询处理  1 处理  0 否
        pageLength: 0,
        pageNo: 0,
        pageSize: 50,
        paging: 1,
        sort: "",
        sortRules: 0,
        total: -1,
        totalRows: 0 ,

      };
      QueryRelEventList(params).then(res=>{
        const { records } = res;
        setDataSource(records);
      }).catch((error) => {
        message.error(error.note || error.message);
      });;
    },[],
  );

  const runSaveEventTreatment = ()=>{

    if(props.custCode.split(',').length === 1 && custList.length === 0){
      message.warn('未勾选待处理事件');
      return;
    }
    if(!srvcWay){
      message.warn('请先选择服务方式');
      return ;
    }
    if(!content){
      message.warn('请先填写服务内容或者选择引用模板');
      return ;
    }
    //isNotice 0 通知 1 尽职调查、账户核查
    let isNotice = '0' ;
    if(custList.length === 1){
      dataSource.forEach(item=>{
        if(item.eventId === custList[0]){
          if(item.treatmentWay === '1' || item.treatmentWay === '3'){
            isNotice = '1';
          }else{
            isNotice = '0';
          }
        }
      });
    }else{
      isNotice = '0';
    }

    if(isNotice === '1' && md5s.length !== 1 ){
      message.warn('请先上传附件!');
      return;
    }
    const params = {
      attachment: md5s.join(','), //附件
      attachmentName,
      calendarModel: props.calendarModel ? Number(props.calendarModel) : null, // 日历模式--传日期
      checkAll: 0, // 1 是全选   0 不是全选
      content, //内容
      custList: props.motId.split(',').length > 1 ? props.motId : custList.join(','), // 事件ID
      eventId: props.eventId, // 事件大类类型
      queryType: 1, // 查询类型 默认
      importance: props.importance, // 重要程度--查询条件
      disorderlyCode: props.disorderlyCode, // 不规范情形编码--查询条件
      custCodeList: props.custCodeList, // 客户等级中的客户号--查询条件
      checkCust: props.custCode, // 列表中的客户号
      srvcWay: Number(srvcWay),//服务方式
      tableName: isNotice === '1' ? 'LC_ECIFKHGFXDBSHLC' : 'TKHFWFJLH', // 通知 TKHFWFJLH  尽职调查、账户核查 LC_ECIFKHGFXDBSHLC
      treatmentReult: 1 , // 处理结果  1 已处理  0 未处理
      isNotice: Number(isNotice) , //是否通知 0 通知 1 尽职调查、账户核查
    };
    // setTableLoading(true);
    SaveEventTreatment(params).then(res=>{
      // 单事件处理
      if(props.custCode.split(',').length === 1){
        getData();
      }else{
        // 批量处理
        setMoreDeal(true); // 避免多次重复处理
        setFieldsValue( { 'fwfsData': '' });
        setSrvcWay('');
      }
      setcustList([]);
      // setMd5s([]);
      // setattachmentName('');
      // setTableLoading(false);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setSelectAll(false);
      message.success('保存成功');
    }).catch(err =>{
      let msg = err.note;
      let newMsg ;
      if(msg == '未设置客户不规范身份信息处理审核岗，请联系营业部管理员进行设置'){
        newMsg ='未设置客户不规范身份信息处理审核岗，请联系合规部门处理';
        message.error(newMsg);
      }else{
        message.error(err.note || err.message);
      };
    });
  };

  // 防抖
  const debounceHandPeoChange = lodash.debounce(runSaveEventTreatment, 300);
  useEffect(() => {
    // 默认选中上级带过来的数据
    if(props.custCode.split(',').length === 1){
      getData();
      selectedRowKeys.push(props.motId);
      custList.push(props.motId);
    }
    return () => {};
  }, [getData]);

  // 获取字典
  const getAllQueryDictionary = ()=>{
    let payload = [{ dictionaryType: "NRMB" },{ dictionaryType: "FWFS" }];
    for(let i = 0;i < payload.length;i++){
      getQueryDictionary(payload[i]).then(res=>{
        const { records = [] } = res;
        if(payload[i].dictionaryType === 'NRMB'){
          setNrmbData(records);
        }else{
          setFwfsData(records);
        }
      });
    }
  };

  useEffect(() => {
    getAllQueryDictionary();
    return () => {};
  }, []);

  const goBack = () =>{
    if(props.crm === '1'){
      router.push({ pathname: `/newProduct/work/:activeKey` });
    }
    if(props.crm === '2'){
      // router.push({ pathname: `/eventComList/index` });
      router.push({ pathname: `/single/eventComList/index` ,query: { sjid: props.eventId } });
    }
  };


  return (
    <Spin spinning={tableLoading}>
      <Form style={{ marginTop: '4px' }} className={`${styles.dealLabel} m-form-default ant-advanced-search-form`}>
        <Row className={styles.dealLabel} gutter={24}>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={9}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='服务方式'>
              {
                getFieldDecorator('fwfsData',{ rules: [ { required: true }] })( 
                  <Select 
                    defaultActiveFirstOption={false}
                    placeholder="请选择服务方式" 
                    rules={[{ required: true, message: '请输入客群描述' }]}
                    onChange={(e) => setSrvcWay(e)}>
                    {
                      fwfsData.map((item)=>(
                        <Select.Option key={item.id} title={item.name} value={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={9}>
            <Form.Item className={`m-form-item m-form-bss-item-p`}
              label='引用模板'>
              <Select 
                defaultActiveFirstOption={false}
                placeholder="请选择模板" 
                onChange={(e,k) => { setContent(k.props.children); setFieldsValue( { 'content': k.props.children }); }}>
                {
                  nrmbData.map((item)=>(
                    <Select.Option key={item.id} title={item.name} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={9}>
            <Form.Item className={`m-form-item m-form-bss-item-p`}
              label='服务内容'>
              {
                getFieldDecorator('content',{ initialValue: content , rules: [ { required: true ,message: '请先填写服务内容或者选择引用模板' }] })( 
                  <TextArea autoSize onChange={(e)=>{ setContent(e.target.value);}}/>
                )
              }
            </Form.Item>
          </Col>
          <Col xs={9} sm={9} md={9} lg={9} xl={9} xxl={9}>
            <Form.Item className={`m-form-item m-form-bss-item-p`} label='附件'>
              
              <Upload 
                action={uploadFile}
                fileList={fileList}
                onChange={(file)=>{handleFlideChange(file)}}
                onRemove={deleteConfirm}
                // accept='.xls, .xlsx'
              >
                <div className={styles.dealUpload}>
                  <div className={styles.dealUploadIcon}>
                    <img style={{ width: '1.5rem',marginTop: '-5px'}} src={ecifUpload} alt=""/>
                    <span style={{ marginLeft: '2px' }}>
                       点击上传附件
                    </span>
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </Col>

          <Form.Item style={{ float: 'right' }} className='m-form-bss-item-p'>
            <Button disabled={moreDeal} onClick={debounceHandPeoChange} className="m-btn-radius ax-btn-small m-btn-blue">保存</Button>
            <Button onClick={()=>{goBack()}} className="m-btn-radius ax-btn-small" >取消</Button>
          </Form.Item>
        </Row>
      </Form>
      {
        props.custCode.split(',').length === 1 ? (
          <BasicDataTable {...tableProps } specialPageSize={5} rowKey={'eventId'} columns={columns} dataSource={dataSource} className={`${styles.table}`} rowSelection={rowSelection} pagination={false} />) : ''
      }
    </Spin>
  );
});
