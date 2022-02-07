import React, { FC } from "react";
import NavLogo from "./NavLogo";
import NavContainer from "./NavContainer";
import MenuToggle from "./MenuToggle";
import MenuLinks from "./MenuLinks";

export const NavBar: FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavContainer>
      <NavLogo />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavContainer>
  );
};
