import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  IconButton,
  Flex,
  Stack,
  Text,
  Link,
  Input,
  Image,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useCookies } from 'react-cookie';

import { links } from './_data';

const CustomFooter = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm();
  const [ cookies ] = useCookies(['hubspotutk']);

  const isValidEmail = (email: string) =>
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );

  // NOTE: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
  function onSubmit(values: any) {
    return new Promise((resolve, reject) => {
      const { email } = values as { email: string };
      resolve(true);

      const data = {
        fields: [
          {
            objectTypeId: '0-1',
            name: 'email',
            value: email,
          },
        ],
        context: {
          pageUri: window.location.href,
          pageName: window.document.title,
        },
      } as Record<string, any>;

      const hubspotUserCookie = cookies.hubspotutk;
      if (hubspotUserCookie) {
        data.context.hutk = hubspotUserCookie;
      }

      fetch(
        'https://api.hsforms.com/submissions/v3/integration/submit/21535844/01e89506-b181-46c2-bcc6-9d474b39c287',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error('Footer_Subscription_Failed', data);
          } else {
            return res.json();
          }
        })
        .then((data) => {
          resolve(data);
        });
    });
  };

  return (
    <Box bgColor="#fff">
      <Divider borderColor='#ccc' opacity='1' />
      <Container maxW="6xl" as="footer" role="contentinfo" paddingLeft='16px' paddingRight='20px'>
        <Stack
          direction={{ base: 'column', md: 'column', lg: 'column', xl: 'row' }}
          py={{ base: '30px', lg: '80px' }}
          pb={{ lg: '40px' }}
          spacing="0"
          justifyContent="space-between"
        >
          <Stack
            maxW={{ base: 'full', md: 'full', lg: 'full', xl: '420px' }}
            spacing={{ base: '6', md: '8' }}
            align="start"
          >
            <Image
              src="https://static.apiseven.com/2022/10/02/63398bceeeac7.webp?imageMogr2/thumbnail/240x"
              alt="API7.ai Logo"
              height={40}
              width={120}
              style={{
                width: 120,
                height: 40,
              }}
            />
            <Text
              color="#1C1E21"
              fontWeight="400"
              fontStyle="normal"
            >
              API Management for Modern Architectures with Edge, API Gateway, Kubernetes, and Service Mesh.
            </Text>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <FormControl isInvalid={Boolean(errors.email)}>
                <Stack
                  spacing={{ base: '0', lg: '2' }}
                  direction={{
                    sm: 'row',
                    base: 'column',
                    md: 'column',
                    lg: 'column',
                    xl: 'column',
                  }}
                  flexWrap={{ base: 'wrap', lg: 'nowrap' }}
                  w={'full'}
                >
                  <Input
                    flexShrink={1}
                    minW="300px"
                    placeholder="Work Email"
                    id="subscriber-email"
                    type="email"
                    required
                    marginBottom="4"
                    borderRadius="3px"
                    _focus={{}} // overwirte black border
                    {...register('email', {
                      required: 'Please enter your emal',
                      validate: isValidEmail,
                    })}
                  />
                  <Button
                    w={{ base: 'full', lg: 'auto' }}
                    bg="accent"
                    color="#FFFFFF"
                    type="submit"
                    flexShrink={0}
                    fontWeight="500"
                    borderRadius="4px"
                    fontSize="16px"
                    background="linear-gradient(273.1deg, #153FFF 1.57%, #4790FF 118.62%)"
                    _hover={{ bgColor: '#153FFF' }}
                    _active={{ bgColor: '#153FFF' }}
                    isLoading={isSubmitting}
                  >
                    Subscribe to Newsletter
                  </Button>
                </Stack>
                <Stack>
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={() => {
                      if (errors.email) {
                        return (
                          <FormErrorMessage>
                            Please check your email
                          </FormErrorMessage>
                        );
                      }
                      return null;
                    }}
                  />
                  {isSubmitSuccessful && (
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#153fff',
                        marginTop: '12px',
                      }}
                    >
                      Thank you for submission!
                    </span>
                  )}
                </Stack>
              </FormControl>
            </form>
          </Stack>
          <Stack>
            <Flex
              gap="0"
              flexDir={{
                base: 'column',
                md: 'column',
                lg: 'column',
                xl: 'row',
              }}
              width="full"
              justifyContent="flex-end"
            >
              {links.map((group, idx) => (
                <Box
                  key={idx}
                  pl={{ base: '0', xl: '10' }}
                  fontSize={{ base: '', md: '', lg: 'sm' }}
                  pt={{ base: '9', xl: '0' }}
                  color="#1C1E21"
                >
                  <Stack>
                    <Text
                      fontSize="16px"
                      fontWeight="600"
                      fontStyle="18px"
                      mb="16px"
                    >
                      {group.title}
                    </Text>
                    <Stack shouldWrapChildren mt="0px">
                      {group.links.map((link, idx) => (
                        <Button
                          key={idx}
                          mb={{ base: '12px', lg: '16px' }}
                          as="a"
                          variant="link"
                          href={link.href}
                          target='_blank'
                          fontWeight="400"
                          fontSize="16px"
                          color="#1C1E21"
                          lineHeight="18px"
                        >
                          {link.label}
                        </Button>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Flex>
          </Stack>
        </Stack>
        <Divider />
        <Stack
          py="8"
          justify="space-between"
          direction={{ base: 'column-reverse', md: 'row' }}
          align='center'
        >
          <Text
            fontSize={{ base: '8px', md: '12px' }}
            color="#1C1E21"
            maxWidth={600}
          >
            Copyright © HONG KONG APISEVEN LIMITED. 2019 –{' '}
            {new Date().getFullYear()}. Apache, Apache APISIX, and APISIX
            associated open source project names are trademarks of the{' '}
            <Link href="https://www.apache.org/" color="#3C4EFF" target='_blank'>
              Apache Software Foundation
            </Link>
          </Text>
          <ButtonGroup variant="ghost">
            <IconButton
              as="a"
              href="https://www.linkedin.com/company/api7-ai/"
              target="_blank"
              aria-label="LinkedIn"
              icon={<FaLinkedin fontSize="1.25rem" />}
              color="#1C1E21"
              _hover={{ color: 'black' }}
            />
            <IconButton
              as="a"
              href="https://github.com/api7"
              target="_blank"
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
              color="#1C1E21"
              _hover={{ color: 'black' }}
            />
            <IconButton
              as="a"
              href="https://twitter.com/api7ai"
              target="_blank"
              aria-label="Twitter"
              icon={<FaTwitter fontSize="1.25rem" />}
              _hover={{ color: 'black' }}
              color="#1C1E21"
            />
          </ButtonGroup>
        </Stack>
      </Container>
    </Box>
  );
};

export default CustomFooter;
