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
    XProvider
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
            if (item.originFileObj) {
                formData.append('file', item.originFileObj);
            }
        });

        // 添加用户消息
        setMessages(prev => [
            ...prev,
            {
                role: 'user',
                placement: 'end',
                content: text,
                avatar: {icon: <UserOutlined/>},
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
            const data = await response.json();
            if(data.status === 200){
                console.log('提交成功:', data.reply);
            }
            
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
}
