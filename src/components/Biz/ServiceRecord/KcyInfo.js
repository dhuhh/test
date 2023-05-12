import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Alert, Icon } from 'antd';
import MyItem from './Item';
import styles from './index.less';

const { Item: FormItem } = Form;
const idDatas = [];

class KcyInfo extends Component {

    getIddatas =(datas) =>{
        datas.forEach(item => {
            if(item.child && item.child.length > 0){
                this.getIddatas(item.child);
            }
            idDatas.push(item.id);
        })
    }
    handleDatas=(datas)=>{
        const fidArr = [];
        datas.forEach(item => {
            fidArr.push(item.fid);
        })
        const newfidArr = new Set(fidArr); // 去重
        const parentData = []; // 层级数据
        datas.forEach(item => {
            newfidArr.forEach(ele => {
                if(item.id === ele){
                    parentData.push({...item, child: []});
                }
            })
        })
        datas.forEach(item => {
            parentData.forEach(element => {
                if(element.id === item.fid){
                    element.child.push(item);
                }
            })
        })
        this.getIddatas(parentData);
        return parentData;
    }
    renderNode =(data)=>{
        const { dictionary, getFieldDecorator } = this.props;
        data.map((item, index) => {
            const { name: zbmc, attrCode, controlType: kjlx } = item;
            const zbbm = attrCode.toLocaleLowerCase();
            let { attrValue } = item;
            if (kjlx === '4') {
                if (attrValue && attrValue !== '') {
                    attrValue = moment(attrValue, 'YYYYMMDD');
                }
            }
            return (
                <Col sm={24} md={12} xxl={12} >
                    <FormItem labelCol={{ span: 14 }} className={`m-form-item ${styles.m_form}`} label={zbmc} wrapperCol={{ span: 10 }}>
                    {getFieldDecorator(zbbm, { initialValue: attrValue })(<MyItem handleUpdatachange={this.handleFileListChange} changeObjectForm={this.changeObjectForm} changeDataForm={this.changeDataForm} item={item} dictionary={dictionary} />)}
                    </FormItem>
                </Col>
            );
        })
    }
    render() {
        const { cusKYCInfo, dictionary, getFieldDecorator } = this.props;  // eslint-disable-line
        // const { getFieldDecorator } = this.props.form;
        const parentData = this.handleDatas(cusKYCInfo);
        const normalData = [] // 普通数据
        cusKYCInfo.forEach(item => {
            if(idDatas.indexOf(item.id) < 0){
                normalData.push(item);
            }
         })
        return (
            <React.Fragment>
                <Row>
                {
                    this.renderNode(normalData)
                }
                </Row>
                {
                    parentData.map(item => {
                        const { id, name, child = [] } = item;
                        return(
                            <div key={id} style={{ width: '100%' }}>
                                <Alert
                                    type="info"
                                    message={<span style={{ color: '#03A9F4' }}><Icon type="pushpin" /> {name}</span>}
                                    style={{ marginBottom: '.866rem' }}
                                />
                                <Row>
                                    {
                                        this.renderNode(child)
                                        // child.map((item, index) => {
                                        //     const { name: zbmc, attrCode, controlType: kjlx } = item;
                                        //     const zbbm = attrCode.toLocaleLowerCase();
                                        //     let { attrValue } = item;
                                        //     if (kjlx === '4') {
                                        //         if (attrValue && attrValue !== '') {
                                        //             attrValue = moment(attrValue, 'YYYYMMDD');
                                        //         }
                                        //     }
                                        //     return (
                                        //         <Col sm={24} md={12} xxl={12} >
                                        //             <FormItem labelCol={{ span: 14 }} className={`m-form-item ${styles.m_form}`} label={zbmc} wrapperCol={{ span: 10 }}>
                                        //             {getFieldDecorator(zbbm, { initialValue: attrValue })(<MyItem handleUpdatachange={this.handleFileListChange} changeObjectForm={this.changeObjectForm} changeDataForm={this.changeDataForm} item={item} dictionary={dictionary} />)}
                                        //             </FormItem>
                                        //         </Col>
                                        //     );
                                        // })
                                    }
                                </Row>
                            </div>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}
export default KcyInfo;