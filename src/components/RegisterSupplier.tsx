import { trpc } from "@/utils/trpc";
import { Field, Form, Formik } from "formik";
import React from "react";
import { ErrorFormAlert, SuccessFormAlert } from "./FormAlerts";

const RegisterSupplier: React.FC<{ id: string }> = (props) => {
	const utils = trpc.useContext();
	const supplier = trpc.useMutation("supplier.create", {
		onSuccess: () => {
			utils.invalidateQueries("supplier.all");
		},
	});
	return (
		<>
			<input type="checkbox" id={props.id} className="modal-toggle" />
			<div className="modal">
				<div className="modal-box w-11/12 max-w-5xl">
					<label
						htmlFor={props.id}
						className="btn btn-sm btn-circle absolute right-2 top-2"
					>
						✕
					</label>
					<div className="text-2xl flex flex-row justify-center">
						Register supplier
					</div>
					<div className="p-2" />
					{supplier.isSuccess && <SuccessFormAlert created="supplier" />}
					<div className="p-2" />
					<Formik
						initialValues={{ name: "", orgNum: "" }}
						onSubmit={(values) => {
							supplier.mutate({
								...values,
								orgNum: parseInt(values.orgNum),
							});
						}}
					>
						{() => (
							<Form className="w-full">
								<div className="flex flex-row justify-evenly">
									<div>
										<label className="label label-text col-span-2">Name</label>
										<Field
											className="input"
											type="text"
											name="name"
											placeholder="Name"
										/>
									</div>
									<div>
										<label className="label label-text col-span-2">
											Organization number
										</label>
										<Field
											className="input"
											type="number"
											name="orgNum"
											placeholder="Organization number"
										/>
									</div>
								</div>
								<div className="p-2" />
								<div className="flex flex-row justify-center">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
							</Form>
						)}
					</Formik>
					<div className="p-2" />
					{supplier.error && supplier.error.data && (
						<>
							{supplier.error.data?.code === "BAD_REQUEST" ? (
								<ErrorFormAlert
									badReq="The server either received an illegal name or the organization number is not 9 length."
									attempt="supplier"
								/>
							) : (
								<ErrorFormAlert attempt="supplier" />
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default RegisterSupplier;
