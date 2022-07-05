import React from "react";
import Header from "./header";

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
	return (
		<>
			<Header />
			<main>{props.children}</main>
		</>
	);
};

export default Layout;
