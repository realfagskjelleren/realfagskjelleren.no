import { prisma } from "@/server/db/client";
import { Category, Good, Purchase, Supplier, User } from "@prisma/client";
import { z } from "zod";
import { createBoardRouter } from "../utils/createRouter";

export const purchaseRouter = createBoardRouter()
	.query("all", {
		resolve: async () => {
			const purchases = await prisma.purchase.findMany({
				orderBy: { dateReceived: "desc" },
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
		receiver: string;
		supplier: string;
		dateReceived: Date;
		totalValue: number;
		purchase: Array<
			Pick<Purchase, "units"> & Omit<Good, "id"> & { value: number }
		>;
	} = {
		receiver: "",
		supplier: "",
		dateReceived: new Date(),
		totalValue: 0,
		purchase: [],
	};

	const reports: Array<typeof purchaseContext> = [];

	for (let i = 0; i < purchases.length; i++) {
		const p = purchases[i];
		purchaseContext.purchase.push({
			name: p?.good.name as string,
			brand: p?.good.brand as string,
			volume: p?.good.volume as number,
			category: p?.good.category as Category,
			units: p?.units as number,
			value: (p?.units as number) * (p?.pricePerUnit as number),
		});

		if (!purchases[i + 1]) {
			purchaseContext.receiver = p?.receiver.name as string;
			purchaseContext.supplier = p?.supplier.name as string;
			purchaseContext.dateReceived = new Date(p?.dateReceived as Date);
			purchaseContext.totalValue = purchaseContext.purchase.reduce(
				(partialSum, pur) => partialSum + pur.value,
				0
			);

			reports.push(purchaseContext);
		} else if (
			purchases[i + 1]?.dateReceived.valueOf() !== p?.dateReceived.valueOf()
		) {
			purchaseContext.receiver = p?.receiver.name as string;
			purchaseContext.supplier = p?.supplier.name as string;
			purchaseContext.dateReceived = new Date(p?.dateReceived as Date);
			purchaseContext.totalValue = purchaseContext.purchase.reduce(
				(partialSum, pur) => partialSum + pur.value,
				0
			);
			reports.push(purchaseContext);

			purchaseContext = {
				receiver: "",
				supplier: "",
				dateReceived: new Date(),
				totalValue: 0,
				purchase: [],
			};
		}
	}
	return reports;
};
