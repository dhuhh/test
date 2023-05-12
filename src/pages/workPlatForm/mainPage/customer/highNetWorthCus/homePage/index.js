import React, { Component } from 'react';
import { Card } from 'antd';
import HomePage from '../../../../../../components/WorkPlatForm/MainPage/Customer/HighNetWorthCus/HomePage';

export default class homePage extends Component {
    render() {
        return (
            <Card
                // title="高净值客户首页"
                // className="m-card default"
                className='m-card m-card-pay'
                bodyStyle={{ background: '#ECF0F4', padding: '1rem 0 0' }}
                bordered={false}
            >
                <HomePage />
            </Card>
        )
    }
}
