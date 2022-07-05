import React from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

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
	const { data: session } = useSession();
	return (
		<div className="navbar bg-base-100">
			<div className="flex-1">
				<Link href="/" passHref>
					<a className="btn btn-ghost normal-case text-xl">Realfagskjelleren</a>
				</Link>
			</div>
			<div className="flex-none gap-2">
				{!session && (
					<Link href="/api/auth/signin" passHref>
						<a
							onClick={(e) => {
								e.preventDefault();
								signIn();
							}}
						>
							Sign in
						</a>
					</Link>
				)}
				{session && (
					<div className="dropdown dropdown-end">
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							<div className="w-10 rounded-full">
								<Image
									width={40}
									height={40}
									layout={"fixed"}
									src={session.user?.image as string}
								/>
							</div>
						</label>
						<ul
							tabIndex={0}
							className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
						>
							<li>
								<a className="justify-between">
									Profile
									<span className="badge">New</span>
								</a>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<li>
								<Link href={"/api/auth/signout"}>
									<a
										onClick={(e) => {
											e.preventDefault();
											signOut();
										}}
									>
										Sign out
									</a>
								</Link>
							</li>
						</ul>
					</div>
				)}
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
