// utils/MessageUtils.ts

export const extractQRCodeUrl = (text: string): string | null => {
    // Check for existing QR_CODE_IMAGE format
    const qrRegex = /\[QR_CODE_IMAGE:(.*?)\]/g;
    const qrMatch = qrRegex.exec(text);
    if (qrMatch) return qrMatch[1].replace(/[\]\s]+$/, '').trim();
  
    // Check for markdown QR links
    const markdownQRRegex = /\[([^\]]*(?:QR|qr|Scan|scan)[^\]]*)\]\((https?:\/\/[^)]+)\)/gi;
    const markdownMatch = markdownQRRegex.exec(text);
    if (markdownMatch) {
      const url = markdownMatch[2].replace(/[\]\s]+$/, '').trim();
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?[^)]*)?$/i;
      if (imageExtensions.test(url) || url.includes('qrcode') || url.includes('qr')) {
        return url;
      }
    }
  
    // Check for "Bkash QR Code" or "QR Code" text with URLs
    if (text.includes('Bkash QR Code') || text.includes('QR Code') || text.includes('this QR code')) {
      const urlRegex = /(https?:\/\/[^\s)]+(?:qr|QR|jpg|jpeg|png|gif|webp)[^\s)]*)/gi;
      const urlMatch = urlRegex.exec(text);
      if (urlMatch) return urlMatch[1].replace(/[\]\s]+$/, '').trim();
    }
  
    // Check for standalone QR URLs
    const standaloneQRRegex = /(https?:\/\/[^\s]+(?:qr|QR|qrcode)[^\s]*)/gi;
    const standaloneMatch = standaloneQRRegex.exec(text);
    if (standaloneMatch) return standaloneMatch[1].replace(/[\]\s]+$/, '').trim();
  
    return null;
  };
  
  export const hasQRCode = (text: string): boolean => {
    return extractQRCodeUrl(text) !== null;
  };
  
  export const formatMessage = (text: string): string => {
    let formattedText = text;
  
    // FIRST: Handle QR code detection and button creation
    // Remove any malformed style attributes that might be in the text
    formattedText = formattedText.replace(/style="[^"]*"/g, '');
    
    // Handle QR code images with the existing format
    const qrRegex = /\[QR_CODE_IMAGE:(.*?)\]/g;
    formattedText = formattedText.replace(qrRegex, (match, url) => {
      return `<div style="margin: 16px 0; text-align: center;">
        <button onclick="window.openPaymentImage && window.openPaymentImage('${url}')" 
                style="background: linear-gradient(135deg, #1890ff, #722ed1); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
          📱 View Payment QR Code
        </button>
      </div>`;
    });
  
    // Handle specific QR code patterns that should NOT be links
    // Remove "Click here" links that are meant for QR codes since we have modal access
    formattedText = formattedText.replace(
      /\b(Click here|click here)\b(?:\s*\([^)]*scanning[^)]*\))?/gi,
      '<span style="color: #666; font-style: italic;">QR Code available in payment panel above</span>'
    );
  
    // Handle markdown-style QR code links like [Scan this QR](url) or [QR Code](url)
    const markdownQRRegex = /\[([^\]]*(?:QR|qr|Scan|scan)[^\]]*)\]\((https?:\/\/[^)]+)\)/gi;
    formattedText = formattedText.replace(markdownQRRegex, (match, linkText, url) => {
      const cleanUrl = url.replace(/[\]\s]+$/, '').trim();
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?[^)]*)?$/i;
      const isImageUrl = imageExtensions.test(cleanUrl) || cleanUrl.includes('qrcode') || cleanUrl.includes('qr');
  
      if (isImageUrl) {
        // Since QR is available in header, just show descriptive text
        return `<span style="color: #1890ff; font-weight: 600;">📱 ${linkText}</span> <span style="color: #666; font-size: 12px;">(available in payment panel above)</span>`;
      } else {
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: none; font-weight: 500;">${linkText}</a>`;
      }
    });
  
    // Special handling for bKash payment instructions with QR code mentions
    if (text.includes('bKash') || text.includes('QR Code Option') || text.includes('this QR code')) {
      // Extract any URL from the text for QR code
      const urlRegex = /(https?:\/\/[^\s)]+)/gi;
      const urlMatch = urlRegex.exec(text);
      const qrUrl = urlMatch ? urlMatch[1] : '';
      
      // Replace QR code mentions with descriptive text instead of buttons
      formattedText = formattedText.replace(
        /(?:QR Code Option:|this QR code|Scan QR|QR Code)\s*:?\s*/gi, 
        `<span style="color: #1890ff; font-weight: 600;">📱 QR Code</span> <span style="color: #666; font-size: 12px;">(use payment panel above)</span> `
      );
    }
  
    // Handle general markdown links [text](url) that are NOT QR codes
    const generalMarkdownRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi;
    formattedText = formattedText.replace(generalMarkdownRegex, (match, linkText, url) => {
      const cleanUrl = url.replace(/[\]\s]+$/, '').trim();
      if (linkText.match(/QR|qr|Scan|scan/i)) {
        return match; // Return unchanged, already handled
      }
      return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #1890ff; text-decoration: none; font-weight: 500;">${linkText}</a>`;
    });
  
    // Handle cases where there might be a standalone URL that looks like a QR code
    // Don't create buttons for these since QR is available in header
    const standaloneQRRegex = /(?<!["'>])(https?:\/\/[^\s<>]+(?:qr|QR|qrcode)[^\s<>\]]*)/gi;
    formattedText = formattedText.replace(standaloneQRRegex, (match, url) => {
      const cleanUrl = url.replace(/[\]\s]+$/, '').trim();
      return `<span style="color: #666; font-size: 12px; font-style: italic;">QR Code URL (use payment panel above to view)</span>`;
    });
  
    // SECOND: Apply text formatting AFTER QR codes are processed
    formattedText = formattedText
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
      .replace(/__(.*?)__/g, '<strong style="font-weight: 600;">$1</strong>')
      
      // Italic text (be careful with URLs)
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/(?<!https?:\/\/[^\s]*)\b_([^_\s][^_\n]*[^_\s])_(?![^\s]*\.(jpg|jpeg|png|gif|webp|svg))/g, '<em>$1</em>')
      
      // Line breaks
      .replace(/\n/g, '<br>')
      
      // Numbered lists
      .replace(/^(\d+\.\s+)/gm, '<br><strong style="color: #1890ff;">$1</strong>')
      
      // Bullet points
      .replace(/^[-*]\s+/gm, '<br>• ')
      
      // Remove leading <br> if it exists
      .replace(/^<br>/, '')
      
      // Style important payment information
      .replace(/(Send money to this number:|Amount:|Reference:|Transaction ID)/gi, '<strong style="color: #1890ff; font-weight: 600;">$1</strong>')
      
      // Style phone numbers and amounts
      .replace(/(\d{11})/g, '<span style="background: #f0f8ff; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-weight: 600;">$1</span>')
      .replace(/(\d+\s*taka)/gi, '<span style="background: #f6ffed; padding: 2px 6px; border-radius: 4px; font-weight: 600; color: #52c41a;">$1</span>')
      
      // Style order IDs and transaction IDs
      .replace(/(Order ID \d+|TxID [A-Z0-9]+)/gi, '<span style="background: #fff7e6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-weight: 600; color: #fa8c16;">$1</span>');
  
    return formattedText;
  };
  
  // Additional utility for creating payment buttons
  export const createPaymentButton = (url?: string, text = 'View QR Code'): string => {
    const qrUrl = url || 'https://example.com/qr';
    return `<div style="margin: 16px 0; text-align: center;">
      <button onclick="window.openPaymentImage && window.openPaymentImage('${qrUrl}')" 
              style="background: linear-gradient(135deg, #1890ff, #722ed1); color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s; hover: transform: translateY(-1px);">
        📱 ${text}
      </button>
    </div>`;
  };
  
  // Utility to clean malformed styles from text
  export const cleanMalformedStyles = (text: string): string => {
    return text.replace(/style="[^"]*"/g, '').replace(/\s+/g, ' ').trim();
  };