import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";

// Express.Session depracted from ordinary library
declare module "express-session" {
	interface Session {
		userId: number;
	}
}

export type MyContext = {
	req: Request & { session: Session };
	redis: Redis;
	res: Response;
	userLoader: ReturnType<typeof createUserLoader>;
};
