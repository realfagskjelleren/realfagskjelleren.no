import React, { FC } from "react";
import { Flex } from "@chakra-ui/react";

const NavContainer: FC = ({ children }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={2}
      bg="rfk.orange"
      color="white"
    >
      {children}
    </Flex>
  );
};

export default NavContainer;
