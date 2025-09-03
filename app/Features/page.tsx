import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Space, 
  Tag, 
  Button, 
  Statistic,
  Timeline,
  Badge
} from 'antd';
import {
  RobotOutlined,
  ShoppingCartOutlined,
  GlobalOutlined,
  DashboardOutlined,
  MessageOutlined,
  SafetyOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PhoneOutlined,
  TruckOutlined,
  HeartOutlined,
  StarOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import Header from '../components/header';
const FeaturesPage = () => {
  const problemStats = [
    { title: 'Revenue Lost Daily', value: '৳6M', suffix: 'Per Day' },
    { title: 'Businesses Affected', value: '90%', suffix: 'Miss Sales' },
    { title: 'Response Time', value: '4+ hrs', suffix: 'Too Slow' }
  ];

  const mainFeatures = [
    {
      icon: <RobotOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Smart AI Sales Agent',
      description: 'Handles customer queries, recommends products, and closes sales in Bengali/English',
      
    },
    {
      icon: <DollarOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: 'Complete Order System',
      description: 'bKash, Nagad, COD payments with automatic delivery calculation',
     
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: 'Multi-Platform Ready',
      description: 'Facebook Messenger, WhatsApp, Website - one AI everywhere',
      
    }
  ];

  const quickFeatures = [
    { icon: <MessageOutlined />, title: 'Bengali/Banglish Fluent', desc: 'Understands "koy taka" naturally' },
    { icon: <StarOutlined />, title: 'Smart Recommendations', desc: 'Suggests alternatives when items unavailable' },
    { icon: <TruckOutlined />, title: 'Delivery Intelligence', desc: 'Calculates rates for any location' },
    { icon: <CheckCircleOutlined />, title: 'Order Tracking', desc: 'Full tracking with phone number' },
    { icon: <SafetyOutlined />, title: 'Human Oversight', desc: 'You control when AI acts alone' },
    { icon: <HeartOutlined />, title: 'Customer Memory', desc: 'Remembers preferences across visits' }
  ];

  const demoSteps = [
    { 
      speaker: 'Customer', 
      text: 'fresh tea leaves ache?', 
      translation: '(Do you have fresh tea leaves?)',
      color: 'blue'
    },
    { 
      speaker: 'Mira AI', 
      text: "We have premium Ginger Black Tea instead! 😊", 
      color: 'green'
    },
    { 
      speaker: 'Customer', 
      text: '3 packets koy taka?', 
      translation: '(How much for 3 packets?)',
      color: 'blue'
    },
    { 
      speaker: 'Mira AI', 
      text: "900 BDT total. Adding to cart... Where should we deliver?", 
      color: 'green'
    }
  ];

  return (
    <div >
    <Header/>
    
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui' }}>
      {/* Hero Section */}

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', color: '#1890ff', marginBottom: '12px', fontWeight: '700' }}>
          Mira AI
        </h1>
        <p style={{ fontSize: '24px', color: '#666', marginBottom: '8px' }}>
          Your 24/7 AI Sales Expert
        </p>
        <p style={{ fontSize: '16px', color: '#999' }}>
          Turn conversations into orders automatically
        </p>
      </div>

      {/* Problem Stats */}
      <Card style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ color: 'white', marginBottom: '24px',fontSize: '24px' }}>
            Bangladeshi businesses lose millions daily to slow responses
          </div>
          
          <Row gutter={[24, 24]}>
            {problemStats.map((stat, index) => (
              <Col xs={24} md={8} key={index}>
                <Statistic 
                  title={<span style={{ color: '#f0f0f0', fontSize: '16px' }}>{stat.title}</span>}
                  value={stat.value} 
                  valueStyle={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}
                  suffix={<span style={{ fontSize: '14px', color: '#f0f0f0' }}>{stat.suffix}</span>}
                />
              </Col>
            ))}
          </Row>
        </div>
      </Card>

      {/* Main Features */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '28px' }}>
          How Mira AI Works
        </h2>
        <Row gutter={[24, 32]}>
          {mainFeatures.map((feature, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card
                hoverable
                style={{ height: '100%', borderRadius: '16px', position: 'relative' }}
          
              >
               
                  <div style={{ textAlign: 'center' }}>
                    {feature.icon}
                    <h3 style={{ marginTop: '16px', marginBottom: '12px', fontSize: '20px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.5' }}>
                      {feature.description}
                    </p>
                  </div>
                
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Live Demo */}
      <Card style={{ marginBottom: '40px', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <h3 style={{ marginLeft: '8px', display: 'inline', fontSize: '24px' }}>
            Real Customer Conversation
          </h3>
          <p style={{ color: '#666', marginTop: '8px' }}>
            From Fresh Tea Stall - actual production conversation
          </p>
        </div>
        
        <Timeline mode="alternate" style={{ marginTop: '24px' }}>
          {demoSteps.map((step, index) => (
            <Timeline.Item 
              key={index}
              color={step.color}
              dot={step.speaker === 'Customer' ? <UserOutlined /> : <RobotOutlined />}
            >
              <Card size="small" style={{ maxWidth: '300px' }}>
                <Tag color={step.color} style={{ marginBottom: '8px' }}>
                  {step.speaker}
                </Tag>
                <p style={{ fontSize: '16px', marginBottom: step.translation ? '4px' : '0' }}>
                  "{step.text}"
                </p>
                {step.translation && (
                  <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                    {step.translation}
                  </p>
                )}
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>

        <Card style={{ marginTop: '24px', background: '#f6ffed', border: '1px solid #b7eb8f', textAlign: 'center' }}>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '8px' }} />
          <span style={{ color: '#52c41a', fontSize: '16px' }}>
            <strong>Result:</strong> Order #75 completed - ৳900 with bKash payment
          </span>
        </Card>
      </Card>

      {/* Quick Features Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px' }}>
          Everything You Need
        </h3>
        <Row gutter={[16, 16]}>
          {quickFeatures.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card 
                size="small" 
                hoverable 
                style={{ height: '100%', borderRadius: '12px' }}
              >
                <Space align="start">
                  <div style={{ color: '#1890ff', fontSize: '20px', marginTop: '4px' }}>
                    {feature.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {feature.title}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {feature.desc}
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Trust & Control */}
      <Card style={{ marginBottom: '40px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px' }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '24px' }}>
            You Stay in Control
          </h3>
          <p style={{ fontSize: '16px', color: '#f0f0f0', marginBottom: '24px' }}>
            Start with human oversight, graduate to full automation
          </p>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card style={{ background: 'rgba(255,255,255,0.1)', border: 'none' }}>
                <div style={{ color: 'white', marginBottom: '12px' }}>
                  <SafetyOutlined style={{ marginRight: '8px' }} />
                  <strong>Co-pilot Mode</strong>
                </div>
                <p style={{ color: '#f0f0f0', fontSize: '14px' }}>
                  You review and approve AI responses before sending
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card style={{ background: 'rgba(255,255,255,0.1)', border: 'none' }}>
                <div style={{ color: 'white', marginBottom: '12px' }}>
                  <ThunderboltOutlined style={{ marginRight: '8px' }} />
                  <strong>Autopilot Mode</strong>
                </div>
                <p style={{ color: '#f0f0f0', fontSize: '14px' }}>
                  AI handles everything automatically when you're ready
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>

      {/* CTA */}
      <Card style={{ background: '#f6ffed', textAlign: 'center', borderRadius: '16px' }}>
        <div style={{ color: '#52c41a', fontSize: '24px', marginBottom: '12px', fontWeight: '600' }}>
          Ready to 10x Your Sales?
        </div>
        <p style={{ fontSize: '16px', marginBottom: '24px', color: '#666' }}>
          Stop losing customers to slow responses
        </p>
        <Space size="large">
          <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
            See Live Demo
          </Button>
          <Button size="large" icon={<MessageOutlined />}>
            Start Free
          </Button>
        </Space>
      </Card>
    </div></div>

  );
};

export default FeaturesPage;