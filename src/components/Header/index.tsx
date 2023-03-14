import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  HStack,
  Link,
} from '@chakra-ui/react';
import * as React from 'react';

import ResourcesSubmenu from './ResourcesSubmenu';
import Logo from './Logo';
import NavMobile from './NavMobile';

import { products, developers, company, oss, docs } from './data';

export const GRADIENT_PARAM =
  'linear-gradient(273.1deg, #153FFF 1.57%, #4790FF 118.62%)';

export const HOVER_PARAM =
  'linear-gradient(273.1deg, #2F54FF 1.57%, #5397FF 118.62%)';

export const GRADIENT_TEXT_STYLE = {
  bgGradient: GRADIENT_PARAM,
  bgClip: 'text',
};

const HeaderComponent = () => {
  return (
    <Box as="section" position="sticky" top="0" zIndex="300" bg='#FFFFFF'>
      <Box as="nav" bg="bg-surface">
        <Container
          maxW="6xl"
          py='15px'
          px='20px'
          display={{ base: 'none', lg: 'inherit' }}
        >
          <HStack spacing="10" justify="space-between">
            <Link href="https://api7.ai/" target='_blank'>
              <Logo />
            </Link>
            <Flex justify="space-between" flex="1">
              <ButtonGroup variant="link" spacing="8">
                <ResourcesSubmenu data={products} title="Products" />
                <ResourcesSubmenu data={oss} title="Open Source" />
                <ResourcesSubmenu data={docs} title="Docs" />
                <ResourcesSubmenu data={developers} title="Resources" />
                <ResourcesSubmenu data={company} title="Company" />
              </ButtonGroup>
              <HStack spacing="3">
                <Link
                  href="https://console.api7.cloud/"
                  target="_blank"
                  fontWeight="500"
                  color="#141414"
                >
                  Login
                </Link>
                <Button
                  background={GRADIENT_PARAM}
                  color='#FFFFFF'
                  _hover={{ background: HOVER_PARAM, color: '#FFFFFF' }}
                  w="152px"
                  borderRadius="4px"
                  as="a"
                  href="https://api7.ai/contact"
                  target='_blank'
                  variant="primary"
                  fontWeight='500'
                >
                  Contact Us
                </Button>
              </HStack>
            </Flex>
          </HStack>
        </Container>
        <NavMobile />
        <Divider />
      </Box>
    </Box>
  );
};

export default HeaderComponent;
