import {
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  StackDivider,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiMenu } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';

import Logo from './Logo';

type NavLayoutProps = {
  onClickMenu?: VoidFunction;
  onToggleMode?: VoidFunction;
  isMenuOpen: boolean;
  menuButtonRef?: React.RefObject<HTMLButtonElement>;
};

const NavLayout = (props: NavLayoutProps) => {
  const { onClickMenu, isMenuOpen, menuButtonRef } = props;
  const MenuIcon = isMenuOpen ? MdClose : FiMenu;
  return (
    <Flex height="16" align="center" justify="space-between">
      <Link href="/">
        <Logo />
      </Link>
      <HStack divider={<StackDivider height="6" alignSelf="unset" />}>
        <IconButton
          ref={menuButtonRef}
          variant="ghost"
          icon={<Icon as={MenuIcon} fontSize="2xl" />}
          aria-label="Open Menu"
          onClick={onClickMenu}
        />
      </HStack>
    </Flex>
  );
};

export default NavLayout;
