// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { inviteRouter } from "./invite";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("auth.", authRouter)
	.merge("invite.", inviteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
