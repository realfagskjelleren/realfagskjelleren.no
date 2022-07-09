import React from "react";
import Footer from "./footer";
import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
	return (
		<div>
			<Header />
			<main className="p-4">{props.children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
