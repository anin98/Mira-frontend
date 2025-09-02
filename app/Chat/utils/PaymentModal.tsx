// utils/PaymentModal.tsx

import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Avatar, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Spin,
  Divider 
} from 'antd';
import { 
  QrcodeOutlined, 
  CloseOutlined, 
  DownloadOutlined,
  CheckCircleOutlined,
  CopyOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface PaymentImageModalProps {
  imageUrl: string;
  open: boolean;
  onClose: () => void;
  onPaymentComplete?: () => void;
  showPaymentComplete?: boolean;
}

const PaymentImageModal: React.FC<PaymentImageModalProps> = ({ 
  imageUrl, 
  open, 
  onClose,
  onPaymentComplete,
  showPaymentComplete = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && imageUrl) {
      setImageLoaded(false);
      setImageError(false);
      setCopied(false);
    }
  }, [open, imageUrl]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'payment-qr-code.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageUrl, '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handlePaymentComplete = () => {
    if (onPaymentComplete) {
      onPaymentComplete();
    }
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <Avatar size="small" icon={<QrcodeOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <Title level={5} style={{ margin: 0 }}>Payment QR Code</Title>
            <Text type="secondary" style={{ fontSize: '12px' }}>Scan to complete your payment</Text>
          </div>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={450}
      styles={{
        body: { padding: '24px' }
      }}
    >
      {imageError ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Avatar size={64} icon={<CloseOutlined />} style={{ backgroundColor: '#ff4d4f', marginBottom: 16 }} />
          <Title level={4} type="danger">Failed to load QR code</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            There was an error loading the QR code image
          </Text>
          <Button type="link" onClick={() => window.open(imageUrl, '_blank')}>
            Open in new tab
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          {!imageLoaded && (
            <div style={{ padding: '40px 20px' }}>
              <Spin size="large" />
              <Title level={4} style={{ marginTop: 16, color: '#1890ff' }}>Loading QR code...</Title>
            </div>
          )}
          
          <div style={{ display: imageLoaded ? 'block' : 'none' }}>
            {/* QR Code Display */}
            <Card 
              style={{ 
                display: 'inline-block', 
                marginBottom: 24,
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <img
                src={imageUrl}
                alt="Payment QR Code"
                style={{ 
                  width: 280, 
                  height: 280, 
                  objectFit: 'contain',
                  borderRadius: '8px'
                }}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </Card>

            {/* Instructions */}
            <div style={{ marginBottom: 24 }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
                📱 <strong>Scan this QR code</strong> with your mobile banking app
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                bKash, Rocket, Nagad, or any QR-enabled payment app
              </Text>
            </div>

            <Divider />

            {/* Action Buttons */}
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Space size="middle" wrap style={{ justifyContent: 'center' }}>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  style={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none'
                  }}
                >
                  Download
                </Button>
                
                <Button 
                  icon={<CopyOutlined />}
                  onClick={handleCopyLink}
                  style={{ borderRadius: '8px' }}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>

                <Button 
                  icon={<QrcodeOutlined />}
                  onClick={() => window.open(imageUrl, '_blank')}
                  style={{ borderRadius: '8px' }}
                >
                  Open Full Size
                </Button>
              </Space>

              {/* Payment Completion Button */}
              {showPaymentComplete && (
                <>
                  <Divider style={{ margin: '16px 0' }} />
                  <div style={{ 
                    background: '#f6ffed', 
                    padding: '16px', 
                    borderRadius: '8px',
                    border: '1px solid #b7eb8f'
                  }}>
                    <Text style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}>
                      ✅ Completed your payment?
                    </Text>
                    <Button 
                      type="primary"
                      size="large"
                      icon={<CheckCircleOutlined />}
                      onClick={handlePaymentComplete}
                      style={{
                        width: '100%',
                        background: '#52c41a',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '16px',
                        height: '48px'
                      }}
                    >
                      Mark Payment as Complete
                    </Button>
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: 8, display: 'block' }}>
                      Click this after successfully completing the payment
                    </Text>
                  </div>
                </>
              )}
            </Space>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PaymentImageModal;