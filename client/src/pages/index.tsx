import type { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";

const Home: NextPage = () => {
	return <Layout></Layout>;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
