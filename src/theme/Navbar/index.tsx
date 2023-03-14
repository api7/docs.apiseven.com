import React from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';
import {
  Container,
} from '@chakra-ui/react';
import HeaderComponent from '../../components/Header';

export default function Navbar(): JSX.Element {
  return (
    <>
      <HeaderComponent />
      <NavbarLayout>
        <Container maxW='6xl' px={{ base: '0', md: '5' }}>
          <NavbarContent />
        </Container>
      </NavbarLayout>
    </>
  );
}
