import { prisma } from "@/server/db/client";
import { createBoardRouter } from "../utils/createRouter";

export const userRouter = createBoardRouter().query("all", {
	resolve: async () => {
		const users = await prisma.user.findMany();
		return users;
	},
});
