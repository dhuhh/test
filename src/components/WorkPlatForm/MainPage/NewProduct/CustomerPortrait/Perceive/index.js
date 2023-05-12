import React, { Component } from 'react';
import { Tag, Tooltip, Spin, Tabs, Modal, Input, Row, Col, Button, message,Checkbox  } from 'antd';
import Title from '../Common/Title';
import { Scrollbars } from 'react-custom-scrollbars';
import { QueryCusLabel } from '$services/newProduct';
import { newClickSensors, newViewSensors } from "$utils/newSensors";
import { QueryCustomerLabelList, SaveAddCustomLabel, SaveAddCustomerLabel } from '$services/customerPanorama';
import {getDel,getValidationResp,getPopNum} from '$services/customer/customerTag'
import edit_black from '$assets/newProduct/customerPanorama/edit_black.svg';
import customIcon from '../../../../../../assets/customer/customerEven2.png'
import close from '../../../../../../assets/customer/close.png'
import hot from '$assets/newProduct/customerPanorama/hot.png';
import add from '$assets/newProduct/customerPanorama/add.png';
import cuzzy from '$assets/customer/cuzzy.png';
import styles from './index.less';
import sensors from 'sa-sdk-javascript';

const { TabPane } = Tabs;

export default class Perceive extends Component {
  state = {
    cusLabel: [],
    visible: false,
    tabKey: '1',
    label: '',
    editLabels: [],
    myLabels: [],
    hotLabels: [],
    loading: false,
    manualLabel: [],
    modalValue:[],
    visT1:false,
    visT2:false,
    visT3:false,
    amount:{},
    isDel:''
  }
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(_, prevState) {
    if ((!prevState.visible) && this.state.visible) {
      this.setState({ loading: true });
      QueryCustomerLabelList({
        custNo: this.props.cusCode,
        srcType: 0,
      }).then(res => {
        const { records = [] } = res;
        let editLabels = [], myLabels = [], hotLabels = [];
        records.forEach(item => {
          if (item.labelBig === '1') {
            editLabels.push(item);
          } else if (item.labelBig === '2') {
            myLabels.push(item);
          } else if (item.labelBig === '3') {
            hotLabels.push(item);
          }
        });
        let newRes= []
          myLabels.map((item,index)=>{
            let up = editLabels.filter(item=>item.labelLogo==1)
            up.map(item => item.labelId).includes(item.labelId)?newRes.push(item):''
        })
        // let arr = []
        // arr = editLabels.filter(item => item.labelLogo === '1')
        // console.log(newRes,arr,'arrarrarr');
        this.setState({ editLabels, myLabels, hotLabels, loading: false ,modalValue:newRes});
      });
    }
  }

  fetchData = () => {
    QueryCusLabel({
      cusNo: this.props.cusCode,
      userId: 0,
    }).then(res => {
      const { records } = res;
      let cusLabel = records.filter((item, index) => item.type === '1')/* .sort((m, n) => n.name.length - m.name.length) */;
      let manualLabel = records.filter((item, index) => item.type === '2')/* .sort((m, n) => n.name.length - m.name.length) */;
      this.setState({
        cusLabel: cusLabel,
        manualLabel: manualLabel,
      });
    });
  }

  handleTabChange = (tabKey) => {
    if (tabKey == 2) {
      newClickSensors({
        third_module: "画像",
        ax_page_name: "标签",
        ax_button_name: "自定义标签点击次数",
      });
    }
    this.setState({ tabKey });
  }

  handleInTag = ()=>{
    const { label = '' } = this.state;
    if(label){
      getValidationResp({
        tagName:label
      }).then((res)=>{
        if(res.records[0].result!='是'){
          this.handleAddLabel();
        }else{
          this.setState({
            visT1:true
          })
        }
      })
    }else{
      message.warning('不允许新增空标签！');
    }
    
  }

  handleAddLabel = async () => {
    const { label = '' } = this.state;
      this.setState({ loading: true });
      await SaveAddCustomLabel({
        custNo: this.props.cusCode,
        labelName: label,
        type: 0,
      }).catch(err => message.error(err.note || err.message));
      const res = await QueryCustomerLabelList({
        custNo: this.props.cusCode,
        srcType: 0,
      }).catch(err => message.error(err.note || err.message));
      const { records = [] } = res;
      let editLabels = [], myLabels = [], hotLabels = [];
      records.forEach(item => {
        if (item.labelBig === '1') {
          editLabels.push(item);
        } else if (item.labelBig === '2') {
          myLabels.push(item);
        } else if (item.labelBig === '3') {
          hotLabels.push(item);
        }
      });
      let newRes= []
          myLabels.map((item,index)=>{
          editLabels.map(item => item.labelId).includes(item.labelId)?newRes.push(item):''
        })
      this.setState({ editLabels, myLabels, hotLabels, loading: false,modalValue:newRes });
    
  }
  handleSaveLabel = () => {
    const { editLabels = [] } = this.state;
    this.setState({ loading: true });
    SaveAddCustomerLabel({
      custNo: this.props.cusCode,
      type: 0,
      srcId: 1,
      labelId: editLabels.filter(item => item.labelLogo === '1').map(item => item.labelId).join(','),
    }).then(res => {
      const { note = '操作成功' } = res;
      message.success(note);
      this.setState({ loading: false, visible: false });
      this.fetchData();
    }).catch(err => message.error(err.note || err.success));
  }
  handleDelete = (item) => {
    const { editLabels = [],modalValue } = this.state;
    let result = [],value = [];
    editLabels.forEach(i => {
      if (i.labelId !== item.labelId) {
        result.push(i);
      }
    });
    modalValue.forEach(i=>{
      if (i.labelId !== item.labelId) {
        value.push(i);
      }
    })
    this.setState({ editLabels: result ,modalValue:value});
  }
  handleClick = (item) => {
    const {modalValue,editLabels = []} = this.state;
    let res = {},edit = [...editLabels]
    if(item.length>modalValue.length){
      console.log('进来1',item);
        item.forEach(i=>{
          if(!modalValue.map(m=>m.labelId).includes(i.labelId)){
              res = i ;
          }
        })
        edit.unshift(res);
        this.setState({ editLabels:edit,modalValue:item });
    }else{
      // console.log(item,'idiashdiasd',modalValue);
      // modalValue.forEach(i=>{
      //   // console.log(item.map(m=>m.labelId),i.labelId,item.map(m=>m.labelId).includes(i.labelId));
        
      //   if(!item.map(m=>m.labelId).includes(i.labelId)){
      //     console.log(edit,'200000');
      //     edit = edit.filter((e=>{
      //       return (e.labelId !== i.labelId&&e.labelLogo==1)||e.labelLogo==2
      //     }))
      //     console.log(edit,'22222',i.labelId);
      //   }
      // })
      //  item = modalValue
    }
    
    // const { editLabels = [] } = this.state;
    // let repetition = false;
    // editLabels.forEach(i => {
    //   if (i.labelId === item.labelId) {
    //     repetition = true;
    //   }
    // });
    // if (!repetition) {
    //   editLabels.push(item);
    //   this.setState({ editLabels });
    // }
  }

  del = ()=>{
    const {amount,myLabels,editLabels} = this.state;
    getDel({
      tagId:amount.id,
    }).then((res)=>{
      // console.log(res.records[0],res.records[0].result,res.records[0].result=='是');
      if(res.records[0].result=='是'){
        let newR = [...myLabels],newT = [...editLabels];
        newR = newR.filter(item=>item.labelId!=amount.id);
        newT = newT.filter(item=>item.labelId!=amount.id&&item.labelName!=amount.name)
        console.log(newT,editLabels);
        this.setState({
          myLabels:newR,
          editLabels:newT,
          visT2:false,
        })
      }else{
        this.setState({
          visT3:true,
          visT2:false
        })
      }
    })
  }

  getTextWith = (text, fontStyle) => {
    var canvas = document.createElement('canvas')
    var context = canvas.getContext('2d')
    context.font = fontStyle || '14px  PingFangSC-Regular, PingFang SC' // 设置字体样式，当然，也可以在这里给一个默认值
    var dimension = context.measureText(text)
    return dimension.width
}

  tagDetail = (value)=>{
    console.log(value);
    getPopNum({
       tagId:value.labelId
    }).then((res)=>{
      console.log(res.records[0].amount,'23333344');
      this.setState({
        visT2:true,
        amount:{num:res.records[0].amount,name:value.labelName,id:value.labelId}
      })
    })
  }
  render() {
    const { label, editLabels, myLabels, hotLabels,visT1,visT2,amount,visT3,isDel } = this.state;
    return (
      <React.Fragment>
        <div className={styles.perceive}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 27 }}>
            <Title title='30s认知' />
            <div style={{ cursor: 'pointer' }} onClick={() => { 
              newClickSensors({
                third_module: "画像",
                ax_page_name: "标签",
                ax_button_name: "标签编辑点击次数",
              });
              this.setState({ visible: true }); }}><span><img src={edit_black} alt='' /></span><span style={{ marginLeft: 5, color: '#61698C' }}>编辑</span></div>
          </div>
          <Tabs activeKey={this.state.tabKey} onChange={this.handleTabChange} className={styles.tabs}>
            <TabPane tab="系统标签" key="1">
              <div className={styles.tag}>
                {
                  this.state.cusLabel.map((item, index) => (/*  */
                    <Tooltip title={item.rys||'无'} overlayClassName={styles.tagTip} key={index} trigger='click' /* align={{ offset: [0, 0] }} */ /* placement='topLeft' */ /* arrowPointAtCenter */ /* autoAdjustOverflow={false} */>
                      <Tag className={styles.tagItem} style={item.labelLvl === '1' ? { color: '#FF6E30', borderColor: '#FFBFA3' } : {}}>{item.name}</Tag>
                    </Tooltip >
                  ))
                }
              </div>
            </TabPane>
            <TabPane tab="自定义标签" key="2">
              <div className={styles.tag}>
                {
                  this.state.manualLabel.map((item, index) => (/*  */
                    <Tooltip title={item.rys||'无'} overlayClassName={styles.tagTip} key={index} trigger='click'/* align={{ offset: [0, 0] }} */ /* placement='topLeft' */ /* arrowPointAtCenter */ /* autoAdjustOverflow={false} */>
                      <Tag className={styles.tagItem} style={item.labelLvl === '1' ? { color: '#FF6E30', borderColor: '#FFBFA3' } : {}}>{item.name}</Tag>
                    </Tooltip >
                  ))
                }
              </div>
            </TabPane>
          </Tabs>
          <div className={styles.line}></div>
        </div >
        {/* <Modal
          visible={this.state.visible}
          title={<div style={{ color: '#1A2243' }}>{'客户标签'}</div>}
          footer={null}
          onCancel={() => { this.setState({ visible: false, label: '' }); this.fetchData(); }}
          width={652}
          style={{height:702}}
          bodyStyle={{ padding: 0 }}
          destroyOnClose
        >
          <Spin spinning={this.state.loading}>
            <Scrollbars style={{ height: 400 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px 6px' }}>
                <div>我贴上的标签</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ whiteSpace: 'nowrap' }}>新加标签：</div>
                  <div style={{ marginRight: 10 }}>
                    <Input value={label} onChange={e => this.setState({ label: e.target.value })} />
                  </div>
                  <div onClick={this.handleAddLabel} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap', whiteSpace: 'nowrap', width: 61, height: 28, background: '#F0F1F5', borderRadius: '2px' }}>
                    <img src={add} alt='' />
                    <span style={{ marginLeft: 4 }}>贴上</span>
                  </div>
                </div>
              </div>
              <Row type='flex' style={{ flexWrap: 'wrap', padding: '0 19px' }}>
                {
                  editLabels.map((item, index) => <Col key={index}><Tag className={`${styles.label} ${(myLabels.map(item => item.labelId).includes(item.labelId) || hotLabels.map(item => item.labelId).includes(item.labelId)) ? styles.selectedLabel : ''}`} closable={item.labelLogo === '1' ? true : false} onClose={() => this.handleDelete(item)}>{item.labelName}</Tag></Col>)
                }
              </Row>
              <Row type='flex' justify='space-between' style={{ padding: '0 24px' }}>
                <Col></Col>
                <Col><Button onClick={this.handleSaveLabel} style={{ height: 30, width: 60, minWidth: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='m-btn-radius ax-btn-small m-btn-blue'>保存</Button></Col>
              </Row>
              <div style={{ margin: '24px', height: 1, background: '#EAEEF2' }}></div>
              <div style={{ padding: '0 24px 5px' }}>我的标签</div>
              <Row type='flex' style={{ flexWrap: 'wrap', padding: '0 19px' }}>
                {
                  myLabels.map((item, index) => <Col key={index}><Tag onClick={() => this.handleClick(item)} className={`${styles.label} ${editLabels.map(item => item.labelId).includes(item.labelId) ? styles.selectedLabel : ''}`} style={{ background: '#F0F1F5', color: '#61698C' }}>{item.labelName}</Tag></Col>)
                }
              </Row>
              <div style={{ padding: '20px 24px 5px' }}>热门标签<img src={hot} alt='' /></div>
              <Row type='flex' style={{ flexWrap: 'wrap', padding: '0 19px 20px' }}>
                {
                  hotLabels.map((item, index) => <Col key={index}><Tag onClick={() => this.handleClick(item)} className={`${styles.label} ${editLabels.map(item => item.labelId).includes(item.labelId) ? styles.selectedLabel : ''}`} style={{ background: '#F0F1F5', color: '#61698C' }}>{item.labelName}</Tag></Col>)
                }
              </Row>
            </Scrollbars>
          </Spin>
        </Modal> */}
        <Modal
           visible={this.state.visible}
           title={<div style={{ color: '#1A2243' }}>{'客户标签'}</div>}
           onCancel={() => { this.setState({ visible: false, label: '' }); this.fetchData(); }}
           centered={true}
           onOk={this.handleSaveLabel}
           width = {652}
           cancelText='取消'
           okText='确定'
           closeIcon={<img src={close} style={{width:'16px',marginTop:'-8px',marginRight:'-10px'}}/>}
           className={styles.modal_tag }
        >
            <Spin spinning={this.state.loading}>
            <div style={{display:'flex',background:'#F2F3F7',justifyContent:'center',paddingTop:'16px',paddingBottom:'16px'}}>
              <div style={{width:'302px',borderRadius:'2px',height:'562px',background:'#fff',marginRight:'16px',marginLeft:'16px',padding:'16px 16px 0 16px',overflowY:'auto'}} className={styles.scroll}>
                  <div className='title_tag'>我的自定义标签</div>
                  <div style={{paddingBottom:'16px',borderBottom:'1px solid #EAECF2 '}}>
                  <Input placeholder='添加自定义标签' value={label} onChange={e => this.setState({ label: e.target.value })} maxLength={20} style={{height:'32px',width:'201px',border: '1px solid #D1D5E6',outline:'transplate',boxShadow:'none',borderRadius:'2px',marginBottom:'4px'}}/>
                  <Button onClick={this.handleInTag} style={{width:'60px',height:'32px',borderRadius:'2px',marginTop:'2px',marginLeft:'8px',color:'#244FFF',border:'1px solid #244FFF',textAlign:'center',padding:'0'}}>添加</Button>
                  </div>
                  <div style={{marginTop:'16px'}}>
                  <Checkbox.Group value={this.state.modalValue} onChange={(item) => this.handleClick(item)} style={{display:'flex',flexDirection:'column'}}>
                    {
                     myLabels.map((item, index) => <div style={{display:'flex',marginBottom:'5px'}} onMouseLeave={()=>{this.setState({isDel:''})}} className={styles.checkoutlist}><Checkbox value={item} key={item.labelId} ><span className='tab_tag' title={this.getTextWith(item.labelName)>170?item.labelName:''} onMouseEnter={()=>{this.setState({isDel:item.labelId})}}>{item.labelName}</span></Checkbox><div style={{width:'0',height:'14px',borderLeft:'1px solid #EAECF2',margin:'4px 8px',display:`${isDel==item.labelId?'inline-block':'none'}`}}></div><span style={{fontSize:'14px',color: '#EC3A48',fontWeight:'400',display:'inline-block',height:'20px',marginLeft:'8px',display:`${isDel==item.labelId?'inline-block':'none'}`}} onClick={()=>this.tagDetail(item)} className={styles.del}>删除</span></div>)
                    }
                  </Checkbox.Group >
                  </div>
              </div>
              <div style={{width:'302px',borderRadius:'2px',height:'562px',background:'#fff',marginRight:'16px',padding:'16px 16px 0 16px',overflowY:'auto'}} className={styles.scroll}>
              <div className='title_tag' style={{borderBottom:'1px solid #EAECF2 ',paddingBottom:'16px'}}>已添加标签</div>
                  <div style={{display:'flex',flexDirection:'column',position:'relative'}}>
                  {
                    editLabels.map((item, index) => <span style={{color:this.state.modalValue.map(itemChild=>itemChild.labelId).includes(item.labelId)&&item.labelLogo==1?'#244FFF':''}} className='has_tag'><span title={this.getTextWith(item.labelName)>182?item.labelName:''}>{item.labelName}</span>{this.state.modalValue.map(itemChild=>itemChild.labelId).includes(item.labelId)&&item.labelLogo==1&&<img onClick={() => this.handleDelete(item)} src={customIcon} style={{position:'absolute',right:'0',width:'16px',marginTop:'4px'}}/>}</span>)
                  }
                  </div>
              </div>
            </div>
            </Spin>
        </Modal>
        <Modal visible={visT1} footer={null} style={{height:'136px'}} width={300} className={styles.modalInToo}>
             <div className='fontInTag'>
              <img src={cuzzy} style={{marginTop:'-3px'}}/>
                 无法添加相同名称标签
             </div>
             {/* <Button onClick={()=>{this.setState({label:'',visT1:false})}} style={{margin:'16px 16px 0 107px',color:'#61698C'}}>重置</Button> */}
             <Button onClick={()=>{this.setState({visT1:false})}} style={{margin:'16px 16px 0 188px',background:'#244FFF',width:'60px',height:'32px',borderRadius:'2px',border:'none'}}>确定</Button>
        </Modal>
        <Modal visible={visT3} footer={null} style={{height:'136px'}} width={300} className={styles.modalInToo}>
             <div className='fontInTag'>
              <img src={cuzzy} style={{marginTop:'-3px'}}/>
                 暂无此标签删除权限
             </div>
             {/* <Button onClick={()=>{this.setState({label:'',visT1:false})}} style={{margin:'16px 16px 0 107px',color:'#61698C'}}>重置</Button> */}
             <Button onClick={()=>{this.setState({visT3:false})}} style={{margin:'16px 16px 0 188px',background:'#244FFF',width:'60px',height:'32px',borderRadius:'2px',border:'none'}}>确定</Button>
        </Modal>
        <Modal visible={visT2} footer={null} onCancel={()=>{this.setState({visT2:false})}} style={{height:'148px'}} width={470} className={styles.modalInToo}>
             <div className='fontInTag' style={{display:'flex'}}>
                 <div style={{flex:'none'}}><img src={cuzzy} style={{marginTop:'-3px'}}/></div>
                 <div style={{marginLeft:'10px',display:'inline-block'}}>
                    确定删除"{amount.name}"标签({amount.num}位客户已添加此标签，删除后将自动撤销添加的此标签)
                 </div>
             </div>
             <Button onClick={()=>{this.setState({visT2:false})}} style={{margin:'16px 16px 0 285px',color:'#61698C',width:'60px',height:'32px',borderRadius:'2px',borderColor:'#D1D5E6'}}>取消</Button>
             <Button onClick={this.del} style={{background:'#244FFF',width:'60px',height:'32px',borderRadius:'2px'}}>删除</Button>
        </Modal>
      </React.Fragment>
    );
  }
}
