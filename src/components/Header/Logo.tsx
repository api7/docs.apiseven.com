import { Image } from '@chakra-ui/react';
import * as React from 'react';

const Logo = () => {
  return (
    <Image
      src="https://static.apiseven.com/2022/10/02/63398bceeeac7.webp?imageMogr2/thumbnail/240x"
      alt="API7.ai Logo"
      height={40}
      width={120}
      display='block'
      style={{
        width: 120,
        height: 40,
      }}
    />
  );
};

export default Logo;
