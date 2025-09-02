// utils/ChatInput.tsx

import React from 'react';
import { Card, Input, Button, Space, Alert } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { ChatInputProps } from './chatIndex';

const ChatInput: React.FC<ChatInputProps> = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isTyping, 
  error 
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <Card 
      style={{ 
        borderRadius: 0, 
        borderTop: '1px solid #f0f0f0',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)'
      }}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Error Display */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ borderRadius: '8px' }}
          />
        )}

        {/* Input Area */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to buy today?"
            disabled={isTyping}
            size="large"
            style={{
              borderRadius: '12px',
              border: '2px solid #f0f0f0',
              fontSize: '14px',
              padding: '12px 16px',
              height: 'auto',
              minHeight: '48px'
            }}
            suffix={
              isTyping && (
                <LoadingOutlined style={{ color: '#1890ff' }} />
              )
            }
          />
          
          <Button 
            type="primary"
            icon={<SendOutlined />}
            onClick={onSendMessage}
            loading={isTyping}
            disabled={isTyping || !inputMessage.trim()}
            size="large"
            
          />
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#666',
            fontSize: '12px'
          }}>
            <LoadingOutlined />
            <span>Mira is typing...</span>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ChatInput;