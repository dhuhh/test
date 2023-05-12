import { Alert, Button, Checkbox, Input, message, Modal as AntdModal, Tag } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
import lodash from 'lodash';
import { SaveCusPhone, QrySavedPhone } from '$services/incidentialServices';
import styles from './index.less';

function Modal(props) {
  const reg = /^((0\d{2,3}-\d{7,8})|(1[35847]\d{9}))$/;
  const [way, setWay] = useState(1);
  const [checked, setChecked] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    qrySavedPhone();
  }, [qrySavedPhone]);

  const handleOk = () => {
    props.hideModal();
  };

  const handleChange = (way, ...rest) => {
    const [e] = rest;
    if (e.target.checked) {
      if (way === 1) setChecked(true);
      if (way === 2) setChecked(false);
    }
    setWay(way);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setVisible(false);
  };

  const save = () => {
    if (reg.test(inputValue)) {
      SaveCusPhone({
        cusPhone: inputValue,
      }).then((response) => {
        const { note } = response;
        message.success(note);
        qrySavedPhone();
      }).catch((error) => {
        message.error(error.success ? error.note : error.message);
      });
    } else {
      setVisible(true);
    }
  };

  const qrySavedPhone = useCallback(() => {
    QrySavedPhone({}).then((response) => {
      const { records } = response;
      const historyData = lodash.cloneDeep(records);
      if (historyData.length > 0) {
        setInputValue(historyData[0].cusPhone || inputValue);
      } else {
        setInputValue(inputValue);
      }
      setHistoryData(historyData);
    }).catch((error) => {
      message.error(error.success ? error.note : error.message);
    });
  }, [inputValue]);

  const handleTagClick = (index) => {
    setInputValue(historyData[index]?.cusPhone || '');
  };

  return (
    <AntdModal
      bodyStyle={{ padding: '0 24px' }}
      title='选择呼出方式'
      visible={props.modalVisible}
      onCancel={props.hideModal}
      footer={<>
        <Button className="m-btn-radius ax-btn-small" style={{ marginRight: '14px' }} onClick={props.hideModal}>取 消</Button>
        <Button className="m-btn-radius ax-btn-small m-btn-blue" onClick={handleOk}>呼 叫</Button>
      </>}>
      <div style={{ padding: '8px 0', fontSize: 20 }}>
        <Checkbox className={styles.options} checked={checked} onChange={(...rest) => { handleChange(1, ...rest); }}>本机号码</Checkbox>
      </div>
      <div style={{ padding: '8px 0 20px' }}>
        <Checkbox className={styles.options} checked={!checked} onChange={(...rest) => { handleChange(2, ...rest); }}>95517双呼</Checkbox>
      </div>
      <div style={{ color: '#ff6e30', paddingBottom: '10px' }}>95517是公司统一的客户服务电话，选择95517将会进行录音，并有专岗进行质检，请注意与客户沟通同内容的合规性！</div>
      <div style={{ paddingBottom: '10px' }}>
        <span style={{ color: '#61698c' }}>选择95517双呼，将由95517分别呼叫本人手机和客户手机进行通话，</span>
        <span style={{ color: '#ff6e30' }}>可修改接听电话！</span>
      </div>
      <Input.Group compact>
        <Input value={inputValue} onChange={handleInputChange} className={styles.input} prefix='接听电话' allowClear size='large' style={{ width: '83%' }} />
        <Button size='large' style={{ background: '#E1E7FE', color: '#4A6DFE' }} onClick={save}>保存</Button>
      </Input.Group>
      { visible && <Alert message="请输入正确号码" type="warning" showIcon /> }
      <div style={{ padding: '10px 0' }}>历史设置</div>
      <div style={{ paddingBottom: 10 }}>
        {
          historyData.map((item, index) => {
            return <Tag key={index} style={{ cursor: 'pointer' }} onClick={() => {handleTagClick(index);}}>{item.cusPhone}</Tag>;
          })
        }
      </div>
    </AntdModal>
  );
}

export default Modal;
