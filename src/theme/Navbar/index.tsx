import React from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';
import {
  Container,
} from '@chakra-ui/react';
import HeaderComponent from '../../components/HeaderNew';

export default function Navbar(): JSX.Element {
  return (
    <>
      <HeaderComponent />
      <NavbarLayout>
        <Container maxWidth="1256px" px={{ base: '0', md: '5' }}>
          <NavbarContent />
        </Container>
      </NavbarLayout>
    </>
  );
}
