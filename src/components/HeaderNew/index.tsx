import { Box, useColorModeValue as mode } from '@chakra-ui/react'
import React from 'react'

import { NavContent } from './NavContent'
import { EN_US_Links, ZH_CN_Links } from './_data';

const App = () => {

  let links = []

  if (typeof window !== "undefined") {
    const { hostname } = window.location
    if (hostname === "api7.ai") {
      links = EN_US_Links
    }

    if (hostname === "www.apiseven.com") {
      links = ZH_CN_Links
    }

    if (hostname === 'localhost') {
      links = ZH_CN_Links
    }

    // 以下情况仅用于备案
    if (hostname === "www.apiseven.cn") {
      links = [ZH_CN_Links[0]]
    }

    if (hostname === "www.luarocks.cn") {
      links = [ZH_CN_Links[1]]
    }

    if (hostname === "www.apisix.vip") {
      links = [ZH_CN_Links[2]]
    }

    if (hostname === "www.iresty.com") {
      links = [ZH_CN_Links[3]]
    }

    if (hostname === "www.apisix-summit.asia") {
      links = [ZH_CN_Links[4]]
    }
  }

  return (
    <Box minH="0" zIndex={500} position='sticky' top='0'>
      <Box as="header" bg={mode('white', 'gray.800')} position="relative" zIndex="10">
        <Box as="nav" aria-label="Main navigation" maxW="7xl" mx="auto" px={{ base: '6', md: '8' }}>
          <NavContent.Mobile display={{ base: 'flex', lg: 'none' }} links={links} language={'zh'} />
          <NavContent.Desktop display={{ base: 'none', lg: 'flex' }} links={links} language={'zh'} />
        </Box>
      </Box>
    </Box>
  )
}

export default App

