import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = (props) => {
	return (
		<>
			<main>{props.children}</main>
		</>
	);
};

export default Layout;
