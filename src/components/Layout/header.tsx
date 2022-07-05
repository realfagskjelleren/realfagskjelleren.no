import React from "react";
import Head from "next/head";

const SiteHead = () => {
	return (
		<Head>
			<title>Realfagskjelleren</title>
			<meta name="description" content="Realfagskjelleren" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
};

const NavBar = () => {
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<a className="btn btn-ghost normal-case text-xl">Realfagskjelleren</a>
			</div>
		</div>
	);
};

const Header: React.FC = () => {
	return (
		<div>
			<SiteHead />
			<NavBar />
		</div>
	);
};

export default Header;
