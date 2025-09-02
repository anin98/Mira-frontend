// components/Dashboard/ConversationsPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Avatar, 
  Badge, 
  Button, 
  List, 
  Typography, 
  Space, 
  Spin,
  Empty,
  message
} from 'antd';
import { 
  SearchOutlined, 
  MessageOutlined, 
  UserOutlined,
  SendOutlined,
  MoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

interface Conversation {
  id: string;
  name: string;
  email: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'sent' | 'received';
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await fetch('/api/conversations');
      // const data = await response.json();
      // setConversations(data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockConversations: Conversation[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            lastMessage: 'Thanks for the quick response!',
            timestamp: '2 min ago',
            unreadCount: 2,
            status: 'online'
          },
          {
            id: '2',
            name: 'Sarah Smith',
            email: 'sarah@example.com',
            lastMessage: 'When will my order arrive?',
            timestamp: '1 hour ago',
            unreadCount: 0,
            status: 'away'
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            lastMessage: 'I need help with my account',
            timestamp: '3 hours ago',
            unreadCount: 1,
            status: 'offline'
          }
        ];
        setConversations(mockConversations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      message.error('Failed to load conversations');
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      // Replace with actual API call
      // const response = await fetch(`/api/conversations/${conversationId}/messages`);
      // const data = await response.json();
      // setMessages(data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: '1',
            senderId: conversationId,
            content: 'Hello, I have a question about my order',
            timestamp: '10:30 AM',
            type: 'received'
          },
          {
            id: '2',
            senderId: 'admin',
            content: 'Hi! I\'d be happy to help you with your order. What\'s your order number?',
            timestamp: '10:32 AM',
            type: 'sent'
          },
          {
            id: '3',
            senderId: conversationId,
            content: 'It\'s #ORD-12345',
            timestamp: '10:33 AM',
            type: 'received'
          }
        ];
        setMessages(mockMessages);
        setMessagesLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      message.error('Failed to load messages');
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // Replace with actual API call
      // await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
      //   method: 'POST',
      //   body: JSON.stringify({ content: newMessage })
      // });

      // Mock sending message
      const newMsg: Message = {
        id: Date.now().toString(),
        senderId: 'admin',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'sent'
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      message.success('Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      message.error('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#52c41a';
      case 'away': return '#faad14';
      case 'offline': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <Title level={4} className="mb-4">Conversations</Title>
          <Search
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>
        
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Spin size="large" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <Empty 
              description="No conversations found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              dataSource={filteredConversations}
              renderItem={(conversation) => (
                <List.Item
                  className={`cursor-pointer hover:bg-gray-50 px-4 ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot 
                        color={getStatusColor(conversation.status)}
                        offset={[-2, 32]}
                      >
                        <Avatar icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{conversation.name}</span>
                        <div className="flex items-center space-x-2">
                          <Text type="secondary" className="text-xs">
                            {conversation.timestamp}
                          </Text>
                          {conversation.unreadCount > 0 && (
                            <Badge count={conversation.unreadCount} size="small" />
                          )}
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <Text type="secondary" className="text-xs block">
                          {conversation.email}
                        </Text>
                        <Text className="text-sm truncate block mt-1">
                          {conversation.lastMessage}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge 
                  dot 
                  color={getStatusColor(selectedConversation.status)}
                  offset={[-2, 32]}
                >
                  <Avatar icon={<UserOutlined />} />
                </Badge>
                <div>
                  <Title level={5} className="mb-0">{selectedConversation.name}</Title>
                  <Text type="secondary" className="text-sm">
                    {selectedConversation.email} • {selectedConversation.status}
                  </Text>
                </div>
              </div>
              <Button type="text" icon={<MoreOutlined />} />
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Spin />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'sent'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onPressEnter={handleSendMessage}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                />
              </Space.Compact>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageOutlined className="text-4xl text-gray-300 mb-4" />
              <Title level={4} type="secondary">Select a conversation</Title>
              <Text type="secondary">Choose a conversation from the list to start messaging</Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}