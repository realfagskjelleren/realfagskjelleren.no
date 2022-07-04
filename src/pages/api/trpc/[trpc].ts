// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers";
import { createContext } from "../../../server/routers/context";

// export API handler
export default createNextApiHandler({
	router: appRouter,
	createContext: createContext,
});
