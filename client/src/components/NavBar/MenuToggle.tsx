import React, { FC } from "react";
import { Box } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

type MenuToggleProps = {
  toggle: () => void;
  isOpen: boolean;
};

const MenuToggle: FC<MenuToggleProps> = ({
  toggle,
  isOpen,
}: MenuToggleProps) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <HamburgerIcon />}
    </Box>
  );
};

export default MenuToggle;
