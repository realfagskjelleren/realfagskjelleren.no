import { prisma } from "@/server/db/client";
import { Category, Good, Purchase, Supplier, User } from "@prisma/client";
import { z } from "zod";
import { createBoardRouter } from "../utils/createRouter";

export const purchaseRouter = createBoardRouter()
	.query("allInPeriod", {
		input: z.object({
			start: z.date(),
			end: z.date(),
		}),
		resolve: async ({ input }) => {
			const end = new Date(
				Date.UTC(
					input.end.getUTCFullYear(),
					input.end.getUTCMonth(),
					input.end.getUTCDate(),
					23
				)
			);

			const purchases = await prisma.purchase.findMany({
				where: { dateReceived: { gte: input.start, lte: end } },
				orderBy: { dateReceived: "asc" },
				include: { good: true, supplier: true, receiver: true },
			});

			const reports = purchaseReports(purchases);

			return reports;
		},
	})
	.mutation("create", {
		input: z.object({
			receiverId: z.string().cuid(),
			supplierId: z.number().int().min(1),
			dateReceived: z.date(),
			goodsPurchased: z.array(
				z.object({
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
					dateReceived: input.dateReceived as Date,
				});
			}
			await prisma.purchase.createMany({ data: formatted });
			return;
		},
	})
	.mutation("update", {
		input: z.object({
			receiverId: z.string().cuid(),
			supplierId: z.number().int().min(1),
			dateReceived: z.date(),
			goodsPurchased: z.array(
				z.object({
					goodId: z.number().int().min(1),
					units: z.number().int().min(1),
					price: z.number().min(0.01),
				})
			),
		}),
		resolve: async ({ input }) => {
			const formatted: Array<Omit<Purchase, "id">> = [];
			await prisma.purchase.deleteMany({
				where: {
					supplierId: input.supplierId,
					dateReceived: input.dateReceived,
				},
			});
			for (let i = 0; i < input.goodsPurchased.length; i++) {
				const good = input.goodsPurchased[i];
				formatted.push({
					goodId: good?.goodId as number,
					units: good?.units as number,
					pricePerUnit: (good?.price as number) / (good?.units as number),
					receiverId: input.receiverId,
					supplierId: input.supplierId,
					dateReceived: input.dateReceived as Date,
				});
			}
			await prisma.purchase.createMany({ data: formatted });
			return;
		},
	});

const purchaseReports = (
	purchases: Array<
		Purchase & {
			good: Good;
			supplier: Supplier;
			receiver: User;
		}
	>
) => {
	let purchaseContext: {
		receiverId: string;
		receiver: string;
		receiverImage?: string;
		supplierId: number;
		supplier: string;
		dateReceived: Date;
		totalValue: number;
		purchase: Array<Pick<Purchase, "units"> & Good & { value: number }>;
	} = {
		receiverId: "",
		receiver: "",
		supplierId: 0,
		supplier: "",
		dateReceived: new Date(),
		totalValue: 0,
		purchase: [],
	};

	const reports: Array<typeof purchaseContext> = [];

	for (let i = 0; i < purchases.length; i++) {
		const p = purchases[i];
		purchaseContext.purchase.push({
			id: p?.goodId as number,
			name: p?.good.name as string,
			brand: p?.good.brand as string,
			volume: p?.good.volume as number,
			category: p?.good.category as Category,
			units: p?.units as number,
			value: (p?.units as number) * (p?.pricePerUnit as number),
		});

		if (!purchases[i + 1]) {
			purchaseContext.receiverId = p?.receiver.id as string;
			purchaseContext.receiver = p?.receiver.name as string;
			purchaseContext.supplierId = p?.supplier.id as number;
			purchaseContext.supplier = p?.supplier.name as string;
			purchaseContext.dateReceived = new Date(p?.dateReceived as Date);
			purchaseContext.totalValue = purchaseContext.purchase.reduce(
				(partialSum, pur) => partialSum + pur.value,
				0
			);
			if (p?.receiver.image) {
				purchaseContext.receiverImage = p.receiver.image;
			}

			reports.push(purchaseContext);
		} else if (
			purchases[i + 1]?.dateReceived.valueOf() !== p?.dateReceived.valueOf()
		) {
			purchaseContext.receiverId = p?.receiver.id as string;
			purchaseContext.receiver = p?.receiver.name as string;
			purchaseContext.supplierId = p?.supplier.id as number;
			purchaseContext.supplier = p?.supplier.name as string;
			purchaseContext.dateReceived = new Date(p?.dateReceived as Date);
			purchaseContext.totalValue = purchaseContext.purchase.reduce(
				(partialSum, pur) => partialSum + pur.value,
				0
			);
			if (p?.receiver.image) {
				purchaseContext.receiverImage = p.receiver.image;
			}

			reports.push(purchaseContext);

			purchaseContext = {
				receiverId: "",
				receiver: "",
				supplierId: 0,
				supplier: "",
				dateReceived: new Date(),
				totalValue: 0,
				purchase: [],
			};
		}
	}
	return reports;
};
