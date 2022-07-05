import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		async redirect({ url, baseUrl }) {
			// Redirect home after signout
			if (url.startsWith("http://localhost:3000/restricted/")) return baseUrl;
			// Redirect to dashboard on signin
			return `${baseUrl}${"/restricted/dashboard/"}`;
		},
	},
};

export default NextAuth(authOptions);
