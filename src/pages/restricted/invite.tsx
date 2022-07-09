import { ErrorFormAlert, SuccessFormAlert } from "@/components/FormAlerts";
import { dateToString } from "@/utils/dateHelpers";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import React from "react";

const Invite: NextPage = () => {
	const invited = trpc.useQuery(["invite.all"]);
	const invite = trpc.useMutation(["invite.invite"]);
	const dataLoaded = invited.data && !invited.isLoading;

	return (
		<div className="min-h-screen flex flex-col justify-center">
			<div className="text-2xl flex flex-row justify-center">Invite User</div>
			<div className="p-2" />
			{invite.isSuccess && <SuccessFormAlert created={"invite"} />}
			<div className="p-2" />
			<Formik
				initialValues={{ email: "" }}
				validate={(values) => {
					if (!values.email.includes("@gmail.com")) {
						return { email: "Must be a gmail!" };
					}
				}}
				onSubmit={(values) => {
					invite.mutate({ email: values.email });
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
							<div className="p-2" />
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
						</Form>
					</div>
				)}
			</Formik>
			<div className="p-2" />
			{invite.error && invite.error.data && (
				<>
					{invite.error.data?.code === "BAD_REQUEST" ? (
						<ErrorFormAlert
							badReq="The server either recieved an empty, or you did not give a gmail."
							attempt="invite"
						/>
					) : (
						<ErrorFormAlert attempt="invite" />
					)}
				</>
			)}
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
