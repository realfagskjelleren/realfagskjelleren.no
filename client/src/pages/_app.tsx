import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";

const theme = extendTheme({
	colors: {
		rfk: {
			orange: "#FD8200",
		},
	},
	settings: {
		initalColorMode: "light",
		useSystemColorMode: false,
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
}

export default withUrqlClient(createUrqlClient, { ssr: false })(MyApp);
