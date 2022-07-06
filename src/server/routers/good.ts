import { z } from "zod";
import { prisma } from "@/server/db/client";
import { createAuthRouter } from "../utils/createRouter";
import { TRPCError } from "@trpc/server";
import { Category } from "@prisma/client";

export const goodRouter = createAuthRouter()
	.query("all", {
		resolve: async () => {
			const invitedUsers = await prisma.good.findMany();
			return invitedUsers;
		},
	})
	// Any mutation or query after will be BOARD auth only
	.middleware(({ ctx, next }) => {
		if (!ctx.session || ctx.session.user.role !== "BOARD") {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next();
	})
	.mutation("createMany", {
		input: z.array(
			z.object({
				name: z.string().min(1),
				brand: z.string().min(1),
				category: z.nativeEnum(Category),
				volume: z.number().positive(),
			})
		),
		resolve: async ({ input }) => {
			const number = await prisma.good.createMany({ data: input });
			return { created: number.count };
		},
	});
