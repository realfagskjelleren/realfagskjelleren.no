import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";

export const createContext = async (
	opts?: trpcNext.CreateNextContextOptions
) => {
	const req = opts?.req;
	const res = opts?.res;

	const session =
		req && res && (await getServerSession(req, res, nextAuthOptions));

	return {
		req,
		res,
		session,
		prisma,
	};
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

export const createAuthRouter = () =>
	createRouter().middleware(({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `user` is non-nullable downsteam
				user: ctx.session.user,
			},
		});
	});

export const createBoardRouter = () =>
	createRouter().middleware(({ ctx, next }) => {
		if (!ctx.session || ctx.session.user.role !== "BOARD") {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				...ctx,
				// infers that `user` is non-nullable downsteam
				user: ctx.session.user,
			},
		});
	});
