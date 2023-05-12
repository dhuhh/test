import React, { Component } from 'react';
import { Card } from 'antd';
import CustomerDistribution from '../../../../../../components/WorkPlatForm/MainPage/Customer/HighNetWorthCus/CustomerDistribution';


export default class customerDistribution extends Component {
    render() {
        return (
            <Card
                title="客户分配"
                className='m-card m-card-pay default'
                bodyStyle={{ padding: '1rem 0 0' }}
                bordered={false}
            >
                <CustomerDistribution />
            </Card>
        )
    }
}
