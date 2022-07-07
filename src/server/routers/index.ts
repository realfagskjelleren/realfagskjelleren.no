import { createRouter } from "../utils/createRouter";
import superjson from "superjson";

import { authRouter } from "./auth";
import { inviteRouter } from "./invite";
import { goodRouter } from "./good";
import { userRouter } from "./user";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("auth.", authRouter)
	.merge("invite.", inviteRouter)
	.merge("user.", userRouter)
	.merge("good.", goodRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
