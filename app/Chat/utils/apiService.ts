import { ChatMessage, APIRequestData, ValidationError } from './chatIndex';

export class APIService {
  private PUBLIC_CLIENT_KEY = process.env.REACT_APP_PUBLIC_CLIENT_KEY || "15f1d1cb-b6a0-4133-9f5a-643a3affe291";
  private COMPANY_ID_TO_TEST = 1;
  private API_ENDPOINT = "https://mira-chat.grayscale-technologies.com/chat";

  async sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[],
    sessionId: string,
    isLoggedIn: boolean,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const updatedHistory: ChatMessage[] = [
      ...conversationHistory,
      { role: "user", content: userMessage }
    ];

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    const payload: APIRequestData = {
      session_id: sessionId,
      company_id: this.COMPANY_ID_TO_TEST,
      messages: updatedHistory
    };

    if (isLoggedIn) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        headers["Authorization"] = `Client-Key ${this.PUBLIC_CLIENT_KEY}`;
      }
    } else {
      headers["Authorization"] = `Client-Key ${this.PUBLIC_CLIENT_KEY}`;
    }

    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail) {
            if (Array.isArray(errorJson.detail)) {
              const validationErrors = errorJson.detail.map((err: ValidationError) =>
                `${err.loc?.join('.') || 'field'}: ${err.msg}`
              ).join(', ');
              errorMessage = `Validation error: ${validationErrors}`;
            } else {
              errorMessage = `Error: ${errorJson.detail}`;
            }
          } else if (errorJson.message) {
            errorMessage = `Error: ${errorJson.message}`;
          }
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${errorText}`;
        }

        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          onChunk(chunk);
        }
      }

      if (!fullResponse) {
        fullResponse = await response.text();
        onChunk(fullResponse);
      }

      if (!fullResponse || fullResponse.trim() === '') {
        fullResponse = "I received your message but couldn't generate a response. Please try again.";
      }

      return fullResponse;

    } catch (error) {
      console.error('Error in sendMessage:', error);

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          throw new Error("Connection failed. Please check your internet connection and try again.");
        } else if (error.message.includes("Validation error")) {
          throw new Error(`API validation error: ${error.message}. Please check the request format.`);
        }
      }
      throw error;
    }
  }
}