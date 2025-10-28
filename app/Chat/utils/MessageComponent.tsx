// utils/MessageComponent.tsx

import React from 'react';
import { Card, Avatar, Button, Tag } from 'antd';
import { UserOutlined, RobotOutlined, QrcodeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ClientTime from './ClientTime';
import { MessageComponentProps } from './chatIndex';

const MessageComponent: React.FC<MessageComponentProps> = ({
  message,
  formatMessage,
  storedQRUrl = "",
  paymentCompleted = false,
  isThinking = false
}) => {
  const displayText = message.displayedText || message.text || "";
  
  if (!displayText && !message.isStreaming) {
    return null;
  }

  const messageContent = displayText || (message.isStreaming ? "..." : "No message content");
  const isUser = message.sender === "user";

  // Check if this message contains QR code information
  const hasQRInfo = messageContent.includes('bKash') || 
                   messageContent.includes('QR Code') || 
                   messageContent.includes('Scan') ||
                   messageContent.includes('this QR code') ||
                   messageContent.includes('Send money to');

  // Extract QR URL if present
  const extractQRFromMessage = (text: string): string | null => {
    const qrRegex = /(https?:\/\/[^\s]+(?:qr|QR|qrcode)[^\s]*)/gi;
    const match = qrRegex.exec(text);
    return match ? match[1] : null;
  };

  const messageQRUrl = extractQRFromMessage(messageContent);
  const qrUrl = messageQRUrl || storedQRUrl;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16
    }}>
      <div style={{ 
        maxWidth: '75%', 
        display: 'flex', 
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: 8
      }}>
        <Avatar 
          size={32}
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{ 
            backgroundColor: isUser ? '#1890ff' : '#52c41a',
            flexShrink: 0
          }}
        />
        
        <Card
          size="small"
          style={{
            backgroundColor: isUser ? '#1890ff' : '#ffffff',
            border: isUser ? 'none' : '1px solid #f0f0f0',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative'
          }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          {/* Payment Status Tag */}
          {hasQRInfo && !isUser && (
            <div style={{ marginBottom: 8 }}>
              {paymentCompleted ? (
                <Tag 
                  icon={<CheckCircleOutlined />} 
                  color="success"
                  style={{ fontWeight: 500 }}
                >
                  Payment Completed
                </Tag>
              ) : qrUrl && (
                <Tag 
                  icon={<QrcodeOutlined />} 
                  color="processing"
                  style={{ fontWeight: 500 }}
                >
                  Payment Required
                </Tag>
              )}
            </div>
          )}

          {/* Message Content */}
          <div
            style={{
              color: isUser ? '#ffffff' : '#000000',
              fontSize: '14px',
              lineHeight: '1.6',
              wordBreak: 'break-word'
            }}
            dangerouslySetInnerHTML={{
              __html: formatMessage(messageContent) +
                     (message.isStreaming && displayText ? '<span style="animation: blink 1s infinite; margin-left: 4px;">|</span>' : '')
            }}
          />

          {/* QR Code Button - Only show if message contains payment info and payment not completed */}
          {hasQRInfo && !isUser && qrUrl && !paymentCompleted && !messageContent.includes('<button') && (
            <div style={{ 
              marginTop: 12, 
              textAlign: 'center',
              borderTop: '1px solid #f0f0f0',
              paddingTop: 12
            }}>
             
            </div>
          )}

          {/* Payment Completed Indicator */}
          {hasQRInfo && !isUser && paymentCompleted && (
            <div style={{ 
              marginTop: 12, 
              textAlign: 'center',
              borderTop: '1px solid #f0f0f0',
              paddingTop: 12
            }}>
              <div style={{
                background: '#f6ffed',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #b7eb8f',
                color: '#52c41a',
                fontWeight: 600,
                fontSize: '12px'
              }}>
                <CheckCircleOutlined style={{ marginRight: 4 }} />
                Payment Completed Successfully
              </div>
            </div>
          )}
          
          {/* Timestamp */}
          <div style={{ 
            marginTop: 8, 
            textAlign: isUser ? 'right' : 'left',
            opacity: 0.7
          }}>
            <ClientTime date={message.timestamp} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessageComponent;