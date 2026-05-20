import { betterAuth } from "better-auth";
import { env } from "~/env";

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
});

export type Session = typeof auth.$Infer.Session;
