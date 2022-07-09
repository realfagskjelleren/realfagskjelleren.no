import { dateToString } from "@/utils/dateHelpers";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { ErrorMessage, Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Invite: NextPage = () => {
	const router = useRouter();
	const invited = trpc.useQuery(["invite.all"]);
	const invite = trpc.useMutation(["invite.invite"]);
	const dataLoaded = invited.data && !invited.isLoading;

	return (
		<div className="min-h-screen flex flex-col justify-center">
			<div className="text-2xl flex flex-row justify-center">Invite User</div>
			<div className="p-2" />
			<Formik
				initialValues={{ email: "" }}
				validate={(values) => {
					if (!values.email.includes("@gmail.com")) {
						return { email: "Must be a gmail!" };
					}
				}}
				onSubmit={(values, { setErrors }) => {
					invite.mutate({ email: values.email });
					if (!invite.isSuccess && invite.isError) {
						setErrors({ email: invite.error.message });
					} else if (invite.isSuccess) {
						router.push("/restricted/dashboard");
					}
				}}
			>
				{() => (
					<div className="flex flex-col items-center">
						<Form className="w-full max-w-xs form-control">
							<label className="label label-text">Gmail</label>
							<Field
								className="input w-full max-w-xs"
								type="email"
								name="email"
								placeholder="Gmail"
							/>
							<ErrorMessage
								name="email"
								render={(msg) => (
									<>
										<div className="p-2" />
										<div className="alert alert-error shadow-lg">
											<div>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="stroke-current flex-shrink-0 h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
												<span>Error! {msg}</span>
											</div>
										</div>
									</>
								)}
							/>
							<div className="p-2" />
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
						</Form>
					</div>
				)}
			</Formik>
			<div className="p-5" />
			{dataLoaded && <InvitedUsers users={invited.data} />}
		</div>
	);
};

export default Invite;

const InvitedUsers: React.FC<{ users: InferQueryOutput<"invite.all"> }> = (
	props
) => {
	return (
		<div className="overflow-x-auto w-full flex flex-col items-center">
			<div className="text-2xl flex flex-row justify-center">Invited Users</div>
			<div className="p-2" />
			<table className="table w-3/4">
				<thead>
					<tr>
						<th></th>
						<th>Email</th>
						<th>Date invited</th>
					</tr>
				</thead>
				<tbody>
					{props.users.map((user, index) => (
						<tr key={index}>
							<td>{index + 1}</td>
							<td>{user.email}</td>
							<td>{dateToString(user.invitedAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
