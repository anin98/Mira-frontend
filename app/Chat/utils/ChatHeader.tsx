// utils/ChatHeader.tsx

import React from 'react';
import Link from 'next/link';
import {
  Card,
  Space,
  Avatar,
  Badge,
  Typography
} from 'antd';
import {
  WifiOutlined,
  DisconnectOutlined,
  LoginOutlined,
  TeamOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { ChatHeaderProps } from './chatIndex';

const { Title, Text } = Typography;

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isLoggedIn,
  hasError,
  typingState = "",
  isTyping = false
}) => {
  return (
    <Card 
      style={{ 
        borderRadius: 0, 
        borderBottom: '1px solid #f0f0f0',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size="middle">
          <Link href="/" style={{ cursor: 'pointer', display: 'flex' }}>
            <Avatar
              size={40}
              icon={isTyping ? <LoadingOutlined spin /> : undefined}
              src={!isTyping ? '/mira-ai.png' : undefined}
              style={{
                background: isTyping
                  ? 'linear-gradient(135deg, #52c41a, #73d13d)'
                  : 'transparent',
                boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                width: '40px',
                height: '40px',
                overflow: 'hidden'
              }}
            />
          </Link>
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Title level={4} style={{ margin: 0, color: '#1f2937', cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-blue-600">
                MIRA AI
              </Title>
            </Link>
            {isTyping && typingState ? (
              <Text
                style={{
                  fontSize: '12px',
                  color: '#52c41a',
                  fontWeight: 500,
                  animation: 'pulse 2s infinite'
                }}
              >
                {typingState}
              </Text>
            ) : (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Your intelligent sales assistant
              </Text>
            )}
          </div>
        </Space>

        <Space size="large">
          <Space size="small">
            <Badge 
              color={hasError ? '#ff4d4f' : '#52c41a'} 
              text={
                <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                  {hasError ? 'Disconnected' : 'Connected'}
                </Text>
              }
            />
            {hasError ? (
              <DisconnectOutlined style={{ color: '#ff4d4f' }} />
            ) : (
              <WifiOutlined style={{ color: '#52c41a' }} />
            )}
          </Space>
          <Space size="small">
            <Badge 
              color={isLoggedIn ? '#1890ff' : '#d9d9d9'} 
              text={
                <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                  {isLoggedIn ? 'Logged In' : 'Guest'}
                </Text>
              }
            />
            {isLoggedIn ? (
              <LoginOutlined style={{ color: '#1890ff' }} />
            ) : (
              <TeamOutlined style={{ color: '#d9d9d9' }} />
            )}
          </Space>
        </Space>
      </div>
    </Card>
  );
};

export default ChatHeader;