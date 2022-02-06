import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Box } from "@chakra-ui/react";
const Home: NextPage = () => {
  return <Box></Box>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
