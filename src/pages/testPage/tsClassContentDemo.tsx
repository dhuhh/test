import React, { Component } from 'react';
import { Button } from 'antd';

/**
 * ts中数据类型
 * 变量声明： var [变量名] : [类型] = 值;
 * 基础:number/string/boolean/any
 * 数组类型: number[]/string[] 或者使用泛型 Array<number>/Array<string>
 * 元组：用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型需要相同
 *       let x: [string,number];
 *       x = ['11', 1]; // 正确
 *       console.info(x[0]); // '11'
 *       x = [11, 1]  // 报错
 * 枚举：用于定义一个集合
 *       enum Color { Red, Green, Blue };
 *       let c: Color = Color.blue;
 *       console.info(c);
 * void: 无返回值
 *       function hello(): void {
 *          console.info('test');
 *       }
 *  never: 是其它类型（包括 null 和 undefined）的子类型，代表从不会出现的值。
 *         这意味着声明为 never 类型的变量只能被 never 类型所赋值，在函数中它
 *         通常表现为抛出异常或无法执行到终止点（例如无限循环）
 *         let x: never;
 *         x = 123; //报错
 *         x = (() => {throw new Error('err')})(); // 正确
 *  null：是一个只有一个值的特殊类型。表示一个空对象引用。typeof返回值为object
 *  undefined： undefined 是一个没有设置值的变量。typeof返回值为undefined
 *              lex x: number|null|undefined; // 联合类型: 不确定类型是已知中的哪一类
 *              x=1;
 *              x= undefined;
 *              x = null;
 *  any: 类型不明确的变量使用的一种数据类型（不要万物都用any）
 *       let x: any = 1; // 正确
 *       x = '1'; // 正确
 *       x = false; // 正确
 *       let x: [any, number];
 *       x = [1, 1]; // 正确
 *       x = [false, 1]; // 正确
 *       x = ['1', '1']; // 错误
 *       let arr: any[] = [1, false, '1']; // 正确
 *       let arr: Array<any> = [1, true , '1']; // 正确
 */


// 接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的
// UserInfo 即为 Props
// 此种用法是在参数可以抽象出来时使用
// 如果不能抽象可以使用下列
// 建议使用type方式，然后结合interface来定义props
// interface UserInfo {
//     id: number,
//     name: string,
// }

// 如果props参数无法抽象出来可以直接使用type方式定义
type Props = Readonly<{
    style?: React.CSSProperties; // ?: 代表可传可不传
    id: number,
    name?: string;
    onChange?: Function;
}>

type State =  Readonly<{
    sex: Gender, // 枚举类型
}>

enum Gender { male, female };

class TsClassContentDemo extends Component<Props, State> {
    state: State = {
        sex: Gender.male,
    }

    static defaultProps = {
        id: 0,
        name: '--',
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            sex: Gender.male,
        }
    }

    changeSex = (sex: Gender): void=> {
        console.log(sex, 123);
        this.setState({
            sex: Gender.female,
        });
    }
    render() {
        const { id,  name } = this.props;
        const { sex } = this.state;
        console.info(sex, 123)
        return (
            <div>
                <div>用户id: {id}</div>
                <div>用户名: {name}</div>
                <div>性别：{ sex === 0 ? '男' : '女'}</div>
                <Button onClick={() => { this.changeSex(sex); }}>改变性别</Button>
            </div>
        )
    }
}
export default TsClassContentDemo;
