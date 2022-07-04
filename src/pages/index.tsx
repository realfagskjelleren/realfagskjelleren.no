import type { NextPage } from "next";
import React from "react";
import Head from "next/head";

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Realfagskjelleren</title>
				<meta name="description" content="Realfagskjelleren" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="text-2xl flex flex-row justify-center">
				Realfagskjelleren
			</div>
		</>
	);
};

export default Home;
