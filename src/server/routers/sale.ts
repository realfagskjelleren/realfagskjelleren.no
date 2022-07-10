import { prisma } from "@/server/db/client";
import { Category, Good, Sale, User } from "@prisma/client";
import { z } from "zod";
import { createBoardRouter } from "../utils/createRouter";

export const saleRouter = createBoardRouter()
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

			const sales = await prisma.sale.findMany({
				where: { dateSold: { gte: input.start, lte: end } },
				orderBy: { dateSold: "asc" },
				include: { good: true, responsible: true },
			});

			const reports = saleReports(sales);

			return reports;
		},
	})
	.mutation("create", {
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
	})
	.mutation("update", {
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
			await prisma.sale.deleteMany({
				where: {
					dateSold: input.dateSold,
				},
			});
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
	})
	.mutation("delete", {
		input: z.object({
			dateSold: z.date(),
		}),
		resolve: async ({ input }) => {
			await prisma.sale.deleteMany({
				where: {
					dateSold: input.dateSold,
				},
			});
			return;
		},
	});

const saleReports = (
	sales: Array<
		Sale & {
			good: Good;
			responsible: User;
		}
	>
) => {
	let saleContext: {
		responsibleId: string;
		responsible: string;
		responsibleImage?: string;
		dateSold: Date;
		totalValue: number;
		sale: Array<
			Pick<Sale, "units" | "pricePerUnit"> & Good & { value: number }
		>;
	} = {
		responsibleId: "",
		responsible: "",
		dateSold: new Date(),
		totalValue: 0,
		sale: [],
	};

	const reports: Array<typeof saleContext> = [];

	for (let i = 0; i < sales.length; i++) {
		const s = sales[i];
		saleContext.sale.push({
			id: s?.goodId as number,
			name: s?.good.name as string,
			brand: s?.good.brand as string,
			volume: s?.good.volume as number,
			category: s?.good.category as Category,
			units: s?.units as number,
			pricePerUnit: s?.pricePerUnit as number,
			value: (s?.units as number) * (s?.pricePerUnit as number),
		});

		if (!sales[i + 1]) {
			saleContext.responsibleId = s?.responsible.id as string;
			saleContext.responsible = s?.responsible.name as string;
			saleContext.dateSold = new Date(s?.dateSold as Date);
			saleContext.totalValue = saleContext.sale.reduce(
				(partialSum, sal) => partialSum + sal.value,
				0
			);
			if (s?.responsible.image) {
				saleContext.responsibleImage = s.responsible.image;
			}

			reports.push(saleContext);
		} else if (sales[i + 1]?.dateSold.valueOf() !== s?.dateSold.valueOf()) {
			saleContext.responsibleId = s?.responsible.id as string;
			saleContext.responsible = s?.responsible.name as string;
			saleContext.dateSold = new Date(s?.dateSold as Date);
			saleContext.totalValue = saleContext.sale.reduce(
				(partialSum, sal) => partialSum + sal.value,
				0
			);
			if (s?.responsible.image) {
				saleContext.responsibleImage = s.responsible.image;
			}

			reports.push(saleContext);

			saleContext = {
				responsibleId: "",
				responsible: "",
				dateSold: new Date(),
				totalValue: 0,
				sale: [],
			};
		}
	}
	return reports;
};
