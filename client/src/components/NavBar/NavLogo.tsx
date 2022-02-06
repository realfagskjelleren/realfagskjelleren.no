import React, { FC } from "react";
import { Box, Link, Image } from "@chakra-ui/react";

const NavLogo: FC = () => {
  return (
    <Box ml="2%" w={["8%", "8%", "3%"]}>
      <Link href="/">
        <Image alt="Home screen logo" src="/images/pidame.png" />
      </Link>
    </Box>
  );
};

export default NavLogo;
