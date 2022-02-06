import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const router = useRouter();
	const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
	const [{ data, fetching }] = useMeQuery({
		pause: isServer(),
	});
	let body = <Flex></Flex>;
	// data is loading
	if (fetching) {
	}
	//user not logged in
	else if (!data?.me) {
		body = (
			<Flex ml={"auto"} align="center">
				<NextLink href="/login">
					<Box mr={2}>Login</Box>
				</NextLink>
				<NextLink href="/register">
					<Box>Register</Box>
				</NextLink>
			</Flex>
		);
	}
	// user is logged in
	else {
		body = (
			<Flex ml={"auto"} align="center">
				<Box mr={2}>{data.me.username}</Box>
				<Button
					onClick={async () => {
						await logout();
						router.reload();
					}}
					isLoading={logoutFetching}
					variant="link"
				>
					Logout
				</Button>
			</Flex>
		);
	}
	return (
		<Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
			<Flex flex={1} m="auto" maxW={800} align="center">
				<NextLink href="/">
					<Heading>Realfagskjelleren</Heading>
				</NextLink>
				{body}
			</Flex>
		</Flex>
	);
};
