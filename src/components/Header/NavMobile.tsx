import {
  Box,
  Button,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';

import NavAccordion from './NavAccordion';
import NavLayout from './NavLayout';
import { data } from './data';
import { GRADIENT_PARAM, HOVER_PARAM } from '.';

const NavMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Container display={{ base: 'inherit', lg: 'none' }} py='3px' maxW='6xl'>
      <Box zIndex="300" w="full">
        <Box as="nav" bg="bg-surface">
          <NavLayout onClickMenu={onOpen} isMenuOpen={isOpen} />
          <Drawer
            placement="left"
            initialFocusRef={menuButtonRef}
            isOpen={isOpen}
            onClose={onClose}
            size="full"
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader py="0">
                <NavLayout
                  onClickMenu={onClose}
                  isMenuOpen={isOpen}
                  menuButtonRef={menuButtonRef}
                />
              </DrawerHeader>
              <DrawerBody>
                <NavAccordion data={data} />
                <Stack mt="6" spacing='3' textAlign='center'>
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
                    flex="1"
                    fontWeight='500'
                    w="full"
                    py='2'
                    as='a'
                    href='https://api7.ai/contact'
                    target='_blank'
                  >
                    Contact Us
                  </Button>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Box>
      </Box>
    </Container>
  );
};

export default NavMobile;
