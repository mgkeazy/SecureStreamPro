import React from 'react';
import { Container, Text } from '@mantine/core';

const Footer = () => {
  return (
    <div style={{ backgroundColor: '#343a40', padding: '10px 0', position: 'relative', width: '100%' }}>
      <Container style={{ textAlign: 'center' }}>
        <Text style={{ color: 'white', margin: 0 }}>&copy; 2025 SecureStreamPro. All rights reserved.</Text>
      </Container>
    </div>
  );
};

export default Footer;