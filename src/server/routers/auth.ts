import { createRouter } from "../utils/createRouter";

export const authRouter = createRouter().query("getSession", {
	resolve: ({ ctx }) => {
		return ctx.session;
	},
});
