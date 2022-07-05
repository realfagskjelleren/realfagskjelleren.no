import { z } from "zod";
import { prisma } from "@/server/db/client";
import { createRouter } from "./context";

export const inviteRouter = createRouter().mutation("invite", {
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
