import { Box, Image } from "@chakra-ui/react";
import * as React from "react";

export const Logo = () => {
  return (
    <Box as="a" href="/">
      <Image src='https://static.apiseven.com/202108/1640917868852-37633689-5279-48d6-a13a-189054e4d15b.png' alt="Logo" width="130px" loading="lazy" />
    </Box>
  );
};
