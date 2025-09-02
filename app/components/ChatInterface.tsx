"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
// import { Card } from "./ui/card"; // Removed Card import as it's no longer used
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date; // Keep Date object in state
}

// Helper component to render time only on the client
const ClientTime = ({ date }: { date: Date }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    // This code only runs on the client after hydration
    setFormattedTime(date.toLocaleTimeString());
    // If you need more specific formatting or locales:
    // setFormattedTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  }, [date]); // Re-run if the date object itself changes (though not expected for fixed messages)

  return <>{formattedTime}</>;
};


const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your OrderBot assistant. I can help you place orders. What would you like to order today?",
      sender: "bot",
      timestamp: new Date(), // This initial date is still from server render, but its display is client-side
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(), // This new date is from client
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you'd like to place an order. Let me help you with that. What specific items are you looking for?",
        sender: "bot",
        timestamp: new Date(), // This new date is from client
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    // Moved Card classes directly to this div and adjusted for page content
    // Removed Card component wrapper
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col  shadow-xl ">
      {/* Chat Header - Removed rounded-t-lg as it's no longer a card */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <h2 className="text-lg font-semibold flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span>Orderator</span>
        </h2>
        <p className="text-gray-200 text-xs">Powered by Grayscale Technologies</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === "bot" && (
                  <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                )}
                {message.sender === "user" && (
                  <User className="w-4 h-4 mt-0.5 text-blue-100" />
                )}
                <div>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {/* Use the new ClientTime component here */}
                    <ClientTime date={message.timestamp} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;