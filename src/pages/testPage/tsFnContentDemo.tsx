import React, { FC, useState } from 'react';
import { Button } from 'antd';

type Props = Readonly<{
    id: number,
    name?: string; // 可传可不传
}>

enum Gender { male, female };

const TsFnContentDemo: FC<Props> = ({ id, name, ...Props}) => {
    const [sex, changeSex] = useState<number>(Gender.male);
    const handleChangeSex = (sex: Gender): void => {
        console.log(sex, 123);
        changeSex(Gender.female);
    }
    return (
        <div>
            <div>用户id： {id}</div>
            <div>用户姓名： {name}</div>
            <div>性别：{ sex === 0 ? '男' : '女'}</div>
            <Button onClick={() => { handleChangeSex(sex); }}>改变性别</Button>
        </div>
    )
}
export default TsFnContentDemo;
