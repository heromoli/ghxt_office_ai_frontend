import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import {
    Attachments,
    AttachmentsProps,
    Bubble,
    Prompts,
    Sender,
    Suggestion,
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
    GetProp,
    Image,
    Layout,
    Collapse,
    type GetRef,
} from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import {
    ArrowLeftOutlined,
    UserOutlined,
    RedditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';
import { fixMarkdown } from '../../utils/markdownHelpers';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import type { RcFile } from 'antd/es/upload/interface';
import DingtalkAuth from '../../components/DingtalkAuth';

// 导入昆虫图片
import belc from '../../components/ModuleCards/icons/白蛾蜡蝉.jpg';
import bce from '../../components/ModuleCards/icons/扁刺蛾.jpg';
import dfs from '../../components/ModuleCards/icons/稻飞虱.jpg';
import ehm from '../../components/ModuleCards/icons/二化螟.jpg';
import hzz from '../../components/ModuleCards/icons/红蜘蛛.jpg';
import jm from '../../components/ModuleCards/icons/蓟马.jpg';
import lc from '../../components/ModuleCards/icons/荔蝽.jpg';
import sybqy from '../../components/ModuleCards/icons/三叶斑潜蝇.jpg';
import yzze from '../../components/ModuleCards/icons/椰子织蛾.jpg';
import ytch from '../../components/ModuleCards/icons/油桐尺蠖.jpg';
import ymm from '../../components/ModuleCards/icons/玉米螟.jpg';
import cblc from '../../components/ModuleCards/icons/长鼻蜡蝉.jpg';
import zbe from '../../components/ModuleCards/icons/蔗扁蛾.jpg';

export default () => {
    const [messages, setMessages] = React.useState<Message[]>([
        // {
        //     role: 'welcome',
        //     placement: 'start',
        //     content: 'Hi！我是病虫害识别小能手，已经接入DeepSeek深度思考能力。',
        //     avatar: {icon: <RedditOutlined/>},
        // }
    ]);
    const [loading, setLoading] = React.useState(false);
    const [direction, setDirection] =
        React.useState<GetProp<ConfigProviderProps, 'direction'>>('ltr');

    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
    const [text, setText] = React.useState('');
    const [tempFileInfo, setTempFileInfo] = React.useState<{
        name: string;
        size: number;
        type: string;
        preview: string;
    } | null>(null);
    const [dingReady, setDingReady] = useState(false);
    const handleDingReady = () => {
        setDingReady(true);
        // 可以在这里调用钉钉API
        console.log('DingTalk is ready!');
      };

    const senderRef = React.useRef<GetRef<typeof Sender> & { handleSubmit: () => void }>(null);
    const { Header, Content } = Layout;
    const { Panel } = Collapse;
    const QuickQuestions = styled.div`
        display: flex;
        flex-wrap: nowrap;
        gap: 12px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding: 8px 0;
        max-width: 95vw;
        box-sizing: border-box;
        margin: 0 auto;
        &::-webkit-scrollbar {
          height: 6px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 3px;
        }
    `;

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
        // console.log('formData:', formData); // 打印上传的文件信息
        items.forEach(item => {
            // console.log(item);
            if (item.originFileObj) {
                formData.append('file', item.originFileObj);
            }
        });

        // 添加用户消息和上传的图片
        setMessages(prev => [
            ...prev,
            {
                role: 'file',
                placement: 'end',
                content: (
                    <div>
                      <Image
                        width={160}
                        src={items[0].thumbUrl}
                        preview={{ mask: '点击放大' }}
                        // src="https://ai-public.mastergo.com/ai/img_res/da11e9813f0382bc3abfaae3a900d7da.jpg"
                      />
                    </div>
                  ),
                avatar: { icon: <UserOutlined /> }
            },
            {
                role: 'user',
                placement: 'end',
                content: text,
                avatar: { icon: <UserOutlined /> }
            },
            {
                role: 'assistant',
                content: '',
                loading: true,
                avatar: { icon: <RedditOutlined /> },
            }
        ]);

        try {
            const response = await fetch(API_ENDPOINTS.CHAT_STREAM_LOCAL_IMAGE, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 直接处理流式响应
            await handleStreamResponse(response);
        } catch (error) {
            console.error('提交失败:', error);
            // 更新错误消息
            setMessages(prev => [
                ...prev.slice(0, -1), // 移除loading状态的消息
                {
                    role: 'assistant',
                    placement: 'start',
                    content: error instanceof Error ? error.message : '请求失败，请稍后再试',
                    avatar: { icon: <RedditOutlined /> },
                }
            ]);
        } finally {
            setLoading(false);
            setItems([]);
            setText('');
        }
    };

    const getBase64Preview = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
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
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split('\n');

                // 保留最后一行（可能不完整）
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const rawData = JSON.parse(line.slice(5).trim());
                        // if (rawData.choices[0].message.content.length > 0 && rawData.choices[0].message.content[0].text) {
                        //     fullResponse += rawData.choices[0].message.content[0].text;
                        if (rawData.text) {
                            fullResponse += rawData.text;

                            // 实时更新消息内容，保留markdown格式
                            setMessages(prev => [
                                ...prev.slice(0, -1),
                                {
                                    role: 'assistant',
                                    placement: 'start',
                                    content: fixMarkdown(fullResponse),
                                    avatar: { icon: <RedditOutlined /> }
                                }
                            ]);

                        }
                    }
                }

                // 强制触发重新渲染
                await new Promise(resolve => setTimeout(resolve, 0));
                // buffer = lines.length > 1 ? lines[lines.length - 1] : '';

            }
        } catch (error) {
            console.error('流式响应处理失败:', error);
            setMessages(prev => [
                ...prev.slice(0, -1),
                {
                    role: 'assistant',
                    placement: 'start',
                    content: '流式响应处理失败，请稍后再试',
                    avatar: { icon: <RedditOutlined /> },
                }
            ]);
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
                maxCount={1}
                multiple={false} // 不允许同时上传多个文件
                beforeUpload={() => false}
                items={items}
                // onChange={({fileList}) => setItems(fileList)}
                onChange={async ({ fileList }) => {
                    if (fileList.length > 0 && fileList[0].originFileObj) {
                        const currentFile = fileList[0];
                        const base64Preview = await getBase64Preview(currentFile.originFileObj as File);
                        currentFile.thumbUrl = base64Preview as string;
                        // console.log('手动生成的缩略图 Base64:', base64Preview);
                        setTempFileInfo({
                            name: currentFile.name,
                            size: currentFile.size || 0,
                            type: currentFile.type || '',
                            preview: base64Preview as string
                        });
                    } else {
                        setTempFileInfo(null);
                    }
                    setItems(fileList);
                }}
                placeholder={(type) =>
                    type === 'drop'
                        ? {
                            title: '拖拽文件到此处',
                        }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: '上传图片',
                            description: '点击或拖拽文件到此处',
                        }
                }
                getDropContainer={() => senderRef.current?.nativeElement}
            />
        </Sender.Header>
    );

    return (
        <Layout>
                  {/* <DingtalkAuth onReady={handleDingReady} /> */}
            {/* 使用从ChatPage导入的样式组件 */}
            <StyledHeader>
                <HeaderContent>
                    <BackButton
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                    >
                        返回
                    </BackButton>
                    <h2>病虫害识别</h2>
                </HeaderContent>
            </StyledHeader>
            <Welcome
                icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                title="Hi！我是智能病虫害识别小助手。"
                description="您可以点击示例图片或手动上传图片，我将帮您识别病虫害类型。"
            />
            <Card>
                <XProvider direction={direction}>
                    <Flex style={{ height: 'calc(100vh - 210px)' }} gap={12}>
                        <Flex vertical style={{ flex: 1 }} gap={8}>
                            <div style={{ position: 'relative' }}>
                                <Collapse
                                    defaultActiveKey={['1']} // 默认展开（可选）
                                    bordered={false} // 是否显示边框
                                    ghost // 透明背景
                                >
                                    <Panel
                                        header="常见病虫害示例"
                                        key="1"
                                        style={{ background: 'transparent',padding: 0}}
                                    >
                                        <QuickQuestions>
                                            {[

                                                {
                                                    image: lc,
                                                    title: '荔蝽',
                                                    description: ''
                                                },
                                                {
                                                    image: cblc,
                                                    title: '长鼻蜡蝉',
                                                    description: ''
                                                },
                                                {
                                                    image: ehm,
                                                    title: '二化螟',
                                                    description: ''
                                                },
                                                {
                                                    image: bce,
                                                    title: '扁刺蛾',
                                                    description: ''
                                                },

                                                {
                                                    image: ytch,
                                                    title: '油桐尺蠖',
                                                    description: ''
                                                },
                                                {
                                                    image: ymm,
                                                    title: '玉米螟',
                                                    description: ''
                                                },
                                                {
                                                    image: belc,
                                                    title: '白蛾蜡蝉',
                                                    description: ''
                                                },
                                                {
                                                    image: dfs,
                                                    title: '稻飞虱',
                                                    description: ''
                                                },
                                                {
                                                    image: hzz,
                                                    title: '红蜘蛛',
                                                    description: ''
                                                },

                                                {
                                                    image: jm,
                                                    title: '蓟马',
                                                    description: ''
                                                },
                                                // {
                                                //     image: sybqy,
                                                //     title: '三叶斑潜蝇',
                                                //     description: ''
                                                // },
                                                // {
                                                //     image: zbe,
                                                //     title: '蔗扁蛾',
                                                //     description: ''
                                                // },
                                                // {
                                                //     image: yzze,
                                                //     title: '椰子织蛾',
                                                //     description: ''
                                                // },

                                            ].map((item, index) => (
                                                <div key={index} style={{ scrollSnapAlign: 'start', minWidth: '224px' }}>
                                                    <Button
                                                        type="default"
                                                        onClick={async () => {
                                                            // setText('请介绍' + item.title);
                                                            setText('请识别这是什么昆虫？');
                                                            const response = await fetch(item.image);
                                                            const blob = await response.blob();
                                                            const file = new File([blob], item.title + '.jpg', { type: 'image/jpeg' });
                                                            const base64Preview = await getBase64Preview(file);
                                                            setItems([{
                                                                uid: Date.now().toString(),
                                                                name: item.title + '.jpg',
                                                                status: 'done',
                                                                originFileObj: file as unknown as RcFile,  //类型断言强制转换为RcFile类型
                                                                thumbUrl: base64Preview as string
                                                            }]);
                                                            senderRef.current?.handleSubmit();
                                                        }}
                                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'auto', padding: '12px' }}
                                                    >
                                                        <img src={item.image} style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} alt={item.title} />
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>{item.description}</div>
                                                        </div>
                                                    </Button>
                                                </div>
                                            ))}
                                        </QuickQuestions>
                                    </Panel>
                                </Collapse>
                            </div>

                            <Bubble.List
                                style={{ flex: 1 }}
                                items={messages.map(msg => ({
                                    ...msg,
                                    content: msg.role === 'file' ? msg.content : <MarkdownRenderer content={msg.content} isLoading={msg.loading} />,  
                                    style: msg.role === 'assistant' ? { textAlign: 'left' } : { textAlign: 'right' }
                                }))}
                            />
                            <Suggestion items={[{ label: 'Write a report', value: 'report' }]}>
                                {({ onTrigger, onKeyDown }) => {
                                    return (
                                        <Sender
                                            loading={loading}
                                            ref={senderRef}
                                            header={senderHeader}
                                            prefix={
                                                <Badge dot={items.length > 0 && !open}>
                                                    <Button onClick={() => setOpen(!open)} icon={<LinkOutlined />} />
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
                    </Flex>
                </XProvider>
            </Card>
        </Layout>
    );
};


interface Message {
    role: 'file' | 'user' | 'assistant';
    placement?: 'start' | 'end';
    content: React.ReactNode | string;
    avatar: { icon: React.ReactNode };
    loading?: boolean;
    attachments?: { type: 'image'; url: string; name: string; preview: string }[];
}
