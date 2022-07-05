import { ErrorMessage, Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import React from "react";

const Invite: NextPage = () => {
	return (
		<div className="h-screen flex flex-col justify-center">
			<div className="text-2xl flex flex-row justify-center">Invite User</div>
			<div className="p-2" />
			<Formik
				initialValues={{ email: "" }}
				onSubmit={(values) => {
					console.log(values);
				}}
			>
				{() => (
					<div className="flex flex-col items-center">
						<Form className="w-full max-w-xs form-control">
							<label className="label label-text">Email</label>
							<Field
								className="input w-full max-w-xs"
								type="email"
								name="email"
								placeholder="Email"
							/>
							<ErrorMessage
								name="email"
								render={(msg) => (
									<>
										<div className="p-2" />
										<div>{msg}</div>
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
		</div>
	);
};

export default Invite;
