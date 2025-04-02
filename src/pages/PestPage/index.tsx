import {CloudUploadOutlined, LinkOutlined} from '@ant-design/icons';
import {
    Attachments,
    AttachmentsProps,
    Bubble,
    Conversations,
    Prompts,
    Sender,
    Suggestion,
    ThoughtChain,
    useXAgent,
    Welcome,
    XProvider,
    XStream 
} from '@ant-design/x';
import {
    App,
    Badge,
    Button,
    Card,
    ConfigProviderProps,
    Divider,
    Flex,
    Form,
    GetProp,
    Layout,
    Radio,
    type GetRef,
    Typography,
    notification
} from 'antd';
import React, {useState} from 'react';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    AlipayCircleOutlined,
    BulbOutlined,
    CheckCircleOutlined,
    GithubOutlined,
    LoadingOutlined,
    SmileOutlined,
    UserOutlined,
    RedditOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import {API_ENDPOINTS} from '../../config/api';
// import { StyledHeader, HeaderContent, BackButton } from '@/components/Layout/styles';

export default () => {
    const [messages, setMessages] = React.useState<Message[]>([
        {
            role: 'welcome',
            placement: 'start',
            content: 'Hi！我是病虫害百晓生，已经接入DeepSeek深入思考能力，你有什么问题都可以问我。',
            avatar: {icon: <RedditOutlined/>},
        }
    ]);
    const [loading, setLoading] = React.useState(false);
    const [direction, setDirection] =
        React.useState<GetProp<ConfigProviderProps, 'direction'>>('ltr');

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
    const [text, setText] = React.useState('');

    const senderRef = React.useRef<GetRef<typeof Sender>>(null);
    const {Header, Content} = Layout;

    const StyledHeader = styled(Header)`
      background: rgb(211, 236, 250) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      width: 100%;
      z-index: 100;
      height: 64px;
      padding: 0;
      display: flex;
      align-items: center;
    `;

    const HeaderContent = styled.div`
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
    `;

    const BackButton = styled(Button)`
      margin-right: 20px;
    `;

    const handleBack = () => {
        navigate('/');
    };

    const handleSubmit = async (inputValue: string) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('textInput', text);
        items.forEach(item => {
            console.log(item);
            if (item.originFileObj) {
                formData.append('file', item.originFileObj);
            }
        });
    
        // 添加用户消息和上传的图片
        setMessages(prev => [
            ...prev,
            {
                role: 'user',
                placement: 'end',
                content: '',
                avatar: {icon: <UserOutlined/>},
                attachments: items.length > 0 ? items.map(item => ({
                    type: 'image',
                    url: (item.originFileObj ? URL.createObjectURL(item.originFileObj) : ''),
                    name: item.name
                })) : undefined
            },
            {
                role: 'user',
                placement: 'end',
                content: text,
                avatar: {icon: <UserOutlined/>}
            },
            {
                role: 'assistant',
                content: '',
                loading: true,
                avatar: {icon: <RedditOutlined/>},
            }
        ]);

        try {
            const response = await fetch(API_ENDPOINTS.CHAT_STREAM_LOCAL_IMAGE, {
                method: 'POST',
                body: formData,
            });
            console.log( response);
            const data = await response.json();


            // for await (const chunk of XStream({
            //     readableStream: response.body,
            //   })) {
            //     console.log(chunk);
            //   }
            
            // 更新AI回复消息
            setMessages(prev => [
                ...prev.slice(0, -1), // 移除loading状态的消息
                {
                    role: 'assistant',
                    placement: 'start',
                    content: data.reply, // 根据实际API返回字段调整
                    avatar: {icon: <RedditOutlined/>},
                }
            ]);
        } catch (error) {
            console.error('提交失败:', error);
            // 更新错误消息
            setMessages(prev => [
                ...prev.slice(0, -1), // 移除loading状态的消息
                {
                    role: 'assistant',
                    placement: 'start',
                    content: '请求失败，请稍后再试',
                    avatar: {icon: <RedditOutlined/>},
                }
            ]);
        } finally {
            setLoading(false);
            setItems([]);
            setText('');
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
        let thoughts = [];
    
        try {
          // 先添加一条空的助手消息
          dispatch(addMessage({ role: 'assistant', content: '', thoughts: '' }));
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
            let hasNewThoughts = false;
            let newThoughts = '';
    
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const rawData = JSON.parse(line.slice(5).trim());
    
                // 处理思考过程
                thoughts = rawData.thoughts;
                if (thoughts && thoughts[2].thought !== undefined && thoughts[2].thought !== null && thoughts[2].thought !== '') {
                  // 将thoughts作为JSON字符串保存
                  newThoughts += thoughts[2].thought;
                  // 更新思考过程
                  dispatch(updateThoughts({
                    index: assistantIndex,
                    thoughts: newThoughts
                  }));
                }
    
                // 处理回答内容
                if(rawData.text !== ''){
                  newContent += rawData.text;
                  hasNewThoughts = false;
                  hasNewContent = true;
                }
    
                // 如果有新的内容，更新内容
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
    
                //处理内容来源
                if(rawData.finish_reason === 'stop'){
                  doc_source = rawData.doc_references;
                  hasNewContent = false;
                }
              } else {
                hasNewContent = false;
                hasNewThoughts = false;
                break;
              }
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

    const senderHeader = (
        <Sender.Header
            title="上传附件"
            open={open}
            onOpenChange={setOpen}
            styles={{
                content: {
                    padding: 0,
                },
            }}
        >
            <Attachments
                // Mock not real upload file
                beforeUpload={() => false}
                items={items}
                onChange={({fileList}) => setItems(fileList)}
                placeholder={(type) =>
                    type === 'drop'
                        ? {
                            title: 'Drop file here',
                        }
                        : {
                            icon: <CloudUploadOutlined/>,
                            title: 'Upload files',
                            description: 'Click or drag files to this area to upload',
                        }
                }
                getDropContainer={() => senderRef.current?.nativeElement}
            />
        </Sender.Header>
    );

    return (
        <Layout>
            {/* 使用从ChatPage导入的样式组件 */}
            <StyledHeader>
                <HeaderContent>
                    <BackButton
                        type="text"
                        icon={<ArrowLeftOutlined/>}
                        onClick={handleBack}
                    >
                        返回
                    </BackButton>
                    <h2>病虫害识别</h2>
                </HeaderContent>
            </StyledHeader>
            <Welcome
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="Hi！我是病虫害百晓生。"
                description="你有什么问题都可以问我， 我会尽力回答你的。"
            />
            <Card>
                <XProvider direction={direction}>
                    <Flex style={{height: 720}} gap={12}>
                        <Conversations
                            style={{width: 200}}
                            defaultActiveKey="1"
                            items={[
                                {
                                    key: '1',
                                    label: 'Conversation - 1',
                                    icon: <GithubOutlined/>,
                                },
                                {
                                    key: '2',
                                    label: 'Conversation - 2',
                                    icon: <AlipayCircleOutlined/>,
                                },
                            ]}
                        />
                        <Divider type="vertical" style={{height: '100%'}}/>
                        <Flex vertical style={{flex: 1}} gap={8}>
                            <Bubble.List
                                style={{flex: 1}}
                                items={messages}
                            />
                            {/*{<Prompts*/}
                            {/*    items={[*/}
                            {/*        {*/}
                            {/*            key: '1',*/}
                            {/*            icon: <BulbOutlined style={{color: '#FFD700'}}/>,*/}
                            {/*            label: 'Ignite Your Creativity',*/}
                            {/*        },*/}
                            {/*        {*/}
                            {/*            key: '2',*/}
                            {/*            icon: <SmileOutlined style={{color: '#52C41A'}}/>,*/}
                            {/*            label: 'Tell me a Joke',*/}
                            {/*        },*/}
                            {/*    ]}*/}
                            {/*/>}*/}
                            <Suggestion items={[{label: 'Write a report', value: 'report'}]}>
                                {({onTrigger, onKeyDown}) => {
                                    return (
                                        <Sender
                                            loading={loading}
                                            ref={senderRef}
                                            header={senderHeader}
                                            prefix={
                                                <Badge dot={items.length > 0 && !open}>
                                                    <Button onClick={() => setOpen(!open)} icon={<LinkOutlined/>}/>
                                                </Badge>
                                            }
                                            value={text}
                                            onChange={setText}
                                            onSubmit={handleSubmit}
                                        />
                                    );
                                }}
                            </Suggestion>
                        </Flex>
                        <Divider type="vertical" style={{height: '100%'}}/>
                        <ThoughtChain
                            style={{width: 200}}
                            items={[
                                {
                                    title: 'Hello Ant Design X!',
                                    status: 'success',
                                    // description: 'status: success',
                                    icon: <CheckCircleOutlined/>,
                                    content: 'Ant Design X help you build AI chat/platform app as ready-to-use 📦.',
                                },
                                {
                                    title: 'Hello World!',
                                    status: 'success',
                                    // description: 'status: success',
                                    icon: <CheckCircleOutlined/>,
                                },
                                {
                                    title: 'Pending...',
                                    status: 'pending',
                                    // description: 'status: pending',
                                    icon: <LoadingOutlined/>,
                                },
                            ]}
                        />
                    </Flex>
                </XProvider>
            </Card>
        </Layout>
    );
};


interface Message {
    role: 'welcome' | 'user' | 'assistant';
    placement?: 'start' | 'end';
    content: string;
    avatar: { icon: React.ReactNode };
    loading?: boolean;
    attachments?: Array<{
        type: 'image';
        url: string;
        name: string;
    }>;
}
