import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		user: User & { role: Role };
	}

	interface Session {
		user: User & DefaultSession["user"];
	}
}
