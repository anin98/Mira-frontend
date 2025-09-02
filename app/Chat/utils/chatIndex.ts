// utils/chatIndex.ts

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
  displayedText?: string;
  hasPaymentImage?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface APIRequestData {
  session_id: string;
  company_id: number;
  messages: ChatMessage[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface PaymentImageModalProps {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  showPaymentComplete?: boolean;
}

export interface ChatHeaderProps {
  isLoggedIn: boolean;
  hasError: boolean;
}

export interface MessageComponentProps {
  message: Message;
  formatMessage: (text: string) => string;
  storedQRUrl?: string;
  paymentCompleted?: boolean;
}

export interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  onSendMessage: () => void;
  isTyping: boolean;
  error: string;
}

// New interfaces for QR management
export interface QRCodeState {
  url: string;
  isStored: boolean;
  autoOpened: boolean;
  paymentCompleted: boolean;
}

export interface PaymentStatus {
  isActive: boolean;
  qrUrl: string;
  completed: boolean;
  orderId?: string;
  amount?: string;
  transactionId?: string;
}