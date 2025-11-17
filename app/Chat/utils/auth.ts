// app/Chat/utils/auth.ts
export const AUTH_CONFIG = {
  JWT_STORAGE_KEYS: ['jwt_token', 'access_token', 'authToken', 'token'],
  CLIENT_KEY: process.env.NEXT_PUBLIC_CLIENT_KEY || "",
  API_URL: `${process.env.NEXT_PUBLIC_BASE_URL || "https://mira-chat.grayscale-technologies.com"}/chat`
};

export const getJWTToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  for (const key of AUTH_CONFIG.JWT_STORAGE_KEYS) {
    const token = localStorage.getItem(key);
    if (token) return token;
  }
  
  return null;
};

export const setJWTToken = (token: string, key: string = 'jwt_token'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, token);
};

export const removeJWTToken = (): void => {
  if (typeof window === 'undefined') return;
  
  AUTH_CONFIG.JWT_STORAGE_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });
};

export const isAuthenticated = (): boolean => {
  return getJWTToken() !== null;
};

// app/Chat/types/chat.ts
export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
  displayedText?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface APIRequestData {
  session_id?: string;
  company_id: number;
  messages: ChatMessage[];
}

export interface ChatConfig {
  apiUrl: string;
  clientKey?: string;
  jwtToken?: string;
  companyId: number;
  isGuest: boolean;
}

