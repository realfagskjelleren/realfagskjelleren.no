import { prisma } from "@/server/db/client";
import { z } from "zod";
import { createBoardRouter } from "../utils/createRouter";

export const supplierRouter = createBoardRouter()
	.query("all", {
		resolve: async () => {
			const supplier = await prisma.supplier.findMany();
			return supplier;
		},
	})
	.mutation("create", {
		input: z.object({ name: z.string(), orgNum: z.number().int() }),
		resolve: async ({ input }) => {
			const supplier = await prisma.supplier.create({
				data: { name: input.name, orgNum: input.orgNum },
			});
			return supplier;
		},
	});
