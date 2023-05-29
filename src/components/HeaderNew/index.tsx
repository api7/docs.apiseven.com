import { Box, useColorModeValue as mode } from '@chakra-ui/react'
import React from 'react'

import { NavContent } from './NavContent'
import { ZH_CN_Links } from './_data';

const App = () => {

  return (
    <Box minH="0" zIndex={500} position='sticky' top='0'>
      <Box as="header" bg={mode('white', 'gray.800')} position="relative" zIndex="10">
        <Box as="nav" aria-label="Main navigation" maxW="7xl" mx="auto" px={{ base: '6', md: '8' }}>
          <NavContent.Mobile display={{ base: 'flex', lg: 'none' }} links={ZH_CN_Links} language={'zh'} />
          <NavContent.Desktop display={{ base: 'none', lg: 'flex' }} links={ZH_CN_Links} language={'zh'} />
        </Box>
      </Box>
    </Box>
  )
}

export default App

