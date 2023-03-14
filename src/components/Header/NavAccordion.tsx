import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react';
import React from 'react';

import { MobileNavData } from './data';

type NavAccordionProps = {
  data: MobileNavData[];
};

const NavAccordion = (props: NavAccordionProps) => {
  const { data } = props;
  return (
    <Accordion allowMultiple as="ul" listStyleType="none" paddingLeft='0'>
      {data.map((group) => (
        <AccordionItem key={group.label} as="li">
          <AccordionButton py="3" px="0">
            <Box flex="1" textAlign="start" fontSize="lg" fontWeight="semibold">
              {group.label}
            </Box>
            <AccordionIcon fontSize="3xl" />
          </AccordionButton>
          <AccordionPanel pb="3" px="0" pt="0">
            {group.children.map((item, id) => (
              <Stack key={id} spacing="1" pt="12px">
                {item.title && (
                  <Stack spacing="4" direction="row" p="3 3 3 0">
                    {item.icon_link && (
                      <Image
                        alt="placeholder"
                        src={item.icon_link}
                        boxSize="6"
                        color="accent"
                      />
                    )}
                    <Text fontSize="lg" fontWeight="bold" color="#141414">
                      {item.title}
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
                      <Stack spacing="4" direction="row" pb="2">
                        {link.icon_link ? (
                          <Image
                            alt="placeholder"
                            src={link.icon_link}
                            boxSize="6"
                            color="accent"
                          />
                        ) : null}
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
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default NavAccordion;
