
import {
  Box,
  Button,
  Heading,
  Highlight,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import * as React from 'react';

import { APISIX_DOCUMENTATION_DATA } from './data';
import CustomButton from './CustomButton';

const QuickstartSection: React.FC = () => {

  return (
    <SimpleGrid columns={[1, 2]} spacing={[8, 10]}>
      {APISIX_DOCUMENTATION_DATA.map((item) => {
        return (
          <Box maxW={['full', '85%']} key={item.title}>
            <Heading as='h4' fontSize='24px'>
              {item.title}
            </Heading>
            <Text mt='0.5rem' mb='0.75rem' minH={['unset', '48px']}>
              <Highlight
                query={item.highlight}
                styles={{ fontWeight: '600', color: '#1A202C' }}
              >
                {item.text}
              </Highlight>
            </Text>
            <CustomButton text={item.button} link={item.link} isDisabled={!item.link} />
          </Box>
        )
      })}
    </SimpleGrid>
  )
};

export default QuickstartSection;
