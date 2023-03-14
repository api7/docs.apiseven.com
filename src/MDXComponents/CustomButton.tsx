
import * as React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import Link from '@docusaurus/Link';

type ButtonProps = {
  text: string;
  link: string;
  isDisabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ text, link, isDisabled = false }) => {
  return (
    <Link href={link} style={{ textDecorationColor: '#ffffff' }}>
      <Tooltip isDisabled={!isDisabled} borderRadius='0.375rem' hasArrow label='Coming Soon' placement='bottom' bg='#3166DD'>
        <Button
          py='5px'
          px='10px'
          height='auto'
          lineHeight='1.4'
          _hover={{ bgColor: '#3166DD', color: '#ffffff' }}
          _active={{ bgColor: '#3166DD' }}
          fontWeight='500'
          background='#ffffff'
          color="#3166DD"
          border="1px solid #3166DD"
          isDisabled={isDisabled}
        >
          {text}
        </Button>
      </Tooltip>
    </Link>
  )
};

export default CustomButton;
