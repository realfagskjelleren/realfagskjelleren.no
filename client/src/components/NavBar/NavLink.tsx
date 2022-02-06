import React, { FC } from "react";
import { Text, Link } from "@chakra-ui/react";
import { MenuTypes } from "./MenuLinks";
import NextLink from "next/link";
import { useRouter } from "next/router";

type NavLinkProps = {
  name: string;
  url: MenuTypes;
  isRight?: boolean;
};

const NavLink: FC<NavLinkProps> = ({ name, url }: NavLinkProps) => {
  const router = useRouter();
  const isCurrent = router.route == url;

  return (
    <NextLink href={url} passHref>
      <Link _hover={{ textDecoration: "none" }}>
        <Text
          fontSize="3xl"
          display="block"
          textDecoration={isCurrent ? "underline" : "none"}
          textDecorationColor="black"
          textUnderlineOffset="0.2em"
          color="black"
          mr={5}
        >
          {name}
        </Text>
      </Link>
    </NextLink>
  );
};

export default NavLink;
