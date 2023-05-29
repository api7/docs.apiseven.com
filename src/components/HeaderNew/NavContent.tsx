import {
  Box,
  Button,
  Flex,
  FlexProps,
  HStack,
  useDisclosure,
  VisuallyHidden,
} from '@chakra-ui/react';
import React from 'react';
import { Logo } from './Logo';

import { NavLink } from './NavLink';
import { NavMenu } from './NavMenu';
import { Submenu } from './Submenu';
import { ToggleButton } from './ToggleButton';
import { Link } from './_data';
import { getRequestDemoLink } from './helper';

type Props = FlexProps & {
  links: Link[];
  language?: string
}

const MobileNavContext = ({ links, language, ...props }: Props) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Flex align="center" justify="space-between" className="nav-content__mobile" {...props}>
        <Box flexBasis="6rem">
          <ToggleButton isOpen={isOpen} onClick={onToggle} />
        </Box>
        <Box as="a" rel="home" mx="auto">
          <Logo />
        </Box>
        <Box flexBasis="6rem" visibility={{ base: 'hidden', sm: 'visible' }}>
          <Button as="a" href={getRequestDemoLink(language)} target="_blank" colorScheme="blue">
            {language === 'zh-CN' ? '立即开始' : 'Get Started'}
          </Button>
        </Box>
      </Flex>
      <NavMenu animate={isOpen ? 'open' : 'closed'}>
        {links.map((link, idx) =>
          (link.children && link.label !== 'API7 Cloud') ? (
            <Submenu.Mobile key={idx} link={link} />
          ) : (
            <Box>
              <NavLink.Mobile key={idx} href={link.href}>
                {link.label}
              </NavLink.Mobile>
            </Box>
          ),
        )}
        <Button as="a" href={getRequestDemoLink(language)} target="_blank" colorScheme="blue" w="full" size="lg" mt="5" _hover={{ color: "var(--chakra-colors-white)", background: "var(--chakra-colors-blue-600)", textDecoration: "none" }}>
          {language === 'zh-CN' ? '申请试用' : 'Request Demo'}
        </Button>
      </NavMenu>
    </>
  )
}

const DesktopNavContent = ({ links, language, ...props }: Props) => {

  return (
    <Flex className="nav-content__desktop" align="center" justify="space-between" {...props}>
      <Box as="a" href="#" rel="home">
        <VisuallyHidden>API7</VisuallyHidden>
        <Logo />
      </Box>
      <HStack as="ul" id="nav__primary-menu" aria-label="Main Menu" listStyleType="none" py='16px' mb='0px'>
        {links.map((link, idx) => (
          <Box as="li" key={idx} id={`nav__menuitem-${idx}`}>
            {link.children ? (
              <Submenu.Desktop link={link} />
            ) : (
              <NavLink.Desktop href={link.href}>{link.label}</NavLink.Desktop>
            )}
          </Box>
        ))}
      </HStack>
      <HStack spacing="8" minW="240px" flexDirection='row-reverse'>
        <Button as="a" href={getRequestDemoLink(language)} target="_blank" colorScheme="blue" fontWeight="bold" _hover={{ color: "var(--chakra-colors-white)", background: "var(--chakra-colors-blue-600)", textDecoration: "none" }}>
          申请试用
        </Button>
      </HStack>
    </Flex>
  )
}

export const NavContent = {
  Mobile: MobileNavContext,
  Desktop: DesktopNavContent,
}
