// utils/ClientTime.tsx

import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface ClientTimeProps {
  date: Date;
}

const ClientTime: React.FC<ClientTimeProps> = ({ date }) => {
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    setFormattedTime(date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, [date]);

  return (
    <Text 
      type="secondary" 
      style={{ 
        fontSize: '11px',
        fontFamily: 'monospace'
      }}
    >
      {formattedTime}
    </Text>
  );
};

export default ClientTime;