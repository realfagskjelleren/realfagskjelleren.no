import { createRouter } from "../utils/createRouter";
import superjson from "superjson";

import { authRouter } from "./auth";
import { inviteRouter } from "./invite";
import { goodRouter } from "./good";
import { userRouter } from "./user";
import { supplierRouter } from "./supplier";
import { purchaseRouter } from "./purchase";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("auth.", authRouter)
	.merge("invite.", inviteRouter)
	.merge("user.", userRouter)
	.merge("good.", goodRouter)
	.merge("supplier.", supplierRouter)
	.merge("purchase.", purchaseRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
