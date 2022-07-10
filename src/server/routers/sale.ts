import { prisma } from "@/server/db/client";
import { Sale } from "@prisma/client";
import { z } from "zod";
import { createBoardRouter } from "../utils/createRouter";

export const saleRouter = createBoardRouter().mutation("create", {
	input: z.object({
		responsibleId: z.string().cuid(),
		dateSold: z.date(),
		goodsSold: z.array(
			z.object({
				goodId: z.number().int().min(1),
				units: z.number().int().min(1),
				pricePerUnit: z.number().min(0.01),
			})
		),
	}),
	resolve: async ({ input }) => {
		const formatted: Array<Omit<Sale, "id">> = [];
		for (let i = 0; i < input.goodsSold.length; i++) {
			const good = input.goodsSold[i];
			formatted.push({
				goodId: good?.goodId as number,
				units: good?.units as number,
				pricePerUnit: good?.pricePerUnit as number,
				responsibleId: input.responsibleId,
				dateSold: input.dateSold as Date,
			});
		}
		await prisma.sale.createMany({ data: formatted });
		return;
	},
});
