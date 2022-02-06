import React, { FC } from "react";
import { Box, Stack } from "@chakra-ui/react";
import NavLink from "./NavLink";
import NavButton from "./NavButton";
import { useRouter } from "next/router";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";

type MenuLinksProps = {
  isOpen: boolean;
};

export enum MenuTypes {
  LOGIN = "/login",
  REGISTER = "/register",
}

const MenuLinks: FC<MenuLinksProps> = ({ isOpen }: MenuLinksProps) => {
  const router = useRouter();

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        {data?.me ? (
          <>
            <NavButton
              name="Logout"
              func={async () => {
                await logout();
                router.reload();
              }}
              isLoading={logoutFetching}
            />
          </>
        ) : (
          <>
            <NavLink name="Login" url={MenuTypes.LOGIN} />
            <NavLink name="Register" url={MenuTypes.REGISTER} />
          </>
        )}
      </Stack>
    </Box>
  );
};

export default MenuLinks;
