import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
} from '@chakra-ui/react';
import React from 'react';

import { DesktopNavData } from './data';

const ResourcesSubmenu: React.FC<DesktopNavData> = ({ data, title }) => {
  return (
    <Popover
      trigger="hover"
      openDelay={200}
      placement="bottom-start"
      gutter={12}
    >
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Button variant="link" color='#1C1E21'>{title}</Button>
          </PopoverTrigger>
          <PopoverContent
            width={{ base: 'sm', md: data.length === 2 ? '2xl' : 'xs' }}
            bg="#FFFFFF"
            pt={{ base: '4', md: '8' }}
            pb="8"
            zIndex={99}
            borderRadius="none"
          >
            <Box position={'relative'} boxSize="full">
              <Container>
                <Stack
                  direction={{ base: 'column', lg: 'row' }}
                  spacing={{ base: '14', lg: '14' }}
                >
                  <SimpleGrid
                    columns={{ base: 1, md: data.length }}
                    minW="full"
                  >
                    {data.map((item, id) => (
                      <Stack key={id} spacing="1">
                        {data.length > 1 && (
                          <Stack spacing="4" direction="row" pl="0">
                            {!item.title && <Box boxSize="7" />}
                            <Text
                              fontSize="lg"
                              fontWeight="bold"
                              color="#141414"
                            >
                              {item.href ? (
                                <Link href={item.href} target='_blank'>{item.title}</Link>
                              ) : (
                                item.title
                              )}
                            </Text>
                          </Stack>
                        )}
                        <Stack>
                          {item.links.map((link, id) => (
                            <Link
                              variant="menu"
                              href={link.href}
                              target='_blank'
                              key={id}
                            >
                              <Stack spacing="4" direction="row" pt="3">
                                <Stack spacing="1">
                                  <Text fontWeight="medium">{link.title}</Text>
                                  <Text fontSize="sm" color="muted">
                                    {link.description}
                                  </Text>
                                </Stack>
                              </Stack>
                            </Link>
                          ))}
                        </Stack>
                      </Stack>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Container>
            </Box>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default ResourcesSubmenu;
