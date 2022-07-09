import { z } from "zod";
import { prisma } from "@/server/db/client";
import { createAuthRouter } from "../utils/createRouter";
import { TRPCError } from "@trpc/server";
import { Category, Good } from "@prisma/client";

export const goodRouter = createAuthRouter()
	.query("all", {
		resolve: async () => {
			const goods = await prisma.good.findMany();
			return goods;
		},
	})
	.query("allByCategory", {
		resolve: async () => {
			const goods = await prisma.good.findMany();

			const byCats: {
				BEER: Array<Good>;
				ALCOPOP: Array<Good>;
				CIDER: Array<Good>;
				WINE: Array<Good>;
				SPIRITS: Array<Good>;
				OTHER: Array<Good>;
				CONTAINER: Array<Good>;
			} = {
				BEER: [],
				ALCOPOP: [],
				CIDER: [],
				WINE: [],
				SPIRITS: [],
				OTHER: [],
				CONTAINER: [],
			};

			for (let i = 0; i < goods.length; i++) {
				byCats[goods[i]?.category as Category].push(goods[i] as Good);
			}

			return byCats;
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
