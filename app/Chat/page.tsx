"use client";

import {
  AppstoreAddOutlined,
  CommentOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LikeOutlined,
  PlusOutlined,
  ProductOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  ScheduleOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import {
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from '@ant-design/x';
import { Avatar, Button, Flex, Space, Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Header from '../components/header';

type BubbleDataType = {
  role: string;
  content: string;
};

type MessageStatus = 'success' | 'error' | 'loading' | 'local' | 'updating';

type MessageType = {
  message: {
    content: string;
    role: string;
  };
  id: string | number;
  status: MessageStatus;
};

type ConversationType = {
  key: string;
  label: string;
  group: string;
};

const DEFAULT_CONVERSATIONS_ITEMS = [
  {
    key: 'default-0',
    label: 'Shopping Assistant',
    group: 'Today',
  },
];

const SHOPPING_TOPICS = {
  key: '1',
  label: 'Quick Actions',
  children: [
    {
      key: '1-1',
      description: 'Browse products',
      icon: <ProductOutlined style={{ color: '#1677ff' }} />,
    },
    {
      key: '1-2',
      description: 'Check my orders',
      icon: <ScheduleOutlined style={{ color: '#1677ff' }} />,
    },
    {
      key: '1-3',
      description: 'Track my shipment',
      icon: <FileSearchOutlined style={{ color: '#1677ff' }} />,
    },
    {
      key: '1-4',
      description: 'Help with payment',
      icon: <HeartOutlined style={{ color: '#1677ff' }} />,
    },
  ],
};

const SENDER_PROMPTS = [
  {
    key: '1',
    description: 'Show me products',
    icon: <ProductOutlined />,
  },
  {
    key: '2',
    description: 'Help me order',
    icon: <AppstoreAddOutlined />,
  },
  {
    key: '3',
    description: 'Payment support',
    icon: <HeartOutlined />,
  },
];

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      height: calc(100vh - 64px);
      display: flex;
      background: ${token.colorBgContainer};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    `,
    sider: css`
      background: ${token.colorBgLayout};
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      box-sizing: border-box;
      border-right: 1px solid ${token.colorBorderSecondary};
    `,
    logo: css`
      display: flex;
      align-items: center;
      justify-content: start;
      padding: 0 14px;
      box-sizing: border-box;
      gap: 8px;
      margin: 14px 0;
      font-size: 16px;
      font-weight: bold;

      span {
        font-weight: bold;
        color: ${token.colorText};
        font-size: 36px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      height: 40px;
    `,
    conversations: css`
      flex: 1;
      overflow-y: auto;
      margin-top: 12px;
      padding: 0;

      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    siderFooter: css`
      border-top: 1px solid ${token.colorBorderSecondary};
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
    `,
    userInfo: css`
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;

      .user-name {
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `,
    chat: css`
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: ${token.paddingLG}px;
      gap: 16px;
      background: linear-gradient(to bottom, #f0f7ff, #ffffff);
    `,
    chatPrompt: css`
      .ant-prompts-label {
        color: #000000e0 !important;
      }
      .ant-prompts-desc {
        color: #000000a6 !important;
        width: 100%;
      }
      .ant-prompts-icon {
        color: #000000a6 !important;
      }
    `,
    chatList: css`
      flex: 1;
      overflow: auto;
    `,
    loadingMessage: css`
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #1677ff 0%, #69c0ff 50%, #1677ff 100%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
    senderPrompt: css`
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      color: ${token.colorText};
    `,
  };
});

const MiraChatbot: React.FC = () => {
  const { styles } = useStyle();
  const abortController = useRef<AbortController | null>(null);

  // ==================== State ====================
  const [messageHistory, setMessageHistory] = useState<Record<string, MessageType[]>>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_message_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved message history:', e);
        }
      }
    }
    return {};
  });

  const [conversations, setConversations] = useState<ConversationType[]>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_conversations');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing saved conversations:', e);
        }
      }
    }
    return DEFAULT_CONVERSATIONS_ITEMS;
  });

  const [curConversation, setCurConversation] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_current_conversation');
      if (saved) {
        return saved;
      }
    }
    return DEFAULT_CONVERSATIONS_ITEMS[0].key;
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [sessionId] = useState<string>(() => {
    // Get or create session ID
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chat_session_id');
      if (stored) return stored;
      const newId = crypto.randomUUID();
      localStorage.setItem('chat_session_id', newId);
      return newId;
    }
    return crypto.randomUUID();
  });
  const [isStreaming, setIsStreaming] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const displayName = localStorage.getItem('displayName');
    const firstName = localStorage.getItem('firstName');

    setIsLoggedIn(!!token);
    if (displayName) {
      setUserName(displayName);
    } else if (firstName) {
      setUserName(firstName);
    }
  }, []);

  // ==================== MIRA AI Integration ====================
  const PUBLIC_CLIENT_KEY = process.env.NEXT_PUBLIC_CLIENT_KEY || '';
  const COMPANY_ID = parseInt(process.env.NEXT_PUBLIC_COMPANY_ID || '1');
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mira-chat.grayscale-technologies.com';

  const [agent] = useXAgent<BubbleDataType>({
    request: async ({ message, messages }, { onUpdate }) => {
      try {
        setIsStreaming(true);
        const accessToken = localStorage.getItem('access_token');

        // Build conversation history with null checks
        const conversationHistory = (messages || [])
          .filter(msg => msg?.content && msg.content.trim())
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

        // Add the current message to history
        const allMessages = [
          ...conversationHistory,
          { role: 'user', content: message?.content || '' }
        ];

        // Set authorization header
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        if (isLoggedIn && accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        } else {
          headers['Authorization'] = `Client-Key ${PUBLIC_CLIENT_KEY}`;
        }

        const response = await fetch(`${BASE_URL}/chat`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            session_id: sessionId,
            company_id: COMPANY_ID,
            messages: allMessages
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let buffer = '';
        const pendingChunks: string[] = [];

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Parse SSE (Server-Sent Events) format
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.substring(6);
                  const parsed = JSON.parse(jsonStr);

                  // Extract text from the data object
                  if (parsed.type === 'text' && parsed.data) {
                    pendingChunks.push(parsed.data);
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }

          // Process any remaining data in the buffer
          if (buffer.trim() && buffer.startsWith('data: ')) {
            try {
              const jsonStr = buffer.substring(6);
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'text' && parsed.data) {
                pendingChunks.push(parsed.data);
              }
            } catch (e) {
              console.error('Error parsing final chunk:', e);
            }
          }

          // Stream the accumulated chunks character by character
          const fullText = pendingChunks.join('');
          const charsPerUpdate = 5; // Update 5 characters at a time

          for (let i = 0; i < fullText.length; i += charsPerUpdate) {
            accumulatedText = fullText.slice(0, Math.min(i + charsPerUpdate, fullText.length));
            onUpdate({
              data: JSON.stringify({
                role: 'assistant',
                content: accumulatedText,
              }),
            });

            // Small delay between updates for smooth typewriting effect
            if (i + charsPerUpdate < fullText.length) {
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }

          // Ensure we have the complete text
          accumulatedText = fullText;
        }

        const finalContent = accumulatedText || 'No response received';
        console.log('Request completed, setting isStreaming to false');
        setIsStreaming(false);
        return {
          content: finalContent,
          role: 'assistant'
        };
      } catch (error) {
        console.error('Chat error:', error);
        setIsStreaming(false);
        throw error;
      }
    }
  });

  const loading = isStreaming;

  const { onRequest, messages, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request cancelled',
          role: 'assistant',
        };
      }
      return {
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
      };
    },
  });

  // Initialize with welcome message or load saved messages
  useEffect(() => {
    // Load messages when conversation changes
    if (messageHistory[curConversation]) {
      setMessages(messageHistory[curConversation]);
    } else {
      // Initialize with welcome message only if no saved messages
      setMessages([
        {
          message: {
            content: `Hello${isLoggedIn ? ' ' + userName : ''}! I'm MIRA, your AI shopping assistant. I can help you find products, place orders, and answer any questions you have. What would you like to do today?`,
            role: 'assistant'
          },
          id: 'welcome',
          status: 'success'
        }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curConversation, messageHistory]);

  // ==================== Event Handlers ====================
  const onSubmit = (val: string) => {
    if (!val?.trim()) return;

    if (loading) {
      message.error('Please wait for the current response to complete.');
      return;
    }

    onRequest({
      message: { role: 'user', content: val },
    });
  };

  // ==================== Render Nodes ====================
  const chatSider = (
    <div className={styles.sider}>
      {/* Logo */}
      <div className={styles.logo}>
        {/* <Image
          src="/mira-ai.png"
          alt="MIRA AI"
          width={122}
          height={62}
          style={{ objectFit: 'contain' }}
        /> */}
  Manage Conversations
      </div>

      {/* Add Conversation */}
      <Button
        onClick={() => {
          if (agent.isRequesting()) {
            message.error('Please wait for the current message to complete.');
            return;
          }

          const now = dayjs().valueOf().toString();
          setConversations([
            {
              key: now,
              label: `Chat ${conversations.length + 1}`,
              group: 'Today',
            },
            ...conversations,
          ]);
          setCurConversation(now);
          setMessages([
            {
              message: {
                content: `Hello${isLoggedIn ? ' ' + userName : ''}! I'm MIRA, your AI shopping assistant. How can I help you today?`,
                role: 'assistant'
              },
              id: 'welcome-' + now,
              status: 'success'
            }
          ]);
        }}
        type="link"
        className={styles.addBtn}
        icon={<PlusOutlined />}
      >
        New Chat
      </Button>

      {/* Conversations */}
      <Conversations
        items={conversations}
        className={styles.conversations}
        activeKey={curConversation}
        onActiveChange={async (val) => {
          abortController.current?.abort();
          setTimeout(() => {
            setCurConversation(val);
            setMessages(messageHistory?.[val] || []);
          }, 100);
        }}
        groupable
        styles={{ item: { padding: '0 8px' } }}
        menu={(conversation) => ({
          items: [
            {
              label: 'Rename',
              key: 'rename',
              icon: <EditOutlined />,
            },
            {
              label: 'Delete',
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              onClick: () => {
                const newList = conversations.filter((item) => item.key !== conversation.key);
                const newKey = newList?.[0]?.key;
                setConversations(newList);
                setTimeout(() => {
                  if (conversation.key === curConversation) {
                    setCurConversation(newKey);
                    setMessages(messageHistory?.[newKey] || []);
                  }
                }, 200);
              },
            },
          ],
        })}
      />

      {/* Footer */}
      <div className={styles.siderFooter}>
        <div className={styles.userInfo}>
          <Avatar size={32} style={{ backgroundColor: '#1677ff' }}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <span className="user-name">{userName}</span>
        </div>
        <Button type="text" icon={<QuestionCircleOutlined />} href="/" />
      </div>
    </div>
  );

  const chatList = (
    <div className={styles.chatList}>
      {messages?.length > 1 ? (
        <Bubble.List
          items={messages?.map((i) => ({
            ...i.message,
            key: i.id,
            classNames: {
              content: i.status === 'loading' ? styles.loadingMessage : '',
            },
            typing: i.message.role === 'assistant' && i.status === 'loading' ? { step: 3, interval: 20 } : false,
            variant: 'shadow',
          }))}
          style={{ height: '100%', paddingInline: 'calc((100% - 700px) / 2)' }}
          roles={{
            assistant: {
              placement: 'start',
              avatar: {
                src: '/mira-ai.png',
                style: { background: 'transparent' }
              },
              typing: { step: 3, interval: 20 },
              messageRender: (content) => (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p style={{ margin: '0.5em 0' }}>{children}</p>,
                    strong: ({ children }) => <strong style={{ fontWeight: 600, color: '#000' }}>{children}</strong>,
                    ul: ({ children }) => <ul style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>{children}</ul>,
                    ol: ({ children }) => <ol style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>{children}</ol>,
                    li: ({ children }) => <li style={{ margin: '0.25em 0' }}>{children}</li>,
                    h1: ({ children }) => <h1 style={{ fontSize: '1.5em', fontWeight: 600, margin: '0.5em 0' }}>{children}</h1>,
                    h2: ({ children }) => <h2 style={{ fontSize: '1.3em', fontWeight: 600, margin: '0.5em 0' }}>{children}</h2>,
                    h3: ({ children }) => <h3 style={{ fontSize: '1.1em', fontWeight: 600, margin: '0.5em 0' }}>{children}</h3>,
                  }}
                >
                  {String(content)}
                </ReactMarkdown>
              ),
              styles: {
                content: {
                  background: '#f7f7f8',
                  lineHeight: '1.6',
                }
              },
              footer: (
                <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                  <Button type="text" size="small" icon={<CopyOutlined />} />
                  <Button type="text" size="small" icon={<LikeOutlined />} />
                  <Button type="text" size="small" icon={<DislikeOutlined />} />
                </div>
              ),
              loadingRender: () => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Spin size="small" />
                  <span style={{ color: '#999' }}>MIRA is thinking...</span>
                </div>
              ),
            },
            user: {
              placement: 'end',
              avatar: {
                children: userName.charAt(0).toUpperCase(),
                style: { backgroundColor: '#1677ff' }
              },
              styles: {
                content: {
                  background: '#1677ff',
                  color: '#ffffff',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                }
              }
            },
          }}
        />
      ) : (
        <Space
          direction="vertical"
          size={16}
          style={{ paddingInline: 'calc((100% - 700px) / 2)' }}
          className={styles.placeholder}
        >
          <Welcome
            variant="borderless"
            icon={<Image src="/mira-ai.png" alt="MIRA AI" width={100} height={100} />}
            title="Welcome to MIRA AI"
            description="Your intelligent shopping assistant. I can help you browse products, place orders, track shipments, and answer any questions about your purchases."
            
          />
         
        </Space>
      )}
    </div>
  );

  const chatSender = (
    <>
      <Prompts
        items={SENDER_PROMPTS}
        onItemClick={(info) => {
          onSubmit(info.data.description as string);
        }}
        styles={{
          item: { padding: '6px 12px' },
        }}
        className={styles.senderPrompt}
      />
      <Sender
        value={inputValue}
        onSubmit={() => {
          onSubmit(inputValue);
          setInputValue('');
        }}
        onChange={setInputValue}
        onCancel={() => {
          abortController.current?.abort();
        }}
        loading={loading}
        className={styles.sender}
        allowSpeech
        actions={(_, info) => {
          const { SendButton, LoadingButton, SpeechButton } = info.components;
          return (
            <Flex gap={4}>
              <SpeechButton className={styles.speechButton} />
              {loading ? <LoadingButton type="default" /> : <SendButton type="primary" />}
            </Flex>
          );
        }}
        placeholder="Ask me anything about shopping..."
      />
    </>
  );

  // Reset streaming state when a message completes
  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // If the last message is from assistant and has success status, streaming is done
      if (lastMessage?.message?.role === 'assistant' && lastMessage?.status === 'success') {
        console.log('Message completed, resetting streaming state');
        setIsStreaming(false);
      }
    }
  }, [messages]);

  // Save message history and auto-name conversations
  useEffect(() => {
    if (messages?.length) {
      setMessageHistory((prev) => {
        const updated = {
          ...prev,
          [curConversation]: messages,
        };
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('chat_message_history', JSON.stringify(updated));
        }
        return updated;
      });

      // Auto-name conversation based on first user message
      const firstUserMessage = messages.find(msg => msg.message?.role === 'user');
      if (firstUserMessage && firstUserMessage.message?.content) {
        const currentConv = conversations.find(c => c.key === curConversation);
        if (currentConv && currentConv.label.startsWith('Chat ')) {
          // Only update if it's still the default name
          const content = firstUserMessage.message.content;
          const shortLabel = content.length > 30 ? content.substring(0, 30) + '...' : content;

          setConversations(prev =>
            prev.map(conv =>
              conv.key === curConversation
                ? { ...conv, label: shortLabel }
                : conv
            )
          );
        }
      }
    }
  }, [messages, curConversation]);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save current conversation to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_current_conversation', curConversation);
    }
  }, [curConversation]);

  // ==================== Render ====================
  return (
    <>
      <Header />
      <div className={styles.layout}>
        {chatSider}
        <div className={styles.chat}>
          {chatList}
          {chatSender}
        </div>
      </div>
    </>
  );
};

export default MiraChatbot;
