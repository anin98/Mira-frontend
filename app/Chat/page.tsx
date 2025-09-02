// Updated page.tsx with enhanced typing and thinking states

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { message as antdMessage, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Message, ChatMessage } from './utils/chatIndex';
import { extractQRCodeUrl, hasQRCode, formatMessage } from './utils/MessageUtils';
import { APIService } from './utils/apiService';

// Components
import ChatHeader from './utils/ChatHeader';
import MessageComponent from './utils/MessageComponent';
import ChatInput from './utils/ChatInput';
import PaymentImageModal from './utils/PaymentModal';

const MiraChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello, this is Mira. I will assist you on your purchase today. What would you like to buy?",
      sender: "bot",
      timestamp: new Date(),
      isStreaming: true,
      displayedText: ""
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string>("");
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>("1");
  const [paymentImageUrl, setPaymentImageUrl] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // QR Code Management State
  const [storedQRUrl, setStoredQRUrl] = useState<string>("");
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [showPaymentStatus, setShowPaymentStatus] = useState<boolean>(false);
  const [autoOpenedQR, setAutoOpenedQR] = useState<boolean>(false);
  
  // Enhanced Typing States
  const [thinkingState, setThinkingState] = useState<string>("");
  const [typingState, setTypingState] = useState<string>("idle"); // idle, thinking, formulating, generating, typing
  const [currentThinkingIndex, setCurrentThinkingIndex] = useState<number>(0);
  
  const apiService = new APIService();

  // Thinking states array
  const thinkingStates = [
    "Thinking...",
    "Processing your request...",
    "Formulating response...",
    "Analyzing your needs...",
    "Generating solution...",
    "Preparing information...",
    "Understanding context...",
    "Crafting response..."
  ];

  // Typing states for header
  const typingStatesHeader = [
    "🤔 Mira is thinking",
    "💭 Processing request", 
    "📝 Formulating response",
    "⚡ Generating solution",
    "✨ Finalizing details",
    "💬 Typing response"
  ];

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log("Token is", token);
    setIsLoggedIn(!!token);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enhanced thinking state animation
  useEffect(() => {
    let thinkingInterval: NodeJS.Timeout;
    
    if (isTyping && streamingMessageId) {
      thinkingInterval = setInterval(() => {
        setCurrentThinkingIndex(prev => (prev + 1) % thinkingStates.length);
        
        // Update the thinking message
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === streamingMessageId && msg.isStreaming
              ? {
                  ...msg,
                  text: thinkingStates[currentThinkingIndex],
                  displayedText: thinkingStates[currentThinkingIndex]
                }
              : msg
          )
        );
      }, 1500); // Change thinking state every 1.5 seconds
    }

    return () => {
      if (thinkingInterval) clearInterval(thinkingInterval);
    };
  }, [isTyping, streamingMessageId, currentThinkingIndex]);

  // Typing state for header indicator
  useEffect(() => {
    let headerTypingInterval: NodeJS.Timeout;
    let stateIndex = 0;
    
    if (isTyping) {
      setTypingState("thinking");
      
      headerTypingInterval = setInterval(() => {
        setThinkingState(typingStatesHeader[stateIndex]);
        stateIndex = (stateIndex + 1) % typingStatesHeader.length;
      }, 2000); // Change header state every 2 seconds
    } else {
      setTypingState("idle");
      setThinkingState("");
    }

    return () => {
      if (headerTypingInterval) clearInterval(headerTypingInterval);
    };
  }, [isTyping]);

  // Typing effect for streaming messages
  useEffect(() => {
    if (!streamingMessageId) return;

    const streamingMessage = messages.find(msg => msg.id === streamingMessageId && msg.isStreaming);
    if (!streamingMessage || !streamingMessage.text) return;

    const fullText = streamingMessage.text;
    const currentDisplayed = streamingMessage.displayedText || '';

    // Skip typing effect for thinking states
    if (thinkingStates.includes(fullText)) return;

    if (fullText && currentDisplayed.length < fullText.length) {
      const timer = setTimeout(() => {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.id === streamingMessageId
              ? {
                  ...msg,
                  displayedText: fullText.slice(0, (msg.displayedText || '').length + 1)
                }
              : msg
          )
        );
      }, 30);

      return () => clearTimeout(timer);
    } else if (fullText && currentDisplayed.length >= fullText.length && !thinkingStates.includes(fullText)) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === streamingMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      setStreamingMessageId(null);
      setTypingState("idle");
    }
  }, [messages, streamingMessageId]);

  // QR Code Detection and Auto-opening
  useEffect(() => {
    const latestBotMessage = messages
      .filter(msg => msg.sender === "bot" && !msg.isStreaming)
      .pop();

    if (latestBotMessage && !autoOpenedQR) {
      const qrUrl = extractQRCodeUrl(latestBotMessage.text);
      
      if (qrUrl && qrUrl !== storedQRUrl) {
        setStoredQRUrl(qrUrl);
        setPaymentCompleted(false);
        setShowPaymentStatus(true);
        
        setTimeout(() => {
          setPaymentImageUrl(qrUrl);
          setAutoOpenedQR(true);
          antdMessage.info("Payment QR code opened automatically");
        }, 1000);
      }
    }
  }, [messages, autoOpenedQR, storedQRUrl]);

  // Set up global payment image function
  useEffect(() => {
    (window as any).openPaymentImage = (url: string) => {
      setPaymentImageUrl(url || storedQRUrl);
    };

    (window as any).markPaymentComplete = () => {
      setPaymentCompleted(true);
      setStoredQRUrl("");
      setShowPaymentStatus(false);
      setAutoOpenedQR(false);
      setPaymentImageUrl("");
      antdMessage.success("Payment marked as completed!");
    };

    return () => {
      delete (window as any).openPaymentImage;
      delete (window as any).markPaymentComplete;
    };
  }, [storedQRUrl]);

  // Enhanced send message handler
  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);
    setError("");
    setTypingState("thinking");

    const thinkingMessageId = (Date.now() + 1).toString();
    const thinkingMessage: Message = {
      id: thinkingMessageId,
      text: thinkingStates[0],
      sender: "bot",
      timestamp: new Date(),
      isStreaming: true,
      displayedText: thinkingStates[0]
    };

    setMessages(prev => [...prev, thinkingMessage]);
    setStreamingMessageId(thinkingMessageId);
    setCurrentThinkingIndex(0);

    try {
      const botMessageId = (Date.now() + 2).toString();
      let accumulatedResponse = "";

      setTypingState("generating");

      const botResponse = await apiService.sendMessage(
        currentMessage,
        conversationHistory,
        sessionId,
        isLoggedIn,
        (chunk: string) => {
          accumulatedResponse += chunk;
          setTypingState("typing");

          setMessages(prev => {
            const messageExists = prev.some(msg => msg.id === botMessageId);

            if (!messageExists) {
              const filteredMessages = prev.filter(msg => msg.id !== thinkingMessageId);
              const newBotMessage: Message = {
                id: botMessageId,
                text: accumulatedResponse,
                sender: "bot",
                timestamp: new Date(),
                isStreaming: true,
                displayedText: accumulatedResponse,
                hasPaymentImage: hasQRCode(accumulatedResponse)
              };
              return [...filteredMessages, newBotMessage];
            } else {
              return prev.map(msg =>
                msg.id === botMessageId
                  ? {
                      ...msg,
                      text: accumulatedResponse,
                      displayedText: accumulatedResponse,
                      hasPaymentImage: hasQRCode(accumulatedResponse)
                    }
                  : msg
              );
            }
          });
        }
      );

      // Update conversation history
      const newHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: "user", content: currentMessage },
        { role: "assistant", content: botResponse }
      ];
      setConversationHistory(newHistory);

      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: botResponse,
                displayedText: botResponse,
                isStreaming: false,
                hasPaymentImage: hasQRCode(botResponse)
              }
            : msg
        )
      );

      setStreamingMessageId(null);
      setTypingState("idle");

    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== thinkingMessageId));

      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        text: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
      setStreamingMessageId(null);
      setTypingState("idle");
      
      antdMessage.error(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsTyping(false);
      setTypingState("idle");
    }
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    setStoredQRUrl("");
    setShowPaymentStatus(false);
    setAutoOpenedQR(false);
    setPaymentImageUrl("");
    
    const completionMessage = "I have completed the payment. Please confirm my order.";
    setInputMessage(completionMessage);
    
    antdMessage.success("Payment marked as completed! Confirming with Mira...");
    
    setTimeout(() => {
      sendMessage();
    }, 1000);
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header */}
      <ChatHeader 
        isLoggedIn={isLoggedIn} 
        hasError={!!error}
        typingState={thinkingState}
        isTyping={isTyping}
      />

      {/* Payment Status Banner */}
      {showPaymentStatus && storedQRUrl && !paymentCompleted && (
        <div style={{
          background: 'linear-gradient(135deg, #e2136e, #ff6b9d)',
          color: 'white',
          padding: '12px 20px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 600,
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(226, 19, 110, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
            <span>💳 Payment QR Code Available</span>
            <Button 
              size="small"
              onClick={() => setPaymentImageUrl(storedQRUrl)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '6px'
              }}
            >
              View QR Code
            </Button>
            <Button 
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={handlePaymentComplete}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                color: '#e2136e',
                fontWeight: 600,
                borderRadius: '6px'
              }}
            >
              Mark as Paid
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        padding: '20px', 
        overflowY: 'auto',
        background: 'transparent'
      }}>
        {messages.map((message) => (
          <MessageComponent 
            key={message.id} 
            message={message} 
            formatMessage={formatMessage}
            storedQRUrl={storedQRUrl}
            paymentCompleted={paymentCompleted}
            isThinking={thinkingStates.includes(message.text)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput 
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={sendMessage}
        isTyping={isTyping}
        error={error}
        typingState={thinkingState}
      />

      {/* Payment Modal */}
      <PaymentImageModal
        imageUrl={paymentImageUrl}
        open={!!paymentImageUrl}
        onClose={() => setPaymentImageUrl("")}
        onPaymentComplete={handlePaymentComplete}
        showPaymentComplete={!!storedQRUrl && !paymentCompleted}
      />

      {/* Enhanced CSS for animations */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes dots {
          0%, 20% { color: rgba(0,0,0,0.4); text-shadow: 0.25em 0 0 rgba(0,0,0,0.2), 0.5em 0 0 rgba(0,0,0,0.2); }
          40% { color: rgba(0,0,0,1); text-shadow: 0.25em 0 0 rgba(0,0,0,0.4), 0.5em 0 0 rgba(0,0,0,0.2); }
          60% { text-shadow: 0.25em 0 0 rgba(0,0,0,1), 0.5em 0 0 rgba(0,0,0,0.4); }
          80%, 100% { text-shadow: 0.25em 0 0 rgba(0,0,0,1), 0.5em 0 0 rgba(0,0,0,1); }
        }
        
        .thinking-indicator {
          animation: pulse 2s infinite;
        }
        
        .dots::after {
          content: '...';
          animation: dots 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default MiraChatbot;