import React from 'react';
import { ChakraBaseProvider } from '@chakra-ui/react';
import theme from '../../theme';

export default function Root({ children }) {
  return (
    <ChakraBaseProvider theme={theme}>
      {children}
    </ChakraBaseProvider>
  )
};
