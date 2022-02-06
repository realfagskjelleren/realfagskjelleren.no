import React, { FC } from "react";
import { Button } from "@chakra-ui/react";

type NavButtonProps = {
  name: string;
  func: Function;
  isLoading: boolean;
};

const NavButton: FC<NavButtonProps> = ({
  name,
  func,
  isLoading,
}: NavButtonProps) => {
  return (
    <Button
      color="black"
      size="lg"
      onClick={() => func()}
      isLoading={isLoading}
    >
      {name}
    </Button>
  );
};

export default NavButton;
