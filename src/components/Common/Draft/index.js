import React from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    const { defaultValue = '' } = props;
    let editorState = '';
    // 设置初始值
    if (defaultValue !== '') {
      // 初始值为文本
      if (typeof defaultValue === 'string') { // 对于html先转义再转成editorState对象
        const html = this.HTMLDecode(defaultValue);
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          editorState = EditorState.createWithContent(contentState);
        }
      } else if (typeof defaultValue === 'object') { // 初始值为对象
        const { html: defaultHtml = '', editorState: defaultEditorState = '' } = defaultValue;
        // 将文件信息放到输入框中
        if (defaultEditorState) {
          editorState = defaultEditorState;
        } else { // 如果初始值为对象，那么将其中的html放到输入框中
          const html = this.HTMLDecode(defaultHtml);
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            editorState = EditorState.createWithContent(contentState);
          }
        }
      }
    }
    this.state = {
      editorState,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (Reflect.has(nextProps, 'value')) {
      const { value = '' } = nextProps;
      if (value !== '') {
        if (typeof value === 'string') { // 对于html先转义再转成editorState对象
          const html = this.HTMLDecode(value);
          const contentBlock = htmlToDraft(html);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
              editorState,
            });
          }
        } else if (typeof value === 'object') {
          const { editorState, fileList = [] } = value;
          this.setState({
            editorState,
            fileList,
          });
        }
      }
    }
  }
  onEditorStateChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const outputText = contentState.getPlainText();
    this.setState({
      editorState,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        html: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        editorState,
        text: outputText,
        fileList: this.state.fileList,
      });
    }
  }
  // HTML转义
HTMLEncode = (html) => {
  let temp = document.createElement('div');
  if (temp.textContent != null) {
    temp.textContent = html;
  } else {
    temp.innerText = html;
  }
  const output = temp.innerHTML;
  temp = null;
  return output;
}

// HTML反转义
HTMLDecode = (text) => {
  let temp = document.createElement('div');
  temp.innerHTML = text;
  const output = temp.innerText || temp.textContent;
  temp = null;
  return output;
}
render() {
  // const { editorState } = this.state;
  const { readOnly = false } = this.props;
  const { editorState } = this.state;
  return (
    <div>
      <Editor
        readOnly={readOnly}
        wrapperClassName="demo-wrapper"
        hashtag={{
          separator: ' ',
          trigger: '#',
        }}
        localization={{ locale: 'zh' }}
          // wrapperStyle={}
        editorClassName="ant-input"
        editorStyle={{ height: '100%', minHeight: '20rem' }}
        toolbarClassName="toolbar-class"
          // toolbarStyle={}
        editorState={editorState}
        // defaultEditorState={EditorState.createWithContent(ContentState.createFromText(value[0] || ''))}
          // onChange={this.onChange}
        onEditorStateChange={this.onEditorStateChange}
        // toolbarCustomButtons={[<FileUploadButton fileList={this.state.fileList} resetFileList={this.resetFileList} ContentState={ContentState} EditorState={EditorState} Modifier={Modifier} />]}
        toolbar={
          {
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'colorPicker', 'textAlign', 'link', 'remove', 'history'],
            inline: {
              inDropdown: false,
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              options: ['bold', 'italic', 'underline'],
            },
          }
        }
      />
    </div>
  );
}
}
export default Draft;
