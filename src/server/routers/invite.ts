import { z } from "zod";
import { prisma } from "@/server/db/client";
import { createBoardRouter } from "../utils/createRouter";

export const inviteRouter = createBoardRouter()
	.query("all", {
		resolve: async () => {
			const invitedUsers = await prisma.invitedUser.findMany();
			return invitedUsers;
		},
	})
	.mutation("invite", {
		input: z.object({
			email: z.string(),
		}),
		resolve: async ({ input }) => {
			const invitedUser = await prisma.invitedUser.create({
				data: { email: input.email },
			});
			return invitedUser;
		},
	});
