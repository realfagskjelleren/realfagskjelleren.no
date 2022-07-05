import React from "react";
import Footer from "./footer";
import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
	return (
		<>
			<Header />
			<main>{props.children}</main>
			<Footer />
		</>
	);
};

export default Layout;
