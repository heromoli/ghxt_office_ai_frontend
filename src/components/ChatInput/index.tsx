import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Input, Button, Space, Spin, message, Upload, Modal } from 'antd';
import { SendOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { addMessage, setLoading, updateMessage, updateSources, setTypingStatus } from '../../store/aiModuleSlice';
import type { RootState } from '../../store';
import { API_ENDPOINTS } from '../../config/api';
import { useParams } from 'react-router-dom';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import { fixMarkdown } from '../../utils/markdownHelpers';
import { streamRequest } from '../../services/xAgentService';

const { TextArea } = Input;

const InputWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledSpace = styled(Space.Compact)`
  width: 100%;
  display: flex;

  .ant-input {
    border-radius: 12px 0 0 12px;
    padding: 8px 16px;
    resize: none;
    font-size: 18px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8e8e8;

    &:focus {
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
      border-color: #1890ff;
    }
  }

  .ant-upload-select {
    margin-right: 0 !important;
    border-radius: 0 !important;
    
    .ant-btn {
      border-radius: 0 !important;
      height: 45px !important;
      background: linear-gradient(120deg, #1890ff, #722ed1) !important;
      border: none !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      opacity: 0.9;

      &:hover {
        opacity: 1;
      }

      &:disabled {
        opacity: 0.5;
        background: #f5f5f5 !important;
      }
    }
  }
`;

const SendBtn = styled(Button)`
  border-radius: 0 12px 12px 0 !important;
  height: 45px !important;
  width: 90px !important;
  background: linear-gradient(120deg, #1890ff, #722ed1) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    background: #f5f5f5 !important;
  }
`;

const FilePreviewWrapper = styled.div`
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .file-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .file-name {
    color: #333;
    font-size: 14px;
  }

  .file-size {
    color: #666;
    font-size: 12px;
  }
`;

const DeleteButton = styled(Button)`
  margin-left: 8px;
  &:hover {
    color: #ff4d4f;
    border-color: #ff4d4f;
  }
`;

export interface ChatInputRef {
  setInput: (value: string) => void;
}

const ChatInput = forwardRef<ChatInputRef>((props, ref) => {
  const [input, setInput] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { loading, sessionId } = useSelector((state: RootState) => state.aiModule);
  const messages = useSelector((state: RootState) => state.aiModule.conversation.messages);
  const { moduleId } = useParams<{ moduleId: string }>();

  useImperativeHandle(ref, () => ({
    setInput: (value: string) => setInput(value)
  }));

  const handleSend = async () => {
    if (!input.trim() && fileList.length === 0) return;

    if (loading || uploadLoading) return;

    setIsLoading(true);
    setInput('');

    try {
      if (fileList.length > 0 && moduleId === 'meeting') {
        // 处理会议语音文件上传
        await handleConferenceFileUpload(fileList[0].originFileObj as File);
      } else {
        // 根据不同模块调用对应的处理函数
        switch (moduleId) {
          case 'rules':
            await handleRulesChat(input.trim());
            break;
          case 'product':
            await handleProductChat(input.trim());
            break;
          case 'meeting':
            await handleConferenceChat(input.trim());
            break;
          default:
            message.error('未知的模块类型');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamResponse = async (response: Response) => {
    if (!response.ok) throw new Error('网络请求失败');

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) throw new Error('无法读取响应');

    let fullResponse = '';
    let buffer = ''; // 用于存储未完成的数据
    let doc_source = [];

    try {
      // 先添加一条空的助手消息
      dispatch(addMessage({ role: 'assistant', content: '' }));
      // 获取刚刚添加的助手消息的索引
      const assistantIndex = messages.length + 1; // 因为消息还没有更新到Redux状态，所以是当前长度
      dispatch(setTypingStatus({ index: assistantIndex, isTyping: true }));

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        // 将新数据添加到缓冲区
        buffer += decoder.decode(value, { stream: true });

        // 按行分割数据
        const lines = buffer.split('\n');

        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        let hasNewContent = false;
        let newContent = '';

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const rawData = line.slice(5).trim();

            if (rawData) {
              if (rawData.startsWith('[{') && rawData.endsWith('}]')) {
                const jsonData = JSON.parse(rawData);
                doc_source = jsonData
              } else {
                newContent += rawData;
                hasNewContent = true;
              }
            }
          } else if (line.length > 0) {
            if (line.includes('event') && line.includes('session')) {
              continue;
            }
            newContent += line;
            hasNewContent = true;
          }
        }

        if (hasNewContent) {
          fullResponse += newContent;
          // 使用 fixMarkdown 函数处理文本，然后更新消息
          dispatch(updateMessage({
            index: assistantIndex,
            content: fixMarkdown(fullResponse)
          }));

          // 强制触发重新渲染
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      // 处理缓冲区中剩余的数据
      if (buffer.length > 0) {
        fullResponse += buffer;
        dispatch(updateMessage({
          index: assistantIndex,
          content: fixMarkdown(fullResponse)
        }));
      }
      // 完成后关闭打字机光标
      dispatch(setTypingStatus({ index: assistantIndex, isTyping: false }));
      dispatch(updateSources({
        index: assistantIndex,
        sources: doc_source
      }));
    } catch (error) {
      console.error('Stream reading error:', error);
      throw error;
    }
  };

  // 处理会议语音文件上传
  const handleConferenceFileUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      dispatch(addMessage({
        role: 'user',
        content: `[上传文件] ${file.name} (${formatFileSize(file.size)}) - 进行语音识别`
      }));

      const formData = new FormData();
      formData.append('file', file);

      if (file.type === 'audio/wav') {
        formData.append('fileFormat', 'wav');
      } else if (file.type === 'audio/mpeg') {
        formData.append('fileFormat', 'mp3');
      }

      console.log('Uploading conference file:', file.name);
      console.log('File type:', file.type);
      const response = await fetch(API_ENDPOINTS.CHAT_STREAM_CONFERENCE_LOCAL_FILE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`文件上传失败: ${response.status}`);
      }

      // 处理普通JSON响应
      const result = await response.json();
      dispatch(addMessage({
        role: 'assistant',
        content: result.reply || '语音识别完成'
      }));

      setFileList([]);
      setSelectedFile(null);
    } catch (error) {
      console.error('Conference file upload error:', error);
      message.error('语音文件处理失败，请重试');
    } finally {
      setUploadLoading(false);
    }
  };

  // 处理规章制度百事通对话
  const handleRulesChat = async (message: string) => {
    dispatch(setLoading(true));
    try {
      dispatch(addMessage({ role: 'user', content: message }));

      const response = await fetch(API_ENDPOINTS.CHAT_STREAM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`发送消息失败: ${response.status}`);
      }

      await handleStreamResponse(response);
    } catch (error) {
      console.error('Rules chat error:', error);
      // message.error('规章制度查询失败，请重试');
    } finally {
      dispatch(setLoading(false));
      setInput('');
    }
  };

  // 处理产品一指禅对话
  const handleProductChat = async (message: string) => {
    dispatch(setLoading(true));
    try {
      dispatch(addMessage({ role: 'user', content: message }));

      const response = await fetch(API_ENDPOINTS.CHAT_STREAM_PRODUCT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`发送消息失败: ${response.status}`);
      }

      await handleStreamResponse(response);
    } catch (error) {
      console.error('Product chat error:', error);
      // message.error('产品信息查询失败，请重试');
    } finally {
      dispatch(setLoading(false));
      setInput('');
    }
  };

  // 处理会议秘书对话
  const handleConferenceChat = async (message: string) => {
    dispatch(setLoading(true));
    try {
      dispatch(addMessage({ role: 'user', content: message }));

      const response = await fetch(API_ENDPOINTS.CHAT_STREAM_CONFERENCE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`发送消息失败: ${response.status}`);
      }

      await handleStreamResponse(response);
    } catch (error) {
      console.error('Conference chat error:', error);
      // message.error('会议内容处理失败，请重试');
    } finally {
      dispatch(setLoading(false));
      setInput('');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file: RcFile) => {
    setSelectedFile(file);
    setShowUploadModal(true);
    return false;
  };

  const handleUploadConfirm = () => {
    if (selectedFile) {
      const rcFile = selectedFile as RcFile;
      setFileList([{
        uid: '-1',
        name: rcFile.name,
        size: rcFile.size,
        type: rcFile.type,
        originFileObj: rcFile,
        lastModifiedDate: new Date(rcFile.lastModified)
      }]);
    }
    setShowUploadModal(false);
  };

  const handleUploadCancel = () => {
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const uploadProps: UploadProps = {
    accept: '.wav,.mp3',
    maxCount: 1,
    fileList,
    beforeUpload: (file) => {
      const isAudio = file.type === 'audio/wav' ||
        file.type === 'audio/mpeg';
      if (!isAudio) {
        message.error('只能上传 WAV 或 MP3 文件！');
        return false;
      }

      // 检查文件大小（限制为100MB）
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('文件大小不能超过100MB！');
        return false;
      }

      return handleFileSelect(file);
    },
    showUploadList: false,
  };

  return (
    <InputWrapper>
      <StyledSpace>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入您的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={loading || uploadLoading || isLoading}
        />
        {moduleId === 'meeting' && (
          <Upload {...uploadProps}>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              disabled={loading || uploadLoading || fileList.length > 0}
            >
              上传
            </Button>
          </Upload>
        )}
        <SendBtn
          type="primary"
          icon={isLoading ? <Spin /> : <SendOutlined />}
          onClick={handleSend}
          disabled={loading || uploadLoading || (!input.trim() && fileList.length === 0)}
        >
          发送
        </SendBtn>
      </StyledSpace>

      {fileList.length > 0 && (
        <FilePreviewWrapper>
          <div className="file-info">
            <span className="file-name">{fileList[0].name}</span>
            <span className="file-size">({formatFileSize(fileList[0].size || 0)})</span>
          </div>
          <DeleteButton
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => {
              setFileList([]);
              setSelectedFile(null);
            }}
          >
            删除
          </DeleteButton>
        </FilePreviewWrapper>
      )}

      <Modal
        title="确认上传文件"
        open={showUploadModal}
        onOk={handleUploadConfirm}
        onCancel={handleUploadCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>您确定要上传以下文件吗？</p>
        {selectedFile && (
          <div>
            <p>文件名：{selectedFile.name}</p>
            <p>文件大小：{formatFileSize(selectedFile.size)}</p>
            <p>文件类型：{selectedFile.type || '未知'}</p>
          </div>
        )}
      </Modal>
    </InputWrapper>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput; 