import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
	if (options.username.length <= 2) {
		return [
			{
				field: "username",
				message: "The username must have more than 2 characters",
			},
		];
	}

	if (!options.email.includes("@")) {
		return [
			{
				field: "email",
				message: "Invalid email",
			},
		];
	}

	if (options.username.includes("@")) {
		return [
			{
				field: "username",
				message: "Cannot include @",
			},
		];
	}

	if (options.password.length <= 2) {
		return [
			{
				field: "password",
				message: "The password must have more than 2 characters",
			},
		];
	}
	return null;
};
