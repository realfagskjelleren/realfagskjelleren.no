import { prisma } from "@/server/db/client";
import { Category, Purchase } from "@prisma/client";
import { z } from "zod";
import { createBoardRouter } from "../utils/createRouter";

export const purchaseRouter = createBoardRouter().mutation("create", {
	input: z.object({
		receiverId: z.string().cuid(),
		supplierId: z.number().int().min(1),
		dateReceived: z.date(),
		goodsPurchased: z.array(
			z.object({
				category: z.nativeEnum(Category),
				goodId: z.number().int().min(1),
				units: z.number().int().min(1),
				price: z.number().min(0.01),
			})
		),
	}),
	resolve: async ({ input }) => {
		const formatted: Array<Omit<Purchase, "id">> = [];
		for (let i = 0; i < input.goodsPurchased.length; i++) {
			const good = input.goodsPurchased[i];
			formatted.push({
				goodId: good?.goodId as number,
				units: good?.units as number,
				pricePerUnit: (good?.price as number) / (good?.units as number),
				receiverId: input.receiverId,
				supplierId: input.supplierId,
				dateRecieved: input.dateReceived as Date,
			});
		}
		await prisma.purchase.createMany({ data: formatted });
		return;
	},
});
