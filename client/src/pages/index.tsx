import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return <Layout></Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
