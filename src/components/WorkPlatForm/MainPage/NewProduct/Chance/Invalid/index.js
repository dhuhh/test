import React, { Component } from 'react';
import Unactive from './unactive';
import Actived from './actived';
import Tabs from '../Common/Tab';



export default class index extends Component {;
  render() {
    const { tab1,tab2 } = this.props;
    return (
      <Tabs title={['未激活','本年已激活']} tab1={tab1}>
        <Unactive tab2={tab2}/>
        <Actived/>
      </Tabs>
    );
  }
}
