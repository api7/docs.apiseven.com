import * as React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import Link from '@docusaurus/Link';

const EnterpriseLabel: React.FC = () => {
  return (
    <Link href='https://api7.ai/enterprise' style={{ textDecorationColor: '#ffffff', display: 'inline-end', alignItems: 'flex-start' }}>
      <Tooltip borderRadius='0.375rem' hasArrow label='Available with Enterprise Edition' placement='bottom-start' bg='#ebedf0' color="#000000">
        <Button
          py='4px'
          px='8px'
          height='auto'
          lineHeight='1.1'
          fontWeight='700'
          fontSize='12px'
          background='#ebedf0'
          color="#000000"
          border="none"
          paddingBottom="5px"
          marginBottom="15px"
        >
          Enterprise
        </Button>
      </Tooltip>
    </Link >
  )
};

export default EnterpriseLabel;
