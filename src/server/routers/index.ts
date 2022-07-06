import { createRouter } from "../utils/createRouter";
import superjson from "superjson";

import { authRouter } from "./auth";
import { inviteRouter } from "./invite";
import { goodRouter } from "./good";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("auth.", authRouter)
	.merge("invite.", inviteRouter)
	.merge("good.", goodRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
