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
		async signIn({ profile }) {
			// Already exists => invited before.
			const alreadyExists = await prisma.user.findUnique({
				where: { email: profile.email },
			});
			if (alreadyExists) return true;

			// Invited => allowed to sign in
			const isInvited = await prisma.invitedUser.findUnique({
				where: { email: profile.email },
			});
			if (isInvited) {
				// Remove invite since use will exist after sign in
				await prisma.invitedUser.delete({ where: { email: profile.email } });
				return true;
			}

			// If not existing or invited, no sign in
			return false;
		},
		async session({ session, user }) {
			if (session.user) {
				session.user.role = user.role;
			}
			return session;
		},
	},
};

export default NextAuth(authOptions);
